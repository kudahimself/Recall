/**
 * Exercise progress (utils/exercises): where it is stored, how it reads back,
 * the done tick, and finding a topic's exercise.
 */
import { EXPORT_KEYS } from './progressStorage';
import {
  EXERCISES_KEY,
  exerciseCommand,
  exerciseForTopics,
  getExercise,
  parseExercisesDone,
  toggleExerciseDone,
} from './exercises';

describe('exercise progress', () => {
  it('is stored under recall-exercises and travels with Export', () => {
    expect(EXERCISES_KEY).toBe('recall-exercises');
    expect(EXPORT_KEYS).toContain('recall-exercises');
  });

  it('reads only finite done times, and nothing from unreadable text', () => {
    expect(parseExercisesDone(null)).toEqual({});
    expect(parseExercisesDone('{"oops"')).toEqual({});
    expect(parseExercisesDone('[1]')).toEqual({});
    expect(parseExercisesDone('{"py_basics": 5, "x": "soon"}')).toEqual({ py_basics: 5 });
  });

  it('ticks an exercise done with the time, and unticks it', () => {
    const done = toggleExerciseDone({}, 'py_basics', 42);
    expect(done).toEqual({ py_basics: 42 });
    expect(toggleExerciseDone(done, 'py_oop', 50)).toEqual({ py_basics: 42, py_oop: 50 });
    expect(toggleExerciseDone(done, 'py_basics', 99)).toEqual({});
  });
});

describe('finding an exercise', () => {
  it('finds a topic\'s exercise by its unit keys', () => {
    const e = exerciseForTopics(['py_basics']);
    expect(e?.title).toBe('Shelf labels');
    expect(getExercise('py_basics')).toBe(e);
    expect(exerciseCommand(e!)).toBe('cd exercises/backend/py_basics && pytest');
  });

  it('gives null for a topic without an exercise yet', () => {
    expect(exerciseForTopics(['tsql_select'])).toBeNull();
    expect(getExercise('nope')).toBeUndefined();
  });
});
