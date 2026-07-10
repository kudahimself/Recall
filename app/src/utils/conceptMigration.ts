/**
 * One-shot migration: derive ConceptProgress from the existing UserProgress
 * attempt history and the per-question `concepts` field. Used the first time
 * concept-SRS is enabled (or any time the concept-progress key is empty).
 *
 * Idempotent and side-effect free — pass in state, get state out.
 *
 * See CONCEPT_LAYER_SPEC.md § 5 for the broader migration rationale.
 */
import { Question, QuestionAttempt, UserProgress } from '../types';
import { ConceptProgress, ConceptState, MASTERY_THRESHOLD } from './conceptSRS';

const INITIAL_STABILITY_DAYS = 1.0;
const PFA_GAMMA_LOCAL = 0.4;
const PFA_RHO_LOCAL = 0.6;
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Build a fast lookup: questionId → concept ids. Skips untagged questions. */
export function buildQuestionConceptIndex(questions: readonly Question[]): Map<string, string[]> {
  const idx = new Map<string, string[]>();
  for (const q of questions) {
    if (q.concepts && q.concepts.length > 0) {
      idx.set(q.id, q.concepts);
    }
  }
  return idx;
}

/**
 * Walk the user's attempt history and roll up successes/failures/lastSeen
 * per concept. For concepts with any evidence, set stability to 1 day so
 * the FSRS update formulas have a non-zero starting point. Concepts with no
 * evidence are simply absent from the returned map (the SRS treats them as
 * stability=0 → "always due" until first contact).
 */
export function migrateAttemptHistoryToConceptProgress(
  attempts: readonly QuestionAttempt[],
  conceptIndex: Map<string, string[]>,
): ConceptProgress {
  const cp: ConceptProgress = {};

  for (const attempt of attempts) {
    const concepts = conceptIndex.get(attempt.questionId);
    if (!concepts) continue;
    for (const cid of concepts) {
      const prev: ConceptState = cp[cid] ?? {
        successes: 0, failures: 0, lastSeen: 0, stability: 0,
      };
      cp[cid] = {
        ...prev,
        successes: prev.successes + (attempt.isCorrect ? 1 : 0),
        failures:  prev.failures  + (attempt.isCorrect ? 0 : 1),
        lastSeen:  Math.max(prev.lastSeen, attempt.timestamp ?? 0),
      };
    }
  }

  for (const cid of Object.keys(cp)) {
    if (cp[cid].stability === 0 && cp[cid].lastSeen > 0) {
      cp[cid].stability = INITIAL_STABILITY_DAYS;
    }
  }

  return cp;
}

export function migrateProgressToConcepts(
  progress: UserProgress,
  questions: readonly Question[],
): ConceptProgress {
  const idx = buildQuestionConceptIndex(questions);
  return migrateAttemptHistoryToConceptProgress(progress.attemptHistory, idx);
}

/**
 * Re-runnable migration. Replays full attempt history to recompute
 * successes / failures / lastSeen against the *current* concept tags, then
 * preserves any already-set stability and masteredAt fields.
 *
 * Why this exists: the original migration is one-shot (runs only when
 * concept-progress is empty). When concept tags get added to questions
 * after that initial migration, prior attempts are never credited to the
 * new tags — a card you'd already mastered shows up as "1 success" because
 * only post-tag attempts counted.
 *
 * Bumping CONCEPT_MIGRATION_VERSION triggers App to re-call this on next
 * load. Idempotent: same history + same tags = same result.
 *
 * Stability handling: if the user already had a stability > 0 from FSRS
 * fine-tuning, we keep it (their actual recall pattern is more accurate
 * than the constant we'd otherwise reset to). If the concept is brand new
 * to the user's progress, we seed at INITIAL_STABILITY_DAYS.
 *
 * masteredAt: if not already set and the rebuilt mastery now crosses the
 * threshold, we set it to the most recent attempt timestamp (the moment
 * the user demonstrably knows it).
 */
export function rebackfillConceptProgress(
  current: ConceptProgress,
  attempts: readonly QuestionAttempt[],
  conceptIndex: Map<string, string[]>,
  betas: Record<string, number>,
): ConceptProgress {
  const replayed = migrateAttemptHistoryToConceptProgress(attempts, conceptIndex);
  const out: ConceptProgress = {};

  for (const cid of Object.keys(replayed)) {
    const r = replayed[cid];
    const c = current[cid];
    const beta = betas[cid] ?? 0;
    const mastery = sigmoid(beta + PFA_GAMMA_LOCAL * r.successes - PFA_RHO_LOCAL * r.failures);

    out[cid] = {
      successes: r.successes,
      failures: r.failures,
      lastSeen: Math.max(r.lastSeen, c?.lastSeen ?? 0),
      stability: c?.stability && c.stability > 0 ? c.stability : r.stability,
      masteredAt: c?.masteredAt
        ?? (mastery >= MASTERY_THRESHOLD ? r.lastSeen : undefined),
    };
  }
  // Concepts present in current but absent from replay (e.g. tag was removed
  // from every question). Carry them through so we don't lose stability.
  for (const cid of Object.keys(current)) {
    if (!out[cid]) out[cid] = current[cid];
  }
  return out;
}
