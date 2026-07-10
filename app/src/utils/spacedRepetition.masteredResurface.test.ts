/**
 * Tests for the due-driven mastered resurface and the new-topic onboarding gate.
 *
 * Motivation: once a topic is mastered (and especially for concept-aware
 * courses, where high-stability advanced cards park in the IDLE bucket for
 * ~30 days), mastered HIGH-LEVEL questions stopped resurfacing during active
 * study. selectNextQuestion now (Anki-style, no artificial limits):
 *   - surfaces a MASTERED card whenever it is genuinely DUE (daysSinceLastReview
 *     >= its spacing interval), BEFORE the concept-aware call so DUE/IDLE
 *     bucketing can't starve it, advanced-weighted via pickMasteredResurface;
 *   - drains the due queue at rate 1 once the learner is caught up, and reduces
 *     it to ONBOARDING_DUE_RESURFACE_PROB while a new topic is still being
 *     met for the first time (the onboarding gate: firstUnlockedNew !== null);
 *   - defers entirely while the active topic is still being driven to mastery
 *     (isTopicInReview) so old reviews never starve current progress, and on a
 *     fresh failure (!lastAttemptWrong) so the just-failed question keeps its slot.
 *
 * dev-unlock is enabled so section/unit gating doesn't shadow the synthetic
 * topics used here.
 *
 * Run: npm test -- --testPathPattern=masteredResurface --watchAll=false
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
import { ConceptProgress } from './conceptSRS';
import {
  MASTERED_ADV_WEIGHT,
  MASTERED_BEGINNER_WEIGHT,
  MASTERED_INT_WEIGHT,
  SpacedRepetitionSystem,
  ConceptSelectionContext,
} from './spacedRepetition';

const backendPolicy = getSelectionPolicy(Course.BACKEND);
const DAY = 86_400_000;

beforeAll(() => {
  // Unlock every section/topic so gating doesn't interfere with the synthetic
  // mastered + active-learning topics.
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
  };
}

function makeQ(
  id: string,
  topic: Topic,
  difficulty: Difficulty,
  concepts?: string[],
): Question {
  return {
    id,
    topic,
    difficulty,
    type: QuestionType.MULTIPLE_CHOICE,
    question: `prompt for ${id}`,
    options: [
      { id: 'a', text: 'a', isCorrect: true },
      { id: 'b', text: 'b', isCorrect: false },
    ],
    explanation: 'e',
    concepts,
  };
}

function makeAttempt(qid: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return { questionId: qid, isCorrect, timestamp: Date.now() - msAgo, attempts: 1, timeSpent: 5_000 };
}

/** Push an attempt in array order; keeps questionsAttempted + lastAttempt in sync
 *  (lastAttempt is the O(1) last-review timestamp the due check reads). */
function recordAttempt(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number) {
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push(makeAttempt(qid, isCorrect, msAgo));
  progress.lastAttempt.set(qid, Date.now() - msAgo);
}

// ─────────────────────────────────────────────────────────────────────────
describe('isDrainCard', () => {
  test('coding (any difficulty) OR advanced (any type) are drain cards; other faded/MCQ are not', () => {
    const advMcq = makeQ('a', Topic.PY_BASICS, Difficulty.ADVANCED);
    const begMcq = makeQ('b', Topic.PY_BASICS, Difficulty.BEGINNER);
    const intMcq = makeQ('c', Topic.PY_BASICS, Difficulty.INTERMEDIATE);
    const begCoding = { id: 'd', topic: Topic.PY_BASICS, difficulty: Difficulty.BEGINNER, type: QuestionType.CODING } as unknown as Question;
    expect(SpacedRepetitionSystem.isDrainCard(advMcq)).toBe(true);   // advanced branch
    expect(SpacedRepetitionSystem.isDrainCard(begCoding)).toBe(true); // coding branch
    expect(SpacedRepetitionSystem.isDrainCard(begMcq)).toBe(false);
    expect(SpacedRepetitionSystem.isDrainCard(intMcq)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('hasDueMastered', () => {
  test('true when a mastered card is past its spacing interval', () => {
    const qs = [
      makeQ('q0', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('q1', Topic.PY_BASICS, Difficulty.BEGINNER),
    ];
    const progress = emptyProgress();
    // streak 1 → interval 1 day; reviewed 5 days ago → due.
    recordAttempt(progress, 'q0', true, 5 * DAY);
    recordAttempt(progress, 'q1', true, 5 * DAY);
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);
    expect(SpacedRepetitionSystem.hasDueMastered(qs, topicToQs, progress)).toBe(true);
  });

  test('false when all mastered cards were just reviewed', () => {
    const qs = [
      makeQ('q0', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('q1', Topic.PY_BASICS, Difficulty.BEGINNER),
    ];
    const progress = emptyProgress();
    recordAttempt(progress, 'q0', true, 60_000); // 1 min ago, interval 1 day → not due
    recordAttempt(progress, 'q1', true, 60_000);
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);
    expect(SpacedRepetitionSystem.hasDueMastered(qs, topicToQs, progress)).toBe(false);
  });

  test('false when the topic is not mastered (latest-wrong), even if stale', () => {
    const qs = [
      makeQ('q0', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('q1', Topic.PY_BASICS, Difficulty.BEGINNER),
    ];
    const progress = emptyProgress();
    recordAttempt(progress, 'q0', true, 30 * DAY);
    recordAttempt(progress, 'q1', false, 30 * DAY); // 50% latest-correct → not mastered
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);
    expect(SpacedRepetitionSystem.hasDueMastered(qs, topicToQs, progress)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('pickMasteredResurface — advanced-weighted', () => {
  test('biases ADVANCED > INTERMEDIATE > BEGINNER among mastered questions', () => {
    const qs = [
      makeQ('b0', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('b1', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('i0', Topic.PY_BASICS, Difficulty.INTERMEDIATE),
      makeQ('i1', Topic.PY_BASICS, Difficulty.INTERMEDIATE),
      makeQ('a0', Topic.PY_BASICS, Difficulty.ADVANCED),
      makeQ('a1', Topic.PY_BASICS, Difficulty.ADVANCED),
    ];
    const progress = emptyProgress();
    // Equal recency for every mastered card so the resurface bias reflects the
    // difficulty weights, not the spacing/due-ratio term (which is identical
    // when daysSinceLastReview and the correct-streak match across cards).
    qs.forEach(q => recordAttempt(progress, q.id, true, 2 * DAY));
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);

    const byDiff: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    for (let i = 0; i < 4000; i++) {
      const pick = SpacedRepetitionSystem.pickMasteredResurface(qs, topicToQs, progress);
      if (pick) byDiff[pick.difficulty]++;
    }
    expect(byDiff.advanced).toBeGreaterThan(byDiff.intermediate);
    expect(byDiff.intermediate).toBeGreaterThan(byDiff.beginner);
    // Roughly tracks the configured weights (12 : 2 : 1 with two cards each).
    const totalW = 2 * MASTERED_ADV_WEIGHT + 2 * MASTERED_INT_WEIGHT + 2 * MASTERED_BEGINNER_WEIGHT;
    const advShare = byDiff.advanced / 4000;
    expect(advShare).toBeGreaterThan((2 * MASTERED_ADV_WEIGHT) / totalW - 0.08);
  });

  test('prefers the OVERDUE mastered question over a freshly-reviewed one (SR-driven, least-recent fallback)', () => {
    // Same topic, same difficulty → difficulty weight is neutral, so the
    // spacing/due-ratio term alone decides. One card reviewed 60 days ago is
    // far past its interval; the other was reviewed an hour ago.
    const qs = [
      makeQ('q-old', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('q-new', Topic.PY_BASICS, Difficulty.BEGINNER),
    ];
    const progress = emptyProgress();
    recordAttempt(progress, 'q-old', true, 60 * DAY);   // overdue (interval ~1-3 days)
    recordAttempt(progress, 'q-new', true, 60 * 60_000); // just reviewed
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);

    let oldPicks = 0;
    for (let i = 0; i < 2000; i++) {
      const pick = SpacedRepetitionSystem.pickMasteredResurface(qs, topicToQs, progress);
      if (pick?.id === 'q-old') oldPicks++;
    }
    expect(oldPicks / 2000).toBeGreaterThan(0.8);
  });

  test('returns null when no mastered topic is present', () => {
    const qs = [makeQ('q0', Topic.PY_BASICS, Difficulty.BEGINNER)];
    const progress = emptyProgress(); // unseen → not mastered
    const topicToQs = new Map<string, Question[]>([[Topic.PY_BASICS, qs]]);
    expect(SpacedRepetitionSystem.pickMasteredResurface(qs, topicToQs, progress)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('selectNextQuestion — due-driven resurface + onboarding gate', () => {
  /**
   * Caught up (no new content left): a DUE advanced mastered card surfaces every
   * review slot — even though a concept-aware DUE card (l0) exists. The resurface
   * runs before concept-aware and is advanced-weighted, so the high-level card
   * dominates and the concept-DUE beginner card is mostly NOT served.
   */
  test('drains the due queue (advanced-weighted) when caught up, even over a concept-DUE card', () => {
    const mastered = [
      makeQ('m-beg', Topic.PY_BASICS, Difficulty.BEGINNER, ['cM1']),
      makeQ('m-int', Topic.PY_BASICS, Difficulty.INTERMEDIATE, ['cM2']),
      makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED, ['cM3']),
    ];
    const l0 = makeQ('l0', Topic.PY_REGEX, Difficulty.BEGINNER, ['cL0']);
    const pool = [...mastered, l0];

    const progress = emptyProgress();
    recordAttempt(progress, 'm-beg', true, 5 * DAY);
    recordAttempt(progress, 'm-int', true, 5 * DAY);
    recordAttempt(progress, 'm-adv', true, 5 * DAY); // M mastered + due
    recordAttempt(progress, 'l0', true, 4 * DAY);    // L mastered + due (beginner)
    // Three recent m-beg reviews: active topic = PY_BASICS (mastered, NOT in
    // review), and the cooldown window holds only m-beg → m-int/m-adv/l0 stay
    // eligible and the last attempt is correct.
    recordAttempt(progress, 'm-beg', true, 3 * 60_000);
    recordAttempt(progress, 'm-beg', true, 2 * 60_000);
    recordAttempt(progress, 'm-beg', true, 1 * 60_000);

    // Concept state: M concepts high-stability (IDLE); l0 concept never
    // reinforced (stability 0 → concept-DUE). Without the resurface running
    // before concept-aware, concept-aware would keep returning l0.
    const NOW = Date.now();
    const conceptProgress: ConceptProgress = {
      cM1: { successes: 12, failures: 0, lastSeen: NOW, stability: 200, masteredAt: NOW },
      cM2: { successes: 12, failures: 0, lastSeen: NOW, stability: 200, masteredAt: NOW },
      cM3: { successes: 12, failures: 0, lastSeen: NOW, stability: 200, masteredAt: NOW },
      cL0: { successes: 0, failures: 0, lastSeen: 0, stability: 0 },
    };
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };

    let advPicks = 0;
    let basicsPicks = 0;
    let l0Picks = 0;
    const N = 1000;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, ctx, backendPolicy);
      if (!q) continue;
      if (q.topic === Topic.PY_BASICS) basicsPicks++;
      if (q.id === 'm-adv') advPicks++;
      if (q.id === 'l0') l0Picks++;
    }
    // Due mastered material dominates and the advanced card leads it...
    expect(basicsPicks / N).toBeGreaterThan(0.8);
    expect(advPicks / N).toBeGreaterThan(0.5);
    // ...while the concept-DUE beginner card is largely passed over.
    expect(l0Picks / N).toBeLessThan(0.2);
    expect(advPicks).toBeGreaterThan(l0Picks);
  });

  /**
   * Onboarding gate: when the learner is caught up (no unseen content) the due
   * mastered review fills nearly every slot; once an unseen new question exists
   * (firstUnlockedNew !== null) new content dominates and mastered review is
   * reduced — but NOT off (it still surfaces). No covered topic is below mastery
   * here, so the resurface isn't deferred — this isolates the gate alone.
   */
  test('caught up drains due review every slot; onboarding reduces it (not off)', () => {
    const mastered = [
      makeQ('m-beg', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('m-int', Topic.PY_BASICS, Difficulty.INTERMEDIATE),
      makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED),
    ];

    function seed(): UserProgress {
      const p = emptyProgress();
      recordAttempt(p, 'm-beg', true, 5 * DAY);
      recordAttempt(p, 'm-int', true, 5 * DAY);
      recordAttempt(p, 'm-adv', true, 5 * DAY); // M mastered + due
      // Recent m-beg reviews → active topic = PY_BASICS (mastered), cooldown = m-beg.
      recordAttempt(p, 'm-beg', true, 3 * 60_000);
      recordAttempt(p, 'm-beg', true, 2 * 60_000);
      recordAttempt(p, 'm-beg', true, 1 * 60_000);
      return p;
    }

    const run = (pool: Question[], progress: UserProgress, newId: string) => {
      let mastPicks = 0, newPicks = 0;
      const N = 1500;
      for (let i = 0; i < N; i++) {
        const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
        if (!q) continue;
        if (q.topic === Topic.PY_BASICS) mastPicks++;
        if (q.id === newId) newPicks++;
      }
      return { masteredRate: mastPicks / N, newRate: newPicks / N };
    };

    // Caught up: no unseen questions → due review fills every slot.
    const caughtUp = run([...mastered], seed(), '');
    // Onboarding a STARTED topic: n0 already seen (so the lead topic is mid first-
    // exposure, not a brand-new-topic boundary → reduced-rate resurface, not a
    // drain), with > COMPLETION_PUSH_THRESHOLD (3) unseen remaining so the normal
    // 75/25 split applies. The lead unseen beginner served is n1.
    const newQs = Array.from({ length: 6 }, (_, i) =>
      makeQ(`n${i}`, Topic.PY_DECORATORS, Difficulty.BEGINNER));
    const onbProgress = seed();
    recordAttempt(onbProgress, 'n0', true, 10 * 60_000); // lead topic started
    const onboarding = run([...mastered, ...newQs], onbProgress, 'n1');

    // Caught up: mastered due review dominates; no new content served.
    expect(caughtUp.masteredRate).toBeGreaterThan(0.9);
    // Onboarding: new content dominates, but mastered review still surfaces
    // (reduced, not off) and is clearly rarer than when caught up.
    expect(onboarding.newRate).toBeGreaterThan(0.5);
    expect(onboarding.masteredRate).toBeGreaterThan(0.05);
    expect(caughtUp.masteredRate).toBeGreaterThan(onboarding.masteredRate + 0.3);
  });

  /**
   * Topic-boundary hard drain: when the next content is a BRAND-NEW (0-seen)
   * topic and a due mastered review is pending, no new question is served until
   * the due queue is drained — guaranteeing the mastered card (e.g. threading)
   * gets reviewed at the boundary. Once the due cards are refreshed (no longer
   * due), the new topic opens.
   */
  test('hard-drains the due queue before a brand-new topic opens', () => {
    const mastered = [
      makeQ('m-beg', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED),
    ];
    // Next topic is brand-new (none of its questions seen) with > 3 unseen.
    const newQs = Array.from({ length: 5 }, (_, i) =>
      makeQ(`n${i}`, Topic.PY_DECORATORS, Difficulty.BEGINNER));
    const pool = [...mastered, ...newQs];

    const seedDue = (): UserProgress => {
      const p = emptyProgress();
      recordAttempt(p, 'm-beg', true, 5 * DAY);
      recordAttempt(p, 'm-adv', true, 5 * DAY); // M mastered + DUE
      return p;
    };

    // (a) due pending → boundary drain: zero new content, the due advanced card
    // is surfaced (drained).
    const due = seedDue();
    let newPicks = 0, advPicks = 0;
    const N = 800;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, due, undefined, backendPolicy);
      if (!q) continue;
      if (q.topic === Topic.PY_DECORATORS) newPicks++;
      if (q.id === 'm-adv') advPicks++;
    }
    expect(newPicks).toBe(0);              // hard gate: no new topic until drained
    expect(advPicks / N).toBeGreaterThan(0.3); // the due card is actively drained

    // (b) same boundary but the mastered cards were just reviewed (not due) →
    // nothing to drain → the new topic opens (new content flows).
    const fresh = emptyProgress();
    recordAttempt(fresh, 'm-beg', true, 60_000);
    recordAttempt(fresh, 'm-adv', true, 60_000); // mastered but NOT due
    let newPicks2 = 0;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, fresh, undefined, backendPolicy);
      if (q && q.topic === Topic.PY_DECORATORS) newPicks2++;
    }
    expect(newPicks2 / N).toBeGreaterThan(0.5); // no due queue → new topic opens
  });

  /**
   * Frontier trigger (the real motivation): the topic-finish drain must fire even
   * when the next servable unseen question is a STARTED earlier topic (a gap) —
   * the old `!leadStarted` trigger required the next topic to be 0-seen and so
   * never engaged for a learner mid-course. Here PY_CLI (deep) is fully covered =
   * the frontier, while PY_BASICS (earlier) still has an unseen question, so
   * firstUnlockedNew points at a *started* topic. The drain still fires, hard-gates
   * the new question, and serves ONLY drain cards (CODING/ADVANCED) — the due
   * beginner-MCQ mastered card is excluded.
   */
  test('drain fires on topic-finish even when the lead unseen is a started topic; excludes non-drain cards', () => {
    // Advanced card is a drain card (isDrainCard = coding || advanced); the
    // coding branch is covered by the isDrainCard unit test below.
    const masterAdv = makeQ('mc-adv', Topic.PY_CLI, Difficulty.ADVANCED); // drain card (advanced)
    const masterMcq = makeQ('mc-mcq', Topic.PY_CLI, Difficulty.BEGINNER); // non-drain (beginner MCQ)
    const gapSeen = makeQ('gap-seen', Topic.PY_BASICS, Difficulty.BEGINNER);
    const gapUnseen = makeQ('gap-unseen', Topic.PY_BASICS, Difficulty.BEGINNER);
    const pool = [masterAdv, masterMcq, gapSeen, gapUnseen];

    // (a) due drain backlog + a started gap topic → hard gate + drain-cards-only.
    const due = emptyProgress();
    recordAttempt(due, 'mc-adv', true, 5 * DAY);   // PY_CLI mastered + due (ADVANCED → drain card)
    recordAttempt(due, 'mc-mcq', true, 5 * DAY);   // PY_CLI mastered + due (beginner MCQ → NOT a drain card)
    recordAttempt(due, 'gap-seen', true, 5 * DAY); // PY_BASICS started but NOT covered (gap-unseen unseen)

    let newPicks = 0, advPicks = 0, mcqPicks = 0;
    const N = 800;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, due, undefined, backendPolicy);
      if (!q) continue;
      if (q.id === 'gap-unseen') newPicks++;
      if (q.id === 'mc-adv') advPicks++;
      if (q.id === 'mc-mcq') mcqPicks++;
    }
    expect(newPicks).toBe(0);                  // hard gate even though the gap topic is started
    expect(advPicks / N).toBeGreaterThan(0.3); // the advanced drain card is actively drained
    expect(mcqPicks).toBe(0);                  // the beginner-MCQ mastered card is excluded from the drain

    // (b) the drain card refreshed (not due) → no drain card due → gate lifts and
    // the gap topic's unseen question flows, even though the beginner MCQ is still due.
    const lifted = emptyProgress();
    recordAttempt(lifted, 'mc-adv', true, 60_000);   // just reviewed → not due
    recordAttempt(lifted, 'mc-mcq', true, 5 * DAY);  // still due, but not a drain card
    recordAttempt(lifted, 'gap-seen', true, 5 * DAY);
    let newPicks2 = 0;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, lifted, undefined, backendPolicy);
      if (q && q.id === 'gap-unseen') newPicks2++;
    }
    expect(newPicks2 / N).toBeGreaterThan(0.5); // no drain card due → new content flows
  });

  /**
   * Strictly-due drain: while draining, only drain cards PAST their interval are
   * served — a not-yet-due coding/advanced card is held back, so each served card
   * leaves the due count and the visible counter falls by exactly one.
   */
  test('a drain serves only strictly-due drain cards (not-yet-due ones are held back)', () => {
    const dueAdv = makeQ('due-adv', Topic.PY_BASICS, Difficulty.ADVANCED);
    const freshAdv = makeQ('fresh-adv', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'due-adv', true, 10 * DAY);  // due (interval 3 days, 10 ≥ 3)
    recordAttempt(p, 'fresh-adv', true, 60_000);  // NOT due (just reviewed)
    // PY_BASICS fully covered + mastered → frontier covered, no unseen → drain.
    let duePicks = 0, freshPicks = 0;
    const N = 600;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion([dueAdv, freshAdv], p, undefined, backendPolicy);
      if (q?.id === 'due-adv') duePicks++;
      if (q?.id === 'fresh-adv') freshPicks++;
    }
    expect(duePicks).toBeGreaterThan(0);
    expect(freshPicks).toBe(0); // the not-yet-due drain card is never served during the drain
  });

  /**
   * Current-progress safeguard: while the ACTIVE topic is still being driven to
   * mastery (in review / has an unlock blocker), the resurface defers so old due
   * reviews never starve it — the in-review topic's failing card dominates.
   */
  test('defers to current progress while the active topic is still in review', () => {
    const mastered = [
      makeQ('m-beg', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED),
    ];
    const l0 = makeQ('l0', Topic.PY_REGEX, Difficulty.BEGINNER);
    const l1 = makeQ('l1', Topic.PY_REGEX, Difficulty.BEGINNER);
    const pool = [...mastered, l0, l1];

    const progress = emptyProgress();
    recordAttempt(progress, 'm-beg', true, 5 * DAY);
    recordAttempt(progress, 'm-adv', true, 5 * DAY); // M mastered + due
    recordAttempt(progress, 'l1', true, 60 * 60_000);
    recordAttempt(progress, 'l1', false, 50 * 60_000); // l1 latest-wrong → L in review
    // Recent l0 reviews → active topic = PY_REGEX (in review), cooldown = l0,
    // l1 stays eligible, last attempt correct.
    recordAttempt(progress, 'l0', true, 3 * 60_000);
    recordAttempt(progress, 'l0', true, 2 * 60_000);
    recordAttempt(progress, 'l0', true, 1 * 60_000);

    let l1Picks = 0;
    let masteredPicks = 0;
    const N = 800;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (q.id === 'l1') l1Picks++;
      if (q.topic === Topic.PY_BASICS) masteredPicks++;
    }
    // The in-review unlock blocker dominates; the due mastered cards defer.
    expect(l1Picks / N).toBeGreaterThan(0.5);
    expect(masteredPicks / N).toBeLessThan(0.2);
  });

  /**
   * Failure priority: immediately after a wrong last attempt, the resurface
   * roll is gated off (!lastAttemptWrong), so the just-failed question keeps
   * its slot and a mastered question does not steal it.
   */
  test('a fresh failure is not displaced by a mastered resurface', () => {
    const mastered = [
      makeQ('m-beg', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED),
    ];
    const active = [makeQ('fail-q', Topic.PY_REGEX, Difficulty.BEGINNER)];
    const pool = [...mastered, ...active];

    const progress = emptyProgress();
    mastered.forEach((q) => recordAttempt(progress, q.id, true, 5 * DAY)); // mastered + due
    recordAttempt(progress, 'fail-q', true, 5 * 60_000);
    // The very last attempt is a failure on the active topic.
    recordAttempt(progress, 'fail-q', false, 30_000);

    let failPicks = 0;
    let masteredPicks = 0;
    const N = 500;
    for (let i = 0; i < N; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(pool, progress, undefined, backendPolicy);
      if (!q) continue;
      if (q.id === 'fail-q') failPicks++;
      if (q.topic === Topic.PY_BASICS) masteredPicks++;
    }
    // The just-failed question dominates (active-topic failure boost), and the
    // mastered resurface never fires on a fresh failure.
    expect(failPicks / N).toBeGreaterThan(0.5);
    expect(masteredPicks / N).toBeLessThan(0.15);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('getReviewStatus (mode indicator)', () => {
  test('mode = drain when the frontier topic is finished and a drain backlog is due', () => {
    const mAdv = makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'm-adv', true, 5 * DAY); // PY_BASICS covered + due drain card
    const s = SpacedRepetitionSystem.getReviewStatus([mAdv], p, backendPolicy);
    expect(s.mode).toBe('drain');
    expect(s.drainQueueCount).toBe(1);
  });

  test('mode = new while mid-topic, still reporting the pending drain count', () => {
    const cliSeen = makeQ('cli-seen', Topic.PY_CLI, Difficulty.BEGINNER);
    const cliUnseen = makeQ('cli-unseen', Topic.PY_CLI, Difficulty.BEGINNER);
    const mAdv = makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'm-adv', true, 5 * DAY);   // PY_BASICS mastered + due drain card (pending)
    recordAttempt(p, 'cli-seen', true, 60_000); // PY_CLI started but NOT covered (frontier, not finished)
    const s = SpacedRepetitionSystem.getReviewStatus([cliSeen, cliUnseen, mAdv], p, backendPolicy);
    expect(s.mode).toBe('new');
    expect(s.drainQueueCount).toBe(1);
  });

  test('mode = review when caught up with no due drain backlog', () => {
    const mAdv = makeQ('m-adv', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'm-adv', true, 60_000); // just reviewed → not due
    const s = SpacedRepetitionSystem.getReviewStatus([mAdv], p, backendPolicy);
    expect(s.mode).toBe('review');
    expect(s.drainQueueCount).toBe(0);
  });

  test('a correct answer clears the card from the count; count falls by one', () => {
    const a1 = makeQ('a1', Topic.PY_BASICS, Difficulty.ADVANCED);
    const a2 = makeQ('a2', Topic.PY_BASICS, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'a1', true, 5 * DAY); // due
    recordAttempt(p, 'a2', true, 5 * DAY); // due
    expect(SpacedRepetitionSystem.getReviewStatus([a1, a2], p, backendPolicy).drainQueueCount).toBe(2);
    recordAttempt(p, 'a1', true, 0); // review a1 correctly, just now
    expect(SpacedRepetitionSystem.getReviewStatus([a1, a2], p, backendPolicy).drainQueueCount).toBe(1);
  });

  test('a WRONG answer keeps the card in the count (still in review), then clears on a correct one', () => {
    // a1 and a2 in DIFFERENT mastered topics, so missing a1 (which drops PY_BASICS
    // below mastery) doesn't perturb a2's mastered&&due count. Real topics are
    // large and don't demote on a single miss; this keeps the unit isolated.
    const a1 = makeQ('a1', Topic.PY_BASICS, Difficulty.ADVANCED);
    const a2 = makeQ('a2', Topic.PY_REGEX, Difficulty.ADVANCED);
    const p = emptyProgress();
    recordAttempt(p, 'a1', true, 5 * DAY); // PY_BASICS mastered + due
    recordAttempt(p, 'a2', true, 5 * DAY); // PY_REGEX mastered + due
    expect(SpacedRepetitionSystem.getReviewStatus([a1, a2], p, backendPolicy).drainQueueCount).toBe(2);
    // Miss a1 (1 min ago): it's now your most-recent attempt and it was wrong, so
    // it stays in the queue (you'll retry it). Count holds at 2 (a1 retry + a2 due).
    recordAttempt(p, 'a1', false, 60_000);
    expect(SpacedRepetitionSystem.getReviewStatus([a1, a2], p, backendPolicy).drainQueueCount).toBe(2);
    // Get a1 right (newest attempt) → no longer the last-wrong, not yet due → it
    // leaves the queue → count falls to 1 (just a2).
    recordAttempt(p, 'a1', true, 0);
    expect(SpacedRepetitionSystem.getReviewStatus([a1, a2], p, backendPolicy).drainQueueCount).toBe(1);
  });
});
