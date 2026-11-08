/**
 * The course path behind Home and Progress: which section Home shows, what is
 * worth another look, and the per-course totals the course switcher lists.
 *
 * Run: npm test -- --testPathPattern=coursePath --watchAll=false
 */
import { questions } from '../data/questions';
import { Course, Question, Topic, UserProgress } from '../types';
import { getCourseForTopic, getPathOrder, getTopicPlace } from './courseConfig';
import { buildCoursePath, courseTotals, currentUnitIndex, focusAreas } from './coursePath';
import { replayHistory } from './familySchedule';
import { lessonsForTopic } from './lessons';

const byId = new Map(questions.map(q => [q.id, q]));
const backend = questions.filter(q => getCourseForTopic(q.topic) === Course.BACKEND);

function progressOf(answers: Array<[string, boolean]>): UserProgress {
  const t = Date.now() - 3_600_000;
  const attemptHistory = answers.map(([questionId, isCorrect], i) => ({ questionId, isCorrect, timestamp: t + i, attempts: 1, timeSpent: 5000 }));
  return {
    questionsAttempted: new Set(answers.map(([id]) => id)),
    correctAnswers: new Set(answers.filter(([, ok]) => ok).map(([id]) => id)),
    topicScores: new Map(),
    difficultyScores: new Map(),
    attemptHistory,
    lastAttempt: new Map(attemptHistory.map(a => [a.questionId, a.timestamp])),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

const pathFor = (p: UserProgress, done = {}) =>
  buildCoursePath(Course.BACKEND, backend, p, replayHistory(p.attemptHistory, byId), done);

describe('buildCoursePath', () => {
  test('a new learner starts on the first section, with its first lesson next', () => {
    const path = pathFor(progressOf([]));
    expect(path.sections.map(s => s.name)).toEqual(getPathOrder(Course.BACKEND));
    expect(path.current?.name).toBe(getPathOrder(Course.BACKEND)[0]);
    expect(path.focus).toBe(path.current);
    expect(path.nextLesson).toBe(lessonsForTopic(Topic.PY_BASICS)[0]);
    expect(path.sections.filter(s => s.status === 'current')).toHaveLength(1);
    expect(path.lessons.done).toBe(0);
    expect(path.lessons.total).toBeGreaterThan(0);
    // The unit on the learner's hands is the one with the next lesson.
    expect(path.focus!.units[currentUnitIndex(path.focus!, path.nextLesson)].topicKeys).toContain(Topic.PY_BASICS);
  });

  test('Home shows the section that holds the next lesson, even when a later one is open', () => {
    localStorage.setItem('recall-dev-unlock-all', '1');
    try {
      const path = pathFor(progressOf([]));
      expect(path.current?.name).toBe(getPathOrder(Course.BACKEND).slice(-1)[0]);
      expect(path.focus?.name).toBe(getTopicPlace(Topic.PY_BASICS)!.section);
      // Open, not passed: the preview unlocks sections without mastering them.
      expect(path.sections.filter(s => s.status === 'open').length).toBe(path.sections.length - 1);
      expect(path.sections.filter(s => s.status === 'mastered')).toHaveLength(0);
    } finally {
      localStorage.removeItem('recall-dev-unlock-all');
    }
  });
});

describe('focusAreas', () => {
  const basics = backend.filter(q => q.topic === Topic.PY_BASICS);

  test('lists an open unit answered below the bar, with how many are missed', () => {
    const answers: Array<[string, boolean]> = basics.slice(0, 5).map((q, i) => [q.id, i < 2]);
    const path = pathFor(progressOf(answers));
    const [first] = focusAreas(path, backend, { events: [] });
    expect(first).toMatchObject({ kind: 'topic', name: getTopicPlace(Topic.PY_BASICS)!.unit, recentPct: 40, missed: 3 });
  });

  test('says nothing for a unit answered well, or with too few answers', () => {
    expect(focusAreas(pathFor(progressOf(basics.slice(0, 5).map(q => [q.id, true]))), backend, { events: [] })).toEqual([]);
    expect(focusAreas(pathFor(progressOf(basics.slice(0, 2).map(q => [q.id, false]))), backend, { events: [] })).toEqual([]);
  });

  test("keeps a place for the misconception hit most on this course, and ignores other courses' hits", () => {
    const mcq = backend.find(q => (q as Question & { options?: Array<{ misconceptionTag?: string }> }).options?.some(o => o.misconceptionTag))!;
    const tag = (mcq as Question & { options: Array<{ misconceptionTag?: string }> }).options.find(o => o.misconceptionTag)!.misconceptionTag!;
    const sqlQ = questions.find(q => getCourseForTopic(q.topic) === Course.SQL)!;
    const events = [
      { tag, questionId: mcq.id, timestamp: 1 },
      { tag, questionId: mcq.id, timestamp: 2 },
      { tag: 'py-assignment-vs-comparison', questionId: sqlQ.id, timestamp: 3 },
    ];
    const list = focusAreas(pathFor(progressOf([])), backend, { events }, 3);
    expect(list).toEqual([expect.objectContaining({ kind: 'misconception', tag, count: 2 })]);
  });
});

describe('courseTotals', () => {
  test('counts seen and total per course, and accuracy over the latest answers', () => {
    const sql = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL);
    const totals = courseTotals(questions, progressOf([[sql[0].id, true], [sql[1].id, false], [backend[0].id, true]]));
    expect(totals[Course.SQL]).toMatchObject({ seen: 2, total: sql.length, recentPct: 50, answered: 2 });
    expect(totals[Course.BACKEND]).toMatchObject({ seen: 1, total: backend.length, recentPct: 100, answered: 1 });
    expect(totals[Course.WEB_DEV]).toMatchObject({ seen: 0, answered: 0, recentPct: 0 });
  });
});
