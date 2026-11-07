import { questions } from '../data/questions';
import { Course, QuestionAttempt, UserProgress } from '../types';
import { getCourseForTopic } from './courseConfig';
import { buildCoursePath } from './coursePath';
import { replayHistory, startOfLocalDay } from './familySchedule';
import {
  activitySummary,
  courseStats,
  daysFromToday,
  dueDayLabel,
  familyLabel,
  reviewSchedule,
  scheduleForecast,
  sectionDue,
} from './progressStats';

const DAY = 24 * 60 * 60 * 1000;
// Friday 6 November 2026, noon local time.
const NOW = new Date(2026, 10, 6, 12, 0, 0).getTime();
const sql = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL);
const byId = new Map(questions.map(q => [q.id, q]));

function progressOf(history: QuestionAttempt[]): UserProgress {
  return {
    questionsAttempted: new Set(history.map(a => a.questionId)),
    correctAnswers: new Set(history.filter(a => a.isCorrect).map(a => a.questionId)),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(history.map(a => [a.questionId, a.timestamp])),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

const answer = (id: string, timestamp: number, isCorrect: boolean): QuestionAttempt =>
  ({ questionId: id, timestamp, isCorrect, attempts: 1, timeSpent: 9000 });

describe('courseStats', () => {
  it('counts seen questions, the recent and first-try shares, and every answer', () => {
    const [a, b, c] = sql;
    const history = [
      answer(a.id, NOW - 3 * DAY, false),
      answer(a.id, NOW - 2 * DAY, true),
      answer(b.id, NOW - DAY, true),
      answer(c.id, NOW - 60_000, true),
      answer('not-in-this-course', NOW, false),
    ];
    const stats = courseStats(sql, progressOf(history));
    expect(stats.seen).toBe(3);
    expect(stats.total).toBe(sql.length);
    expect(stats.answers).toBe(4);
    // 3 of the 4 course answers right; 2 of 3 questions right the first time.
    expect(stats.recentPct).toBe(75);
    expect(stats.firstTryPct).toBe(67);
  });

  it('has no shares before the first answer', () => {
    const stats = courseStats(sql, progressOf([]));
    expect(stats.recentPct).toBeNull();
    expect(stats.firstTryPct).toBeNull();
  });
});

describe('reviewSchedule', () => {
  const history = sql.slice(0, 8).map((q, i) => answer(q.id, NOW - (10 - i) * DAY, i % 3 !== 0));
  const progress = progressOf(history);
  const path = buildCoursePath(Course.SQL, sql, progress, replayHistory(history, byId), {}, NOW);
  const schedule = reviewSchedule(path, NOW);

  it('lists every family met so far, soonest first, with due ones at day 0', () => {
    expect(schedule.rows.length).toBeGreaterThan(0);
    const days = schedule.rows.map(r => r.inDays);
    expect(days).toEqual([...days].sort((x, y) => x - y));
    for (const r of schedule.rows) {
      const due = r.unit.steps.families.find(f => f.family === r.family)!.due;
      expect(r.inDays === 0).toBe(due || daysFromToday(r.state.due, NOW) <= 0);
    }
  });

  it('agrees with the sections on what is due today', () => {
    const dueRows = schedule.rows.filter(r => r.unit.steps.families.find(f => f.family === r.family)!.due).length;
    expect(path.sections.reduce((n, s) => n + sectionDue(s), 0)).toBe(dueRows);
  });

  it('counts families coming due per day, today first', () => {
    const forecast = scheduleForecast(schedule.rows, 14);
    expect(forecast).toHaveLength(14);
    expect(forecast[0]).toBe(schedule.rows.filter(r => r.inDays === 0).length);
    expect(forecast.reduce((n, c) => n + c, 0)).toBe(schedule.rows.filter(r => r.inDays < 14).length);
  });
});

describe('day labels', () => {
  it('names today, tomorrow, this week by weekday, then a date', () => {
    expect(dueDayLabel(0, NOW)).toBe('Due today');
    expect(dueDayLabel(1, NOW)).toBe('Tomorrow');
    expect(dueDayLabel(3, NOW)).toBe('Monday');
    expect(dueDayLabel(10, NOW)).toBe('Mon 16 Nov');
  });

  it('counts whole local days', () => {
    expect(daysFromToday(startOfLocalDay(NOW) + DAY + 1, NOW)).toBe(1);
    expect(daysFromToday(NOW - 2 * DAY, NOW)).toBe(-2);
  });
});

describe('familyLabel', () => {
  it('uses the concept registry label, humanises an unknown concept, and names an untagged topic', () => {
    expect(familyLabel('py_basics/py-mutable-vs-immutable')).toBe('Mutable vs immutable types');
    expect(familyLabel('tsql_select/order-by')).toBe('Order by');
    expect(familyLabel('tsql_select/*')).toBe('Whole topic');
  });
});

describe('activitySummary', () => {
  it('counts today, the last 7 days and the active days of the last 30', () => {
    const key = (daysAgo: number) => new Date(NOW - daysAgo * DAY).toISOString().split('T')[0];
    const days = [
      { date: key(0), count: 4 },
      { date: key(3), count: 2 },
      { date: key(6), count: 1 },
      { date: key(7), count: 5 },
      { date: key(29), count: 1 },
      { date: key(30), count: 9 },
    ];
    expect(activitySummary(days, NOW)).toEqual({ today: 4, week: 7, activeDays30: 5 });
  });
});
