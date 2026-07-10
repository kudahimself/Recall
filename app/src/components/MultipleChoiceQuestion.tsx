import React, { useState, useEffect, useMemo } from 'react';
import { MultipleChoiceQuestion as MCQuestion } from '../types';
import { StyledButton } from './StyledButton';
import './MultipleChoiceQuestion.css';

interface Props {
  question: MCQuestion;
  onAnswer: (isCorrect: boolean) => void;
  // Fired when the user selects an INCORRECT option that has a misconceptionTag.
  // The handler in App records the event for telemetry and surfacing in
  // ProgressTracker. Optional — components without telemetry just don't pass it.
  onMisconception?: (tag: string, questionId: string) => void;
  onNext?: () => void;
  showHints: boolean;
}

/**
 * Shuffle options at render time so the correct answer appears in a random position.
 * Uses Fisher-Yates shuffle seeded by question ID for consistency within a session.
 */
function shuffleOptions(options: MCQuestion['options'], questionId: string): MCQuestion['options'] {
  // Simple hash from question ID for deterministic-per-question shuffle
  let seed = 0;
  for (let i = 0; i < questionId.length; i++) {
    seed = ((seed << 5) - seed + questionId.charCodeAt(i)) | 0;
  }

  const shuffled = [...options];
  // Fisher-Yates with seeded pseudo-random
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = ((seed >>> 0) % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Reassign IDs a, b, c, d based on new positions
  const ids = ['a', 'b', 'c', 'd'];
  return shuffled.map((opt, idx) => ({
    ...opt,
    id: ids[idx] || opt.id,
  }));
}

export const MultipleChoiceQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onMisconception,
  onNext,
  showHints,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Shuffle options once per question (deterministic by question ID)
  const shuffledOptions = useMemo(
    () => shuffleOptions(question.options, question.id),
    [question.id, question.options]
  );

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const opt = shuffledOptions.find(o => o.id === selectedOption);
    const correct = opt?.isCorrect || false;

    // If they picked a tagged distractor, record it for telemetry.
    if (!correct && opt?.misconceptionTag && onMisconception) {
      onMisconception(opt.misconceptionTag, question.id);
    }

    setIsSubmitted(true);
    onAnswer(correct);
  };

  const getOptionClass = (optionId: string): string => {
    if (!isSubmitted) return 'option';

    const option = shuffledOptions.find(opt => opt.id === optionId);
    if (option?.isCorrect) return 'option correct';
    if (optionId === selectedOption && !option?.isCorrect)
      return 'option incorrect';

    return 'option';
  };

  return (
    <div className="multiple-choice-question">
      <h3 className="question-text">{question.question}</h3>

      <div className="badges-row">
        <div className="difficulty-badge">
          {question.difficulty.toUpperCase()}
        </div>

        <div className="topic-badge">
          {question.topic.replace(/_/g, ' ').toUpperCase()}
        </div>
      </div>

      <div className="options">
        {shuffledOptions.map(option => (
          <label
            key={option.id}
            className={`flipdisc-item-label ${getOptionClass(option.id)}`}
          >
            <input
              className="hidden-checkbox-input"
              type="radio"
              name="answer"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => !isSubmitted && setSelectedOption(option.id)}
              disabled={isSubmitted}
            />
            <div className="visual-flipdisc-container">
              <div className="flipdisc-flipper">
                <div className="flipdisc-front">
                  <svg
                    className="front-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <div className="flipdisc-back">
                  <svg
                    className="back-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <span className="flipdisc-text-content">{option.text}</span>
          </label>
        ))}
      </div>

      {!isSubmitted && showHints && question.hints && question.hints.length > 0 && (
        <div className="hints-section">
          <button className="hint-button" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && (
            <div className="hint">{question.hints[0]}</div>
          )}
        </div>
      )}

      {!isSubmitted ? (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Submit Answer
        </button>
      ) : (
        <div className="explanation">
          <h4>Explanation:</h4>
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
