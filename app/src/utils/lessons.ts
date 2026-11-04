/**
 * Lessons: a rule card and a few existing questions before a topic's ramp.
 *
 * A lesson (TopicLesson, src/data/lessons/) is new data beside the bank. Its
 * progress is stored under LESSONS_KEY (`recall-lessons`) as
 * `{ [lessonId]: completedAt }`, written through safeSetItem and exported.
 *
 * A lesson is met when it was completed, or when any of its exercise
 * questions was already attempted: existing progress is credited, not forced,
 * so a topic the learner has covered never asks for its lesson again. Its
 * rule card is simply there to reopen.
 *
 * The gate lives in the App, not the selector: when the session serves an
 * unseen question whose topic's lesson is not met (lessonGateFor), the App
 * shows the rule card first, then the exercises in order, answered through
 * the normal handleAnswer. A topic's ramp unlock (updateMasteredTopics) also
 * needs the topic's lessons met (isTopicLessonMet).
 *
 * Pure functions only: no React, no localStorage.
 */
import { Difficulty, Question, QuestionType, TopicLesson, UserProgress } from '../types';
import { LESSONS } from '../data/lessons';
import { LESSONS_KEY, RAMP_DIFFICULTY_ORDER, familyOf, topicRamp } from './spacedRepetition';
import { FamilyState, FsrsStore, isFamilyDue, State } from './familySchedule';
import { getGroupsForTopic, getSectionUnits } from './courseConfig';

export { LESSONS_KEY };

/** Completed lessons: lesson id -> completion time (epoch ms). */
export type LessonsDone = Record<string, number>;

const BY_ID = new Map<string, TopicLesson>(LESSONS.map(l => [l.id, l]));
const BY_TOPIC = new Map<string, TopicLesson[]>();
for (const l of LESSONS) {
  for (const t of l.topicKeys) {
    const arr = BY_TOPIC.get(t) ?? [];
    arr.push(l);
    BY_TOPIC.set(t, arr);
  }
}
BY_TOPIC.forEach(arr => arr.sort((a, b) => a.step - b.step));

export function getLesson(id: string): TopicLesson | undefined {
  return BY_ID.get(id);
}

/** A topic's lessons, by step (empty when the topic has none yet). */
export function lessonsForTopic(topic: string): TopicLesson[] {
  return BY_TOPIC.get(topic) ?? [];
}

/** True when the topic has at least one lesson. */
export function topicHasLesson(topic: string): boolean {
  return BY_TOPIC.has(topic);
}

/** Stored lesson progress; unreadable or malformed text gives none (credit from history still applies). */
export function parseLessonsDone(raw: string | null): LessonsDone {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const out: LessonsDone = {};
  for (const [id, at] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof at === 'number' && Number.isFinite(at)) out[id] = at;
  }
  return out;
}

export function isLessonMet(lesson: TopicLesson, done: LessonsDone, attempted: ReadonlySet<string>): boolean {
  return done[lesson.id] !== undefined || lesson.exercises.some(id => attempted.has(id));
}

/** The topic's first lesson not yet met, or null (none left, or the topic has no lesson). */
export function nextUnmetLesson(topic: string, done: LessonsDone, attempted: ReadonlySet<string>): TopicLesson | null {
  return lessonsForTopic(topic).find(l => !isLessonMet(l, done, attempted)) ?? null;
}

/** Every lesson of the topic is met; true for a topic without lessons. */
export function isTopicLessonMet(topic: string, done: LessonsDone, attempted: ReadonlySet<string>): boolean {
  return nextUnmetLesson(topic, done, attempted) === null;
}

/**
 * The lesson to show before `q`: q is unseen and its topic has a lesson not
 * yet met. Null otherwise, so seen cards (reviews, drills) are never gated.
 */
export function lessonGateFor(q: Question, done: LessonsDone, attempted: ReadonlySet<string>): TopicLesson | null {
  if (attempted.has(q.id)) return null;
  return nextUnmetLesson(q.topic, done, attempted);
}

/** The next exercise of a lesson the learner has not answered yet, or null when every one is answered. */
export function nextLessonExercise(
  lesson: TopicLesson,
  attempted: ReadonlySet<string>,
  byId: ReadonlyMap<string, Question>,
): Question | null {
  for (const id of lesson.exercises) {
    const q = byId.get(id);
    if (q && !attempted.has(id)) return q;
  }
  return null;
}

/** The lesson containing this question as an exercise, if any. */
export function lessonOfExercise(questionId: string): TopicLesson | undefined {
  return LESSONS.find(l => l.exercises.includes(questionId));
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  [QuestionType.MULTIPLE_CHOICE]: 'multiple choice',
  [QuestionType.PREDICT_OUTPUT]: 'predict output',
  [QuestionType.PARSONS]: 'parsons',
  [QuestionType.CLOZE_CODE]: 'cloze',
  [QuestionType.CODING]: 'cold write',
};

/** "multiple choice -> predict output -> cloze", for the rule card's footer. */
export function exercisePlan(lesson: TopicLesson, byId: ReadonlyMap<string, Question>): string[] {
  return lesson.exercises.map(id => {
    const q = byId.get(id);
    return q ? QUESTION_TYPE_LABEL[q.type] : id;
  });
}

/** Join the source lines of a paragraph (one sentence per line) into display text. */
export function proseText(paragraph: string): string {
  return paragraph.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join(' ');
}

/** Where a topic (a courseConfig unit) stands on its three steps: lesson, ramp, review. */
export interface TopicSteps {
  /** The unit's first lesson not yet met, else its first lesson; null when it has none. */
  lesson: TopicLesson | null;
  /** Every lesson of the unit is met (true when it has none). */
  lessonMet: boolean;
  /** When the lesson was completed in the app; null when it was credited from history or is not met. */
  lessonDoneAt: number | null;
  rampAnswered: number;
  rampTotal: number;
  rampByDifficulty: { difficulty: Difficulty; answered: number; total: number }[];
  /** The unit's card families, with their schedule (undefined until first answered). */
  families: { family: string; state: FamilyState | undefined; due: boolean }[];
  seen: number;
  total: number;
}

export function topicSteps(
  topicKeys: string[],
  pool: Question[],
  progress: UserProgress,
  store: FsrsStore,
  done: LessonsDone,
  now: number = Date.now(),
): TopicSteps {
  const attempted = progress.questionsAttempted;
  const lessons = topicKeys.flatMap(lessonsForTopic);
  const unmet = lessons.find(l => !isLessonMet(l, done, attempted)) ?? null;
  const lesson = unmet ?? lessons[0] ?? null;
  const ramp = topicKeys.flatMap(t => topicRamp(pool.filter(q => q.topic === t)));
  const unitQs = pool.filter(q => topicKeys.includes(q.topic));
  const familyNames = Array.from(new Set(unitQs.map(familyOf)));
  return {
    lesson,
    lessonMet: unmet === null,
    lessonDoneAt: lesson && unmet === null && done[lesson.id] !== undefined ? done[lesson.id] : null,
    rampAnswered: ramp.filter(q => attempted.has(q.id)).length,
    rampTotal: ramp.length,
    rampByDifficulty: RAMP_DIFFICULTY_ORDER.map(difficulty => {
      const r = ramp.filter(q => q.difficulty === difficulty);
      return { difficulty, answered: r.filter(q => attempted.has(q.id)).length, total: r.length };
    }).filter(d => d.total > 0),
    families: familyNames.map(family => {
      const state = store.families[family];
      return { family, state, due: !!state && state.state !== State.New && isFamilyDue(state, now) };
    }),
    seen: unitQs.filter(q => attempted.has(q.id)).length,
    total: unitQs.length,
  };
}

/** "2 more beginner, 5 intermediate, 4 advanced": the ramp left after the lesson. */
export function rampAfterLessonNote(lesson: TopicLesson, pool: Question[], attempted: ReadonlySet<string>): string | null {
  const ramp = lesson.topicKeys.flatMap(t => topicRamp(pool.filter(q => q.topic === t)));
  const left = ramp.filter(q => !lesson.exercises.includes(q.id) && !attempted.has(q.id));
  if (left.length === 0) return 'The lesson exercises finish this topic\'s ramp; its other questions come back as drills and reviews.';
  const parts = RAMP_DIFFICULTY_ORDER
    .map(d => [d, left.filter(q => q.difficulty === d).length] as const)
    .filter(([, n]) => n > 0)
    .map(([d, n]) => `${n} ${d}`);
  return `After the lesson, the topic's ramp goes on in your sessions: ${parts.join(', ')}. Then it opens the next topic, once it is answered above the accuracy bar.`;
}

/** Where a lesson sits, for the rule card's header. */
export interface LessonContext {
  /** e.g. 'Querying Foundations'. */
  section: string;
  /** 1-based position of the topic in its section, and the section's topic count. */
  topicIndex: number;
  topicCount: number;
  /** Per topic of the section: its lesson is met (true), it is this one (null), or not yet (false). */
  sectionDots: (boolean | null)[];
  /** Questions in the topic's ramp. */
  rampSize: number;
}

export function lessonContext(
  lesson: TopicLesson,
  pool: Question[],
  done: LessonsDone,
  attempted: ReadonlySet<string>,
): LessonContext | undefined {
  const groups = getGroupsForTopic(lesson.topicKeys[0]);
  if (!groups) return undefined;
  const units = getSectionUnits(groups.section);
  const index = units.findIndex(([, keys]) => keys.includes(lesson.topicKeys[0]));
  return {
    section: groups.section,
    topicIndex: index + 1,
    topicCount: units.length,
    sectionDots: units.map(([, keys], i) => {
      if (i === index) return null;
      const ls = keys.flatMap(lessonsForTopic);
      return ls.length > 0 && ls.every(l => isLessonMet(l, done, attempted));
    }),
    rampSize: lesson.topicKeys.flatMap(t => topicRamp(pool.filter(q => q.topic === t))).length,
  };
}
