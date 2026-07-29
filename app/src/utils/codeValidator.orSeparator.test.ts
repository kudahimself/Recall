/**
 * The alternatives separator must match the question's language: `-- OR` for
 * SQL, `# OR` for everything else. `splitAlternatives` only looks for the one
 * that matches `language`, so a mismatched separator is silent and harmful:
 *
 *   - every alternative after the first stops being an accepted answer, because
 *     the whole blob (separator line included) is treated as one solution;
 *   - the `requires` satisfiability guard sees one merged branch containing the
 *     union of all tokens, so an unsatisfiable gate looks satisfiable.
 *
 * platform-sql-1 had both: `# OR` in a SQL solution hid a `requires` list that
 * demanded DESCRIBE EXTENDED and DESCRIBE DETAIL in the same answer.
 */
import { questions } from '../data/questions';
import { QuestionType, CodeLanguage, CodingQuestion } from '../types';

describe('solution alternatives use the separator for their language', () => {
  it('has no mismatched OR separator', () => {
    const offenders: string[] = [];

    questions.forEach(q => {
      if (q.type !== QuestionType.CODING) return;
      const cq = q as CodingQuestion;
      const isSql = cq.language === CodeLanguage.SQL;

      const wrong = isSql ? /\n\s*#\s*OR\s*\n/i : /\n\s*--\s*OR\s*\n/i;
      if (wrong.test(cq.solution)) {
        offenders.push(
          `${cq.id} (${cq.language}) uses ${isSql ? '"# OR"' : '"-- OR"'}; expected ${isSql ? '"-- OR"' : '"# OR"'}`,
        );
      }
    });

    expect(offenders).toEqual([]);
  });
});
