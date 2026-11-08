/**
 * An HTML class attribute is a set: `p-6 bg-white` styles an element exactly
 * like `bg-white p-6`. The grader used to keep the first class glued to
 * `class="` and the last to `">`, so a correct Tailwind answer with the classes
 * in another order hard-failed (tw-2 scored 43%).
 */
import { CodeLanguage, CodingQuestion, Course, Difficulty, QuestionType, Topic } from '../types';
import { gradeCodingSubmission } from './codeValidator';

const card: CodingQuestion = {
  id: 'html-class-order-fixture',
  type: QuestionType.CODING,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.TAILWIND,
  course: Course.WEB_DEV,
  language: CodeLanguage.HTML,
  question: 'Card',
  starterCode: '<div class="',
  testCases: [],
  solution: '<div class="bg-white rounded-lg shadow-md p-6 mb-4">Card</div>',
  explanation: '',
};

const verdict = (code: string) => {
  const results = gradeCodingSubmission(card, code);
  return results.every(r => r.verdict === 'pass') ? 'pass' : results.some(r => r.verdict === 'fail') ? 'fail' : 'uncertain';
};

describe('HTML is graded as markup', () => {
  it('passes the classes in any order, with either quote style', () => {
    expect(verdict('<div class="p-6 mb-4 bg-white shadow-md rounded-lg">Card</div>')).toBe('pass');
    expect(verdict("<div class='mb-4 shadow-md rounded-lg p-6 bg-white'>Card</div>")).toBe('pass');
  });

  it('passes attributes in any order, with or without a void-element slash', () => {
    const img: CodingQuestion = { ...card, starterCode: '', solution: '<img src="photo.jpg" alt="A sunset" width="600">' };
    const graded = (code: string) => gradeCodingSubmission(img, code).every(r => r.verdict === 'pass');
    expect(graded('<img width="600" src="photo.jpg" alt="A sunset" />')).toBe(true);
    expect(graded('<img alt="A sunset" width="600" src="photo.jpg">')).toBe(true);
    expect(graded('<img src="photo.jpg" width="600">')).toBe(false);
  });

  it('ignores a starter comment the learner kept', () => {
    const link: CodingQuestion = { ...card, starterCode: '<!-- Create a link -->\n', solution: '<a href="https://example.com" target="_blank">Visit</a>' };
    const linkPasses = (code: string) => gradeCodingSubmission(link, code).every(r => r.verdict === 'pass');
    expect(linkPasses('<!-- Create a link -->\n<a target="_blank" href="https://example.com">Visit</a>')).toBe(true);
    expect(linkPasses('<!-- Create a link -->\n<a href="https://example.com">Visit</a>')).toBe(false);
  });

  it('still rejects a list with a wrong or missing class', () => {
    expect(verdict('<div class="p-6 mb-4 bg-white shadow rounded-lg">Card</div>')).not.toBe('pass');
    expect(verdict('<div class="p-6 mb-4 bg-white rounded-lg">Card</div>')).not.toBe('pass');
  });
});
