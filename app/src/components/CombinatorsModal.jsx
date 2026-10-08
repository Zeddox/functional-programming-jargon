import React, { useMemo, useRef, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { splitMarkdownParts, internalLinkTarget } from '../utils/markdown';
import CodeBlock from './CodeBlock';

const SOURCE_URL = 'https://github.com/Zeddox/functional-programming-jargon/blob/worktree-csharp-language-ext/combinators.md';

// Popup with the C# function combinator reference (combinators.md)
export default function CombinatorsModal({
  isOpen,
  combinators,
  onClose,
  onSelectTerm,
  soundEnabled,
  isDark
}) {
  const bodyRef = useRef(null);

  const parts = useMemo(
    () => (combinators ? splitMarkdownParts(combinators.markdown) : []),
    [combinators]
  );

  // Quick-jump chips for each `### X - name` combinator heading
  const entries = useMemo(() => {
    if (!combinators) return [];
    return [...combinators.markdown.matchAll(/^###\s+(\S+)\s+-\s+(.+)$/gm)]
      .map(([, letter, name]) => ({ letter, name: name.trim() }));
  }, [combinators]);

  // Give rendered combinator headings ids so the chips can scroll to them
  useEffect(() => {
    if (!isOpen || !bodyRef.current) return;
    bodyRef.current.querySelectorAll('h3').forEach(h => {
      const letter = h.textContent.split(/\s+/)[0];
      h.id = `combinator-${letter}`;
    });
    bodyRef.current.scrollTop = 0;
  }, [isOpen, parts]);

  if (!isOpen || !combinators) return null;

  const jumpTo = (letter) => {
    const heading = bodyRef.current?.querySelector(`#combinator-${CSS.escape(letter)}`);
    heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContentClick = (e) => {
    const target = internalLinkTarget(e.target.closest('a'));
    if (target?.type === 'combinators') {
      e.preventDefault();
      bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target?.type === 'term') {
      e.preventDefault();
      onSelectTerm(target.id);
      soundEffects.select(soundEnabled);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-10 sm:pt-14 px-3 sm:px-4 bg-black/60 backdrop-blur-sm font-mono animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={combinators.title}
        className={`relative w-full max-w-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
          isDark
            ? 'bg-[#141414] border-[rgba(240,240,238,0.18)] text-[#f0f0ee]'
            : 'bg-[#eaeae8] border-[rgba(26,26,25,0.18)] text-[#1a1a19]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-4 sm:px-5 py-3.5 border-b space-y-3 ${
          isDark ? 'border-[rgba(240,240,238,0.12)] bg-[#1a1a19]' : 'border-[rgba(26,26,25,0.12)] bg-[#dededb]'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest opacity-60">Reference</div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">{combinators.title}</h2>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="View source on GitHub"
                className={`px-2 py-1 text-xs border transition flex items-center gap-1 ${
                  isDark
                    ? 'text-[#f0f0ee]/70 hover:text-[#f0f0ee] hover:bg-[#242422] border-[rgba(240,240,238,0.15)]'
                    : 'text-[#1a1a19]/70 hover:text-[#1a1a19] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)]'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Source</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  soundEffects.toggle(soundEnabled);
                }}
                title="Close [Esc]"
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

          {/* Quick jump */}
          {entries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entries.map(({ letter, name }) => (
                <button
                  key={letter}
                  onClick={() => jumpTo(letter)}
                  title={name}
                  className={`px-2 py-0.5 text-[11px] border transition flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-[#121212] hover:bg-[#242422] border-[rgba(240,240,238,0.15)] hover:border-[rgba(240,240,238,0.4)]'
                      : 'bg-[#eaeae8] hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.15)] hover:border-[rgba(26,26,25,0.4)]'
                  }`}
                >
                  <span className="font-bold">{letter}</span>
                  <span className="opacity-60">{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" onClick={handleContentClick}>
          {parts.map((part, idx) =>
            part.type === 'code' ? (
              <CodeBlock
                key={`code-${idx}`}
                code={part.code}
                language={part.lang}
                isDark={isDark}
                soundEnabled={soundEnabled}
                showLineNumbers={true}
              />
            ) : (
              <div
                key={`md-${idx}`}
                className="prose-fp prose-selectable text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: part.html }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
