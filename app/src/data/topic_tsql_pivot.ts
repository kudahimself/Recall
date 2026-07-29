/**
 * Topic.TSQL_PIVOT — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): native PIVOT/UNPIVOT and the portable
 * conditional-aggregation pivot (CASE + SUM).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_pivot_questions: Question[] = [
  {
    id: 'tsql-pivot-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    question: 'What does a PIVOT do, and what is its portable equivalent?',
    options: [
      { id: 'a', text: 'PIVOT rotates row values into columns by aggregating; the portable equivalent is `SUM(CASE WHEN col = \'x\' THEN val END)` per target column.', isCorrect: true },
      { id: 'b', text: 'PIVOT sorts rows into columns alphabetically; there is no equivalent without it.', isCorrect: false },
      { id: 'c', text: 'PIVOT joins two tables on a shared key; the equivalent is an INNER JOIN.', isCorrect: false },
      { id: 'd', text: 'PIVOT removes duplicate rows; the equivalent is SELECT DISTINCT.', isCorrect: false },
    ],
    explanation: 'PIVOT turns distinct values of one column into separate output columns, aggregating a measure under each. The dialect-agnostic way to do the same thing is conditional aggregation: one `SUM(CASE WHEN category = \'x\' THEN amount ELSE 0 END)` per category — more verbose but portable and flexible.',
    hints: ['Rows → columns by aggregation', 'portable form = SUM(CASE WHEN …)'],
    tags: ['tsql', 'pivot', 'conditional-aggregation'],
  },
  {
    id: 'tsql-pivot-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT SUM(CASE WHEN v.cat = 'A' THEN v.amt ELSE 0 END) AS a_total
FROM (VALUES ('A', 10), ('B', 5), ('A', 20)) AS v(cat, amt);`,
    expectedOutput: `30`,
    explanation: 'The CASE contributes the amount only for category A rows (10 and 20) and 0 otherwise, so the SUM is 30. This is the conditional-aggregation building block of a pivot.',
    hints: ['Sum amounts only where cat = A'],
    tags: ['tsql', 'pivot', 'conditional-aggregation', 'predict'],
  },
  {
    id: 'tsql-pivot-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the CASE branch keyword that contributes 0 when the category does not match.',
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT
    SUM(CASE WHEN Category = 'Books' THEN Amount ___ 0 END) AS Books,
    SUM(CASE WHEN Category = 'Toys'  THEN Amount ELSE 0 END) AS Toys
FROM dbo.FactSale;`,
    blanks: ['ELSE'],
    solution: `SELECT
    SUM(CASE WHEN Category = 'Books' THEN Amount ELSE 0 END) AS Books,
    SUM(CASE WHEN Category = 'Toys'  THEN Amount ELSE 0 END) AS Toys
FROM dbo.FactSale;`,
    explanation: 'The `ELSE 0` makes non-matching rows contribute 0 to that column\'s SUM, so each output column totals just its own category — collapsing many rows into one pivoted row.',
    hints: ['The CASE fallback branch'],
    tags: ['tsql', 'pivot', 'conditional-aggregation', 'cloze'],
  },
  {
    id: 'tsql-pivot-native-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the native pivot clause and the keyword that names the columns to create.",
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Books, Toys
FROM dbo.FactSale
___ (SUM(Amount) ___ Category IN ([Books], [Toys])) AS p;`,
    blanks: ['PIVOT', 'FOR'],
    solution: `SELECT Books, Toys
FROM dbo.FactSale
PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
    explanation: 'Native `PIVOT (aggregate(col) FOR spreading_col IN (val1, val2, …)) AS alias` rotates each listed value of `Category` into its own output column, aggregating `Amount` under it. The value list must be hard-coded - PIVOT cannot discover column names dynamically.',
    hints: ['The operator keyword itself', 'FOR names the column whose values become new columns'],
    tags: ['tsql', 'pivot', 'native-pivot', 'cloze'],
  },
  {
    id: 'tsql-pivot-unpivot-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    question: 'What does UNPIVOT do to a table with columns `Books` and `Toys`?',
    options: [
      { id: 'a', text: 'Rotates those columns back into rows, producing a Category column (with values \'Books\'/\'Toys\') and a matching value column - the reverse of PIVOT.', isCorrect: true },
      { id: 'b', text: 'Deletes the Books and Toys columns without replacing them.', isCorrect: false },
      { id: 'c', text: 'Merges Books and Toys into a single summed column.', isCorrect: false },
      { id: 'd', text: 'Sorts the table by the Books and Toys values.', isCorrect: false },
    ],
    explanation: 'UNPIVOT is the mirror image of PIVOT: it takes several columns and rotates them into two columns - one holding the original column name (as a value) and one holding the original value - turning "wide" data back into "long" (tidy/row-per-fact) data.',
    hints: ['The reverse of PIVOT: columns become rows', 'wide → long'],
    tags: ['tsql', 'pivot', 'unpivot'],
  },
  {
    id: 'tsql-pivot-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "From `dbo.FactSale` (Category, Amount), return ONE row with the total Amount for 'Books' (aliased `Books`) and the total Amount for 'Toys' (aliased `Toys`), using conditional aggregation (SUM with CASE).",
    starterCode: `-- SELECT SUM(CASE WHEN Category = 'Books' ...) AS Books, ... AS Toys FROM dbo.FactSale;
`,
    testCases: [
      {
        input: "SUM(CASE WHEN Category='Books'...) AS Books, SUM(CASE WHEN Category='Toys'...) AS Toys",
        expectedOutput: 'One row: Books total and Toys total side by side',
        description: 'Conditional-aggregation pivot',
      },
    ],
    solution: `SELECT
    SUM(CASE WHEN Category = 'Books' THEN Amount ELSE 0 END) AS Books,
    SUM(CASE WHEN Category = 'Toys'  THEN Amount ELSE 0 END) AS Toys
FROM dbo.FactSale;
-- OR
SELECT Books, Toys
FROM dbo.FactSale
PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
    tieredHints: {
      apiSignature: 'PIVOT(aggregate_function(value_column) FOR pivot_column IN ([val1], [val2])) AS alias',
      skeleton: `SELECT
    ____(CASE WHEN Category = 'Books' THEN ____ ELSE 0 END) AS ____,
    ____(CASE WHEN Category = 'Toys'  THEN ____ ELSE 0 END) AS ____
FROM dbo.FactSale;`,
    },
    explanation: 'Conditional aggregation collapses all rows into a single pivoted row: one `SUM(CASE …)` per target category. The native `PIVOT` operator (shown as the alternate) is more compact but requires you to hard-code the category list in `FOR Category IN (…)` either way.',
    hints: ['One SUM(CASE WHEN Category = …) per output column', 'no GROUP BY needed for a single summary row'],
    // Both accepted branches must satisfy this: the conditional-aggregation
    // form the prompt asks for has no PIVOT token, the native form has no CASE.
    // Case-insensitive so lowercase SQL is not rejected.
    requires: [/PIVOT|CASE\s+WHEN/i],
    tags: ['tsql', 'pivot', 'conditional-aggregation'],
  },
];
