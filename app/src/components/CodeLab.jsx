import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleDashed, X } from 'lucide-react';
import CodeEditor from './CodeEditor';
import ExerciseBrief from './exercise/ExerciseBrief';
import RunBar from './exercise/RunBar';
import RunConsole from './exercise/RunConsole';
import { codeTheme } from './exercise/theme';
import { loadPlaygrounds } from '../utils/runner';
import { useCodeSession } from '../utils/useCodeSession';

// "Try it": the term's readme examples as a runnable playground, plus its
// exercises, in a dialog. The pieces (useCodeSession, CodeEditor and the
// components in ./exercise) are shared with the learning-path study layout.

export default function CodeLab({ term, initialExerciseId = null, isDark, passedExercises = {}, onClose, onExercisePassed }) {
  const exercises = term.exercises ?? [];
  const [tab, setTab] = useState(initialExerciseId ?? (term.hasPlayground ? 'example' : exercises[0]?.id));
  const exercise = exercises.find((e) => e.id === tab) ?? null;

  const [playground, setPlayground] = useState(null);
  useEffect(() => {
    if (term.hasPlayground) loadPlaygrounds().then((all) => setPlayground(all[term.id] ?? ''));
  }, [term]);

  const session = useCodeSession(exercise
    ? { id: exercise.id, starter: exercise.starter, rules: exercise.rules, expected: exercise.expected, onPassed: onExercisePassed }
    : { starter: playground ?? '' });

  const editorRef = useRef(null);
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

  const { surface, line, subtle, button } = codeTheme(isDark);

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
                {passedExercises[ex.id]
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
          <section className={`max-h-[35vh] overflow-y-auto border-b p-4 text-xs leading-relaxed md:max-h-none md:border-b-0 md:border-r ${line}`} aria-label="Brief">
            {exercise ? (
              <ExerciseBrief key={exercise.id} exercise={exercise} diagnostics={session.diagnostics} checked={session.checked} isDark={isDark} />
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Examples</h3>
                <p>The C# examples for <strong>{term.title}</strong>, as one program. Each line ending in <code>{'// =>'}</code> prints its value through <code>Dump</code>, so you can check it against the comment.</p>
                <p className="opacity-75">Change anything and run it again. Exercises, where there are any, are in the tabs above.</p>
              </div>
            )}
          </section>

          <section className="flex min-h-0 flex-col" aria-label="Editor">
            <div className="min-h-[200px] flex-1">
              <CodeEditor value={session.code} onChange={session.setCode} diagnostics={session.diagnostics} onRun={session.run}
                onEditorMount={(editor) => { editorRef.current = editor; }} isDark={isDark}
                ariaLabel={exercise ? `C# code for ${exercise.title}` : `C# examples for ${term.title}`} />
            </div>
            <RunBar session={session} isDark={isDark} className={`border-t ${line}`} />
            <RunConsole session={session} onGoTo={goTo} className={`h-44 border-t ${line} ${subtle}`} />
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
