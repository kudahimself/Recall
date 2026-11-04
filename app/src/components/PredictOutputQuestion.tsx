import React, { useEffect, useState } from 'react';
import { PredictOutputQuestion as PredictQ } from '../types';
import { outputInstruction, outputMatches } from '../utils/predictOutput';
import { StyledButton } from './StyledButton';
import { DataTables } from './DataTables';
import { renderInlineCode } from './InlineCode';
import './PredictOutputQuestion.css';

interface Props {
  question: PredictQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

// Answer matching (and the SQL result-set convention) lives in
// utils/predictOutput.ts so it can be unit-tested without rendering.

export const PredictOutputQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onNext,
  showHints,
}) => {
  const [userOutput, setUserOutput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setUserOutput('');
    setIsSubmitted(false);
    setShowHint(false);
  }, [question.id]);

  const evaluate = (): boolean =>
    outputMatches(
      userOutput,
      [question.expectedOutput, ...(question.acceptableOutputs || [])],
      question.language,
    );

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer(evaluate());
  };

  const wasCorrect = isSubmitted && evaluate();

  return (
    <div className="predict-output-question">
      <h3 className="question-text">{renderInlineCode(question.question, question.topic)}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="format-badge">PREDICT OUTPUT</div>
      </div>

      <div className="predict-instructions">
        {outputInstruction(question.code, question.language)}
      </div>

      <DataTables tables={question.tables} />

      <div className="code-block-wrapper">
        <div className="code-block-header">{question.language.toUpperCase()}</div>
        <pre className="code-block">{question.code}</pre>
      </div>

      <div className="output-input-wrapper">
        <label className="output-label" htmlFor="predict-output-input">Your predicted output</label>
        <textarea
          id="predict-output-input"
          className="output-input"
          value={userOutput}
          onChange={e => setUserOutput(e.target.value)}
          disabled={isSubmitted}
          placeholder="Type the output you expect..."
          rows={4}
          spellCheck={false}
        />
      </div>

      {!isSubmitted && showHints && question.hints && question.hints.length > 0 && (
        <div className="hints-section">
          <button className="hint-button" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && <div className="hint">{question.hints[0]}</div>}
        </div>
      )}

      {!isSubmitted ? (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={userOutput.trim().length === 0}
        >
          Submit Prediction
        </button>
      ) : (
        <div className="explanation">
          <h4>{wasCorrect ? 'Correct.' : 'Not quite.'}</h4>
          {!wasCorrect && (
            <div className="actual-output">
              <div className="actual-label">Expected output:</div>
              <pre className="actual-code">{question.expectedOutput}</pre>
            </div>
          )}
          <p>{renderInlineCode(question.explanation, question.topic)}</p>
          {onNext && (
            <StyledButton variant="primary" onClick={onNext}>
              Next Question →
            </StyledButton>
          )}
        </div>
      )}

    </div>
  );
};
