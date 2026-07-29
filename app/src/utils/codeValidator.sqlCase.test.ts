/**
 * Spark SQL and T-SQL are case-insensitive for keywords and identifiers, so a
 * learner who types their whole answer in lowercase has written a correct
 * answer and must be graded as such.
 *
 * This caught two normalization bugs that fired on SQL:
 *   - the Python import stripper (`/^(from|import)\s+.*$/gm`) deleted the entire
 *     FROM line of any lowercase multi-line query, table name included, while
 *     leaving the uppercase reference solution intact;
 *   - the assignment stripper scrubbed a column name out of the whole query when
 *     a predicate was wrapped onto its own line.
 *
 * It also catches `requires` RegExps authored without the `i` flag, which hard-fail
 * a lowercase answer before any of the grading logic runs.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { QuestionType, CodeLanguage, CodingQuestion } from '../types';

const sqlCoding = questions.filter(
  q => q.type === QuestionType.CODING && (q as CodingQuestion).language === CodeLanguage.SQL,
) as CodingQuestion[];

describe('SQL answers validate regardless of keyword case', () => {
  it('has SQL coding questions to check', () => {
    expect(sqlCoding.length).toBeGreaterThan(0);
  });

  it('accepts every solution branch typed in lowercase', () => {
    const offenders: string[] = [];

    sqlCoding.forEach(q => {
      const branches = q.solution
        .split(/\n\s*--\s*OR\s*\n/i)
        .map(s => s.trim())
        .filter(Boolean);

      branches.forEach((branch, i) => {
        const result = validateAnswer(
          branch.toLowerCase(),
          q.solution,
          q.language,
          'case check',
          q.starterCode,
          { requires: q.requires, requiredKeywords: q.requiredKeywords },
        );
        if (result.verdict !== 'pass') {
          offenders.push(
            `${q.id} branch ${i + 1}: ${result.verdict}${result.error ? ` (${result.error})` : ''}`,
          );
        }
      });
    });

    expect(offenders).toEqual([]);
  });
});
