import { questions } from '../data/questions';
import { Difficulty, QuestionType, Topic } from '../types';
import { allFilters, filterQuestions, parseFilters, serializeFilters } from './questionFilters';

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

describe('saved filters', () => {
  it('come back as they were saved', () => {
    const saved = { topics: [Topic.PY_BASICS], difficulties: [Difficulty.BEGINNER], questionTypes: [QuestionType.PARSONS] };
    expect(parseFilters(serializeFilters(saved))).toEqual(saved);
  });

  it('drop topics, difficulties and types that no longer exist', () => {
    const raw = JSON.stringify({
      topics: [Topic.PY_BASICS, 'retired_topic'],
      difficulties: ['legendary', Difficulty.ADVANCED],
      questionTypes: [QuestionType.PARSONS, 'flashcard'],
    });
    expect(parseFilters(raw)).toEqual({
      topics: [Topic.PY_BASICS],
      difficulties: [Difficulty.ADVANCED],
      questionTypes: [QuestionType.PARSONS],
    });
  });

  it('select a question type added since they were saved', () => {
    const typesThen = Object.values(QuestionType).filter(t => t !== QuestionType.SPOT_FLAW);
    const raw = JSON.stringify({
      ...allFilters(),
      questionTypes: [QuestionType.PARSONS],
      known: { ...allFilters(), questionTypes: typesThen },
    });
    expect(parseFilters(raw).questionTypes).toEqual(
      Object.values(QuestionType).filter(t => t === QuestionType.PARSONS || t === QuestionType.SPOT_FLAW),
    );
  });

  it('mean everything when a list is missing, empty after the intersection, or the store is unreadable', () => {
    expect(parseFilters(JSON.stringify({ topics: ['retired_topic'], difficulties: [] }))).toEqual(allFilters());
    expect(parseFilters('not json')).toEqual(allFilters());
    expect(parseFilters(null)).toEqual(allFilters());
  });
});
