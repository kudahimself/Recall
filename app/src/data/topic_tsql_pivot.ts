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
import { sampleTable } from './tsqlSampleTables';

export const tsql_pivot_questions: Question[] = [
  {
    id: 'tsql-pivot-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PIVOT,
    course: Course.SQL,
    question: 'What does a PIVOT do, and what is its portable equivalent?',
    options: [
      { id: 'a', text: 'It turns the values of one column into columns, aggregating a measure under each; portably, write one `SUM(CASE WHEN col = \'x\' THEN val END)` per new column.', isCorrect: true },
      { id: 'b', text: 'It turns the values of one column into columns, aggregating a measure under each; portably, GROUP BY that column, which gives one column per value.', isCorrect: false },
      { id: 'c', text: 'It turns several columns into rows of a column name and a value; portably, write one SELECT per column and combine them with UNION ALL.', isCorrect: false },
      { id: 'd', text: 'It turns the values of one column into columns without aggregating; portably, write one `CASE WHEN col = \'x\' THEN val END` per new column, with no SUM.', isCorrect: false },
    ],
    explanation: 'PIVOT turns distinct values of one column into separate output columns, aggregating a measure under each. The dialect-agnostic way to do the same thing is conditional aggregation: one `SUM(CASE WHEN category = \'x\' THEN amount ELSE 0 END)` per category. `GROUP BY` alone gives one row per value, not a column; a bare `CASE` without `SUM` keeps one row per input row; and turning columns back into rows is UNPIVOT.',
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
    question: 'What does this query return? It is one row of two columns - write them in SELECT order, separated by a comma.',
    tables: [{ name: 'dbo.Sale', columns: ['SaleId', 'Category', 'Amount'], rows: [[1, 'Books', 10], [2, 'Toys', 5], [3, 'Books', 20]] }],
    code: `SELECT SUM(CASE WHEN Category = 'Books' THEN Amount ELSE 0 END) AS Books,
       SUM(CASE WHEN Category = 'Toys' THEN Amount ELSE 0 END) AS Toys
FROM dbo.Sale;`,
    expectedOutput: `30, 5`,
    explanation: 'Each CASE passes a row\'s amount only to its own column and 0 otherwise: Books sums 10 + 0 + 20 = 30 and Toys 0 + 5 + 0 = 5. With no GROUP BY the whole table collapses to one row, the categories turned into columns. This is the conditional-aggregation building block of a pivot.',
    hints: ['Each column sums only the amounts of its own category'],
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
    tables: [sampleTable('dbo.FactSale', ['SaleId', 'Category', 'Amount'])],
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
    explanation: 'The `ELSE 0` makes non-matching rows contribute 0 to that column\'s SUM, so each output column totals just its own category, collapsing many rows into one pivoted row (here Books 75, Toys 37). Without it the CASE gives NULL on those rows, and a column with no matching rows at all would come out NULL instead of 0.',
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
    question: "Fill in the native pivot clause and the keyword that names the column whose values become the new columns.",
    tables: [sampleTable('dbo.FactSale', ['SaleId', 'Category', 'Amount'])],
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Books, Toys
FROM (SELECT Category, Amount FROM dbo.FactSale) AS src
___ (SUM(Amount) ___ Category IN ([Books], [Toys])) AS p;`,
    blanks: ['PIVOT', 'FOR'],
    solution: `SELECT Books, Toys
FROM (SELECT Category, Amount FROM dbo.FactSale) AS src
PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
    explanation: 'Native `PIVOT (aggregate(col) FOR spreading_col IN ([val1], [val2], ...)) AS alias` rotates each listed value of `Category` into its own output column, aggregating `Amount` under it, so this returns one row: Books 75, Toys 37. PIVOT groups by every input column it does not pivot, which is why it reads from a subquery of just Category and Amount; straight from `dbo.FactSale` it would group by SaleId too and return one row per sale. The value list must be hard-coded - PIVOT cannot discover column names.',
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
      { id: 'a', text: "It turns the Books and Toys columns into rows: one column holds the name 'Books' or 'Toys' and another holds that column's value.", isCorrect: true },
      { id: 'b', text: 'It turns the Books and Toys columns into rows and brings back the original detail rows that a PIVOT had summed together.', isCorrect: false },
      { id: 'c', text: 'It adds the Books and Toys columns together into a single total column, keeping one output row for every input row.', isCorrect: false },
      { id: 'd', text: 'It turns the Books and Toys columns into rows, and a NULL in either column becomes a row whose value is NULL.', isCorrect: false },
    ],
    explanation: 'UNPIVOT is the mirror image of PIVOT: it takes several columns and rotates them into two - one holding the original column name (as a value) and one holding the original value - turning "wide" data back into "long" data. It cannot undo the aggregation: after a PIVOT summed several rows, UNPIVOT gives back one row per total, not the detail rows. It also drops NULLs, so a NULL Books value produces no row.',
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
    tables: [sampleTable('dbo.FactSale', ['SaleId', 'Category', 'Amount'])],
    starterCode: `-- dbo.FactSale (SaleId, Category, Amount); return one row with columns Books and Toys
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
SELECT
    SUM(CASE WHEN Category = 'Books' THEN Amount END) AS Books,
    SUM(CASE WHEN Category = 'Toys'  THEN Amount END) AS Toys
FROM dbo.FactSale;
-- OR
SELECT Books, Toys
FROM (SELECT Category, Amount FROM dbo.FactSale) AS src
PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
    tieredHints: {
      apiSignature: 'SUM(CASE WHEN condition THEN value ELSE 0 END) -> one aggregated column',
      skeleton: `SELECT
    ____(CASE WHEN Category = 'Books' THEN ____ ELSE 0 END) AS ____,
    ____(CASE WHEN Category = 'Toys'  THEN ____ ELSE 0 END) AS ____
FROM dbo.FactSale;`,
    },
    explanation: 'Conditional aggregation collapses all rows into a single pivoted row: one `SUM(CASE ...)` per target category, here Books 75 and Toys 37. `ELSE 0` is optional because SUM skips NULLs, but it makes a category with no rows read 0 instead of NULL. The native `PIVOT` operator (accepted as an alternate) is more compact but needs a subquery of just the columns it uses, and either way the category list is hard-coded.',
    hints: ['One SUM(CASE WHEN Category = …) per output column', 'no GROUP BY needed for a single summary row'],
    // All accepted branches must satisfy this: the conditional-aggregation
    // form the prompt asks for has no PIVOT token, the native form has no CASE.
    // Case-insensitive so lowercase SQL is not rejected.
    requires: [/PIVOT|CASE\s+WHEN/i],
    tags: ['tsql', 'pivot', 'conditional-aggregation'],
  },
];
