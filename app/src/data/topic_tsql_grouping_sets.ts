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

export const tsql_grouping_sets_questions: Question[] = [
  {
    id: 'tsql-gs-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_GROUPING_SETS,
    course: Course.SQL,
    question: 'How do ROLLUP, CUBE, and GROUPING SETS differ?',
    options: [
      { id: 'a', text: 'ROLLUP produces hierarchical subtotals plus a grand total; CUBE produces every combination of the grouping columns; GROUPING SETS lets you list exactly which groupings you want.', isCorrect: true },
      { id: 'b', text: 'All three are identical; ROLLUP and CUBE are just older spellings of GROUPING SETS.', isCorrect: false },
      { id: 'c', text: 'ROLLUP returns all combinations; CUBE returns only the grand total; GROUPING SETS returns one row per base table.', isCorrect: false },
      { id: 'd', text: 'ROLLUP and CUBE work only on a single column; GROUPING SETS is the only one that supports more than one column.', isCorrect: false },
    ],
    explanation: 'For columns (a, b): ROLLUP gives (a,b), (a), () — a hierarchy with a grand total. CUBE gives (a,b), (a), (b), () — every combination. GROUPING SETS gives exactly the list you specify, e.g. ((a,b),(a),()). Use `GROUPING()` to tell a real NULL apart from a subtotal placeholder NULL.',
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
    question: 'Fill in the operator that adds per-Category subtotals and a grand total to the group.',
    template: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ___(Category, SubCategory);`,
    blanks: ['ROLLUP'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    explanation: '`GROUP BY ROLLUP(Category, SubCategory)` returns the detailed (Category, SubCategory) rows, a subtotal per Category (SubCategory = NULL), and a grand total (both NULL) — the hierarchical rollup of a report.',
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
    template: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY ___(Category, SubCategory);`,
    blanks: ['CUBE'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total
FROM dbo.FactSale
GROUP BY CUBE(Category, SubCategory);`,
    explanation: '`CUBE(Category, SubCategory)` returns every combination of the grouping columns: (Category, SubCategory), (Category) alone, (SubCategory) alone, and the grand total. ROLLUP would skip the (SubCategory)-alone row since it only builds a strict hierarchy.',
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
    template: `SELECT Category, SubCategory, SUM(Amount) AS Total
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
    template: `SELECT Category, SubCategory, SUM(Amount) AS Total,
       ___(SubCategory) AS IsSubtotal
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    blanks: ['GROUPING'],
    solution: `SELECT Category, SubCategory, SUM(Amount) AS Total,
       GROUPING(SubCategory) AS IsSubtotal
FROM dbo.FactSale
GROUP BY ROLLUP(Category, SubCategory);`,
    explanation: '`ROLLUP`/`CUBE`/`GROUPING SETS` all pad missing grouping columns with NULL to mark a subtotal row - but if SubCategory can genuinely be NULL in the source data, that is ambiguous. `GROUPING(col)` returns 1 when the NULL is a rollup placeholder and 0 when it is a real stored NULL.',
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
    starterCode: `-- GROUP BY ROLLUP(Category, SubCategory)
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
GROUP BY ROLLUP(Category, SubCategory);`,
    explanation: 'ROLLUP(Category, SubCategory) emits the detail level, a subtotal row per Category (with SubCategory NULL), and a final grand-total row (both NULL) — exactly the shape of a hierarchical sales report.',
    hints: ['One operator does subtotals + grand total'],
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
    explanation: 'ROLLUP(Category, SubCategory) would produce this same shape here, but GROUPING SETS lets you specify precisely which groupings to compute - useful when the groupings you need are not a strict hierarchy (e.g. you want (Category) subtotals but not (SubCategory) subtotals, which CUBE would also include).',
    hints: ['Explicit grouping-list operator, not ROLLUP or CUBE', 'List each grouping as its own parenthesized tuple, with () for the grand total'],
    tags: ['tsql', 'grouping-sets'],
  },
];
