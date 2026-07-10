/**
 * Simulator (not an assertion test) — prints the actual next-question stream
 * that selectNextQuestion produces for a given topic, starting from the
 * realistic "all prior topics fully completed; this topic untouched" state
 * that the user lands in after the resetProgressFromTopic helper runs.
 *
 * Run:
 *   npx jest --testPathPattern=nextQuestionStream --verbose
 *
 * Reads as a stream of picks; each line shows topic / type / difficulty /
 * which concept bucket the picked card came from, so we can see whether the
 * legacy type-sort (MCQ → PREDICT → PARSONS → CLOZE → CODING) or the
 * concept-aware bucketing is driving the order.
 */
import {
  SpacedRepetitionSystem,
  ConceptSelectionContext,
} from '../spacedRepetition';
import {
  applyReview,
  bucketCard,
  ConceptProgress,
  gradeFromResponseTime,
} from '../conceptSRS';
import {
  buildQuestionConceptIndex,
  migrateAttemptHistoryToConceptProgress,
} from '../conceptMigration';
import { BACKEND_CONCEPTS } from '../conceptRegistry';
import {
  getSelectionPolicy,
  getTopicOrder,
} from '../courseConfig';
import { questions } from '../../data/questions';
import {
  Course,
  Question,
  QuestionAttempt,
  UserProgress,
} from '../../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of BACKEND_CONCEPTS) {
    if (c.beta !== undefined) o[c.id] = c.beta;
  }
  return o;
})();

// Seeded PRNG so runs are reproducible — otherwise Math.random would mix
// concept-aware bucket sampling differently each invocation and the stream
// would jitter.
function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const original = Math.random;
  Math.random = seededRandom(seed);
  try { return fn(); } finally { Math.random = original; }
}

/**
 * Build a UserProgress that mimics "user has fully completed every topic
 * ordered BEFORE targetTopic in the BACKEND path; targetTopic itself and
 * everything after it is untouched". This is the post-reset state the user
 * lands in when they hit a topic for the first time.
 */
function buildPriorCompletionState(targetTopic: string): {
  pool: Question[];
  progress: UserProgress;
  conceptProgress: ConceptProgress;
} {
  const order = getTopicOrder(Course.BACKEND);
  const idx = order.indexOf(targetTopic);
  if (idx < 0) throw new Error(`Topic ${targetTopic} not in BACKEND path order`);

  const completed = new Set(order.slice(0, idx));
  const orderSet = new Set(order);
  const pool = questions.filter(q => orderSet.has(q.topic));
  const priorQs = pool.filter(q => completed.has(q.topic));

  // Stagger timestamps over the last ~12 hours. Matches the actual case where
  // the user is mid-session — they just finished prior topics and are now
  // hitting magic_methods / regex with everything still warm. Prior-topic
  // cards have R ≈ 1 so they stay out of DUE and the stream is dominated by
  // the new-topic cards — which is what the user actually reports seeing.
  const now = Date.now();
  const STUDY_SPAN_HOURS = 12;
  const attemptHistory: QuestionAttempt[] = priorQs.map((q, i) => ({
    questionId: q.id,
    isCorrect: true,
    timestamp: now - STUDY_SPAN_HOURS * 60 * 60 * 1000 + (i * STUDY_SPAN_HOURS * 60 * 60 * 1000) / priorQs.length,
    attempts: 1,
    timeSpent: 8_000,
  }));

  const questionsAttempted = new Set(priorQs.map(q => q.id));
  const correctAnswers = new Set(priorQs.map(q => q.id));
  const lastAttempt = new Map<string, number>();
  for (const a of attemptHistory) lastAttempt.set(a.questionId, a.timestamp!);

  const progress: UserProgress = {
    questionsAttempted,
    correctAnswers,
    topicScores: new Map(),
    difficultyScores: new Map(),
    attemptHistory,
    lastAttempt,
    repetitionQueue: new Map(),
  };

  const conceptIndex = buildQuestionConceptIndex(pool);
  const conceptProgress = migrateAttemptHistoryToConceptProgress(
    attemptHistory,
    conceptIndex,
  );

  return { pool, progress, conceptProgress };
}

/** Re-derive the bucket name for the picked card so we can label why it was chosen. */
function labelBucket(q: Question, progress: UserProgress, cp: ConceptProgress): string {
  const cids = q.concepts ?? [];
  if (cids.length === 0) return 'UNTAGGED→LEGACY';
  const lastReviewed = progress.lastAttempt.get(q.id) ?? 0;
  const elapsed = lastReviewed > 0 ? (Date.now() - lastReviewed) / MS_PER_DAY : 0;
  return bucketCard(cids, cp, elapsed, CONCEPT_BETAS, Date.now());
}

/** Snapshot the per-bucket counts for the topic right now, so we see why DUE dominates. */
function bucketCensus(topicKey: string, pool: Question[], progress: UserProgress, cp: ConceptProgress) {
  const census = { DUE: 0, FRINGE: 0, SPOT_CHECK: 0, IDLE: 0, UNTAGGED: 0 };
  for (const q of pool.filter(p => p.topic === topicKey)) {
    if (!q.concepts || q.concepts.length === 0) { census.UNTAGGED++; continue; }
    const last = progress.lastAttempt.get(q.id) ?? 0;
    const el = last > 0 ? (Date.now() - last) / MS_PER_DAY : 0;
    const b = bucketCard(q.concepts, cp, el, CONCEPT_BETAS, Date.now());
    census[b]++;
  }
  return census;
}

function simulate(targetTopic: string, picks: number, seed: number) {
  let { pool, progress, conceptProgress } = buildPriorCompletionState(targetTopic);
  const policy = getSelectionPolicy(Course.BACKEND);

  // Apply seeded RNG to the entire simulation so the stream is reproducible.
  return withSeededRandom(seed, () => {
    const targetPool = pool.filter(q => q.topic === targetTopic);
    const c0 = bucketCensus(targetTopic, pool, progress, conceptProgress);
    // Also count what the prior-topic pool looks like — that's the OTHER source
    // of competing picks; if all prior-topic cards are FRINGE/IDLE we expect
    // the user to mostly see current-topic cards.
    const priorCensus = { DUE: 0, FRINGE: 0, SPOT_CHECK: 0, IDLE: 0, UNTAGGED: 0 };
    for (const q of pool.filter(p => p.topic !== targetTopic)) {
      if (!q.concepts || q.concepts.length === 0) { priorCensus.UNTAGGED++; continue; }
      const last = progress.lastAttempt.get(q.id) ?? 0;
      const el = last > 0 ? (Date.now() - last) / MS_PER_DAY : 0;
      const b = bucketCard(q.concepts, conceptProgress, el, CONCEPT_BETAS, Date.now());
      priorCensus[b]++;
    }
    const lines: string[] = [];
    lines.push('');
    lines.push(`═══════════════════════════════════════════════════════════════════════════`);
    lines.push(` SIMULATION: topic="${targetTopic}"  picks=${picks}  seed=${seed}`);
    lines.push(`   target topic pool size = ${targetPool.length}`);
    lines.push(`   target topic bucket census: DUE=${c0.DUE}  FRINGE=${c0.FRINGE}  SPOT_CHECK=${c0.SPOT_CHECK}  IDLE=${c0.IDLE}  UNTAGGED=${c0.UNTAGGED}`);
    lines.push(`   prior topics bucket census: DUE=${priorCensus.DUE}  FRINGE=${priorCensus.FRINGE}  SPOT_CHECK=${priorCensus.SPOT_CHECK}  IDLE=${priorCensus.IDLE}  UNTAGGED=${priorCensus.UNTAGGED}`);
    lines.push(`───────────────────────────────────────────────────────────────────────────`);

    const typeSequence: string[] = [];
    const topicHistogram = new Map<string, number>();
    const targetTopicTypeSeq: string[] = [];

    for (let i = 0; i < picks; i++) {
      const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: CONCEPT_BETAS };
      const pick = SpacedRepetitionSystem.selectNextQuestion(pool, progress, ctx, policy);
      if (!pick) {
        lines.push(`  #${String(i + 1).padStart(2)}  (no question — pool exhausted under gating)`);
        break;
      }

      const bucket = labelBucket(pick, progress, conceptProgress);
      lines.push(
        `  #${String(i + 1).padStart(2)}  ${pick.topic.padEnd(20)}  ${pick.type.padEnd(16)}  ${pick.difficulty.padEnd(13)}  bucket=${bucket.padEnd(11)}  ${pick.id}`,
      );
      typeSequence.push(pick.type);
      topicHistogram.set(pick.topic, (topicHistogram.get(pick.topic) ?? 0) + 1);
      if (pick.topic === targetTopic) targetTopicTypeSeq.push(pick.type);

      // Simulate user answering correctly with a "good" response time.
      const now = Date.now();
      const attempt: QuestionAttempt = {
        questionId: pick.id,
        isCorrect: true,
        timestamp: now,
        attempts: 1,
        timeSpent: 8_000,
      };
      const newAttempted = new Set(progress.questionsAttempted);
      newAttempted.add(pick.id);
      const newCorrect = new Set(progress.correctAnswers);
      newCorrect.add(pick.id);
      progress = {
        ...progress,
        questionsAttempted: newAttempted,
        correctAnswers: newCorrect,
        attemptHistory: [...progress.attemptHistory, attempt],
        lastAttempt: new Map(progress.lastAttempt).set(pick.id, now),
      };
      if (pick.concepts && pick.concepts.length > 0) {
        const prevLast = progress.lastAttempt.get(pick.id) ?? 0;
        const elapsed = prevLast > 0 ? (now - prevLast) / MS_PER_DAY : 0;
        const grade = gradeFromResponseTime(pick.type, 8_000, true);
        const result = applyReview(
          pick.concepts,
          grade,
          0,
          elapsed,
          conceptProgress,
          CONCEPT_BETAS,
          now,
        );
        conceptProgress = { ...conceptProgress, ...result.conceptUpdates };
      }
    }

    lines.push(`───────────────────────────────────────────────────────────────────────────`);
    // Topic distribution across the stream
    const sortedTopics = Array.from(topicHistogram.entries()).sort((a, b) => b[1] - a[1]);
    lines.push(`  Topic distribution: ${sortedTopics.map(([t, n]) => `${t}=${n}`).join('  ')}`);
    lines.push(`  Within "${targetTopic}" picks (${targetTopicTypeSeq.length} of ${typeSequence.length}):`);
    lines.push(`    ${targetTopicTypeSeq.join(' → ') || '(none)'}`);

    // Count pairwise inversions vs the target ramp, but ONLY across same-topic picks
    // — that's the ordering the user is actually complaining about.
    const expected = ['multiple_choice', 'predict_output', 'parsons', 'cloze_code', 'coding'];
    const rank = (t: string) => expected.indexOf(t);
    let inversionsAll = 0;
    for (let i = 0; i < typeSequence.length; i++) {
      for (let j = i + 1; j < typeSequence.length; j++) {
        const a = rank(typeSequence[i]);
        const b = rank(typeSequence[j]);
        if (a >= 0 && b >= 0 && a > b) inversionsAll++;
      }
    }
    let inversionsInTarget = 0;
    for (let i = 0; i < targetTopicTypeSeq.length; i++) {
      for (let j = i + 1; j < targetTopicTypeSeq.length; j++) {
        const a = rank(targetTopicTypeSeq[i]);
        const b = rank(targetTopicTypeSeq[j]);
        if (a >= 0 && b >= 0 && a > b) inversionsInTarget++;
      }
    }
    lines.push(`  Type-order inversions vs MCQ→PREDICT→PARSONS→CLOZE→CODING:`);
    lines.push(`    across all picks:                    ${inversionsAll}`);
    lines.push(`    within "${targetTopic}" picks only:  ${inversionsInTarget}`);
    lines.push(`═══════════════════════════════════════════════════════════════════════════`);
    // eslint-disable-next-line no-console
    console.log(lines.join('\n'));
    return typeSequence;
  });
}

interface CollectedPick {
  type: string;
  difficulty: string;
  isNew: boolean;
}

/**
 * Pull the within-target-topic pick stream out so the regression assertion
 * can read it directly. `isNew` is recorded against the progress state AT
 * THE MOMENT of the pick (before we mark the card attempted) so the assertion
 * can isolate the legacy type-sort path from concept-aware review picks.
 */
function simulateAndCollect(targetTopic: string, picks: number, seed: number): {
  targetTopicPicks: CollectedPick[];
  totalPicks: number;
} {
  let { pool, progress, conceptProgress } = buildPriorCompletionState(targetTopic);
  const policy = getSelectionPolicy(Course.BACKEND);
  return withSeededRandom(seed, () => {
    const targetTopicPicks: CollectedPick[] = [];
    let totalPicks = 0;
    for (let i = 0; i < picks; i++) {
      const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: CONCEPT_BETAS };
      const pick = SpacedRepetitionSystem.selectNextQuestion(pool, progress, ctx, policy);
      if (!pick) break;
      totalPicks++;
      const isNew = !progress.questionsAttempted.has(pick.id);
      if (pick.topic === targetTopic) {
        targetTopicPicks.push({ type: pick.type, difficulty: pick.difficulty, isNew });
      }
      const now = Date.now();
      const attempt: QuestionAttempt = {
        questionId: pick.id, isCorrect: true, timestamp: now, attempts: 1, timeSpent: 8_000,
      };
      const newAttempted = new Set(progress.questionsAttempted); newAttempted.add(pick.id);
      const newCorrect = new Set(progress.correctAnswers); newCorrect.add(pick.id);
      progress = {
        ...progress,
        questionsAttempted: newAttempted,
        correctAnswers: newCorrect,
        attemptHistory: [...progress.attemptHistory, attempt],
        lastAttempt: new Map(progress.lastAttempt).set(pick.id, now),
      };
      if (pick.concepts && pick.concepts.length > 0) {
        const result = applyReview(
          pick.concepts,
          gradeFromResponseTime(pick.type, 8_000, true),
          0, 0, conceptProgress, CONCEPT_BETAS, now,
        );
        conceptProgress = { ...conceptProgress, ...result.conceptUpdates };
      }
    }
    return { targetTopicPicks, totalPicks };
  });
}

/**
 * Inversions are counted within each (difficulty) group, since difficulty
 * tiers legitimately reset the type ramp (CODING beginner → MCQ intermediate
 * is correct, not an inversion). Restricted to NEW picks so concept-aware
 * review picks that legitimately bypass the ramp (already-seen cards being
 * re-served) don't muddy the signal.
 */
function inversionsInNewPicksByDifficulty(picks: CollectedPick[]): number {
  const expected = ['multiple_choice', 'predict_output', 'parsons', 'cloze_code', 'coding'];
  const rank = (t: string) => expected.indexOf(t);
  const byDiff = new Map<string, string[]>();
  for (const p of picks) {
    if (!p.isNew) continue;
    const arr = byDiff.get(p.difficulty) ?? [];
    arr.push(p.type);
    byDiff.set(p.difficulty, arr);
  }
  let inv = 0;
  for (const types of Array.from(byDiff.values())) {
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const a = rank(types[i]); const b = rank(types[j]);
        if (a >= 0 && b >= 0 && a > b) inv++;
      }
    }
  }
  return inv;
}

describe('next-question stream simulator (printout)', () => {
  it('py_magic_methods stream (seed=1)', () => {
    const seq = simulate('py_magic_methods', 30, 1);
    expect(seq.length).toBeGreaterThan(0);
  });

  it('py_magic_methods stream (seed=2)', () => {
    const seq = simulate('py_magic_methods', 30, 2);
    expect(seq.length).toBeGreaterThan(0);
  });

  it('py_regex stream (seed=1)', () => {
    const seq = simulate('py_regex', 30, 1);
    expect(seq.length).toBeGreaterThan(0);
  });

  it('py_regex stream (seed=2)', () => {
    const seq = simulate('py_regex', 30, 2);
    expect(seq.length).toBeGreaterThan(0);
  });
});

/**
 * Regression guard: when the user enters a fresh topic, the within-topic
 * type sequence MUST be ramped MCQ → PREDICT → PARSONS → CLOZE → CODING
 * (zero inversions). This is the property the type-sort fix promises.
 * If concept-aware regresses and starts hijacking new-question ordering
 * again, this test breaks loudly.
 */
describe('type-sort regression guard — fresh topic in-order ramp', () => {
  const TARGETS = ['py_magic_methods', 'py_regex'] as const;
  const SEEDS = [1, 2, 3, 4, 5] as const;
  for (const target of TARGETS) {
    for (const seed of SEEDS) {
      it(`${target} seed=${seed}: NEW picks within each difficulty respect MCQ→PREDICT→PARSONS→CLOZE→CODING ramp`, () => {
        const { targetTopicPicks } = simulateAndCollect(target, 60, seed);
        const inv = inversionsInNewPicksByDifficulty(targetTopicPicks);
        if (inv !== 0) {
          const dbg = targetTopicPicks
            .filter(p => p.isNew)
            .map(p => `${p.difficulty[0]}:${p.type}`)
            .join(' → ');
          // eslint-disable-next-line no-console
          console.log(`FAIL ${target} seed=${seed}: ${dbg}  inversions=${inv}`);
        }
        expect(inv).toBe(0);
      });
    }
  }
});
