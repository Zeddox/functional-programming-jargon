import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleDashed, CircleHelp, CircleX, Lightbulb, ListChecks, Loader2, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import CodeEditor from './CodeEditor';
import InlineText from './InlineText';
import { loadRunner, useRunnerState, loadPlaygrounds, loadExerciseState, saveExerciseState } from '../utils/runner';
import { checkRun, isRuleDiagnostic, ruleStates } from '../utils/exercises';

// "Try it": the term's readme examples as a runnable playground, plus its
// exercises. A plain harness for the runner and editor until the learning-path
// study layout is designed; the pieces (CodeEditor, utils/runner) are meant to
// move into that layout as they are.

const STATUS_TEXT = {
  idle: 'Starting .NET…',
  loading: 'Starting .NET (the first time downloads about 13 MB)…',
  ready: 'Ready',
  running: 'Running…',
  restarting: 'Restarting .NET…',
  error: 'The C# runner failed to start',
  unavailable: 'The C# runner isn’t built here. Run `npm run build:runner` in app/.',
};

const DIAGNOSE_DELAY_MS = 400;

export default function CodeLab({ term, initialExerciseId = null, isDark, onClose, onExercisePassed }) {
  const exercises = term.exercises ?? [];
  const [tab, setTab] = useState(initialExerciseId ?? (term.hasPlayground ? 'example' : exercises[0]?.id));
  const exercise = exercises.find((e) => e.id === tab) ?? null;

  const [saved, setSaved] = useState(loadExerciseState);
  const [playground, setPlayground] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  // Whether diagnostics come from the code on screen (or an earlier version of it), not a previous tab
  const [checked, setChecked] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const editorRef = useRef(null);
  const runner = useRunnerState();
  const ready = runner.status === 'ready';

  useEffect(() => { loadRunner(); }, []);
  useEffect(() => {
    if (term.hasPlayground) loadPlaygrounds().then((all) => setPlayground(all[term.id] ?? ''));
  }, [term]);

  // Switching tabs loads that tab's code: a saved draft, the starter, or the playground
  const starterFor = useCallback((id) => {
    if (id === 'example') return playground ?? '';
    const ex = exercises.find((e) => e.id === id);
    return saved[id]?.code ?? ex?.starter ?? '';
  }, [playground, exercises, saved]);

  useEffect(() => {
    setCode(starterFor(tab));
    setResult(null);
    setDiagnostics([]);
    setChecked(false);
    setHintsShown(0);
    setShowSolution(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, playground]);

  // Live squiggles and rule checks, shortly after typing stops
  const rules = exercise?.rules;
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

  const updateSaved = (id, patch) => {
    setSaved((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      saveExerciseState(next);
      return next;
    });
  };

  const handleChange = (next) => {
    setCode(next);
    if (exercise) updateSaved(exercise.id, { code: next });
  };

  const run = async () => {
    const client = await loadRunner();
    if (!client || client.state.status !== 'ready') return;
    const ranCode = code;
    const outcome = await client.run(ranCode, { rules: exercise?.rules });
    setResult({ ...outcome, code: ranCode });
    if (outcome.diagnostics) {
      setDiagnostics(outcome.diagnostics);
      setChecked(true);
    }
    if (exercise && checkRun(outcome, exercise.expected).passed) {
      updateSaved(exercise.id, { passed: true });
      onExercisePassed?.(exercise.id);
    }
  };

  const reset = () => {
    const fresh = exercise ? exercise.starter : playground ?? '';
    setCode(fresh);
    if (exercise) updateSaved(exercise.id, { code: undefined });
    setResult(null);
  };

  const goTo = (line, column) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.revealLineInCenter(line);
    editor.setPosition({ lineNumber: line, column });
    editor.focus();
  };

  useEffect(() => {
    // Esc that the editor used (closing its suggestions, say) doesn't close the panel
    const onKey = (e) => { if (e.key === 'Escape' && !e.defaultPrevented) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const check = exercise && result ? checkRun(result, exercise.expected) : null;
  const surface = isDark ? 'bg-[#121212] text-[#f0f0ee] border-[rgba(240,240,238,0.12)]' : 'bg-[#eaeae8] text-[#1a1a19] border-[rgba(26,26,25,0.12)]';
  const line = isDark ? 'border-[rgba(240,240,238,0.12)]' : 'border-[rgba(26,26,25,0.12)]';
  const subtle = isDark ? 'bg-[#1a1a19]' : 'bg-[#e2e2df]';
  const button = `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:opacity-40 ${line} ${isDark ? 'hover:bg-[#242422]' : 'hover:bg-[#d8d8d5]'}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/50 p-0 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="codelab-title" data-testid="codelab"
        className={`flex w-full max-w-6xl flex-col overflow-hidden border sm:rounded-xl ${surface}`}>
        <header className={`flex flex-wrap items-center gap-2 border-b px-4 py-3 ${line}`}>
          <h2 id="codelab-title" className="mr-2 text-sm font-semibold">Try it: {term.title}</h2>
          <div role="tablist" aria-label="Code" className="flex flex-wrap gap-1">
            {term.hasPlayground && (
              <TabButton selected={tab === 'example'} onClick={() => setTab('example')} isDark={isDark}>Examples</TabButton>
            )}
            {exercises.map((ex) => (
              <TabButton key={ex.id} selected={tab === ex.id} onClick={() => setTab(ex.id)} isDark={isDark}>
                {saved[ex.id]?.passed
                  ? <CheckCircle2 size={13} className="text-emerald-500" aria-label="Passed" />
                  : <CircleDashed size={13} className="opacity-60" aria-hidden="true" />}
                {ex.title}
              </TabButton>
            ))}
          </div>
          <button type="button" onClick={onClose} className={`ml-auto ${button}`} aria-label="Close">
            <X size={14} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:grid-rows-1">
          {/* Brief */}
          <section className={`max-h-[35vh] overflow-y-auto border-b p-4 text-xs leading-relaxed md:max-h-none md:border-b-0 md:border-r ${line}`} aria-label="Brief">
            {exercise ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">{exercise.title}</h3>
                <p><InlineText text={exercise.brief} isDark={isDark} /></p>
                <div>
                  <h4 className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Expected output</h4>
                  <pre className={`rounded-md p-2 font-mono text-[12px] ${subtle}`}>{exercise.expected}</pre>
                </div>
                {exercise.rules?.length > 0 && <RuleChecklist states={ruleStates(exercise.rules, checked ? diagnostics : null)} isDark={isDark} />}
                {exercise.hints.length > 0 && (
                  <div className="space-y-2">
                    {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                      <p key={i} className="flex gap-2"><Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" /><span><InlineText text={hint} isDark={isDark} /></span></p>
                    ))}
                    {hintsShown < exercise.hints.length && (
                      <button type="button" className={button} onClick={() => setHintsShown((n) => n + 1)}>
                        <Lightbulb size={13} /> {hintsShown === 0 ? 'Show a hint' : 'Another hint'}
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <button type="button" className={button} onClick={() => setShowSolution((s) => !s)} aria-expanded={showSolution}>
                    {showSolution ? 'Hide solution' : 'Show solution'}
                  </button>
                  {showSolution && <pre className={`mt-2 overflow-x-auto rounded-md p-2 font-mono text-[12px] ${subtle}`}>{exercise.solution}</pre>}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Examples</h3>
                <p>The C# examples for <strong>{term.title}</strong>, as one program. Each line ending in <code>{'// =>'}</code> prints its value through <code>Dump</code>, so you can check it against the comment.</p>
                <p className="opacity-75">Change anything and run it again. Exercises, where there are any, are in the tabs above.</p>
              </div>
            )}
          </section>

          {/* Editor and console */}
          <section className="flex min-h-0 flex-col" aria-label="Editor">
            <div className="min-h-[200px] flex-1">
              <CodeEditor value={code} onChange={handleChange} diagnostics={diagnostics} onRun={run}
                onEditorMount={(editor) => { editorRef.current = editor; }} isDark={isDark}
                ariaLabel={exercise ? `C# code for ${exercise.title}` : `C# examples for ${term.title}`} />
            </div>
            <div className={`flex flex-wrap items-center gap-2 border-t px-3 py-2 ${line}`}>
              <button type="button" onClick={run} disabled={!ready} data-testid="codelab-run"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-40">
                {runner.status === 'running' ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} Run
              </button>
              <button type="button" onClick={reset} className={button}><RotateCcw size={13} /> Reset</button>
              <span className="text-[11px] opacity-50">Ctrl/⌘ + Enter</span>
              <span className="ml-auto text-[11px] opacity-70" role="status" data-testid="runner-status">
                {runner.status === 'ready' && runner.boot ? `Ready · .NET started in ${(runner.boot.bootMs / 1000).toFixed(1)} s` : <InlineText text={STATUS_TEXT[runner.status] ?? runner.status} isDark={isDark} />}
              </span>
            </div>
            <Console result={result} check={check} diagnostics={diagnostics} onGoTo={goTo} className={`border-t ${line} ${subtle}`} />
          </section>
        </div>
      </div>
    </div>
  );
}

function TabButton({ selected, onClick, isDark, children }) {
  return (
    <button type="button" role="tab" aria-selected={selected} onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
        selected ? (isDark ? 'bg-[#f0f0ee] text-[#121212]' : 'bg-[#1a1a19] text-[#eaeae8]') : (isDark ? 'hover:bg-[#242422]' : 'hover:bg-[#d8d8d5]')
      }`}>
      {children}
    </button>
  );
}

// The exercise's rules and whether the code keeps them. State is shown by
// icon and text, not colour alone.
const RULE_STATE = {
  kept: { Icon: CheckCircle2, text: 'kept', className: 'text-emerald-500' },
  broken: { Icon: CircleX, text: 'broken', className: 'text-violet-500' },
  unchecked: { Icon: CircleHelp, text: 'not checked yet: the code has to compile first', className: 'opacity-60' },
};

function RuleChecklist({ states, isDark }) {
  return (
    <div data-testid="exercise-rules">
      <h4 className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-60"><ListChecks size={12} aria-hidden="true" /> Rules</h4>
      <ul className="space-y-1">
        {states.map(({ rule, label, state }) => {
          const { Icon, text, className } = RULE_STATE[state];
          return (
            <li key={rule} className="flex gap-2" data-state={state}>
              <Icon size={13} className={`mt-0.5 shrink-0 ${className}`} aria-hidden="true" />
              <span><InlineText text={label} isDark={isDark} /> <span className="sr-only">({text})</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Output, errors and the exercise verdict. Errors link back to the editor;
// rule diagnostics (the exercise talking) are told apart from the compiler's.
function Console({ result, check, diagnostics, onGoTo, className }) {
  const errors = diagnostics.filter((d) => d.severity === 'error' && !isRuleDiagnostic(d));
  const ruled = diagnostics.filter(isRuleDiagnostic);
  return (
    <div className={`h-44 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed ${className}`} data-testid="codelab-output" aria-live="polite">
      {check && (
        <p className={`mb-2 flex items-center gap-1.5 font-sans font-medium ${check.passed ? 'text-emerald-500' : 'text-amber-500'}`}>
          {check.passed ? <><CheckCircle2 size={14} /> Passed: the output matches.</> : <><CircleDashed size={14} /> Not yet: {
            check.reason === 'output' ? 'the output doesn’t match the expected output.'
              : check.reason === 'compile' ? 'fix the errors first.'
                : check.reason === 'exception' ? 'the program threw an exception.'
                  : check.reason === 'rules' ? 'it breaks one of the exercise’s rules (below).'
                    : 'the program ran too long.'}</>}
        </p>
      )}
      {errors.map((d, i) => (
        <button key={i} type="button" onClick={() => onGoTo(d.line, d.column)} className="block w-full text-left text-red-500 hover:underline">
          ({d.line},{d.column}) {d.id}: {d.message}
        </button>
      ))}
      {ruled.map((d, i) => (
        <button key={`rule-${i}`} type="button" onClick={() => onGoTo(d.line, d.column)} data-testid="rule-diagnostic" data-severity={d.severity}
          className={`flex w-full gap-1.5 text-left font-sans hover:underline ${d.severity === 'error' ? 'text-violet-500' : d.severity === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
          {d.severity === 'info' ? <Sparkles size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> : <ListChecks size={13} className="mt-0.5 shrink-0" aria-hidden="true" />}
          <span><span className="sr-only">{d.severity === 'info' ? 'Nice: ' : 'Exercise rule: '}</span>{d.message}</span>
        </button>
      ))}
      {!result && errors.length === 0 && ruled.length === 0 && <p className="opacity-50">Run the code to see its output here.</p>}
      {result?.timedOut && <p className="text-red-500">Stopped after {result.timeoutMs / 1000} s: is there an infinite loop? .NET is restarting.</p>}
      {result?.output && <pre className="whitespace-pre-wrap">{result.output}</pre>}
      {result?.exception && <pre className="whitespace-pre-wrap text-red-500">{result.exception.split('\n')[0]}</pre>}
      {result?.compiled && !result.timedOut && (
        <p className="mt-1 font-sans text-[10px] opacity-50">compiled in {result.compileMs.toFixed(0)} ms{result.rulesMs ? ` · rules checked in ${result.rulesMs.toFixed(0)} ms` : ''} · ran in {result.runMs.toFixed(0)} ms</p>
      )}
    </div>
  );
}
