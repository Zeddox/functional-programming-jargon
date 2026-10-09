import React from 'react';
import { Loader2, Play, RotateCcw } from 'lucide-react';
import InlineText from '../InlineText';
import { codeTheme } from './theme';

const STATUS_TEXT = {
  idle: 'Starting .NET…',
  loading: 'Starting .NET (the first time downloads about 13 MB)…',
  ready: 'Ready',
  running: 'Running…',
  restarting: 'Restarting .NET…',
  error: 'The C# runner failed to start',
  unavailable: 'The C# runner isn’t built here. Run `npm run build:runner` in app/.',
};

// Run and Reset, plus what the runner is doing. Takes a useCodeSession() result.
export default function RunBar({ session, isDark, className = '' }) {
  const { button } = codeTheme(isDark);
  const { status, boot, ready } = session;
  return (
    <div className={`flex flex-wrap items-center gap-2 px-3 py-2 ${className}`}>
      <button type="button" onClick={session.run} disabled={!ready} data-testid="codelab-run"
        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-40">
        {status === 'running' ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} Run
      </button>
      <button type="button" onClick={session.reset} className={button}><RotateCcw size={13} /> Reset</button>
      <span className="text-[11px] opacity-50">Ctrl/⌘ + Enter</span>
      <span className="ml-auto text-[11px] opacity-70" role="status" data-testid="runner-status">
        {status === 'ready' && boot ? `Ready · .NET started in ${(boot.bootMs / 1000).toFixed(1)} s` : <InlineText text={STATUS_TEXT[status] ?? status} isDark={isDark} />}
      </span>
    </div>
  );
}
