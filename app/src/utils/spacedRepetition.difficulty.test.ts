/**
 * Difficulty-scaled drain scheduling: an auto-graded per-card FSRS difficulty
 * (easy → longer interval, hard → shorter) drives WHEN a drain card is due, and
 * rolls up to a per-topic easy/medium/hard label. A card with no recorded
 * difficulty (legacy / untagged) → factor 1.0 → unchanged streak interval.
 *
 * Run: npm test -- --testPathPattern=difficulty --watchAll=false
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
import { gradeFromResponseTime } from './conceptSRS';
import {
  EASE_MAX_FACTOR,
  EASE_MIN_FACTOR,
  easeFactor,
  SpacedRepetitionSystem,
} from './spacedRepetition';
import { seedMasteredTopics } from './masteryMigration';

const backendPolicy = getSelectionPolicy(Course.BACKEND);
const DAY = 86_400_000;
const S = SpacedRepetitionSystem;

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

function makeQ(id: string, topic: Topic, difficulty: Difficulty): Question {
  return {
    id, topic, difficulty,
    type: QuestionType.MULTIPLE_CHOICE,
    question: `prompt ${id}`,
    options: [{ id: 'a', text: 'a', isCorrect: true }, { id: 'b', text: 'b', isCorrect: false }],
    explanation: 'e',
  };
}

function attempt(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return { questionId: qid, isCorrect, timestamp: Date.now() - msAgo, attempts: 1, timeSpent: 5000 };
}
function recordAttempt(p: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  p.questionsAttempted.add(qid);
  if (isCorrect) p.correctAnswers.add(qid);
  p.attemptHistory.push(attempt(qid, isCorrect, msAgo));
  p.lastAttempt.set(qid, Date.now() - msAgo);
}
const t2q = (qs: Question[]) => {
  const m = new Map<string, Question[]>();
  qs.forEach(q => { const a = m.get(q.topic) ?? []; a.push(q); m.set(q.topic, a); });
  return m;
};

// ─────────────────────────────────────────────────────────────────────────
describe('easeFactor', () => {
  test('0 / undefined / negative → 1.0 (no-data passthrough)', () => {
    expect(easeFactor(0)).toBe(1);
    expect(easeFactor(undefined as any)).toBe(1);
    expect(easeFactor(-3)).toBe(1);
  });
  test('mid → 1.0, easiest → MAX, hardest → MIN; monotonic decreasing; clamped', () => {
    expect(easeFactor(5.5)).toBeCloseTo(1, 6);
    expect(easeFactor(1)).toBeCloseTo(EASE_MAX_FACTOR, 6);
    expect(easeFactor(10)).toBeCloseTo(EASE_MIN_FACTOR, 6);
    expect(easeFactor(15)).toBe(easeFactor(10)); // clamped to D=10
    let prev = Infinity;
    for (let d = 1; d <= 10; d++) {
      const f = easeFactor(d);
      expect(f).toBeLessThanOrEqual(prev);
      prev = f;
    }
  });
});

describe('getEffectiveInterval', () => {
  test('no difficulty → plain streak interval; hard < easy at equal streak', () => {
    const q = makeQ('q', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'q', true, DAY); // streak 1 → base interval 3 days
    expect(S.getEffectiveInterval('q', p, {})).toBeCloseTo(3, 6);
    expect(S.getEffectiveInterval('q', p, { q: 9 })).toBeCloseTo(3 * easeFactor(9), 6);
    expect(S.getEffectiveInterval('q', p, { q: 9 }))
      .toBeLessThan(S.getEffectiveInterval('q', p, { q: 2 }));
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('hard cards become due sooner than easy ones (same streak)', () => {
  // streak 1 → base 3 days, reviewed 3 days ago. easy(D=2) interval ≈ 6.1 (not
  // due); hard(D=9) interval ≈ 1.5 (due).
  const q = makeQ('h', Topic.PY_BASICS, Difficulty.ADVANCED);
  const map = t2q([q]);
  function seed() {
    const p = emptyProgress();
    recordAttempt(p, 'h', true, 3 * DAY);
    p.masteredTopics = seedMasteredTopics([q], p.attemptHistory);
    return p;
  }

  test('hasDueMastered: hard due, easy not', () => {
    expect(S.hasDueMastered([q], map, seed(), undefined, { h: 9 })).toBe(true);
    expect(S.hasDueMastered([q], map, seed(), undefined, { h: 2 })).toBe(false);
  });
  test('hasPendingDrain: hard due, easy not', () => {
    expect(S.hasPendingDrain([q], map, seed(), { h: 9 })).toBe(true);
    expect(S.hasPendingDrain([q], map, seed(), { h: 2 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('getTopicDifficulty rollup', () => {
  const a = makeQ('a', Topic.PY_BASICS, Difficulty.ADVANCED);
  const b = makeQ('b', Topic.PY_BASICS, Difficulty.ADVANCED);
  const beg = makeQ('beg', Topic.PY_BASICS, Difficulty.BEGINNER); // not a drain card

  test('null when no graded drain cards', () => {
    expect(S.getTopicDifficulty([a, b], {})).toBeNull();
  });
  test('easy / medium / hard thresholds on the average', () => {
    expect(S.getTopicDifficulty([a, b], { a: 2, b: 4 })).toEqual({ avg: 3, label: 'easy' });
    expect(S.getTopicDifficulty([a, b], { a: 5, b: 6 })?.label).toBe('medium');
    expect(S.getTopicDifficulty([a, b], { a: 8, b: 8 })?.label).toBe('hard');
  });
  test('ignores non-drain cards and skips D=0 cards in the average', () => {
    // beg (beginner) excluded; b has no difficulty → skipped → avg is just a.
    expect(S.getTopicDifficulty([a, beg, b], { a: 9, beg: 1 })?.avg).toBe(9);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('drain count parity', () => {
  test('equal mid difficulty does NOT change drainQueueCount vs the legacy baseline', () => {
    const x1 = makeQ('x1', Topic.PY_BASICS, Difficulty.ADVANCED);
    const x2 = makeQ('x2', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'x1', true, 5 * DAY); // due (base 3)
    recordAttempt(p, 'x2', true, 5 * DAY);
    p.masteredTopics = seedMasteredTopics([x1, x2], p.attemptHistory);
    const baseline = S.getReviewStatus([x1, x2], p, backendPolicy).drainQueueCount;
    const mid = S.getReviewStatus([x1, x2], p, backendPolicy, { x1: 5.5, x2: 5.5 }).drainQueueCount;
    expect(baseline).toBe(2);
    expect(mid).toBe(baseline);
  });

  test('pill/gate parity: hasPendingDrain truthiness == drainQueueCount > 0', () => {
    const q = makeQ('p', Topic.PY_BASICS, Difficulty.ADVANCED);
    const map = t2q([q]);
    const seed = () => { const p = emptyProgress(); recordAttempt(p, 'p', true, 5 * DAY); p.masteredTopics = seedMasteredTopics([q], p.attemptHistory); return p; };
    for (const cd of [{ p: 3 }, { p: 9 }, { p: 2 }] as Record<string, number>[]) {
      const p = seed();
      const gate = S.hasPendingDrain([q], map, p, cd);
      const count = S.getReviewStatus([q], p, backendPolicy, cd).drainQueueCount;
      expect(gate).toBe(count > 0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('coding response-time envelope (widened)', () => {
  test('a 3-minute coding answer is no longer graded HARD; ≥10 min is', () => {
    expect(gradeFromResponseTime('coding', 180_000, true)).not.toBe(2); // was hard at old 180k floor
    expect(gradeFromResponseTime('coding', 180_000, true)).toBe(4);     // ≤4 min → easy
    expect(gradeFromResponseTime('coding', 400_000, true)).toBe(3);     // ~6.5 min → good
    expect(gradeFromResponseTime('coding', 600_000, true)).toBe(2);     // ≥10 min → hard
    expect(gradeFromResponseTime('coding', 5_000, false)).toBe(1);      // wrong → fail
  });
});
