import { questions } from './questions';
import { QuestionType, CodingQuestion } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

// gld-coding-2 and ing-coding-2 teach Delta replaceWhere. Their textbook wrong
// answer is a naked overwrite with no replaceWhere, which must fail outright
// rather than land on the self-grade panel, while the reference still passes.

function codingQuestion(id: string): CodingQuestion {
  const q = questions.find(question => question.id === id);
  if (!q || q.type !== QuestionType.CODING) throw new Error(`${id} is not a coding question`);
  return q as CodingQuestion;
}

const cases: Array<[string, string]> = [
  ['gld-coding-2', 'corrected_df.write.format("delta").mode("overwrite").saveAsTable("sales_summary")'],
  ['ing-coding-2', 'updated_df.write.format("delta").mode("overwrite").saveAsTable("warehouse_inventory")'],
];

describe.each(cases)('%s replaceWhere grading', (id, nakedOverwrite) => {
  it('fails a naked overwrite with no replaceWhere', () => {
    const results = gradeCodingSubmission(codingQuestion(id), nakedOverwrite);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.verdict === 'fail')).toBe(true);
  });

  it('passes the reference solution', () => {
    const question = codingQuestion(id);
    const reference = question.solution.split('# OR')[0].trim();
    const results = gradeCodingSubmission(question, reference);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.verdict === 'pass')).toBe(true);
  });
});
