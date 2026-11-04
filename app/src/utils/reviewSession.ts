/**
 * Reviews left today: one fixed list per study session, and the single number
 * the learner sees for it.
 *
 * The list is built once, when the session starts, from the cards the review
 * branches owe today: missed cards whose relearn interval has passed and cards
 * past their spacing interval, in unlocked topics, of every type. A resting
 * well-known card is by definition not past its interval, so it is never in
 * the list. Missed cards come first (oldest miss first), then due cards by how
 * overdue they are, capped at REVIEWS_PER_DAY.
 *
 * The session serves the list before anything else (selectSessionQuestion),
 * and the pill shows its length (reviewsLeft). Answering a list card removes
 * it, so the number drops by exactly one per answered review. A miss puts the
 * card back once, REASK_SPACING cards later, at most MAX_REASKS_PER_SESSION
 * times per session; the pill shows that as "+1 again". Cards that fall due
 * mid-session are not added: they wait for the next session. Once the list is
 * empty the normal selector takes over and the pill reads 0.
 *
 * Nothing here changes an interval or any stored data: the session lives in
 * memory and is rebuilt from progress on the next day or after a reload.
 */
import { Question, UserProgress } from '../types';
import {
  SpacedRepetitionSystem as SRS,
  ConceptSelectionContext,
  easeFactor,
  MAX_REASKS_PER_SESSION,
  REASK_SPACING,
  REVIEWS_PER_DAY,
} from './spacedRepetition';
import { SelectionPolicy } from './courseConfig';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface ReviewEntry {
  id: string;
  /** True for a re-ask of a card missed earlier in this session. */
  again: boolean;
  /** Not served before the session has had this many answers (re-ask spacing). */
  notBefore: number;
}

export interface ReviewSession {
  /** Local calendar day the list was built on (localDayKey). */
  day: string;
  /** Reviews still owed this session, in serving order. */
  queue: ReviewEntry[];
  /** Answers given in this session, list cards or not. */
  answered: number;
  /** Re-asks added so far (capped at MAX_REASKS_PER_SESSION). */
  reasks: number;
  /** List size when the session started. */
  total: number;
}

/** Local calendar day, so a session left open overnight starts fresh the next day. */
export function localDayKey(now: number = Date.now()): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Ids of the reviews owed now, in serving order, capped at `limit`.
 * Membership: seen card in an unlocked topic whose time since its last answer
 * has reached its interval (getEffectiveInterval: about a day for a miss, the
 * streak interval otherwise, both scaled by card difficulty).
 */
export function buildReviewList(
  pool: Question[],
  progress: UserProgress,
  cardDifficulty: Record<string, number> = {},
  now: number = Date.now(),
  limit: number = REVIEWS_PER_DAY,
): string[] {
  const unlocked = SRS.getUnlockedTopics(pool, progress);
  const latest = SRS.latestCorrectness(progress);
  const streaks = SRS.correctStreaks(progress);
  const missed: { id: string; last: number }[] = [];
  const due: { id: string; last: number; ratio: number }[] = [];
  for (const q of pool) {
    if (unlocked && !unlocked.has(q.topic)) continue;
    const ok = latest.get(q.id);
    if (ok === undefined) continue; // never answered: new content, not a review
    const last = progress.lastAttempt.get(q.id) ?? 0;
    const interval = SRS.getTargetInterval(streaks.get(q.id) ?? 0) * easeFactor(cardDifficulty[q.id] ?? 0);
    const elapsed = last > 0 ? (now - last) / MS_PER_DAY : Infinity;
    if (elapsed < interval) continue;
    if (ok === false) missed.push({ id: q.id, last });
    else due.push({ id: q.id, last, ratio: elapsed / interval });
  }
  missed.sort((a, b) => a.last - b.last);
  due.sort((a, b) => b.ratio - a.ratio || a.last - b.last);
  return [...missed, ...due].slice(0, limit).map(c => c.id);
}

export function startReviewSession(
  pool: Question[],
  progress: UserProgress,
  cardDifficulty: Record<string, number> = {},
  now: number = Date.now(),
): ReviewSession {
  const ids = buildReviewList(pool, progress, cardDifficulty, now);
  return {
    day: localDayKey(now),
    queue: ids.map(id => ({ id, again: false, notBefore: 0 })),
    answered: 0,
    reasks: 0,
    total: ids.length,
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

/** The next list card to serve from `pool` (the current filtered pool), or null. */
export function nextReviewCard(session: ReviewSession, pool: Question[]): Question | null {
  if (session.queue.length === 0) return null;
  const byId = new Map(pool.map(q => [q.id, q]));
  for (const e of session.queue) {
    if (e.notBefore > session.answered) continue;
    const q = byId.get(e.id);
    if (q) return q;
  }
  return null;
}

/**
 * Today's list first; when no list card can be served right now (the list is
 * empty, filtered out, or only holds a re-ask that is still spacing out), the
 * normal selector picks.
 */
export function selectSessionQuestion(
  session: ReviewSession,
  pool: Question[],
  progress: UserProgress,
  conceptCtx?: ConceptSelectionContext,
  policy?: SelectionPolicy,
  cardDifficulty: Record<string, number> = {},
): Question | null {
  return nextReviewCard(session, pool)
    ?? SRS.selectNextQuestion(pool, progress, conceptCtx, policy, cardDifficulty);
}

/**
 * The session after one answer. A list card leaves the list (one fewer
 * review). A missed list card that is not itself a re-ask comes back once,
 * REASK_SPACING cards later, while the session has re-asks left; `requeued`
 * says so, for the "+1 again" on the pill. Answers to cards outside the list
 * leave the list unchanged.
 */
export function recordReviewAnswer(
  session: ReviewSession,
  questionId: string,
  isCorrect: boolean,
): { session: ReviewSession; requeued: boolean } {
  const answered = session.answered + 1;
  const idx = session.queue.findIndex(e => e.id === questionId);
  if (idx < 0) return { session: { ...session, answered }, requeued: false };
  const entry = session.queue[idx];
  const queue = [...session.queue.slice(0, idx), ...session.queue.slice(idx + 1)];
  if (isCorrect || entry.again || session.reasks >= MAX_REASKS_PER_SESSION) {
    return { session: { ...session, queue, answered }, requeued: false };
  }
  const at = Math.min(queue.length, idx + REASK_SPACING - 1);
  queue.splice(at, 0, { id: questionId, again: true, notBefore: answered + REASK_SPACING - 1 });
  return { session: { ...session, queue, answered, reasks: session.reasks + 1 }, requeued: true };
}
