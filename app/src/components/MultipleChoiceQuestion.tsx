import React, { useMemo, useState } from 'react';
import { MultipleChoiceQuestion as MCQuestion, QuestionType } from '../types';
import { DataTables } from './DataTables';
import { InlineText, Prose } from './ui/InlineText';
import { OptionList } from './ui/OptionList';
import { QuestionShell, seededOrder } from './ui/QuestionShell';
import { QUESTION_FORMAT } from '../utils/questionFormat';

interface Props {
  question: MCQuestion;
  onAnswer: (isCorrect: boolean) => void;
  // Fired when the user selects an INCORRECT option that has a misconceptionTag.
  // The handler in App records the event for telemetry and surfacing under
  // "Worth another look" (Home, Progress). Optional: components without telemetry just don't pass it.
  onMisconception?: (tag: string, questionId: string) => void;
  showHints: boolean;
}

/**
 * Multiple choice on the shared shell: the options in a stable shuffled order
 * (seeded by the question id, so the right one is not always first), 1-9 to
 * pick, Enter to check, then the verdict with the explanation.
 */
export const MultipleChoiceQuestion: React.FC<Props> = ({ question, onAnswer, onMisconception, showHints }) => {
  const options = useMemo(() => seededOrder(question.options, question.id), [question.options, question.id]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [graded, setGraded] = useState(false);

  const picked = options.find(o => o.id === chosen);
  const right = !!picked?.isCorrect;

  const check = () => {
    if (graded || !picked) return;
    // A tagged distractor is recorded for the misconception telemetry.
    if (!picked.isCorrect && picked.misconceptionTag && onMisconception) {
      onMisconception(picked.misconceptionTag, question.id);
    }
    setGraded(true);
    onAnswer(picked.isCorrect);
  };

  return (
    <QuestionShell
      className="multiple-choice-question"
      question={question}
      format={QUESTION_FORMAT[QuestionType.MULTIPLE_CHOICE]}
      graded={graded}
      action={{ label: 'Check answer', onAction: check, disabled: !chosen }}
      hint={showHints ? question.hints?.[0] : null}
      pickCount={options.length}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        body: <Prose text={question.explanation} />,
      } : null}
    >
      <DataTables tables={question.tables} />
      <OptionList
        name={`mcq-${question.id}`}
        label="Answer options"
        options={options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, content: <InlineText text={o.text} /> }))}
        value={chosen}
        onChange={setChosen}
        graded={graded}
      />
    </QuestionShell>
  );
};
