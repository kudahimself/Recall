/**
 * Today's session: one bounded session per course per day, with an end.
 *
 * When the session starts it fixes the review list: due card families
 * (familySchedule.dueFamilies, most overdue first), each mapped to the one card
 * it will serve (pickFamilyCard), capped at the session's review share
 * (todayReviewCap: 12 of 20 by default). The rest of the session is fresh
 * slots: new cards from the current topic's ramp, with a drill of a family
 * already met after every NEW_PER_DRILL new cards. Families due beyond the cap
 * stay due; they lead tomorrow's list and are served by "Keep going".
 *
 * Serving order: the review list first (selectSessionQuestion), then fresh
 * slots. The pill shows the list's length (reviewsLeft), so the number drops
 * by exactly one per answered review. A miss anywhere in the session is asked
 * again once, REASK_SPACING cards later, at most MAX_REASKS_PER_SESSION times
 * per session; the re-ask joins the list ("+1 again"). The session is done
 * (isSessionDone) when the list is empty and every fresh slot is used; the App
 * then shows the summary. "Keep going" (continueSession) lifts the bound: due
 * families left over, then fresh slots, for as long as the learner wants.
 *
 * The session lives in memory: a reload or a new day builds it again from
 * progress and the family schedule. Nothing here writes stored data.
 */
import { Question, UserProgress } from '../types';
import {
  SpacedRepetitionSystem as SRS,
  ConceptSelectionContext,
  familyOf,
  isRampDifficultyOpen,
  topicRamp,
  todayReviewCap,
  MAX_REASKS_PER_SESSION,
  NEW_PER_DRILL,
  RAMP_DIFFICULTY_ORDER,
  rampRank,
  REASK_SPACING,
  TODAY_REVIEW_SHARE,
  TODAY_SESSION_SIZE,
} from './spacedRepetition';
import { getCourseForTopic, getTopicOrder, SelectionPolicy } from './courseConfig';
import {
  CardPickContext,
  dueFamilies,
  familyIndex,
  familyRetrievability,
  FsrsStore,
  isFamilyDue,
  pickFamilyCard,
  State,
} from './familySchedule';

export type ServedKind = 'review' | 'new' | 'drill' | 'practice';

export interface ReviewEntry {
  id: string;
  family: string;
  /** True for a re-ask of a card missed earlier in this session. */
  again: boolean;
  /** Not served before the session has had this many answers (re-ask spacing). */
  notBefore: number;
}

export interface SessionSettings {
  size: number;
  reviewShare: number;
}

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  size: TODAY_SESSION_SIZE,
  reviewShare: TODAY_REVIEW_SHARE,
};

export interface SessionTally {
  review: number;
  new: number;
  drill: number;
  practice: number;
  /** Re-asks of cards missed earlier in the session. */
  again: number;
  correct: number;
}

export interface ReviewSession {
  /** Local calendar day the session was built on (localDayKey). */
  day: string;
  /** Session size it was built with. */
  size: number;
  /** Reviews still owed this session, in serving order. */
  queue: ReviewEntry[];
  /** List size when the session started. */
  total: number;
  /** Due families left out by the cap when the session started. */
  overflow: number;
  /** New and drill slots left in the bounded session. */
  freshLeft: number;
  /** Answers given in this session. */
  answered: number;
  /** Re-asks added so far (capped at MAX_REASKS_PER_SESSION). */
  reasks: number;
  /** Cards answered this session: a card is served once a day, re-asks aside. */
  served: string[];
  /** Past the bounded session ("Keep going"). */
  keepGoing: boolean;
  tally: SessionTally;
}

/** Local calendar day, so a session left open overnight starts fresh the next day. */
export function localDayKey(now: number = Date.now()): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

interface Pools {
  /** The course's whole pool: unlocks and the review list are built from it. */
  course: Question[];
  /** What may be served now (the course pool, or narrower under filters). */
  serve: Question[];
}

function pickContext(pool: Question[], progress: UserProgress, cardDifficulty: Record<string, number>, served: Iterable<string>): CardPickContext {
  const byTopic = new Map<string, Question[]>();
  for (const q of pool) {
    const arr = byTopic.get(q.topic) ?? [];
    arr.push(q);
    byTopic.set(q.topic, arr);
  }
  return {
    progress,
    latest: SRS.latestCorrectness(progress),
    resting: SRS.restingWellKnown(pool, progress, cardDifficulty),
    served: new Set(served),
    unlocked: SRS.getUnlockedTopics(pool, progress),
    byTopic,
  };
}

/**
 * Today's review list: due families in unlocked topics, most overdue first,
 * each with the card it serves, capped at `limit`. `due` is how many due
 * families have a card to serve at all (the list plus the overflow).
 */
export function buildReviewList(
  pool: Question[],
  progress: UserProgress,
  store: FsrsStore,
  cardDifficulty: Record<string, number> = {},
  now: number = Date.now(),
  limit: number = todayReviewCap(),
  served: Iterable<string> = [],
): { entries: ReviewEntry[]; due: number } {
  const ctx = pickContext(pool, progress, cardDifficulty, served);
  const index = familyIndex(pool);
  const entries: ReviewEntry[] = [];
  let due = 0;
  for (const f of dueFamilies(store, now)) {
    const members = index.get(f);
    if (!members) continue;
    const card = pickFamilyCard(members, store.families[f], ctx);
    if (!card) continue;
    due++;
    if (entries.length < limit) {
      entries.push({ id: card.id, family: f, again: false, notBefore: 0 });
      ctx.served.add(card.id);
    }
  }
  return { entries, due };
}

export function startReviewSession(
  pool: Question[],
  progress: UserProgress,
  store: FsrsStore,
  cardDifficulty: Record<string, number> = {},
  now: number = Date.now(),
  settings: SessionSettings = DEFAULT_SESSION_SETTINGS,
): ReviewSession {
  const cap = todayReviewCap(settings.size, settings.reviewShare);
  const { entries, due } = buildReviewList(pool, progress, store, cardDifficulty, now, cap);
  return {
    day: localDayKey(now),
    size: settings.size,
    queue: entries,
    total: entries.length,
    overflow: due - entries.length,
    freshLeft: Math.max(0, settings.size - entries.length),
    answered: 0,
    reasks: 0,
    served: [],
    keepGoing: false,
    tally: { review: 0, new: 0, drill: 0, practice: 0, again: 0, correct: 0 },
  };
}

/** True while the session belongs to today; otherwise a new one is started. */
export function isSessionCurrent(session: ReviewSession | undefined, now: number = Date.now()): session is ReviewSession {
  return session !== undefined && session.day === localDayKey(now);
}

/** The number on the pill and on Home. */
export function reviewsLeft(session: ReviewSession | undefined): number {
  return session ? session.queue.length : 0;
}

export function isInReviewList(session: ReviewSession | undefined, questionId: string): boolean {
  return !!session && session.queue.some(e => e.id === questionId);
}

/** The bounded session is over: no review left and every fresh slot used. */
export function isSessionDone(session: ReviewSession | undefined): boolean {
  return !!session && !session.keepGoing && session.queue.length === 0 && session.freshLeft <= 0;
}

/** "Keep going": lift the bound for the rest of the day. */
export function continueSession(session: ReviewSession): ReviewSession {
  return { ...session, keepGoing: true };
}

/** The next list card to serve from `pool`; `ignoreSpacing` also takes a re-ask still spacing out. */
export function nextReviewCard(session: ReviewSession, pool: Question[], ignoreSpacing = false): Question | null {
  if (session.queue.length === 0) return null;
  const byId = new Map(pool.map(q => [q.id, q]));
  for (const e of session.queue) {
    if (!ignoreSpacing && e.notBefore > session.answered) continue;
    const q = byId.get(e.id);
    if (q) return q;
  }
  return null;
}

/**
 * The next new card: the first unanswered ramp card of the earliest unlocked
 * topic whose ramp is unfinished, once the ramp's difficulty gate has opened.
 * When there is none, `focus` names the topic holding progress back: a ramp
 * held by its difficulty gate, or a finished ramp still below the unlock bar
 * (not yet in masteredTopics). The session's drills then go to it
 * (nextConsolidationCard), so the accuracy that opens the way can rise.
 */
export function nextNewCard(pools: Pools, ctx: CardPickContext): { card: Question | null; focus: string | null } {
  if (pools.course.length === 0) return { card: null, focus: null };
  const servable = new Set(pools.serve.map(q => q.id));
  const order = getTopicOrder(getCourseForTopic(pools.course[0].topic));
  let belowBar: string | null = null;
  for (const topic of order) {
    if (ctx.unlocked && !ctx.unlocked.has(topic)) continue;
    const tq = ctx.byTopic.get(topic);
    if (!tq) continue;
    const open = topicRamp(tq).filter(q => !ctx.latest.has(q.id) && !ctx.served.has(q.id) && servable.has(q.id));
    if (open.length === 0) {
      if (!belowBar && !ctx.progress.masteredTopics.has(topic)) belowBar = topic;
      continue;
    }
    const pick = open.find(q => isRampDifficultyOpen(tq, ctx.latest, q.difficulty));
    return pick ? { card: pick, focus: null } : { card: null, focus: topic };
  }
  return { card: null, focus: belowBar };
}

/**
 * A drill for the topic holding progress back (nextNewCard's focus): one of
 * its cards below the held ramp difficulty (any open difficulty when the ramp
 * is finished), a missed one first, then an unseen one.
 */
export function nextConsolidationCard(pools: Pools, ctx: CardPickContext, topic: string): Question | null {
  const tq = ctx.byTopic.get(topic) ?? [];
  const servable = new Set(pools.serve.map(q => q.id));
  const held = topicRamp(tq).find(q => !ctx.latest.has(q.id) && !isRampDifficultyOpen(tq, ctx.latest, q.difficulty));
  const allowed = (q: Question) => held
    ? RAMP_DIFFICULTY_ORDER.indexOf(q.difficulty) < RAMP_DIFFICULTY_ORDER.indexOf(held.difficulty)
    : isRampDifficultyOpen(tq, ctx.latest, q.difficulty);
  const usable = tq
    .filter(q => allowed(q) && servable.has(q.id) && !ctx.served.has(q.id) && !ctx.resting.has(q.id))
    .sort((a, b) => rampRank(a) - rampRank(b));
  return usable.find(q => ctx.latest.get(q.id) === false)
    ?? usable.find(q => !ctx.latest.has(q.id))
    ?? null;
}

/**
 * A drill: one card of a family already met and not due today, the family
 * with the lowest retrievability first. Within it, an unseen card the topic's
 * difficulty gate has opened comes first (more of the topic), then the
 * family's usual review pick (pickFamilyCard).
 */
export function nextDrillCard(pools: Pools, store: FsrsStore, ctx: CardPickContext, now: number): Question | null {
  const index = familyIndex(pools.serve);
  const met = Object.entries(store.families)
    .filter(([f, s]) => s.state !== State.New && !isFamilyDue(s, now) && index.has(f))
    .map(([f, s]) => ({ f, r: familyRetrievability(s, now) }))
    .sort((a, b) => a.r - b.r || (a.f < b.f ? -1 : 1));
  for (const { f } of met) {
    const members = index.get(f)!;
    const unseen = members.find(q =>
      !ctx.latest.has(q.id) && !ctx.served.has(q.id)
      && (!ctx.unlocked || ctx.unlocked.has(q.topic))
      && isRampDifficultyOpen(ctx.byTopic.get(q.topic) ?? [q], ctx.latest, q.difficulty));
    const card = unseen ?? pickFamilyCard(members, store.families[f], ctx);
    if (card) return card;
  }
  return null;
}

export interface SessionPick {
  question: Question;
  kind: ServedKind;
}

/**
 * What the session serves next, or null when the bounded session is done (or
 * nothing at all can be served). Order: a review list card; past the bound, a
 * family still due today; a fresh slot (new card, a drill after every
 * NEW_PER_DRILL new ones); a re-ask that is still spacing out; and, only when
 * filters (or "Keep going") leave none of those servable, a card from the
 * older selector as practice (it does not use up a slot). Without filters,
 * a session with nothing left to serve ends early (null).
 */
export function selectSessionQuestion(
  session: ReviewSession,
  servePool: Question[],
  coursePool: Question[],
  progress: UserProgress,
  store: FsrsStore,
  cardDifficulty: Record<string, number> = {},
  conceptCtx?: ConceptSelectionContext,
  policy?: SelectionPolicy,
  now: number = Date.now(),
): SessionPick | null {
  const listed = nextReviewCard(session, servePool);
  if (listed) return { question: listed, kind: 'review' };
  if (isSessionDone(session)) return null;

  const pools: Pools = { course: coursePool, serve: servePool };
  const ctx = pickContext(coursePool, progress, cardDifficulty, session.served);
  const servable = new Set(servePool.map(q => q.id));
  const queued = new Set(session.queue.map(e => e.id));
  queued.forEach(id => ctx.served.add(id));

  if (session.keepGoing) {
    const index = familyIndex(coursePool);
    for (const f of dueFamilies(store, now)) {
      const members = (index.get(f) ?? []).filter(q => servable.has(q.id));
      const card = pickFamilyCard(members, store.families[f], ctx);
      if (card) return { question: card, kind: 'review' };
    }
  }

  if (session.keepGoing || session.freshLeft > 0) {
    const freshServed = session.tally.new + session.tally.drill;
    const drillTurn = (freshServed + 1) % (NEW_PER_DRILL + 1) === 0;
    const next = nextNewCard(pools, ctx);
    const drill = () => (next.focus ? nextConsolidationCard(pools, ctx, next.focus) : null)
      ?? nextDrillCard(pools, store, ctx, now);
    const first = drillTurn ? drill() : null;
    if (first) return { question: first, kind: 'drill' };
    if (next.card) return { question: next.card, kind: 'new' };
    const d = drill();
    if (d) return { question: d, kind: 'drill' };
  }

  const spacing = nextReviewCard(session, servePool, true);
  if (spacing) return { question: spacing, kind: 'review' };

  // Nothing of today's plan is servable. Under filters, or past the bound,
  // the older selector keeps practice going; otherwise the day is done.
  if (servePool.length === coursePool.length && !session.keepGoing) return null;
  const legacy = SRS.selectNextQuestion(servePool, progress, conceptCtx, policy, cardDifficulty);
  return legacy ? { question: legacy, kind: 'practice' } : null;
}

/**
 * The session after one answer. A list card leaves the list (one fewer
 * review); a new or drill card uses up a fresh slot. A first miss of a card
 * that is not itself a re-ask comes back once, REASK_SPACING cards later,
 * while the session has re-asks left; `requeued` says so, for the "+1 again"
 * on the pill. Practice answers (the older selector, under filters) use up
 * nothing.
 */
export function recordReviewAnswer(
  session: ReviewSession,
  questionId: string,
  isCorrect: boolean,
  kind: ServedKind = 'review',
  family?: string,
): { session: ReviewSession; requeued: boolean } {
  const answered = session.answered + 1;
  const served = session.served.includes(questionId) ? session.served : [...session.served, questionId];
  const idx = session.queue.findIndex(e => e.id === questionId);
  const entry = idx >= 0 ? session.queue[idx] : undefined;
  const counted = entry?.again ? 'again' : kind;
  const tally = { ...session.tally, [counted]: session.tally[counted] + 1, correct: session.tally.correct + (isCorrect ? 1 : 0) };
  const queue = idx >= 0 ? [...session.queue.slice(0, idx), ...session.queue.slice(idx + 1)] : [...session.queue];
  const freshLeft = !entry && (kind === 'new' || kind === 'drill') && !session.keepGoing
    ? Math.max(0, session.freshLeft - 1)
    : session.freshLeft;
  const base: ReviewSession = { ...session, queue, answered, served, tally, freshLeft };
  if (isCorrect || kind === 'practice' || entry?.again || session.reasks >= MAX_REASKS_PER_SESSION) {
    return { session: base, requeued: false };
  }
  const at = Math.min(queue.length, (idx >= 0 ? idx : 0) + REASK_SPACING - 1);
  queue.splice(at, 0, {
    id: questionId,
    family: entry?.family ?? family ?? '',
    again: true,
    notBefore: answered + REASK_SPACING - 1,
  });
  return { session: { ...base, queue, reasks: session.reasks + 1 }, requeued: true };
}

/** The family a card belongs to (re-exported for callers that only hold a question). */
export { familyOf };
