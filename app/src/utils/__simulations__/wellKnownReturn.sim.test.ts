/**
 * Well-known cards come back at or after their interval, never before.
 *
 * drainReplay measures this on a real exported state but skips itself without
 * one, so this is the version that runs in every test run. It builds an
 * experienced learner on the Databricks course (concept-aware, 632 cards):
 * every card answered correctly 1 to 7 times in a row on the normal spacing
 * curve, the latest answer between 0 and 1.5 intervals ago, so the start has
 * a mix of resting, nearly due and overdue cards. It then studies DAYS days of
 * PER_DAY questions, answering the way App.handleAnswer records them, and
 * checks every review of a card on a streak of WELL_KNOWN_STREAK or more.
 *
 * Tolerance: none. Every such review must land at or after 100 percent of the
 * card's interval (getEffectiveInterval at the moment it is served). Before
 * the rest was added this run served 19 of its 109 such reviews early, at a
 * median of 58 percent of interval; with it, 0 of 90.
 *
 * Run: CI=true npx react-scripts test --testPathPattern=wellKnownReturn --watchAll=false
 */
import { SpacedRepetitionSystem as SRS, ConceptSelectionContext, WELL_KNOWN_STREAK } from '../spacedRepetition';
import {
  applyReview, fsrsInitDifficulty, fsrsNextDifficulty, gradeFromResponseTime, ConceptProgress,
} from '../conceptSRS';
import { buildQuestionConceptIndex, migrateAttemptHistoryToConceptProgress } from '../conceptMigration';
import { DATABRICKS_CONCEPTS } from '../conceptRegistry';
import { seedMasteredTopics } from '../masteryMigration';
import { getSelectionPolicy, getTopicOrder } from '../courseConfig';
import { questions } from '../../data/questions';
import { Course, QuestionAttempt, UserProgress } from '../../types';
import { seededRandom } from './simHarness';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS = 14;
const PER_DAY = 40;
const P_OK = 0.9;

const CONCEPT_BETAS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const c of DATABRICKS_CONCEPTS) if (c.beta !== undefined) o[c.id] = c.beta;
  return o;
})();

it('streak >= WELL_KNOWN_STREAK cards are never served before their interval', () => {
  const course = Course.DATABRICKS;
  const order = new Set(getTopicOrder(course));
  const pool = questions.filter(q => order.has(q.topic));
  const policy = getSelectionPolicy(course);
  const START = Date.UTC(2026, 8, 1, 18);
  const rng = seededRandom(11);

  // Experienced learner: streak s on the 1, 3, 7, 14, 30, 60, 120 day curve.
  const history: QuestionAttempt[] = [];
  for (const q of pool) {
    const streak = 1 + Math.floor(rng() * 7);
    let t = START - rng() * 1.5 * SRS.getTargetInterval(streak) * MS_PER_DAY;
    for (let k = streak; k >= 1; k--) {
      history.push({ questionId: q.id, timestamp: t, isCorrect: true, attempts: 1, timeSpent: 20_000 });
      t -= SRS.getTargetInterval(k - 1) * MS_PER_DAY;
    }
  }
  history.sort((a, b) => a.timestamp - b.timestamp);
  const lastAttempt = new Map<string, number>();
  for (const a of history) lastAttempt.set(a.questionId, a.timestamp);
  let progress: UserProgress = {
    questionsAttempted: new Set(pool.map(q => q.id)),
    correctAnswers: new Set(pool.map(q => q.id)),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt,
    repetitionQueue: new Map(),
    masteredTopics: seedMasteredTopics(pool, history),
  };
  let concepts: ConceptProgress = migrateAttemptHistoryToConceptProgress(history, buildQuestionConceptIndex(pool));
  let cardDifficulty: Record<string, number> = {};

  const realRandom = Math.random;
  Math.random = rng;
  let clock = START;
  const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  const early: { id: string; ratio: number }[] = [];
  let wellKnownReviews = 0;
  try {
    for (let day = 0; day < DAYS; day++) {
      clock = START + day * MS_PER_DAY;
      for (let i = 0; i < PER_DAY; i++) {
        const ctx: ConceptSelectionContext = { progress: concepts, betas: CONCEPT_BETAS };
        const q = SRS.selectNextQuestion(pool, progress, ctx, policy, cardDifficulty);
        if (!q) break;
        const prevTs = progress.lastAttempt.get(q.id) ?? 0;
        if (prevTs > 0 && SRS.getCorrectStreak(q.id, progress) >= WELL_KNOWN_STREAK) {
          wellKnownReviews++;
          const ratio = (clock - prevTs) / MS_PER_DAY / SRS.getEffectiveInterval(q.id, progress, cardDifficulty);
          if (ratio < 1) early.push({ id: q.id, ratio });
        }

        const ok = rng() < P_OK;
        const timeSpent = 20_000 + Math.floor(rng() * 40_000);
        clock += timeSpent;
        // Mirror App.handleAnswer.
        const attemptHistory = [...progress.attemptHistory, {
          questionId: q.id, timestamp: clock, isCorrect: ok, attempts: 1,
          timeSpent, credit: ok ? 1 : 0, hintTierUsed: 0,
        } as QuestionAttempt];
        const nextLast = new Map(progress.lastAttempt);
        nextLast.set(q.id, clock);
        const masteredTopics = SRS.updateMasteredTopics({ ...progress, attemptHistory }, q.topic, questions);
        progress = { ...progress, attemptHistory, lastAttempt: nextLast, masteredTopics };
        const grade = gradeFromResponseTime(q.type, timeSpent, ok);
        const prevD = cardDifficulty[q.id] ?? 0;
        if (q.concepts && q.concepts.length > 0) {
          const r = applyReview(q.concepts, grade, prevD, prevTs > 0 ? (clock - prevTs) / MS_PER_DAY : 0,
            concepts, CONCEPT_BETAS, clock);
          concepts = { ...concepts, ...r.conceptUpdates };
        }
        cardDifficulty = { ...cardDifficulty, [q.id]: prevD <= 0 ? fsrsInitDifficulty(grade) : fsrsNextDifficulty(prevD, grade) };
      }
    }
  } finally {
    nowSpy.mockRestore();
    Math.random = realRandom;
  }

  // Not vacuous: plenty of well-known cards fell due and were reviewed.
  expect(wellKnownReviews).toBeGreaterThan(50);
  expect(early.slice(0, 5)).toEqual([]);
});
