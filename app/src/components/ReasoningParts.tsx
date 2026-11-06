import React, { useState } from 'react';
import { Question } from '../types';
import { renderInlineCode } from './InlineCode';
import { StyledButton } from './StyledButton';
import './ReasoningQuestions.css';

/**
 * Pieces shared by the decision and design question types (predict the
 * outcome, choose and justify, spot the flaw, explain): the prompt and badges,
 * the optional hint, the graded banner and the explanation with Next.
 */

export const QuestionHead: React.FC<{ question: Question; format: string }> = ({ question, format }) => (
  <>
    <h3 className="question-text">{renderInlineCode(question.question, question.topic)}</h3>
    <div className="badges-row">
      <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
      <div className="topic-badge">{question.topic.replace(/_/g, ' ').toUpperCase()}</div>
      <div className="format-badge">{format}</div>
    </div>
  </>
);

export const HintToggle: React.FC<{ question: Question; show: boolean }> = ({ question, show }) => {
  const [open, setOpen] = useState(false);
  if (!show || !question.hints || question.hints.length === 0) return null;
  return (
    <div className="rq-hints">
      <button type="button" className="hint-button" onClick={() => setOpen(o => !o)}>
        {open ? 'Hide Hint' : 'Show Hint'}
      </button>
      {open && <div className="hint">{question.hints[0]}</div>}
    </div>
  );
};

export type Verdict = 'right' | 'partial' | 'wrong';

/** The graded banner: a verdict word, the credit when it is partial, and one line of why. */
export const ResultBanner: React.FC<{ verdict: Verdict; title: string; detail?: string }> = ({ verdict, title, detail }) => (
  <div className={`rq-result rq-result-${verdict}`} role="status">
    <strong>{title}</strong>
    {detail && <span>{detail}</span>}
  </div>
);

/** Explanation paragraphs (one per line of the text), extra content, and Next. */
export const ExplanationBlock: React.FC<{
  question: Question;
  onNext?: () => void;
  children?: React.ReactNode;
}> = ({ question, onNext, children }) => (
  <div className="explanation rq-explanation">
    <h4>Explanation</h4>
    {question.explanation.split('\n').filter(p => p.trim().length > 0).map((p, i) => (
      <p key={i}>{renderInlineCode(p, question.topic)}</p>
    ))}
    {children}
    {onNext && (
      <StyledButton variant="primary" onClick={onNext}>
        Next Question →
      </StyledButton>
    )}
  </div>
);

/**
 * A stable shuffle seeded by the question id, so options never sit in the
 * authored order (the right one first) but stay put across re-renders.
 */
export function seededOrder<T>(items: readonly T[], seedText: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = ((seed << 5) - seed + seedText.charCodeAt(i)) | 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = (seed >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const LETTERS = 'abcdefgh';
