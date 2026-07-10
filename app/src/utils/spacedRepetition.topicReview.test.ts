/**
 * Tests for getTopicDueReviewCount — the per-topic count shown on the breadcrumb
 * pill. Scoped to the current topic (not the global drain backlog): 0 until the
 * topic is mastered, then it rises as that topic's cards age past their
 * (difficulty-scaled) review interval.
 *
 * Run: npm test -- --testPathPattern=topicReview --watchAll=false
 */
import {
  Difficulty,
  Question,
  QuestionAttempt,
  QuestionType,
  Topic,
  UserProgress,
} from '../types';
import { SpacedRepetitionSystem } from './spacedRepetition';

const DAY = 86_400_000;

function emptyProgress(): UserProgress {
  return {
    questionsAttempted: new Set(),
    correctAnswers: new Set(),
    attemptHistory: [],
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(),
    repetitionQueue: new Map(),
  };
}

function makeQ(id: string, difficulty = Difficulty.BEGINNER): Question {
  return {
    id,
    topic: Topic.PY_BASICS,
    difficulty,
    type: QuestionType.MULTIPLE_CHOICE,
    question: `prompt for ${id}`,
    options: [
      { id: 'a', text: 'a', isCorrect: true },
      { id: 'b', text: 'b', isCorrect: false },
    ],
    explanation: 'e',
  } as Question;
}

function makeAttempt(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return { questionId: qid, isCorrect, timestamp: Date.now() - msAgo, attempts: 1, timeSpent: 5_000 };
}

function recordAttempt(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push(makeAttempt(qid, isCorrect, msAgo));
  progress.lastAttempt.set(qid, Date.now() - msAgo);
}

describe('getTopicDueReviewCount', () => {
  test('returns 0 while the topic is still being learned (not fully covered → not mastered)', () => {
    const qs = [makeQ('q0'), makeQ('q1')];
    const progress = emptyProgress();
    recordAttempt(progress, 'q0', true, 10 * DAY); // only 1 of 2 attempted
    expect(SpacedRepetitionSystem.getTopicDueReviewCount(qs, progress)).toBe(0);
  });

  test('returns 0 for a mastered topic whose cards were all just reviewed (none due yet)', () => {
    const qs = [makeQ('q0'), makeQ('q1')];
    const progress = emptyProgress();
    recordAttempt(progress, 'q0', true, 60_000); // 1 min ago, interval 1 day → not due
    recordAttempt(progress, 'q1', true, 60_000);
    expect(SpacedRepetitionSystem.getTopicDueReviewCount(qs, progress)).toBe(0);
  });

  test('counts the mastered cards that have aged past their review interval', () => {
    const qs = [makeQ('q0'), makeQ('q1')];
    const progress = emptyProgress();
    // streak 1 → 1-day interval; reviewed 10 days ago → both due.
    recordAttempt(progress, 'q0', true, 10 * DAY);
    recordAttempt(progress, 'q1', true, 10 * DAY);
    expect(SpacedRepetitionSystem.getTopicDueReviewCount(qs, progress)).toBe(2);
  });

  test('honors difficulty scaling — a hard card comes due sooner than an easy one', () => {
    const qs = [makeQ('hard'), makeQ('easy')];
    const progress = emptyProgress();
    // Mastered (both correct, full coverage), both last reviewed 3 days ago.
    // streak 1 → base interval 3 days (getTargetInterval([1,3,7,...])[1]).
    recordAttempt(progress, 'hard', true, 3 * DAY);
    recordAttempt(progress, 'easy', true, 3 * DAY);
    // FSRS difficulty 1..10 scales the interval: hard=9 → ~3×0.49 ≈ 1.5d → due at
    // 3 days; easy=2 → ~3×2.04 ≈ 6.1d → not yet due at 3 days.
    const cardDifficulty = { hard: 9, easy: 2 };
    expect(SpacedRepetitionSystem.getTopicDueReviewCount(qs, progress, cardDifficulty)).toBe(1);
  });

  test('returns 0 for an empty topic', () => {
    expect(SpacedRepetitionSystem.getTopicDueReviewCount([], emptyProgress())).toBe(0);
  });
});
