import React, { useEffect, useMemo, useState } from 'react';
import { ParsonsQuestion as ParsonsQ } from '../types';
import { StyledButton } from './StyledButton';
import './ParsonsQuestion.css';

interface Props {
  question: ParsonsQ;
  onAnswer: (isCorrect: boolean) => void;
  onNext?: () => void;
  showHints: boolean;
}

interface Line {
  id: string;
  text: string;
  isDistractor: boolean;
}

// Python import statements are order-independent (barring rare side-effect
// imports, which these questions don't use). The strict-positional grader would
// otherwise reject any but the authored order of a multi-import block — a guess
// the user can't win. Normalize by sorting each MAXIMAL RUN of consecutive
// import lines in place, then compare positionally. Applied to both the user's
// answer and the correctOrder, so two valid import orderings collapse to the
// same sequence. Non-import siblings (e.g. two independent assignments) are NOT
// covered — those must be disambiguated in the prompt.
const IMPORT_LINE = /^\s*(import\s|from\s+\S+\s+import\s)/;
export function normalizeImportRuns(texts: string[]): string[] {
  const out = [...texts];
  let i = 0;
  while (i < out.length) {
    if (IMPORT_LINE.test(out[i])) {
      let j = i;
      while (j < out.length && IMPORT_LINE.test(out[j])) j++;
      const run = out.slice(i, j).sort();
      for (let k = i; k < j; k++) out[k] = run[k - i];
      i = j;
    } else {
      i++;
    }
  }
  return out;
}

function seededShuffle<T>(items: T[], seedKey: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = ((seed << 5) - seed + seedKey.charCodeAt(i)) | 0;
  }
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = (seed >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const ParsonsQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onNext,
  showHints,
}) => {
  // Empty/whitespace-only entries in correctOrder are formatting noise for the
  // assembled `solution` string — they don't belong in the drag-and-drop pool
  // (they'd render as identical invisible boxes the user can't tell apart).
  // Strip them here; validate against the same stripped sequence below.
  const meaningfulCorrectOrder = useMemo(
    () => question.correctOrder.filter(line => line.trim() !== ''),
    [question.correctOrder]
  );

  const allLines: Line[] = useMemo(() => {
    const correct = meaningfulCorrectOrder.map((text, i) => ({
      id: `c${i}`,
      text,
      isDistractor: false,
    }));
    // Drop distractors that would render as visually identical tiles to a
    // correctOrder line — those force a 50/50 guess. Also de-dup within
    // distractors. Multiplicity inside correctOrder is preserved (a line that
    // legitimately appears twice in the answer still gets two tiles).
    const correctTexts = new Set(meaningfulCorrectOrder);
    const seenDistractor = new Set<string>();
    const distractors: Line[] = [];
    for (const text of question.distractorLines || []) {
      if (text.trim() === '') continue;
      if (correctTexts.has(text)) continue;
      if (seenDistractor.has(text)) continue;
      seenDistractor.add(text);
      distractors.push({ id: `d${distractors.length}`, text, isDistractor: true });
    }
    return seededShuffle([...correct, ...distractors], question.id);
  }, [question.id, meaningfulCorrectOrder, question.distractorLines]);

  const [available, setAvailable] = useState<Line[]>(allLines);
  const [answer, setAnswer] = useState<Line[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAvailable(allLines);
    setAnswer([]);
    setIsSubmitted(false);
    setShowHint(false);
  }, [question.id, allLines]);

  const moveToAnswer = (line: Line) => {
    if (isSubmitted) return;
    setAvailable(prev => prev.filter(l => l.id !== line.id));
    setAnswer(prev => [...prev, line]);
  };

  const moveToAvailable = (line: Line) => {
    if (isSubmitted) return;
    setAnswer(prev => prev.filter(l => l.id !== line.id));
    setAvailable(prev => [...prev, line]);
  };

  const moveUp = (idx: number) => {
    if (isSubmitted || idx === 0) return;
    setAnswer(prev => {
      const out = [...prev];
      [out[idx - 1], out[idx]] = [out[idx], out[idx - 1]];
      return out;
    });
  };

  const moveDown = (idx: number) => {
    if (isSubmitted || idx === answer.length - 1) return;
    setAnswer(prev => {
      const out = [...prev];
      [out[idx], out[idx + 1]] = [out[idx + 1], out[idx]];
      return out;
    });
  };

  const evaluate = (): boolean => {
    if (answer.length !== meaningfulCorrectOrder.length) return false;
    if (answer.some(line => line.isDistractor)) return false;
    const normAnswer = normalizeImportRuns(answer.map(line => line.text));
    const normCorrect = normalizeImportRuns(meaningfulCorrectOrder);
    return normAnswer.every((text, i) => text === normCorrect[i]);
  };

  const handleSubmit = () => {
    const correct = evaluate();
    setIsSubmitted(true);
    onAnswer(correct);
  };

  const lineClass = (line: Line, idx: number): string => {
    if (!isSubmitted) return 'parsons-line';
    if (line.isDistractor) return 'parsons-line wrong';
    // Compare under the same import-run normalization the grader uses, so a
    // valid alternative import ordering is shown green rather than red.
    const normAnswer = normalizeImportRuns(answer.map(l => l.text));
    const normCorrect = normalizeImportRuns(meaningfulCorrectOrder);
    if (normAnswer[idx] !== normCorrect[idx]) return 'parsons-line wrong';
    return 'parsons-line correct';
  };

  const wasCorrect = isSubmitted && evaluate();

  return (
    <div className="parsons-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">{question.difficulty.toUpperCase()}</div>
        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
        <div className="format-badge">PARSONS</div>
      </div>

      <div className="parsons-instructions">
        Click lines on the left to add them to your solution. Use ↑/↓ to reorder, ✕ to remove.
        {question.distractorLines && question.distractorLines.length > 0 && (
          <span className="parsons-warning"> Some lines don't belong — leave them out.</span>
        )}
      </div>

      <div className="parsons-columns">
        <div className="parsons-column">
          <div className="parsons-column-header">Available lines</div>
          <div className="parsons-bin">
            {available.length === 0 && (
              <div className="parsons-empty">All lines used.</div>
            )}
            {available.map(line => (
              <button
                key={line.id}
                type="button"
                className="parsons-line available"
                onClick={() => moveToAnswer(line)}
              >
                <pre>{line.text}</pre>
              </button>
            ))}
          </div>
        </div>

        <div className="parsons-column">
          <div className="parsons-column-header">Your solution</div>
          <div className="parsons-bin parsons-answer-bin">
            {answer.length === 0 && (
              <div className="parsons-empty">Click a line on the left to start.</div>
            )}
            {answer.map((line, idx) => (
              <div key={line.id} className={lineClass(line, idx)}>
                <pre>{line.text}</pre>
                {!isSubmitted && (
                  <div className="parsons-line-controls">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      title="Move up"
                      aria-label="Move line up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === answer.length - 1}
                      title="Move down"
                      aria-label="Move line down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => moveToAvailable(line)}
                      title="Remove"
                      aria-label="Remove line"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
          disabled={answer.length === 0}
        >
          Submit Solution
        </button>
      ) : (
        <div className="explanation">
          <h4>{wasCorrect ? 'Correct.' : 'Not quite.'}</h4>
          <p>{question.explanation}</p>
          {!wasCorrect && (
            <div className="reference-solution">
              <div className="reference-label">Reference solution:</div>
              <pre className="reference-code">{question.solution}</pre>
            </div>
          )}
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
