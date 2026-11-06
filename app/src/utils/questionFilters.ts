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

/**
 * The filters as stored under `recall-filters`, with the values that existed
 * when they were saved, so a later load can tell a deselected value from one
 * added since.
 */
export function serializeFilters(filters: FilterOptions): string {
  return JSON.stringify({ ...filters, known: allFilters() });
}

function restoreList<T extends string>(current: T[], selected: unknown, known: unknown): T[] {
  if (!Array.isArray(selected)) return current;
  const addedSince = (v: T) => Array.isArray(known) && !known.includes(v);
  const kept = current.filter(v => selected.includes(v) || addedSince(v));
  return kept.length > 0 ? kept : current;
}

/**
 * Stored filters, kept to the topics, difficulties and types that exist now.
 * Values added since the save are selected, and a list that is missing or
 * selects nothing that exists means everything.
 */
export function parseFilters(raw: string | null): FilterOptions {
  const all = allFilters();
  let saved: unknown = null;
  try {
    saved = raw ? JSON.parse(raw) : null;
  } catch {
    saved = null;
  }
  if (!saved || typeof saved !== 'object') return all;
  const s = saved as Record<string, unknown>;
  const known = (s.known && typeof s.known === 'object' ? s.known : {}) as Record<string, unknown>;
  return {
    topics: restoreList(all.topics, s.topics, known.topics),
    difficulties: restoreList(all.difficulties, s.difficulties, known.difficulties),
    questionTypes: restoreList(all.questionTypes, s.questionTypes, known.questionTypes),
  };
}
