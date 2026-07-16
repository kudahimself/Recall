import { Question, QuestionAttempt, QuestionType, UserProgress, Difficulty, Course } from '../types';
import { getCourseForTopic, WEBDEV_PATH_ORDER, BACKEND_PATH_ORDER, DATABRICKS_PATH_ORDER, DATA_ENG_PATH_ORDER, SQL_PATH_ORDER, getTopicKeysForSection, getSectionUnits, getGroupsForTopic, getTopicOrder, SelectionPolicy, DRAIN_SUPERSEDED_SECTIONS } from './courseConfig';
import {
  bucketCard,
  CardBucket,
  ConceptProgress,
  getRetrievability,
} from './conceptSRS';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * When provided to `selectNextQuestion`, switches the SRS to concept-aware
 * selection (DUE / FRINGE / SPOT_CHECK buckets per CONCEPT_LAYER_SPEC.md).
 * Caller wires this in only when the `recall-concept-srs-enabled` flag is on
 * and falls back to legacy if the function returns null (no concept-tagged
 * cards in the unlocked pool).
 */
export interface ConceptSelectionContext {
  progress: ConceptProgress;
  /** Per-concept beta from the registry (PFA difficulty offset). */
  betas: Record<string, number>;
}

/** Bucket-level sampling shares for concept-aware selection. */
export const DUE_PICK_FRACTION = 0.80;
export const FRINGE_PICK_FRACTION = 0.10;
export const SPOT_CHECK_PICK_FRACTION = 0.10;

/** When a card lands in DUE and is also an unlock blocker, multiply its weight. */
export const CONCEPT_UNLOCK_BLOCKER_WEIGHT_MULT = 3;

// Single source of truth for learning-system thresholds and windows.

// Section-unlock criteria.
export const UNLOCK_COVERAGE_PCT = 100;
export const UNLOCK_ACCURACY_PCT = 80;

// Rolling windows.
export const RECENT_WINDOW = 10;         // section- / overall-level recent accuracy
export const TOPIC_RECENT_WINDOW = 5;    // per-topic priority / proficiency

// Strong / weak area classification (first-attempt accuracy).
export const WEAK_AREA_PCT = 50;
export const STRONG_AREA_PCT = 75;
export const MIN_ATTEMPTS_FOR_STATS = 3;
// "Areas to Focus On" is relative: show the N weakest topics below 100%,
// even when none fall under WEAK_AREA_PCT.
export const WEAK_AREAS_MAX = 8;

// Progress-bar colour bands (recent accuracy %).
export const BAR_GOOD_PCT = 80;
export const BAR_OK_PCT = 70;

// Question-selection tuning.
export const NEW_QUESTION_PROBABILITY = 0.75;  // chance to pick a new question when available
export const CANDIDATE_POOL_SIZE = 10;         // weighted-random pool for review questions
export const REVIEW_COOLDOWN = 3;              // avoid re-serving a question shown in the last N attempts
export const INCORRECT_PRIORITY_WEIGHT = 15;   // priority bump per recent wrong answer (per-question)

// Completion push: when ≤ this many unseen questions remain in the unlocked
// pool, drop the new-vs-review coin flip and ALWAYS serve a new question.
// Without this, the 30% review chance compounds near the end of a topic and
// the user gets stuck cycling on already-seen questions instead of finishing.
export const COMPLETION_PUSH_THRESHOLD = 3;

// Unlock-blocker boost: a question whose LATEST attempt is wrong in a topic
// with 100% coverage is the only thing keeping the learner from crossing the
// latest-correct > 80% gate into the next section. Surface those first.
export const UNLOCK_BLOCKER_BOOST = 300;

// Topic-review boost: every question in a topic that is fully covered but not
// yet mastered gets a lift so the learner keeps cycling through it — including
// latest-correct questions with shallow streaks that would otherwise drift
// away as soon as the next section unlocks. Weaker than UNLOCK_BLOCKER_BOOST
// so latest-wrong questions still dominate within the topic.
export const TOPIC_REVIEW_BOOST = 120;

// Topic-review threshold: a covered topic stays "in review" until latest-correct
// pct exceeds this bar. Set higher than UNLOCK_ACCURACY_PCT (the section-unlock
// gate) so a topic keeps cycling even after it's technically passed the unlock
// bar — the learner practises to mastery, not just to the pass mark.
// PRIORITY-BOOST HEURISTIC ONLY: it feeds TOPIC_REVIEW_BOOST scoring. Mastery
// itself (drain/resurface/unlock eligibility) is the stored sticky set
// (masteredTopics) at the 80% bar — this constant no longer gates any queue.
export const TOPIC_REVIEW_THRESHOLD_PCT = 95;

// Mastery streak tiers (consecutive correct answers).
export const MASTERY_EXPERT_STREAK = 5;
export const MASTERY_PROFICIENT_STREAK = 3;

// Mastered-resurface model (Anki-style, due-driven). Without this, mastered
// questions effectively retire — they only resurface when their spacing
// interval (1, 3, 7, 14, 30, 60, 120 days) is due, and for concept-aware
// courses the resurface only happens via a 30-day-stale SPOT_CHECK that almost
// never fires during active study. A topic counts as mastered when
// isTopicMastered returns true — STICKY mastery via the stored masteredTopics
// set: the topic's unlock bar was crossed once (full coverage + latest-correct
// > UNLOCK_ACCURACY_PCT) and stays granted. Later misses make cards due (and
// latest-wrong drain cards re-queue) but never demote the topic.
//
// Two surfacing modes, both running BEFORE the concept-aware bucketing so its
// DUE/IDLE buckets can't starve them:
//   1. DUE cards (daysSinceLastReview >= targetInterval, i.e. dueRatio >= 1)
//      surface whenever due — no probability cap, most-overdue first. A due
//      DRAIN card (isDrainCard: coding/advanced) additionally hard-gates new
//      content until cleared — mid-topic included (reviews-first, Anki-style).
//      Exception: supersession-retired topics (getRetiredDrainTopics /
//      DRAIN_SUPERSEDED_SECTIONS) never hard-gate — once the superseding
//      section is finished their cards only resurface via the normal due path.
//      For due NON-drain cards the rate is 1 outside onboarding (every review
//      slot drains the due queue); while onboarding a new topic it drops to
//      ONBOARDING_DUE_RESURFACE_PROB (reduced, not off) so fresh material gets
//      focused practice.
//   2. When nothing is strictly due, a light MASTERED_RESURFACE_FLOOR_FRACTION
//      interleave keeps not-yet-due advanced cards warm ("desirable
//      difficulty", Bjork & Kornell) — applied only OUTSIDE onboarding.
export const MASTERED_RESURFACE_FLOOR_FRACTION = 0.20;

// Difficulty weights for the advanced-weighted mastered sampler. ADVANCED
// dominates; INTERMEDIATE appears occasionally; BEGINNER rarely. Sampling
// (not hard-filtering) means a mastered topic with no advanced cards still
// resurfaces gracefully via its intermediate/beginner questions.
export const MASTERED_ADV_WEIGHT = 6;
export const MASTERED_INT_WEIGHT = 1;
export const MASTERED_BEGINNER_WEIGHT = 0.5;

// New-topic onboarding gate. While the learner still has a servable unseen
// question in the lead topic (first exposure to the topic's primitives), SR
// review is reduced — not off — so the new material gets blocked practice
// before interleaving resumes. This is the reduced due-resurface rate during
// onboarding; once every question in the topic has been seen once, the gate
// lifts and full due-driven review (rate 1) resumes. Applies only to NON-drain
// due cards: a due drain card (coding/advanced) overrides onboarding entirely
// and hard-gates new content until reviewed.
export const ONBOARDING_DUE_RESURFACE_PROB = 0.25;

// Recent-failure pivot. When the very last attempt in attemptHistory is wrong,
// override the new-vs-review coin flip with this much-lower new-question
// probability. The asymmetry is deliberate: a failure is a signal the user is
// not ready to advance, and the selector should reinforce the failed primitive
// before adding more material. Without this, the 70/30 new-vs-review default
// pushes the user past their failures up the difficulty ramp inside the same
// topic.
export const REVIEW_AFTER_FAIL_PROB = 0.15;

// Latest-wrong global boost: any question whose most-recent attempt was wrong
// gets this priority lift regardless of topic, coverage, or how long ago the
// failure was. Catches failures that get stranded when the user switches
// topics or filters before resolving them.
export const LATEST_WRONG_BOOST = 80;

// Active-topic failure boost. A latest-wrong question in the topic the user
// is currently practising (= topic of the most recent attempt overall) gets
// this dominant boost so failed in-topic questions out-rank everything else
// — including the existing UNLOCK_BLOCKER_BOOST — while the topic is still
// in progress. Without this, mid-topic failures wait until full topic
// coverage before any failure boost fires, and the user races past them.
export const ACTIVE_TOPIC_FAILURE_BOOST = 400;

// Lapse-recency window for the active-topic boost multiplier. A failure that
// was the last attempt overall is exactly the question the user wants back
// next (Anki "Again"); a failure inside the last RECENT_LAPSE_WINDOW attempts
// is recent enough to keep at full weight; older failures decay slightly so
// the just-failed question always wins a tie-break.
export const RECENT_LAPSE_WINDOW = 5;

// Within-topic difficulty gate. New picks at intermediate/advanced inside a
// topic are blocked until earlier difficulties in the SAME topic reach this
// latest-correct percentage. Stops the failure-then-harder-question loop
// where a beginner miss is immediately followed by an intermediate or
// advanced question on the same primitive. Set to 70 (not 80) so the bar is
// reachable after a rough run — at 80 a struggling user could be walled off
// from all new content with no realistic path back.
export const IN_TOPIC_DIFFICULTY_GATE_PCT = 70;

// When the next-difficulty new question in the active topic is gated (accuracy
// below IN_TOPIC_DIFFICULTY_GATE_PCT) but the user just answered CORRECTLY,
// let that gated question through at this low rate so forward motion never
// fully stops. Never fires right after a failure — a wrong answer still locks
// the next pick to review. Keep well below NEW_QUESTION_PROBABILITY.
export const GATE_RELIEF_PROB = 0.18;

/** (correct / total) * 100, or 0 if total is 0. Single source for accuracy %. */
export function pct(correct: number, total: number): number {
  return total > 0 ? (correct / total) * 100 : 0;
}

// Difficulty-scaled drain interval. An FSRS card difficulty D∈[1..10] (auto-graded
// from speed+correctness via gradeFromResponseTime/applyReview) maps to an interval
// MULTIPLIER, symmetric in log-space around the mid: an EASY card (D=1) waits longer,
// a HARD card (D=10) returns sooner. D=0/undefined (untagged, legacy, or never
// answered under the difficulty code) → 1.0, leaving the plain streak interval
// unchanged — so the DE course (no concepts) and old data are unaffected.
export const EASE_MID_DIFFICULTY = 5.5;   // midpoint of the 1..10 range → factor 1.0
export const EASE_MAX_FACTOR = 2.5;       // easiest (D=1) → 2.5× later
export const EASE_MIN_FACTOR = 0.4;       // hardest (D=10) → ~0.4× sooner

export function easeFactor(difficulty: number): number {
  if (!difficulty || difficulty <= 0) return 1.0;
  const d = Math.min(10, Math.max(1, difficulty));
  const t = (EASE_MID_DIFFICULTY - d) / (EASE_MID_DIFFICULTY - 1); // +1 @ D=1 … −1 @ D=10
  return Math.min(EASE_MAX_FACTOR, Math.max(EASE_MIN_FACTOR, Math.pow(EASE_MAX_FACTOR, t)));
}

/**
 * DEV-ONLY preview escape hatch. Set `localStorage['recall-dev-unlock-all'] = '1'`
 * in the browser console to unlock every section and topic, so you can spot-check
 * any section's questions without grinding the unlock gate. Delete the key to
 * restore normal gating. Off by default; affects nothing in tests/SSR. Does NOT
 * touch saved progress — it only bypasses the section/topic gates while set.
 */
export function isDevUnlockAll(): boolean {
  try {
    return typeof localStorage !== 'undefined'
      && localStorage.getItem('recall-dev-unlock-all') === '1';
  } catch {
    return false;
  }
}

/** Last `window` entries of an array (chronological slice). */
export function recentAttempts<T>(attempts: T[], window: number): T[] {
  return attempts.slice(-window);
}

/**
 * Mastery predicate: UNLOCK_COVERAGE_PCT coverage + > UNLOCK_ACCURACY_PCT of
 * questions whose MOST RECENT attempt is correct. A state snapshot rather
 * than a time window — so a repeatedly-failing question can't keep dragging
 * the gate down once the learner eventually gets it right.
 */

/**
 * Section/unit-unlock predicate: STORED sticky mastery. A group is unlocked
 * once every one of its topic keys is in progress.masteredTopics (granted at
 * the crossing by updateMasteredTopics and never revoked), so once a section
 * unlocks it can never re-lock — resurfaced misses on old material make cards
 * due, not sections closed. A declared topic with no questions in the pool
 * never blocks an unlock.
 */
export function isMastered(
  topicKeys: string[],
  questions: Question[],
  progress: UserProgress,
): boolean {
  return topicKeys.every(t =>
    progress.masteredTopics.has(t) || !questions.some(q => q.topic === t),
  );
}

export class SpacedRepetitionSystem {
  /**
   * Calculate priority score for a question (higher = should be shown sooner)
   * Factors:
   * - Recent failures increase priority
   * - Time since last attempt
   * - Number of incorrect attempts
   * - Difficulty level
   */
  /**
   * True when this question's latest attempt is wrong AND every other question
   * in its topic has been attempted at least once — i.e. the topic already has
   * full coverage, so flipping this question's latest attempt to correct is
   * the exact thing that moves the unlock gate.
   */
  static isUnlockBlocker(
    questionId: string,
    progress: UserProgress,
    topicQuestions: Question[],
  ): boolean {
    if (topicQuestions.length === 0) return false;
    // Latest-per-question over the whole topic
    const topicIds = new Set(topicQuestions.map(q => q.id));
    const latest = new Map<string, boolean>();
    for (const a of progress.attemptHistory) {
      if (topicIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
    }
    // Full coverage? Every topic question must be in `latest`.
    if (latest.size < topicQuestions.length) return false;
    const thisLatest = latest.get(questionId);
    return thisLatest === false;
  }

  /**
   * True when the topic has full coverage (every question attempted at least
   * once) but latest-correct pct is below TOPIC_REVIEW_THRESHOLD_PCT. Used to
   * keep a "just finished but not yet at mastery" topic in rotation — its
   * questions get TOPIC_REVIEW_BOOST regardless of individual latest-correct /
   * streak state, so shallow-streak questions don't drift away. Threshold is
   * stricter than the section-unlock gate so topics keep cycling past the
   * unlock bar until they're genuinely mastered.
   */
  static isTopicInReview(
    progress: UserProgress,
    topicQuestions: Question[],
  ): boolean {
    if (topicQuestions.length === 0) return false;
    const topicIds = new Set(topicQuestions.map(q => q.id));
    const latest = new Map<string, boolean>();
    for (const a of progress.attemptHistory) {
      if (topicIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
    }
    if (latest.size < topicQuestions.length) return false;
    let correct = 0;
    latest.forEach(isCorrect => { if (isCorrect) correct++; });
    return pct(correct, latest.size) < TOPIC_REVIEW_THRESHOLD_PCT;
  }

  /**
   * Topic-level mastery for the drain/resurface pool. A simple membership
   * check against the STORED sticky set (progress.masteredTopics): same 80%
   * bar as the section unlock, granted once at the crossing and never revoked.
   * A mastered topic's misses re-enter the drain as individual due/latest-wrong
   * cards; they can never demote the topic and silently empty its queue.
   */
  static isTopicMastered(
    progress: UserProgress,
    topicQuestions: Question[],
  ): boolean {
    if (topicQuestions.length === 0) return false;
    return progress.masteredTopics.has(topicQuestions[0].topic);
  }

  /**
   * The ONLY writer of mastery. Called after each answer with the just-answered
   * topic: checks the three unlock scopes that answer could complete — the
   * topic itself, its unit, and its section (aggregate bars, matching the
   * unlock gates) — and, for any scope now holding full coverage +
   * latest-correct > UNLOCK_ACCURACY_PCT, adds ALL of that scope's member
   * topics to the set. Mastery is sticky: entries are only ever added.
   * Returns the same Set reference when nothing changed (so React skips the
   * re-render/persist) and a new Set when a scope was newly crossed.
   */
  static updateMasteredTopics(
    progress: UserProgress,
    answeredTopic: string,
    allQuestions: Question[],
  ): Set<string> {
    const current = progress.masteredTopics;
    const scopes: string[][] = [[answeredTopic]];
    const groups = getGroupsForTopic(answeredTopic);
    if (groups) scopes.push(groups.unitTopics, groups.sectionTopics);

    const latest = this.latestCorrectness(progress);
    let next: Set<string> | null = null;

    for (const keys of scopes) {
      if (keys.every(k => current.has(k))) continue; // scope already granted
      const qs = allQuestions.filter(q => keys.includes(q.topic));
      if (qs.length === 0) continue;
      let covered = true;
      let correct = 0;
      for (const q of qs) {
        const lc = latest.get(q.id);
        if (lc === undefined) { covered = false; break; } // group not fully covered
        if (lc) correct++;
      }
      if (!covered) continue;
      if (pct(correct, qs.length) <= UNLOCK_ACCURACY_PCT) continue;
      if (!next) next = new Set(current);
      for (const k of keys) next.add(k);
    }
    return next ?? current;
  }

  /**
   * A "drain card" is a mastered-review question worth gating new content for:
   * a CODING cold-write (one per concept) or ANY advanced card. Beginner/
   * intermediate faded + MCQ recur naturally inside later topics and via the
   * concept-aware path, so they are excluded from the reviews-first hard drain.
   */
  static isDrainCard(q: Question): boolean {
    return q.type === QuestionType.CODING || q.difficulty === Difficulty.ADVANCED;
  }

  /**
   * Topics retired from the drain queue (DRAIN_SUPERSEDED_SECTIONS): a
   * superseded section's topics stop hard-gating new content once its
   * superseding section is FINISHED - every question of every superseding
   * topic present in the pool attempted. The superseding section's own
   * coding/advanced cards re-exercise the same primitives, so cold-drilling
   * the old fundamentals is redundant. Retired topics remain eligible for the
   * normal (non-gating) due resurface - they just never trip the hard gate.
   * Scoped to topics present in topicToQs so pools without the superseding
   * section (other courses, partial test fixtures) never retire anything.
   */
  static getRetiredDrainTopics(
    topicToQs: Map<string, Question[]>,
    progress: UserProgress,
  ): Set<string> {
    const retired = new Set<string>();
    for (const [supersededSection, supersedingSection] of Object.entries(DRAIN_SUPERSEDED_SECTIONS)) {
      const supersedingTopics = getTopicKeysForSection(supersedingSection)
        .filter(t => topicToQs.has(t));
      if (supersedingTopics.length === 0) continue;
      const finished = supersedingTopics.every(t =>
        (topicToQs.get(t) ?? []).every(q => progress.questionsAttempted.has(q.id)));
      if (!finished) continue;
      for (const t of getTopicKeysForSection(supersededSection)) retired.add(t);
    }
    return retired;
  }

  /**
   * True iff the pool contains at least one MASTERED-topic question that is
   * actually due for review — daysSinceLastReview >= its spacing interval
   * (dueRatio >= 1). Drives the due-driven resurface: when due cards exist the
   * caller surfaces one (most-overdue first) instead of waiting on a
   * probability roll. Uses progress.lastAttempt for O(1) last-review lookups.
   * Optional `filter` is AUTHORITATIVE on dueness (e.g. the drain predicate,
   * which admits latest-wrong cards that are not yet interval-due): a card
   * passing the filter only needs the mastered-topic check.
   */
  static hasDueMastered(
    pool: Question[],
    topicToQs: Map<string, Question[]>,
    progress: UserProgress,
    filter?: (q: Question) => boolean,
    cardDifficulty: Record<string, number> = {},
  ): boolean {
    const now = Date.now();
    for (const q of pool) {
      if (filter && !filter(q)) continue;
      const tq = topicToQs.get(q.topic);
      if (!tq || !this.isTopicMastered(progress, tq)) continue;
      if (filter) return true; // filter already decided dueness
      const last = progress.lastAttempt.get(q.id) ?? 0;
      if (last === 0) return true; // never timestamped → treat as maximally due
      const daysSince = (now - last) / MS_PER_DAY;
      if (daysSince >= this.getEffectiveInterval(q.id, progress, cardDifficulty)) return true;
    }
    return false;
  }

  /**
   * Latest-attempt correctness per question, one pass over attemptHistory.
   * Single source for the drain's "latest-wrong" membership test.
   */
  static latestCorrectness(progress: UserProgress): Map<string, boolean> {
    const latest = new Map<string, boolean>();
    for (const a of progress.attemptHistory) latest.set(a.questionId, a.isCorrect);
    return latest;
  }

  /**
   * Drain queue size — the single source of truth shared by the reviews-first
   * gate (hasPendingDrain) and the UI pill (getReviewStatus.drainQueueCount),
   * so the two can never disagree. Membership is one rule:
   *   topic mastered (sticky) AND isDrainCard AND (latest attempt wrong OR
   *   due by its spacing interval).
   * A failed drain card therefore stays in the queue — regardless of how many
   * other questions were answered since — until it is answered correctly: the
   * count genuinely HOLDS on a miss and falls by one per correct answer.
   * Because mastery is sticky, a rough session can never demote a topic and
   * silently drop its other due cards from the queue.
   * Topics retired by supersession (getRetiredDrainTopics) are excluded: once
   * the superseding section is finished, their cards never re-enter the queue.
   */
  static countPendingDrain(
    pool: Question[],
    topicToQs: Map<string, Question[]>,
    progress: UserProgress,
    cardDifficulty: Record<string, number> = {},
  ): number {
    const retired = this.getRetiredDrainTopics(topicToQs, progress);
    const latest = this.latestCorrectness(progress);
    const now = Date.now();
    let count = 0;
    for (const q of pool) {
      if (!this.isDrainCard(q) || retired.has(q.topic)) continue;
      const latestCorrect = latest.get(q.id);
      if (latestCorrect === undefined) continue; // never attempted
      const tq = topicToQs.get(q.topic);
      if (!tq || !this.isTopicMastered(progress, tq)) continue;
      if (latestCorrect === false) { count++; continue; } // failed → held until answered right
      const last = progress.lastAttempt.get(q.id) ?? 0;
      const daysSince = last > 0 ? (now - last) / MS_PER_DAY : Infinity;
      if (daysSince >= this.getEffectiveInterval(q.id, progress, cardDifficulty)) {
        count++; // mastered + due
      }
    }
    return count;
  }

  /**
   * Reviews-first drain gate: true iff a card is still in the drain queue.
   * Delegates to countPendingDrain — see its docstring for queue membership.
   */
  static hasPendingDrain(
    pool: Question[],
    topicToQs: Map<string, Question[]>,
    progress: UserProgress,
    cardDifficulty: Record<string, number> = {},
  ): boolean {
    return this.countPendingDrain(pool, topicToQs, progress, cardDifficulty) > 0;
  }

  /**
   * Pick a mastered question to resurface. Selection is SPACED-REPETITION
   * principled, NOT random across topics: each candidate is scored by how
   * overdue it is relative to its own spacing interval, with a difficulty
   * weight layered on so high-level (ADVANCED) questions are favoured among
   * candidates of comparable due-ness.
   *
   *   dueRatio  = daysSinceLastReview / targetInterval(correctStreak)
   *               (the spacing curve: 1, 3, 7, 14, 30, 60, 120 days)
   *   weight    = max(dueRatio, ε) * difficultyWeight
   *
   * dueRatio > 1 means the question is past its scheduled review and dominates;
   * when nothing is strictly overdue, the largest daysSinceLastReview still
   * floats up — so the FALLBACK is naturally "review the least-recently-seen
   * first." If every candidate scores ~0 (all just reviewed), we fall back
   * explicitly to the least-recently-reviewed question.
   *
   * Returns null when the pool has no mastered-topic questions, so the caller
   * can fall through to normal (also SR-driven) selection. Weighted sampling
   * (rather than a hard advanced-only filter) keeps mastered topics that lack
   * advanced cards in rotation via their intermediate/beginner questions.
   */
  static pickMasteredResurface(
    pool: Question[],
    topicToQs: Map<string, Question[]>,
    progress: UserProgress,
    filter?: (q: Question) => boolean,
    cardDifficulty: Record<string, number> = {},
  ): Question | null {
    const masteredPool = pool.filter(q => {
      if (filter && !filter(q)) return false;
      const tq = topicToQs.get(q.topic);
      return tq ? this.isTopicMastered(progress, tq) : false;
    });
    if (masteredPool.length === 0) return null;

    const now = Date.now();
    const diffWeight = (d: Difficulty): number =>
      d === Difficulty.ADVANCED ? MASTERED_ADV_WEIGHT
      : d === Difficulty.INTERMEDIATE ? MASTERED_INT_WEIGHT
      : MASTERED_BEGINNER_WEIGHT;

    const scored = masteredPool.map(q => {
      // O(1) last-review timestamp (0 if somehow untimestamped).
      const last = progress.lastAttempt.get(q.id) ?? 0;
      // Never-timestamped → treat as maximally due. Otherwise convert the gap
      // to a spacing ratio against the question's current interval.
      const daysSince = last > 0 ? (now - last) / MS_PER_DAY : Infinity;
      const target = this.getEffectiveInterval(q.id, progress, cardDifficulty);
      const dueRatio = daysSince / target;
      return { q, last, weight: Math.max(dueRatio, 1e-6) * diffWeight(q.difficulty) };
    });

    const total = scored.reduce((s, c) => s + (Number.isFinite(c.weight) ? c.weight : 0), 0);
    // Degenerate (everything just reviewed, or a never-timestamped Infinity):
    // fall back to the least-recently-reviewed question outright.
    const infinite = scored.find(c => !Number.isFinite(c.weight));
    if (infinite) return infinite.q;
    if (total <= 0) {
      return [...scored].sort((a, b) => a.last - b.last)[0].q;
    }

    let roll = Math.random() * total;
    for (const c of scored) {
      roll -= c.weight;
      if (roll <= 0) return c.q;
    }
    return scored[scored.length - 1].q;
  }

  /**
   * Lightweight, read-only snapshot of what selectNextQuestion is currently
   * doing — for a UI mode indicator. Mirrors the same drain-first logic:
   *   - `drain`  : a mastered-topic CODING+ADVANCED backlog is due (anywhere,
   *                mid-topic included) → the hard gate is active.
   *   - `new`    : not draining and unseen content remains → learning a topic.
   *   - `review` : not draining and everything is seen → caught-up review.
   * `drainQueueCount` is the drain queue size = exactly the cards the drain
   * serves (see countPendingDrain): mastered-topic cards that are due, plus the
   * one card you're retrying after a miss. Get one right → it leaves → count − 1;
   * get one wrong → it's held (retried until right). Reaches 0 as the backlog clears.
   */
  static getReviewStatus(
    questions: Question[],
    progress: UserProgress,
    policy?: SelectionPolicy,
    cardDifficulty: Record<string, number> = {},
  ): { mode: 'drain' | 'new' | 'review'; drainQueueCount: number } {
    if (questions.length === 0) return { mode: 'review', drainQueueCount: 0 };

    // Same unlock-filtered pool the selector serves from, so the pill can
    // never count a card selectNextQuestion is unable to serve (a locked
    // section's due card would otherwise be an undrainable drain count).
    const unlockedTopics = this.getUnlockedTopics(questions, progress);
    const pool = unlockedTopics
      ? questions.filter(q => unlockedTopics.has(q.topic))
      : questions;
    if (pool.length === 0) return { mode: 'review', drainQueueCount: 0 };

    const topicToQs = new Map<string, Question[]>();
    for (const q of pool) {
      const arr = topicToQs.get(q.topic) ?? [];
      arr.push(q);
      topicToQs.set(q.topic, arr);
    }

    // Drain queue = exactly the cards the drain SERVES (countPendingDrain is
    // the shared source of truth with the hasPendingDrain gate): drains by one
    // per correct answer, HOLDS on a miss, reaches zero as the backlog clears.
    // Reviews-first: any pending drain card puts the selector in drain mode,
    // even while a topic is mid-learning.
    const drainQueueCount = this.countPendingDrain(pool, topicToQs, progress, cardDifficulty);

    const hasUnseen = pool.some(q => !progress.questionsAttempted.has(q.id));
    const mode = drainQueueCount > 0 ? 'drain' : hasUnseen ? 'new' : 'review';
    return { mode, drainQueueCount };
  }

  /**
   * Within-topic difficulty gate. Returns true iff a new question of the given
   * difficulty in this topic should be served right now. Beginner is always
   * unlocked. Intermediate requires every beginner in the topic to be
   * attempted and the latest-correct percentage among beginners to reach
   * IN_TOPIC_DIFFICULTY_GATE_PCT. Advanced requires the same of intermediate.
   * Stops the failure-then-harder-question loop where a beginner miss is
   * immediately followed by intermediate/advanced material on the same
   * primitive.
   */
  static isDifficultyUnlockedInTopic(
    topicQuestions: Question[],
    progress: UserProgress,
    difficulty: Difficulty,
  ): boolean {
    if (difficulty === Difficulty.BEGINNER) return true;

    const prereq = difficulty === Difficulty.INTERMEDIATE
      ? Difficulty.BEGINNER
      : Difficulty.INTERMEDIATE;
    const prereqQs = topicQuestions.filter(q => q.difficulty === prereq);
    if (prereqQs.length === 0) return true; // nothing to gate on
    const prereqIds = new Set(prereqQs.map(q => q.id));

    const latest = new Map<string, boolean>();
    for (const a of progress.attemptHistory) {
      if (prereqIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
    }
    // Full prereq coverage required before any unlock.
    if (latest.size < prereqQs.length) return false;
    let correct = 0;
    latest.forEach(isCorrect => { if (isCorrect) correct++; });
    return pct(correct, latest.size) >= IN_TOPIC_DIFFICULTY_GATE_PCT;
  }

  static calculatePriority(
    questionId: string,
    progress: UserProgress,
    question: Question,
    topicQuestions?: Question[],
    activeTopic?: string | null,
  ): number {
    const attempts = progress.attemptHistory.filter(a => a.questionId === questionId);

    if (attempts.length === 0) {
      // New question - high priority
      return 100;
    }

    const recent = recentAttempts(attempts, TOPIC_RECENT_WINDOW);
    const incorrectCount = recent.filter(a => !a.isCorrect).length;
    const lastAttempt = Math.max(...attempts.map(a => a.timestamp));
    const daysSinceLastAttempt = (Date.now() - lastAttempt) / (1000 * 60 * 60 * 24);

    // Struggle detection: first attempt was wrong
    const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
    const firstAttemptWrong = !sorted[0].isCorrect;
    const totalFailures = attempts.filter(a => !a.isCorrect).length;

    // Base score starts at 0
    let score = 0;

    score += incorrectCount * INCORRECT_PRIORITY_WEIGHT;

    // Struggle bonus: questions you failed on first try need more practice
    // But cap it so it doesn't dominate forever
    if (firstAttemptWrong && totalFailures >= 2) {
      score += Math.min(totalFailures * 10, 40); // max +40 for struggled questions
    }

    // Increase priority based on time passed
    // Questions should repeat: 1 day, 3 days, 7 days, 14 days, 30 days
    if (incorrectCount === 0) {
      // Correct answers - spaced repetition intervals
      const correctStreak = this.getCorrectStreak(questionId, progress);
      const targetInterval = this.getTargetInterval(correctStreak);

      if (daysSinceLastAttempt >= targetInterval) {
        // Due for review, but reduce priority for well-mastered questions
        const masteryDampen = correctStreak >= MASTERY_EXPERT_STREAK ? 0.3
          : correctStreak >= MASTERY_PROFICIENT_STREAK ? 0.6
          : 1.0;
        score += 50 * masteryDampen;
      } else {
        score += (daysSinceLastAttempt / targetInterval) * 30;
      }
    } else {
      // Incorrect answers - review sooner
      if (daysSinceLastAttempt >= 1) {
        score += 70; // Review after 1 day
      } else {
        score += daysSinceLastAttempt * 40;
      }
    }

    // Difficulty modifier (harder questions get slightly more weight)
    const difficultyWeight = {
      [Difficulty.BEGINNER]: 0,
      [Difficulty.INTERMEDIATE]: 5,
      [Difficulty.ADVANCED]: 10,
    };
    score += difficultyWeight[question.difficulty];

    // Never seen questions get highest priority
    if (!progress.questionsAttempted.has(questionId)) {
      score += 200;
    }

    // Unlock-blocker boost: dominates once a topic has full coverage, so the
    // learner isn't stuck recycling mastered questions from earlier sections
    // while a handful of latest-wrong questions keep the gate shut.
    if (topicQuestions && this.isUnlockBlocker(questionId, progress, topicQuestions)) {
      score += UNLOCK_BLOCKER_BOOST;
    }

    // Topic-review boost: covered-but-not-mastered topics keep cycling —
    // catches shallow-streak latest-correct questions that the unlock-blocker
    // gate misses.
    if (topicQuestions && this.isTopicInReview(progress, topicQuestions)) {
      score += TOPIC_REVIEW_BOOST;
    }

    // Latest-wrong + active-topic boosts. These fire independent of topic
    // coverage so failures inside an in-progress topic get prioritised
    // immediately, not only after the topic is fully covered. Recency
    // multiplier ensures the just-failed question always wins a tie-break
    // against older in-topic failures (Anki-style "Again").
    const latestWrong = !sorted[sorted.length - 1].isCorrect;
    if (latestWrong) {
      score += LATEST_WRONG_BOOST;
      if (activeTopic && question.topic === activeTopic) {
        let attemptsAgo = Infinity;
        for (let i = progress.attemptHistory.length - 1; i >= 0; i--) {
          if (progress.attemptHistory[i].questionId === questionId) {
            attemptsAgo = progress.attemptHistory.length - 1 - i;
            break;
          }
        }
        const recencyMult = attemptsAgo === 0 ? 1.5
          : attemptsAgo < RECENT_LAPSE_WINDOW ? 1.0
          : 0.7;
        score += ACTIVE_TOPIC_FAILURE_BOOST * recencyMult;
      }
    }

    return score;
  }

  /**
   * Get the current streak of correct answers for a question
   */
  static getCorrectStreak(questionId: string, progress: UserProgress): number {
    const attempts = progress.attemptHistory
      .filter(a => a.questionId === questionId)
      .sort((a, b) => b.timestamp - a.timestamp); // Most recent first

    let streak = 0;
    for (const attempt of attempts) {
      if (attempt.isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  /**
   * Get target interval in days based on correct streak
   * Implements spaced repetition: 1, 3, 7, 14, 30 days
   */
  static getTargetInterval(streak: number): number {
    const intervals = [1, 3, 7, 14, 30, 60, 120];
    return intervals[Math.min(streak, intervals.length - 1)];
  }

  /**
   * Drain due interval = the streak interval scaled by the card's auto-graded
   * FSRS difficulty (easeFactor): a HARD card comes back sooner, an EASY card
   * later (symmetric). A card with no recorded difficulty → factor 1.0 → the
   * plain streak interval (legacy/untagged unaffected). Used by every DRAIN
   * due-check so a topic you struggled with re-enters the drain sooner.
   */
  static getEffectiveInterval(
    questionId: string,
    progress: UserProgress,
    cardDifficulty: Record<string, number> = {},
  ): number {
    return this.getTargetInterval(this.getCorrectStreak(questionId, progress))
      * easeFactor(cardDifficulty[questionId] ?? 0);
  }

  /**
   * Roll a topic's per-card FSRS difficulties up to a single label for the UI.
   * Averages the difficulty of the topic's DRAIN cards that actually have a
   * recorded difficulty (>0); cards never answered under the difficulty code
   * (D=0) are skipped so the label reflects real signal. Returns null when the
   * topic has no graded drain cards (so the UI shows nothing). FSRS D∈[1..10].
   */
  static getTopicDifficulty(
    topicQuestions: Question[],
    cardDifficulty: Record<string, number>,
  ): { label: 'easy' | 'medium' | 'hard'; avg: number } | null {
    const ds = topicQuestions
      .filter(q => this.isDrainCard(q))
      .map(q => cardDifficulty[q.id] ?? 0)
      .filter(d => d > 0);
    if (ds.length === 0) return null;
    const avg = ds.reduce((s, d) => s + d, 0) / ds.length;
    return { avg, label: avg < 4 ? 'easy' : avg > 7 ? 'hard' : 'medium' };
  }

  /**
   * How many review cards are DUE in a single topic, for the breadcrumb pill's
   * count. Scoped to the current topic (not the global drain backlog): 0 until
   * the topic is mastered, then it rises as that topic's cards age past their
   * (difficulty-scaled) review interval. A topic still being learned/in-review
   * is not mastered → 0, so the badge stays hidden while you work through new
   * material and only appears once a finished topic actually has reviews due.
   */
  static getTopicDueReviewCount(
    topicQuestions: Question[],
    progress: UserProgress,
    cardDifficulty: Record<string, number> = {},
  ): number {
    if (topicQuestions.length === 0) return 0;
    if (!this.isTopicMastered(progress, topicQuestions)) return 0;
    const now = Date.now();
    let n = 0;
    for (const q of topicQuestions) {
      const last = progress.lastAttempt.get(q.id) ?? 0;
      if (last > 0
        && (now - last) / MS_PER_DAY >= this.getEffectiveInterval(q.id, progress, cardDifficulty)) {
        n++;
      }
    }
    return n;
  }

  /**
   * Compute recent accuracy per topic (last 10 attempts in each topic).
   * Returns a map of topic -> { correct, total, pct }.
   */
  static getTopicProficiency(
    questions: Question[],
    progress: UserProgress
  ): Map<string, { correct: number; total: number; pct: number }> {
    // Build questionId -> topic map
    const qTopicMap = new Map<string, string>();
    questions.forEach(q => qTopicMap.set(q.id, q.topic));

    // Group attempts by topic, keeping chronological order
    const byTopic = new Map<string, { isCorrect: boolean }[]>();
    for (const a of progress.attemptHistory) {
      const topic = qTopicMap.get(a.questionId);
      if (!topic) continue;
      const arr = byTopic.get(topic) || [];
      arr.push({ isCorrect: a.isCorrect });
      byTopic.set(topic, arr);
    }

    const result = new Map<string, { correct: number; total: number; pct: number }>();
    byTopic.forEach((attempts, topic) => {
      const recent = recentAttempts(attempts, TOPIC_RECENT_WINDOW);
      const correct = recent.filter(a => a.isCorrect).length;
      const total = recent.length;
      result.set(topic, { correct, total, pct: pct(correct, total) });
    });

    return result;
  }

  /**
   * Select next question based on spaced repetition algorithm
   * with topic diversity, review mixing, and proficiency-based deprioritization.
   *
   * Strategy:
   * - Topics at 90%+ accuracy (with 10+ attempts) are "mastered" and rarely shown
   * - ~30% of the time: pick a review question from weaker topics
   * - ~70% of the time: pick a new or high-priority question
   * - Always diversify across topics (no same-topic back-to-back)
   */
  /**
   * Determine which sections are unlocked for a gated course.
   * A section unlocks only when the previous section has:
   *   - UNLOCK_COVERAGE_PCT coverage (every question attempted at least once), AND
   *   - > UNLOCK_ACCURACY_PCT accuracy over the last RECENT_WINDOW attempts in that section.
   * Returns section names (not topic keys) + the ordered path for the course.
   */
  static getUnlockedSections(
    questions: Question[],
    progress: UserProgress
  ): { sections: Set<string>; pathOrder: string[] } | null {
    if (questions.length === 0) return null;
    const firstQ = questions[0];
    const course = getCourseForTopic(firstQ.topic);

    const pathOrder = course === Course.WEB_DEV ? WEBDEV_PATH_ORDER
      : course === Course.BACKEND ? BACKEND_PATH_ORDER
      : course === Course.DATABRICKS ? DATABRICKS_PATH_ORDER
      : course === Course.DATA_ENGINEERING ? DATA_ENG_PATH_ORDER
      : course === Course.SQL ? SQL_PATH_ORDER
      : null;
    if (!pathOrder) return null;

    const sections = new Set<string>();

    // DEV preview: unlock every section (see isDevUnlockAll).
    if (isDevUnlockAll()) {
      pathOrder.forEach(s => sections.add(s));
      return { sections, pathOrder };
    }

    for (let i = 0; i < pathOrder.length; i++) {
      const sectionName = pathOrder[i];
      if (i === 0) {
        sections.add(sectionName);
        continue;
      }
      const prevKeys = getTopicKeysForSection(pathOrder[i - 1]);
      if (isMastered(prevKeys, questions, progress)) {
        sections.add(sectionName);
      } else {
        break;
      }
    }

    return { sections, pathOrder };
  }

  /**
   * Returns the set of topic keys the learner is currently allowed to practise.
   * Applies BOTH section-level gating (via getUnlockedSections) AND topic-level
   * gating within each unlocked section: each unit unlocks only after the
   * previous unit in the same section is mastered.
   */
  static getUnlockedTopics(
    questions: Question[],
    progress: UserProgress
  ): Set<string> | null {
    const result = this.getUnlockedSections(questions, progress);
    if (!result) return null;

    const topics = new Set<string>();

    // DEV preview: unlock every topic in every (already-unlocked) section,
    // bypassing unit-by-unit gating (see isDevUnlockAll).
    if (isDevUnlockAll()) {
      result.sections.forEach(sectionName => {
        getSectionUnits(sectionName).forEach(([, topicKeys]) =>
          topicKeys.forEach(t => topics.add(t)));
      });
      return topics;
    }

    result.sections.forEach(sectionName => {
      const units = getSectionUnits(sectionName);
      for (let i = 0; i < units.length; i++) {
        const [, topicKeys] = units[i];
        if (i === 0) {
          topicKeys.forEach(t => topics.add(t));
          continue;
        }
        const [, prevKeys] = units[i - 1];
        if (isMastered(prevKeys, questions, progress)) {
          topicKeys.forEach(t => topics.add(t));
        } else {
          break; // cascade lock remaining units in this section
        }
      }
    });
    return topics;
  }

  static selectNextQuestion(
    questions: Question[],
    progress: UserProgress,
    conceptCtx?: ConceptSelectionContext,
    policy?: SelectionPolicy,
    cardDifficulty: Record<string, number> = {},
  ): Question | null {
    if (questions.length === 0) return null;

    // Apply path gating — filter to only unlocked section topics
    const unlockedTopics = this.getUnlockedTopics(questions, progress);
    const availableQuestions = unlockedTopics
      ? questions.filter(q => unlockedTopics.has(q.topic))
      : questions;

    // No unlocked questions — return null instead of a wrong-course leak. The
    // old `return questions[0]` could surface a question from another course
    // if the input pool happened to contain one.
    if (availableQuestions.length === 0) return null;

    // Sort available questions by progressive topic order, then by difficulty
    // within each topic so newQuestions[0] is always the easiest next step —
    // e.g. "what is async?" MCQ before the advanced aiohttp+gather cliff.
    const topicOrder = policy
      ? policy.topicOrder
      : getTopicOrder(getCourseForTopic(availableQuestions[0].topic));
    const topicIndex = new Map(topicOrder.map((t, i) => [t, i]));

    const difficultyIndex: Record<string, number> = {
      [Difficulty.BEGINNER]: 0,
      [Difficulty.INTERMEDIATE]: 1,
      [Difficulty.ADVANCED]: 2,
    };

    // Within the same (topic, difficulty), order by cognitive load: recognition
    // → trace → reorder → fill-in → cold writing. Mirrors the "worked → faded
    // → cold" progression in HOW_TO_CONSTRUCT_TOPIC.md so the learner sees
    // Parsons/Cloze before being asked to write a CODING question from scratch.
    const typeIndex: Record<string, number> = {
      [QuestionType.MULTIPLE_CHOICE]: 0,
      [QuestionType.PREDICT_OUTPUT]: 1,
      [QuestionType.PARSONS]: 2,
      [QuestionType.CLOZE_CODE]: 3,
      [QuestionType.CODING]: 4,
    };

    const sortedAvailable = [...availableQuestions].sort((a, b) => {
      const aTopic = topicIndex.get(a.topic) ?? 999;
      const bTopic = topicIndex.get(b.topic) ?? 999;
      if (aTopic !== bTopic) return aTopic - bTopic;
      const aDiff = difficultyIndex[a.difficulty] ?? 99;
      const bDiff = difficultyIndex[b.difficulty] ?? 99;
      if (aDiff !== bDiff) return aDiff - bDiff;
      const aType = typeIndex[a.type] ?? 99;
      const bType = typeIndex[b.type] ?? 99;
      return aType - bType;
      // Equal topic + difficulty + type → original array order preserved (stable sort)
    });

    // Separate new (unseen) vs review (already seen) questions
    const newQuestions = sortedAvailable.filter(q => !progress.questionsAttempted.has(q.id));
    const reviewQuestions = sortedAvailable.filter(q => progress.questionsAttempted.has(q.id));

    // Group by topic once. Hoisted above the new/review decision so the
    // completion-push guard, the difficulty gate, and the priority scorer
    // can all reuse it without rescanning.
    const topicToQs = new Map<string, Question[]>();
    for (const q of availableQuestions) {
      const arr = topicToQs.get(q.topic) ?? [];
      arr.push(q);
      topicToQs.set(q.topic, arr);
    }

    // Active topic = topic of the most recent attempt overall. Anchor for
    // the active-topic failure boost and the completion-push guard. Falls
    // back to null when the last attempt's question isn't in the current
    // pool (e.g. the user changed filters since their last answer) — in that
    // case the boost simply doesn't fire.
    const activeTopic = this.getLastAttemptedTopic(progress, questions);
    const lastAttempt = progress.attemptHistory.length > 0
      ? progress.attemptHistory[progress.attemptHistory.length - 1]
      : null;
    const lastAttemptWrong = lastAttempt !== null && !lastAttempt.isCorrect;

    // Find the first new question whose (topic, difficulty) passes the
    // within-topic difficulty gate. Beginner always passes; intermediate and
    // advanced require the prereq difficulty in the SAME topic to reach
    // IN_TOPIC_DIFFICULTY_GATE_PCT latest-correct. If the gate blocks the
    // earliest unlocked topic but a later topic has a passing candidate, we
    // still prefer the gated topic (return null and fall through to review)
    // so the user is forced to clean up before progressing — anything else
    // re-creates the "directly jump in difficulty" complaint at the topic
    // boundary instead.
    // Also surface the relief-trickle candidate: the lead topic's earliest
    // unseen question when the gate blocks ALL of them (i.e. every beginner is
    // seen but accuracy is below IN_TOPIC_DIFFICULTY_GATE_PCT, so only gated
    // intermediate/advanced remain). gateBlockedNew is non-null ONLY in that
    // deadlock state — while beginners remain unseen, newQuestions[0] is a
    // beginner, the gate passes, and gateBlockedNew stays null.
    const { unlockedNew: firstUnlockedNew, gateBlockedNew } = (() => {
      if (newQuestions.length === 0) return { unlockedNew: null, gateBlockedNew: null };
      const leadTopic = newQuestions[0].topic;
      for (const q of newQuestions) {
        if (q.topic !== leadTopic) break; // moved past the active topic — fall through
        const tq = topicToQs.get(q.topic);
        if (!tq) continue;
        if (this.isDifficultyUnlockedInTopic(tq, progress, q.difficulty)) {
          return { unlockedNew: q, gateBlockedNew: null };
        }
      }
      // Nothing in the lead topic passes the gate → its earliest unseen
      // question (the next difficulty) becomes the relief-trickle candidate.
      return { unlockedNew: null, gateBlockedNew: newQuestions[0] };
    })();

    // New-topic onboarding gate: true while the lead topic still has a servable
    // unseen question (first exposure to its primitives). During onboarding the
    // due-driven mastered resurface is reduced (not off) so the new material
    // gets focused practice; the gate lifts once every question in the topic has
    // been seen once (firstUnlockedNew becomes null) — or when the difficulty
    // gate walls off all new content (the learner must consolidate) — and full
    // due-driven review resumes.
    const inOnboarding = firstUnlockedNew !== null;

    // leadTopic/leadStarted feed the onboarding reduced-rate (dueProb) below.
    const leadTopic = firstUnlockedNew ? firstUnlockedNew.topic : null;
    const leadStarted = leadTopic
      ? (topicToQs.get(leadTopic) ?? []).some(q => progress.questionsAttempted.has(q.id))
      : false;

    // Reviews-first hard drain (Anki-style). Recall on already-learned topics
    // outranks new material: whenever ANY mastered-topic CODING+ADVANCED card
    // is due — mid-topic included, not just at a topic boundary — hard-gate new
    // content (newProb 0 below) and drain the due backlog (isDrainCard) first.
    // Due beginner/intermediate MCQs deliberately do NOT trip the gate: they
    // recur naturally inside later topics and keep the reduced-rate onboarding
    // resurface below, so a few days away never buries the learner in forced
    // MCQ review before they can continue. Trigger off reviewQuestions
    // (uncooled) so the gate reflects the true due set, not a REVIEW_COOLDOWN gap.
    // The gate stays closed while ANY drain card is still pending — due, OR
    // failed (latest attempt wrong) and not yet re-mastered. hasPendingDrain
    // mirrors getReviewStatus's count exactly, so the pill and the gate never
    // disagree, and a missed card keeps new content hard-gated (the drain does
    // not "leak" a new question on a wrong answer) until it's answered right.
    const drainDueReviews =
      this.hasPendingDrain(reviewQuestions, topicToQs, progress, cardDifficulty);

    // ── DECISION: New content or reinforcement? ──
    // Normally: 70% new (sequential), 30% review.
    // After a failure: 15% new, 85% review — the recent-failure pivot. Forces
    // the next pick to surface the failure (or another in-topic latest-wrong)
    // before the user is allowed to advance into more material.
    // Near the end of the unlocked pool (≤ COMPLETION_PUSH_THRESHOLD unseen
    // remaining): always serve new — UNLESS the active topic still has
    // unresolved latest-wrong questions, in which case the user gets pushed
    // past their failures right at topic completion. Keep the review mix
    // alive until they're genuinely clean.
    //
    // CRITICAL: this decision MUST run before any concept-aware bucketing.
    // Concept-aware sampling ignores typeIndex and produces near-random within-
    // topic order, which defeats the worked-→-faded-→-cold ramp the user is
    // supposed to walk through on first contact with a topic. New picks go
    // through legacy type-sort here; concept-aware only sees the review pool
    // below — which is where bucket-driven scheduling actually earns its keep.
    const activeTopicHasLatestWrong = (() => {
      if (!activeTopic) return false;
      const tq = topicToQs.get(activeTopic);
      if (!tq) return false;
      const tqIds = new Set(tq.map(q => q.id));
      const latest = new Map<string, boolean>();
      for (const a of progress.attemptHistory) {
        if (tqIds.has(a.questionId)) latest.set(a.questionId, a.isCorrect);
      }
      let hasWrong = false;
      latest.forEach(isCorrect => { if (!isCorrect) hasWrong = true; });
      return hasWrong;
    })();
    const completionPush = firstUnlockedNew !== null
      && newQuestions.length <= COMPLETION_PUSH_THRESHOLD
      && !activeTopicHasLatestWrong;
    // Precedence: the reviews-first drain hard-gates new content (0) FIRST —
    // even on a fresh failure — so a missed drain card re-surfaces (via the
    // latest-wrong priority path) instead of leaking a new question through the
    // gate. Otherwise a fresh failure pivots to review; otherwise completion-
    // push; otherwise the default split.
    const newProb = drainDueReviews ? 0
      : lastAttemptWrong ? REVIEW_AFTER_FAIL_PROB
      : completionPush ? 1
      : NEW_QUESTION_PROBABILITY;
    if (firstUnlockedNew !== null && Math.random() < newProb) {
      return firstUnlockedNew;
    }

    // Relief trickle — see GATE_RELIEF_PROB. Only when the gate blocked all new
    // picks in the lead topic AND the last answer was correct. A failure still
    // routes to review (gated on !lastAttemptWrong so a fresh miss never
    // trickles forward). Guarantees forward motion never fully stops even while
    // the user is below the difficulty-gate accuracy bar. Suppressed during a
    // drain so a gated new card can't leak past the hard gate.
    if (firstUnlockedNew === null && gateBlockedNew !== null && !drainDueReviews
        && !lastAttemptWrong && Math.random() < GATE_RELIEF_PROB) {
      return gateBlockedNew;
    }

    // ── REINFORCEMENT: Recycle seen questions, biased toward incorrect ones ──

    if (reviewQuestions.length === 0) {
      // Nothing to review yet — prefer the gate-passing pick; fall back to
      // the raw next-new (and finally any available question) only when the
      // gate has no candidate at all.
      return firstUnlockedNew ?? (newQuestions.length > 0 ? newQuestions[0] : sortedAvailable[0]);
    }

    // Cooldown: avoid re-serving a question shown in the last REVIEW_COOLDOWN
    // attempts, unless the pool has nothing else. Exemption: when the very
    // last attempt was wrong, that question is allowed back into the pool
    // immediately — otherwise the recent-failure pivot (above) would route
    // to a review path that explicitly excludes the failure we want to
    // surface. Other cooldown entries stay cool so we don't slam the user
    // with the question right before the failure.
    // Computed BEFORE the concept-aware call so the mastered-resurface roll
    // below can exclude just-seen cards too.
    const recentIds = new Set(
      recentAttempts(progress.attemptHistory, REVIEW_COOLDOWN).map(a => a.questionId),
    );
    if (lastAttemptWrong && lastAttempt) recentIds.delete(lastAttempt.questionId);
    const cooled = reviewQuestions.filter(q => !recentIds.has(q.id));
    const reviewPool = cooled.length > 0 ? cooled : reviewQuestions;

    // Mastered resurface (due-driven, Anki-style). Runs BEFORE the concept-aware
    // call so its DUE/IDLE buckets can't starve high-stability advanced mastered
    // cards (which concept-aware parks in IDLE for ~30 days). Selection inside
    // pickMasteredResurface is SR-driven (spacing/due-ratio, least-recently-
    // reviewed fallback) and advanced-weighted — never random across topics.
    if (!lastAttemptWrong) {
      // Defer to current progress ONLY when the learner is genuinely STUCK:
      // a covered topic is still in review (isTopicInReview — covered but < 95%,
      // which also captures its unlock blockers) AND there is no servable new
      // content (!inOnboarding). In that state the only way forward is to clear
      // those blockers, so let the priority path surface them rather than
      // draining old mastered reviews. While new content is still flowing
      // (inOnboarding), blockers get the priority path's review share and the
      // due-mastered resurface still runs at the reduced onboarding rate — so a
      // topic mastered earlier (e.g. threading) keeps resurfacing for retention
      // instead of being suppressed for the whole rest of the course.
      // Mastered topics are excluded: their cleanup flows through the drain
      // now, so only a covered-but-NEVER-mastered topic (a genuine unlock
      // blocker) should divert slots away from due reviews.
      const consolidationPending = !inOnboarding && Array.from(topicToQs.values())
        .some(tq => this.isTopicInReview(progress, tq)
          && !this.isTopicMastered(progress, tq));
      if (!consolidationPending) {
        // During a drain, restrict the queue to exactly countPendingDrain's
        // membership - CODING+ADVANCED cards that are latest-wrong OR past
        // their spacing interval - so the gate, the pill, and the served card
        // can never disagree, and every served card decrements the visible
        // count by exactly one. Supersession-retired topics are excluded for
        // the same reason. The lighter onboarding-trickle and caught-up floor
        // stay all-types (drainPred undefined).
        const retiredDrainTopics = drainDueReviews
          ? this.getRetiredDrainTopics(topicToQs, progress)
          : null;
        const latestForDrain = drainDueReviews
          ? this.latestCorrectness(progress)
          : null;
        const drainPred = drainDueReviews
          ? (q: Question): boolean => {
              if (!SpacedRepetitionSystem.isDrainCard(q)) return false;
              if (retiredDrainTopics && retiredDrainTopics.has(q.topic)) return false;
              if (latestForDrain && latestForDrain.get(q.id) === false) return true; // failed → back until cleared
              const lastTs = progress.lastAttempt.get(q.id) ?? 0;
              if (lastTs === 0) return true; // never timestamped → maximally due
              const daysSince = (Date.now() - lastTs) / MS_PER_DAY;
              return daysSince >= this.getEffectiveInterval(q.id, progress, cardDifficulty);
            }
          : undefined;
        if (this.hasDueMastered(reviewPool, topicToQs, progress, drainPred, cardDifficulty)) {
          // Due cards surface whenever due. Reduced (not off) ONLY while mid-
          // onboarding a started topic; full rate (1) when caught up or draining
          // the due queue at a topic boundary.
          const dueProb = (inOnboarding && leadStarted && !drainDueReviews)
            ? ONBOARDING_DUE_RESURFACE_PROB : 1;
          if (Math.random() < dueProb) {
            const pick = this.pickMasteredResurface(reviewPool, topicToQs, progress, drainPred, cardDifficulty);
            if (pick) return pick;
          }
        } else if (!inOnboarding && Math.random() < MASTERED_RESURFACE_FLOOR_FRACTION) {
          // Nothing strictly due and not onboarding → light desirable-difficulty
          // interleave of not-yet-due mastered cards (advanced-weighted).
          const pick = this.pickMasteredResurface(reviewPool, topicToQs, progress, undefined, cardDifficulty);
          if (pick) return pick;
        }
      }
    }

    // Concept-aware path runs against the REVIEW pool only. Pass full
    // availableQuestions for topic grouping so the unlock-blocker check still
    // sees uncovered cards in a half-done topic and doesn't fire prematurely.
    // When policy.useConceptSRS is false (e.g. Data Engineering — no concept
    // tags exist) we skip the bucketing pass entirely.
    const conceptSrsAllowed = policy ? policy.useConceptSRS : true;
    if (conceptCtx && conceptSrsAllowed) {
      const conceptPick = this.selectNextQuestionConceptAware(
        availableQuestions, progress, conceptCtx, reviewQuestions,
      );
      if (conceptPick) return conceptPick;
      // else fall through to legacy review math below
    }

    const scored = reviewPool.map(q => ({
      question: q,
      priority: this.calculatePriority(q.id, progress, q, topicToQs.get(q.topic), activeTopic),
    }));

    scored.sort((a, b) => b.priority - a.priority);

    const topCandidates = scored.slice(0, Math.min(CANDIDATE_POOL_SIZE, scored.length));
    const totalPriority = topCandidates.reduce((sum, c) => sum + c.priority, 0);
    if (totalPriority === 0) {
      return topCandidates[0].question;
    }

    let roll = Math.random() * totalPriority;
    for (const c of topCandidates) {
      roll -= c.priority;
      if (roll <= 0) return c.question;
    }

    return topCandidates[0].question;
  }

  /**
   * Concept-aware selection (CONCEPT_LAYER_SPEC.md § 3).
   * Buckets cards into DUE / FRINGE / SPOT_CHECK / IDLE and samples by share.
   * Returns null when no concept-tagged cards survive bucketing — caller
   * (selectNextQuestion) treats this as a signal to fall back to legacy.
   *
   * `candidates`, when provided, restricts which cards are eligible to be
   * picked (e.g. only review questions). The full `available` pool is still
   * used to build the per-topic question map so unlock-blocker detection
   * stays correct even when half the topic is unattempted.
   */
  private static selectNextQuestionConceptAware(
    available: Question[],
    progress: UserProgress,
    ctx: ConceptSelectionContext,
    candidates?: Question[],
  ): Question | null {
    const now = Date.now();
    const candidateIds = candidates
      ? new Set(candidates.map(q => q.id))
      : null;

    const topicToQs = new Map<string, Question[]>();
    for (const q of available) {
      const arr = topicToQs.get(q.topic) ?? [];
      arr.push(q);
      topicToQs.set(q.topic, arr);
    }

    // Cooldown: don't re-serve a card shown in the last REVIEW_COOLDOWN
    // attempts. Without this, small concept pools (e.g. a FRINGE concept with
    // only 2 tagged questions) can flip back to the just-answered card on the
    // very next pick — which to the user looks like the Next button is broken.
    // If excluding cooled cards drains the pool, we fall back to the full set.
    // Exemption: when the very last attempt was wrong, that question is
    // allowed back into the pool immediately so the DUE bucket can surface
    // it via the recent-failure pivot in the caller.
    const recentIds = new Set(
      recentAttempts(progress.attemptHistory, REVIEW_COOLDOWN).map(a => a.questionId),
    );
    const lastAttempt = progress.attemptHistory.length > 0
      ? progress.attemptHistory[progress.attemptHistory.length - 1]
      : null;
    if (lastAttempt && !lastAttempt.isCorrect) recentIds.delete(lastAttempt.questionId);

    type Bucketed = { q: Question; weight: number };
    const buckets: Record<CardBucket, Bucketed[]> = {
      DUE: [], FRINGE: [], SPOT_CHECK: [], IDLE: [],
    };
    const cooledBuckets: Record<CardBucket, Bucketed[]> = {
      DUE: [], FRINGE: [], SPOT_CHECK: [], IDLE: [],
    };

    for (const q of available) {
      const conceptIds = q.concepts ?? [];
      if (conceptIds.length === 0) continue; // untagged → handled by legacy
      if (candidateIds && !candidateIds.has(q.id)) continue; // not in eligible subset

      const lastReviewed = progress.lastAttempt.get(q.id) ?? 0;
      const elapsedDays = lastReviewed > 0 ? (now - lastReviewed) / MS_PER_DAY : 0;

      const bucket = bucketCard(conceptIds, ctx.progress, elapsedDays, ctx.betas, now);

      let weight = 1;
      if (bucket === 'DUE') {
        const r = getRetrievability(conceptIds, ctx.progress, elapsedDays);
        // 1−R measures how "due" the card is. Floor at a small positive value
        // so an unusual 0-weight card can still be picked.
        weight = Math.max(1 - (r ?? 0), 0.01);
        const topicQs = topicToQs.get(q.topic);
        if (topicQs && this.isUnlockBlocker(q.id, progress, topicQs)) {
          weight *= CONCEPT_UNLOCK_BLOCKER_WEIGHT_MULT;
        }
      }
      buckets[bucket].push({ q, weight });
      if (!recentIds.has(q.id)) {
        cooledBuckets[bucket].push({ q, weight });
      }
    }

    // Always use the cooled subset. If a bucket is left empty because every
    // card in it is in cooldown, the bucket simply doesn't contribute to the
    // pick — let totalShare collapse to 0 and fall back to legacy. Per-bucket
    // fallback to the full set is what previously caused the just-answered
    // card to come right back when it was the only card in its bucket.
    for (const b of ['DUE', 'FRINGE', 'SPOT_CHECK', 'IDLE'] as CardBucket[]) {
      buckets[b] = cooledBuckets[b];
    }

    const dueShare = buckets.DUE.length > 0 ? DUE_PICK_FRACTION : 0;
    const fringeShare = buckets.FRINGE.length > 0 ? FRINGE_PICK_FRACTION : 0;
    const spotShare = buckets.SPOT_CHECK.length > 0 ? SPOT_CHECK_PICK_FRACTION : 0;
    const totalShare = dueShare + fringeShare + spotShare;
    if (totalShare === 0) return null;

    let bucketChoice: CardBucket;
    const roll = Math.random() * totalShare;
    if (roll < dueShare) bucketChoice = 'DUE';
    else if (roll < dueShare + fringeShare) bucketChoice = 'FRINGE';
    else bucketChoice = 'SPOT_CHECK';

    const pool = buckets[bucketChoice];
    if (pool.length === 0) return null;

    if (bucketChoice === 'DUE') {
      const totalW = pool.reduce((s, p) => s + p.weight, 0);
      let r = Math.random() * totalW;
      for (const p of pool) {
        r -= p.weight;
        if (r <= 0) return p.q;
      }
      return pool[pool.length - 1].q;
    }

    if (bucketChoice === 'FRINGE') {
      return pool[Math.floor(Math.random() * pool.length)].q;
    }

    // SPOT_CHECK fallback chain: easiest untouched → least-recently-seen → any.
    const untouched = pool.filter(p => !progress.questionsAttempted.has(p.q.id));
    const difficultyRank: Record<string, number> = {
      [Difficulty.BEGINNER]: 0,
      [Difficulty.INTERMEDIATE]: 1,
      [Difficulty.ADVANCED]: 2,
    };
    if (untouched.length > 0) {
      untouched.sort((a, b) =>
        (difficultyRank[a.q.difficulty] ?? 99) - (difficultyRank[b.q.difficulty] ?? 99));
      return untouched[0].q;
    }
    const sortedByLastSeen = [...pool].sort((a, b) => {
      const ta = progress.lastAttempt.get(a.q.id) ?? 0;
      const tb = progress.lastAttempt.get(b.q.id) ?? 0;
      return ta - tb;
    });
    return sortedByLastSeen[0].q;
  }

  /**
   * Get the topic of the most recently attempted question
   */
  private static getLastAttemptedTopic(
    progress: UserProgress,
    questions: Question[]
  ): string | null {
    if (progress.attemptHistory.length === 0) return null;
    const lastAttempt = progress.attemptHistory[progress.attemptHistory.length - 1];
    const q = questions.find(q => q.id === lastAttempt.questionId);
    return q?.topic ?? null;
  }

  /**
   * Get questions that need review (high priority)
   */
  static getReviewQueue(
    questions: Question[],
    progress: UserProgress,
    limit: number = 10
  ): Question[] {
    const topicToQs = new Map<string, Question[]>();
    for (const q of questions) {
      const arr = topicToQs.get(q.topic) ?? [];
      arr.push(q);
      topicToQs.set(q.topic, arr);
    }

    const questionScores = questions.map(q => ({
      question: q,
      priority: this.calculatePriority(q.id, progress, q, topicToQs.get(q.topic)),
    }));

    return questionScores
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit)
      .map(qs => qs.question);
  }

  /**
   * Record a question attempt
   */
  static recordAttempt(
    questionId: string,
    isCorrect: boolean,
    timeSpent: number,
    progress: UserProgress
  ): UserProgress {
    const attempt: QuestionAttempt = {
      questionId,
      timestamp: Date.now(),
      isCorrect,
      attempts: 1,
      timeSpent,
    };

    const newHistory = [...progress.attemptHistory, attempt];

    return {
      ...progress,
      attemptHistory: newHistory,
    };
  }
}
