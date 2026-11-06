import { questions } from '../data/questions';
import { Difficulty, QuestionType, Topic } from '../types';
import { allFilters, filterQuestions } from './questionFilters';

const pool = questions.slice(0, 200);

describe('filterQuestions', () => {
  it('keeps every question when everything is selected', () => {
    expect(filterQuestions(pool, allFilters())).toHaveLength(pool.length);
  });

  it('serves nothing when every topic is deselected', () => {
    expect(filterQuestions(pool, { ...allFilters(), topics: [] })).toEqual([]);
  });

  it('serves nothing when every difficulty or every type is deselected', () => {
    expect(filterQuestions(pool, { ...allFilters(), difficulties: [] })).toEqual([]);
    expect(filterQuestions(pool, { ...allFilters(), questionTypes: [] })).toEqual([]);
  });

  it('keeps exactly the selected topic, difficulty and type', () => {
    const picked = filterQuestions(questions, {
      topics: [Topic.PY_BASICS],
      difficulties: [Difficulty.BEGINNER],
      questionTypes: [QuestionType.MULTIPLE_CHOICE],
    });
    expect(picked.length).toBeGreaterThan(0);
    expect(picked.every(q => q.topic === Topic.PY_BASICS
      && q.difficulty === Difficulty.BEGINNER
      && q.type === QuestionType.MULTIPLE_CHOICE)).toBe(true);
  });
});
