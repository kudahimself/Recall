/**
 * Reviews left today: one fixed list per session, one number that counts down.
 *
 * Regression for "the review count does not count down". The old pill showed
 * the drain queue (coding/advanced cards in mastered topics only) while the
 * session served yesterday's missed MCQ/parsons/predict/cloze cards and other
 * due cards first, so most correct answers left the number where it was; when
 * the drain emptied it switched to a per-topic due count that jumped. The
 * reproduction below is the real-app run's first 10 cards: four of yesterday's
 * misses, two due beginner cards and four due drain cards, with the fifth card
 * answered wrong. The old pill read "Review drain 4" for all of it.
 *
 * Run: npm test -- --testPathPattern=reviewSession --watchAll=false
 */
import { Course, Question, QuestionAttempt, UserProgress } from '../types';
import { questions } from '../data/questions';
import { getSelectionPolicy, getTopicOrder } from './courseConfig';
import {
  SpacedRepetitionSystem as SRS,
  MAX_REASKS_PER_SESSION,
  REASK_SPACING,
  REVIEWS_PER_DAY,
  WELL_KNOWN_STREAK,
} from './spacedRepetition';
import {
  ReviewSession,
  buildReviewList,
  isSessionCurrent,
  recordReviewAnswer,
  reviewsLeft,
  selectSessionQuestion,
  startReviewSession,
} from './reviewSession';

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 10, 4, 9);
const policy = getSelectionPolicy(Course.BACKEND);
const backendTopics = new Set(getTopicOrder(Course.BACKEND));
const pool = questions.filter(q => backendTopics.has(q.topic));
const byId = new Map(pool.map(q => [q.id, q]));

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

/** Record one answer the way App.handleAnswer does (the fields the selector reads). */
function answer(p: UserProgress, id: string, ts: number, isCorrect: boolean): UserProgress {
  const attempt: QuestionAttempt = {
    questionId: id, timestamp: ts, isCorrect, attempts: 1, timeSpent: 30_000,
    credit: isCorrect ? 1 : 0, hintTierUsed: 0,
  };
  const questionsAttempted = new Set(p.questionsAttempted).add(id);
  const correctAnswers = new Set(p.correctAnswers);
  if (isCorrect) correctAnswers.add(id);
  const lastAttempt = new Map(p.lastAttempt).set(id, ts);
  return { ...p, questionsAttempted, correctAnswers, attemptHistory: [...p.attemptHistory, attempt], lastAttempt };
}

// The reproduction's first 10 cards (evidence/real-app-repro.jsonl).
const MISSED_YESTERDAY = [
  'py-error-handling-parsons-8',
  'py-modules-predict-9',
  'py-error-handling-cloze-3',
  'py-file-io-predict-2', // answered wrong again in the reproduction
];
const DUE_NON_DRAIN = ['py-data-structures-cloze-3', 'py-basics-parsons-3'];
const DUE_DRAIN = ['py-functions-cloze-9', 'pe1-idioms-4', 'pcpp-pickle-2', 'pe1-m3-9'];
const REPRO_CARDS = [...MISSED_YESTERDAY, ...DUE_NON_DRAIN, ...DUE_DRAIN];
const NOT_DUE = 'py-basic-1';

function reproProgress(): UserProgress {
  let p = emptyProgress();
  // Every card first answered right four days ago: streak 1, a 3-day interval, so due now.
  for (const id of [...REPRO_CARDS]) p = answer(p, id, NOW - 4 * DAY, true);
  // Yesterday's misses: streak 0, a 1-day relearn interval that has passed.
  MISSED_YESTERDAY.forEach((id, i) => { p = answer(p, id, NOW - 1.2 * DAY + i * 60_000, false); });
  // Answered right yesterday: streak 1, not due for 3 days.
  p = answer(p, NOT_DUE, NOW - 1 * DAY, true);
  p.masteredTopics = new Set(REPRO_CARDS.map(id => byId.get(id)!.topic));
  return p;
}

describe('reviews left today: the 10-card reproduction', () => {
  let nowSpy: jest.SpyInstance;
  let clock = NOW;
  beforeEach(() => {
    clock = NOW;
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  });
  afterEach(() => nowSpy.mockRestore());

  it('the fixture reproduces the old pill: a drain of 4 over 10 owed cards', () => {
    for (const id of [...REPRO_CARDS, NOT_DUE]) expect(byId.has(id)).toBe(true);
    const status = SRS.getReviewStatus(pool, reproProgress(), policy);
    expect(status).toEqual({ mode: 'drain', drainQueueCount: 4 });
  });

  it('every answer moves the number by exactly -1, or by 0 shown as "+1 again", and the session ends at 0', () => {
    let progress = reproProgress();
    let session: ReviewSession = startReviewSession(pool, progress, {}, clock);
    expect(session.total).toBe(10);
    expect(new Set(session.queue.map(e => e.id))).toEqual(new Set(REPRO_CARDS));
    // Yesterday's misses come first, oldest miss first.
    expect(session.queue.slice(0, 4).map(e => e.id)).toEqual(MISSED_YESTERDAY);

    const served: string[] = [];
    const steps: string[] = [];
    let missedOnce = false;
    for (let i = 0; i < 30 && reviewsLeft(session) > 0; i++) {
      const before = reviewsLeft(session);
      const q = selectSessionQuestion(session, pool, progress, undefined, policy, {}) as Question;
      expect(q).not.toBeNull();
      // Served from the list: never a new card while reviews are left.
      expect(session.queue.some(e => e.id === q.id)).toBe(true);
      served.push(q.id);
      const ok = !(q.id === 'py-file-io-predict-2' && !missedOnce);
      if (!ok) missedOnce = true;
      clock += 60_000;
      progress = answer(progress, q.id, clock, ok);
      const result = recordReviewAnswer(session, q.id, ok);
      session = result.session;
      const after = reviewsLeft(session);
      steps.push(`${q.id} ${ok ? 'right' : 'wrong'} ${before} -> ${after}${result.requeued ? ' (+1 again)' : ''}`);
      // -1 for the answer, +1 when a miss is put back for a re-ask.
      expect(result.requeued && ok).toBe(false);
      expect(after).toBe(before - 1 + (result.requeued ? 1 : 0));
    }

    expect(reviewsLeft(session)).toBe(0);
    // 10 reviews plus the one re-ask, every one of them counted.
    expect(served).toHaveLength(11);
    expect(steps.filter(s => s.includes('+1 again'))).toHaveLength(1);
    // The miss comes back REASK_SPACING cards later, and is then answered right.
    const missAt = served.indexOf('py-file-io-predict-2');
    expect(served.lastIndexOf('py-file-io-predict-2')).toBe(missAt + REASK_SPACING);
    // The not-yet-due card was never part of today's list.
    expect(served).not.toContain(NOT_DUE);
  });

  it('once the list is empty the normal selector takes over and the count stays 0', () => {
    let progress = reproProgress();
    let session = startReviewSession(pool, progress, {}, clock);
    for (const e of [...session.queue]) {
      clock += 60_000;
      progress = answer(progress, e.id, clock, true);
      session = recordReviewAnswer(session, e.id, true).session;
    }
    expect(reviewsLeft(session)).toBe(0);
    const next = selectSessionQuestion(session, pool, progress, undefined, policy, {});
    expect(next).not.toBeNull();
    clock += 60_000;
    session = recordReviewAnswer(session, next!.id, true).session;
    expect(reviewsLeft(session)).toBe(0);
  });

  it('cards that fall due mid-session wait for the next session', () => {
    const progress = reproProgress();
    const session = startReviewSession(pool, progress, {}, clock);
    expect(session.queue.map(e => e.id)).not.toContain(NOT_DUE);
    // Two days later py-basic-1 is due, but the running session's list is fixed.
    clock = NOW + 2 * DAY;
    expect(buildReviewList(pool, progress, {}, clock)).toContain(NOT_DUE);
    expect(session.queue.map(e => e.id)).not.toContain(NOT_DUE);
    // A new day means a new session.
    expect(isSessionCurrent(session, clock)).toBe(false);
    expect(isSessionCurrent(session, NOW + 60_000)).toBe(true);
  });
});

describe('reviews left today: list membership and the re-ask rule', () => {
  function sessionOf(ids: string[]): ReviewSession {
    return { day: 'd', queue: ids.map(id => ({ id, again: false, notBefore: 0 })), answered: 0, reasks: 0, total: ids.length };
  }

  it('leaves out unseen cards, cards not yet due and resting well-known cards', () => {
    let p = emptyProgress();
    const [due, notDue, wellKnown] = ['py-basic-1', 'py-basics-parsons-3', 'pe1-idioms-4'];
    p = answer(p, due, NOW - 2 * DAY, false); // missed two days ago: relearn owed
    p = answer(p, notDue, NOW - DAY, true); // streak 1: due in 3 days
    for (let k = 0; k < WELL_KNOWN_STREAK; k++) p = answer(p, wellKnown, NOW - (40 - k) * DAY, true);
    p = { ...p, lastAttempt: new Map(p.lastAttempt).set(wellKnown, NOW - 2 * DAY) };
    expect(buildReviewList(pool, p, {}, NOW)).toEqual([due]);
  });

  it('caps the list at REVIEWS_PER_DAY', () => {
    let p = emptyProgress();
    const ids = pool.slice(0, REVIEWS_PER_DAY + 15).map(q => q.id);
    for (const id of ids) p = answer(p, id, NOW - 5 * DAY, true);
    expect(buildReviewList(pool, p, {}, NOW)).toHaveLength(REVIEWS_PER_DAY);
  });

  it('a card answered outside the list leaves the count unchanged', () => {
    const r = recordReviewAnswer(sessionOf(['a', 'b']), 'x', true);
    expect(reviewsLeft(r.session)).toBe(2);
    expect(r.session.answered).toBe(1);
  });

  it('re-asks a miss once, and at most MAX_REASKS_PER_SESSION times per session', () => {
    const ids = ['m1', 'm2', 'm3', 'm4', 'm5', 'f1', 'f2', 'f3', 'f4', 'f5'];
    let s = sessionOf(ids);
    const requeued: string[] = [];
    for (const id of ['m1', 'm2', 'm3', 'm4', 'm5']) {
      const r = recordReviewAnswer(s, id, false);
      if (r.requeued) requeued.push(id);
      s = r.session;
    }
    expect(requeued).toEqual(['m1', 'm2', 'm3'].slice(0, MAX_REASKS_PER_SESSION));
    expect(reviewsLeft(s)).toBe(ids.length - 5 + MAX_REASKS_PER_SESSION);
    // A missed re-ask is not re-asked again.
    const again = recordReviewAnswer({ ...s, reasks: 0 }, 'm1', false);
    expect(again.requeued).toBe(false);
    expect(reviewsLeft(again.session)).toBe(reviewsLeft(s) - 1);
  });

  it('a re-ask waits REASK_SPACING answers even when nothing else is left in the list', () => {
    let s = sessionOf(['only']);
    const r = recordReviewAnswer(s, 'only', false);
    s = r.session;
    expect(r.requeued).toBe(true);
    expect(reviewsLeft(s)).toBe(1);
    expect(s.queue[0].notBefore).toBe(s.answered + REASK_SPACING - 1);
  });
});
