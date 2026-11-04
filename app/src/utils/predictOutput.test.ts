import { CodeLanguage } from '../types';
import { questions } from '../data/questions';
import { QuestionType, PredictOutputQuestion } from '../types';
import { outputMatches } from './predictOutput';

const sql = (user: string, ...expected: string[]) => outputMatches(user, expected, CodeLanguage.SQL);
const py = (user: string, ...expected: string[]) => outputMatches(user, expected, CodeLanguage.PYTHON);

describe('predict-output matching: SQL result sets', () => {
  it('accepts comma, pipe and tab column separators with any spacing', () => {
    for (const answer of ['10, 30, 20', '10,30,20', '10 | 30 | 20', '10\t30\t20', '| 10 | 30 | 20 |']) {
      expect(sql(answer, '10, 30, 20')).toBe(true);
    }
  });

  it('accepts text values with or without quotes, and NULL in any case', () => {
    expect(sql("'Eng'", 'Eng')).toBe(true);
    expect(sql('"Eng"', 'Eng')).toBe(true);
    expect(sql('13\nnull\n10', '13\nNULL\n10')).toBe(true);
  });

  it('ignores table borders and blank lines between rows', () => {
    expect(sql('+----+\n| 1 |\n+----+\n| 2 |\n+----+', '1\n2')).toBe(true);
    expect(sql('\n1\n\n2\n', '1\n2')).toBe(true);
  });

  it('accepts the usual spellings of an empty result', () => {
    for (const answer of ['(no rows)', 'no rows', '(0 rows)', '(empty)', 'EMPTY']) {
      expect(sql(answer, '(no rows)')).toBe(true);
    }
  });

  it('still rejects wrong values, wrong row order, and changed precision', () => {
    expect(sql('10, 20, 30', '10, 30, 20')).toBe(false);
    expect(sql('2\n1', '1\n2')).toBe(false);
    expect(sql('20.0', '20')).toBe(false);
    expect(sql('oslo', 'Oslo')).toBe(false);
    expect(sql('0', '(no rows)')).toBe(false);
    expect(sql('1, 2', '1\n2')).toBe(false);
  });
});

describe('predict-output matching: other languages keep exact whitespace rules', () => {
  it('does not apply the SQL cell rules to Python', () => {
    expect(py("'Eng'", 'Eng')).toBe(false);
    expect(py('1 | 2', '1, 2')).toBe(false);
    expect(py("[('b', 3)]", "[('b',3)]")).toBe(true);
    expect(py('  indented', 'indented')).toBe(false);
  });
});

describe('SQL predict questions', () => {
  const sqlPredicts = questions.filter(
    (q): q is PredictOutputQuestion =>
      q.type === QuestionType.PREDICT_OUTPUT && (q as PredictOutputQuestion).language === CodeLanguage.SQL,
  );

  it('Querying Foundations predicts write their expected rows in the convention the UI shows', () => {
    const section = sqlPredicts.filter(q =>
      /^tsql-(select|filter|str|dt|joins|agg|subq|setops|dml)-/.test(q.id),
    );
    expect(section.length).toBeGreaterThan(0);
    const offenders = section
      .filter(q =>
        q.expectedOutput.trim().length === 0
        // `Col=value` cells or a header row are formats the learner is never told to use
        || /\w=\w/.test(q.expectedOutput)
        // the code a learner reads must be a single query result: no PRINT output to mix in
        || /\bPRINT\b/i.test(q.code),
      )
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});
