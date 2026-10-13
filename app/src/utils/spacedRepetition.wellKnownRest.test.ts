/**
 * Well-known cards rest until due (WELL_KNOWN_STREAK).
 *
 * A card answered correctly WELL_KNOWN_STREAK times in a row waits out its own
 * interval before it comes back. The mastered-resurface floor, the
 * concept-aware picker and the legacy scorer used to serve such cards at about
 * half their interval, because they choose by concept retrievability or loose
 * priority rather than by the card's interval. They now skip resting cards and
 * keep working on everything else.
 *
 * Run: npm test -- --testPathPattern=wellKnownRest --watchAll=false
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
  ConceptSelectionContext,
  SpacedRepetitionSystem as SRS,
  WELL_KNOWN_STREAK,
} from './spacedRepetition';

const backendPolicy = getSelectionPolicy(Course.BACKEND);
const DAY = 86_400_000;

beforeAll(() => {
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
    masteredTopics: new Set(),
  };
}

function makeQ(id: string, topic: Topic, difficulty: Difficulty, concepts?: string[]): Question {
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

function record(progress: UserProgress, qid: string, isCorrect: boolean, msAgo: number, credit?: number) {
  const a: QuestionAttempt = {
    questionId: qid, isCorrect, timestamp: Date.now() - msAgo, attempts: 1, timeSpent: 5_000,
  };
  if (credit !== undefined) a.credit = credit;
  progress.questionsAttempted.add(qid);
  if (isCorrect) progress.correctAnswers.add(qid);
  progress.attemptHistory.push(a);
  progress.lastAttempt.set(qid, a.timestamp);
}

/** `streak` correct answers in a row, the last one `lastDaysAgo` days ago. */
function streakOf(progress: UserProgress, qid: string, streak: number, lastDaysAgo: number) {
  for (let i = streak - 1; i >= 0; i--) record(progress, qid, true, (lastDaysAgo + i * 0.5) * DAY);
}

function draw(pool: Question[], progress: UserProgress, ctx?: ConceptSelectionContext, n = 1000) {
  const counts = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const q = SRS.selectNextQuestion(pool, progress, ctx, backendPolicy);
    if (q) counts.set(q.id, (counts.get(q.id) ?? 0) + 1);
  }
  return counts;
}

describe('correctStreaks', () => {
  test('matches getCorrectStreak for every card, hints and out-of-order history included', () => {
    const p = emptyProgress();
    record(p, 'a', true, 5 * DAY);
    record(p, 'a', true, 4 * DAY);
    record(p, 'b', true, 4 * DAY);
    record(p, 'b', false, 3 * DAY);
    record(p, 'b', true, 2 * DAY);
    record(p, 'c', true, 1 * DAY, 0.5);  // hinted pass under the bar breaks the streak
    record(p, 'c', true, 0.5 * DAY, 0.8);
    record(p, 'a', true, 6 * DAY);       // recorded late with an older timestamp
    record(p, 'a', false, 2 * DAY);
    record(p, 'a', true, 2 * DAY);       // same timestamp as the miss before it
    const streaks = SRS.correctStreaks(p);
    for (const id of ['a', 'b', 'c']) {
      expect(streaks.get(id)).toBe(SRS.getCorrectStreak(id, p));
    }
  });
});

describe('restingWellKnown', () => {
  test('rests a streak >= WELL_KNOWN_STREAK card only until its own interval has passed', () => {
    expect(WELL_KNOWN_STREAK).toBe(5);
    const qs = ['wk', 'wkDue', 'wkHard', 'four', 'lapsed'].map(id =>
      makeQ(id, Topic.PY_BASICS, Difficulty.ADVANCED));
    const p = emptyProgress();
    streakOf(p, 'wk', 5, 10);       // interval 60 days, 10 in → resting
    streakOf(p, 'wkDue', 5, 61);    // past 60 days → due, not resting
    streakOf(p, 'wkHard', 5, 30);   // hardest card: 60 * 0.4 = 24 days → due
    streakOf(p, 'four', 4, 1);      // still consolidating → never resting
    streakOf(p, 'lapsed', 6, 20);
    record(p, 'lapsed', false, 1 * DAY); // a miss ends the rest
    const resting = SRS.restingWellKnown(qs, p, { wkHard: 10 });
    expect(Array.from(resting)).toEqual(['wk']);
  });
});

describe('selectNextQuestion - well-known cards rest until due', () => {
  /**
   * Caught up and nothing due: the floor interleave runs, and the legacy scorer
   * takes the rest. The well-known advanced card is never served, while the
   * consolidating cards keep cycling.
   */
  test('the floor and the legacy scorer skip a resting card and keep the rest warm', () => {
    const pool = [
      makeQ('wk', Topic.PY_BASICS, Difficulty.ADVANCED),
      makeQ('cons1', Topic.PY_BASICS, Difficulty.INTERMEDIATE),
      makeQ('cons2', Topic.PY_BASICS, Difficulty.ADVANCED),
      makeQ('cons3', Topic.PY_BASICS, Difficulty.BEGINNER),
      makeQ('cons4', Topic.PY_BASICS, Difficulty.BEGINNER),
    ];
    const p = emptyProgress();
    streakOf(p, 'wk', 5, 10);
    streakOf(p, 'cons1', 2, 1);   // interval 7 days → not due
    streakOf(p, 'cons2', 2, 2);
    streakOf(p, 'cons3', 3, 3);   // interval 14 days
    streakOf(p, 'cons4', 3, 0.01);
    p.masteredTopics.add(Topic.PY_BASICS);

    const counts = draw(pool, p);
    expect(counts.get('wk') ?? 0).toBe(0);
    expect(counts.get('cons1') ?? 0).toBeGreaterThan(0);
    expect(counts.get('cons2') ?? 0).toBeGreaterThan(0);

    // Once its interval has passed it comes back through the due branch.
    const due = emptyProgress();
    streakOf(due, 'wk', 5, 61);
    streakOf(due, 'cons1', 2, 1);
    streakOf(due, 'cons2', 2, 2);
    streakOf(due, 'cons3', 3, 3);
    streakOf(due, 'cons4', 3, 0.01);
    due.masteredTopics.add(Topic.PY_BASICS);
    expect((draw(pool, due, undefined, 200).get('wk') ?? 0)).toBeGreaterThan(150);
  });

  /**
   * Concept-aware course: the well-known card's concept is concept-DUE (low
   * stability), which used to put it in the DUE bucket regardless of the
   * card's own interval. It now rests, and the concept is practised through
   * the card that is still consolidating.
   */
  test('the concept-aware picker skips a resting card and still serves its concept', () => {
    const pool = [
      makeQ('wk', Topic.PY_BASICS, Difficulty.INTERMEDIATE, ['cWeak']),
      makeQ('cons', Topic.PY_BASICS, Difficulty.INTERMEDIATE, ['cWeak']),
      makeQ('s1', Topic.PY_BASICS, Difficulty.BEGINNER, ['cStrong']),
      makeQ('s2', Topic.PY_BASICS, Difficulty.BEGINNER, ['cStrong']),
      makeQ('s3', Topic.PY_BASICS, Difficulty.BEGINNER, ['cStrong']),
    ];
    const p = emptyProgress();
    streakOf(p, 'wk', 5, 10);
    streakOf(p, 'cons', 4, 2);    // interval 30 days → not due, not resting
    streakOf(p, 's1', 2, 1);
    streakOf(p, 's2', 2, 1);
    streakOf(p, 's3', 2, 0.01);
    p.masteredTopics.add(Topic.PY_BASICS);
    const NOW = Date.now();
    const conceptProgress: ConceptProgress = {
      cWeak: { successes: 9, failures: 0, lastSeen: NOW - 2 * DAY, stability: 1 },
      cStrong: { successes: 9, failures: 0, lastSeen: NOW, stability: 200, masteredAt: NOW },
    };
    const ctx: ConceptSelectionContext = { progress: conceptProgress, betas: {} };

    const counts = draw(pool, p, ctx);
    expect(counts.get('wk') ?? 0).toBe(0);
    // The concept-DUE bucket now holds only the consolidating card, so it leads.
    expect(counts.get('cons') ?? 0).toBeGreaterThan(500);
  });

  test('when only resting cards are left it serves the one closest to due', () => {
    const pool = ['wkA', 'wkB', 'wkC'].map(id => makeQ(id, Topic.PY_BASICS, Difficulty.ADVANCED));
    const p = emptyProgress();
    streakOf(p, 'wkA', 5, 50);    // 50 / 60 of its interval
    streakOf(p, 'wkB', 5, 10);
    streakOf(p, 'wkC', 5, 20);    // its attempts are the most recent → in cooldown
    p.masteredTopics.add(Topic.PY_BASICS);
    const counts = draw(pool, p, undefined, 200);
    expect(counts.get('wkA')).toBe(200);
  });
});
