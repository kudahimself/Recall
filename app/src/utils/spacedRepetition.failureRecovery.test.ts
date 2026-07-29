/**
 * Tests for the failure-recovery selector behaviour:
 *   1. Recent-failure pivot (REVIEW_AFTER_FAIL_PROB)
 *   2. Active-topic + lapse-recency boosts in calculatePriority
 *   3. Within-topic difficulty gate (isDifficultyUnlockedInTopic)
 *   4. COMPLETION_PUSH suppression when active topic has unresolved failures
 *   5. Cooldown exemption for the just-failed question
 *
 * Synthetic questions are pinned to real Topic enum keys so the gating /
 * unlocked-topic machinery still runs. py_basics is used because it is the
 * first section in the backend path and therefore always unlocked, removing
 * the section-unlock variable from these scenarios.
 *
 * Run: npm test -- --testPathPattern=failureRecovery --watchAll=false
 */
import {
  Course,
  Difficulty,
  Question,
  QuestionAttempt,
  QuestionType,
  Topic,
  UserProgress,
} from '../types';
import { getSelectionPolicy } from './courseConfig';
import {
  ACTIVE_TOPIC_FAILURE_BOOST,
  GATE_RELIEF_PROB,
  IN_TOPIC_DIFFICULTY_GATE_PCT,
  LATEST_WRONG_BOOST,
  NEW_QUESTION_PROBABILITY,
  REVIEW_AFTER_FAIL_PROB,
  SpacedRepetitionSystem,
} from './spacedRepetition';

const backendPolicy = getSelectionPolicy(Course.BACKEND);

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

function makeQ(id: string, topic: Topic, difficulty: Difficulty): Question {
  return {
    id,
    topic,
    difficulty,
    type: QuestionType.MULTIPLE_CHOICE,
    question: `prompt for ${id}`,
    options: [
      { id: 'a', text: 'a', isCorrect: true },
      { id: 'b', text: 'b', isCorrect: false },
      { id: 'c', text: 'c', isCorrect: false },
      { id: 'd', text: 'd', isCorrect: false },
    ],
    explanation: 'e',
  };
}

function makeAttempt(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return {
    questionId: qid,
    isCorrect,
    timestamp: Date.now() - msAgo,
    attempts: 1,
    timeSpent: 5_000,
  };
}

/** Push an attempt and mirror the side-effects App.tsx writes into progress. */
function recordAttempt(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push(makeAttempt(qid, isCorrect, msAgo));
  progress.lastAttempt.set(qid, Date.now() - msAgo);
}

describe('calculatePriority — active-topic + lapse-recency boosts', () => {
  test('latest-wrong + active topic dominates a same-state question in a different topic', () => {
    const progress = emptyProgress();
    const inTopic = makeQ('q-in', Topic.PY_BASICS, Difficulty.BEGINNER);
    const outOfTopic = makeQ('q-out', Topic.PY_REGEX, Difficulty.BEGINNER);

    // Same attempt pattern for both: one wrong attempt a few minutes ago.
    recordAttempt(progress, inTopic.id, false, 60_000);
    recordAttempt(progress, outOfTopic.id, false, 60_000);

    const inScore = SpacedRepetitionSystem.calculatePriority(
      inTopic.id, progress, inTopic, [inTopic], Topic.PY_BASICS,
    );
    const outScore = SpacedRepetitionSystem.calculatePriority(
      outOfTopic.id, progress, outOfTopic, [outOfTopic], Topic.PY_BASICS,
    );

    // out-of-topic still gets LATEST_WRONG_BOOST. in-topic additionally gets
    // ACTIVE_TOPIC_FAILURE_BOOST × recency multiplier.
    expect(inScore - outScore).toBeGreaterThanOrEqual(ACTIVE_TOPIC_FAILURE_BOOST * 0.7);
  });

  test('just-failed question outranks an older in-topic failure (recency × 1.5 vs × 1.0)', () => {
    const progress = emptyProgress();
    const justFailed = makeQ('q-just', Topic.PY_BASICS, Difficulty.BEGINNER);
    const olderFailed = makeQ('q-older', Topic.PY_BASICS, Difficulty.BEGINNER);

    // Older failure first, then 3 unrelated attempts (to push attemptsAgo > 0),
    // then the just-failed question is the last entry.
    recordAttempt(progress, olderFailed.id, false, 10 * 60_000);
    for (let i = 0; i < 3; i++) {
      const filler = makeQ(`f${i}`, Topic.PY_BASICS, Difficulty.BEGINNER);
      recordAttempt(progress, filler.id, true, (9 - i) * 60_000);
    }
    recordAttempt(progress, justFailed.id, false, 60_000);

    const topicQs = [justFailed, olderFailed];
    const justScore = SpacedRepetitionSystem.calculatePriority(
      justFailed.id, progress, justFailed, topicQs, Topic.PY_BASICS,
    );
    const olderScore = SpacedRepetitionSystem.calculatePriority(
      olderFailed.id, progress, olderFailed, topicQs, Topic.PY_BASICS,
    );

    // Δ should be ≥ 0.5 × ACTIVE_TOPIC_FAILURE_BOOST = 200 from the recency
    // multiplier alone. Other scoring components are equal for two latest-
    // wrong-once questions, so the recency multiplier dominates the gap.
    expect(justScore).toBeGreaterThan(olderScore);
    expect(justScore - olderScore).toBeGreaterThanOrEqual(ACTIVE_TOPIC_FAILURE_BOOST * 0.4);
  });

  test('latest-correct in active topic gets neither boost', () => {
    const progress = emptyProgress();
    const q = makeQ('q-ok', Topic.PY_BASICS, Difficulty.BEGINNER);
    recordAttempt(progress, q.id, true, 60_000);

    const withActive = SpacedRepetitionSystem.calculatePriority(
      q.id, progress, q, [q], Topic.PY_BASICS,
    );
    const withoutActive = SpacedRepetitionSystem.calculatePriority(
      q.id, progress, q, [q], null,
    );

    // Latest-correct → LATEST_WRONG_BOOST does not fire → no delta from
    // activeTopic param. (Tiny float drift comes from daysSinceLastAttempt
    // reading Date.now() once per call — well under 1 unit of score.)
    expect(Math.abs(withActive - withoutActive)).toBeLessThan(1);
  });

  test('latest-wrong outside active topic still gets LATEST_WRONG_BOOST', () => {
    const progress = emptyProgress();
    const q = makeQ('q-stale', Topic.PY_REGEX, Difficulty.BEGINNER);
    recordAttempt(progress, q.id, false, 10 * 60_000);

    const withMatchingActive = SpacedRepetitionSystem.calculatePriority(
      q.id, progress, q, [q], Topic.PY_REGEX,
    );
    const withDifferentActive = SpacedRepetitionSystem.calculatePriority(
      q.id, progress, q, [q], Topic.PY_BASICS,
    );

    // Both pick up LATEST_WRONG_BOOST. Only the matching-active one adds
    // ACTIVE_TOPIC_FAILURE_BOOST. So delta = boost × recency.
    expect(withMatchingActive - withDifferentActive).toBeGreaterThanOrEqual(
      ACTIVE_TOPIC_FAILURE_BOOST * 0.6,
    );
    expect(withDifferentActive).toBeGreaterThanOrEqual(LATEST_WRONG_BOOST);
  });
});

describe('isDifficultyUnlockedInTopic — within-topic difficulty gate', () => {
  const beginners = Array.from({ length: 10 }, (_, i) =>
    makeQ(`b${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
  );
  const intermediates = Array.from({ length: 5 }, (_, i) =>
    makeQ(`i${i}`, Topic.PY_BASICS, Difficulty.INTERMEDIATE),
  );
  const advanced = Array.from({ length: 3 }, (_, i) =>
    makeQ(`a${i}`, Topic.PY_BASICS, Difficulty.ADVANCED),
  );
  const topicQs = [...beginners, ...intermediates, ...advanced];

  test('BEGINNER is always unlocked', () => {
    const progress = emptyProgress();
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.BEGINNER),
    ).toBe(true);
  });

  test('INTERMEDIATE blocked when no beginner attempts at all', () => {
    const progress = emptyProgress();
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.INTERMEDIATE),
    ).toBe(false);
  });

  test('INTERMEDIATE blocked when beginner accuracy below the gate', () => {
    const progress = emptyProgress();
    // 10 beginners attempted, 6 latest-correct = 60% < 70%
    beginners.forEach((q, i) => recordAttempt(progress, q.id, i < 6, (10 - i) * 60_000));
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.INTERMEDIATE),
    ).toBe(false);
  });

  test('INTERMEDIATE unlocks when beginner accuracy reaches the gate', () => {
    const progress = emptyProgress();
    // 10 beginners attempted, 7 latest-correct = 70% which is exactly the gate
    beginners.forEach((q, i) => recordAttempt(progress, q.id, i < 7, (10 - i) * 60_000));
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.INTERMEDIATE),
    ).toBe(true);
    // Gate constant sanity check
    expect(IN_TOPIC_DIFFICULTY_GATE_PCT).toBe(70);
  });

  test('ADVANCED requires intermediate accuracy, not beginner accuracy', () => {
    const progress = emptyProgress();
    // All beginners aced…
    beginners.forEach((q, i) => recordAttempt(progress, q.id, true, (50 - i) * 60_000));
    // …but no intermediate attempts yet
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.ADVANCED),
    ).toBe(false);
    // Now finish intermediates with 4/5 = 80% latest-correct
    intermediates.forEach((q, i) => recordAttempt(progress, q.id, i < 4, (5 - i) * 60_000));
    expect(
      SpacedRepetitionSystem.isDifficultyUnlockedInTopic(topicQs, progress, Difficulty.ADVANCED),
    ).toBe(true);
  });
});

describe('selectNextQuestion — recent-failure pivot', () => {
  test('after a wrong last attempt, new-pick rate collapses to REVIEW_AFTER_FAIL_PROB', () => {
    // Mix of seen + unseen so both paths are reachable.
    const seen = Array.from({ length: 5 }, (_, i) =>
      makeQ(`seen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const unseen = Array.from({ length: 10 }, (_, i) =>
      makeQ(`unseen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const pool = [...seen, ...unseen];

    const progress = emptyProgress();
    // All seen questions answered correctly at first…
    seen.forEach((q, i) => recordAttempt(progress, q.id, true, (60 - i) * 60_000));
    // …then the user fails one of them as the very last attempt.
    recordAttempt(progress, seen[0].id, false, 60_000);

    let newPicks = 0;
    const trials = 1000;
    for (let i = 0; i < trials; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (!progress.questionsAttempted.has(q.id)) newPicks++;
    }
    const newRate = newPicks / trials;

    // Expected new-rate after fail = REVIEW_AFTER_FAIL_PROB = 0.15.
    // Allow ±0.06 for sampling noise on 1000 trials.
    expect(newRate).toBeGreaterThan(REVIEW_AFTER_FAIL_PROB - 0.06);
    expect(newRate).toBeLessThan(REVIEW_AFTER_FAIL_PROB + 0.06);
    // And it must be clearly below the default 0.7 baseline.
    expect(newRate).toBeLessThan(NEW_QUESTION_PROBABILITY - 0.3);
  });

  test('after a correct last attempt, new-pick rate stays near NEW_QUESTION_PROBABILITY', () => {
    const seen = Array.from({ length: 5 }, (_, i) =>
      makeQ(`seen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const unseen = Array.from({ length: 10 }, (_, i) =>
      makeQ(`unseen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const pool = [...seen, ...unseen];

    const progress = emptyProgress();
    seen.forEach((q, i) => recordAttempt(progress, q.id, true, (60 - i) * 60_000));

    let newPicks = 0;
    const trials = 1000;
    for (let i = 0; i < trials; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (!progress.questionsAttempted.has(q.id)) newPicks++;
    }
    const newRate = newPicks / trials;
    // Default baseline. Allow ±0.06 noise.
    expect(newRate).toBeGreaterThan(NEW_QUESTION_PROBABILITY - 0.06);
    expect(newRate).toBeLessThan(NEW_QUESTION_PROBABILITY + 0.06);
  });
});

describe('selectNextQuestion — cooldown spacing after a failure', () => {
  test('the just-failed question is NOT re-served on the adjacent pick', () => {
    // Spacing beats massing: after a miss, the next pick should surface a
    // DIFFERENT card (so Next never feels stuck), not the card just failed.
    const seen = Array.from({ length: 6 }, (_, i) =>
      makeQ(`q${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const progress = emptyProgress();
    // 5 successful attempts (q1..q5), then q0 is failed last.
    for (let i = 1; i <= 5; i++) {
      recordAttempt(progress, seen[i].id, true, (10 - i) * 60_000);
    }
    recordAttempt(progress, seen[0].id, false, 30_000);

    // Force the review path (all questions already seen → no new picks). The
    // just-failed q0 sits in the REVIEW_COOLDOWN window, so it can never be the
    // very next pick while other review cards remain.
    let q0Picks = 0;
    for (let i = 0; i < 500; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(seen, progress, undefined, backendPolicy);
      if (q?.id === seen[0].id) q0Picks++;
    }
    expect(q0Picks).toBe(0);
  });

  test('the just-failed question returns once it clears the cooldown window', () => {
    const seen = Array.from({ length: 6 }, (_, i) =>
      makeQ(`q${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const progress = emptyProgress();
    for (let i = 1; i <= 5; i++) {
      recordAttempt(progress, seen[i].id, true, (10 - i) * 60_000);
    }
    recordAttempt(progress, seen[0].id, false, 30_000);
    // Answer three OTHER cards so q0 falls out of the last-REVIEW_COOLDOWN
    // window. q0's latest attempt is still wrong, so top priority pulls it back.
    recordAttempt(progress, seen[1].id, true, 25_000);
    recordAttempt(progress, seen[2].id, true, 20_000);
    recordAttempt(progress, seen[3].id, true, 15_000);

    let q0Picks = 0;
    for (let i = 0; i < 500; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(seen, progress, undefined, backendPolicy);
      if (q?.id === seen[0].id) q0Picks++;
    }
    expect(q0Picks).toBeGreaterThan(50); // resurfaces via latest-wrong priority
  });

  test('a just-failed card IS re-served when it is the only review option', () => {
    // Fallback: if cooldown would empty the pool, the failed card comes back
    // immediately rather than leaving nothing to serve.
    const seen = [makeQ('solo', Topic.PY_BASICS, Difficulty.BEGINNER)];
    const progress = emptyProgress();
    recordAttempt(progress, seen[0].id, false, 30_000);

    const q = SpacedRepetitionSystem.selectNextQuestion(seen, progress, undefined, backendPolicy);
    expect(q?.id).toBe('solo');
  });
});

describe('selectNextQuestion — completion push suppression', () => {
  test('with unresolved failures, ≤3 unseen does NOT force 100% new picks', () => {
    // 5 seen (2 with latest-wrong), 3 unseen — exactly at COMPLETION_PUSH_THRESHOLD.
    const seen = Array.from({ length: 5 }, (_, i) =>
      makeQ(`seen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const unseen = Array.from({ length: 3 }, (_, i) =>
      makeQ(`unseen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const pool = [...seen, ...unseen];

    const progress = emptyProgress();
    // 5 seen all correct first…
    seen.forEach((q, i) => recordAttempt(progress, q.id, true, (60 - i) * 60_000));
    // …then 2 latest-wrong (most recent in history).
    recordAttempt(progress, seen[0].id, false, 30 * 60_000);
    recordAttempt(progress, seen[1].id, false, 20 * 60_000);
    // Last attempt is correct so the failure pivot doesn't muddy the result —
    // we want to isolate the completion-push suppression.
    recordAttempt(progress, seen[2].id, true, 60_000);

    let newPicks = 0;
    const trials = 1000;
    for (let i = 0; i < trials; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (!progress.questionsAttempted.has(q.id)) newPicks++;
    }
    const newRate = newPicks / trials;
    // With completion push suppressed and lastAttempt correct, we should see
    // roughly the default NEW_QUESTION_PROBABILITY mix — NOT 100% new.
    expect(newRate).toBeLessThan(0.85);
    expect(newRate).toBeGreaterThan(0.4);
  });

  test('with NO unresolved failures, ≤3 unseen DOES trigger 100% new picks', () => {
    const seen = Array.from({ length: 5 }, (_, i) =>
      makeQ(`seen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const unseen = Array.from({ length: 3 }, (_, i) =>
      makeQ(`unseen-${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const pool = [...seen, ...unseen];

    const progress = emptyProgress();
    // All seen latest-correct, last attempt also correct.
    seen.forEach((q, i) => recordAttempt(progress, q.id, true, (60 - i) * 60_000));

    let newPicks = 0;
    const trials = 500;
    for (let i = 0; i < trials; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (!progress.questionsAttempted.has(q.id)) newPicks++;
    }
    // Should be ~100% new (completion push active).
    expect(newPicks / trials).toBeGreaterThan(0.95);
  });
});

describe('selectNextQuestion — within-topic difficulty gate end-to-end', () => {
  // Shared setup: 10 beginners (all seen, 50% latest-correct = below the 70%
  // gate) + 5 unseen intermediates. The gate blocks every intermediate from
  // the normal new path. The relief trickle is the only way one can be served.
  const buildGateBlockedPool = () => {
    const beginners = Array.from({ length: 10 }, (_, i) =>
      makeQ(`b${i}`, Topic.PY_BASICS, Difficulty.BEGINNER),
    );
    const intermediates = Array.from({ length: 5 }, (_, i) =>
      makeQ(`i${i}`, Topic.PY_BASICS, Difficulty.INTERMEDIATE),
    );
    const pool = [...beginners, ...intermediates];
    const progress = emptyProgress();
    // All 10 beginners attempted, 5 latest-correct = 50% < the 70% gate.
    beginners.forEach((q, i) => recordAttempt(progress, q.id, i < 5, (60 - i) * 60_000));
    return { beginners, intermediates, pool, progress };
  };

  test('after a CORRECT answer, gate-blocked intermediates trickle at ~GATE_RELIEF_PROB', () => {
    const { beginners, pool, progress } = buildGateBlockedPool();
    // Last attempt correct → trickle is allowed to fire.
    recordAttempt(progress, beginners[4].id, true, 30_000);

    const N = 2000;
    let pickedNewIntermediate = 0;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (q && q.difficulty === Difficulty.INTERMEDIATE && !progress.questionsAttempted.has(q.id)) {
        pickedNewIntermediate++;
      }
    }
    const rate = pickedNewIntermediate / N;
    // Forward motion never fully stops: the gated next-difficulty question
    // comes through at roughly GATE_RELIEF_PROB.
    expect(rate).toBeGreaterThan(GATE_RELIEF_PROB - 0.05);
    expect(rate).toBeLessThan(GATE_RELIEF_PROB + 0.05);
  });

  test('right after a FAILURE, gate-blocked intermediates are NEVER served as new', () => {
    const { beginners, pool, progress } = buildGateBlockedPool();
    // Last attempt wrong (b6 was already wrong; re-record keeps 50%) → trickle
    // is gated off entirely, so a fresh miss never advances into harder material.
    recordAttempt(progress, beginners[6].id, false, 30_000);

    let pickedNewIntermediate = 0;
    for (let i = 0; i < 1000; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (q && q.difficulty === Difficulty.INTERMEDIATE && !progress.questionsAttempted.has(q.id)) {
        pickedNewIntermediate++;
      }
    }
    expect(pickedNewIntermediate).toBe(0);
  });
});
