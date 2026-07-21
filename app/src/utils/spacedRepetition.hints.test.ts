/**
 * Tiered-hint partial-credit engine. Covers the credit helpers, the credit-aware
 * correctness/streak/mastery math, the maturity flip, and the FSRS grade cap.
 *
 * Run: npm test -- --testPathPattern=hints --watchAll=false
 */
import {
  Difficulty,
  Question,
  QuestionAttempt,
  QuestionType,
  Topic,
  UserProgress,
} from '../types';
import {
  SpacedRepetitionSystem,
  HINT_CREDIT_MATURE,
  HINT_CREDIT_IMMATURE,
} from './spacedRepetition';

function emptyProgress(): UserProgress {
  return {
    questionsAttempted: new Set(),
    correctAnswers: new Set(),
    attemptHistory: [],
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

function makeQ(id: string, topic: Topic): Question {
  return {
    id,
    topic,
    difficulty: Difficulty.BEGINNER,
    type: QuestionType.CODING,
    question: `prompt for ${id}`,
    explanation: 'e',
  } as Question;
}

// Attempt with an explicit credit (the hint-assisted case).
function credited(qid: string, credit: number, msAgo: number): QuestionAttempt {
  return {
    questionId: qid,
    isCorrect: credit >= 0.75,
    credit,
    attempts: 1,
    timeSpent: 5_000,
    timestamp: Date.now() - msAgo,
  };
}

// Legacy attempt: no credit field at all.
function legacy(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return { questionId: qid, isCorrect, attempts: 1, timeSpent: 5_000, timestamp: Date.now() - msAgo };
}

describe('attemptCredit - legacy fallback', () => {
  it('derives credit from the boolean when the field is absent', () => {
    expect(SpacedRepetitionSystem.attemptCredit(legacy('q', true, 0))).toBe(1);
    expect(SpacedRepetitionSystem.attemptCredit(legacy('q', false, 0))).toBe(0);
  });

  it('uses the explicit credit when present', () => {
    expect(SpacedRepetitionSystem.attemptCredit(credited('q', 0.5, 0))).toBe(0.5);
  });
});

describe('latestCorrectness - credit threshold', () => {
  it('counts a >=0.75 credit as correct and a lower one as wrong', () => {
    const p = emptyProgress();
    p.attemptHistory = [credited('hi', 0.8, 10), credited('lo', 0.5, 10)];
    const latest = SpacedRepetitionSystem.latestCorrectness(p);
    expect(latest.get('hi')).toBe(true);
    expect(latest.get('lo')).toBe(false);
  });
});

describe('getCorrectStreak - credit continues or breaks the streak', () => {
  it('an immature tier-1 pass (0.8) continues the streak', () => {
    const p = emptyProgress();
    p.attemptHistory = [credited('q', 1, 30), credited('q', 0.8, 10)];
    expect(SpacedRepetitionSystem.getCorrectStreak('q', p)).toBe(2);
  });

  it('a heavier hinted pass (0.5) breaks the streak', () => {
    const p = emptyProgress();
    p.attemptHistory = [credited('q', 1, 30), credited('q', 0.5, 10)];
    expect(SpacedRepetitionSystem.getCorrectStreak('q', p)).toBe(0);
  });
});

describe('updateMasteredTopics - fractional credit sums', () => {
  const TOPIC = Topic.PY_BASICS;
  const qs = [0, 1, 2, 3, 4].map(i => makeQ(`q${i}`, TOPIC));

  it('4 clean + one 0.5 = 90% -> mastered (strict > 80 bar)', () => {
    const p = emptyProgress();
    p.attemptHistory = [
      credited('q0', 1, 5), credited('q1', 1, 5), credited('q2', 1, 5),
      credited('q3', 1, 5), credited('q4', 0.5, 5),
    ];
    const next = SpacedRepetitionSystem.updateMasteredTopics(p, TOPIC, qs);
    expect(next.has(TOPIC)).toBe(true);
  });

  it('3 clean + two 0.5 = 80% -> NOT mastered (bar is strict >)', () => {
    const p = emptyProgress();
    p.attemptHistory = [
      credited('q0', 1, 5), credited('q1', 1, 5), credited('q2', 1, 5),
      credited('q3', 0.5, 5), credited('q4', 0.5, 5),
    ];
    const next = SpacedRepetitionSystem.updateMasteredTopics(p, TOPIC, qs);
    expect(next.has(TOPIC)).toBe(false);
  });
});

describe('getHintCreditSchedule - maturity flip', () => {
  const TOPIC = Topic.PY_BASICS;

  it('a fresh card gets the gentle immature schedule', () => {
    const p = emptyProgress();
    expect(SpacedRepetitionSystem.getHintCreditSchedule('q', TOPIC, p)).toBe(HINT_CREDIT_IMMATURE);
  });

  it('a card with a 2-long clean streak is mature (steep schedule)', () => {
    const p = emptyProgress();
    p.attemptHistory = [credited('q', 1, 30), credited('q', 1, 10)];
    expect(SpacedRepetitionSystem.getHintCreditSchedule('q', TOPIC, p)).toBe(HINT_CREDIT_MATURE);
  });

  it('any card in a mastered topic is mature regardless of streak', () => {
    const p = emptyProgress();
    p.masteredTopics = new Set([TOPIC]);
    expect(SpacedRepetitionSystem.getHintCreditSchedule('q', TOPIC, p)).toBe(HINT_CREDIT_MATURE);
  });
});

describe('capGradeForHints - FSRS grade ceiling by tier', () => {
  it('tier 0 leaves the grade untouched', () => {
    expect(SpacedRepetitionSystem.capGradeForHints(4, 0)).toBe(4);
    expect(SpacedRepetitionSystem.capGradeForHints(3, 0)).toBe(3);
  });

  it('tier 1 caps at hard (2) and tier 2 floors to a lapse (1)', () => {
    expect(SpacedRepetitionSystem.capGradeForHints(4, 1)).toBe(2);
    expect(SpacedRepetitionSystem.capGradeForHints(4, 2)).toBe(1);
  });

  it('never raises a grade already below the cap', () => {
    expect(SpacedRepetitionSystem.capGradeForHints(1, 1)).toBe(1);
  });
});
