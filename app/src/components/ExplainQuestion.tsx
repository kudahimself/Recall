import React, { useState } from 'react';
import { AnswerMeta, ExplainQuestion as ExplainQ } from '../types';
import { explainCredit } from '../utils/answerCredit';
import { CREDIT_CORRECT_THRESHOLD, isPassingCredit } from '../utils/spacedRepetition';
import { renderInlineCode } from './InlineCode';
import { ExplanationBlock, QuestionHead, ResultBanner } from './ReasoningParts';

interface Props {
  question: ExplainQ;
  onAnswer: (isCorrect: boolean, meta?: AnswerMeta) => void;
  onNext?: () => void;
  showHints: boolean;
}

type Stage = 'write' | 'tick' | 'graded';

/**
 * Explain in your own words (review only): the learner types an answer, then
 * sees the model answer and ticks the key points their answer made. Recall
 * does not grade prose; credit is ticked / key points (utils/answerCredit
 * explainCredit), recorded when the learner confirms the ticks.
 */
export const ExplainQuestion: React.FC<Props> = ({ question, onAnswer, onNext }) => {
  const [text, setText] = useState('');
  const [stage, setStage] = useState<Stage>('write');
  const [ticked, setTicked] = useState<Set<number>>(new Set());

  const total = question.keyPoints.length;
  const credit = explainCredit(question, ticked);
  const passBar = Math.ceil(CREDIT_CORRECT_THRESHOLD * total);
  const standing = credit >= CREDIT_CORRECT_THRESHOLD
    ? 'counts as correct'
    : isPassingCredit(credit)
    ? 'a pass under the bar: back sooner'
    : 'counts as a miss';

  const toggle = (i: number) => {
    if (stage !== 'tick') return;
    setTicked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const record = () => {
    if (stage !== 'tick') return;
    setStage('graded');
    onAnswer(isPassingCredit(credit), { hintTierUsed: 0, attempts: 1, credit });
  };

  const verdict = credit >= CREDIT_CORRECT_THRESHOLD ? 'right' : isPassingCredit(credit) ? 'partial' : 'wrong';

  return (
    <div className="reasoning-question explain-question">
      <QuestionHead question={question} format="Explain in your own words" />
      <div className="rq-body">
        {stage === 'write' ? (
          <div className="rq-answer-row">
            <label className="rq-label" htmlFor="explain-input">
              Your answer <span className="rq-muted">· type first; the key points appear after you submit</span>
            </label>
            <textarea
              id="explain-input"
              className="rq-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && text.trim()) { e.preventDefault(); setStage('tick'); }
              }}
              placeholder="Two or three sentences, in your own words"
              rows={5}
              autoFocus
            />
          </div>
        ) : (
          <>
            <div className="rq-two">
              <div>
                <div className="rq-label">Your answer</div>
                <div className="rq-typed">{text}</div>
              </div>
              <div>
                <div className="rq-label">Model answer</div>
                <div className="rq-model">{renderInlineCode(question.modelAnswer, question.topic)}</div>
              </div>
            </div>
            <div className="rq-step">Tick the key points your answer made</div>
            <div className="rq-keypoints" role="group" aria-label="Key points">
              {question.keyPoints.map((kp, i) => (
                <label key={i} className={`rq-keypoint${ticked.has(i) ? ' on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={ticked.has(i)}
                    onChange={() => toggle(i)}
                    disabled={stage !== 'tick'}
                  />
                  <span>{renderInlineCode(kp, question.topic)}</span>
                </label>
              ))}
            </div>
            <p className="rq-muted">
              Ticks are yours: Recall does not grade prose, so it shows the points and you mark what your answer actually said.
              {' '}{passBar} of {total} counts as correct.
            </p>
          </>
        )}
      </div>

      {stage === 'write' && (
        <button className="submit-button rq-submit" onClick={() => setStage('tick')} disabled={text.trim().length === 0}>
          Submit and see the key points
        </button>
      )}
      {stage === 'tick' && (
        <div className="rq-tally">
          <span>{ticked.size} of {total} · {standing}</span>
          <button className="submit-button rq-submit" onClick={record}>
            Record {ticked.size} of {total}
          </button>
        </div>
      )}
      {stage === 'graded' && (
        <>
          <ResultBanner
            verdict={verdict}
            title={`${ticked.size} of ${total} · credit ${Math.round(credit * 100) / 100}`}
            detail={standing}
          />
          <ExplanationBlock question={question} onNext={onNext} />
        </>
      )}
    </div>
  );
};
