/**
 * Tests for conceptMigration.ts. Verifies that existing attempt history is
 * faithfully rolled up into concept-level evidence so the user keeps their
 * mastery on the day the feature flag is flipped on.
 *
 * Run:  npm test -- --testPathPattern=conceptMigration
 */
import { CodeLanguage, Difficulty, Question, QuestionAttempt, QuestionType, Topic } from '../types';
import {
  buildQuestionConceptIndex,
  migrateAttemptHistoryToConceptProgress,
  rebackfillConceptProgress,
} from './conceptMigration';
import { ConceptProgress } from './conceptSRS';

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const mcq = (id: string, concepts: string[]): Question => ({
  id,
  type: QuestionType.MULTIPLE_CHOICE,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.PY_BASICS,
  question: '?',
  explanation: '',
  options: [],
  concepts,
});

const untaggedMcq = (id: string): Question => ({
  id,
  type: QuestionType.MULTIPLE_CHOICE,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.PY_BASICS,
  question: '?',
  explanation: '',
  options: [],
});

const attempt = (questionId: string, isCorrect: boolean, msAgo: number): QuestionAttempt => ({
  questionId,
  isCorrect,
  timestamp: NOW - msAgo,
  attempts: 1,
  timeSpent: 5_000,
});

describe('buildQuestionConceptIndex', () => {
  it('skips questions without concept tags', () => {
    const idx = buildQuestionConceptIndex([
      mcq('q1', ['c1']),
      untaggedMcq('q2'),
    ]);
    expect(idx.has('q1')).toBe(true);
    expect(idx.has('q2')).toBe(false);
  });

  it('returns the concept array for tagged questions', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1', 'c2'])]);
    expect(idx.get('q1')).toEqual(['c1', 'c2']);
  });
});

describe('migrateAttemptHistoryToConceptProgress', () => {
  it('rolls successes and failures across concepts the question touches', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1', 'c2'])]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [
        attempt('q1', true, 5 * DAY),
        attempt('q1', true, 3 * DAY),
        attempt('q1', false, 1 * DAY),
      ],
      idx,
    );
    expect(cp.c1.successes).toBe(2);
    expect(cp.c1.failures).toBe(1);
    expect(cp.c2.successes).toBe(2);
    expect(cp.c2.failures).toBe(1);
  });

  it('takes the latest timestamp as lastSeen', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [
        attempt('q1', true, 10 * DAY),
        attempt('q1', true, 1 * DAY),
        attempt('q1', false, 5 * DAY),
      ],
      idx,
    );
    expect(cp.c1.lastSeen).toBe(NOW - 1 * DAY);
  });

  it('sets stability=1 day for any concept with evidence', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [attempt('q1', true, 1 * DAY)],
      idx,
    );
    expect(cp.c1.stability).toBe(1.0);
  });

  it('omits concepts that have no evidence in history', () => {
    const idx = buildQuestionConceptIndex([
      mcq('q1', ['c1']),
      mcq('q2', ['c2']),
    ]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [attempt('q1', true, 1 * DAY)],
      idx,
    );
    expect(cp.c1).toBeDefined();
    expect(cp.c2).toBeUndefined();
  });

  it('ignores attempts on untagged questions', () => {
    const idx = buildQuestionConceptIndex([untaggedMcq('q1')]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [attempt('q1', true, 1 * DAY)],
      idx,
    );
    expect(Object.keys(cp).length).toBe(0);
  });

  it('aggregates evidence from multiple questions sharing a concept', () => {
    const idx = buildQuestionConceptIndex([
      mcq('q1', ['shared']),
      mcq('q2', ['shared']),
    ]);
    const cp = migrateAttemptHistoryToConceptProgress(
      [
        attempt('q1', true, 5 * DAY),
        attempt('q2', false, 2 * DAY),
        attempt('q2', true, 1 * DAY),
      ],
      idx,
    );
    expect(cp.shared.successes).toBe(2);
    expect(cp.shared.failures).toBe(1);
    expect(cp.shared.lastSeen).toBe(NOW - 1 * DAY);
  });
});

describe('rebackfillConceptProgress', () => {
  // Models the real-world bug: a question existed and was attempted, then
  // later got tagged with a concept. The original migration ran *before* the
  // tag was added, so the concept's count is stuck at whatever happened after
  // tagging.
  it('credits historical attempts to a concept whose tag was added later', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    const history = [
      attempt('q1', true, 30 * DAY),
      attempt('q1', true, 25 * DAY),
      attempt('q1', true, 20 * DAY),
      attempt('q1', true, 15 * DAY),
      attempt('q1', true, 10 * DAY),  // 5 historical successes
      attempt('q1', true, 1 * DAY),   // 1 post-tag success
    ];
    const stale: ConceptProgress = {
      c1: { successes: 1, failures: 0, lastSeen: NOW - 1 * DAY, stability: 2.4 },
    };
    const out = rebackfillConceptProgress(stale, history, idx, {});
    expect(out.c1.successes).toBe(6);
    expect(out.c1.failures).toBe(0);
  });

  it('preserves existing stability when one is set', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    const history = [attempt('q1', true, 5 * DAY)];
    const stale: ConceptProgress = {
      c1: { successes: 1, failures: 0, lastSeen: NOW - 5 * DAY, stability: 42 },
    };
    const out = rebackfillConceptProgress(stale, history, idx, {});
    expect(out.c1.stability).toBe(42);
  });

  it('preserves existing masteredAt timestamp', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    const history = [attempt('q1', true, 1 * DAY)];
    const masteredEarlier = NOW - 100 * DAY;
    const stale: ConceptProgress = {
      c1: { successes: 5, failures: 0, lastSeen: NOW - 1 * DAY, stability: 30, masteredAt: masteredEarlier },
    };
    const out = rebackfillConceptProgress(stale, history, idx, {});
    expect(out.c1.masteredAt).toBe(masteredEarlier);
  });

  it('sets masteredAt when rebuilt mastery now crosses the threshold', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    // 6 successes, 0 failures → mastery sigmoid(0.4·6)=0.916 > 0.85 threshold.
    const history = [
      attempt('q1', true, 30 * DAY),
      attempt('q1', true, 25 * DAY),
      attempt('q1', true, 20 * DAY),
      attempt('q1', true, 15 * DAY),
      attempt('q1', true, 10 * DAY),
      attempt('q1', true, 1 * DAY),
    ];
    const stale: ConceptProgress = {
      c1: { successes: 1, failures: 0, lastSeen: NOW - 1 * DAY, stability: 2 },
    };
    const out = rebackfillConceptProgress(stale, history, idx, {});
    expect(out.c1.masteredAt).toBe(NOW - 1 * DAY);
  });

  it('takes latest of replayed and existing lastSeen', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['c1'])]);
    // History only has an old attempt, but stored lastSeen is more recent
    // (e.g. concept was last touched via a different question that has since
    // been deleted from the index).
    const history = [attempt('q1', true, 50 * DAY)];
    const stale: ConceptProgress = {
      c1: { successes: 1, failures: 0, lastSeen: NOW - 1 * DAY, stability: 5 },
    };
    const out = rebackfillConceptProgress(stale, history, idx, {});
    expect(out.c1.lastSeen).toBe(NOW - 1 * DAY);
  });

  it('keeps concepts present in current state but absent from replay', () => {
    // Tag was removed from every question — we still want to keep the user's
    // mastery so they don't lose progress.
    const idx = buildQuestionConceptIndex([]);
    const stale: ConceptProgress = {
      orphan: { successes: 10, failures: 1, lastSeen: NOW - 1 * DAY, stability: 30 },
    };
    const out = rebackfillConceptProgress(stale, [], idx, {});
    expect(out.orphan.successes).toBe(10);
  });

  it('respects per-concept beta when deciding masteredAt', () => {
    const idx = buildQuestionConceptIndex([mcq('q1', ['hard'])]);
    // 3 successes, 0 failures: m = sigmoid(0 + 0.4·3) = 0.768 → not mastered.
    // With beta = 0.5 (easy concept): m = sigmoid(0.5 + 1.2) = 0.846 → still NOT mastered.
    // With beta = 1.0: m = sigmoid(1.0 + 1.2) = 0.900 → MASTERED.
    const history = [
      attempt('q1', true, 5 * DAY),
      attempt('q1', true, 3 * DAY),
      attempt('q1', true, 1 * DAY),
    ];
    const out1 = rebackfillConceptProgress({}, history, idx, { hard: 0.5 });
    expect(out1.hard.masteredAt).toBeUndefined();
    const out2 = rebackfillConceptProgress({}, history, idx, { hard: 1.0 });
    expect(out2.hard.masteredAt).toBe(NOW - 1 * DAY);
  });
});
