import React from 'react';
import { Topic } from '../types';
import { InlineText } from './ui/InlineText';

/**
 * Question prose for the types not yet on the shared QuestionShell (cloze,
 * Parsons, coding). It is the shared InlineText renderer, the same in every
 * course: `code`, **bold** and fenced blocks. The topic is no longer used.
 */
export function renderInlineCode(text: string, _topic?: Topic): React.ReactNode {
  return <InlineText text={text} />;
}
