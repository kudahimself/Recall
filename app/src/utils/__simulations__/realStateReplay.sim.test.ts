/**
 * GROUND-TRUTH replay: runs the real selector against a real exported
 * localStorage state, instead of a synthetic learner the sim author invented.
 *
 * Why this exists: the sibling selectorDistribution sim models WHO struggles
 * with WHAT, so it can only reproduce the general shape of clumping — it cannot
 * tell you why one specific card keeps appearing for one specific person. This
 * one takes the actual progress + concept state and asks the selector directly.
 *
 * Export the state first. Easiest source is the browser console on the running
 * app (no scripts, no deps):
 *
 *   copy(JSON.stringify({
 *     progress:        JSON.parse(localStorage['recall-progress']),
 *     conceptProgress: JSON.parse(localStorage['recall-concept-progress'] || '{}'),
 *     cardDifficulty:  JSON.parse(localStorage['recall-card-difficulty']  || '{}'),
 *     activeCourse:    (localStorage['recall-active-course'] || '').replace(/"/g, ''),
 *   }))
 *
 * Paste into a .json file. (Reading Firefox's ls/data.sqlite directly also works
 * — snappy-compressed, utf-16le for conversion_type 0 — but the console is
 * simpler and does not require the browser to be closed.)
 *
 * Then point this at it and run:
 *   REAL_STATE=<path>.json CI=true npx react-scripts test \
 *     --testPathPattern=realStateReplay --watchAll=false
 *
 * Skips itself when REAL_STATE is unset, so it never breaks a normal test run
 * and never depends on a file outside the repo being present.
 */
import {
  SpacedRepetitionSystem,
  ConceptSelectionContext,
} from '../spacedRepetition';
import { bucketCard, getMasteryProbability, getRetrievability, ConceptProgress } from '../conceptSRS';
import { buildQuestionConceptIndex, rebackfillConceptProgress } from '../conceptMigration';
import {
  BACKEND_CONCEPTS,
  WEBDEV_CONCEPTS,
  DATABRICKS_CONCEPTS,
} from '../conceptRegistry';
import { getSelectionPolicy, getCourseForTopic, getTopicOrder } from '../courseConfig';
import { questions } from '../../data/questions';
import { Course, Question, UserProgress } from '../../types';
import { withSeededRandom } from './simHarness';
import * as fs from 'fs';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of [...BACKEND_CONCEPTS, ...WEBDEV_CONCEPTS, ...DATABRICKS_CONCEPTS]) {
    if (c.beta !== undefined) o[c.id] = c.beta;
  }
  return o;
})();

const STATE_PATH = process.env.REAL_STATE;
/** How many independent "what would it serve next" draws to take. */
const DRAWS = Number(process.env.REAL_DRAWS) || 400;
/** Card to spotlight in the report. */
const FOCUS = process.env.REAL_FOCUS || 'dbx-storage-repos-17';

interface Exported {
  progress: {
    questionsAttempted?: string[];
    correctAnswers?: string[];
    attemptHistory?: { questionId: string; isCorrect: boolean; timestamp: number }[];
    topicScores?: Record<string, unknown>;
    difficultyScores?: Record<string, unknown>;
    lastAttempt?: Record<string, number>;
    repetitionQueue?: Record<string, unknown>;
    masteredTopics?: string[];
  };
  conceptProgress: ConceptProgress;
  cardDifficulty: Record<string, number>;
  activeCourse: string;
}

/** Mirror of App.tsx's loadProgress deserialization (App.tsx:248-270). */
function hydrate(e: Exported, pool: Question[]): UserProgress {
  const ids = new Set(pool.map(q => q.id));
  const p = e.progress;
  return {
    questionsAttempted: new Set((p.questionsAttempted ?? []).filter(id => ids.has(id))),
    correctAnswers: new Set((p.correctAnswers ?? []).filter(id => ids.has(id))),
    attemptHistory: (p.attemptHistory ?? []).filter(a => ids.has(a.questionId)) as never,
    topicScores: new Map(Object.entries(p.topicScores ?? {})) as never,
    difficultyScores: new Map(Object.entries(p.difficultyScores ?? {})) as never,
    lastAttempt: new Map(Object.entries(p.lastAttempt ?? {})),
    repetitionQueue: new Map(Object.entries(p.repetitionQueue ?? {})) as never,
    masteredTopics: new Set(p.masteredTopics ?? []),
  };
}

const COURSE_BY_SLUG: Record<string, Course> = {
  webdev: Course.WEB_DEV,
  backend: Course.BACKEND,
  databricks: Course.DATABRICKS,
  data_engineering: Course.DATA_ENGINEERING,
  sql: Course.SQL,
};

const maybe = STATE_PATH && fs.existsSync(STATE_PATH) ? describe : describe.skip;

maybe('real-state replay', () => {
  it('shows what the selector would actually serve next', () => {
    const raw = JSON.parse(fs.readFileSync(STATE_PATH as string, 'utf8')) as Exported;

    const course = COURSE_BY_SLUG[raw.activeCourse] ?? Course.DATABRICKS;
    const topicOrder = new Set(getTopicOrder(course));
    const pool = questions.filter(q => topicOrder.has(q.topic));
    const policy = getSelectionPolicy(course);

    const progress = hydrate(raw, pool);
    // REAL_REBACKFILL=1 previews what a concept-TAG change will do to this
    // learner: it applies the same rebackfill App.tsx runs when
    // CONCEPT_MIGRATION_VERSION moves on, re-crediting their history against the
    // current tags. Without it the exported state is replayed verbatim, which
    // understates a retag (state stranded on retired ids reads as "no state").
    const conceptProgress: ConceptProgress = process.env.REAL_REBACKFILL === '1'
      ? rebackfillConceptProgress(
          raw.conceptProgress ?? {},
          progress.attemptHistory,
          buildQuestionConceptIndex(pool),
          CONCEPT_BETAS,
        )
      : (raw.conceptProgress ?? {});
    const cardDifficulty = raw.cardDifficulty ?? {};
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: CONCEPT_BETAS };

    const lines: string[] = [];
    const L = (s = '') => lines.push(s);

    L('');
    L('═'.repeat(94));
    L(` REAL-STATE REPLAY — course=${raw.activeCourse}  pool=${pool.length}`);
    L(`   attempts=${progress.attemptHistory.length}`
      + `  attempted=${progress.questionsAttempted.size}`
      + `  masteredTopics=${progress.masteredTopics.size}`
      + `  concepts=${Object.keys(conceptProgress).length}`);
    L('═'.repeat(94));

    // What mode is the app in right now, per the same helper the UI pill uses?
    const status = SpacedRepetitionSystem.getReviewStatus(pool, progress, policy, cardDifficulty);
    L(`  review mode = ${status.mode}   drainQueueCount = ${status.drainQueueCount}`);

    const unlocked = SpacedRepetitionSystem.getUnlockedTopics(pool, progress);
    const servable = unlocked ? pool.filter(q => unlocked.has(q.topic)) : pool;
    L(`  unlocked topics = ${unlocked ? unlocked.size : 'all'}   servable cards = ${servable.length}`);

    // ── the decisive measurement ───────────────────────────────────────────
    // The state is FROZEN. Each draw is an independent "if you pressed Next
    // right now, what would you get" under a different RNG seed. The resulting
    // histogram is the actual probability distribution of the next question.
    const counts = new Map<string, number>();
    for (let d = 0; d < DRAWS; d++) {
      const pick = withSeededRandom(1000 + d, () =>
        SpacedRepetitionSystem.selectNextQuestion(
          pool, progress, policy.useConceptSRS ? ctx : undefined, policy, cardDifficulty));
      if (pick) counts.set(pick.id, (counts.get(pick.id) ?? 0) + 1);
    }

    const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const byId = new Map(pool.map(q => [q.id, q]));

    L('');
    L(`  NEXT-QUESTION DISTRIBUTION over ${DRAWS} independent draws from the frozen state`);
    L(`  (${counts.size} distinct cards could come up)`);
    L('');
    L('    ' + 'card'.padEnd(34) + 'draws'.padStart(6) + '   share  bucket       type/difficulty');
    for (const [id, n] of ranked.slice(0, 15)) {
      const q = byId.get(id);
      const cs = q?.concepts ?? [];
      const last = progress.lastAttempt.get(id) ?? 0;
      const elapsed = last > 0 ? (Date.now() - last) / MS_PER_DAY : 0;
      const bucket = cs.length ? bucketCard(cs, conceptProgress, elapsed, CONCEPT_BETAS, Date.now()) : 'UNTAGGED';
      L('    ' + id.padEnd(34) + String(n).padStart(6)
        + (((n / DRAWS) * 100).toFixed(1) + '%').padStart(8) + '  '
        + bucket.padEnd(12) + `${q?.type}/${q?.difficulty}`);
    }

    // ── spotlight the reported card ────────────────────────────────────────
    const focus = byId.get(FOCUS);
    L('');
    L('─'.repeat(94));
    if (!focus) {
      L(`  FOCUS card ${FOCUS} is not in this course pool.`);
    } else {
      const n = counts.get(FOCUS) ?? 0;
      const rank = ranked.findIndex(([id]) => id === FOCUS) + 1;
      const cs = focus.concepts ?? [];
      const last = progress.lastAttempt.get(FOCUS) ?? 0;
      const elapsed = last > 0 ? (Date.now() - last) / MS_PER_DAY : 0;

      L(`  FOCUS: ${FOCUS}  (${focus.type}/${focus.difficulty}, topic=${focus.topic})`);
      L(`    served in ${n}/${DRAWS} draws (${((n / DRAWS) * 100).toFixed(1)}%)`
        + `   rank ${rank || '-'} of ${ranked.length}`);
      L(`    bucket = ${cs.length ? bucketCard(cs, conceptProgress, elapsed, CONCEPT_BETAS, Date.now()) : 'UNTAGGED'}`
        + `   daysSinceLastSeen = ${elapsed.toFixed(2)}`);
      for (const c of cs) {
        const st = conceptProgress[c];
        const siblings = pool.filter(q => (q.concepts ?? []).includes(c));
        L(`    concept ${c}:`);
        L(`      pool=${siblings.length} card(s)  ${siblings.length === 1 ? '<-- SINGLETON: no sibling can stand in' : ''}`);
        if (st) {
          L(`      successes=${st.successes} failures=${st.failures} stability=${st.stability.toFixed(2)}d`
            + `  mastery=${(getMasteryProbability([c], conceptProgress, CONCEPT_BETAS) ?? 0).toFixed(3)}`
            + `  R=${(getRetrievability([c], conceptProgress, elapsed) ?? 0).toFixed(3)}`);
        } else {
          L('      <no concept state>');
        }
      }
    }

    // ── how much of the distribution is orphan cards? ──────────────────────
    const conceptPool = new Map<string, number>();
    for (const q of pool) for (const c of q.concepts ?? []) {
      conceptPool.set(c, (conceptPool.get(c) ?? 0) + 1);
    }
    const isOrphan = (q?: Question) => {
      const cs = q?.concepts ?? [];
      return cs.length > 0 && cs.every(c => (conceptPool.get(c) ?? 0) === 1);
    };
    let orphanDraws = 0;
    counts.forEach((n, id) => { if (isOrphan(byId.get(id))) orphanDraws += n; });
    const orphanCards = servable.filter(isOrphan).length;

    L('');
    L(`  ORPHAN LOAD: cards whose every concept has pool=1`);
    L(`    ${orphanCards}/${servable.length} servable cards are orphans `
      + `(${((orphanCards / servable.length) * 100).toFixed(1)}%)`);
    L(`    but they take ${orphanDraws}/${DRAWS} of the draws `
      + `(${((orphanDraws / DRAWS) * 100).toFixed(1)}%)`);
    L(orphanCards === 0
      ? '    over-representation factor = n/a (no orphan cards)'
      : `    over-representation factor = `
        + `${((orphanDraws / DRAWS) / (orphanCards / servable.length)).toFixed(2)}x`);

    console.log(lines.join('\n'));
    expect(counts.size).toBeGreaterThan(0);
  });
});
