/**
 * Lessons (utils/lessons): credit from history, the gate, stored progress,
 * the ramp unlock needing the lesson, and the content rules every lesson
 * keeps (scripts/check-lessons.js checks the rest, see checkLessons.test.ts).
 */
import { questions } from '../data/questions';
import { LESSONS } from '../data/lessons';
import { Course, QuestionAttempt, QuestionType, UserProgress } from '../types';
import { SQL_PATH_ORDER, SQL_SECTIONS, getTopicOrder } from './courseConfig';
import { EXPORT_KEYS } from './progressStorage';
import { SpacedRepetitionSystem as SRS, LESSONS_KEY, topicRamp } from './spacedRepetition';
import {
  getLesson,
  isLessonMet,
  isTopicLessonMet,
  lessonGateFor,
  lessonsForTopic,
  nextLessonExercise,
  parseLessonsDone,
  topicSteps,
} from './lessons';
import { emptyStore } from './familySchedule';

const byId = new Map(questions.map(q => [q.id, q]));
const q = (id: string) => byId.get(id)!;
const select = getLesson('tsql_select/1')!;

function progressFrom(ids: string[]): UserProgress {
  const history: QuestionAttempt[] = ids.map((id, i) => ({
    questionId: id, timestamp: 1_700_000_000_000 + i * 60_000, isCorrect: true, attempts: 1, timeSpent: 20_000, credit: 1, hintTierUsed: 0,
  }));
  return {
    questionsAttempted: new Set(ids),
    correctAnswers: new Set(ids),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(history.map(a => [a.questionId, a.timestamp])),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

describe('lesson progress', () => {
  it('is stored under recall-lessons and travels with Export', () => {
    expect(LESSONS_KEY).toBe('recall-lessons');
    expect(EXPORT_KEYS).toContain('recall-lessons');
  });

  it('reads only finite completion times, and nothing from unreadable text', () => {
    expect(parseLessonsDone(null)).toEqual({});
    expect(parseLessonsDone('{"oops"')).toEqual({});
    expect(parseLessonsDone('[1]')).toEqual({});
    expect(parseLessonsDone('{"tsql_select/1": 5, "x": "soon", "y": null}')).toEqual({ 'tsql_select/1': 5 });
  });
});

describe('credit and the gate', () => {
  it('a lesson is met when completed or when any exercise was already attempted', () => {
    expect(isLessonMet(select, {}, new Set())).toBe(false);
    expect(isLessonMet(select, { 'tsql_select/1': 1 }, new Set())).toBe(true);
    expect(isLessonMet(select, {}, new Set([select.exercises[2]]))).toBe(true);
    // Another card of the topic is not an exercise and gives no credit.
    expect(isLessonMet(select, {}, new Set(['tsql-select-offset-mcq-1']))).toBe(false);
  });

  it('gates an unseen card of a topic whose lesson is not met, and never a seen card', () => {
    const card = q('tsql-select-2');
    expect(lessonGateFor(card, {}, new Set())?.id).toBe('tsql_select/1');
    expect(lessonGateFor(card, {}, new Set(['tsql-select-2']))).toBeNull();
    expect(lessonGateFor(card, {}, new Set(['tsql-select-mcq-1']))).toBeNull();
    // A topic without a lesson yet is never gated.
    expect(lessonGateFor(questions.find(x => x.topic === 'tsql_transactions')!, {}, new Set())).toBeNull();
  });

  it('serves the exercises in order, skipping answered ones', () => {
    expect(nextLessonExercise(select, new Set(), byId)?.id).toBe(select.exercises[0]);
    expect(nextLessonExercise(select, new Set(select.exercises.slice(0, 2)), byId)?.id).toBe(select.exercises[2]);
    expect(nextLessonExercise(select, new Set(select.exercises), byId)).toBeNull();
  });
});

describe('the ramp unlock needs the lesson', () => {
  const tq = questions.filter(x => x.topic === 'tsql_select');
  const ramp = topicRamp(tq).map(x => x.id);

  it('opens the next topic once the lesson is met and the ramp is done at the bar', () => {
    const p = progressFrom(ramp);
    const met = (t: string) => isTopicLessonMet(t, {}, p.questionsAttempted);
    expect(SRS.updateMasteredTopics(p, 'tsql_select', questions, met).has('tsql_select')).toBe(true);
  });

  it('does not open it while the lesson is not met, however the ramp went', () => {
    const p = progressFrom(ramp);
    expect(SRS.updateMasteredTopics(p, 'tsql_select', questions, () => false).has('tsql_select')).toBe(false);
  });

  it('reports the lesson, ramp and review steps of a topic', () => {
    const p = progressFrom(select.exercises.slice(0, 1));
    const st = topicSteps(['tsql_select'], questions, p, emptyStore(byId), {});
    expect(st.lesson?.id).toBe('tsql_select/1');
    expect(st.lessonMet).toBe(true);
    expect(st.lessonDoneAt).toBeNull();
    expect(st.rampAnswered).toBe(1);
    expect(st.rampTotal).toBe(ramp.length);
  });
});

describe('content', () => {
  it('starts with the SQL course, one lesson per topic of whole sections, in course order', () => {
    const order = getTopicOrder(Course.SQL);
    const sqlLessonTopics = LESSONS.filter(l => order.includes(l.topicKeys[0])).map(l => l.topicKeys[0]);
    // Sections are written one per PR from the first, so the lessons cover
    // every topic of the first n sections and nothing past them.
    const written: string[] = [];
    for (const section of SQL_PATH_ORDER) {
      if (written.length >= sqlLessonTopics.length) break;
      written.push(...Object.values(SQL_SECTIONS[section].topics).flat());
    }
    expect(sqlLessonTopics).toEqual(written);
    for (const t of written) expect(lessonsForTopic(t)).toHaveLength(1);
  });

  it('every lesson opens with a recognition exercise and has an MCQ and a predict', () => {
    for (const l of LESSONS) {
      const types = l.exercises.map(id => q(id).type);
      expect(types[0]).not.toBe(QuestionType.CODING);
      expect(types).toContain(QuestionType.MULTIPLE_CHOICE);
      expect(types).toContain(QuestionType.PREDICT_OUTPUT);
    }
  });
});
