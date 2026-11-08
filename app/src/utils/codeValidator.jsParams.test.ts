/**
 * A function's parameter names are the learner's choice. The JS grader used to
 * compare them as written, so `numbers.map(x => x * x)` hard-failed against a
 * reference written `numbers.map(n => n * n)` (50%), and even the reference's
 * own callback with parentheses added, `(n) => n * n`, only reached
 * 'uncertain' (65%). Parameters and loop variables are now compared by
 * position, single-parameter parentheses are optional, and an arrow's
 * `{ return expr; }` body is the same as the bare `expr`.
 */
import { CodeLanguage, CodingQuestion, Course, Difficulty, QuestionType, Topic } from '../types';
import { gradeCodingSubmission } from './codeValidator';

function question(solution: string, starterCode = ''): CodingQuestion {
  return {
    id: 'js-params-fixture',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.JS_ARRAYS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: 'Fixture',
    starterCode,
    testCases: [],
    solution,
    explanation: '',
  };
}

const verdict = (q: CodingQuestion, code: string) => {
  const results = gradeCodingSubmission(q, code);
  return results.every(r => r.verdict === 'pass') ? 'pass' : results.some(r => r.verdict === 'fail') ? 'fail' : 'uncertain';
};

describe('JS parameter names are the learner\'s choice', () => {
  const squares = question('const numbers = [1, 2, 3];\nconst squared = numbers.map(n => n * n);');
  const setup = 'const numbers = [1, 2, 3];\n';

  it('passes a callback whatever its parameter is called, with or without parentheses', () => {
    expect(verdict(squares, setup + 'const squared = numbers.map(x => x * x);')).toBe('pass');
    expect(verdict(squares, setup + 'const squared = numbers.map((num) => num * num);')).toBe('pass');
    expect(verdict(squares, setup + 'const squared = numbers.map((n) => { return n * n; });')).toBe('pass');
    expect(verdict(squares, setup + 'const squared = numbers.map(function (n) { return n * n; });')).toBe('pass');
  });

  it('never passes a callback that computes something else', () => {
    expect(verdict(squares, setup + 'const squared = numbers.map(x => x * 2);')).not.toBe('pass');
    expect(verdict(squares, setup + 'const squared = numbers.map(x => x + x);')).not.toBe('pass');
  });

  it('keeps parameters apart by position, so swapped comparator arguments do not pass', () => {
    const sort = question('const sorted = people.toSorted((a, b) => a.age - b.age);');
    expect(verdict(sort, 'const sorted = people.toSorted((p, q) => p.age - q.age);')).toBe('pass');
    expect(verdict(sort, 'const sorted = people.toSorted((p, q) => q.age - p.age);')).not.toBe('pass');
  });

  it('renames each callback separately, and leaves property names alone', () => {
    const chain = question('const total = orders.filter((o) => o.qty > 1).map((o) => o.price * o.qty).reduce((sum, cost) => sum + cost, 0);');
    expect(verdict(chain, 'const total = orders.filter((order) => order.qty > 1).map((x) => x.price * x.qty).reduce((acc, c) => acc + c, 0);')).toBe('pass');
    expect(verdict(chain, 'const total = orders.filter((order) => order.price > 1).map((x) => x.price * x.qty).reduce((acc, c) => acc + c, 0);')).not.toBe('pass');
  });

  it('treats function parameters and loop variables the same way', () => {
    const loop = question('function repeatAction(times, callback) {\n  for (let i = 0; i < times; i++) {\n    callback(i);\n  }\n}');
    expect(verdict(loop, 'function repeatAction(count, cb) {\n  for (let j = 0; j < count; j++) {\n    cb(j);\n  }\n}')).toBe('pass');
    expect(verdict(loop, 'function repeatAction(count, cb) {\n  for (let j = 0; j <= count; j++) {\n    cb(j);\n  }\n}')).not.toBe('pass');
  });

  it('does not rename text inside a string', () => {
    const greet = question('const greet = (who) => "Hi, " + who;');
    expect(verdict(greet, 'const greet = (person) => "Hi, " + person;')).toBe('pass');
    expect(verdict(greet, 'const greet = (person) => "Hi, person";')).not.toBe('pass');
  });
});
