import React from 'react';

/**
 * Minimal renderer for the article bodies in blog-posts.ts.
 *
 * The bodies are plain strings so they stay easy to edit and diff. Only three
 * constructs are supported, which is everything the articles use:
 *
 *   "## Заголовок"  → <h2>
 *   "- пункт"       → <li> (consecutive lines collapse into one <ul>)
 *   anything else   → <p>
 *
 * Typography comes from the project's existing `.legal` styles, so nothing here
 * carries its own visual decisions.
 */
export function renderArticle(content: string): React.ReactElement[] {
  const blocks = content.trim().split(/\n{2,}/);
  const nodes: React.ReactElement[] = [];

  blocks.forEach((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('## ')) {
      nodes.push(<h2 key={index}>{trimmed.slice(3).trim()}</h2>);
      return;
    }

    const lines = trimmed.split('\n').map((line) => line.trim());

    if (lines.every((line) => line.startsWith('- '))) {
      nodes.push(
        <ul key={index}>
          {lines.map((line, i) => (
            <li key={i}>{line.slice(2).trim()}</li>
          ))}
        </ul>
      );
      return;
    }

    nodes.push(<p key={index}>{lines.join(' ')}</p>);
  });

  return nodes;
}
