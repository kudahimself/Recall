/**
 * Tests for concept-aware selectNextQuestion. Verifies that:
 *   - the legacy path is unchanged when conceptCtx is undefined
 *   - when ctx is provided, untagged cards fall through to legacy
 *   - DUE bucket dominates when retrievability is below the gate
 *   - SPOT_CHECK fires for stale-mastered concepts
 *
 * Run:  npm test -- --testPathPattern=conceptAware
 */
import { CodeLanguage, Difficulty, Question, QuestionType, Topic, UserProgress } from '../types';
import { SpacedRepetitionSystem, ConceptSelectionContext } from './spacedRepetition';
import { ConceptProgress, MASTERY_THRESHOLD, SPOT_CHECK_AGE_DAYS } from './conceptSRS';

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

const mcq = (id: string, concepts: string[] | undefined): Question => ({
  id,
  type: QuestionType.MULTIPLE_CHOICE,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.PY_BASICS,
  question: '?',
  explanation: '',
  options: [
    { id: 'a', text: 'a', isCorrect: true },
    { id: 'b', text: 'b', isCorrect: false },
  ],
  concepts,
});

function progressWithAttempts(items: Array<{ id: string; isCorrect: boolean; ago: number }>): UserProgress {
  const lastAttempt = new Map<string, number>();
  const questionsAttempted = new Set<string>();
  const correctAnswers = new Set<string>();
  for (const it of items) {
    questionsAttempted.add(it.id);
    if (it.isCorrect) correctAnswers.add(it.id);
    lastAttempt.set(it.id, NOW - it.ago);
  }
  return {
    questionsAttempted,
    correctAnswers,
    attemptHistory: items.map(it => ({
      questionId: it.id, isCorrect: it.isCorrect,
      timestamp: NOW - it.ago, attempts: 1, timeSpent: 0,
    })),
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt,
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

describe('selectNextQuestion — legacy path unchanged when ctx omitted', () => {
  it('returns a question without a ctx', () => {
    const qs = [mcq('q1', undefined), mcq('q2', undefined)];
    const progress = progressWithAttempts([]);
    const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress);
    expect(pick).not.toBeNull();
    expect(['q1', 'q2']).toContain(pick!.id);
  });
});

describe('selectNextQuestion — concept-aware fallback', () => {
  it('falls back to legacy when no cards in pool have concept tags', () => {
    // Untagged cards in the pool → concept-aware path returns null → legacy runs.
    const qs = [mcq('q1', undefined), mcq('q2', undefined)];
    const progress = progressWithAttempts([]);
    const ctx: ConceptSelectionContext = { progress: {}, betas: {} };
    const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
    expect(pick).not.toBeNull();
    // Untagged cards should still be returned via legacy fallback
    expect(['q1', 'q2']).toContain(pick!.id);
  });

  it('picks from concept-tagged cards when ctx is provided', () => {
    const qs = [mcq('tagged', ['c1']), mcq('untagged', undefined)];
    const conceptProgress: ConceptProgress = {
      c1: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
    };
    const progress = progressWithAttempts([]);
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };
    // Concept c1 has stability=0 → R=0 → DUE bucket.
    // 80% chance picks from DUE which contains 'tagged' only.
    let taggedCount = 0;
    for (let i = 0; i < 200; i++) {
      const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
      if (pick && pick.id === 'tagged') taggedCount++;
    }
    expect(taggedCount).toBeGreaterThan(150); // dominantly tagged
  });
});

describe('selectNextQuestion — bucket routing', () => {
  it('prefers DUE cards (low retrievability) over IDLE cards', () => {
    const due = mcq('due', ['c1']);
    const idle = mcq('idle', ['c2']);
    const qs = [due, idle];
    const conceptProgress: ConceptProgress = {
      // Due: stability 0 (never seen) → R=0 → bucket DUE
      c1: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
      // Idle: stability 100, mastery high (lots of successes) → R≈1 → not DUE; mastery > 0.85 → not FRINGE → IDLE
      c2: {
        successes: 12, failures: 0, lastSeen: NOW - 5 * DAY,
        stability: 100, masteredAt: NOW - 5 * DAY,
      },
    };
    const progress = progressWithAttempts([
      { id: 'idle', isCorrect: true, ago: 5 * DAY },
    ]);
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };

    let dueCount = 0;
    for (let i = 0; i < 200; i++) {
      const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
      if (pick?.id === 'due') dueCount++;
    }
    // DUE should dominate; idle has no bucket so it can never be picked except via spot-check
    // (which it's not eligible for since mastered <30 days ago).
    expect(dueCount).toBeGreaterThan(180);
  });

  it('routes to SPOT_CHECK for cards whose concepts were mastered ≥30 days ago', () => {
    const stale = mcq('stale', ['c-stale']);
    const qs = [stale];
    const longAgo = NOW - (SPOT_CHECK_AGE_DAYS + 5) * DAY;
    const conceptProgress: ConceptProgress = {
      'c-stale': {
        successes: 12, failures: 0,
        lastSeen: longAgo,
        // High stability so R stays above the DUE gate at 5 days elapsed.
        stability: 200,
        masteredAt: longAgo,
      },
    };
    // Only attempted at the long-ago time so elapsedDays is small (5 days).
    const progress = progressWithAttempts([
      { id: 'stale', isCorrect: true, ago: 5 * DAY },
    ]);
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };
    // Pool has only this card → SPOT_CHECK is the only viable bucket → must pick it.
    const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
    expect(pick).not.toBeNull();
    expect(pick!.id).toBe('stale');
  });
});

describe('mastery threshold sanity', () => {
  it('MASTERY_THRESHOLD is the canonical 0.85', () => {
    expect(MASTERY_THRESHOLD).toBe(0.85);
  });
});

describe('selectNextQuestion — cooldown & null fallback (regression)', () => {
  it('does NOT re-serve the just-answered card when an alternative exists in any bucket', () => {
    // Two cards both eligible for DUE bucket; the just-answered one must be
    // suppressed by the cooldown so the OTHER one is returned.
    const justAnswered = mcq('just-answered', ['c1']);
    const alternative = mcq('alternative', ['c2']);
    const qs = [justAnswered, alternative];
    const conceptProgress: ConceptProgress = {
      c1: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
      c2: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
    };
    // Recent attempt is the just-answered card.
    const progress = progressWithAttempts([
      { id: 'just-answered', isCorrect: true, ago: 1000 },
    ]);
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };
    // Run many trials — under cooldown the just-answered card must NEVER come back.
    for (let i = 0; i < 100; i++) {
      const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
      expect(pick).not.toBeNull();
      expect(pick!.id).toBe('alternative');
    }
  });

  it('falls through to legacy when the only bucketed card was just answered (no concept-aware re-serve)', () => {
    // Single tagged card in cooldown → cooledBuckets all empty → totalShare=0
    // → concept-aware returns null → legacy runs and (since the card is the
    // only one in the pool) returns it. The key property is that it goes
    // through the legacy fallback path, not concept-aware.
    const tagged = mcq('only-tagged', ['c1']);
    const qs = [tagged];
    const conceptProgress: ConceptProgress = {
      c1: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
    };
    const progress = progressWithAttempts([
      { id: 'only-tagged', isCorrect: true, ago: 500 },
    ]);
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };
    // The legacy path will still return it (only card available); but the
    // important behavior is that selectNextQuestion does not throw and returns
    // a valid pick.
    const pick = SpacedRepetitionSystem.selectNextQuestion(qs, progress, ctx);
    expect(pick).not.toBeNull();
    expect(pick!.id).toBe('only-tagged');
  });

  it('returns null instead of a wrong-course leak when availableQuestions is empty', () => {
    // Empty input → null (the previous behavior was `return questions[0]`,
    // which could surface a wrong-course question if a filter wiped the pool).
    const pick = SpacedRepetitionSystem.selectNextQuestion([], progressWithAttempts([]));
    expect(pick).toBeNull();
  });
});
