import { questions } from './questions';
import { QuestionType, CodingQuestion } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

function codingQuestion(id: string): CodingQuestion {
  const q = questions.find(question => question.id === id);
  if (!q || q.type !== QuestionType.CODING) throw new Error(`${id} is not a coding question`);
  return q as CodingQuestion;
}

function passes(question: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(question, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

const scdMerge = `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id AND tgt.is_current = true
  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.valid_to = current_timestamp(),
  tgt.is_current = false;
`;

const scdInsert = (columns: string, values: string) => `
INSERT INTO dim_customer (${columns})
SELECT ${values}
FROM stg_customer_updates AS src
LEFT JOIN dim_customer AS dim
  ON dim.customer_id = src.customer_id AND dim.is_current = true
WHERE dim.customer_id IS NULL;`;

describe('scd-coding-2 grading', () => {
  const question = codingQuestion('scd-coding-2');

  it('passes every reference branch', () => {
    for (const branch of question.solution.split('-- OR')) {
      expect(passes(question, branch.trim())).toBe(true);
    }
  });

  it('accepts the INSERT column list in any order', () => {
    const code = scdMerge + scdInsert(
      'customer_name, customer_id, email, city, valid_from, valid_to, is_current',
      'src.customer_name, src.customer_id, src.email, src.city, current_timestamp(), NULL, true',
    );
    expect(passes(question, code)).toBe(true);
  });

  it('rejects an INSERT that supplies customer_sk', () => {
    const code = scdMerge + scdInsert(
      'customer_sk, customer_id, customer_name, email, city, valid_from, valid_to, is_current',
      'monotonically_increasing_id(), src.customer_id, src.customer_name, src.email, src.city, current_timestamp(), NULL, true',
    );
    expect(passes(question, code)).toBe(false);
  });

  it('fails the starter', () => {
    expect(passes(question, question.starterCode)).toBe(false);
  });
});

describe('pd-coding-1 grading', () => {
  const question = codingQuestion('pd-coding-1');
  const reference = question.solution.split('-- OR')[0].trim();

  it('passes every reference branch', () => {
    for (const branch of question.solution.split('-- OR')) {
      expect(passes(question, branch.trim())).toBe(true);
    }
  });

  it('accepts a comment that mentions WHEN MATCHED', () => {
    expect(passes(question, `-- no WHEN MATCHED: orders never change\n${reference}`)).toBe(true);
  });

  it('rejects a MERGE that adds a WHEN MATCHED clause', () => {
    const code = reference.replace(
      'WHEN NOT MATCHED',
      'WHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED',
    );
    expect(passes(question, code)).toBe(false);
  });

  it('fails the starter', () => {
    expect(passes(question, question.starterCode)).toBe(false);
  });
});
