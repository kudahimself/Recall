import { Difficulty, Question, QuestionType, Topic } from '../types';

export interface FilterOptions {
  topics: Topic[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
}

/** Every topic, difficulty and question type selected: nothing is filtered out. */
export function allFilters(): FilterOptions {
  return {
    topics: Object.values(Topic),
    difficulties: Object.values(Difficulty),
    questionTypes: Object.values(QuestionType),
  };
}

/**
 * The questions the filters select. A list selects exactly what it holds, so
 * an empty list ("Deselect All") selects nothing rather than everything.
 */
export function filterQuestions(pool: Question[], filters: FilterOptions): Question[] {
  return pool.filter(q =>
    filters.topics.includes(q.topic)
    && filters.difficulties.includes(q.difficulty)
    && filters.questionTypes.includes(q.type));
}
