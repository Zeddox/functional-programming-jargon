import React from 'react';
import { X, Route, Play, RotateCcw, Check } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { stepIndexOf } from '../utils/learning';
import InlineText from './InlineText';

// Picker listing every learning path with its progress
export default function PathsModal({
  isOpen,
  paths,
  progress,
  allTermsMap,
  onStartPath,
  onResumePath,
  onClose,
  soundEnabled,
  isDark
}) {
  if (!isOpen) return null;

  const border = isDark ? 'border-[rgba(240,240,238,0.12)]' : 'border-[rgba(26,26,25,0.12)]';
  const button = `flex items-center gap-1.5 px-2.5 py-1 border text-[11px] transition ${
    isDark
      ? 'hover:bg-[#242422] border-[rgba(240,240,238,0.18)]'
      : 'hover:bg-[#dcdcd9] border-[rgba(26,26,25,0.18)]'
  }`;
  const primary = `flex items-center gap-1.5 px-2.5 py-1 border text-[11px] transition ${
    isDark
      ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/40'
      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-600/40'
  }`;

  const act = (fn) => () => {
    fn();
    soundEffects.select(soundEnabled);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-10 sm:pt-14 px-3 sm:px-4 bg-black/60 backdrop-blur-sm font-mono animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Learning paths"
        className={`relative w-full max-w-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
          isDark
            ? 'bg-[#141414] border-[rgba(240,240,238,0.18)] text-[#f0f0ee]'
            : 'bg-[#eaeae8] border-[rgba(26,26,25,0.18)] text-[#1a1a19]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-4 sm:px-5 py-3.5 border-b flex items-start justify-between gap-3 ${border} ${
          isDark ? 'bg-[#1a1a19]' : 'bg-[#dededb]'
        }`}>
          <div>
            <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-500" /> Learning paths
            </h2>
            <p className="text-[11px] opacity-60 mt-0.5">
              Guided routes through the graph. Each step says why it comes next. Progress is saved in this browser.
            </p>
          </div>
          <button onClick={onClose} title="Close" className={button}>
            <span className="hidden sm:inline text-[10px]">[ Esc ]</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <ul className="overflow-y-auto divide-y divide-[rgba(128,128,128,0.15)]">
          {paths.map(path => {
            const entry = progress.paths[path.id];
            const at = entry ? stepIndexOf(path, entry.current) : -1;
            const seen = entry ? entry.seen.length : 0;
            const isActive = progress.active === path.id;
            return (
              <li key={path.id} className="px-4 sm:px-5 py-4 space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[13px] font-semibold">{path.title}</h3>
                  <span className="text-[10px] opacity-60 shrink-0">
                    {entry?.done ? (
                      <span className="flex items-center gap-1 text-emerald-500"><Check className="w-3 h-3" /> finished</span>
                    ) : entry ? `step ${at + 1} of ${path.steps.length}` : `${path.steps.length} steps`}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-75"><InlineText text={path.intro} isDark={isDark} /></p>
                <p className="text-[10px] leading-relaxed opacity-50">
                  {path.steps.map(s => allTermsMap[s.termId]?.title).join(' → ')}
                </p>

                {/* Steps seen so far */}
                {entry && (
                  <div className="flex gap-0.5" aria-hidden="true">
                    {path.steps.map(s => (
                      <span
                        key={s.termId}
                        className={`h-1 flex-1 ${entry.seen.includes(s.termId) ? 'bg-amber-500' : isDark ? 'bg-[#f0f0ee]/12' : 'bg-[#1a1a19]/12'}`}
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {entry && !entry.done ? (
                    <>
                      <button className={primary} onClick={act(() => onResumePath(path.id))}>
                        <Play className="w-3 h-3" /> {isActive ? 'Continue' : 'Resume'} at step {at + 1}
                      </button>
                      <button className={button} onClick={act(() => onStartPath(path.id, null, { restart: true }))}>
                        <RotateCcw className="w-3 h-3" /> Restart
                      </button>
                    </>
                  ) : (
                    <button className={primary} onClick={act(() => onStartPath(path.id, null, { restart: Boolean(entry) }))}>
                      <Play className="w-3 h-3" /> {entry ? 'Start again' : 'Start'}
                    </button>
                  )}
                  {seen > 0 && !entry?.done && (
                    <span className="text-[10px] opacity-50 self-center">{seen} of {path.steps.length} seen</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
