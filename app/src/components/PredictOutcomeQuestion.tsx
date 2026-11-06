import React, { useState } from 'react';
import { PredictOutcomeQuestion as PredictOutcomeQ } from '../types';
import { outcomeMatches, temptingMatch } from '../utils/answerCredit';
import { DataTables } from './DataTables';
import { renderInlineCode } from './InlineCode';
import { ExplanationBlock, HintToggle, QuestionHead, ResultBanner } from './ReasoningParts';

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
  const [submitted, setSubmitted] = useState(false);

  const correct = submitted && outcomeMatches(question, typed);
  const trap = submitted && !correct ? temptingMatch(question, typed) : undefined;
  const withUnit = (v: string) => (question.unit ? `${v.trim()} ${question.unit}` : v.trim());
  // The learner's value with the unit added, unless they already typed words.
  const shown = (v: string) => (/[a-z]/i.test(v) ? v.trim() : withUnit(v));

  const submit = () => {
    if (submitted || typed.trim().length === 0) return;
    setSubmitted(true);
    onAnswer(outcomeMatches(question, typed));
  };

  return (
    <div className="reasoning-question predict-outcome-question">
      <QuestionHead question={question} format="Predict the outcome" />
      <div className="rq-body">
        <DataTables tables={question.tables} />
        {question.code && (
          <div className="rq-code">
            <div className="rq-code-header">{question.language ? question.language.toUpperCase() : 'JOB'}</div>
            <pre className="rq-code-block">{question.code}</pre>
          </div>
        )}

        {!submitted ? (
          <div className="rq-answer-row">
            <label className="rq-label" htmlFor="predict-outcome-input">Your answer</label>
            <div className="rq-answer-input">
              <input
                id="predict-outcome-input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={typed}
                onChange={e => setTyped(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
                placeholder="Type a value"
                autoFocus
              />
              {question.unit && <span className="rq-unit">{question.unit}</span>}
            </div>
          </div>
        ) : (
          <div className="rq-answer-compare">
            <div className={`rq-answer-box ${correct ? 'good' : 'bad'}`}>
              <small>You answered</small>
              <span>{shown(typed)}</span>
            </div>
            {!correct && (
              <div className="rq-answer-box good">
                <small>Correct</small>
                <span>{withUnit(question.answer)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!submitted ? (
        <>
          <HintToggle question={question} show={showHints} />
          <button className="submit-button rq-submit" onClick={submit} disabled={typed.trim().length === 0}>
            Submit answer
          </button>
        </>
      ) : (
        <>
          <ResultBanner
            verdict={correct ? 'right' : 'wrong'}
            title={correct ? 'Correct' : 'Not quite'}
          />
          <ExplanationBlock question={question}>
            {(question.tempting ?? []).map(t => (
              <p key={t.answer} className={`rq-tempting${t === trap ? ' mine' : ''}`}>
                <span className="rq-tempting-label">
                  {t === trap ? `Your ${withUnit(t.answer)}: ` : `Why ${withUnit(t.answer)} is tempting: `}
                </span>
                {renderInlineCode(t.why, question.topic)}
              </p>
            ))}
            <DataTables tables={question.resultTables} />
          </ExplanationBlock>
        </>
      )}
    </div>
  );
};
