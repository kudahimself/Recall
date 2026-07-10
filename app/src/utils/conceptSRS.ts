/**
 * Concept-keyed spaced repetition math.
 *
 * Pure functions only — no React, no localStorage, no globals. Everything
 * takes state in and returns deltas out. Testable in isolation.
 *
 * Implements:
 *  - PFA (Performance Factor Analysis) for mastery probability
 *  - FSRS-4 Difficulty/Stability/Retrievability for scheduling, but with
 *    stability keyed on (concept, user) instead of (card, user)
 *
 * See CONCEPT_LAYER_SPEC.md at repo root for the full design rationale.
 */
import { ConceptId } from './conceptRegistry';

// ─────────────────────────────────────────────────────────────────────────
// FSRS-4 weights (defaults from the published reference). Indexes:
//   w[0..3]  initial stability per grade (fail, hard, good, easy)
//   w[4..5]  initial difficulty params
//   w[6..7]  difficulty update params
//   w[8..10] success-stability update params
//   w[11..14] failure-stability update params
//   w[15]    hard-grade penalty multiplier
//   w[16]    easy-grade bonus multiplier
// Source: open-spaced-repetition/fsrs4anki, "The Algorithm" wiki.
// ─────────────────────────────────────────────────────────────────────────
const FSRS_W = [
  0.4, 0.6, 2.4, 5.8,
  4.93, 0.94,
  0.86, 0.01,
  1.49, 0.14, 0.94,
  2.18, 0.05, 0.34, 1.26,
  0.29, 2.61,
] as const;

// PFA tuning — failures hurt slightly more than successes help, standard.
export const PFA_GAMMA = 0.4;
export const PFA_RHO = 0.6;

// Selection thresholds — see CONCEPT_LAYER_SPEC.md § 3.
export const MASTERY_THRESHOLD = 0.85;
export const FRINGE_MIN = 0.5;
export const DUE_RETRIEVABILITY_GATE = 0.9;
export const SPOT_CHECK_AGE_DAYS = 30;

// Initial values.
export const INITIAL_DIFFICULTY = 5;       // FSRS standard mid-difficulty
export const STABILITY_FLOOR = 0.01;       // min stability in days, prevents div-by-zero

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type ReviewGrade = 1 | 2 | 3 | 4; // fail, hard, good, easy

/**
 * Per-question-type response-time envelopes (ms) used to derive a finer-grained
 * grade than just fail/good. Below `easy` = answered fluently → grade 4.
 * Above `hard` = struggled → grade 2. Between = grade 3.
 *
 * Keys are QuestionType values from src/types. We import as a string keyed map
 * to avoid an enum import cycle (conceptSRS is imported by lots of code paths).
 */
export const RESPONSE_TIME_ENVELOPE_MS: Record<string, { easy: number; hard: number }> = {
  multiple_choice: { easy: 5_000,   hard: 20_000 },
  predict_output:  { easy: 10_000,  hard: 30_000 },
  cloze_code:      { easy: 20_000,  hard: 60_000 },
  parsons:         { easy: 30_000,  hard: 90_000 },
  // Coding answers are long-form; a card taking a few minutes is normal effort,
  // not a recall failure. "easy" ≤ 4 min, "hard" only past ~10 min.
  coding:          { easy: 240_000, hard: 600_000 },
};

/**
 * Map a question result + response time to an FSRS grade.
 *
 * Wrong → 1 (fail).
 * Right and faster than the type's `easy` threshold → 4 (easy: longer next interval).
 * Right and slower than `hard` → 2 (hard: shorter next interval, you got it but struggled).
 * Otherwise → 3 (good).
 *
 * Falls back to the multiple_choice envelope if the type isn't recognized — keeps
 * unknown types out of the grading path entirely. timeSpentMs ≤ 0 (e.g. clock skew)
 * is treated as the "easy" end of the envelope.
 */
export function gradeFromResponseTime(
  questionType: string,
  timeSpentMs: number,
  isCorrect: boolean,
): ReviewGrade {
  if (!isCorrect) return 1;
  const env = RESPONSE_TIME_ENVELOPE_MS[questionType] ?? RESPONSE_TIME_ENVELOPE_MS.multiple_choice;
  if (timeSpentMs <= env.easy) return 4;
  if (timeSpentMs >= env.hard) return 2;
  return 3;
}

export interface ConceptState {
  successes: number;
  failures: number;
  /** ms timestamp; 0 = never reviewed. */
  lastSeen: number;
  /** Days. 0 = never reviewed (use FSRS init formulas on first review). */
  stability: number;
  /** ms timestamp the concept first crossed MASTERY_THRESHOLD. Cleared by failed spot-checks. */
  masteredAt?: number;
}

export type ConceptProgress = Record<ConceptId, ConceptState>;

export type CardBucket = 'DUE' | 'FRINGE' | 'SPOT_CHECK' | 'IDLE';

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

const emptyState = (): ConceptState => ({
  successes: 0, failures: 0, lastSeen: 0, stability: 0,
});

// ─────────────────────────────────────────────────────────────────────────
// Mastery
// ─────────────────────────────────────────────────────────────────────────

/**
 * PFA mastery probability for a question, aggregating over its concept tags.
 * Mean of logits → sigmoid. Returns null if the question has no concept tags
 * (caller should fall back to legacy card-level scheduling).
 */
export function getMasteryProbability(
  conceptIds: readonly ConceptId[],
  progress: ConceptProgress,
  betas: Record<ConceptId, number> = {},
): number | null {
  if (conceptIds.length === 0) return null;
  let total = 0;
  for (const cid of conceptIds) {
    const s = progress[cid] ?? emptyState();
    const beta = betas[cid] ?? 0;
    total += beta + PFA_GAMMA * s.successes - PFA_RHO * s.failures;
  }
  return sigmoid(total / conceptIds.length);
}

/** Mastery probability for a single concept. Used for spot-check eligibility and ProgressTracker. */
export function getConceptMasteryProbability(
  conceptId: ConceptId,
  progress: ConceptProgress,
  beta: number = 0,
): number {
  const s = progress[conceptId] ?? emptyState();
  return sigmoid(beta + PFA_GAMMA * s.successes - PFA_RHO * s.failures);
}

// ─────────────────────────────────────────────────────────────────────────
// Retrievability
// ─────────────────────────────────────────────────────────────────────────

/** Min stability across the card's concepts. null = no concepts; 0 = at least one concept never seen. */
export function getEffectiveStability(
  conceptIds: readonly ConceptId[],
  progress: ConceptProgress,
): number | null {
  if (conceptIds.length === 0) return null;
  let minS = Infinity;
  for (const cid of conceptIds) {
    const s = progress[cid]?.stability ?? 0;
    if (s === 0) return 0;
    if (s < minS) minS = s;
  }
  return minS;
}

/**
 * Card retrievability: probability the user remembers this card right now.
 * Uses min stability across concepts (Swiss-cheese guard).
 * R = 0.9 ^ (t/S), so R = 0.9 when elapsed == stability.
 * Returns null if no concepts. Returns 0 if any concept has never been seen
 * (= "always due", which forces the card to surface).
 */
export function getRetrievability(
  conceptIds: readonly ConceptId[],
  progress: ConceptProgress,
  elapsedDays: number,
): number | null {
  const s = getEffectiveStability(conceptIds, progress);
  if (s === null) return null;
  if (s === 0) return 0;
  if (elapsedDays <= 0) return 1;
  return Math.pow(0.9, elapsedDays / s);
}

// ─────────────────────────────────────────────────────────────────────────
// FSRS-4 update formulas (private; used by applyReview per concept)
// ─────────────────────────────────────────────────────────────────────────

function fsrsInitStability(grade: ReviewGrade): number {
  return Math.max(FSRS_W[grade - 1], STABILITY_FLOOR);
}

export function fsrsInitDifficulty(grade: ReviewGrade): number {
  return clamp(FSRS_W[4] - (grade - 3) * FSRS_W[5], 1, 10);
}

export function fsrsNextDifficulty(d: number, grade: ReviewGrade): number {
  const meanRevert = FSRS_W[7] * FSRS_W[4]
                   + (1 - FSRS_W[7]) * (d - FSRS_W[6] * (grade - 3));
  return clamp(meanRevert, 1, 10);
}

function fsrsNextStabilityOnSuccess(
  s: number, d: number, r: number, grade: ReviewGrade,
): number {
  const hardPenalty = grade === 2 ? FSRS_W[15] : 1;
  const easyBonus = grade === 4 ? FSRS_W[16] : 1;
  const factor = Math.exp(FSRS_W[8])
               * (11 - d)
               * Math.pow(s, -FSRS_W[9])
               * (Math.exp(FSRS_W[10] * (1 - r)) - 1)
               * hardPenalty
               * easyBonus;
  return Math.max(s * (1 + factor), STABILITY_FLOOR);
}

function fsrsNextStabilityOnFail(s: number, d: number, r: number): number {
  const next = FSRS_W[11]
             * Math.pow(d, -FSRS_W[12])
             * (Math.pow(s + 1, FSRS_W[13]) - 1)
             * Math.exp(FSRS_W[14] * (1 - r));
  return Math.max(next, STABILITY_FLOOR);
}

// ─────────────────────────────────────────────────────────────────────────
// Apply review
// ─────────────────────────────────────────────────────────────────────────

export interface ReviewResult {
  /** New ConceptState for each concept the card touches. Caller merges into live map. */
  conceptUpdates: Record<ConceptId, ConceptState>;
  /** Updated FSRS difficulty for the card itself. Caller persists onto card state. */
  newCardDifficulty: number;
}

/**
 * Apply a graded review of a card. Updates each concept's stability/successes/failures
 * independently using its own pre-review R (not the card's min-R), so each concept's
 * stability update reflects how surprising *its* retrieval was.
 *
 * - cardDifficulty: current FSRS D for the card (1–10). Pass 0 for a never-reviewed card;
 *   the function will use FSRS init difficulty.
 * - cardElapsedDays: time since the card itself was last reviewed. For a new card pass 0.
 * - betas: per-concept PFA difficulty offsets from the registry. Optional (defaults to 0 each).
 * - now: ms timestamp of the review.
 */
export function applyReview(
  conceptIds: readonly ConceptId[],
  grade: ReviewGrade,
  cardDifficulty: number,
  cardElapsedDays: number,
  progress: ConceptProgress,
  betas: Record<ConceptId, number>,
  now: number,
): ReviewResult {
  const conceptUpdates: Record<ConceptId, ConceptState> = {};

  // Updated card difficulty: init formula on first review (D=0), update formula otherwise.
  const newCardDifficulty = cardDifficulty <= 0
    ? fsrsInitDifficulty(grade)
    : fsrsNextDifficulty(cardDifficulty, grade);
  // Difficulty used inside the per-concept stability update is the post-review D —
  // matches FSRS reference impl ordering.

  for (const cid of conceptIds) {
    const prev = progress[cid] ?? emptyState();

    // Per-concept R for stability update: based on this concept's own stability.
    let rPre: number;
    if (prev.stability === 0 || cardElapsedDays <= 0) {
      rPre = 1;
    } else {
      rPre = Math.pow(0.9, cardElapsedDays / prev.stability);
    }

    let newStability: number;
    if (prev.stability === 0) {
      newStability = fsrsInitStability(grade);
    } else if (grade === 1) {
      newStability = fsrsNextStabilityOnFail(prev.stability, newCardDifficulty, rPre);
    } else {
      newStability = fsrsNextStabilityOnSuccess(prev.stability, newCardDifficulty, rPre, grade);
    }

    const successes = prev.successes + (grade >= 3 ? 1 : 0);
    const failures = prev.failures + (grade === 1 ? 1 : 0);

    // Detect first crossing into mastery for this concept.
    const beta = betas[cid] ?? 0;
    const newMastery = sigmoid(beta + PFA_GAMMA * successes - PFA_RHO * failures);
    const masteredAt = prev.masteredAt
      ?? (newMastery >= MASTERY_THRESHOLD ? now : undefined);

    conceptUpdates[cid] = {
      successes,
      failures,
      lastSeen: now,
      stability: newStability,
      masteredAt,
    };
  }

  return { conceptUpdates, newCardDifficulty };
}

/**
 * Mark a concept as failed in a spot-check: clear masteredAt and increment failures.
 * Caller invokes this when a SPOT_CHECK-bucket card was answered incorrectly, in
 * addition to the normal applyReview update for the card.
 */
export function recordSpotCheckFailure(
  state: ConceptState,
  now: number,
): ConceptState {
  return {
    ...state,
    failures: state.failures + 1,
    lastSeen: now,
    masteredAt: undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Bucket classification (used by the selection layer)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Classify a card for the selection algorithm. See CONCEPT_LAYER_SPEC.md § 3.
 *  DUE        : R(C) < DUE_RETRIEVABILITY_GATE
 *  SPOT_CHECK : any concept in card was masteredAt-set with concept.lastSeen > 30d ago
 *  FRINGE     : not DUE, not SPOT_CHECK, FRINGE_MIN ≤ m(Q) ≤ MASTERY_THRESHOLD
 *  IDLE       : otherwise (deeply mastered, not yet due)
 *
 * Cards with no concepts return IDLE — caller falls back to legacy scheduling.
 */
export function bucketCard(
  conceptIds: readonly ConceptId[],
  progress: ConceptProgress,
  cardElapsedDays: number,
  betas: Record<ConceptId, number>,
  now: number,
): CardBucket {
  if (conceptIds.length === 0) return 'IDLE';

  const r = getRetrievability(conceptIds, progress, cardElapsedDays);
  if (r !== null && r < DUE_RETRIEVABILITY_GATE) return 'DUE';

  const cutoffMs = now - SPOT_CHECK_AGE_DAYS * MS_PER_DAY;
  for (const cid of conceptIds) {
    const s = progress[cid];
    if (s?.masteredAt !== undefined && s.lastSeen > 0 && s.lastSeen <= cutoffMs) {
      return 'SPOT_CHECK';
    }
  }

  const m = getMasteryProbability(conceptIds, progress, betas);
  if (m !== null && m >= FRINGE_MIN && m <= MASTERY_THRESHOLD) return 'FRINGE';

  return 'IDLE';
}
