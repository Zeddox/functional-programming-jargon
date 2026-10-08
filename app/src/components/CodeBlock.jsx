import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-csharp';
import { Check, Copy } from 'lucide-react';
import { soundEffects } from '../utils/audio';

const LANGUAGE_LABELS = {
  csharp: 'C#',
  cs: 'C#',
  javascript: 'JavaScript',
  js: 'JavaScript',
  text: 'Notation'
};

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function CodeBlock({
  code,
  language = 'csharp',
  isDark = true,
  soundEnabled = true,
  showLineNumbers = true
}) {
  const [copied, setCopied] = useState(false);

  // Memoize highlighted code HTML
  const highlightedHtml = useMemo(() => {
    // Notation (an unlabelled fence) is shown as plain text
    if (language === 'text') return escapeHtml(code.trim());
    try {
      const grammar = Prism.languages[language] || Prism.languages.csharp;
      return Prism.highlight(code.trim(), grammar, language);
    } catch {
      return code;
    }
  }, [code, language]);

  // Split lines for line numbers
  const lines = useMemo(() => {
    return code.trim().split('\n');
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    soundEffects.toggle(soundEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-one-dark relative overflow-hidden border transition-colors font-mono ${
      isDark
        ? 'border-[rgba(240,240,238,0.15)] shadow-lg'
        : 'border-[rgba(26,26,25,0.25)] shadow-md'
    }`}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b text-xs select-none bg-[#21252b] border-[#181a1f] text-[#abb2bf]/70">
        <div className="flex items-center gap-2">
          {/* Subtle status dot */}
          <span className="w-2 h-2 rounded-full border border-current opacity-40" />
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
            {LANGUAGE_LABELS[language] || language}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] transition border text-[#abb2bf]/80 hover:text-[#d7dae0] bg-[#282c34] hover:bg-[#2c313a] border-[#3e4451]"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 opacity-70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Editor Body */}
      <div className="overflow-x-auto p-3.5 flex font-mono text-xs leading-relaxed">
        {showLineNumbers && (
          <div className="select-none pr-3.5 mr-3.5 text-right border-r font-mono text-[11px] leading-relaxed text-[#495162] border-[#3e4451]/60">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <pre className="flex-1 m-0 p-0 font-mono text-xs leading-relaxed overflow-visible text-[#abb2bf]">
          <code
            className={`language-${language} font-mono`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
