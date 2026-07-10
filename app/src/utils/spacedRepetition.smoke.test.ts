/**
 * Per-course distribution smoke tests. Builds a synthetic multi-card pool for
 * each course, runs 1000 picks, and asserts no single card dominates.
 *
 * The point is *not* to test the bucketing math (other files do that) — it's
 * to catch regressions where one course silently breaks (e.g. a path-order
 * change leaves DE selecting only one topic, or a policy hook starves a
 * course's pool).
 *
 * Run:  npm test -- --testPathPattern=smoke
 */
import { Course, Difficulty, Question, QuestionType, Topic, UserProgress } from '../types';
import { SpacedRepetitionSystem } from './spacedRepetition';
import { getSelectionPolicy } from './courseConfig';

const NOW = Date.now();

const mcq = (id: string, topic: Topic): Question => ({
  id,
  type: QuestionType.MULTIPLE_CHOICE,
  difficulty: Difficulty.BEGINNER,
  topic,
  question: `q-${id}`,
  explanation: '',
  options: [
    { id: 'a', text: 'a', isCorrect: true },
    { id: 'b', text: 'b', isCorrect: false },
  ],
});

/** Build a progress where all cards in `pool` have been seen + answered correctly
 *  long enough ago that the review-path runs but cooldown is irrelevant. */
function seenLongAgo(pool: Question[]): UserProgress {
  const ago = 7 * 24 * 60 * 60 * 1000; // 7 days
  const lastAttempt = new Map<string, number>();
  const questionsAttempted = new Set<string>();
  const correctAnswers = new Set<string>();
  const topicScores = new Map<Topic, { correct: number; total: number }>();
  const attemptHistory = pool.map(q => {
    questionsAttempted.add(q.id);
    correctAnswers.add(q.id);
    lastAttempt.set(q.id, NOW - ago);
    const ts = topicScores.get(q.topic) ?? { correct: 0, total: 0 };
    ts.correct += 1; ts.total += 1;
    topicScores.set(q.topic, ts);
    return {
      questionId: q.id, isCorrect: true, timestamp: NOW - ago, attempts: 1, timeSpent: 0,
    };
  });
  return {
    questionsAttempted,
    correctAnswers,
    attemptHistory,
    topicScores,
    difficultyScores: new Map(),
    lastAttempt,
    repetitionQueue: new Map(),
  };
}

/** No single card exceeds `maxFraction` of picks. */
function assertHealthyDistribution(
  picks: Map<string, number>,
  totalPicks: number,
  maxFraction: number,
  label: string,
) {
  const sorted = Array.from(picks.entries()).sort((a, b) => b[1] - a[1]);
  const [topId, topCount] = sorted[0] ?? ['<none>', 0];
  const topShare = topCount / totalPicks;
  if (topShare > maxFraction) {
    // Surface the top 5 so failures are debuggable.
    const top = sorted.slice(0, 5).map(([id, n]) => `${id}=${n}`).join(', ');
    throw new Error(
      `[${label}] top card ${topId} took ${(topShare * 100).toFixed(1)}% of ${totalPicks} picks ` +
      `(limit ${(maxFraction * 100).toFixed(0)}%). Top 5: ${top}`,
    );
  }
}

describe('per-course distribution smoke', () => {
  const RUNS = 1000;
  // With REVIEW_COOLDOWN=3, only (pool - 3) cards survive cooldown each pick.
  // With a 10-card pool, ~7 are eligible — a healthy run should leave the
  // top card under ~30%. We allow some headroom (40%) to keep this from
  // flaking; the failure case we care about is a true regression where one
  // card grabs >50% (e.g. a sort bug pinning newQuestions[0] every time).
  const MAX_DOMINANT_FRACTION = 0.40;

  const buildPool = (prefix: string, topic: Topic, n: number): Question[] =>
    Array.from({ length: n }, (_, i) => mcq(`${prefix}-${i + 1}`, topic));

  test.each([
    { course: Course.BACKEND, pool: buildPool('be', Topic.PY_BASICS, 10) },
    { course: Course.WEB_DEV, pool: buildPool('wd', Topic.HTML_BASICS, 10) },
    { course: Course.DATABRICKS, pool: buildPool('db', Topic.DATABRICKS_BASICS, 10) },
    { course: Course.DATA_ENGINEERING, pool: buildPool('de', Topic.DE_BATCH_VS_STREAMING, 10) },
  ])('$course: 10-card pool, no card dominates', ({ course, pool }) => {
    const progress = seenLongAgo(pool);
    const policy = getSelectionPolicy(course);
    const picks = new Map<string, number>();
    let totalPicks = 0;
    for (let i = 0; i < RUNS; i++) {
      const pick = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, policy);
      if (!pick) continue;
      picks.set(pick.id, (picks.get(pick.id) ?? 0) + 1);
      totalPicks++;
    }
    expect(totalPicks).toBeGreaterThan(0);
    assertHealthyDistribution(picks, totalPicks, MAX_DOMINANT_FRACTION, course);
  });

  test('Data Engineering with policy.useConceptSRS=false skips concept-aware', () => {
    // Even when a ConceptSelectionContext is provided, DE policy should
    // shortcut around the concept-aware bucketing pass and use legacy.
    const pool = [
      mcq('de-a', Topic.DE_BATCH_VS_STREAMING),
      mcq('de-b', Topic.DE_BATCH_VS_STREAMING),
      mcq('de-c', Topic.DE_BATCH_VS_STREAMING),
    ];
    const progress = seenLongAgo(pool);
    const policy = getSelectionPolicy(Course.DATA_ENGINEERING);
    expect(policy.useConceptSRS).toBe(false);
    // Pass an empty ctx — the policy gate should prevent it from doing
    // anything; selection should still produce a valid pick from legacy.
    const pick = SpacedRepetitionSystem.selectNextQuestion(
      pool, progress, { progress: {}, betas: {} }, policy,
    );
    expect(pick).not.toBeNull();
    expect(['de-a', 'de-b', 'de-c']).toContain(pick!.id);
  });
});
