import React, { useState } from 'react';
import { AnswerMeta, ExplainQuestion as ExplainQ, QuestionType } from '../types';
import { explainCredit } from '../utils/answerCredit';
import { CREDIT_CORRECT_THRESHOLD } from '../utils/spacedRepetition';
import { Eyebrow, Panel } from './ui/Card';
import { InlineText, Prose } from './ui/InlineText';
import { OptionList } from './ui/OptionList';
import { QuestionShell } from './ui/QuestionShell';
import { TextAnswer } from './ui/TextAnswer';
import styles from './ReasoningQuestion.module.css';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: ExplainQ;
  onAnswer: (isCorrect: boolean, meta?: AnswerMeta) => void;
  showHints: boolean;
}

type Stage = 'write' | 'tick' | 'graded';

/**
 * Explain in your own words (review only): the learner types an answer, then
 * sees the model answer and ticks the key points their answer made (1-9 tick
 * them). Recall does not grade prose; credit is ticked / key points
 * (utils/answerCredit explainCredit), recorded when the learner confirms.
 */
export const ExplainQuestion: React.FC<Props> = ({ question, onAnswer }) => {
  const [text, setText] = useState('');
  const [stage, setStage] = useState<Stage>('write');
  const [ticked, setTicked] = useState<Set<number>>(new Set());

  const total = question.keyPoints.length;
  const credit = explainCredit(question, ticked);
  const passBar = Math.ceil(CREDIT_CORRECT_THRESHOLD * total);
  const passed = credit >= CREDIT_CORRECT_THRESHOLD;
  const standing = passed ? 'counts as correct' : 'counts as a miss';

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
    onAnswer(passed, { hintTierUsed: 0, attempts: 1, credit });
  };

  const action = stage === 'write'
    ? { label: 'Submit and see the key points', onAction: () => text.trim() && setStage('tick'), disabled: text.trim().length === 0 }
    : { label: `Record ${ticked.size} of ${total}`, onAction: record };

  return (
    <QuestionShell
      dense
      className="explain-question"
      question={question}
      format={QUESTION_FORMAT[QuestionType.EXPLAIN]}
      graded={stage === 'graded'}
      stage={stage}
      typed={stage !== 'graded'}
      action={action}
      pickCount={stage === 'tick' ? total : undefined}
      feedback={stage === 'graded' ? {
        verdict: passed ? 'right' : 'wrong',
        title: `${ticked.size} of ${total} · credit ${Math.round(credit * 100) / 100}`,
        detail: standing,
        body: <Prose text={question.explanation} />,
      } : null}
    >
      {stage === 'write' ? (
        <TextAnswer
          id={`explain-${question.id}`}
          label={<>Your answer <span className={styles.muted}>· type first; the key points appear after you submit</span></>}
          value={text}
          onChange={setText}
          multiline
          rows={5}
          placeholder="Two or three sentences, in your own words"
        />
      ) : (
        <div className={styles.two}>
          <div className={styles.side}>
            <Panel>
              <Eyebrow>Your answer</Eyebrow>
              <p className={styles.typed}>{text}</p>
            </Panel>
            <section className={styles.step} aria-label="Key points">
              <Eyebrow className={styles.stepLabel}>{stage === 'tick' ? 'Tick the key points your answer made' : 'Key points your answer made'}</Eyebrow>
              <OptionList
                name={`${question.id}-points`}
                label="Key points"
                multiple
                layout="list"
                options={question.keyPoints.map((kp, i) => ({ id: String(i), text: kp, content: <InlineText text={kp} /> }))}
                values={Array.from(ticked).map(String)}
                onToggle={id => toggle(Number(id))}
                locked={stage !== 'tick'}
              />
              {stage === 'tick' && (
                <p className={styles.muted}>
                  <strong className={styles.tally}>{ticked.size} of {total} · {standing}</strong>. Ticks are yours: Recall
                  does not grade prose, so you mark what your answer actually said. {passBar} of {total} counts as correct.
                </p>
              )}
            </section>
          </div>
          <Panel>
            <Eyebrow>Model answer</Eyebrow>
            <div className={styles.model}><Prose text={question.modelAnswer} /></div>
          </Panel>
        </div>
      )}
    </QuestionShell>
  );
};
