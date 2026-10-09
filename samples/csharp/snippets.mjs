// Reads the ```csharp blocks out of readme.md and combinators.md and splits
// each section into usings, statements and type declarations. Shared by
// extract.mjs (the compiled sample checks) and the app's parse step (the
// runnable playgrounds), so both read the snippets the same way.
//
// Conventions for readme snippets:
//  * All blocks within a section are concatenated (in order) and must form
//    valid C# together.
//  * Type declarations (record/class/interface/struct/enum/delegate/union) at
//    column 0, with any attribute lines just above them, are hoisted out of
//    the statements; everything else is statements, so statements and local
//    functions work as-is.
//  * `using` lines at column 0 are hoisted to the top.
//  * A statement ending in `// => expected` (or followed by a line holding
//    just `// => expected`) shows its value; `var x = ...; // => expected`
//    shows `x`. What "shows" means is up to the caller (see `check` below).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

// `prefix` keeps section namespaces from different files apart.
export const SOURCES = [
  { file: 'readme.md', prefix: '' },
  { file: 'combinators.md', prefix: 'Combinators' }
]

const DECL = /^(\[.*\]\s*)?((public|internal|file|static|abstract|sealed|partial|readonly|ref)\s+)*(record|class|interface|struct|enum|delegate|union)\b/
const ATTR = /^\[.*\]\s*$/
const CHECK = /^(\s*)(?:var\s+(\w+)\s*=\s*)?(.+?);\s*\/\/\s*=>\s*(.+?)\s*$/

// Collects sections (## / ###) and their csharp blocks, skipping any table of
// contents (everything before a `<!-- /RM -->` marker).
// Each section: { title, blocks: [{ start, body }], file, filePath, prefix }
export function readSections () {
  const sections = []
  for (const source of SOURCES) {
    const filePath = path.join(root, source.file)
    const lines = fs.readFileSync(filePath, 'utf8').split('\n')
    let current = null
    let inToc = lines.some(l => l.includes('<!-- /RM -->'))
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes('<!-- /RM -->')) { inToc = false; continue }
      if (inToc) continue
      const h = /^#{2,3}\s+(.+)$/.exec(line)
      if (h) {
        current = { title: h[1].trim(), blocks: [], file: source.file, filePath, prefix: source.prefix }
        sections.push(current)
        continue
      }
      if (current && /^```(csharp|cs)\s*$/.test(line)) {
        const start = i + 1
        let end = start
        while (end < lines.length && !/^```\s*$/.test(lines[end])) end++
        current.blocks.push({ start: start + 1, body: lines.slice(start, end) }) // 1-based line no.
        i = end
      }
    }
  }
  return sections
}

// Strips strings/chars/comments so brace counting is not fooled by them.
const code = l => l.replace(/\/\/.*$/, '').replace(/@?\$?"(?:[^"\\]|\\.)*"/g, '""').replace(/'(?:[^'\\]|\\.)'/g, "''")
const depthDelta = l => { const c = code(l); return (c.match(/\{/g) || []).length - (c.match(/\}/g) || []).length }

// Replaces the statement that ends the `stmts` list with whatever `check`
// makes of it: check({ text, variable, expected, line }) returns C# code.
// `text` is the statement without its `;`; `variable` is set for `var x = ...`.
function checkLastStatement (stmts, expected, line, check) {
  let end = stmts.length - 1
  while (end >= 0 && stmts[end].trim() === '') end--
  let start = end
  const ends = l => /[;{}]\s*(\/\/.*)?$/.test(l) || /^\s*(\/\/|#line)/.test(l) || l.trim() === ''
  while (start > 0 && !ends(stmts[start - 1])) start--
  const text = stmts.slice(start, end + 1).join('\n').replace(/;\s*(\/\/.*)?$/, '')
  const v = /^\s*var\s+(\w+)\s*=/.exec(text)
  stmts.splice(start, end - start + 1, check({ text, variable: v?.[1], expected, line }))
}

// Splits a section into { usings, stmts, decls } (arrays of lines).
// `lineFile`, when set, adds #line directives pointing back at the markdown
// (as a path relative to the generated file) so compiler errors land there.
// `keepComment` keeps a trailing `// => expected` after the checked statement.
export function splitSection (s, { check, lineFile = null, keepComment = false }) {
  const usings = []
  const stmts = []
  const decls = []
  // Without #line directives, a blank line still separates one block (or declaration) from the next
  const directive = (ln, lines) => lineFile
    ? [`#line ${ln} "${lineFile}"`]
    : lines.length && lines[lines.length - 1].trim() !== '' ? [''] : []
  for (const b of s.blocks) {
    let inDecl = false
    let depth = 0
    let opened = false
    let target = null
    b.body.forEach((line, k) => {
      const ln = b.start + k
      if (!inDecl && /^using\s+[^(]+;\s*$/.test(line)) { usings.push(line); return }
      if (!inDecl && (DECL.test(line) || (ATTR.test(line) && DECL.test(b.body[k + 1] ?? '')))) {
        inDecl = true; depth = 0; opened = false
        target = decls
        target.push(...directive(ln, decls))
      } else if (!inDecl && (target !== stmts || k === 0)) {
        target = stmts
        stmts.push(...directive(ln, stmts))
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
        checkLastStatement(stmts, own[1], ln, check)
        stmts.push(line)
        return
      }
      const m = CHECK.exec(line)
      if (m) {
        stmts.push(line.replace(/\s*\/\/\s*=>.*$/, ''))
        checkLastStatement(stmts, m[4], ln, check)
        if (keepComment) stmts[stmts.length - 1] += ' // => ' + m[4]
      } else {
        stmts.push(line)
      }
    })
  }
  return { usings, stmts, decls }
}

// Turns a section's snippets into one top-level C# program for the in-browser
// runner: each `// => expected` statement prints its value through Dump, which
// renders values the way the readme writes them (as Check.Render does).
export function toPlayground (s) {
  const check = ({ text, variable }) => {
    const indent = /^\s*/.exec(text)[0]
    return variable ? `${text}; Dump(${variable});` : `${indent}Dump(${text.trim()});`
  }
  const { usings, stmts, decls } = splitSection(s, { check, keepComment: true })
  const trim = lines => {
    while (lines.length && lines[0].trim() === '') lines.shift()
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()
    return lines
  }
  return [
    ...usings,
    ...(usings.length ? [''] : []),
    ...trim(stmts),
    '',
    '// Prints a value the way the examples write it',
    'static void Dump<T>(T value)',
    '{',
    '    Console.WriteLine(Show(value));',
    '    static string Show(object? value) => value switch',
    '    {',
    '        null      => "null",',
    '        bool b    => b ? "true" : "false",',
    '        string s  => $"\\"{s}\\"",',
    "        char c    => $\"'{c}'\",",
    '        double d  => d.ToString(System.Globalization.CultureInfo.InvariantCulture),',
    '        decimal m => m.ToString(System.Globalization.CultureInfo.InvariantCulture),',
    '        Delegate  => "<function>",',
    '        System.Collections.IEnumerable e when value.GetType().Namespace?.StartsWith("System") == true',
    '                  => $"[{string.Join(", ", e.Cast<object?>().Select(Show))}]",',
    '        _         => value.ToString() ?? "null"',
    '    };',
    '}',
    ...(decls.length ? ['', ...trim(decls)] : []),
    ''
  ].join('\n')
}
