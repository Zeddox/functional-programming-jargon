// Runs every exercise and playground through the real in-browser C# runner
// (headless Chromium), since the browser runner offers fewer libraries than
// the desktop samples build and runs single-threaded.
//
//   npm run build:runner   # once, needs the .NET 11 SDK
//   npm run parse
//   npm run test:runner
//
// Checks: each exercise's solution passes (rules kept) and its starter doesn't;
// a rule broken with the right output still fails; each
// playground compiles, runs without an exception and finishes in time.
// Playgrounds known not to run in the browser are listed in
// scripts/playground-failures.json, which also hides their "Try it" button.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { brokenRules, checkRun, normaliseOutput } from '../src/utils/exercises.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, '../public');
const data = JSON.parse(fs.readFileSync(path.resolve(here, '../src/data/jargons.json'), 'utf8'));
const playgrounds = JSON.parse(fs.readFileSync(path.join(publicDir, 'data/playgrounds.json'), 'utf8'));

// Playground id -> why it can't run in the browser runner (shared with parse-jargons.js)
const KNOWN_FAILURES = JSON.parse(fs.readFileSync(path.resolve(here, '../scripts/playground-failures.json'), 'utf8'));

if (!fs.existsSync(path.join(publicDir, 'runner/runner-client.js'))) {
  console.error('The runner is not built: run `npm run build:runner` first.');
  process.exit(1);
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const file = path.join(publicDir, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(publicDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Content-Encoding': 'gzip' });
  res.end(zlib.gzipSync(fs.readFileSync(file), { level: 1 }));
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(`${base}/runner/index.html`);
await page.waitForFunction(() => window.runner?.state.status === 'ready', null, { timeout: 120000 });
const run = (code, rules) => page.evaluate(([c, r]) => window.runner.run(c, { rules: r }), [code, rules]);
const diagnose = (code, rules) => page.evaluate(([c, r]) => window.runner.diagnose(c, { rules: r }), [code, rules]);

const failures = [];
const firstLine = (text) => (text ?? '').split('\n')[0];
const errorsIn = (result) => result.diagnostics.filter((d) => d.severity === 'error').map((d) => `(${d.line},${d.column}) ${d.id}: ${d.message}`).join('; ');
const describe = (result) => result.timedOut ? 'timed out'
  : !result.compiled ? errorsIn(result)
  : result.exception ? firstLine(result.exception)
  : brokenRules(result.diagnostics).length ? `broke a rule: ${errorsIn(result)}`
  : `printed ${JSON.stringify(result.output)}`;

// Solutions pass with every rule kept (the analyzer's own tests in
// analyzers/ check that each rule catches what it should)
let exercises = 0;
const rulesMs = [];
for (const term of data.terms) {
  for (const exercise of term.exercises ?? []) {
    exercises++;
    const solution = await run(exercise.solution, exercise.rules);
    if (!checkRun(solution, exercise.expected).passed)
      failures.push(`exercise ${exercise.id}: solution doesn't pass: ${describe(solution)}`);
    if (solution.diagnostics?.some((d) => d.id === 'AD0001' || d.id === 'FPJ999'))
      failures.push(`exercise ${exercise.id}: the rule analyzer failed: ${errorsIn(solution)}`);
    const starter = await run(exercise.starter, exercise.rules);
    if (checkRun(starter, exercise.expected).passed)
      failures.push(`exercise ${exercise.id}: starter already passes`);
    if (exercise.rules.length) rulesMs.push((await diagnose(exercise.solution, exercise.rules)).rulesMs);
  }
}

// Rules through the real runner: right output, broken rule → not passed
{
  const functor = data.terms.find((t) => t.id === 'functor').exercises[0];
  const unwrapped = functor.solution.replace('FindUser(id).Map(name => name.ToUpper())', 'FindUser(id).Match(name => Some(name.ToUpper()), () => None)');
  const result = await run(unwrapped, functor.rules);
  const ids = result.diagnostics.map((d) => d.id).sort().join(',');
  if (normaliseOutput(result.output) !== normaliseOutput(functor.expected) || checkRun(result, functor.expected).reason !== 'rules' || ids !== 'FPJ001,FPJ002')
    failures.push(`rules: Match instead of Map gave ${ids} / ${JSON.stringify(checkRun(result, functor.expected))}`);
  const kept = await diagnose(functor.solution, functor.rules);
  if (!kept.diagnostics.some((d) => d.id === 'FPJ010' && d.severity === 'info'))
    failures.push(`rules: the solution wasn't praised: ${JSON.stringify(kept.diagnostics)}`);
  const unreadable = await diagnose('Console.WriteLine(1);', 'frobnicate Option.Map');
  const [bad] = unreadable.diagnostics;
  if (bad?.id !== 'FPJ000' || bad.line !== 1)
    failures.push(`rules: an unreadable rule gave ${JSON.stringify(unreadable.diagnostics)}`);
}

let ran = 0;
const fixed = [];
for (const [id, code] of Object.entries(playgrounds)) {
  const result = await run(code);
  const ok = result.compiled && !result.exception && !result.timedOut;
  if (ok) ran++;
  if (KNOWN_FAILURES[id]) {
    if (ok) fixed.push(id);
  } else if (!ok) {
    failures.push(`playground ${id}: ${describe(result)}`);
  }
}

// The client itself: awaiting code, live diagnostics, and recovering from a runaway program
const expect = (ok, message) => { if (!ok) failures.push(`runner: ${message}`); };
const awaited = await run('await Task.Delay(20);\nConsole.WriteLine("awaited");');
expect(awaited.output === 'awaited\n', `async program printed ${JSON.stringify(awaited.output ?? awaited)}`);

const diagnosis = await page.evaluate(() => window.runner.diagnose('int x = "a";'));
const [error] = diagnosis.diagnostics;
expect(error?.id === 'CS0029' && error.line === 1 && error.column === 9 && error.endColumn === 12,
  `diagnose gave ${JSON.stringify(diagnosis.diagnostics)}`);

const superseded = await page.evaluate(() => Promise.all([window.runner.diagnose('int a = "";'), window.runner.diagnose('int b = 1;')]));
expect(superseded[1]?.diagnostics.every((d) => d.severity !== 'error'), `latest diagnose gave ${JSON.stringify(superseded[1])}`);

const loop = await run('while (true) { }');
expect(loop.timedOut === true, `infinite loop gave ${JSON.stringify(loop)}`);
await page.waitForFunction(() => window.runner.state.status === 'ready', null, { timeout: 60000 });
const after = await run('Console.WriteLine(Some(1));');
expect(after.output === 'Some(1)\n', `after a restart the runner printed ${JSON.stringify(after.output ?? after)}`);

await browser.close();
server.close();

if (rulesMs.length) console.log(`Rule checks (diagnose) took ${rulesMs.map((ms) => ms.toFixed(0)).join(', ')} ms.`);
console.log(`${exercises} exercises checked, ${ran}/${Object.keys(playgrounds).length} playgrounds ran (${Object.keys(KNOWN_FAILURES).length} known failures).`);
for (const id of fixed) console.log(`NOW PASSING (remove from KNOWN_FAILURES): ${id}`);
for (const f of failures) console.log(`FAIL ${f}`);
process.exit(failures.length || fixed.length ? 1 : 0);
