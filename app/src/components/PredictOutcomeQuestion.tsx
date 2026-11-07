import React, { useState } from 'react';
import { PredictOutcomeQuestion as PredictOutcomeQ, QuestionType } from '../types';
import { outcomeMatches, temptingMatch } from '../utils/answerCredit';
import { DataTables } from './DataTables';
import { CodeBlock, languageLabel } from './ui/CodeBlock';
import { InlineText, Prose } from './ui/InlineText';
import { QuestionShell } from './ui/QuestionShell';
import { TextAnswer } from './ui/TextAnswer';
import styles from './ReasoningQuestion.module.css';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: PredictOutcomeQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

/**
 * Predict the outcome: input tables, an optional job, and one typed value.
 * Graded exactly by utils/answerCredit (outcomeMatches); a typed answer the
 * question names as tempting shows why it is tempting.
 */
export const PredictOutcomeQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const [typed, setTyped] = useState('');
  const [graded, setGraded] = useState(false);

  const right = graded && outcomeMatches(question, typed);
  const trap = graded && !right ? temptingMatch(question, typed) : undefined;
  const withUnit = (v: string) => (question.unit ? `${v.trim()} ${question.unit}` : v.trim());
  // The learner's value with the unit added, unless they already typed words.
  const shown = (v: string) => (/[a-z]/i.test(v) ? v.trim() : withUnit(v));

  const check = () => {
    if (graded || typed.trim().length === 0) return;
    setGraded(true);
    onAnswer(outcomeMatches(question, typed));
  };

  const others = (question.tempting ?? []).filter(t => t !== trap);
  const tempting = (t: { answer: string; why: string }, label: string) => (
    <p key={t.answer} className={styles.tempting}>
      <span className={styles.temptingLabel}>{label}</span>
      <InlineText text={t.why} />
    </p>
  );

  return (
    <QuestionShell
      dense
      className="predict-outcome-question"
      question={question}
      format={QUESTION_FORMAT[QuestionType.PREDICT_OUTCOME]}
      graded={graded}
      action={{ label: 'Check answer', onAction: check, disabled: typed.trim().length === 0 }}
      hint={showHints ? question.hints?.[0] : null}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        detail: right ? `You answered ${shown(typed)}` : `You answered ${shown(typed)}; the answer is ${withUnit(question.answer)}`,
        body: (
          <div className={styles.withTables}>
            <div className={styles.explanation}>
              <Prose text={question.explanation} />
              {trap && tempting(trap, `Your ${withUnit(trap.answer)}: `)}
              {others.length > 0 && (
                <details className={styles.more}>
                  <summary>Why {others.map(t => withUnit(t.answer)).join(' or ')} {others.length === 1 ? 'is' : 'are'} tempting</summary>
                  {others.map(t => tempting(t, `${withUnit(t.answer)}: `))}
                </details>
              )}
            </div>
            <DataTables tables={question.resultTables} />
          </div>
        ),
      } : null}
    >
      {/* The tables, then the job with the answer box: beside the tables when
          the card is wide enough, else below them with the box beside the job. */}
      <div className={styles.flow}>
        <DataTables tables={question.tables} />
        <div className={styles.job}>
          <div className={styles.jobRow}>
            {question.code && (
              <CodeBlock code={question.code} language={question.language} label={languageLabel(question.language) ?? 'Job'} />
            )}
            <div className={styles.answerRow}>
              <TextAnswer
                id={`outcome-${question.id}`}
                label="Your answer"
                value={typed}
                onChange={setTyped}
                onEnter={check}
                unit={question.unit}
                placeholder="Type a value"
                status={graded ? (right ? 'right' : 'wrong') : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </QuestionShell>
  );
};
