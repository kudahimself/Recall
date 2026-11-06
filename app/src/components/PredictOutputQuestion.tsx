import React, { useState } from 'react';
import { PredictOutputQuestion as PredictQ } from '../types';
import { outputInstruction, outputMatches } from '../utils/predictOutput';
import { DataTables } from './DataTables';
import { CodeBlock, languageLabel } from './ui/CodeBlock';
import { Prose } from './ui/InlineText';
import { AnswerColumns, QuestionShell } from './ui/QuestionShell';
import { AnswerCompare, TextAnswer } from './ui/TextAnswer';

interface Props {
  question: PredictQ;
  onAnswer: (isCorrect: boolean) => void;
  showHints: boolean;
}

// Answer matching (and the SQL result-set convention) lives in
// utils/predictOutput.ts so it can be unit-tested without rendering.

/** Code this narrow sits beside the answer box instead of above it. */
const SIDE_BY_SIDE_MAX_COLUMNS = 46;
const SIDE_BY_SIDE_MAX_LINES = 14;

export const PredictOutputQuestion: React.FC<Props> = ({ question, onAnswer, showHints }) => {
  const [typed, setTyped] = useState('');
  const [graded, setGraded] = useState(false);

  const right = graded && outputMatches(typed, [question.expectedOutput, ...(question.acceptableOutputs || [])], question.language);

  const check = () => {
    if (graded || typed.trim().length === 0) return;
    setGraded(true);
    onAnswer(outputMatches(typed, [question.expectedOutput, ...(question.acceptableOutputs || [])], question.language));
  };

  const lines = question.code.split(/\r?\n/);
  const sideBySide = lines.length <= SIDE_BY_SIDE_MAX_LINES && Math.max(...lines.map(l => l.length)) <= SIDE_BY_SIDE_MAX_COLUMNS;

  return (
    <QuestionShell
      className="predict-output-question"
      question={question}
      format="Predict output"
      task={outputInstruction(question.code, question.language)}
      graded={graded}
      typed
      action={{ label: 'Check answer', onAction: check, disabled: typed.trim().length === 0 }}
      hint={showHints ? question.hints?.[0] : null}
      feedback={graded ? {
        verdict: right ? 'right' : 'wrong',
        title: right ? 'Correct' : 'Not quite',
        body: <Prose text={question.explanation} />,
      } : null}
    >
      <DataTables tables={question.tables} />
      {/* Short code sits beside the answer, so the whole question fits a laptop screen. */}
      <AnswerColumns columns={sideBySide ? 'minmax(0, 1.15fr) minmax(0, 1fr)' : 'minmax(0, 1fr)'}>
        <CodeBlock code={question.code} language={question.language} label={languageLabel(question.language)} numbered />
        {!graded ? (
          <TextAnswer
            id={`predict-${question.id}`}
            label="Your predicted output"
            value={typed}
            onChange={setTyped}
            multiline
            grow={sideBySide}
            rows={3}
            mono
            placeholder="Type the output you expect..."
          />
        ) : (
          <AnswerCompare
            columns={sideBySide ? 1 : 2}
            items={[
              { label: 'Your output', value: typed.replace(/\s+$/, ''), tone: right ? 'right' : 'wrong', mono: true },
              ...(right ? [] : [{ label: 'Expected output', value: question.expectedOutput, tone: 'right' as const, mono: true }]),
            ]}
          />
        )}
      </AnswerColumns>
    </QuestionShell>
  );
};
