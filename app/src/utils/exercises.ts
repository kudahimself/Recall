/**
 * Exercises: one coding exercise per topic, done in the learner's own editor
 * after the topic's lesson and ramp (src/data/exercises/, files in the repo's
 * exercises/ folder). Nothing runs in the app: it shows the task and the
 * folder, and the learner ticks the exercise done.
 *
 * Progress is stored under EXERCISES_KEY (`recall-exercises`) as
 * `{ [exerciseId]: doneAt }`, written through safeSetItem and exported.
 *
 * Pure functions only: no React, no localStorage.
 */
import { TopicExercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { EXERCISES_KEY } from './spacedRepetition';
import { parseLessonsDone } from './lessons';

export { EXERCISES_KEY };

/** Exercises ticked done: exercise id -> when (epoch ms). */
export type ExercisesDone = Record<string, number>;

const BY_ID = new Map<string, TopicExercise>(EXERCISES.map(e => [e.id, e]));

export function getExercise(id: string): TopicExercise | undefined {
  return BY_ID.get(id);
}

/** The exercise of a topic (a courseConfig unit's keys), or null when it has none yet. */
export function exerciseForTopics(topicKeys: readonly string[]): TopicExercise | null {
  return EXERCISES.find(e => e.topicKeys.some(t => topicKeys.includes(t))) ?? null;
}

/** Stored exercise progress; unreadable or malformed text gives none. Same shape as lesson progress. */
export function parseExercisesDone(raw: string | null): ExercisesDone {
  return parseLessonsDone(raw);
}

/** Tick an exercise done (now) or undo it; returns a new record, or `done` itself when nothing changes. */
export function toggleExerciseDone(done: ExercisesDone, id: string, now: number = Date.now()): ExercisesDone {
  if (done[id] !== undefined) {
    const { [id]: _dropped, ...rest } = done;
    return rest;
  }
  return { ...done, [id]: now };
}

/** The shell line that runs an exercise's tests from the repo root: Vitest for Web Dev, pytest otherwise. */
export function exerciseCommand(exercise: TopicExercise): string {
  const runner = exercise.folder.startsWith('exercises/web_dev/') ? 'npm test' : 'pytest';
  return `cd ${exercise.folder} && ${runner}`;
}
