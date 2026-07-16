/**
 * Regressions for STORED sticky mastery (progress.masteredTopics) and the
 * reworked drain membership - born from a real starvation bug: dj_orm (fully
 * covered, 88% latest-correct after a rough session) silently left the drain
 * queue and got zero exposure for days while other topics drained.
 *
 * The invariants under test:
 *   1. Mastery is GRANTED at the crossing (updateMasteredTopics) and STICKY -
 *      once a topic is in the set, later misses never remove it (no topic
 *      demotion, no section re-lock).
 *   2. Drain membership is one rule: mastered topic AND drain card AND
 *      (latest-wrong OR interval-due). A failed drain card stays in the queue
 *      regardless of how many other questions were answered since.
 *   3. The pill (getReviewStatus) counts over the same unlock-filtered pool
 *      the selector serves from, so it can never show an undrainable count.
 *   4. The one-time seed (seedMasteredTopics) reproduces the mastery a history
 *      replay would have granted, so existing users unlock nothing less.
 *
 * Run: npm test -- --testPathPattern=stickyMastery --watchAll=false
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
import { isMastered, SpacedRepetitionSystem } from './spacedRepetition';
import { seedMasteredTopics } from './masteryMigration';

const backendPolicy = getSelectionPolicy(Course.BACKEND);
const DAY = 86_400_000;
const HOUR = 3_600_000;

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

function makeQ(
  id: string,
  topic: Topic,
  difficulty: Difficulty,
  type: QuestionType = QuestionType.MULTIPLE_CHOICE,
): Question {
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

function makeAttempt(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return { questionId: qid, isCorrect, timestamp: Date.now() - msAgo, attempts: 1, timeSpent: 5_000 };
}

/**
 * Mirror of App.handleAnswer: append the attempt, then run the real mastery
 * grant against the pool so a test crosses (or doesn't cross) the bar exactly
 * the way production does. `pool` is the question that maps qid -> topic.
 */
function answer(
  progress: UserProgress,
  q: Question,
  isCorrect: boolean,
  msAgo: number,
  pool: Question[],
) {
  progress.questionsAttempted.add(q.id);
  if (isCorrect) progress.correctAnswers.add(q.id);
  progress.attemptHistory.push(makeAttempt(q.id, isCorrect, msAgo));
  progress.lastAttempt.set(q.id, Date.now() - msAgo);
  progress.masteredTopics = SpacedRepetitionSystem.updateMasteredTopics(progress, q.topic, pool);
}

/** Record an attempt WITHOUT granting - for tests that seed mastery explicitly. */
function recordAttempt(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push(makeAttempt(qid, isCorrect, msAgo));
  progress.lastAttempt.set(qid, Date.now() - msAgo);
}

function toTopicMap(pool: Question[]): Map<string, Question[]> {
  const m = new Map<string, Question[]>();
  for (const q of pool) {
    const arr = m.get(q.topic) ?? [];
    arr.push(q);
    m.set(q.topic, arr);
  }
  return m;
}

// ─────────────────────────────────────────────────────────────────────────
describe('updateMasteredTopics - grant at the crossing, then sticky', () => {
  test('a topic that meets the bar is granted, and a later bad session cannot demote it', () => {
    const s1 = makeQ('s1', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const s2 = makeQ('s2', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const s3 = makeQ('s3', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const pool = [s1, s2, s3];
    const p = emptyProgress();
    answer(p, s1, true, 10 * DAY, pool);
    answer(p, s2, true, 10 * DAY, pool);
    answer(p, s3, true, 10 * DAY, pool); // 3/3 covered, 100% → granted
    expect(p.masteredTopics.has(Topic.PY_LOGGING)).toBe(true);
    expect(SpacedRepetitionSystem.isTopicMastered(p, pool)).toBe(true);

    // Bad session: 2 of 3 latest-wrong → 33% latest-correct. Sticky: still in.
    answer(p, s1, false, 2 * HOUR, pool);
    answer(p, s2, false, 1 * HOUR, pool);
    expect(SpacedRepetitionSystem.isTopicMastered(p, pool)).toBe(true);
  });

  test('a topic that never meets the bar is not granted, even at full coverage', () => {
    const n1 = makeQ('n1', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const n2 = makeQ('n2', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const pool = [n1, n2];
    const p = emptyProgress();
    answer(p, n1, true, 5 * DAY, pool);
    answer(p, n2, false, 5 * DAY, pool); // covered at 50% - bar never met
    expect(p.masteredTopics.has(Topic.PY_LOGGING)).toBe(false);
    expect(SpacedRepetitionSystem.isTopicMastered(p, pool)).toBe(false);
  });

  test('the unlock predicate is sticky too - a granted topic can never re-lock', () => {
    const u1 = makeQ('u1', Topic.PY_BASICS, Difficulty.BEGINNER);
    const u2 = makeQ('u2', Topic.PY_BASICS, Difficulty.BEGINNER);
    const pool = [u1, u2];
    const p = emptyProgress();
    answer(p, u1, true, 5 * DAY, pool);
    answer(p, u2, true, 5 * DAY, pool); // granted → unlocks the next unit/section
    expect(isMastered([Topic.PY_BASICS], pool, p)).toBe(true);

    // Resurfaced reviews go badly: latest-correct drops to 0%. The grant holds.
    answer(p, u1, false, 2 * HOUR, pool);
    answer(p, u2, false, 1 * HOUR, pool);
    expect(isMastered([Topic.PY_BASICS], pool, p)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('drain membership: mastered AND drain card AND (latest-wrong OR due)', () => {
  test('an OLD failed drain card stays in the queue until answered correctly', () => {
    const adv = makeQ('old-fail', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const other = makeQ('other', Topic.PY_REGEX, Difficulty.BEGINNER);
    const pool = [adv, other];
    const p = emptyProgress();
    p.masteredTopics.add(Topic.PY_LOGGING); // topic mastered (seeded)
    recordAttempt(p, 'old-fail', true, 10 * DAY);
    recordAttempt(p, 'other', true, 10 * DAY);
    recordAttempt(p, 'old-fail', false, 2 * DAY); // the failure...
    recordAttempt(p, 'other', true, 1 * HOUR);    // ...is NOT the latest attempt

    // Old semantics dropped it here (only the literal last attempt counted).
    const count = SpacedRepetitionSystem.countPendingDrain(pool, toTopicMap(pool), p);
    expect(count).toBe(1);

    // Answered correctly (just now → not yet interval-due) → leaves the queue.
    recordAttempt(p, 'old-fail', true, 0);
    expect(SpacedRepetitionSystem.countPendingDrain(pool, toTopicMap(pool), p)).toBe(0);
  });

  test('sticky mastery keeps a struggling topic\'s whole backlog in the drain (the dj_orm bug)', () => {
    // Mirror of the real state: topic mastered, then a rough patch leaves
    // several cards latest-wrong and one card interval-due.
    const c1 = makeQ('c1', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const c2 = makeQ('c2', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const c3 = makeQ('c3', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const pool = [c1, c2, c3];
    const p = emptyProgress();
    p.masteredTopics.add(Topic.PY_LOGGING);
    recordAttempt(p, 'c1', true, 20 * DAY);
    recordAttempt(p, 'c2', true, 20 * DAY);
    recordAttempt(p, 'c3', true, 20 * DAY);
    recordAttempt(p, 'c1', false, 3 * DAY); // latest-wrong
    recordAttempt(p, 'c2', false, 2 * DAY); // latest-wrong
    // c3: correct 20 days ago, streak 1 → interval 3d → due.

    // All three are in the queue: two latest-wrong + one due.
    expect(SpacedRepetitionSystem.countPendingDrain(pool, toTopicMap(pool), p)).toBe(3);
  });

  test('the selector actually SERVES a latest-wrong drain card during a drain', () => {
    localStorage.setItem('recall-dev-unlock-all', '1');
    try {
      const fail = makeQ('serve-fail', Topic.PY_LOGGING, Difficulty.ADVANCED);
      const calm = makeQ('serve-calm', Topic.PY_REGEX, Difficulty.ADVANCED);
      const unseen = makeQ('serve-new', Topic.PY_REGEX, Difficulty.BEGINNER);
      const p = emptyProgress();
      p.masteredTopics.add(Topic.PY_LOGGING);
      p.masteredTopics.add(Topic.PY_REGEX);
      recordAttempt(p, 'serve-fail', true, 10 * DAY); // mastered
      recordAttempt(p, 'serve-calm', true, 1 * HOUR); // mastered, not due
      recordAttempt(p, 'serve-fail', false, 5 * HOUR); // failed, not interval-due yet
      recordAttempt(p, 'serve-calm', true, 30 * 60_000); // latest attempt overall: correct

      // Gate closed (one queued card) and the queued card is served even
      // though it is not yet interval-due - latest-wrong is enough.
      for (let i = 0; i < 20; i++) {
        const pick = SpacedRepetitionSystem.selectNextQuestion([fail, calm, unseen], p, undefined, backendPolicy);
        expect(pick?.id).toBe('serve-fail');
      }
    } finally {
      localStorage.removeItem('recall-dev-unlock-all');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('getReviewStatus counts over the unlock-filtered pool', () => {
  test('a due drain card in a LOCKED section does not inflate the pill', () => {
    // py_basics (first unit, first section) is untouched → only it is unlocked.
    // py_logging (Python Advanced) has a due mastered drain card from stale
    // history - the selector cannot serve it, so the pill must not count it.
    const basicsNew = makeQ('b-new', Topic.PY_BASICS, Difficulty.BEGINNER);
    const lockedAdv = makeQ('locked-adv', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const p = emptyProgress();
    p.masteredTopics.add(Topic.PY_LOGGING); // mastered... but its section is locked
    recordAttempt(p, 'locked-adv', true, 10 * DAY); // due

    const s = SpacedRepetitionSystem.getReviewStatus([basicsNew, lockedAdv], p, backendPolicy);
    expect(s.drainQueueCount).toBe(0);
    expect(s.mode).toBe('new');
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('seedMasteredTopics - one-time migration from history', () => {
  test('a topic that once met the bar seeds as mastered; a never-mastered one does not', () => {
    const met1 = makeQ('m1', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const met2 = makeQ('m2', Topic.PY_LOGGING, Difficulty.ADVANCED);
    const miss1 = makeQ('x1', Topic.PY_REGEX, Difficulty.ADVANCED);
    const miss2 = makeQ('x2', Topic.PY_REGEX, Difficulty.ADVANCED);
    const pool = [met1, met2, miss1, miss2];
    const history: QuestionAttempt[] = [
      makeAttempt('m1', true, 10 * DAY),
      makeAttempt('m2', true, 10 * DAY), // PY_LOGGING covered @100% → seeds
      makeAttempt('x1', true, 10 * DAY),
      makeAttempt('x2', false, 10 * DAY), // PY_REGEX covered @50% → never met
    ];
    const seeded = seedMasteredTopics(pool, history);
    expect(seeded.has(Topic.PY_LOGGING)).toBe(true);
    expect(seeded.has(Topic.PY_REGEX)).toBe(false);
  });
});
