import React from 'react';

// Category emblems (math/FP symbols), drawn in the graph's nodes and in topic tags
export const CATEGORY_SYMBOLS = {
  'core-functions': 'λ',
  'composition': '∘',
  'purity-state': '≡',
  'category-morphisms': '→',
  'algebraic-structures': '★',
  'effects': '↯',
  'types-data': '∑',
  'lambda-calculus': 'β'
};

const FALLBACK_COLOR = '#64748b';

// The drawer header's topic tag: tinted fill, faint border, text in the topic's
// colour. Active (a picked topic) deepens the tint and draws the full border.
export const topicTagStyle = (color = FALLBACK_COLOR, active = false) => ({
  borderColor: active ? color : `${color}50`,
  backgroundColor: active ? `${color}40` : `${color}14`,
  color
});

// The topic's emblem, where a plain tag would have a coloured square
export function TopicSymbol({ category, className = '' }) {
  const symbol = CATEGORY_SYMBOLS[category];
  if (!symbol) return null;
  return <span aria-hidden="true" className={`font-bold leading-none ${className}`}>{symbol}</span>;
}

// A topic name as a tag, e.g. "↯ Effects"
export default function TopicTag({ category, name, color, small = false }) {
  return (
    <span
      className={`border inline-flex items-center font-medium ${small ? 'px-1.5 gap-1 text-[9px]' : 'px-2 py-0.5 gap-1.5'}`}
      style={topicTagStyle(color)}
    >
      <TopicSymbol category={category} />
      {name}
    </span>
  );
}
