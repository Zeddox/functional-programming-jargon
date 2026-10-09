import React, { useState } from 'react';
import { CheckCircle2, CircleHelp, CircleX, Lightbulb, ListChecks } from 'lucide-react';
import InlineText from '../InlineText';
import { ruleStates } from '../../utils/exercises';
import { codeTheme } from './theme';

// An exercise's brief: what to do, the expected output, its rules and whether
// the code keeps them, hints revealed one at a time, and the solution.
// Give it key={exercise.id} so hints and the solution fold away between exercises.
export default function ExerciseBrief({ exercise, diagnostics, checked, isDark, headingLevel = 3 }) {
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const { subtle, button } = codeTheme(isDark);
  const Heading = `h${headingLevel}`;
  const Subheading = `h${headingLevel + 1}`;

  return (
    <div className="space-y-4" data-testid="exercise-brief">
      <Heading className="text-sm font-semibold">{exercise.title}</Heading>
      <p><InlineText text={exercise.brief} isDark={isDark} /></p>
      <div>
        <Subheading className="mb-1 text-[10px] uppercase tracking-widest opacity-60">Expected output</Subheading>
        <pre className={`rounded-md p-2 font-mono text-[12px] ${subtle}`}>{exercise.expected}</pre>
      </div>
      {exercise.rules?.length > 0 && (
        <RuleChecklist states={ruleStates(exercise.rules, checked ? diagnostics : null)} isDark={isDark} Heading={Subheading} />
      )}
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
  );
}

// State is shown by icon and text, not colour alone
const RULE_STATE = {
  kept: { Icon: CheckCircle2, text: 'kept', className: 'text-emerald-500' },
  broken: { Icon: CircleX, text: 'broken', className: 'text-violet-500' },
  unchecked: { Icon: CircleHelp, text: 'not checked yet: the code has to compile first', className: 'opacity-60' },
};

function RuleChecklist({ states, isDark, Heading }) {
  return (
    <div data-testid="exercise-rules">
      <Heading className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-60"><ListChecks size={12} aria-hidden="true" /> Rules</Heading>
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
