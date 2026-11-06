import React, { useState } from 'react';
import { SpotFlawQuestion as SpotFlawQ } from '../types';
import { spotFlawCorrect } from '../utils/answerCredit';
import { DataTables } from './DataTables';
import { languageLabel } from './ui/CodeBlock';
import { Prose } from './ui/InlineText';
import { OptionList } from './ui/OptionList';
import { QuestionShell } from './ui/QuestionShell';
import styles from './ReasoningQuestion.module.css';

interface Props {
  question: SpotFlawQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

/**
 * Spot the flaw: the design as numbered lines; the learner picks the line that
 * causes the stated symptom (its number key, or a click) and checks it. Any
 * line in `flawLines` is right (utils/answerCredit spotFlawCorrect). After
 * grading the flaw lines are marked.
 */
export const SpotFlawQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [graded, setGraded] = useState(false);
  const right = graded && picked !== null && spotFlawCorrect(question, picked);

  const check = () => {
    if (graded || picked === null) return;
    setGraded(true);
    onAnswer(spotFlawCorrect(question, picked));
  };

  const hasSide = !!question.note || (question.tables?.length ?? 0) > 0;
  const lines = question.lines.map((text, i) => ({
    id: String(i + 1),
    text,
    isCorrect: question.flawLines.includes(i + 1),
    content: text,
  }));

  return (
    <QuestionShell
      dense
      className="spot-flaw-question"
      question={question}
      format="Spot the flaw"
      graded={graded}
      action={{ label: picked === null ? 'Pick a line' : `Check line ${picked}`, onAction: check, disabled: picked === null }}
      hint={showHints ? question.hints?.[0] : null}
      pickCount={question.lines.length}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        detail: right ? undefined : `The flaw is line ${question.flawLines.join(' or ')}`,
        body: (
          <div className={styles.withTables}>
            <div className={styles.explanation}><Prose text={question.explanation} /></div>
            <DataTables tables={question.resultTables} />
          </div>
        ),
      } : null}
    >
      <div className={hasSide ? styles.flawGrid : undefined}>
        <OptionList
          name={`${question.id}-line`}
          label="Lines of the design"
          variant="lines"
          caption={languageLabel(question.language)}
          options={lines}
          value={picked === null ? null : String(picked)}
          onChange={id => setPicked(Number(id))}
          graded={graded}
          chosenLabel="Your pick"
          correctLabel="The flaw"
        />
        {hasSide && (
          <div className={styles.side}>
            {question.note && <div className={styles.note}><Prose text={question.note} /></div>}
            <DataTables tables={question.tables} />
          </div>
        )}
      </div>
    </QuestionShell>
  );
};
