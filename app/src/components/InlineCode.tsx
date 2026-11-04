import React from 'react';
import { Course, Topic } from '../types';
import { getCourseForTopic } from '../utils/courseConfig';
import './DataTables.css';

/**
 * Render a SQL-course question's prose, which marks code with backticks
 * (`like this`), with each backticked span as inline <code>. An unpaired
 * backtick is shown as written. Other courses show their text unchanged, since
 * their backticks can be real code such as JS template literals.
 */
export function renderInlineCode(text: string, topic: Topic): React.ReactNode[] {
  if (getCourseForTopic(topic) !== Course.SQL) return [text];
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
