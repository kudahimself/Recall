import React from 'react';
import './DataTables.css';

/**
 * Render prose that marks code with backticks (`like this`), as question
 * explanations do, with each backticked span as inline <code>. An unpaired
 * backtick is shown as written.
 */
export function renderInlineCode(text: string): React.ReactNode[] {
  const parts = text.split('`');
  // An even number of parts means an odd number of backticks: the last one has
  // no partner, so glue it back onto the trailing text.
  if (parts.length % 2 === 0) {
    const tail = parts.pop() as string;
    parts[parts.length - 1] += '`' + tail;
  }
  return parts.map((part, i) =>
    i % 2 === 1 ? <code key={i} className="inline-code">{part}</code> : part,
  );
}
