// Web Worker hosting the .NET runtime, so compiling and running learner code
// never blocks the page. A page that needs to stop a runaway program just
// terminates this worker and starts a new one.
//
// Messages in:  { id, type: 'run' | 'diagnose', code, rules } (rules: an exercise's
//               rule lines, checked by the exercise analyzer; empty for none)
// Messages out: { type: 'ready', bootMs, warmup } once, then per job
//               { id, type: 'started' } as it begins (a page times runs from here)
//               { id, type: 'done', result } or { id, type: 'skipped' }
//
// Jobs run one at a time, in order: learner code can await, and the next job
// must not start (or swap Console.Out) while it does. A diagnose job is
// skipped when a newer one is already queued behind it.
import { dotnet } from './_framework/dotnet.js';

// Listen before starting .NET, so jobs sent during boot queue up rather than vanish
const queue = [];
let busy = false;
let runner;
let warmup;
onmessage = (e) => {
  queue.push(e.data);
  drain();
};

const started = performance.now();
const { getAssemblyExports, getConfig } = await dotnet.create();
runner = (await getAssemblyExports(getConfig().mainAssemblyName)).Runner;

// Load the reference assemblies now rather than on the first run
try {
  warmup = JSON.parse(await runner.Warmup());
} catch (err) {
  warmup = { error: String(err?.stack || err) };
}
postMessage({ type: 'ready', bootMs: performance.now() - started, warmup });
drain();

async function drain() {
  if (busy || warmup === undefined) return;
  busy = true;
  while (queue.length) {
    const { id, type, code, rules = '' } = queue.shift();
    if (type === 'diagnose' && queue.some((job) => job.type === 'diagnose')) {
      postMessage({ id, type: 'skipped' });
      continue;
    }
    postMessage({ id, type: 'started' });
    let result;
    try {
      result = JSON.parse(await (type === 'diagnose' ? runner.Diagnose(code, rules) : runner.Run(code, rules)));
    } catch (err) {
      result = { compiled: false, diagnostics: [], output: '', exception: String(err) };
    }
    postMessage({ id, type: 'done', result });
  }
  busy = false;
}
