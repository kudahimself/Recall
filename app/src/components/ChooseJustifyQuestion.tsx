import React, { useMemo, useState } from 'react';
import { AnswerMeta, ChoiceOption, ChooseJustifyQuestion as ChooseJustifyQ } from '../types';
import { chooseJustifyCredit } from '../utils/answerCredit';
import { isPassingCredit } from '../utils/spacedRepetition';
import { renderInlineCode } from './InlineCode';
import { ExplanationBlock, HintToggle, LETTERS, QuestionHead, ResultBanner, seededOrder } from './ReasoningParts';

interface Props {
  question: ChooseJustifyQ;
  onAnswer: (isCorrect: boolean, meta?: AnswerMeta) => void;
  showHints: boolean;
}

type Stage = 'decide' | 'justify' | 'graded';

/**
 * Choose and justify: the decision first, then (once it is locked in) the
 * reason it is right. Graded by utils/answerCredit (chooseJustifyCredit) and
 * recorded with that credit: 1, 0.5 for the right decision with the wrong
 * reason (a pass under the bar, so the card comes back sooner), else 0.
 */
export const ChooseJustifyQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const decisions = useMemo(() => seededOrder(question.decisions, `${question.id}:d`), [question.decisions, question.id]);
  const reasons = useMemo(() => seededOrder(question.reasons, `${question.id}:r`), [question.reasons, question.id]);
  const [stage, setStage] = useState<Stage>('decide');
  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const credit = stage === 'graded' && decision && reason ? chooseJustifyCredit(question, decision, reason) : 0;

  const submit = () => {
    if (!decision || !reason) return;
    const c = chooseJustifyCredit(question, decision, reason);
    setStage('graded');
    onAnswer(isPassingCredit(c), { hintTierUsed: 0, attempts: 1, credit: c });
  };

  const optionList = (
    name: string,
    options: ChoiceOption[],
    picked: string | null,
    pick: (id: string) => void,
    locked: boolean,
  ) => (
    <div className="rq-options" role="radiogroup" aria-label={name}>
      {options.map((o, i) => {
        const graded = stage === 'graded';
        const cls = [
          'rq-option',
          picked === o.id ? 'picked' : '',
          graded && o.isCorrect ? 'right' : '',
          graded && picked === o.id && !o.isCorrect ? 'wrong' : '',
        ].filter(Boolean).join(' ');
        return (
          <label key={o.id} className={cls}>
            <input
              type="radio"
              name={`${question.id}-${name}`}
              value={o.id}
              checked={picked === o.id}
              onChange={() => !locked && pick(o.id)}
              disabled={locked}
            />
            <b>{LETTERS[i]}</b>
            <span>{renderInlineCode(o.text, question.topic)}</span>
            {graded && picked === o.id && <em className="rq-pick-tag">your pick</em>}
          </label>
        );
      })}
    </div>
  );

  const verdict = credit >= 1 ? 'right' : credit > 0 ? 'partial' : 'wrong';
  const banner = credit >= 1
    ? { title: 'Correct · credit 1', detail: 'The right decision, for the right reason' }
    : credit > 0
    ? { title: `Half credit · ${credit}`, detail: 'The decision was right; the reason was not the rule' }
    : { title: 'Not quite · credit 0', detail: 'Another decision fits this situation' };

  return (
    <div className="reasoning-question choose-justify-question">
      <QuestionHead question={question} format="Choose & justify" />
      <div className="rq-body">
        <div className="rq-two">
          <div>
            <div className="rq-step">1 · Your decision</div>
            {optionList('decision', decisions, decision, setDecision, stage !== 'decide')}
          </div>
          <div>
            <div className="rq-step">2 · The reason it is right</div>
            {stage === 'decide' ? (
              <p className="rq-muted">The reasons appear once your decision is in.</p>
            ) : (
              optionList('reason', reasons, reason, setReason, stage === 'graded')
            )}
          </div>
        </div>
      </div>

      {stage === 'decide' && (
        <>
          <HintToggle question={question} show={showHints} />
          <button className="submit-button rq-submit" onClick={() => setStage('justify')} disabled={!decision}>
            Lock in decision
          </button>
        </>
      )}
      {stage === 'justify' && (
        <button className="submit-button rq-submit" onClick={submit} disabled={!reason}>
          Submit answer
        </button>
      )}
      {stage === 'graded' && (
        <>
          <ResultBanner verdict={verdict} title={banner.title} detail={banner.detail} />
          <ExplanationBlock question={question} />
        </>
      )}
    </div>
  );
};
