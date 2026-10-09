// Web Worker hosting the .NET runtime, so compiling and running learner code
// never blocks the page. A page that needs to stop a runaway program just
// terminates this worker and starts a new one.
//
// Messages in:  { id, type: 'run', code }
// Messages out: { type: 'ready', bootMs } once, then { id, result } per run
import { dotnet } from './_framework/dotnet.js';

const started = performance.now();
const { getAssemblyExports, getConfig } = await dotnet.create();
const exports = await getAssemblyExports(getConfig().mainAssemblyName);
const runner = exports.Runner;

// Load the reference assemblies now rather than on the first run
let warmup;
try {
  warmup = JSON.parse(runner.Warmup());
} catch (err) {
  warmup = { error: String(err?.stack || err) };
}
postMessage({ type: 'ready', bootMs: performance.now() - started, warmup });

onmessage = (e) => {
  const { id, type, code } = e.data;
  if (type !== 'run') return;
  let result;
  try {
    result = JSON.parse(runner.Run(code));
  } catch (err) {
    result = { compiled: false, diagnostics: [], output: '', exception: String(err) };
  }
  postMessage({ id, result });
};
