import React, { useMemo, useState } from 'react';
import { AnswerMeta, ChoiceOption, ChooseJustifyQuestion as ChooseJustifyQ, QuestionType } from '../types';
import { chooseJustifyCredit } from '../utils/answerCredit';
import { isPassingCredit } from '../utils/spacedRepetition';
import { Eyebrow } from './ui/Card';
import { InlineText, Prose } from './ui/InlineText';
import { OptionList, OptionItem } from './ui/OptionList';
import { QuestionShell, seededOrder } from './ui/QuestionShell';
import styles from './ReasoningQuestion.module.css';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: ChooseJustifyQ;
  onAnswer: (isCorrect: boolean, meta?: AnswerMeta) => void;
  showHints: boolean;
}

type Stage = 'decide' | 'justify' | 'graded';

const items = (options: ChoiceOption[]): OptionItem[] =>
  options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, content: <InlineText text={o.text} /> }));

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

  const graded = stage === 'graded';
  const credit = graded && decision && reason ? chooseJustifyCredit(question, decision, reason) : 0;

  const check = () => {
    if (!decision || !reason || graded) return;
    const c = chooseJustifyCredit(question, decision, reason);
    setStage('graded');
    onAnswer(isPassingCredit(c), { hintTierUsed: 0, attempts: 1, credit: c });
  };

  const verdict = credit >= 1 ? 'right' : credit > 0 ? 'partial' : 'wrong';
  const banner = credit >= 1
    ? { title: 'Correct · credit 1', detail: 'The right decision, for the right reason' }
    : credit > 0
    ? { title: `Half credit · ${credit}`, detail: 'The decision was right; the reason was not the rule' }
    : { title: 'Not quite · credit 0', detail: 'Another decision fits this situation' };

  const action = stage === 'decide'
    ? { label: 'Lock in decision', onAction: () => decision && setStage('justify'), disabled: !decision }
    : { label: 'Check answer', onAction: check, disabled: !reason };

  return (
    <QuestionShell
      dense
      className="choose-justify-question"
      question={question}
      format={QUESTION_FORMAT[QuestionType.CHOOSE_JUSTIFY]}
      graded={graded}
      stage={stage}
      action={action}
      hint={showHints && stage === 'decide' ? question.hints?.[0] : null}
      pickCount={stage === 'decide' ? decisions.length : stage === 'justify' ? reasons.length : undefined}
      feedback={graded ? { verdict, title: banner.title, detail: banner.detail, body: <Prose text={question.explanation} /> } : null}
    >
      <div className={styles.decideJustify}>
        <section className={styles.step} aria-label="Your decision">
          <Eyebrow className={styles.stepLabel}>1 · Your decision</Eyebrow>
          <OptionList
            name={`${question.id}-decision`}
            label="Your decision"
            options={items(decisions)}
            value={decision}
            onChange={setDecision}
            locked={stage === 'justify'}
            graded={graded}
            keys={stage === 'decide'}
            layout="list"
          />
        </section>
        <section className={styles.step} aria-label="The reason it is right">
          <Eyebrow className={styles.stepLabel}>2 · The reason it is right</Eyebrow>
          {stage === 'decide' ? (
            <p className={styles.muted}>The reasons appear once your decision is in.</p>
          ) : (
            <OptionList
              name={`${question.id}-reason`}
              label="The reason it is right"
              options={items(reasons)}
              value={reason}
              onChange={setReason}
              graded={graded}
              keys={stage === 'justify'}
              layout="list"
            />
          )}
        </section>
      </div>
    </QuestionShell>
  );
};
