import React, { useState, useEffect, useMemo } from 'react';
import { X, ExternalLink, Link2, BookOpen, GitFork, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { splitMarkdownParts, internalLinkTarget } from '../utils/markdown';
import CodeBlock from './CodeBlock';

export default function NodeDetailPanel({
  term,
  categories,
  allTermsMap,
  onSelectTerm,
  onClose,
  onOpenCombinators,
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

  // Reset to peek mode whenever term changes
  useEffect(() => {
    setIsExpanded(false);
  }, [term?.id]);

  if (!term) return null;

  const cat = categories[term.category] || {};
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
            <span
              className="px-2 py-0.5 border flex items-center gap-1.5 font-medium"
              style={{
                borderColor: `${cat.color || '#64748b'}50`,
                backgroundColor: `${cat.color || '#64748b'}14`,
                color: cat.color || '#64748b'
              }}
            >
              <span className="w-1.5 h-1.5" style={{ backgroundColor: cat.color || '#64748b' }} />
              {cat.name}
            </span>
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
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
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

        {/* Interleaved Explanation & Code Examples */}
        <div className="space-y-3 pt-1" onClick={handleContentClick}>
          <h4 className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-between">
            <span>Explanation & Examples</span>
            {term.codeBlocks?.length > 0 && (
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
                    className={`px-2 py-1 text-xs border transition flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-[#121212] hover:bg-[#242422] text-[#f0f0ee] border-[rgba(240,240,238,0.15)] hover:border-[rgba(240,240,238,0.4)]'
                        : 'bg-[#eaeae8] hover:bg-[#dcdcd9] text-[#1a1a19] border-[rgba(26,26,25,0.15)] hover:border-[rgba(26,26,25,0.4)]'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5"
                      style={{ backgroundColor: relCat?.color || '#3b82f6' }}
                    />
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

      {/* Footer / Quick Actions */}
      <div className={`p-3.5 border-t flex items-center justify-between text-[11px] ${
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
