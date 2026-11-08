import { CodeLanguage } from '../types';
import { questions } from '../data/questions';
import { QuestionType, PredictOutputQuestion } from '../types';
import {
  outputInstruction,
  outputMatches,
  DEFAULT_OUTPUT_CONVENTION,
  RENDERED_OUTPUT_CONVENTION,
  SQL_MIXED_PRINT_CONVENTION,
  SQL_OUTPUT_CONVENTION,
  SQL_PRINT_CONVENTION,
} from './predictOutput';

const sql = (user: string, ...expected: string[]) => outputMatches(user, expected, CodeLanguage.SQL);
const py = (user: string, ...expected: string[]) => outputMatches(user, expected, CodeLanguage.PYTHON);

describe('predict-output matching: SQL result sets', () => {
  it('accepts comma and tab column separators with any spacing', () => {
    for (const answer of ['10, 30, 20', '10,30,20', '10\t30\t20', '10 ,  30,20']) {
      expect(sql(answer, '10, 30, 20')).toBe(true);
    }
  });

  it('accepts text values with or without quotes, and NULL in any case', () => {
    expect(sql("'Eng'", 'Eng')).toBe(true);
    expect(sql('"Eng"', 'Eng')).toBe(true);
    expect(sql('13\nnull\n10', '13\nNULL\n10')).toBe(true);
  });

  it('ignores blank lines between rows', () => {
    expect(sql('\n1\n\n2\n', '1\n2')).toBe(true);
  });

  it('accepts the obvious spellings of an empty result', () => {
    for (const answer of ['(no rows)', 'no rows', '0 rows', 'EMPTY']) {
      expect(sql(answer, '(no rows)')).toBe(true);
    }
  });

  it('does not read pipes or border lines as table structure, so cell values keep their meaning', () => {
    expect(sql('10 | 30 | 20', '10, 30, 20')).toBe(false);
    expect(sql('| 10 | 30 | 20 |', '10, 30, 20')).toBe(false);
    expect(sql('a|b', 'a|b')).toBe(true);
    expect(sql('a|b', 'a, b')).toBe(false);
    expect(sql('---\n1', '1')).toBe(false);
    expect(sql('---', '---')).toBe(true);
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

describe('predict-output instruction matches what the code outputs', () => {
  it('shows the rows convention for a SQL query with no PRINT', () => {
    expect(outputInstruction('SELECT 1, 2;', CodeLanguage.SQL)).toBe(SQL_OUTPUT_CONVENTION);
  });

  it('asks for each printed line for a SQL batch that only PRINTs', () => {
    expect(outputInstruction("DECLARE @n INT = 7;\nPRINT 'odd';", CodeLanguage.SQL)).toBe(SQL_PRINT_CONVENTION);
  });

  it('says to type only the PRINT output for a batch that both SELECTs and PRINTs', () => {
    expect(outputInstruction("BEGIN TRY\n  SELECT 1 / 0;\n  PRINT 'x';\nEND TRY", CodeLanguage.SQL))
      .toBe(SQL_MIXED_PRINT_CONVENTION);
  });

  it('keeps the exact-output instruction for other languages', () => {
    expect(outputInstruction("print('hi')", CodeLanguage.PYTHON)).toBe(DEFAULT_OUTPUT_CONVENTION);
  });

  it('asks about the rendered page, not printed output, for HTML and CSS', () => {
    expect(outputInstruction('<p>Hi</p>', CodeLanguage.HTML)).toBe(RENDERED_OUTPUT_CONVENTION);
    expect(outputInstruction('.a { width: 10px; }', CodeLanguage.CSS)).toBe(RENDERED_OUTPUT_CONVENTION);
    expect(RENDERED_OUTPUT_CONVENTION).not.toMatch(/prints\b/);
  });
});

describe('HTML and CSS predict questions', () => {
  const rendered = questions.filter(
    (q): q is PredictOutputQuestion =>
      q.type === QuestionType.PREDICT_OUTPUT
      && [CodeLanguage.HTML, CodeLanguage.CSS].includes((q as PredictOutputQuestion).language),
  );

  it('each names what to type and in what form, since the instruction defers to the question', () => {
    expect(rendered.length).toBeGreaterThan(0);
    const vague = rendered
      .filter(q => !/\bType\b/.test(q.question) || /what (?:does it|it) prints?\b/i.test(q.question))
      .map(q => q.id);
    expect(vague).toEqual([]);
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

  it('the min/max/average predict accepts the plain row the on-screen instruction describes', () => {
    // Owner report: this question used to demand `Lo=10, Hi=30, Avg=20`, a
    // format nothing on screen asked for. The rows convention says "columns in
    // SELECT order separated by a comma", so the plain row must be the answer.
    const q = sqlPredicts.find(p => p.id === 'tsql-agg-minmaxavg-predict-1') as PredictOutputQuestion;
    const accepted = [q.expectedOutput, ...(q.acceptableOutputs ?? [])];
    expect(outputInstruction(q.code, q.language)).toBe(SQL_OUTPUT_CONVENTION);
    expect(q.expectedOutput).toBe('10, 30, 20');
    expect(outputMatches('10, 30, 20', accepted, CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('10,30,20', accepted, CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('10, 20, 30', accepted, CodeLanguage.SQL)).toBe(false);
  });

  it('a batch that both SELECTs and PRINTs names PRINT in its prompt', () => {
    const offenders = sqlPredicts
      .filter(q => outputInstruction(q.code, q.language) === SQL_MIXED_PRINT_CONVENTION)
      .filter(q => !/\bPRINT\b/.test(q.question))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});
