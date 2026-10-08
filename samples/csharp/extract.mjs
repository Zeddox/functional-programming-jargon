// Extracts every ```csharp block from readme.md into a compilable C# file per
// section, so that the readme stays the single source of truth for samples.
//
// Conventions for readme snippets:
//  * All blocks within a section are concatenated (in order) and must form
//    valid C# together.
//  * Type declarations (record/class/interface/struct/enum/delegate) at column
//    0 are hoisted to namespace level; everything else becomes the body of the
//    section's Run() method, so statements and local functions work as-is.
//  * `using` lines at column 0 are hoisted to the top of the file.
//  * A statement ending in `// => expected` is checked at runtime: its value's
//    rendering is compared with `expected` and mismatches are reported.
//    `var x = ...; // => expected` checks `x`.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const readmePath = path.join(here, '../../readme.md')
const outDir = path.join(here, 'Generated')
const lines = fs.readFileSync(readmePath, 'utf8').split('\n')

const DECL = /^(\[.*\]\s*)?((public|internal|file|static|abstract|sealed|partial|readonly|ref)\s+)*(record|class|interface|struct|enum|delegate)\b/
const CHECK = /^(\s*)(?:var\s+(\w+)\s*=\s*)?(.+?);\s*\/\/\s*=>\s*(.+?)\s*$/

const pascal = s => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
  .map(w => w[0].toUpperCase() + w.slice(1)).join('')

// 1. Collect sections (## / ###) after the TOC and their csharp blocks.
const sections = []
let current = null
let inToc = true
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (line.includes('<!-- /RM -->')) { inToc = false; continue }
  if (inToc) continue
  const h = /^#{2,3}\s+(.+)$/.exec(line)
  if (h) { current = { title: h[1].trim(), blocks: [] }; sections.push(current); continue }
  if (current && /^```(csharp|cs)\s*$/.test(line)) {
    const start = i + 1
    let end = start
    while (end < lines.length && !/^```\s*$/.test(lines[end])) end++
    current.blocks.push({ start: start + 1, body: lines.slice(start, end) }) // 1-based line no.
    i = end
  }
}

// Strips strings/chars/comments so brace counting is not fooled by them.
const code = l => l.replace(/\/\/.*$/, '').replace(/@?\$?"(?:[^"\\]|\\.)*"/g, '""').replace(/'(?:[^'\\]|\\.)'/g, "''")
const depthDelta = l => { const c = code(l); return (c.match(/\{/g) || []).length - (c.match(/\}/g) || []).length }

// Rewrites the statement that ends the `stmts` list so its value is checked
// against `expected`. A `var x = ...` statement checks `x`; any other
// statement is also compiled verbatim (in dead code) so that a snippet like
// `1 + 1; // => 2`, which is not a valid C# statement, fails the build.
function checkLastStatement (stmts, expected, ln) {
  let end = stmts.length - 1
  while (end >= 0 && stmts[end].trim() === '') end--
  let start = end
  const ends = l => /[;{}]\s*(\/\/.*)?$/.test(l) || /^\s*(\/\/|#line)/.test(l) || l.trim() === ''
  while (start > 0 && !ends(stmts[start - 1])) start--
  const text = stmts.slice(start, end + 1).join('\n').replace(/;\s*(\/\/.*)?$/, '')
  const lit = JSON.stringify(expected)
  const v = /^\s*var\s+(\w+)\s*=/.exec(text)
  stmts.splice(start, end - start + 1, v
    ? `${text}; Jargon.Check.That(${v[1]}, ${lit}, ${ln});`
    : `if (false) { ${text.trim()}; } Jargon.Check.That(${text.trim()}, ${lit}, ${ln});`)
}

// 2. Split each section into usings / statements / declarations, keeping
//    #line directives so compiler errors point back at readme.md.
const rel = path.relative(outDir, readmePath).replaceAll('\\', '/')
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const registry = []
for (const s of sections) {
  if (s.blocks.length === 0) continue
  const usings = []
  const stmts = []
  const decls = []
  for (const b of s.blocks) {
    let inDecl = false
    let depth = 0
    let opened = false
    let target = null
    b.body.forEach((line, k) => {
      const ln = b.start + k
      if (!inDecl && /^using\s+[^(]+;\s*$/.test(line)) { usings.push(line); return }
      if (!inDecl && DECL.test(line)) {
        inDecl = true; depth = 0; opened = false
        target = decls
        target.push(`#line ${ln} "${rel}"`)
      } else if (!inDecl && (target !== stmts || k === 0)) {
        target = stmts
        stmts.push(`#line ${ln} "${rel}"`)
      }
      if (inDecl) {
        decls.push(line)
        depth += depthDelta(line)
        if (code(line).includes('{')) opened = true
        if ((opened && depth <= 0) || (!opened && /;\s*(\/\/.*)?$/.test(line))) { inDecl = false; target = null }
        return
      }
      const own = /^\s*\/\/\s*=>\s*(.+?)\s*$/.exec(line)
      if (own) {
        // `// => expected` on its own line checks the statement just above it.
        checkLastStatement(stmts, own[1], ln)
        stmts.push(line)
        return
      }
      const m = CHECK.exec(line)
      if (m) {
        stmts.push(line.replace(/\s*\/\/\s*=>.*$/, ''))
        checkLastStatement(stmts, m[4], ln)
      } else {
        stmts.push(line)
      }
    })
  }
  const ns = pascal(s.title)
  registry.push({ ns, title: s.title })
  const file = [
    '// <auto-generated/> by extract.mjs from readme.md — do not edit.',
    '#nullable enable',
    '#pragma warning disable CS0162, CS1998, CS8321, CS0168, CS0219, CS8618, CS8602, CS8604',
    `namespace Jargon.Sections.${ns}Section;`,
    ...usings,
    '#line default',
    'public static class Section',
    '{',
    `    public const string Title = ${JSON.stringify(s.title)};`,
    '    public static async Task Run()',
    '    {',
    ...stmts,
    '#line default',
    '    }',
    '}',
    ...decls,
    ''
  ].join('\n')
  fs.writeFileSync(path.join(outDir, `${ns}.cs`), file)
}

fs.writeFileSync(path.join(outDir, '_Registry.cs'), [
  '// <auto-generated/>',
  'namespace Jargon;',
  'public static class Registry',
  '{',
  '    public static readonly (string Title, Func<Task> Run)[] Sections =',
  '    [',
  ...registry.map(r => `        (${JSON.stringify(r.title)}, Jargon.Sections.${r.ns}Section.Section.Run),`),
  '    ];',
  '}',
  ''
].join('\n'))

console.log(`Extracted ${registry.length} sections with C# samples.`)
