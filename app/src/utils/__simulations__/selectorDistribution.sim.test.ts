/**
 * Selector DISTRIBUTION harness.
 *
 * The sibling nextQuestionStream sim shows WHICH cards get picked in what order,
 * but it never answers them, so it cannot show what a real study session looks
 * like over hundreds of picks. This one closes the loop: it emulates a learner
 * answering each served card, feeds the result back through exactly the same
 * bookkeeping App.tsx does, and then reports how evenly the selector spread its
 * picks across the pool.
 *
 * What it is for: catching "hot streaks" — a small set of cards eating a large
 * share of the session while the rest of the pool goes unseen. The original
 * report was a missed card returning on a rigid every-4th-pick beat, which both
 * buried the learner in one question and cut the distinct cards they saw.
 *
 * Run:
 *   CI=true npx react-scripts test --testPathPattern=selectorDistribution --watchAll=false
 *
 * The `realistic` model carries loose threshold assertions (the regression
 * guard). The `struggler` model is deliberately pathological and is report-only.
 */
import {
  SpacedRepetitionSystem,
  ConceptSelectionContext,
} from '../spacedRepetition';
import {
  applyReview,
  fsrsInitDifficulty,
  fsrsNextDifficulty,
  gradeFromResponseTime,
  ConceptProgress,
  RESPONSE_TIME_ENVELOPE_MS,
} from '../conceptSRS';
import {
  buildQuestionConceptIndex,
  migrateAttemptHistoryToConceptProgress,
} from '../conceptMigration';
import {
  BACKEND_CONCEPTS,
  WEBDEV_CONCEPTS,
  DATABRICKS_CONCEPTS,
} from '../conceptRegistry';
import { seedMasteredTopics } from '../masteryMigration';
import { getSelectionPolicy, getTopicOrder } from '../courseConfig';
import { questions } from '../../data/questions';
import {
  Course,
  Difficulty,
  Question,
  QuestionAttempt,
  QuestionType,
  UserProgress,
} from '../../types';
import { seededRandom, withSeededRandom } from './simHarness';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Every concept beta in the registry, keyed by id — betas feed PFA bucketing. */
const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of [...BACKEND_CONCEPTS, ...WEBDEV_CONCEPTS, ...DATABRICKS_CONCEPTS]) {
    if (c.beta !== undefined) o[c.id] = c.beta;
  }
  return o;
})();

// ───────────────────────────── learner models ─────────────────────────────

type LearnerModelName = 'alwaysCorrect' | 'realistic' | 'struggler';

/** Fraction of the pool the `struggler` model can essentially never answer. */
const STRUGGLE_CARD_FRACTION = 0.05;
const STRUGGLE_P_CORRECT = 0.15;

/** Baseline p(correct) on FIRST exposure, by difficulty. */
const BASE_P_CORRECT: Record<string, number> = {
  [Difficulty.BEGINNER]: 0.72,
  [Difficulty.INTERMEDIATE]: 0.55,
  [Difficulty.ADVANCED]: 0.38,
};

/** Cold-write and reorder types are harder than recognition at equal difficulty. */
const TYPE_P_PENALTY: Record<string, number> = {
  [QuestionType.MULTIPLE_CHOICE]: 0,
  [QuestionType.PREDICT_OUTPUT]: -0.05,
  [QuestionType.PARSONS]: -0.10,
  [QuestionType.CLOZE_CODE]: -0.12,
  [QuestionType.CODING]: -0.20,
};

/** Each prior exposure lifts p(correct) — the learning curve. */
const EXPOSURE_GAIN = 0.18;

interface Learner {
  /** Decide the outcome for a served card. */
  answer(q: Question, exposures: number): { isCorrect: boolean; timeSpent: number };
}

function makeLearner(
  model: LearnerModelName,
  pool: Question[],
  rand: () => number,
): Learner {
  // Pick the struggle set up front from a dedicated stream so it does not shift
  // as the main simulation consumes randomness.
  const struggleIds = new Set<string>();
  if (model === 'struggler') {
    const pick = seededRandom(0xC0FFEE);
    for (const q of pool) {
      if (pick() < STRUGGLE_CARD_FRACTION) struggleIds.add(q.id);
    }
  }

  return {
    answer(q, exposures) {
      const env = RESPONSE_TIME_ENVELOPE_MS[q.type] ?? RESPONSE_TIME_ENVELOPE_MS.multiple_choice;

      if (model === 'alwaysCorrect') {
        return { isCorrect: true, timeSpent: env.easy };
      }

      const p = struggleIds.has(q.id)
        ? STRUGGLE_P_CORRECT
        : Math.min(0.97,
            (BASE_P_CORRECT[q.difficulty] ?? 0.5)
            + (TYPE_P_PENALTY[q.type] ?? 0)
            + exposures * EXPOSURE_GAIN);

      const isCorrect = rand() < p;
      // Struggling takes longer: land past the `hard` edge on a miss, inside the
      // envelope on a shaky pass, under `easy` when confident.
      const timeSpent = !isCorrect ? env.hard + 1
        : p > 0.85 ? env.easy - 1
        : (env.easy + env.hard) / 2;
      return { isCorrect, timeSpent };
    },
  };
}

// ─────────────────────────── simulation state ───────────────────────────

/** Fresh-start progress: nothing attempted, nothing mastered. */
function freshProgress(): UserProgress {
  return {
    questionsAttempted: new Set(),
    correctAnswers: new Set(),
    topicScores: new Map(),
    difficultyScores: new Map(),
    attemptHistory: [],
    lastAttempt: new Map(),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

/**
 * Caught-up progress: every card in the pool answered correctly once, staggered
 * over the last 12 hours. This is the state the reported hot streak occurs in —
 * no new content left, so every pick comes from the review path.
 */
function caughtUpProgress(pool: Question[]): UserProgress {
  const now = Date.now();
  const attemptHistory: QuestionAttempt[] = pool.map((q, i) => ({
    questionId: q.id,
    isCorrect: true,
    timestamp: now - 12 * 3600_000 + (i * 12 * 3600_000) / pool.length,
    attempts: 1,
    timeSpent: 8_000,
  }));
  const lastAttempt = new Map<string, number>();
  for (const a of attemptHistory) lastAttempt.set(a.questionId, a.timestamp!);

  return {
    questionsAttempted: new Set(pool.map(q => q.id)),
    correctAnswers: new Set(pool.map(q => q.id)),
    topicScores: new Map(),
    difficultyScores: new Map(),
    attemptHistory,
    lastAttempt,
    repetitionQueue: new Map(),
    masteredTopics: seedMasteredTopics(pool, attemptHistory),
  };
}

interface RunResult {
  picks: string[];
  /** id -> serve count */
  counts: Map<string, number>;
  poolSize: number;
  /** Cards reachable under section/topic gating at the END of the run. */
  unlockedSize: number;
  byId: Map<string, Question>;
  /** Coverage (distinct served) sampled after each pick. */
  coverageCurve: number[];
}

/**
 * Run `nPicks` of select-then-answer. Mirrors App.tsx's post-answer bookkeeping
 * (App.tsx:658-742) so the sim cannot drift from production behaviour:
 * attemptHistory / lastAttempt / questionsAttempted / correctAnswers,
 * updateMasteredTopics, per-card FSRS difficulty, and concept progress.
 */
function run(
  course: Course,
  model: LearnerModelName,
  nPicks: number,
  seed: number,
  startCaughtUp: boolean,
): RunResult {
  const topicOrder = new Set(getTopicOrder(course));
  const pool = questions.filter(q => topicOrder.has(q.topic));
  const policy = getSelectionPolicy(course);
  const byId = new Map(pool.map(q => [q.id, q]));

  let progress = startCaughtUp ? caughtUpProgress(pool) : freshProgress();
  let conceptProgress: ConceptProgress = migrateAttemptHistoryToConceptProgress(
    progress.attemptHistory,
    buildQuestionConceptIndex(pool),
  );
  const cardDifficulty: Record<string, number> = {};

  const picks: string[] = [];
  const counts = new Map<string, number>();
  const exposures = new Map<string, number>();
  const coverageCurve: number[] = [];

  // One RNG for the learner, separate from the selector's Math.random stream, so
  // changing selector tuning does not also change the answer sequence.
  const learnerRand = seededRandom(seed ^ 0x5EED);
  const learner = makeLearner(model, pool, learnerRand);

  withSeededRandom(seed, () => {
    // Clock advances 3 minutes per answer so spacing intervals actually elapse
    // over a long run instead of every card looking freshly reviewed.
    let clock = Date.now();

    for (let i = 0; i < nPicks; i++) {
      const ctx: ConceptSelectionContext = {
        progress: conceptProgress,
        betas: CONCEPT_BETAS,
      };
      const pick = SpacedRepetitionSystem.selectNextQuestion(
        pool,
        progress,
        policy.useConceptSRS ? ctx : undefined,
        policy,
        cardDifficulty,
      );
      if (!pick) break;

      picks.push(pick.id);
      counts.set(pick.id, (counts.get(pick.id) ?? 0) + 1);
      coverageCurve.push(counts.size);

      const seen = exposures.get(pick.id) ?? 0;
      const { isCorrect, timeSpent } = learner.answer(pick, seen);
      exposures.set(pick.id, seen + 1);

      clock += 3 * 60_000;

      // --- mirror of App.tsx recordAnswer ---
      const attemptHistory = [...progress.attemptHistory, {
        questionId: pick.id,
        timestamp: clock,
        isCorrect,
        attempts: 1,
        timeSpent,
      }];
      const lastAttemptMap = new Map(progress.lastAttempt);
      const prevLastAttempt = progress.lastAttempt.get(pick.id) ?? 0;
      lastAttemptMap.set(pick.id, clock);

      const questionsAttempted = new Set(progress.questionsAttempted);
      questionsAttempted.add(pick.id);
      const correctAnswers = new Set(progress.correctAnswers);
      if (isCorrect) correctAnswers.add(pick.id);
      else correctAnswers.delete(pick.id);

      progress = {
        ...progress,
        attemptHistory,
        lastAttempt: lastAttemptMap,
        questionsAttempted,
        correctAnswers,
        masteredTopics: SpacedRepetitionSystem.updateMasteredTopics(
          { ...progress, attemptHistory },
          pick.topic,
          pool,
        ),
      };

      // Per-card FSRS difficulty for every answered card, concept-tagged or not.
      const grade = gradeFromResponseTime(pick.type, timeSpent, isCorrect);
      const prevD = cardDifficulty[pick.id] ?? 0;

      if (policy.useConceptSRS && pick.concepts && pick.concepts.length > 0) {
        const elapsedDays = prevLastAttempt > 0 ? (clock - prevLastAttempt) / MS_PER_DAY : 0;
        const result = applyReview(
          pick.concepts, grade, prevD, elapsedDays, conceptProgress, CONCEPT_BETAS, clock,
        );
        conceptProgress = { ...conceptProgress, ...result.conceptUpdates };
      }
      cardDifficulty[pick.id] = prevD <= 0
        ? fsrsInitDifficulty(grade)
        : fsrsNextDifficulty(prevD, grade);
    }
  });

  const unlocked = SpacedRepetitionSystem.getUnlockedTopics(pool, progress);
  const unlockedSize = unlocked
    ? pool.filter(q => unlocked.has(q.topic)).length
    : pool.length;

  return { picks, counts, poolSize: pool.length, unlockedSize, byId, coverageCurve };
}

// ───────────────────────────────── metrics ─────────────────────────────────

/** Gini coefficient over serve counts across the unlocked pool (0 = perfectly even). */
function gini(counts: number[]): number {
  if (counts.length === 0) return 0;
  const s = [...counts].sort((a, b) => a - b);
  const total = s.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let cum = 0;
  for (let i = 0; i < s.length; i++) cum += (i + 1) * s[i];
  return (2 * cum) / (s.length * total) - (s.length + 1) / s.length;
}

/** Largest number of times any single card is served inside a `w`-pick window. */
function maxBurst(picks: string[], w: number): { n: number; id: string } {
  let best = { n: 0, id: '-' };
  const win = new Map<string, number>();
  for (let i = 0; i < picks.length; i++) {
    win.set(picks[i], (win.get(picks[i]) ?? 0) + 1);
    if (i >= w) {
      const out = picks[i - w];
      const v = (win.get(out) ?? 0) - 1;
      if (v <= 0) win.delete(out); else win.set(out, v);
    }
    const cur = win.get(picks[i])!;
    if (cur > best.n) best = { n: cur, id: picks[i] };
  }
  return best;
}

/** Serve positions per card, so we can look at the gaps between repeats. */
function positions(picks: string[]): Map<string, number[]> {
  const m = new Map<string, number[]>();
  picks.forEach((id, i) => {
    const arr = m.get(id) ?? [];
    arr.push(i);
    m.set(id, arr);
  });
  return m;
}

function mode(xs: number[]): number {
  const freq = new Map<number, number>();
  for (const x of xs) freq.set(x, (freq.get(x) ?? 0) + 1);
  let best = 0, bestN = 0;
  freq.forEach((n, x) => { if (n > bestN) { bestN = n; best = x; } });
  return best;
}

/**
 * Hot-streak signature: a card served many times whose repeat gaps cluster on
 * one small value. That is the fingerprint of a card pinned by a fixed cooldown
 * plus a dominant priority boost, rather than genuinely spaced review.
 */
interface HotStreak {
  id: string; serves: number; gapMode: number; modeShare: number;
  topic: string; type: string; difficulty: string;
}
function hotStreaks(r: RunResult, minServes = 5, maxGapMode = 5): HotStreak[] {
  const out: HotStreak[] = [];
  positions(r.picks).forEach((pos, id) => {
    if (pos.length < minServes) return;
    const gaps = pos.slice(1).map((v, i) => v - pos[i]);
    const m = mode(gaps);
    if (m > maxGapMode) return;
    const q = r.byId.get(id);
    out.push({
      id, serves: pos.length, gapMode: m,
      modeShare: gaps.filter(g => g === m).length / gaps.length,
      topic: q?.topic ?? '?', type: q?.type ?? '?', difficulty: q?.difficulty ?? '?',
    });
  });
  return out.sort((a, b) => b.serves - a.serves);
}

interface Summary {
  picks: number; unlockedSize: number; distinct: number;
  coveragePct: number; neverServed: number;
  /** Share of picks that were re-serves of an already-seen card. Scale-free:
   *  unlike coveragePct it stays meaningful when picks << pool size. */
  repeatRatePct: number;
  /** Best achievable distinct-card count given the pick budget. */
  reachable: number;
  top1Pct: number; top5Pct: number; top10Pct: number;
  gini: number; burst20: number; burst20Id: string;
  hot: HotStreak[];
}

function summarize(r: RunResult): Summary {
  const n = r.picks.length;
  const sorted = Array.from(r.counts.values()).sort((a, b) => b - a);
  const share = (k: number) => n === 0 ? 0
    : (sorted.slice(0, k).reduce((a, b) => a + b, 0) / n) * 100;

  // Gini over the whole unlocked pool, including never-served cards (zeros) —
  // otherwise a run that ignores half the pool looks perfectly even.
  const withZeros = [
    ...sorted,
    ...new Array(Math.max(0, r.unlockedSize - r.counts.size)).fill(0),
  ];
  const b = maxBurst(r.picks, 20);

  const reachable = Math.min(n, r.unlockedSize);

  return {
    picks: n,
    unlockedSize: r.unlockedSize,
    distinct: r.counts.size,
    coveragePct: r.unlockedSize === 0 ? 0 : (r.counts.size / r.unlockedSize) * 100,
    neverServed: Math.max(0, r.unlockedSize - r.counts.size),
    repeatRatePct: n === 0 ? 0 : (1 - r.counts.size / n) * 100,
    reachable,
    top1Pct: share(1), top5Pct: share(5), top10Pct: share(10),
    gini: gini(withZeros),
    burst20: b.n, burst20Id: b.id,
    hot: hotStreaks(r),
  };
}

// ───────────────────────────────── report ─────────────────────────────────

// selectNextQuestion is O(pool x attemptHistory) per call (calculatePriority
// re-filters the full history for every card in the review pool), so the matrix
// size drives wall time hard: the wide report matrix is ~14 MINUTES, which is
// far too slow to sit in /verify. So the two halves are split —
//   default          : regression bands only. One seed, 150 picks, 5 courses
//                      (~750 selector calls, well under a minute). The
//                      pinned-loop signature shows up within ~80 picks, so this
//                      is enough to catch the regression it guards.
//   SIM_REPORT=1     : also print the full per-course distribution tables.
//   SIM_FULL=1       : report + widest matrix (3 seeds, 500 picks, 4 scenarios).
// Knobs: SIM_PICKS / SIM_COURSE narrow it for a quick probe
// (e.g. SIM_COURSE=databricks SIM_PICKS=100).
const FULL = process.env.SIM_FULL === '1';
const REPORT = FULL || process.env.SIM_REPORT === '1';
const SEEDS = FULL ? [1, 7, 42] : REPORT ? [1, 7] : [1];
const N_PICKS = Number(process.env.SIM_PICKS) || (FULL ? 500 : REPORT ? 250 : 150);
const COURSE_FILTER = (process.env.SIM_COURSE || '').toLowerCase();

const ALL_COURSES: [string, Course][] = [
  ['Web Dev', Course.WEB_DEV],
  ['Backend', Course.BACKEND],
  ['Databricks', Course.DATABRICKS],
  ['Data Engineering', Course.DATA_ENGINEERING],
  ['SQL', Course.SQL],
];
const COURSES = COURSE_FILTER
  ? ALL_COURSES.filter(([n]) => n.toLowerCase().includes(COURSE_FILTER))
  : ALL_COURSES;

function fmtRow(label: string, s: Summary): string {
  return '  ' + label.padEnd(22)
    + String(s.picks).padStart(5)
    + (s.distinct + '/' + s.reachable).padStart(10)
    + s.repeatRatePct.toFixed(0).padStart(8)
    + s.top1Pct.toFixed(1).padStart(8)
    + s.top5Pct.toFixed(1).padStart(7)
    + s.top10Pct.toFixed(1).padStart(7)
    + s.gini.toFixed(3).padStart(8)
    + String(s.burst20).padStart(7)
    + String(s.hot.length).padStart(6);
}

const HEADER = '  ' + 'scenario'.padEnd(22)
  + 'picks'.padStart(5)
  + 'distinct/max'.padStart(10)
  + 'repeat%'.padStart(8)
  + 'top1%'.padStart(8) + 'top5%'.padStart(7) + 'top10%'.padStart(7)
  + 'gini'.padStart(8) + 'burst'.padStart(7) + 'hot'.padStart(6);

/** Cache runs so the report pass and the assertion pass do not re-simulate. */
const cache = new Map<string, Summary>();
function summaryFor(
  course: Course, model: LearnerModelName, seed: number, caughtUp: boolean,
): Summary {
  const key = `${course}|${model}|${seed}|${caughtUp}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const s = summarize(run(course, model, N_PICKS, seed, caughtUp));
  cache.set(key, s);
  return s;
}

describe('selector distribution', () => {
  // The wide report is opt-in (SIM_REPORT=1 / SIM_FULL=1) because it simulates
  // several thousand picks per course. The regression bands below run by default.
  (REPORT ? it : it.skip)('reports coverage and repetition per course', () => {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(100));
    lines.push(` SELECTOR DISTRIBUTION — ${N_PICKS} picks, seeds ${SEEDS.join('/')}`);
    lines.push('  burst = max serves of one card in any 20-pick window');
    lines.push('  hot   = cards served >=5x whose repeat-gap mode is <=5 (pinned-loop signature)');
    lines.push('═'.repeat(100));

    for (const [name, course] of COURSES) {
      lines.push('');
      lines.push(`── ${name} ${'─'.repeat(Math.max(0, 90 - name.length))}`);
      lines.push(HEADER);

      // alwaysCorrect is the coverage upper bound; it adds little to the
      // hot-streak question, so it only runs in the full matrix.
      const scenarios: [string, LearnerModelName, boolean][] = FULL
        ? [
            ['fresh/alwaysCorrect', 'alwaysCorrect', false],
            ['fresh/realistic', 'realistic', false],
            ['caughtUp/realistic', 'realistic', true],
            ['caughtUp/struggler', 'struggler', true],
          ]
        : [
            ['fresh/realistic', 'realistic', false],
            ['caughtUp/realistic', 'realistic', true],
            ['caughtUp/struggler', 'struggler', true],
          ];

      for (const [label, model, caughtUp] of scenarios) {
        for (const seed of SEEDS) {
          const s = summaryFor(course, model, seed, caughtUp);
          lines.push(fmtRow(`${label} s${seed}`, s));
        }
      }

      // Worst offenders across seeds for the two review-heavy scenarios.
      const worst: HotStreak[] = [];
      for (const model of ['realistic', 'struggler'] as LearnerModelName[]) {
        for (const seed of SEEDS) worst.push(...summaryFor(course, model, seed, true).hot);
      }
      if (worst.length > 0) {
        const seen = new Set<string>();
        const top = worst.sort((a, b) => b.serves - a.serves)
          .filter(h => !seen.has(h.id) && seen.add(h.id))
          .slice(0, 6);
        lines.push('    pinned-loop offenders (caughtUp):');
        for (const h of top) {
          lines.push(`      ${h.id.padEnd(30)} served ${String(h.serves).padStart(3)}x`
            + `  gapMode=${h.gapMode} (${(h.modeShare * 100).toFixed(0)}% of gaps)`
            + `  ${h.type}/${h.difficulty}  ${h.topic}`);
        }
      }
    }
    console.log(lines.join('\n'));
    expect(true).toBe(true);
  });

  // ── regression guard ──
  // Loose bands under the `realistic` model. Each prints the actual value so a
  // failure is diagnosable rather than a bare boolean. `struggler` is excluded:
  // it is deliberately pathological and exists to expose the shape, not to pass.
  //
  // ON by default. Bands sit just above what all five courses actually measure
  // after the bucket-share and pool-scaled-cooldown fixes, so they trip on a
  // real regression rather than on noise. SIM_ASSERT=0 disables them (e.g. while
  // deliberately exploring a tuning change).
  const guard = process.env.SIM_ASSERT === '0' ? describe.skip : describe;
  guard('regression bands (realistic learner, caught-up)', () => {
    const MAX_SINGLE_CARD_PCT = 8;   // measured max on this scenario: 2.8
    const MAX_BURST_IN_20 = 4;       // measured max: 3
    const MIN_COVERAGE_PCT = 60;
    // The pinned-loop signature — a card served >=5x whose repeat gaps cluster
    // on one small value — is what a fixed cooldown plus a dominant priority
    // boost produces. It measured 11-25 cards per course before the fix and 0
    // after, so any reappearance is a genuine regression, not drift.
    const MAX_PINNED_CARDS = 0;

    for (const [name, course] of COURSES) {
      it(`${name}: no card dominates, coverage keeps climbing`, () => {
        for (const seed of SEEDS) {
          const s = summaryFor(course, 'realistic', seed, true);
          const ctx = `${name} seed=${seed}`;

          if (s.top1Pct > MAX_SINGLE_CARD_PCT) {
            throw new Error(
              `${ctx}: single card took ${s.top1Pct.toFixed(1)}% of ${s.picks} picks `
              + `(limit ${MAX_SINGLE_CARD_PCT}%). Worst burst: ${s.burst20Id} `
              + `${s.burst20}x in 20 picks. Pinned-loop cards: ${s.hot.length}.`);
          }
          if (s.burst20 > MAX_BURST_IN_20) {
            throw new Error(
              `${ctx}: ${s.burst20Id} served ${s.burst20}x within a 20-pick window `
              + `(limit ${MAX_BURST_IN_20}).`);
          }
          if (s.hot.length > MAX_PINNED_CARDS) {
            const worst = s.hot.slice(0, 3)
              .map(h => `${h.id} (${h.serves}x, gapMode=${h.gapMode})`).join('; ');
            throw new Error(
              `${ctx}: ${s.hot.length} card(s) fell into a pinned repeat loop `
              + `(limit ${MAX_PINNED_CARDS}). Worst: ${worst}.`);
          }
          // Only meaningful when the pick budget could actually cover the pool;
          // below that, distinct/reachable (repeat rate) is the honest measure.
          if (s.picks >= s.unlockedSize && s.coveragePct < MIN_COVERAGE_PCT) {
            throw new Error(
              `${ctx}: only ${s.coveragePct.toFixed(0)}% of the ${s.unlockedSize}-card `
              + `unlocked pool was served in ${s.picks} picks `
              + `(floor ${MIN_COVERAGE_PCT}%). ${s.neverServed} cards never appeared.`);
          }
        }
        expect(SEEDS.length).toBeGreaterThan(0);
      });
    }
  });
});
