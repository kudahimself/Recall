/**
 * Review-drain regressions reproduced from a replay of a real six-month history.
 *
 * 1. Missed non-drain cards were stranded. A card whose latest answer was wrong
 *    but that is not a drain card (an MCQ / parsons / cloze / predict card that
 *    is not advanced) had no branch that owned it: the drain serves only
 *    coding/advanced cards, and the concept-aware path picks by concept
 *    retrievability, not by the miss. In the real history 39 such cards, 35 in
 *    mastered topics, went 50-91 days unseen while the learner kept studying,
 *    e.g. py-async-parsons-10 (91 days). Now every missed card comes back once
 *    its relearn interval has passed, oldest miss first.
 * 2. The due branch served cards that were not due. Once any mastered card was
 *    due, pickMasteredResurface drew from EVERY mastered card weighted by its
 *    due ratio, so a single due card among many recently reviewed ones usually
 *    lost the draw to a card that was not due at all.
 *
 * dev-unlock is enabled so section/unit gating doesn't shadow the synthetic
 * topics used here.
 *
 * Run: npm test -- --testPathPattern=drainRecovery --watchAll=false
 */
import {
  Course,
  Difficulty,
  Question,
  QuestionAttempt,
  QuestionType,
  Topic,
  UserProgress,
} from '../types';
import { getSelectionPolicy } from './courseConfig';
import { SpacedRepetitionSystem } from './spacedRepetition';

const backendPolicy = getSelectionPolicy(Course.BACKEND);
const DAY = 86_400_000;

beforeAll(() => {
  localStorage.setItem('recall-dev-unlock-all', '1');
});
afterAll(() => {
  localStorage.removeItem('recall-dev-unlock-all');
});

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

function makeQ(id: string, topic: Topic, difficulty: Difficulty, type = QuestionType.MULTIPLE_CHOICE): Question {
  return {
    id,
    topic,
    difficulty,
    type,
    question: `prompt for ${id}`,
    options: [
      { id: 'a', text: 'a', isCorrect: true },
      { id: 'b', text: 'b', isCorrect: false },
    ],
    explanation: 'e',
  } as Question;
}

/** Append an attempt `msAgo` before now, keeping questionsAttempted + lastAttempt in sync. */
function record(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  const timestamp = Date.now() - msAgo;
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push({ questionId: qid, isCorrect, timestamp, attempts: 1, timeSpent: 5_000 } as QuestionAttempt);
  progress.lastAttempt.set(qid, timestamp);
}

/** Serve `picks` questions, answering each correctly, and return the served ids in order. */
function serveCorrectly(pool: Question[], progress: UserProgress, picks: number): string[] {
  const served: string[] = [];
  for (let i = 0; i < picks; i++) {
    const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
    if (!q) break;
    served.push(q.id);
    record(progress, q.id, true, 0);
  }
  return served;
}

describe('a missed non-drain card is not stranded behind the drain', () => {
  /**
   * The bug-8 shape: a mastered topic, a returning learner with a backlog of
   * due drain cards, and a parsons card missed 91 days ago. Before the fix the
   * drain served only the advanced cards, so the missed card waited behind the
   * whole backlog (and in the real history, behind every later backlog too).
   */
  function returningLearner(olderMisses: [Question, number][] = []) {
    const backlog = Array.from({ length: 30 }, (_, i) =>
      makeQ(`adv-${i}`, Topic.PY_ASYNC, Difficulty.ADVANCED));
    const missed = makeQ('py-async-parsons-10', Topic.PY_ASYNC, Difficulty.INTERMEDIATE, QuestionType.PARSONS);
    const progress = emptyProgress();
    record(progress, missed.id, false, 91 * DAY);
    for (const [q, daysAgo] of olderMisses) record(progress, q.id, false, daysAgo * DAY);
    for (const q of backlog) record(progress, q.id, true, 90 * DAY);
    progress.masteredTopics.add(Topic.PY_ASYNC);
    return { pool: [...backlog, missed, ...olderMisses.map(([q]) => q)], progress, missed };
  }

  test('the drain is pending and the missed card is outside it', () => {
    const { pool, progress, missed } = returningLearner();
    const status = SpacedRepetitionSystem.getReviewStatus(pool, progress, backendPolicy);
    expect(status.mode).toBe('drain');
    expect(status.drainQueueCount).toBe(30);
    expect(SpacedRepetitionSystem.isDrainCard(missed)).toBe(false);
  });

  test('the missed card comes back on the first review pick, ahead of the backlog', () => {
    const { pool, progress, missed } = returningLearner();
    // Last answer correct, so the pick goes through the review branch.
    record(progress, 'adv-0', true, 60_000);
    const served = serveCorrectly(pool, progress, 5);
    expect(served[0]).toBe(missed.id);
  });

  test('a card missed mid-drain comes back once its relearn interval passes', () => {
    const { pool, progress, missed } = returningLearner();
    // Clear the old miss, then miss it again two days ago while the backlog is still pending.
    record(progress, missed.id, true, 3 * DAY);
    record(progress, missed.id, false, 2 * DAY);
    record(progress, 'adv-0', true, 60_000);
    const served = serveCorrectly(pool, progress, 5);
    expect(served).toContain(missed.id);
  });

  test('a miss still inside its relearn interval waits; the drain keeps draining', () => {
    const { pool, progress, missed } = returningLearner();
    record(progress, missed.id, true, 3 * DAY);
    record(progress, missed.id, false, 2 * 60 * 60_000); // two hours ago
    record(progress, 'adv-0', true, 60_000);
    const served = serveCorrectly(pool, progress, 10);
    expect(served).not.toContain(missed.id);
    expect(served.every(id => id.startsWith('adv-'))).toBe(true);
  });

  test('several stranded misses all come back, oldest miss first', () => {
    const { pool, progress } = returningLearner([
      [makeQ('cloze-50', Topic.PY_ASYNC, Difficulty.BEGINNER, QuestionType.CLOZE_CODE), 50],
      [makeQ('mcq-60', Topic.PY_ASYNC, Difficulty.BEGINNER), 60],
    ]);
    record(progress, 'adv-0', true, 60_000);
    const served = serveCorrectly(pool, progress, 3);
    expect(served).toEqual(['py-async-parsons-10', 'mcq-60', 'cloze-50']);
  });

  test('a new question still wins its draw: relearning takes review slots only', () => {
    // Caught-up learner (no drain), mid-way through a new topic, one old miss owed.
    const mastered = Array.from({ length: 4 }, (_, i) => makeQ(`m-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER));
    const newQs = Array.from({ length: 8 }, (_, i) => makeQ(`n-${i}`, Topic.PY_DECORATORS, Difficulty.BEGINNER));
    const progress = emptyProgress();
    for (const q of mastered) record(progress, q.id, true, 60 * 60_000);
    record(progress, 'm-0', false, 5 * DAY);
    record(progress, 'n-0', true, 60_000);
    progress.masteredTopics.add(Topic.PY_BASICS);
    const pool = [...mastered, ...newQs];
    let newPicks = 0;
    const N = 600;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (q && q.topic === Topic.PY_DECORATORS) newPicks++;
    }
    expect(newPicks / N).toBeGreaterThan(0.65);
  });
});

describe('pickDueRelearn', () => {
  test('ignores latest-correct cards and misses still inside their relearn interval', () => {
    const a = makeQ('a', Topic.PY_BASICS, Difficulty.BEGINNER);
    const b = makeQ('b', Topic.PY_BASICS, Difficulty.BEGINNER);
    const progress = emptyProgress();
    record(progress, 'a', true, 10 * DAY);
    record(progress, 'b', false, 60 * 60_000);
    expect(SpacedRepetitionSystem.pickDueRelearn([a, b], progress)).toBeNull();
  });

  test('a hard card is owed sooner: the relearn interval follows card difficulty', () => {
    const a = makeQ('a', Topic.PY_BASICS, Difficulty.BEGINNER);
    const progress = emptyProgress();
    record(progress, 'a', false, 0.5 * DAY);
    expect(SpacedRepetitionSystem.pickDueRelearn([a], progress)).toBeNull();
    expect(SpacedRepetitionSystem.pickDueRelearn([a], progress, { a: 10 })?.id).toBe('a');
  });
});

describe('the due branch serves due cards only', () => {
  /**
   * Caught up (nothing unseen, no drain cards), one MCQ due among sixty that
   * were reviewed six hours ago. Before the fix the due branch drew over all
   * sixty-one weighted by due ratio and served the due card about a quarter of
   * the time; the rest of the picks were cards at ~8% of their interval.
   */
  test('one due card among many recently reviewed ones is the card served', () => {
    const fresh = Array.from({ length: 60 }, (_, i) => makeQ(`f-${i}`, Topic.PY_BASICS, Difficulty.INTERMEDIATE));
    const due = makeQ('due', Topic.PY_BASICS, Difficulty.BEGINNER);
    const progress = emptyProgress();
    record(progress, 'due', true, 10 * DAY);
    for (const q of fresh) record(progress, q.id, true, 6 * 60 * 60_000);
    progress.masteredTopics.add(Topic.PY_BASICS);
    const pool = [...fresh, due];
    let duePicks = 0;
    const N = 400;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (q?.id === 'due') duePicks++;
    }
    expect(duePicks / N).toBeGreaterThan(0.95);
  });
});
