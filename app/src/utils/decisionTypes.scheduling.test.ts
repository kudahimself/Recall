/**
 * How the decision and design types meet the scheduler: their place in the
 * ramp, explain cards served only in review, and how partial credit (choose
 * and justify, explain) counts toward the pass bar, the streak and FSRS.
 *
 * Run: npm test -- --testPathPattern=decisionTypes --watchAll=false
 */
import { Difficulty, Question, QuestionAttempt, QuestionType, Topic, UserProgress } from '../types';
import {
  SAMPLE_CHOOSE_JUSTIFY,
  SAMPLE_EXPLAIN,
  SAMPLE_PREDICT_OUTCOME,
  SAMPLE_SPOT_FLAW,
} from '../dev/sampleQuestions';
import {
  CardPickContext,
  attemptGrade,
  emptyStore,
  pickFamilyCard,
  recordAttempt,
} from './familySchedule';
import { buildReviewList, nextNewCard, nextUnseenCard } from './reviewSession';
import {
  CREDIT_CORRECT_THRESHOLD,
  CHOOSE_JUSTIFY_DECISION_CREDIT,
  PARTIAL_CREDIT_GRADE_CAP,
  RAMP_TYPE_ORDER,
  SpacedRepetitionSystem as SRS,
  familyOf,
  isPassingCredit,
  isRampDoneAtBar,
  isReviewOnly,
  topicRamp,
} from './spacedRepetition';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 10, 1, 9);
const TOPIC = Topic.DE_IDEMPOTENT_LOADS;

const MCQ: Question = {
  id: 'fx-mcq',
  type: QuestionType.MULTIPLE_CHOICE,
  difficulty: Difficulty.BEGINNER,
  topic: TOPIC,
  question: 'A load is idempotent when...',
  explanation: 'x',
  options: [
    { id: 'a', text: 'running it twice leaves the target as running it once', isCorrect: true },
    { id: 'b', text: 'it never fails', isCorrect: false },
  ],
};

// Bank order deliberately not ramp order: the explain card comes first.
const POOL: Question[] = [SAMPLE_EXPLAIN, SAMPLE_SPOT_FLAW, SAMPLE_CHOOSE_JUSTIFY, SAMPLE_PREDICT_OUTCOME, MCQ];
const RAMP_IDS = [MCQ.id, SAMPLE_PREDICT_OUTCOME.id, SAMPLE_CHOOSE_JUSTIFY.id, SAMPLE_SPOT_FLAW.id];
const byId = new Map(POOL.map(q => [q.id, q]));

function progressFrom(history: QuestionAttempt[]): UserProgress {
  const lastAttempt = new Map<string, number>();
  for (const a of history) lastAttempt.set(a.questionId, a.timestamp);
  return {
    questionsAttempted: new Set(history.map(a => a.questionId)),
    correctAnswers: new Set(history.filter(a => a.isCorrect).map(a => a.questionId)),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt,
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

const answer = (id: string, at: number, credit = 1): QuestionAttempt => ({
  questionId: id,
  timestamp: at,
  isCorrect: isPassingCredit(credit),
  attempts: 1,
  timeSpent: 12_000,
  credit,
});

function ctxFor(history: QuestionAttempt[]): CardPickContext {
  const progress = progressFrom(history);
  return {
    progress,
    latest: SRS.latestCorrectness(progress),
    resting: new Set(),
    served: new Set(),
    unlocked: null,
    byTopic: new Map([[TOPIC, POOL]]),
  };
}

function storeFor(history: QuestionAttempt[]) {
  let store = emptyStore(byId);
  const seen: QuestionAttempt[] = [];
  for (const a of history) {
    seen.push(a);
    store = recordAttempt(store, byId.get(a.questionId)!, a, [...seen]);
  }
  return store;
}

describe('ramp order', () => {
  it('places the new types by cognitive load and keeps explain last', () => {
    const rank = (t: QuestionType) => RAMP_TYPE_ORDER.indexOf(t);
    expect(rank(QuestionType.PREDICT_OUTCOME)).toBeLessThan(rank(QuestionType.CHOOSE_JUSTIFY));
    expect(rank(QuestionType.CHOOSE_JUSTIFY)).toBeLessThan(rank(QuestionType.PARSONS));
    expect(rank(QuestionType.PARSONS)).toBeLessThan(rank(QuestionType.SPOT_FLAW));
    expect(rank(QuestionType.SPOT_FLAW)).toBeLessThan(rank(QuestionType.CODING));
    expect(RAMP_TYPE_ORDER[RAMP_TYPE_ORDER.length - 1]).toBe(QuestionType.EXPLAIN);
    expect(RAMP_TYPE_ORDER.length).toBe(Object.values(QuestionType).length);
  });

  it("leaves the explain card out of the topic's ramp", () => {
    expect(isReviewOnly(SAMPLE_EXPLAIN)).toBe(true);
    expect(POOL.filter(q => q !== SAMPLE_EXPLAIN).some(isReviewOnly)).toBe(false);
    expect(topicRamp(POOL).map(q => q.id)).toEqual(RAMP_IDS);
  });
});

describe('explain cards are served only in review', () => {
  it('is never the next new card, before or after the ramp', () => {
    const pools = { course: POOL, serve: POOL };
    expect(nextNewCard(pools, ctxFor([])).card?.id).toBe(MCQ.id);
    const done = RAMP_IDS.map((id, i) => answer(id, T0 + i * 60_000));
    expect(nextNewCard(pools, ctxFor(done)).card).toBeNull();
  });

  it('is never served as unseen practice', () => {
    const done = RAMP_IDS.map((id, i) => answer(id, T0 + i * 60_000));
    expect(nextUnseenCard({ course: POOL, serve: POOL }, ctxFor(done))).toBeNull();
  });

  it('is never served unseen by the older selector', () => {
    expect(SRS.selectNextQuestion([SAMPLE_EXPLAIN], progressFrom([]))).toBeNull();
  });

  it('stays out of a family review while the ramp is unfinished', () => {
    const history = [answer(MCQ.id, T0), answer(SAMPLE_PREDICT_OUTCOME.id, T0 + 60_000)];
    const store = storeFor(history);
    const f = familyOf(SAMPLE_EXPLAIN);
    for (let i = 0; i < 5; i++) {
      const ctx = ctxFor(history);
      const pick = pickFamilyCard(POOL, store.families[f], ctx);
      expect(pick?.id).not.toBe(SAMPLE_EXPLAIN.id);
    }
  });

  it('joins the review rotation once the ramp is answered', () => {
    const history = RAMP_IDS.map((id, i) => answer(id, T0 + i * 60_000));
    const store = storeFor(history);
    const f = familyOf(SAMPLE_EXPLAIN);
    // Last review was spot the flaw, so the unseen explain card (seen longest ago) is next.
    expect(store.families[f].lastType).toBe(QuestionType.SPOT_FLAW);
    expect(pickFamilyCard(POOL, store.families[f], ctxFor(history))?.id).toBe(SAMPLE_EXPLAIN.id);

    const { entries } = buildReviewList(POOL, progressFrom(history), store, {}, T0 + 60 * DAY);
    expect(entries.map(e => e.id)).toEqual([SAMPLE_EXPLAIN.id]);
  });
});

describe('partial credit', () => {
  it('turns credit into pass, pass under the bar, or miss', () => {
    expect(isPassingCredit(1)).toBe(true);
    expect(isPassingCredit(CHOOSE_JUSTIFY_DECISION_CREDIT)).toBe(true);
    expect(isPassingCredit(0.25)).toBe(false);
    expect(isPassingCredit(0)).toBe(false);
    expect(CHOOSE_JUSTIFY_DECISION_CREDIT).toBeLessThan(CREDIT_CORRECT_THRESHOLD);
    // 3 of 4 key points is exactly the bar.
    expect(3 / 4).toBeGreaterThanOrEqual(CREDIT_CORRECT_THRESHOLD);
  });

  it('caps the FSRS grade of a pass under the bar at Hard, like a hinted pass', () => {
    const fast = { isCorrect: true, timeSpent: 1_000, hintTierUsed: 0 as const };
    expect(attemptGrade(SAMPLE_CHOOSE_JUSTIFY, { ...fast, credit: 1 })).toBe(4);
    expect(attemptGrade(SAMPLE_CHOOSE_JUSTIFY, { ...fast, credit: 0.5 })).toBe(PARTIAL_CREDIT_GRADE_CAP);
    expect(attemptGrade(SAMPLE_EXPLAIN, { ...fast, credit: 0.75 })).toBe(4);
    expect(attemptGrade(SAMPLE_EXPLAIN, { ...fast, isCorrect: false, credit: 0.25 })).toBe(1);
    // Legacy attempts without credit are unchanged.
    expect(attemptGrade(MCQ, { isCorrect: true, timeSpent: 1_000 })).toBe(4);
  });

  it('gives the same grades as before to hinted coding passes', () => {
    for (const [tier, credit] of [[1, 0.8], [1, 0.5], [2, 0.6], [2, 0.25]] as const) {
      const a = { isCorrect: true, timeSpent: 1_000, hintTierUsed: tier };
      expect(attemptGrade(MCQ, { ...a, credit })).toBe(attemptGrade(MCQ, a));
    }
  });

  it('resets the streak on half credit, so the card comes back sooner', () => {
    const id = SAMPLE_CHOOSE_JUSTIFY.id;
    const full = progressFrom([answer(id, T0), answer(id, T0 + 3 * DAY)]);
    expect(SRS.getCorrectStreak(id, full)).toBe(2);
    const half = progressFrom([answer(id, T0), answer(id, T0 + 3 * DAY, 0.5)]);
    expect(SRS.getCorrectStreak(id, half)).toBe(0);
  });

  it('counts the fraction toward the topic unlock bar', () => {
    const allFull = RAMP_IDS.map((id, i) => answer(id, T0 + i * 60_000));
    expect(isRampDoneAtBar(POOL, SRS.latestCredit(progressFrom(allFull)))).toBe(true);
    // One half-credit card in four: 3.5 / 4 = 87.5%, still above the 80% bar.
    const oneHalf = allFull.map(a => (a.questionId === SAMPLE_CHOOSE_JUSTIFY.id ? { ...a, credit: 0.5 } : a));
    expect(isRampDoneAtBar(POOL, SRS.latestCredit(progressFrom(oneHalf)))).toBe(true);
    // Two: 3 / 4 = 75%, below it.
    const twoHalf = oneHalf.map(a => (a.questionId === MCQ.id ? { ...a, credit: 0.5 } : a));
    expect(isRampDoneAtBar(POOL, SRS.latestCredit(progressFrom(twoHalf)))).toBe(false);
  });
});
