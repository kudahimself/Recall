/**
 * FSRS per card family (Stage 1 scheduler).
 *
 * A family is one primitive of one topic (familyOf: the topic plus the card's
 * first concept tag). Each family has one FSRS state from ts-fsrs, the same
 * library the poker trainer uses, so reviewing a primitive costs one card
 * instead of every card of it falling due on its own. A family review serves
 * one of its cards (pickFamilyCard): the card just missed, otherwise a seen
 * card of a type not used last time.
 *
 * The state is stored under FSRS_STORE_KEY (`recall-fsrs`). It is derived
 * data: replayHistory rebuilds it from attemptHistory in time order, the same
 * way live answers update it (recordAttempt), so it can be thrown away and
 * rebuilt at any time. `basis` records which history it was built from and
 * `bank` which card-to-family mapping (bankFingerprint); a store whose basis
 * or bank does not match (missing, unreadable, an older schema, progress
 * imported or changed in another tab, or cards re-tagged) is rebuilt.
 *
 * Pure functions only: no React, no localStorage.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type FSRS, type Grade } from 'ts-fsrs';
import { Question, QuestionAttempt, UserProgress } from '../types';
import { fsrsInitDifficulty, fsrsNextDifficulty, gradeFromResponseTime, ReviewGrade } from './conceptSRS';
import {
  SpacedRepetitionSystem as SRS,
  easeFactor,
  familyOf,
  isRampDifficultyOpen,
  rampRank,
  FAMILY_EASE_EXPONENT,
  FSRS_MAX_INTERVAL_DAYS,
  FSRS_REQUEST_RETENTION,
  FSRS_STORE_VERSION,
  LOAD_BALANCE_MIN_DAYS,
  LOAD_BALANCE_SPREAD,
} from './spacedRepetition';

export { State };

const DAY = 24 * 60 * 60 * 1000;

/** One family's FSRS state as stored (dates as epoch ms) plus what it served last. */
export interface FamilyState {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: State;
  last_review: number | null;
  /** Card answered last for this family, its type, and whether it was right. */
  lastCard: string;
  lastType: string;
  lastCorrect: boolean;
}

export interface FsrsStore {
  version: number;
  /** historyBasis of the attemptHistory this store reflects. */
  basis: string;
  /** bankFingerprint of the question bank this store was built against. */
  bank: string;
  families: Record<string, FamilyState>;
  /**
   * Each answered card's FSRS difficulty, computed from this history the way
   * recall-card-difficulty is, so a rebuild gives exactly the live schedule.
   */
  cards: Record<string, number>;
}

let scheduler: FSRS | null = null;
function getScheduler(): FSRS {
  if (!scheduler) {
    scheduler = fsrs(generatorParameters({
      request_retention: FSRS_REQUEST_RETENTION,
      maximum_interval: FSRS_MAX_INTERVAL_DAYS,
      enable_fuzz: false, // load balancing (balanceInterval) spreads due dates instead
      enable_short_term: false,
    }));
  }
  return scheduler;
}

export function emptyStore(byId: Map<string, Question>): FsrsStore {
  return { version: FSRS_STORE_VERSION, basis: historyBasis([]), bank: bankFingerprint(byId), families: {}, cards: {} };
}

const bankCache = new WeakMap<Map<string, Question>, string>();

/**
 * Fingerprint of what replay reads from the bank: every card's family and
 * type. Re-tagging a card's concepts moves it to another family, so a store
 * built against an older bank no longer matches.
 */
export function bankFingerprint(byId: Map<string, Question>): string {
  const cached = bankCache.get(byId);
  if (cached) return cached;
  let h = 2166136261;
  const ids = Array.from(byId.keys()).sort();
  for (const id of ids) {
    const q = byId.get(id)!;
    const s = `${id}=${familyOf(q)}:${q.type};`;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  }
  const fp = `${ids.length}:${h.toString(36)}`;
  bankCache.set(byId, fp);
  return fp;
}

/** Fingerprint of a history: its length and last timestamp. */
export function historyBasis(history: QuestionAttempt[]): string {
  const last = history.length > 0 ? history[history.length - 1].timestamp : 0;
  return `${history.length}:${last}`;
}

/** Start of the local calendar day holding `ms`. */
export function startOfLocalDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function startOfNextLocalDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}

function toCard(s: FamilyState): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
    last_review: s.last_review === null ? undefined : new Date(s.last_review),
  };
}

function fromCard(c: Card, last: Pick<FamilyState, 'lastCard' | 'lastType' | 'lastCorrect'>): FamilyState {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? c.last_review.getTime() : null,
    ...last,
  };
}

/**
 * The FSRS grade of one answer: the same auto-grade the App gives card
 * difficulty (correctness and response time, capped by the hint tier used).
 */
export function attemptGrade(q: Question, a: Pick<QuestionAttempt, 'isCorrect' | 'timeSpent' | 'hintTierUsed'>): ReviewGrade {
  return SRS.capGradeForHints(gradeFromResponseTime(q.type, a.timeSpent, a.isCorrect), a.hintTierUsed ?? 0);
}

/** A card's FSRS difficulty after an answer of `grade` (what recall-card-difficulty stores). */
export function nextCardDifficulty(prev: number, grade: ReviewGrade): number {
  return prev <= 0 ? fsrsInitDifficulty(grade) : fsrsNextDifficulty(prev, grade);
}

/** Families of `store` due on each local day from `from` on, by day offset. */
function loadByDay(families: Record<string, FamilyState>, from: number, skip: string): Map<number, number> {
  const base = startOfLocalDay(from);
  const load = new Map<number, number>();
  for (const [f, s] of Object.entries(families)) {
    if (f === skip || s.state === State.New) continue;
    const day = Math.round((startOfLocalDay(s.due) - base) / DAY);
    load.set(day, (load.get(day) ?? 0) + 1);
  }
  return load;
}

/**
 * Load balancing: an interval of LOAD_BALANCE_MIN_DAYS or more moves, within
 * LOAD_BALANCE_SPREAD of its length, to the day with the fewest families due.
 * Ties keep the day closest to the FSRS interval, so the result is
 * deterministic and an empty calendar keeps the interval exactly.
 */
export function balanceInterval(families: Record<string, FamilyState>, family: string, now: number, ivl: number): number {
  if (ivl < LOAD_BALANCE_MIN_DAYS) return ivl;
  const spread = Math.max(1, Math.round(ivl * LOAD_BALANCE_SPREAD));
  const load = loadByDay(families, now, family);
  let best = ivl;
  let bestLoad = load.get(ivl) ?? 0;
  for (let k = 1; k <= spread; k++) {
    for (const d of [ivl - k, ivl + k]) {
      if (d < 1 || d > FSRS_MAX_INTERVAL_DAYS) continue;
      const l = load.get(d) ?? 0;
      if (l < bestLoad) { best = d; bestLoad = l; }
    }
  }
  return best;
}

/**
 * The family's next FSRS state after an answer of `grade` to card `q`. The
 * interval FSRS gives is scaled by the answered card's difficulty
 * (easeFactor ** FAMILY_EASE_EXPONENT) and then load-balanced. A miss keeps
 * FSRS's own interval (a day). Mutates `families`; callers pass a copy.
 */
function scheduleFamily(families: Record<string, FamilyState>, q: Question, grade: ReviewGrade, now: number, cardDifficulty: number): void {
  const family = familyOf(q);
  const prev = families[family];
  const card = prev ? toCard(prev) : createEmptyCard(new Date(now));
  const next = fromCard(getScheduler().next(card, new Date(now), grade as Grade).card, {
    lastCard: q.id,
    lastType: q.type,
    lastCorrect: grade !== Rating.Again,
  });
  if (next.state === State.Review) {
    let ivl = Math.max(1, next.scheduled_days);
    if (grade !== Rating.Again) {
      ivl = Math.round(ivl * Math.pow(easeFactor(cardDifficulty), FAMILY_EASE_EXPONENT));
      ivl = balanceInterval(families, family, now, Math.min(FSRS_MAX_INTERVAL_DAYS, Math.max(1, ivl)));
    }
    next.scheduled_days = ivl;
    next.due = now + ivl * DAY;
  }
  families[family] = next;
}

/** Mutating core of recordAttempt, shared with replayHistory. */
function applyAttempt(families: Record<string, FamilyState>, cards: Record<string, number>, q: Question, a: QuestionAttempt): void {
  const grade = attemptGrade(q, a);
  const d = nextCardDifficulty(cards[q.id] ?? 0, grade);
  cards[q.id] = d;
  if (!a.retry) scheduleFamily(families, q, grade, a.timestamp, d);
}

/**
 * The store after one recorded answer, `history` being the attempt history
 * that now ends with `a`. A `retry` attempt (the pass or give-up after a first
 * failed coding submit, which was already recorded as the miss) updates the
 * card's difficulty but is not a second review of its family.
 */
export function recordAttempt(store: FsrsStore, q: Question, a: QuestionAttempt, history: QuestionAttempt[]): FsrsStore {
  const families = { ...store.families };
  const cards = { ...store.cards };
  applyAttempt(families, cards, q, a);
  return { version: FSRS_STORE_VERSION, basis: historyBasis(history), bank: store.bank, families, cards };
}

/**
 * Rebuild the store from attemptHistory, oldest answer first, exactly as live
 * answers update it (recordAttempt). Attempts on cards not in the bank are
 * skipped. Deterministic: the same history always gives the same store.
 */
export function replayHistory(history: QuestionAttempt[], byId: Map<string, Question>): FsrsStore {
  const ordered = history.map((a, i) => ({ a, i })).sort((x, y) => x.a.timestamp - y.a.timestamp || x.i - y.i);
  const families: Record<string, FamilyState> = {};
  const cards: Record<string, number> = {};
  for (const { a } of ordered) {
    const q = byId.get(a.questionId);
    if (q) applyAttempt(families, cards, q, a);
  }
  return { version: FSRS_STORE_VERSION, basis: historyBasis(history), bank: bankFingerprint(byId), families, cards };
}

/** Parse a stored store; null when absent, unreadable or another schema version. */
export function parseStore(raw: string | null): FsrsStore | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== FSRS_STORE_VERSION || typeof parsed.basis !== 'string'
      || typeof parsed.bank !== 'string'
      || !parsed.families || typeof parsed.families !== 'object'
      || !parsed.cards || typeof parsed.cards !== 'object') return null;
    return parsed as FsrsStore;
  } catch {
    return null;
  }
}

/** The stored store when it matches `progress` and the bank, otherwise one rebuilt from its history. */
export function loadOrRebuild(raw: string | null, progress: UserProgress, byId: Map<string, Question>): { store: FsrsStore; rebuilt: boolean } {
  const stored = parseStore(raw);
  if (stored && stored.basis === historyBasis(progress.attemptHistory) && stored.bank === bankFingerprint(byId)) return { store: stored, rebuilt: false };
  return { store: replayHistory(progress.attemptHistory, byId), rebuilt: true };
}

/** Review families are due for the whole local day they fall on. */
export function isFamilyDue(s: FamilyState | undefined, now: number): boolean {
  return !!s && s.state !== State.New && s.due < startOfNextLocalDay(now);
}

/** Probability of recall now (1 right after a review, lower the more overdue). */
export function familyRetrievability(s: FamilyState, now: number): number {
  return getScheduler().get_retrievability(toCard(s), new Date(now), false) as number;
}

/** Due families, lowest retrievability (most overdue) first. */
export function dueFamilies(store: FsrsStore, now: number): string[] {
  return Object.entries(store.families)
    .filter(([, s]) => isFamilyDue(s, now))
    .map(([f, s]) => ({ f, r: familyRetrievability(s, now), due: s.due }))
    .sort((a, b) => a.r - b.r || a.due - b.due || (a.f < b.f ? -1 : 1))
    .map(x => x.f);
}

/** Cards grouped by family, in ramp order, for one pool (cached per pool array). */
const familyIndexCache = new WeakMap<Question[], Map<string, Question[]>>();
export function familyIndex(pool: Question[]): Map<string, Question[]> {
  const cached = familyIndexCache.get(pool);
  if (cached) return cached;
  const index = new Map<string, Question[]>();
  pool.map((q, i) => ({ q, i }))
    .sort((a, b) => rampRank(a.q) - rampRank(b.q) || a.i - b.i)
    .forEach(({ q }) => {
      const f = familyOf(q);
      const arr = index.get(f) ?? [];
      arr.push(q);
      index.set(f, arr);
    });
  familyIndexCache.set(pool, index);
  return index;
}

export interface CardPickContext {
  progress: UserProgress;
  latest: Map<string, boolean>;
  /** Well-known cards still resting (SRS.restingWellKnown): never served early. */
  resting: Set<string>;
  /** Cards already answered this session (re-asks aside, a card is served once a day). */
  served: Set<string>;
  /** Families still in today's review list: practice and drills leave them to it. */
  queuedFamilies?: Set<string>;
  /** Topics the learner may practise (null: no gating). */
  unlocked: Set<string> | null;
  /** Topic questions by topic, for the in-topic difficulty gate on unseen cards. */
  byTopic: Map<string, Question[]>;
}

/**
 * The card a family review serves: the card the family missed last time
 * (relearn it), otherwise a seen card of a type not used last time, a missed
 * one first, then the one seen longest ago. Resting well-known cards are
 * skipped; when only those are left, an unseen card of the family at a
 * difficulty the topic has opened is served instead, else nothing.
 */
export function pickFamilyCard(members: Question[], s: FamilyState | undefined, ctx: CardPickContext): Question | null {
  const usable = members.filter(q =>
    !ctx.served.has(q.id) && !ctx.resting.has(q.id) && (!ctx.unlocked || ctx.unlocked.has(q.topic)));
  if (usable.length === 0) return null;
  if (s && !s.lastCorrect) {
    const missed = usable.find(q => q.id === s.lastCard && ctx.latest.get(q.id) === false);
    if (missed) return missed;
  }
  const seen = usable.filter(q => ctx.latest.has(q.id));
  if (seen.length > 0) {
    const fresh = seen.filter(q => q.type !== s?.lastType);
    const from = fresh.length > 0 ? fresh : seen;
    return [...from].sort((a, b) => {
      const wa = ctx.latest.get(a.id) === false ? 0 : 1;
      const wb = ctx.latest.get(b.id) === false ? 0 : 1;
      if (wa !== wb) return wa - wb;
      return (ctx.progress.lastAttempt.get(a.id) ?? 0) - (ctx.progress.lastAttempt.get(b.id) ?? 0);
    })[0];
  }
  return usable.find(q => isRampDifficultyOpen(ctx.byTopic.get(q.topic) ?? [q], ctx.latest, q.difficulty)) ?? null;
}
