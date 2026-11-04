/**
 * Today's session: one bounded session per day, with one review list whose
 * number counts down, then new ramp cards and drills, then an end.
 *
 * Keeps Stage 0's regression for "the review count does not count down": the
 * fixture is the real-app reproduction's first 10 cards (four of yesterday's
 * misses, two due beginner cards and four due drain cards), now scheduled by
 * card family. Every answer to a list card moves the number by exactly -1, or
 * by 0 shown as "+1 again" for a first miss.
 *
 * Run: npm test -- --testPathPattern=reviewSession --watchAll=false
 */
import { Course, Question, QuestionAttempt, UserProgress } from '../types';
import { questions } from '../data/questions';
import { getTopicOrder } from './courseConfig';
import {
  familyOf,
  topicRamp,
  MAX_REASKS_PER_SESSION,
  NEW_PER_DRILL,
  REASK_SPACING,
  todayReviewCap,
  WELL_KNOWN_STREAK,
  SpacedRepetitionSystem as SRS,
} from './spacedRepetition';
import { FsrsStore, recordAttempt, replayHistory } from './familySchedule';
import {
  ReviewSession,
  buildReviewList,
  continueSession,
  isSessionCurrent,
  isSessionDone,
  parseStoredSessions,
  recordReviewAnswer,
  reviewsLeft,
  selectSessionQuestion,
  serializeSessions,
  startReviewSession,
} from './reviewSession';

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 10, 4, 9);
const backendTopics = new Set(getTopicOrder(Course.BACKEND));
const pool = questions.filter(q => backendTopics.has(q.topic));
const byId = new Map(questions.map(q => [q.id, q]));

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

/** Record one answer the way App.handleAnswer does: progress and the family schedule. */
function answer(state: { p: UserProgress; store: FsrsStore }, id: string, ts: number, isCorrect: boolean): void {
  const attempt: QuestionAttempt = {
    questionId: id, timestamp: ts, isCorrect, attempts: 1, timeSpent: 30_000,
    credit: isCorrect ? 1 : 0, hintTierUsed: 0,
  };
  const p = state.p;
  const questionsAttempted = new Set(p.questionsAttempted).add(id);
  const correctAnswers = new Set(p.correctAnswers);
  if (isCorrect) correctAnswers.add(id);
  const lastAttempt = new Map(p.lastAttempt).set(id, ts);
  const attemptHistory = [...p.attemptHistory, attempt];
  state.p = { ...p, questionsAttempted, correctAnswers, attemptHistory, lastAttempt };
  state.store = recordAttempt(state.store, byId.get(id)!, attempt, attemptHistory);
}

// The reproduction's first 10 cards (evidence/real-app-repro.jsonl).
const MISSED_YESTERDAY = [
  'py-error-handling-parsons-8',
  'py-modules-predict-9',
  'py-error-handling-cloze-3',
  'py-file-io-predict-2',
];
const DUE = ['py-data-structures-cloze-3', 'py-basics-parsons-3', 'py-functions-cloze-9', 'pe1-idioms-4', 'pcpp-pickle-2', 'pe1-m3-9'];
const REPRO_CARDS = [...MISSED_YESTERDAY, ...DUE];

function reproState(): { p: UserProgress; store: FsrsStore } {
  const state = { p: emptyProgress(), store: replayHistory([], byId) };
  // Every card first answered right a month ago, so its family is due by now.
  REPRO_CARDS.forEach((id, i) => answer(state, id, NOW - 30 * DAY + i * 60_000, true));
  // Yesterday's misses: their families are due again today.
  MISSED_YESTERDAY.forEach((id, i) => answer(state, id, NOW - 1.2 * DAY + i * 60_000, false));
  state.p.masteredTopics = new Set(REPRO_CARDS.map(id => byId.get(id)!.topic));
  return state;
}

describe('the review list', () => {
  let nowSpy: jest.SpyInstance;
  let clock = NOW;
  beforeEach(() => {
    clock = NOW;
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  });
  afterEach(() => nowSpy.mockRestore());

  it('holds one card per due family, and a missed family serves the card it missed', () => {
    const { p, store } = reproState();
    const session = startReviewSession(pool, p, store, {}, clock);
    const families = new Set(REPRO_CARDS.map(id => familyOf(byId.get(id)!)));
    expect(session.total).toBe(families.size);
    expect(new Set(session.queue.map(e => e.family))).toEqual(families);
    const soleMisses = MISSED_YESTERDAY.filter(id =>
      MISSED_YESTERDAY.filter(m => familyOf(byId.get(m)!) === familyOf(byId.get(id)!)).length === 1);
    expect(soleMisses.length).toBeGreaterThan(0);
    expect(soleMisses.map(id => session.queue.find(e => e.family === familyOf(byId.get(id)!))!.id)).toEqual(soleMisses);
  });

  it('serves relearn families first, then drain cards of mastered topics, then the rest', () => {
    const { p, store } = reproState();
    const session = startReviewSession(pool, p, store, {}, clock);
    const relearn = new Set(MISSED_YESTERDAY.map(id => familyOf(byId.get(id)!)));
    const rank = (id: string, family: string) => relearn.has(family) ? 0 : SRS.isDrainCard(byId.get(id)!) ? 1 : 2;
    const ranks = session.queue.map(e => rank(e.id, e.family));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(ranks).toContain(0);
    expect(ranks).toContain(1);
    expect(ranks).toContain(2);
  });

  it('every answer moves the number by exactly -1, or by 0 shown as "+1 again", and the list ends at 0', () => {
    const state = reproState();
    let session: ReviewSession = startReviewSession(pool, state.p, state.store, {}, clock);
    const steps: string[] = [];
    let missedOnce = false;
    for (let i = 0; i < 30 && reviewsLeft(session) > 0; i++) {
      const before = reviewsLeft(session);
      const pick = selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock)!;
      expect(pick.kind).toBe('review');
      const ok = missedOnce || i !== 4;
      if (!ok) missedOnce = true;
      clock += 60_000;
      answer(state, pick.question.id, clock, ok);
      const r = recordReviewAnswer(session, pick.question.id, ok, pick.kind, familyOf(pick.question));
      session = r.session;
      const delta = reviewsLeft(session) - before;
      steps.push(r.requeued ? '+1 again' : String(delta));
      expect(delta).toBe(r.requeued ? 0 : -1);
    }
    expect(reviewsLeft(session)).toBe(0);
    expect(steps.filter(s => s === '+1 again')).toHaveLength(1);
  });

  it('is capped at the review share of the session, and the rest waits as overflow', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    const seen = new Set<string>();
    for (const q of pool) {
      const f = familyOf(q);
      if (seen.has(f)) continue;
      seen.add(f);
      answer(state, q.id, NOW - 20 * DAY + seen.size * 1000, true);
      if (seen.size === 40) break;
    }
    const cap = todayReviewCap(20, 0.6);
    const session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 20, reviewShare: 0.6 });
    expect(cap).toBe(12);
    expect(session.total).toBe(cap);
    expect(session.overflow).toBe(40 - cap);
    expect(session.freshLeft).toBe(20 - cap);
    // A bigger share in settings takes more of them.
    expect(startReviewSession(pool, state.p, state.store, {}, clock, { size: 30, reviewShare: 0.8 }).total).toBe(24);
  });

  it('under filters serves a due family left out by the cap before showing nothing', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    const firsts: Question[] = [];
    for (const q of pool) {
      if (firsts.some(f => familyOf(f) === familyOf(q))) continue;
      firsts.push(q);
      answer(state, q.id, NOW - 20 * DAY + firsts.length * 1000, true);
      if (firsts.length === 40) break;
    }
    const session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 20, reviewShare: 0.6 });
    const left = firsts.find(q => !session.queue.some(e => e.family === familyOf(q)))!;
    expect(left).toBeDefined();
    const filtered = pool.filter(q => familyOf(q) === familyOf(left) && state.p.questionsAttempted.has(q.id));
    const pick = selectSessionQuestion(session, filtered, pool, state.p, state.store, {}, undefined, clock);
    expect(pick?.question.id).toBe(left.id);
  });

  it('under filters to another type, never reviews a family still in the list a second time', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    const byFamily = new Map<string, Question[]>();
    for (const q of pool) byFamily.set(familyOf(q), [...(byFamily.get(familyOf(q)) ?? []), q]);
    const members = Array.from(byFamily.values()).find(m => new Set(m.map(q => q.type)).size > 1)!;
    const pair = [members[0], members.find(q => q.type !== members[0].type)!];
    pair.forEach((q, i) => answer(state, q.id, NOW - 20 * DAY + i * 1000, true));
    const session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 20, reviewShare: 0.6 });
    const listed = session.queue.find(e => e.family === familyOf(pair[0]))!;
    expect(listed).toBeDefined();
    const other = pair.find(q => q.id !== listed.id)!;
    const filtered = pool.filter(q => q.type === other.type && familyOf(q) === listed.family && state.p.questionsAttempted.has(q.id));
    expect(filtered.map(q => q.id)).toEqual([other.id]);
    expect(selectSessionQuestion(session, filtered, pool, state.p, state.store, {}, undefined, clock)).toBeNull();
  });

  it('never lists a resting well-known card', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    const card = pool[0];
    // A long correct streak, last answered a few days ago: the card rests for months,
    // while its family's FSRS state is pushed due by a recent miss on a sibling.
    for (let k = WELL_KNOWN_STREAK + 1; k >= 1; k--) answer(state, card.id, NOW - (k * 10 + 3) * DAY, true);
    expect(SRS.restingWellKnown(pool, state.p).has(card.id)).toBe(true);
    const list = buildReviewList(pool, state.p, state.store, {}, NOW + 400 * DAY, 60);
    expect(list.entries.map(e => e.id)).not.toContain(card.id);
  });
});

describe('the bounded session', () => {
  let nowSpy: jest.SpyInstance;
  let clock = NOW;
  beforeEach(() => {
    clock = NOW;
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  });
  afterEach(() => nowSpy.mockRestore());

  it('serves new ramp cards with a drill after every NEW_PER_DRILL, ends at its size, and keeps going on request', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    let session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 12, reviewShare: 0.6 });
    expect(session.total).toBe(0);
    const kinds: string[] = [];
    for (let i = 0; i < 40; i++) {
      const pick = selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock);
      if (!pick) break;
      kinds.push(pick.kind);
      clock += 60_000;
      answer(state, pick.question.id, clock, true);
      session = recordReviewAnswer(session, pick.question.id, true, pick.kind).session;
    }
    expect(kinds).toHaveLength(12);
    expect(isSessionDone(session)).toBe(true);
    expect(kinds[0]).toBe('new');
    expect(kinds[NEW_PER_DRILL]).toBe('drill');
    expect(new Set(session.served).size).toBe(12);
    const more = selectSessionQuestion(continueSession(session), pool, pool, state.p, state.store, {}, undefined, clock);
    expect(more).not.toBeNull();
    expect(session.served).not.toContain(more!.question.id);
  });

  it('a missed new card comes back once, REASK_SPACING cards later, at most MAX_REASKS_PER_SESSION times', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    let session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 10, reviewShare: 0.6 });
    const order: { id: string; again: boolean }[] = [];
    for (let i = 0; i < 30; i++) {
      const pick = selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock);
      if (!pick) break;
      const again = session.queue.some(e => e.id === pick.question.id && e.again);
      order.push({ id: pick.question.id, again });
      const ok = again || i % 2 === 1;
      clock += 60_000;
      answer(state, pick.question.id, clock, ok);
      session = recordReviewAnswer(session, pick.question.id, ok, pick.kind).session;
    }
    expect(session.reasks).toBe(MAX_REASKS_PER_SESSION);
    expect(order.filter(o => o.again)).toHaveLength(MAX_REASKS_PER_SESSION);
    const firstMiss = order[0].id;
    const backAt = order.findIndex(o => o.again && o.id === firstMiss);
    expect(backAt).toBeGreaterThanOrEqual(REASK_SPACING);
    expect(order).toHaveLength(10 + MAX_REASKS_PER_SESSION);
  });

  it('a new day gets a new session', () => {
    const { p, store } = reproState();
    const session = startReviewSession(pool, p, store, {}, NOW);
    expect(isSessionCurrent(session, NOW + 60_000)).toBe(true);
    expect(isSessionCurrent(session, NOW + DAY)).toBe(false);
  });

  it('under filters the plan serves inside them, and practice past it comes from the same families, never the older selector', () => {
    const legacy = jest.spyOn(SRS, 'selectNextQuestion');
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    let session = startReviewSession(pool, state.p, state.store, {}, clock);
    const topics = Array.from(new Set(pool.map(q => q.topic))).reverse();
    let topic = '';
    let extra: Question | undefined;
    for (const t of topics) {
      const tq = pool.filter(q => q.topic === t);
      const ramp = topicRamp(tq);
      const inRamp = new Set(ramp.map(q => q.id));
      extra = tq.find(q => !inRamp.has(q.id) && q.difficulty === ramp[0]?.difficulty && familyOf(q) !== familyOf(ramp[0]));
      if (extra) { topic = t; break; }
    }
    expect(extra).toBeDefined();
    const filtered: Question[] = pool.filter(q => q.topic === topic);
    const pick = selectSessionQuestion(session, filtered, pool, state.p, state.store, {}, undefined, clock)!;
    expect(pick.kind).toBe('new');
    expect(pick.question.topic).toBe(topic);
    clock += 60_000;
    answer(state, pick.question.id, clock, true);
    session = recordReviewAnswer(session, pick.question.id, true, pick.kind).session;
    const only = [pick.question, extra!];
    expect(selectSessionQuestion(session, only, pool, state.p, state.store, {}, undefined, clock))
      .toEqual({ question: extra, kind: 'practice' });
    expect(selectSessionQuestion(session, [pick.question], pool, state.p, state.store, {}, undefined, clock)).toBeNull();
    expect(legacy).not.toHaveBeenCalled();
    legacy.mockRestore();
  });
});

describe('a reload the same day', () => {
  let nowSpy: jest.SpyInstance;
  let clock = NOW;
  beforeEach(() => {
    clock = NOW;
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  });
  afterEach(() => nowSpy.mockRestore());

  const reload = (session: ReviewSession, at: number): ReviewSession | undefined =>
    parseStoredSessions(serializeSessions({ [Course.BACKEND]: session }), at)[Course.BACKEND];

  it('resumes the session mid-way, with its count, slots and served cards, and a new day drops it', () => {
    const state = reproState();
    let session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 12, reviewShare: 0.6 });
    for (let i = 0; i < 4; i++) {
      const pick = selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock)!;
      clock += 60_000;
      answer(state, pick.question.id, clock, i !== 1);
      session = recordReviewAnswer(session, pick.question.id, i !== 1, pick.kind, familyOf(pick.question)).session;
    }
    const resumed = reload(session, clock + 60_000);
    expect(resumed).toEqual(session);
    expect(reviewsLeft(resumed)).toBe(reviewsLeft(session));
    expect(selectSessionQuestion(resumed!, pool, pool, state.p, state.store, {}, undefined, clock))
      .toEqual(selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock));
    expect(reload(session, NOW + DAY)).toBeUndefined();
  });

  it('after "Done for today" stays done, and "Keep going" still serves more', () => {
    const state = { p: emptyProgress(), store: replayHistory([], byId) };
    let session = startReviewSession(pool, state.p, state.store, {}, clock, { size: 6, reviewShare: 0.6 });
    for (let i = 0; i < 20; i++) {
      const pick = selectSessionQuestion(session, pool, pool, state.p, state.store, {}, undefined, clock);
      if (!pick) break;
      clock += 60_000;
      answer(state, pick.question.id, clock, true);
      session = recordReviewAnswer(session, pick.question.id, true, pick.kind).session;
    }
    expect(isSessionDone(session)).toBe(true);
    const resumed = reload(session, clock + 60_000)!;
    expect(isSessionDone(resumed)).toBe(true);
    expect(selectSessionQuestion(resumed, pool, pool, state.p, state.store, {}, undefined, clock)).toBeNull();
    expect(selectSessionQuestion(continueSession(resumed), pool, pool, state.p, state.store, {}, undefined, clock)).not.toBeNull();
  });

  it('drops unreadable or malformed stored sessions', () => {
    const session = startReviewSession(pool, emptyProgress(), replayHistory([], byId), {}, NOW);
    expect(parseStoredSessions('{not json', NOW)).toEqual({});
    expect(parseStoredSessions(JSON.stringify({ [Course.BACKEND]: { ...session, queue: 'x' } }), NOW)).toEqual({});
    expect(parseStoredSessions(JSON.stringify({ nope: session }), NOW)).toEqual({});
  });
});
