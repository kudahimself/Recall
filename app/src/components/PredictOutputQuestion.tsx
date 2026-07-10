import React, { useEffect, useState } from 'react';
import { PredictOutputQuestion as PredictQ } from '../types';
import { StyledButton } from './StyledButton';
import './PredictOutputQuestion.css';

interface Props {
  question: PredictQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

// Normalize for output comparison. Preserves leading whitespace within each
// line (Python output can have meaningful indentation), but tolerates user
// formatting noise:
//   - normalize CRLF → LF
//   - trim trailing whitespace per line
//   - drop leading and trailing blank lines
//   - collapse runs of 2+ blank lines into a single blank line
//   - inside list/tuple/set/dict reprs (any nesting depth), drop all spaces
//     and tabs outside string literals so [('b',3),('a',2)],
//     [('b', 3), ('a', 2)], and [ ('b', 3) , ('a', 2) ] all compare equal.
//     String contents like "Hello, world!" are preserved because we track
//     quoted regions and skip them.
function collapseBracketSpaces(s: string): string {
  let depth = 0;
  let quote: string | null = null;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const prev = i > 0 ? s[i - 1] : '';
    if (quote) {
      out += c;
      if (c === quote && prev !== '\\') quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      continue;
    }
    if (c === '[' || c === '(' || c === '{') { depth++; out += c; continue; }
    if (c === ']' || c === ')' || c === '}') { depth--; out += c; continue; }
    if (depth > 0 && (c === ' ' || c === '\t')) continue;
    out += c;
  }
  return out;
}

function normalize(s: string): string {
  return collapseBracketSpaces(
    s
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(l => l.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      .replace(/\n{2,}/g, '\n\n')
  );
}

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

  const evaluate = (): boolean => {
    const got = normalize(userOutput);
    const candidates = [question.expectedOutput, ...(question.acceptableOutputs || [])];
    return candidates.some(c => normalize(c) === got);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer(evaluate());
  };

  const wasCorrect = isSubmitted && evaluate();

  return (
    <div className="predict-output-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="format-badge">PREDICT OUTPUT</div>
      </div>

      <div className="predict-instructions">
        Read the code below and predict what it prints. Type the exact output —
        match whitespace and line breaks.
      </div>

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
          <p>{question.explanation}</p>
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
