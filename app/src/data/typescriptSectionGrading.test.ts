import { questions } from './questions';
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { QuestionType, CodingQuestion, Topic, CodeLanguage } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

const TS_TOPICS = new Set<string>([
  Topic.TS_BASIC_TYPES, Topic.TS_INTERFACES, Topic.TS_GENERICS,
  Topic.TS_ADVANCED_TYPES, Topic.TS_UTILITY_TYPES, Topic.TS_PROJECT,
]);

const tsQuestions = questions.filter(q => TS_TOPICS.has(q.topic));
const tsCoding = tsQuestions.filter(q => q.type === QuestionType.CODING) as CodingQuestion[];

function passes(question: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(question, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

function branches(q: CodingQuestion): string[] {
  const sep = q.language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
  return q.solution.split(sep).map(s => s.trim()).filter(Boolean);
}

describe('Web Dev TypeScript section grading', () => {
  it('has TypeScript coding questions loaded in the app bank', () => {
    expect(tsCoding.length).toBeGreaterThan(10);
  });

  it.each(tsCoding.map(q => [q.id, q] as const))('%s: every reference branch passes the grader', (_id, q) => {
    for (const branch of branches(q)) {
      expect({ id: q.id, branch: branch.slice(0, 60), pass: passes(q, branch) })
        .toEqual({ id: q.id, branch: branch.slice(0, 60), pass: true });
    }
  });

  it.each(tsCoding.map(q => [q.id, q] as const))('%s: the starter code is not accepted', (_id, q) => {
    expect(passes(q, q.starterCode || '')).toBe(false);
  });

  it.each(tsCoding.map(q => [q.id, q] as const))('%s: has a requires guard', (_id, q) => {
    expect(Array.isArray(q.requires) && q.requires.length > 0).toBe(true);
  });

  it('rejects a renamed DataTable key type in proj-ts-1 (keyof guard)', () => {
    const q = tsCoding.find(x => x.id === 'proj-ts-1')!;
    const wrong = branches(q)[0].replace('key: keyof T;', 'key: string;');
    expect(passes(q, wrong)).toBe(false);
  });

  it('proj-ts-3 now lives in React Patterns and is still reachable in the ordered bank', () => {
    const q = questions.find(x => x.id === 'proj-ts-3');
    expect(q?.topic).toBe(Topic.REACT_PATTERNS);
    const ordered = [...webdevOrderedQuestions, ...advancedWebdevOrderedQuestions].filter(x => x.id === 'proj-ts-3');
    expect(ordered.length).toBe(1);
    expect(ordered[0].topic).toBe(Topic.REACT_PATTERNS);
  });

  it('every MCQ in the section has exactly one correct option', () => {
    for (const q of tsQuestions.filter(x => x.type === QuestionType.MULTIPLE_CHOICE) as any[]) {
      expect({ id: q.id, correct: q.options.filter((o: any) => o.isCorrect).length }).toEqual({ id: q.id, correct: 1 });
    }
  });
});
