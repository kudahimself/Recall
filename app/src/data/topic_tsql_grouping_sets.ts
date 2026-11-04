/**
 * Topic.TSQL_GROUPING_SETS — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): GROUPING SETS / ROLLUP / CUBE, GROUPING().
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

const FACT_SALE = sampleTable('dbo.FactSale', ['SaleId', 'Category', 'SubCategory', 'Amount']);

export const tsql_grouping_sets_questions: Question[] = [
  {
    id: 'tsql-gs-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    question: 'For two columns a and b, how do ROLLUP, CUBE, and GROUPING SETS differ?',
    options: [
      { id: 'a', text: 'ROLLUP(a, b) gives (a, b), (a) and the grand total; CUBE(a, b) also adds (b) alone; GROUPING SETS gives exactly the groupings you list.', isCorrect: true },
      { id: 'b', text: 'ROLLUP(a, b) gives (a, b), (a), (b) and the grand total; CUBE(a, b) gives only (a, b), (a) and the grand total; GROUPING SETS gives the ones you list.', isCorrect: false },
      { id: 'c', text: 'ROLLUP(a, b) gives (a, b) and (a) but no grand total; CUBE(a, b) adds the grand total; GROUPING SETS gives exactly the groupings you list.', isCorrect: false },
      { id: 'd', text: 'ROLLUP(a, b) and CUBE(a, b) give only the subtotal rows, without the (a, b) detail rows; GROUPING SETS is the only one that keeps them.', isCorrect: false },
    ],
    explanation: 'For columns (a, b): ROLLUP gives (a, b), (a), () - a hierarchy with a grand total. CUBE gives (a, b), (a), (b), () - every combination. GROUPING SETS gives exactly the list you specify, e.g. ((a, b), (a), ()), and ROLLUP and CUBE are shorthand for such lists. All three keep the detail grouping (a, b). Use `GROUPING()` to tell a real NULL apart from a subtotal placeholder NULL.',
    hints: ['ROLLUP = hierarchy + grand total', 'CUBE = all combos; GROUPING SETS = your explicit list'],
    tags: ['tsql', 'grouping-sets', 'rollup', 'cube'],
  },
  {
    id: 'tsql-gs-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator that adds a subtotal for each Category and one grand total, and no other subtotals.',
    tables: [FACT_SALE],
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ___(Category, SubCategory);`,
    blanks: ['ROLLUP'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    explanation: '`GROUP BY ROLLUP(Category, SubCategory)` returns the detailed (Category, SubCategory) rows, a subtotal per Category (SubCategory = NULL; Books 75, Toys 37), and a grand total (both NULL; 112) - the hierarchical rollup of a report. `CUBE` would also add a subtotal per SubCategory, which the prompt rules out.',
    hints: ['Hierarchical-subtotals operator'],
    tags: ['tsql', 'grouping-sets', 'rollup', 'cloze'],
  },
  {
    id: 'tsql-gs-cube-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator that computes every combination of Category and SubCategory (not just the hierarchical ones).',
    tables: [FACT_SALE],
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ___(Category, SubCategory);`,
    blanks: ['CUBE'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY CUBE(Category, SubCategory);`,
    explanation: '`CUBE(Category, SubCategory)` returns every combination of the grouping columns: (Category, SubCategory), (Category) alone, (SubCategory) alone, and the grand total. ROLLUP would skip the (SubCategory)-alone rows, such as Fiction 35 across all categories, since it only builds a strict hierarchy.',
    hints: ['All-combinations operator, not just the hierarchy'],
    tags: ['tsql', 'grouping-sets', 'cube', 'cloze'],
  },
  {
    id: 'tsql-gs-groupingsets-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two-word operator that lets you list exactly the groupings to compute.',
    tables: [FACT_SALE],
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ___ ___ ((Category, SubCategory), (Category), ());`,
    blanks: ['GROUPING', 'SETS'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY GROUPING SETS ((Category, SubCategory), (Category), ());`,
    explanation: '`GROUPING SETS` computes exactly the listed groupings in one pass: full detail, a Category subtotal, and the grand total `()`. It is the explicit form ROLLUP/CUBE are shorthand for.',
    hints: ['Two words: the explicit grouping-list operator'],
    tags: ['tsql', 'grouping-sets', 'cloze'],
  },
  {
    id: 'tsql-gs-groupingfn-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the function that flags whether SubCategory's NULL is a real value or a ROLLUP subtotal placeholder.",
    tables: [FACT_SALE],
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
SELECT Category, SubCategory, SUM(Amount) AS Total,
       ___(SubCategory) AS IsSubtotal
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    blanks: ['GROUPING'],
    blankAlternates: [['GROUPING_ID']],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total,
       GROUPING(SubCategory) AS IsSubtotal
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    explanation: '`ROLLUP`/`CUBE`/`GROUPING SETS` all pad missing grouping columns with NULL to mark a subtotal row - but SubCategory is genuinely NULL on sale 4, so the result has two Books rows with a NULL SubCategory: the real one (Total 10) and the Books subtotal (Total 75). `GROUPING(col)` returns 1 when the NULL is a rollup placeholder and 0 when it is a real stored NULL. (`GROUPING_ID(SubCategory)` gives the same 1 or 0 for a single column.)',
    hints: ['Returns 1 for a rollup-placeholder NULL, 0 for a real NULL'],
    tags: ['tsql', 'grouping-sets', 'grouping-function', 'cloze'],
  },
  {
    id: 'tsql-gs-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.FactSale` (Category, SubCategory, Amount), return Category, SubCategory and `SUM(Amount) AS Total` with a subtotal per Category and an overall grand total, using ROLLUP.',
    tables: [FACT_SALE],
    starterCode: `-- Return Category, SubCategory, and Total with subtotals and grand total using ROLLUP
`,
    testCases: [
      {
        input: 'GROUP BY ROLLUP(Category, SubCategory)',
        expectedOutput: 'Detail rows + per-category subtotals + grand total',
        description: 'ROLLUP report',
      },
    ],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);
-- OR
SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY Category, SubCategory WITH ROLLUP;`,
    tieredHints: {
      apiSignature: 'SUM(expression) -> aggregate per GROUP BY group',
      skeleton: `SELECT Category, SubCategory, ____(____) AS ____
FROM dbo.FactSale
____ ____ ____(Category, ____);`,
    },
    explanation: 'ROLLUP(Category, SubCategory) emits the detail level, a subtotal row per Category (with SubCategory NULL), and a final grand-total row (both NULL) - exactly the shape of a hierarchical sales report. The older `GROUP BY Category, SubCategory WITH ROLLUP` spelling gives the same rows. The column order matters: ROLLUP(SubCategory, Category) would subtotal per SubCategory instead.',
    hints: ['One operator does subtotals + grand total'],
    requires: [/ROLLUP/i],
    tags: ['tsql', 'grouping-sets', 'rollup'],
  },
  {
    id: 'tsql-gs-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.FactSale` (Category, SubCategory, Amount), using GROUPING SETS, return Category, SubCategory and `SUM(Amount) AS Total` for exactly these three groupings in one query: (Category, SubCategory), (Category) alone, and the overall grand total.',
    tables: [FACT_SALE],
    starterCode: `-- return Category, SubCategory, and Total for three exactly-specified groupings
`,
    testCases: [
      {
        input: 'GROUP BY GROUPING SETS ((Category, SubCategory), (Category), ())',
        expectedOutput: 'Detail rows + per-category subtotals + grand total, with no other grouping levels',
        description: 'Explicit grouping-set list',
      },
    ],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY GROUPING SETS ((Category, SubCategory), (Category), ());`,
    tieredHints: {
      apiSignature: 'SUM(expression) -> aggregate per GROUP BY group',
      skeleton: `SELECT Category, SubCategory, ____(____) AS ____
FROM dbo.FactSale
____ ____ ____ ____ ((Category, ____), (____), ());`,
    },
    explanation: 'ROLLUP(Category, SubCategory) would produce this same shape here, but GROUPING SETS lets you specify precisely which groupings to compute - useful when the groupings you need are not a strict hierarchy (e.g. you want (Category) subtotals but not (SubCategory) subtotals, which CUBE would also include). The sets can be listed in any order.',
    hints: ['Explicit grouping-list operator, not ROLLUP or CUBE', 'List each grouping as its own parenthesized tuple, with () for the grand total'],
    requires: [/GROUPING\s+SETS/i],
    tags: ['tsql', 'grouping-sets'],
  },
  {
    id: 'tsql-gs-rollup-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What rows does this query return? Write one row per line in the order the query returns them, with Category and Total separated by a comma, and write a NULL as NULL.',
    tables: [{ name: 'dbo.Sale', columns: ['SaleId', 'Category', 'Amount'], rows: [[1, 'Books', 10], [2, 'Toys', 5], [3, 'Books', 20]] }],
    code: `SELECT Category, SUM(Amount) AS Total
FROM dbo.Sale
GROUP BY ROLLUP(Category)
ORDER BY GROUPING(Category), Category;`,
    expectedOutput: `Books, 30
Toys, 5
NULL, 35`,
    explanation: '`ROLLUP(Category)` groups by Category as usual, giving Books = 10 + 20 = 30 and Toys = 5, and then adds one grouping with no columns at all: the grand total, 35. That extra row has no Category of its own, so ROLLUP fills the column with NULL. `GROUPING(Category)` is 1 only on that subtotal row, so `ORDER BY GROUPING(Category)` puts it last.',
    hints: ['ROLLUP adds one extra row besides the detail rows: the grand total. ORDER BY GROUPING(...) puts it last', 'The grand-total row has no Category, so the column shows NULL'],
    tags: ['tsql', 'grouping-sets', 'rollup', 'predict'],
  },
];
