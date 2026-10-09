import { useEffect, useState } from 'react';
import { loadRunner, useRunnerState, loadExerciseState, saveExerciseState } from './runner';
import { checkRun } from './exercises';

// One piece of code being edited and run: an exercise (drafts saved, rules
// checked, passing recorded) or a playground (id null, nothing saved).
// Shared by every place that shows the editor, so the explorer's "Try it" and
// the study layout behave the same.
//
//   const session = useCodeSession({ id, starter, rules, expected, onPassed });
//   <CodeEditor value={session.code} onChange={session.setCode}
//               diagnostics={session.diagnostics} onRun={session.run} />

const DIAGNOSE_DELAY_MS = 400;

const draftFor = (id, starter) => (id && loadExerciseState()[id]?.code) ?? starter;

function saveFor(id, patch) {
  const all = loadExerciseState();
  saveExerciseState({ ...all, [id]: { ...all[id], ...patch } });
}

export function useCodeSession({ id = null, starter = '', rules, expected, onPassed } = {}) {
  const [code, setCodeState] = useState(() => draftFor(id, starter));
  const [result, setResult] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  // Whether diagnostics come from this code (or an earlier version of it),
  // rather than nothing having been checked yet
  const [checked, setChecked] = useState(false);
  const runner = useRunnerState();
  const ready = runner.status === 'ready';

  useEffect(() => { loadRunner(); }, []);

  // Another exercise or playground: its draft or starter, and a clean slate
  useEffect(() => {
    setCodeState(draftFor(id, starter));
    setResult(null);
    setDiagnostics([]);
    setChecked(false);
  }, [id, starter]);

  // Live squiggles and rule checks, shortly after typing stops
  useEffect(() => {
    if (!ready || !code) return undefined;
    let current = true;
    const timer = setTimeout(async () => {
      const client = await loadRunner();
      const diagnosis = await client?.diagnose(code, { rules });
      if (current && diagnosis) {
        setDiagnostics(diagnosis.diagnostics);
        setChecked(true);
      }
    }, DIAGNOSE_DELAY_MS);
    return () => { current = false; clearTimeout(timer); };
  }, [code, ready, rules]);

  const setCode = (next) => {
    setCodeState(next);
    if (id) saveFor(id, { code: next });
  };

  const run = async () => {
    const client = await loadRunner();
    if (!client || client.state.status !== 'ready') return;
    const ranCode = code;
    const outcome = await client.run(ranCode, { rules });
    setResult({ ...outcome, code: ranCode });
    if (outcome.diagnostics) {
      setDiagnostics(outcome.diagnostics);
      setChecked(true);
    }
    if (id && expected != null && checkRun(outcome, expected).passed) {
      saveFor(id, { passed: true });
      onPassed?.(id);
    }
  };

  const reset = () => {
    setCodeState(starter);
    if (id) saveFor(id, { code: undefined });
    setResult(null);
  };

  return {
    code, setCode, run, reset,
    result, diagnostics, checked,
    // The verdict on the last run, for exercises
    check: expected != null && result ? checkRun(result, expected) : null,
    status: runner.status, boot: runner.boot, ready,
  };
}
