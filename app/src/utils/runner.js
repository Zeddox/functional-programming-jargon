// The in-browser C# runner (../runner, published into public/runner by
// `npm run build:runner`). Nothing is downloaded until something asks for it:
// the client module, then the .NET runtime (about 13 MB, cached afterwards).
import { useEffect, useState } from 'react';

// BASE_URL is './' (relative), and import() resolves relative URLs against
// the bundle in assets/, so anchor it to the page instead
const RUNNER_BASE = new URL(`${import.meta.env.BASE_URL}runner/`, document.baseURI).href;

let runnerPromise;
const listeners = new Set();
let runnerState = { status: 'idle' };

function setRunnerState(state) {
  runnerState = state;
  for (const listener of listeners) listener(state);
}

// Starts the runner once; resolves to its client, or null when it isn't built
export function loadRunner() {
  runnerPromise ??= import(/* @vite-ignore */ `${RUNNER_BASE}runner-client.js`)
    .then(({ createRunner }) => {
      const runner = createRunner();
      runner.subscribe(setRunnerState);
      return runner;
    })
    .catch(() => {
      setRunnerState({ status: 'unavailable' });
      return null;
    });
  return runnerPromise;
}

// { status: idle | loading | ready | running | restarting | error | unavailable, boot }
export function useRunnerState() {
  const [state, setState] = useState(runnerState);
  useEffect(() => {
    listeners.add(setState);
    setState(runnerState);
    return () => listeners.delete(setState);
  }, []);
  return state;
}

// The readme snippets for each term as runnable programs (from parse-jargons.js)
let playgroundsPromise;
export function loadPlaygrounds() {
  playgroundsPromise ??= fetch(`${import.meta.env.BASE_URL}data/playgrounds.json`)
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => ({}));
  return playgroundsPromise;
}

// Saved drafts and passes, per exercise: { [exerciseId]: { code, passed } }
const EXERCISES_KEY = 'fp_exercises_v1';

export function loadExerciseState() {
  try {
    return JSON.parse(localStorage.getItem(EXERCISES_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveExerciseState(state) {
  try {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(state));
  } catch {
    // Private windows and full storage: progress just isn't kept
  }
}
