import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X, ExternalLink, Link2, BookOpen, GitFork, Check, ChevronUp, ChevronDown,
  Route, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, List, Flag,
  SquareTerminal, CheckCircle2, CircleDashed
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { splitMarkdownParts, internalLinkTarget } from '../utils/markdown';
import { stepIndexOf } from '../utils/learning';
import CodeBlock from './CodeBlock';
import InlineText from './InlineText';
import TopicTag, { TopicSymbol, topicTagStyle } from './TopicTag';

export default function NodeDetailPanel({
  term,
  categories,
  allTermsMap,
  onSelectTerm,
  onClose,
  onOpenCombinators,
  paths = [],
  progress = { active: null, paths: {} },
  activePath = null,
  activeStepIndex = -1,
  onStartPath,
  onResumePath,
  onGoToStep,
  onPausePath,
  onFinishPath,
  onOpenCodeLab,
  passedExercises = {},
  soundEnabled,
  useCategoryColors,
  isDark,
  width,
  onResize,
  isResizing,
  onResizingChange
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const bodyRef = useRef(null);

  // Reset to peek mode and the top of the content whenever term changes
  useEffect(() => {
    setIsExpanded(false);
    setShowSteps(false);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [term?.id]);

  if (!term) return null;

  const cat = categories[term.category] || {};

  // Learning paths: is this term the active path's current step, a detour
  // from it, or a possible starting point for a path?
  const isPathStep = Boolean(activePath) && stepIndexOf(activePath, term.id) === activeStepIndex && activeStepIndex >= 0;
  const step = isPathStep ? activePath.steps[activeStepIndex] : null;
  const nextStep = isPathStep ? activePath.steps[activeStepIndex + 1] : null;
  const isLastStep = isPathStep && !nextStep;
  const pathsWithTerm = paths.filter(p => p.id !== activePath?.id && stepIndexOf(p, term.id) >= 0);
  const pathAct = (fn) => () => {
    fn();
    soundEffects.select(soundEnabled);
  };
  const pathButton = `flex items-center justify-center gap-1.5 px-2.5 py-1.5 border text-[11px] transition disabled:opacity-35 disabled:pointer-events-none ${
    isDark
      ? 'hover:bg-[#242422] border-[rgba(240,240,238,0.18)]'
      : 'hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.18)]'
  }`;
  const pathPrimary = `flex items-center justify-center gap-1.5 px-2.5 py-1.5 border text-[11px] transition ${
    isDark
      ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/40'
      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-600/40'
  }`;
  const accentColor = useCategoryColors ? (cat.color || '#64748b') : (isDark ? '#e2e8f0' : '#1e293b');

  // Copy share permalink
  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${term.id}`;
    navigator.clipboard.writeText(url);
    window.location.hash = term.id;
    setCopiedLink(true);
    soundEffects.toggle(soundEnabled);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Interleaved explanation markdown & code blocks
  const contentParts = useMemo(() => {
    if (!term || !term.body) return [];

    // Strip trailing further reading section since it has a dedicated section
    const cleanBody = term.body.replace(/\n*__Further reading[\s\S]*$/i, '').trim();
    return splitMarkdownParts(cleanBody);
  }, [term]);

  // Click handler to catch internal markdown links and switch concepts
  const handleContentClick = (e) => {
    const target = internalLinkTarget(e.target.closest('a'));
    if (target?.type === 'combinators') {
      e.preventDefault();
      onOpenCombinators();
      soundEffects.toggle(soundEnabled);
    } else if (target?.type === 'term' && allTermsMap && allTermsMap[target.id]) {
      e.preventDefault();
      onSelectTerm(target.id);
      soundEffects.select(soundEnabled);
    }
  };

  // Drag the left edge to resize the desktop drawer
  const handleResizeStart = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    onResizingChange(true);

    const handleMove = (ev) => onResize(window.innerWidth - ev.clientX);
    const handleEnd = () => {
      handle.removeEventListener('pointermove', handleMove);
      handle.removeEventListener('pointerup', handleEnd);
      handle.removeEventListener('pointercancel', handleEnd);
      onResizingChange(false);
    };
    handle.addEventListener('pointermove', handleMove);
    handle.addEventListener('pointerup', handleEnd);
    handle.addEventListener('pointercancel', handleEnd);
  };

  const handleResizeKey = (e) => {
    const step = e.shiftKey ? 64 : 16;
    if (e.key === 'ArrowLeft') onResize(width + step);
    else if (e.key === 'ArrowRight') onResize(width - step);
    else return;
    e.preventDefault();
  };

  return (
    <aside
      style={{ '--panel-w': `${width}px` }}
      className={`fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:top-0 w-full sm:w-[var(--panel-w)] ${
        isExpanded ? 'h-[85vh]' : 'h-[46vh]'
      } sm:h-full rounded-t-2xl sm:rounded-none backdrop-blur-md border-t sm:border-t-0 sm:border-l z-50 flex flex-col font-mono shadow-2xl ${
        isResizing ? 'select-none' : 'transition-all duration-300 ease-[var(--ease-out-expo)]'
      } ${
        isDark
          ? 'bg-[#121212]/95 border-[rgba(240,240,238,0.15)] text-[#f0f0ee]'
          : 'bg-[#eaeae8]/98 border-[rgba(26,26,25,0.15)] text-[#1a1a19]'
      }`}
    >
      {/* Desktop Resize Handle (drag, arrow keys, or double-click to reset) */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        aria-valuenow={Math.round(width)}
        tabIndex={0}
        title="Drag to resize · double-click to reset"
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKey}
        onDoubleClick={() => onResize(null)}
        className="group hidden sm:block absolute inset-y-0 -left-1.5 w-3 z-10 cursor-col-resize touch-none focus:outline-none"
      >
        <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 transition-colors ${
          isResizing
            ? (isDark ? 'bg-[#f0f0ee]/50' : 'bg-[#1a1a19]/50')
            : (isDark
              ? 'bg-transparent group-hover:bg-[#f0f0ee]/30 group-focus-visible:bg-[#f0f0ee]/50'
              : 'bg-transparent group-hover:bg-[#1a1a19]/30 group-focus-visible:bg-[#1a1a19]/50')
        }`} />
      </div>

      {/* Mobile Swipe / Tap Grab Handle */}
      <div
        className="sm:hidden flex flex-col items-center justify-center pt-2.5 pb-1 cursor-pointer select-none"
        onClick={() => {
          setIsExpanded(prev => !prev);
          soundEffects.toggle(soundEnabled);
        }}
        title={isExpanded ? 'Tap to collapse' : 'Tap to expand'}
      >
        <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#f0f0ee]/25' : 'bg-[#1a1a19]/25'}`} />
      </div>

      {/* Header Bar */}
      <div className={`px-4 sm:px-5 py-3 sm:py-5 border-b flex items-start justify-between gap-3 ${
        isDark ? 'border-[rgba(240,240,238,0.1)] bg-[#1a1a19]/60' : 'border-[rgba(26,26,25,0.1)] bg-[#dededb]/60'
      }`}>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <TopicTag category={term.category} name={cat.name} color={cat.color} />
            <span className="opacity-50 text-[10px]">
              #{term.id}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {term.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile Expand / Collapse Button */}
          <button
            onClick={() => {
              setIsExpanded(prev => !prev);
              soundEffects.toggle(soundEnabled);
            }}
            title={isExpanded ? 'Collapse sheet' : 'Expand sheet'}
            className={`sm:hidden px-2 py-1 text-xs border transition flex items-center gap-1 ${
              isDark
                ? 'text-[#f0f0ee]/70 hover:text-[#f0f0ee] hover:bg-[#242422] border-[rgba(240,240,238,0.15)]'
                : 'text-[#1a1a19]/70 hover:text-[#1a1a19] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            title="Copy shareable permalink"
            className={`px-2 py-1 text-xs border transition flex items-center gap-1 ${
              isDark
                ? 'text-[#f0f0ee]/70 hover:text-[#f0f0ee] hover:bg-[#242422] border-[rgba(240,240,238,0.15)]'
                : 'text-[#1a1a19]/70 hover:text-[#1a1a19] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline text-[10px]">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          {/* Close Drawer Button */}
          <button
            onClick={() => {
              onClose();
              soundEffects.toggle(soundEnabled);
            }}
            title="Close"
            className={`px-2 py-1 text-xs border transition flex items-center gap-1 ${
              isDark
                ? 'text-[#f0f0ee]/70 hover:text-[#f0f0ee] hover:bg-[#242422] border-[rgba(240,240,238,0.15)]'
                : 'text-[#1a1a19]/70 hover:text-[#1a1a19] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)]'
            }`}
          >
            <span className="hidden sm:inline text-[10px]">[ Esc ]</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Learning path: where this step sits and why it comes next */}
        {isPathStep && (
          <section
            data-testid="path-step"
            className={`border p-4 space-y-3 ${
              isDark ? 'border-amber-400/35 bg-amber-400/[0.06]' : 'border-amber-600/35 bg-amber-500/[0.07]'
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-widest">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                <Route className="w-3 h-3" /> {activePath.title}
              </span>
              <span className="opacity-70 shrink-0">Step {activeStepIndex + 1} of {activePath.steps.length}</span>
            </div>

            <div className="flex gap-0.5" aria-hidden="true">
              {activePath.steps.map((s, i) => (
                <span
                  key={s.termId}
                  className={`h-1 flex-1 ${
                    i === activeStepIndex ? 'bg-amber-500'
                      : progress.paths[activePath.id]?.seen.includes(s.termId) ? 'bg-amber-500/50'
                      : isDark ? 'bg-[#f0f0ee]/12' : 'bg-[#1a1a19]/12'
                  }`}
                />
              ))}
            </div>

            {activeStepIndex === 0 && (
              <p className="text-[11px] leading-relaxed opacity-75"><InlineText text={activePath.intro} isDark={isDark} /></p>
            )}

            <div>
              <h4 className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                {activeStepIndex === 0 ? 'Where to start' : 'Why this comes next'}
              </h4>
              <p className="text-[12.5px] leading-relaxed"><InlineText text={step.note} isDark={isDark} /></p>
            </div>

            {/* Later: exercises and animated explainers for this step go here */}

            {/* Every step, to jump back or ahead */}
            <div>
              <button
                onClick={() => setShowSteps(v => !v)}
                aria-expanded={showSteps}
                className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 flex items-center gap-1.5"
              >
                <List className="w-3 h-3" /> {showSteps ? 'Hide steps' : 'All steps'}
              </button>
              {showSteps && (
                <ol className="mt-2 space-y-0.5 text-[11px]">
                  {activePath.steps.map((s, i) => {
                    const seen = progress.paths[activePath.id]?.seen.includes(s.termId);
                    return (
                      <li key={s.termId}>
                        <button
                          onClick={pathAct(() => onGoToStep(i))}
                          className={`w-full text-left px-2 py-1 flex items-center gap-2 transition ${
                            i === activeStepIndex
                              ? (isDark ? 'bg-amber-400/15' : 'bg-amber-500/15')
                              : (isDark ? 'hover:bg-[#242422]' : 'hover:bg-[#dcdcd9]')
                          }`}
                        >
                          <span className={`w-5 text-right tabular-nums ${seen ? 'text-amber-500' : 'opacity-50'}`}>{i + 1}</span>
                          <span className={i === activeStepIndex ? 'font-semibold' : ''}>{allTermsMap[s.termId]?.title}</span>
                          {seen && i !== activeStepIndex && <Check className="w-3 h-3 text-amber-500 ml-auto" />}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </section>
        )}

        {/* Looking at something off the active path */}
        {activePath && !isPathStep && (
          <div className={`flex items-center justify-between gap-3 px-3 py-2 border text-[11px] ${
            isDark ? 'border-amber-400/30' : 'border-amber-600/30'
          }`}>
            <span className="opacity-75 min-w-0 truncate">
              On <strong>{activePath.title}</strong>, step {activeStepIndex + 1} of {activePath.steps.length}
            </span>
            <button className={pathPrimary} onClick={pathAct(() => onGoToStep(activeStepIndex))}>
              <ChevronLeft className="w-3 h-3" /> Back to path
            </button>
          </div>
        )}
        {/* Definition Summary Box */}
        <div className={`p-4 border ${
          isDark
            ? 'bg-[#1a1a19] border-[rgba(240,240,238,0.12)]'
            : 'bg-[#dededb] border-[rgba(26,26,25,0.12)]'
        }`}>
          <h4 className="text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-60">
            <BookOpen className="w-3 h-3" />
            <span>Definition</span>
          </h4>
          <p className="text-xs leading-relaxed prose-selectable font-normal">
            {term.summary}
          </p>
        </div>

        {/* Paths that pass through this term */}
        {!isPathStep && pathsWithTerm.length > 0 && (
          <section data-testid="term-paths" className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1.5">
              <Route className="w-3 h-3" /> On {pathsWithTerm.length === 1 ? 'a learning path' : 'learning paths'}
            </h4>
            {pathsWithTerm.map(path => {
              const at = stepIndexOf(path, term.id);
              const entry = progress.paths[path.id];
              const resumeAt = entry && !entry.done ? stepIndexOf(path, entry.current) : -1;
              return (
                <div key={path.id} className={`border p-3 space-y-2 ${
                  isDark ? 'border-[rgba(240,240,238,0.12)]' : 'border-[rgba(26,26,25,0.12)]'
                }`}>
                  <div className="flex items-baseline justify-between gap-3 text-[11px]">
                    <span className="font-semibold">{path.title}</span>
                    <span className="opacity-60 shrink-0">step {at + 1} of {path.steps.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeAt >= 0 && (
                      <button className={pathPrimary} onClick={pathAct(() => onResumePath(path.id))}>
                        <Play className="w-3 h-3" /> Resume at step {resumeAt + 1}
                      </button>
                    )}
                    {at > 0 && resumeAt !== at && (
                      <button
                        className={resumeAt >= 0 ? pathButton : pathPrimary}
                        onClick={pathAct(() => onStartPath(path.id, term.id))}
                      >
                        <Play className="w-3 h-3" /> Start here
                      </button>
                    )}
                    <button
                      className={at === 0 && !entry ? pathPrimary : pathButton}
                      onClick={pathAct(() => onStartPath(path.id, null, { restart: Boolean(entry) }))}
                    >
                      {entry ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {entry ? 'Restart from step 1' : at === 0 ? 'Start path' : 'From step 1'}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Interleaved Explanation & Code Examples */}
        <div className="space-y-3 pt-1" onClick={handleContentClick}>
          <h4 className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-between">
            <span>Explanation & Examples</span>
            {term.hasPlayground && onOpenCodeLab ? (
              <button
                type="button"
                onClick={() => onOpenCodeLab(null)}
                data-testid="try-it"
                className={`normal-case tracking-normal text-[11px] inline-flex items-center gap-1 px-2 py-0.5 border transition ${
                  isDark ? 'border-[rgba(240,240,238,0.2)] hover:bg-[#242422]' : 'border-[rgba(26,26,25,0.2)] hover:bg-[#dcdcd9]'
                }`}
              >
                <SquareTerminal size={12} /> Try it
              </button>
            ) : term.codeBlocks?.length > 0 && (
              <span className="text-[10px] opacity-70">
                {term.codeBlocks.length} code {term.codeBlocks.length === 1 ? 'block' : 'blocks'}
              </span>
            )}
          </h4>

          <div className="space-y-4">
            {contentParts.map((part, idx) => {
              if (part.type === 'code') {
                return (
                  <CodeBlock
                    key={`code-${idx}`}
                    code={part.code}
                    language={part.lang}
                    isDark={isDark}
                    soundEnabled={soundEnabled}
                    showLineNumbers={true}
                  />
                );
              }
              return (
                <div
                  key={`md-${idx}`}
                  className="prose-fp prose-selectable text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: part.html }}
                />
              );
            })}
          </div>
        </div>

        {/* Exercises for this term (exercises.md), run in the browser */}
        {term.exercises?.length > 0 && onOpenCodeLab && (
          <section data-testid="term-exercises" className={`p-4 border space-y-2 ${
            isDark ? 'border-emerald-400/25' : 'border-emerald-700/25'
          }`}>
            <h4 className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1.5">
              <SquareTerminal size={12} /> Exercises
            </h4>
            {term.exercises.map(exercise => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onOpenCodeLab(exercise.id)}
                className={`w-full text-left flex items-start gap-2 p-2 transition ${isDark ? 'hover:bg-[#242422]' : 'hover:bg-[#dcdcd9]'}`}
              >
                {passedExercises[exercise.id]
                  ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" aria-label="Passed" />
                  : <CircleDashed size={14} className="mt-0.5 shrink-0 opacity-60" aria-label="Not done yet" />}
                <span className="space-y-0.5">
                  <span className="block text-[12.5px] font-semibold">{exercise.title}</span>
                  <span className="block text-[11px] leading-relaxed opacity-70"><InlineText text={exercise.brief} isDark={isDark} /></span>
                </span>
              </button>
            ))}
          </section>
        )}

        {/* Path mode: preview of the next step */}
        {nextStep && (
          <button
            onClick={pathAct(() => onGoToStep(activeStepIndex + 1))}
            className={`w-full text-left border p-4 space-y-1.5 transition ${
              isDark
                ? 'border-amber-400/30 hover:bg-amber-400/[0.06]'
                : 'border-amber-600/30 hover:bg-amber-500/[0.07]'
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1.5">
              Up next · step {activeStepIndex + 2}
            </span>
            <span className="block text-[13px] font-semibold">{allTermsMap[nextStep.termId]?.title}</span>
            <span className="block text-[11px] leading-relaxed opacity-75"><InlineText text={nextStep.note} isDark={isDark} /></span>
          </button>
        )}

        {/* Connected Concepts in Knowledge Graph */}
        {term.relatedIds && term.relatedIds.length > 0 && (
          <div className={`p-4 border space-y-2.5 ${
            isDark ? 'bg-[#1a1a19]/70 border-[rgba(240,240,238,0.12)]' : 'bg-[#dededb]/70 border-[rgba(26,26,25,0.12)]'
          }`}>
            <h4 className="text-[10px] uppercase tracking-widest flex items-center gap-1.5 opacity-60">
              <GitFork className="w-3 h-3" />
              <span>Connected Concepts ({term.relatedIds.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {term.relatedIds.map(relId => {
                const relTerm = allTermsMap[relId];
                if (!relTerm) return null;
                const relCat = categories[relTerm.category];
                return (
                  <button
                    key={relId}
                    onClick={() => {
                      onSelectTerm(relId);
                      soundEffects.select(soundEnabled);
                    }}
                    // Styled as the related term's topic tag
                    title={relCat?.name}
                    className="px-2 py-1 text-xs border transition flex items-center gap-1.5 hover:brightness-125"
                    style={topicTagStyle(relCat?.color)}
                  >
                    <TopicSymbol category={relTerm.category} />
                    <span>{relTerm.title}</span>
                    <span className="opacity-40">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* C# combinator reference (shown for terms that link to it) */}
        {onOpenCombinators && /\bcombinators\.md\b/.test(term.body) && (
          <button
            onClick={() => {
              onOpenCombinators();
              soundEffects.toggle(soundEnabled);
            }}
            className={`w-full px-3.5 py-3 border text-left flex items-center gap-3 transition ${
              isDark
                ? 'border-[rgba(240,240,238,0.15)] bg-[#1a1a19] hover:bg-[#242422] hover:border-[rgba(240,240,238,0.35)]'
                : 'border-[rgba(26,26,25,0.15)] bg-[#dededb] hover:bg-[#d4d4d1] hover:border-[rgba(26,26,25,0.35)]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 opacity-70" />
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-semibold">Combinator reference</span>
              <span className="block text-[11px] opacity-60">I, K, S, B, C, Y and friends in C#</span>
            </span>
            <span className="text-[10px] opacity-50">Open →</span>
          </button>
        )}

        {/* Further Reading Links */}
        {term.furtherReading && term.furtherReading.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] uppercase tracking-widest opacity-60">
              Further Reading
            </h4>
            <ul className="space-y-1.5">
              {term.furtherReading.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs hover:underline opacity-85 hover:opacity-100 transition"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: path controls on a path step */}
      {isPathStep && (
        <div
          data-testid="path-controls"
          className={`px-3 py-2.5 border-t flex items-center gap-2 ${
            isDark ? 'border-amber-400/25 bg-[#1a1a19]/80' : 'border-amber-600/25 bg-[#dededb]/80'
          }`}
        >
          <button
            className={pathButton}
            disabled={activeStepIndex === 0}
            onClick={pathAct(() => onGoToStep(activeStepIndex - 1))}
            aria-label="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button className={pathButton} onClick={pathAct(onPausePath)} title="Pause; resume any time from Paths">
            <Pause className="w-3 h-3" /> Pause
          </button>
          <button
            className={pathButton}
            onClick={pathAct(() => onStartPath(activePath.id, null, { restart: true }))}
            title="Restart from step 1"
            aria-label="Restart path"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          {isLastStep ? (
            <button className={`${pathPrimary} ml-auto`} onClick={pathAct(onFinishPath)}>
              <Flag className="w-3 h-3" /> Finish path
            </button>
          ) : (
            <button className={`${pathPrimary} ml-auto`} onClick={pathAct(() => onGoToStep(activeStepIndex + 1))}>
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Footer / Quick Actions */}
      <div className={`${isPathStep ? 'hidden' : ''} p-3.5 border-t flex items-center justify-between text-[11px] ${
        isDark ? 'border-[rgba(240,240,238,0.1)] bg-[#1a1a19]/40 opacity-70' : 'border-[rgba(26,26,25,0.1)] bg-[#dededb]/40 opacity-70'
      }`}>
        <a
          href={`https://github.com/hemanth/functional-programming-jargon#${term.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline transition"
        >
          <ExternalLink className="w-3 h-3" />
          <span>View Source on GitHub</span>
        </a>

        <span>FP Jargon</span>
      </div>
    </aside>
  );
}
