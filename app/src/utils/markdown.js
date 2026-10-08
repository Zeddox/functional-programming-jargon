import { marked } from 'marked';

// Links between the docs: `#term`, `readme.md#term` and `combinators.md`
// (the C# combinator reference, shown in the app as a popup).
const COMBINATORS_HREF = /^(\.\/)?combinators\.md(#.*)?$/i;
const TERM_HREF = /^(?:(?:\.\/)?readme\.md)?#(.+)$/i;

// Configure marked for GitHub Flavored Markdown with custom link routing
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    link({ href, text }) {
      if (href && COMBINATORS_HREF.test(href)) {
        return `<a href="#combinators" data-combinators="true" class="internal-term-link">${text}</a>`;
      }
      const term = href && TERM_HREF.exec(href);
      if (term) {
        const termId = term[1].toLowerCase();
        return `<a href="#${termId}" data-term-id="${termId}" class="internal-term-link">${text}</a>`;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
  }
});

// Splits markdown into interleaved prose (rendered to HTML) and code blocks
export function splitMarkdownParts(markdown) {
  const parts = [];
  const codeRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  const pushText = (text) => {
    if (text.trim()) parts.push({ type: 'markdown', html: marked.parse(text.trim()) });
  };

  while ((match = codeRegex.exec(markdown)) !== null) {
    pushText(markdown.slice(lastIndex, match.index));
    // A fence with no language is notation (lambda calculus, Haskell, pseudo-code), not C#
    parts.push({ type: 'code', lang: match[1] || 'text', code: match[2].trim() });
    lastIndex = codeRegex.lastIndex;
  }
  pushText(markdown.slice(lastIndex));

  return parts;
}

// Where a clicked link inside rendered markdown should go, if it stays in-app
export function internalLinkTarget(link) {
  if (!link) return null;
  if (link.getAttribute('data-combinators')) return { type: 'combinators' };
  const href = link.getAttribute('href') || '';
  const termId = link.getAttribute('data-term-id') || (href.startsWith('#') ? href.slice(1) : null);
  if (termId === 'combinators') return { type: 'combinators' };
  return termId ? { type: 'term', id: termId.toLowerCase() } : null;
}
