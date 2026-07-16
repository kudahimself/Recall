/**
 * Strategy comparison: which selection algorithm best balances
 *   1. "Master current topic before unlocking next" (keep the gate strict)
 *   2. "Don't keep repeating questions the user is already good at"
 *   3. "Prioritise blocking questions so the gate opens"
 *
 * We build the user's real stuck state (Data Structures 21/21 seen, Functions
 * partially seen but section blocked), then run three candidate strategies
 * plus the current production strategy against it and across edge cases.
 *
 * Run: CI=true npm test -- --testPathPattern=strategies
 */
import { questions as allQuestions } from '../data/questions';
import { Course, Question, QuestionAttempt, UserProgress } from '../types';
import { getCourseForTopic } from './courseConfig';
import { SpacedRepetitionSystem, recentAttempts, TOPIC_RECENT_WINDOW, pct } from './spacedRepetition';
import { seedMasteredTopics } from './masteryMigration';

const backendQuestions = allQuestions.filter(
  q => getCourseForTopic(q.topic) === Course.BACKEND,
);

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

function attempt(questionId: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return {
    questionId,
    isCorrect,
    timestamp: Date.now() - msAgo,
    attempts: 1,
    timeSpent: 10_000,
  };
}

// ─── Scenario builders ────────────────────────────────────────────────────

/** The user's actual stuck state: DS 21/21 seen at ~80% latest-correct (16/21 wrong on latest), Functions partially seen. */
function scenarioStuckAtDataStructures() {
  const progress = emptyProgress();
  const byTopic = new Map<string, string[]>();
  for (const q of backendQuestions) {
    const arr = byTopic.get(q.topic) ?? [];
    arr.push(q.id);
    byTopic.set(q.topic, arr);
  }

  const basics = byTopic.get('py_basics') ?? [];
  const ds = byTopic.get('py_data_structures') ?? [];
  const fns = byTopic.get('py_functions') ?? [];

  // py_basics — fully mastered (all seen, all latest-correct)
  basics.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.correctAnswers.add(id);
    progress.attemptHistory.push(attempt(id, true, 5 * 86_400_000 + idx * 1000));
  });

  // py_data_structures — the non-blocker questions are seen with a correct
  // first attempt; the blocker tail (~25%) is seen ONCE with a WRONG attempt.
  // The topic's latest-correct therefore NEVER crosses the 80% bar - under
  // sticky mastery (everMetMasteryBar) a topic that never met the bar is the
  // genuinely-stuck state the consolidation path exists for. Scaling to
  // question count keeps the scenario stable as the question pool grows.
  const blockerCount = Math.max(5, Math.ceil(ds.length * 0.25));
  const realBlockers = ds.slice(-blockerCount);
  const blockerSet = new Set(realBlockers);
  ds.forEach((id, idx) => {
    if (blockerSet.has(id)) return;
    progress.questionsAttempted.add(id);
    progress.attemptHistory.push(attempt(id, true, 3 * 86_400_000 + idx * 1000));
  });
  realBlockers.forEach((id, i) => {
    progress.questionsAttempted.add(id);
    // Stagger by 1ms each so sort order is deterministic — the cooldown
    // depends on which blockers are most recent.
    progress.attemptHistory.push(attempt(id, false, 2 * 3_600_000 - i));
  });

  // py_functions — partially seen (~40%), first-try correct mostly
  const fnsSeen = fns.slice(0, Math.floor(fns.length * 0.4));
  fnsSeen.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.correctAnswers.add(id);
    progress.attemptHistory.push(attempt(id, true, 1 * 3_600_000 + idx * 500));
  });

  progress.attemptHistory.sort((a, b) => a.timestamp - b.timestamp);
  // Stored mastery, seeded from history exactly like App.loadProgress: py_basics
  // crosses the bar; py_data_structures never does (the blocker tail stays
  // latest-wrong); py_functions is only partially covered.
  progress.masteredTopics = seedMasteredTopics(backendQuestions, progress.attemptHistory);
  return { progress, blockers: realBlockers, ds, fns };
}

/** Fresh learner, nothing touched. Should pick the first question in sequential order. */
function scenarioFreshUser() {
  return { progress: emptyProgress() };
}

/** All of py_basics mastered (5+ correct streak each), Data Structures 50% seen with a couple wrong. */
function scenarioMasteredPlusLearning() {
  const progress = emptyProgress();
  const byTopic = new Map<string, string[]>();
  for (const q of backendQuestions) {
    const arr = byTopic.get(q.topic) ?? [];
    arr.push(q.id);
    byTopic.set(q.topic, arr);
  }
  const basics = byTopic.get('py_basics') ?? [];
  const ds = byTopic.get('py_data_structures') ?? [];

  // Mastered: each basics question has 5 consecutive correct attempts
  basics.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.correctAnswers.add(id);
    for (let i = 5; i >= 1; i--) {
      progress.attemptHistory.push(attempt(id, true, i * 86_400_000 + idx * 100));
    }
  });

  // DS 50% seen, 2 with latest-wrong
  const seen = ds.slice(0, Math.floor(ds.length * 0.5));
  seen.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.attemptHistory.push(attempt(id, true, 2 * 86_400_000 + idx * 1000));
  });
  seen.slice(0, 2).forEach(id => {
    progress.attemptHistory.push(attempt(id, false, 1 * 3_600_000));
  });

  progress.attemptHistory.sort((a, b) => a.timestamp - b.timestamp);
  progress.masteredTopics = seedMasteredTopics(backendQuestions, progress.attemptHistory);
  return { progress, masteredIds: basics, dsSeen: seen };
}

// ─── Strategy definitions ─────────────────────────────────────────────────
// Each returns a priority score given (question, progress, meta).
// Higher = serve sooner.

interface QuestionMeta {
  // Latest-per-question stats for the question's topic
  topicLatestCorrect: number;
  topicLatestTotal: number;
  topicCoverageFrac: number;
  topicQuestionCount: number;
  // This question's latest attempt correctness (null if unseen)
  thisLatestCorrect: boolean | null;
  // Consecutive correct streak for this question
  correctStreak: number;
  // Total failures for this question
  totalFailures: number;
  isUnseen: boolean;
  daysSinceLast: number;
}

function buildMeta(q: Question, progress: UserProgress, topicQs: Question[]): QuestionMeta {
  const attempts = progress.attemptHistory.filter(a => a.questionId === q.id);
  const topicIds = new Set(topicQs.map(x => x.id));
  // Latest-per-question for the topic
  const latest = new Map<string, boolean>();
  for (const a of progress.attemptHistory) {
    if (topicIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
  }
  const topicLatestCorrect = Array.from(latest.values()).filter(Boolean).length;
  const topicLatestTotal = latest.size;
  const topicQuestionCount = topicQs.length;
  const topicCoverageFrac = topicQuestionCount > 0 ? topicLatestTotal / topicQuestionCount : 0;

  const thisLatestCorrect = attempts.length
    ? attempts.sort((a, b) => a.timestamp - b.timestamp)[attempts.length - 1].isCorrect
    : null;

  const sortedDesc = [...attempts].sort((a, b) => b.timestamp - a.timestamp);
  let correctStreak = 0;
  for (const a of sortedDesc) {
    if (a.isCorrect) correctStreak++; else break;
  }
  const totalFailures = attempts.filter(a => !a.isCorrect).length;

  const daysSinceLast = attempts.length
    ? (Date.now() - Math.max(...attempts.map(a => a.timestamp))) / 86_400_000
    : Infinity;

  return {
    topicLatestCorrect,
    topicLatestTotal,
    topicCoverageFrac,
    topicQuestionCount,
    thisLatestCorrect,
    correctStreak,
    totalFailures,
    isUnseen: attempts.length === 0,
    daysSinceLast,
  };
}

type Strategy = (q: Question, progress: UserProgress, meta: QuestionMeta) => number;

// Current production: reuse the shipped calculatePriority
const strategyCurrent: Strategy = (q, progress) =>
  SpacedRepetitionSystem.calculatePriority(q.id, progress, q);

// A — Blocker boost only. Heavily lift "latest-wrong-in-covered-topic"
//     so the unlock gate is attacked directly. Keep current behaviour otherwise.
const strategyA_BlockerBoost: Strategy = (q, progress, meta) => {
  const base = SpacedRepetitionSystem.calculatePriority(q.id, progress, q);
  const isBlocker = meta.topicCoverageFrac >= 1 && meta.thisLatestCorrect === false;
  return isBlocker ? base + 300 : base;
};

// B — Aggressive mastery dampen. Questions with 3+ correct streak fall to
//     near zero so they stop crowding the pool. Also adds a modest blocker bump.
const strategyB_MasteryDampen: Strategy = (q, progress, meta) => {
  const base = SpacedRepetitionSystem.calculatePriority(q.id, progress, q);
  let score = base;
  if (meta.correctStreak >= 5) score *= 0.05;
  else if (meta.correctStreak >= 3) score *= 0.2;
  const isBlocker = meta.topicCoverageFrac >= 1 && meta.thisLatestCorrect === false;
  if (isBlocker) score += 150;
  return score;
};

// C — Bucket-based. Explicit categories with flat priorities, picked in strict
//     order: blockers > unseen > needs-practice > light-review > mastered-cooldown.
const strategyC_Buckets: Strategy = (q, progress, meta) => {
  // Blockers — latest wrong in covered topic
  if (meta.topicCoverageFrac >= 1 && meta.thisLatestCorrect === false) return 1000;
  // Unseen — still highest sequential priority
  if (meta.isUnseen) return 500;
  // Needs practice — latest wrong, topic not fully covered
  if (meta.thisLatestCorrect === false) return 300;
  // Light review — one or two correct, due again
  if (meta.correctStreak < 3 && meta.daysSinceLast >= 1) return 100;
  // Mastered — near-zero unless everything else is empty
  return 1;
};

// ─── Simulation harness ──────────────────────────────────────────────────

function topicOf(id: string): string {
  return backendQuestions.find(q => q.id === id)?.topic ?? '?';
}

function pickWithStrategy(
  questions: Question[],
  progress: UserProgress,
  strategy: Strategy,
): Question | null {
  const unlocked = SpacedRepetitionSystem.getUnlockedTopics(questions, progress);
  const available = unlocked ? questions.filter(q => unlocked.has(q.topic)) : questions;
  if (available.length === 0) return null;

  const topicToQs = new Map<string, Question[]>();
  for (const q of available) {
    const arr = topicToQs.get(q.topic) ?? [];
    arr.push(q);
    topicToQs.set(q.topic, arr);
  }

  const scored = available.map(q => {
    const meta = buildMeta(q, progress, topicToQs.get(q.topic) ?? []);
    return { q, score: strategy(q, progress, meta) };
  });

  // Weighted random from top 10 (same as production)
  scored.sort((a, b) => b.score - a.score);
  const pool = scored.slice(0, 10);
  const total = pool.reduce((s, x) => s + Math.max(x.score, 0), 0);
  if (total === 0) return pool[0].q;
  let r = Math.random() * total;
  for (const x of pool) {
    r -= Math.max(x.score, 0);
    if (r <= 0) return x.q;
  }
  return pool[0].q;
}

function runDistribution(
  label: string,
  questions: Question[],
  progress: UserProgress,
  strategy: Strategy,
  blockerIds: Set<string>,
  N = 1000,
) {
  const byTopic = new Map<string, number>();
  let blockerPicks = 0;
  let unseenPicks = 0;
  let masteredPicks = 0;

  for (let i = 0; i < N; i++) {
    const q = pickWithStrategy(questions, progress, strategy);
    if (!q) continue;
    byTopic.set(q.topic, (byTopic.get(q.topic) ?? 0) + 1);
    if (blockerIds.has(q.id)) blockerPicks++;
    if (!progress.questionsAttempted.has(q.id)) unseenPicks++;
    const streak = SpacedRepetitionSystem.getCorrectStreak(q.id, progress);
    if (streak >= 3) masteredPicks++;
  }

  console.log(`\n── ${label} ──`);
  console.log(`  blockers picked:  ${blockerPicks}/${N}  (${((blockerPicks / N) * 100).toFixed(1)}%)`);
  console.log(`  unseen picked:    ${unseenPicks}/${N}`);
  console.log(`  mastered picked:  ${masteredPicks}/${N}  ← want this LOW`);
  const sorted = Array.from(byTopic.entries()).sort((a, b) => b[1] - a[1]);
  console.log(`  topic distribution:`);
  sorted.forEach(([t, n]) => console.log(`    ${t.padEnd(25)} ${n}`));
}

// ─── Tests ───────────────────────────────────────────────────────────────

describe('selection strategies — user\'s stuck state', () => {
  test('stuck at Data Structures: each strategy\'s behaviour', () => {
    const { progress, blockers, ds, fns } = scenarioStuckAtDataStructures();
    const blockerIds = new Set(blockers);

    // Sanity
    const dsIds = new Set(ds);
    const latest = new Map<string, boolean>();
    for (const a of progress.attemptHistory) {
      if (dsIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
    }
    const latestCorrect = Array.from(latest.values()).filter(Boolean).length;
    const latestPct = pct(latestCorrect, latest.size);
    const recent = recentAttempts(
      progress.attemptHistory.filter(a => dsIds.has(a.questionId)),
      TOPIC_RECENT_WINDOW,
    );
    const recentCorrect = recent.filter(a => a.isCorrect).length;
    const recentPct = pct(recentCorrect, recent.length);

    console.log('\n═══ STUCK STATE (Data Structures) ═══');
    console.log(`  coverage:        ${latest.size}/${ds.length}`);
    console.log(`  latest-correct:  ${latestCorrect}/${latest.size}  = ${latestPct.toFixed(1)}%  ← UNLOCK GATE (needs > 80%)`);
    console.log(`  recent-10-attempts correct: ${recentCorrect}/${recent.length}  = ${recentPct.toFixed(1)}%  ← UI SHOWS THIS`);
    console.log(`  py_functions seen:  ${fns.filter(id => progress.questionsAttempted.has(id)).length}/${fns.length}`);
    console.log(`  blocker questions (latest wrong in DS): ${blockers.length}`);
    console.log(`    ${blockers.join(', ')}`);

    const unlocked = SpacedRepetitionSystem.getUnlockedTopics(backendQuestions, progress);
    console.log(`  unlocked topics: ${Array.from(unlocked ?? []).join(', ')}`);

    runDistribution('CURRENT (production)', backendQuestions, progress, strategyCurrent, blockerIds);
    runDistribution('A — blocker boost', backendQuestions, progress, strategyA_BlockerBoost, blockerIds);
    runDistribution('B — mastery dampen + blocker bump', backendQuestions, progress, strategyB_MasteryDampen, blockerIds);
    runDistribution('C — bucket-based', backendQuestions, progress, strategyC_Buckets, blockerIds);
  });

  test('edge case: fresh user', () => {
    const { progress } = scenarioFreshUser();
    const blockerIds = new Set<string>();
    console.log('\n═══ EDGE: fresh user ═══');
    runDistribution('CURRENT', backendQuestions, progress, strategyCurrent, blockerIds, 200);
    runDistribution('A', backendQuestions, progress, strategyA_BlockerBoost, blockerIds, 200);
    runDistribution('B', backendQuestions, progress, strategyB_MasteryDampen, blockerIds, 200);
    runDistribution('C', backendQuestions, progress, strategyC_Buckets, blockerIds, 200);
  });

  test('first question in a fresh topic is BEGINNER, not ADVANCED', () => {
    // Scenario: user has mastered every py_async PREREQUISITE but has never touched py_async.
    // We simulate this by marking nothing as seen but stubbing isMastered via
    // running the whole Python Fundamentals as attempted+correct so py_async unlocks.
    // Simpler: use a fresh user and trust that the first question in their path
    // (py_basics) is BEGINNER. Either way the invariant is: newQuestions[0] is BEGINNER.
    const progress = emptyProgress();
    const q = SpacedRepetitionSystem.selectNextQuestion(backendQuestions, progress);
    expect(q).not.toBeNull();
    if (q) {
      // Within the first topic of the path, the very first new pick must be BEGINNER.
      // If a topic has no BEGINNER questions (rare), INTERMEDIATE is acceptable,
      // but never ADVANCED as the first touch.
      expect(q.difficulty).not.toBe('advanced');
      console.log(`\n=== First pick for fresh user ===`);
      console.log(`  id: ${q.id}`);
      console.log(`  topic: ${q.topic}`);
      console.log(`  difficulty: ${q.difficulty}`);
    }
  });

  test('production selectNextQuestion after Strategy A ships: blockers dominate', () => {
    const { progress, blockers } = scenarioStuckAtDataStructures();
    const blockerIds = new Set(blockers);
    let blockerPicks = 0;
    let py_basicsPicks = 0;
    const N = 1000;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(backendQuestions, progress);
      if (!q) continue;
      if (blockerIds.has(q.id)) blockerPicks++;
      if (q.topic === 'py_basics') py_basicsPicks++;
    }
    console.log(`\n═══ PRODUCTION (with blocker boost + mastered interleave) ═══`);
    console.log(`  blockers picked:  ${blockerPicks}/${N}  (${((blockerPicks / N) * 100).toFixed(1)}%)  — should be > 50%`);
    console.log(`  py_basics picked: ${py_basicsPicks}/${N}  (${((py_basicsPicks / N) * 100).toFixed(1)}%)  — expected low (mastered resurface defers while blockers exist)`);
    // Due-driven mastered resurface DEFERS while a covered topic has NEVER
    // met the mastery bar (here py_data_structures, with its unlock blockers):
    // consolidation and progression come first. So py_basics (mastered) does
    // NOT get an interleave share here — it resurfaces once the learner is
    // caught up. Blockers dominate the priority pool.
    expect(blockerPicks / N).toBeGreaterThan(0.5);
    expect(py_basicsPicks / N).toBeLessThan(0.15);
  });

  test('edge case: mastered earlier section, learning current', () => {
    const { progress, masteredIds } = scenarioMasteredPlusLearning();
    // Blockers here are any DS question with latest wrong
    const blockerIds = new Set<string>();
    const byId = new Map<string, boolean>();
    for (const a of progress.attemptHistory) byId.set(a.questionId, a.isCorrect);
    byId.forEach((v, k) => { if (!v) blockerIds.add(k); });

    console.log('\n═══ EDGE: mastered basics + learning DS ═══');
    console.log(`  mastered basics questions: ${masteredIds.length} (should NOT keep appearing)`);
    console.log(`  DS latest-wrong (candidate blockers): ${blockerIds.size}`);

    runDistribution('CURRENT', backendQuestions, progress, strategyCurrent, blockerIds);
    runDistribution('A', backendQuestions, progress, strategyA_BlockerBoost, blockerIds);
    runDistribution('B', backendQuestions, progress, strategyB_MasteryDampen, blockerIds);
    runDistribution('C', backendQuestions, progress, strategyC_Buckets, blockerIds);
  });
});
