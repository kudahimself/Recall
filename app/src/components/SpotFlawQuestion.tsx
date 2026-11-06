import React, { useState } from 'react';
import { SpotFlawQuestion as SpotFlawQ } from '../types';
import { spotFlawCorrect } from '../utils/answerCredit';
import { DataTables } from './DataTables';
import { renderInlineCode } from './InlineCode';
import { ExplanationBlock, HintToggle, QuestionHead, ResultBanner } from './ReasoningParts';

interface Props {
  question: SpotFlawQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

/**
 * Spot the flaw: the design as numbered lines; the learner picks the line that
 * causes the stated symptom and checks it. Any line in `flawLines` is right
 * (utils/answerCredit spotFlawCorrect). After grading the flaw lines are marked.
 */
export const SpotFlawQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && picked !== null && spotFlawCorrect(question, picked);

  const submit = () => {
    if (submitted || picked === null) return;
    setSubmitted(true);
    onAnswer(spotFlawCorrect(question, picked));
  };

  const lineClass = (n: number) => {
    const cls = ['rq-line'];
    if (picked === n) cls.push('picked');
    if (submitted && question.flawLines.includes(n)) cls.push('flaw');
    if (submitted && picked === n && !question.flawLines.includes(n)) cls.push('wrong');
    return cls.join(' ');
  };
  const lineTag = (n: number) => {
    if (!submitted) return null;
    const isFlaw = question.flawLines.includes(n);
    if (picked === n) return <em className="rq-line-tag">{isFlaw ? 'your pick · the flaw' : 'your pick'}</em>;
    return isFlaw ? <em className="rq-line-tag">the flaw</em> : null;
  };

  const hasSide = !!question.note || (question.tables?.length ?? 0) > 0;

  return (
    <div className="reasoning-question spot-flaw-question">
      <QuestionHead question={question} format="Spot the flaw" />
      <div className="rq-body">
        <div className={hasSide ? 'rq-two' : undefined}>
          <div className="rq-lines" role="listbox" aria-label="Lines of the design">
            {question.language && <div className="rq-code-header">{question.language.toUpperCase()}</div>}
            {question.lines.map((text, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  type="button"
                  role="option"
                  aria-selected={picked === n}
                  className={lineClass(n)}
                  onClick={() => !submitted && setPicked(n)}
                  disabled={submitted}
                >
                  <span className="rq-line-no">{n}</span>
                  <span className="rq-line-text">{text}</span>
                  {lineTag(n)}
                </button>
              );
            })}
          </div>
          {hasSide && (
            <div>
              {question.note && <p className="rq-note">{renderInlineCode(question.note, question.topic)}</p>}
              <DataTables tables={question.tables} />
            </div>
          )}
        </div>
      </div>

      {!submitted ? (
        <>
          <HintToggle question={question} show={showHints} />
          <button className="submit-button rq-submit" onClick={submit} disabled={picked === null}>
            {picked === null ? 'Click a line' : `Check line ${picked}`}
          </button>
        </>
      ) : (
        <>
          <ResultBanner
            verdict={correct ? 'right' : 'wrong'}
            title={correct ? 'Correct' : 'Not quite'}
            detail={correct ? undefined : `The flaw is line ${question.flawLines.join(' or ')}`}
          />
          <ExplanationBlock question={question}>
            <DataTables tables={question.resultTables} />
          </ExplanationBlock>
        </>
      )}
    </div>
  );
};
