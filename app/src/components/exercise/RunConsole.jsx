import React from 'react';
import { CheckCircle2, CircleDashed, ListChecks, Sparkles } from 'lucide-react';
import { isRuleDiagnostic } from '../../utils/exercises';

const NOT_YET = {
  output: 'the output doesn’t match the expected output.',
  compile: 'fix the errors first.',
  exception: 'the program threw an exception.',
  rules: 'it breaks one of the exercise’s rules (below).',
  timeout: 'the program ran too long.',
};

// Output, errors and the exercise verdict, from a useCodeSession() result.
// Errors link back to the editor (onGoTo(line, column)); rule diagnostics
// (the exercise talking) are told apart from the compiler's.
export default function RunConsole({ session, onGoTo, className = '' }) {
  const { result, check, diagnostics } = session;
  const errors = diagnostics.filter((d) => d.severity === 'error' && !isRuleDiagnostic(d));
  const ruled = diagnostics.filter(isRuleDiagnostic);
  return (
    <div className={`overflow-y-auto p-3 font-mono text-[12px] leading-relaxed ${className}`} data-testid="codelab-output" aria-live="polite">
      {check && (
        <p className={`mb-2 flex items-center gap-1.5 font-sans font-medium ${check.passed ? 'text-emerald-500' : 'text-amber-500'}`}>
          {check.passed
            ? <><CheckCircle2 size={14} /> Passed: the output matches.</>
            : <><CircleDashed size={14} /> Not yet: {NOT_YET[check.reason] ?? NOT_YET.timeout}</>}
        </p>
      )}
      {errors.map((d, i) => (
        <button key={i} type="button" onClick={() => onGoTo?.(d.line, d.column)} className="block w-full text-left text-red-500 hover:underline">
          ({d.line},{d.column}) {d.id}: {d.message}
        </button>
      ))}
      {ruled.map((d, i) => (
        <button key={`rule-${i}`} type="button" onClick={() => onGoTo?.(d.line, d.column)} data-testid="rule-diagnostic" data-severity={d.severity}
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
