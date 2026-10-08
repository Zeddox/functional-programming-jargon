import React from 'react';

// Renders the little markdown a learning-path note uses: `code` and *emphasis*
export default function InlineText({ text, isDark }) {
  const parts = String(text || '').split(/(`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return (
        <code
          key={i}
          className={`px-1 py-px text-[0.95em] ${isDark ? 'bg-[#f0f0ee]/10' : 'bg-[#1a1a19]/10'}`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
