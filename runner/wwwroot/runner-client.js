// Page-side client for runner-worker.js. Shared by the runner's own test page
// and the jargon app (which imports it at runtime from <base>/runner/).
//
//   const runner = createRunner();
//   runner.subscribe(({ status, boot }) => ...);   // loading | ready | running | restarting
//   const result = await runner.run(code, { rules });         // or { timedOut: true }
//   const diagnosis = await runner.diagnose(code, { rules }); // or null when superseded
//
// rules (optional) are an exercise's rule lines, one per line (see exercises.md);
// broken rules come back as FPJ diagnostics alongside the compiler's.
//
// A run that takes longer than timeoutMs (counted from when it starts, not
// while it waits in the queue) terminates the worker and boots a fresh one.

export function createRunner({ timeoutMs = 5000, workerUrl = new URL('./runner-worker.js', import.meta.url) } = {}) {
  let worker;
  let nextId = 0;
  let state = { status: 'loading', boot: null };
  const listeners = new Set();
  const pending = new Map(); // id -> { type, resolve, timer }
  let running = 0;

  const set = (patch) => {
    state = { ...state, ...patch };
    for (const listener of listeners) listener(state);
  };

  function start() {
    worker = new Worker(workerUrl, { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.type === 'ready') {
        set({ status: running ? 'running' : 'ready', boot: data });
        return;
      }
      const job = pending.get(data.id);
      if (!job) return;
      if (data.type === 'started') {
        if (job.type === 'run') job.timer = setTimeout(() => restart(), timeoutMs);
        return;
      }
      finish(data.id, data.type === 'done' ? data.result : null);
    };
    worker.onerror = (e) => set({ status: 'error', error: e.message || 'The runner failed to start' });
  }

  function finish(id, value) {
    const job = pending.get(id);
    if (!job) return;
    clearTimeout(job.timer);
    pending.delete(id);
    if (job.type === 'run' && --running === 0 && state.status === 'running') set({ status: 'ready' });
    job.resolve(value);
  }

  // Stops a runaway program: every job in flight is answered, then .NET reboots
  function restart() {
    worker.terminate();
    set({ status: 'restarting' });
    for (const [id, job] of pending) finish(id, job.type === 'run' ? { timedOut: true, timeoutMs } : null);
    start();
  }

  function send(type, code, rules = '') {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, { type, resolve, timer: null });
      if (type === 'run' && running++ === 0 && state.status === 'ready') set({ status: 'running' });
      worker.postMessage({ id, type, code, rules: Array.isArray(rules) ? rules.join('\n') : rules });
    });
  }

  start();
  return {
    get state() { return state; },
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    run: (code, { rules } = {}) => send('run', code, rules),
    diagnose: (code, { rules } = {}) => send('diagnose', code, rules),
    dispose() {
      worker.terminate();
      for (const id of [...pending.keys()]) finish(id, null);
      listeners.clear();
    },
  };
}
