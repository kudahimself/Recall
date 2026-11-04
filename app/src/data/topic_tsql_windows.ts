/**
 * Topic.TSQL_WINDOWS — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): OVER / PARTITION BY / ORDER BY,
 * ROW_NUMBER / RANK / DENSE_RANK / NTILE.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
  SqlTable,
} from '../types';
import { sampleTable } from './tsqlSampleTables';

// Four exam scores with a tie at the top, for the RANK / DENSE_RANK predicts.
const EXAM: SqlTable = {
  name: 'dbo.Exam',
  columns: ['StudentId', 'Score'],
  rows: [[1, 90], [2, 90], [3, 80], [4, 70]],
};

export const tsql_windows_questions: Question[] = [
  {
    id: 'tsql-windows-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    question: 'How do ROW_NUMBER, RANK, and DENSE_RANK differ when the ORDER BY has ties?',
    options: [
      { id: 'a', text: 'ROW_NUMBER gives tied rows different numbers (1, 2, 3); RANK gives them the same number and then skips (1, 1, 3); DENSE_RANK gives the same number without skipping (1, 1, 2).', isCorrect: true },
      { id: 'b', text: 'ROW_NUMBER gives tied rows different numbers (1, 2, 3); RANK gives them the same number without skipping (1, 1, 2); DENSE_RANK gives the same number and then skips (1, 1, 3).', isCorrect: false },
      { id: 'c', text: 'ROW_NUMBER and RANK both give tied rows the same number and then skip (1, 1, 3); DENSE_RANK gives every row a different number (1, 2, 3).', isCorrect: false },
      { id: 'd', text: 'ROW_NUMBER gives tied rows the same number (1, 1, 2); RANK and DENSE_RANK give every row a different number (1, 2, 3).', isCorrect: false },
    ],
    explanation: 'On ties, ROW_NUMBER still numbers every row uniquely (1, 2, 3), and which of the tied rows gets the lower number is not guaranteed unless the ORDER BY has a tiebreaker. RANK gives tied rows the same rank and then leaves a gap (1, 1, 3). DENSE_RANK gives them the same rank with no gap (1, 1, 2). Use ROW_NUMBER to pick exactly one row per group, RANK or DENSE_RANK for leaderboards.',
    hints: ['ROW_NUMBER = always unique', 'RANK skips after ties, DENSE_RANK does not'],
    tags: ['tsql', 'windows', 'row-number', 'rank', 'dense-rank'],
  },
  {
    id: 'tsql-windows-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query return? Write one rank per line, in the order the query returns them.',
    tables: [EXAM],
    code: `SELECT RANK() OVER (ORDER BY Score DESC) AS Rnk
FROM dbo.Exam
ORDER BY Rnk;`,
    expectedOutput: `1
1
3
4`,
    explanation: 'RANK gives the two 90s the same rank (1), then SKIPS to 3 for the next score (80), then 4 (70). The gap after the tie is what distinguishes RANK from DENSE_RANK, which would give 1, 1, 2, 3.',
    hints: ['Ties share a rank; RANK then leaves a gap'],
    tags: ['tsql', 'windows', 'rank', 'predict'],
  },
  {
    id: 'tsql-windows-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query return? Write one rank per line, in the order the query returns them.',
    tables: [EXAM],
    code: `SELECT DENSE_RANK() OVER (ORDER BY Score DESC) AS DenseRnk
FROM dbo.Exam
ORDER BY DenseRnk;`,
    expectedOutput: `1
1
2
3`,
    explanation: 'DENSE_RANK gives tied rows the same rank but does NOT leave a gap afterward, so the sequence is 1, 1, 2, 3. RANK on the same scores gives 1, 1, 3, 4.',
    hints: ['Same rank for ties, no gap after'],
    tags: ['tsql', 'windows', 'dense-rank', 'predict'],
  },
  {
    id: 'tsql-windows-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the window keywords: number each customer\'s orders from their largest amount down, starting again at 1 for every customer.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT CustomerKey, OrderId, Amount,
       ROW_NUMBER() ___ (___ ___ CustomerKey ORDER BY Amount DESC) AS rn
FROM dbo.FactOrders;`,
    blanks: ['OVER', 'PARTITION', 'BY'],
    solution: `SELECT CustomerKey, OrderId, Amount,
       ROW_NUMBER() OVER (PARTITION BY CustomerKey ORDER BY Amount DESC) AS rn
FROM dbo.FactOrders;`,
    explanation: '`OVER (PARTITION BY CustomerKey ORDER BY Amount DESC)` restarts the numbering for each customer and orders within that partition by amount, so `rn = 1` is each customer\'s biggest order: 5001 for customer 1 and 5004 for customer 4.',
    hints: ['OVER opens the window', 'PARTITION BY restarts per group'],
    tags: ['tsql', 'windows', 'row-number', 'partition-by', 'cloze'],
  },
  {
    id: 'tsql-windows-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    question: 'How does a window function differ from a GROUP BY aggregate?',
    options: [
      { id: 'a', text: 'A window function returns a value on every row and keeps the detail rows; GROUP BY collapses each group to one row.', isCorrect: true },
      { id: 'b', text: 'Both return one row per group; a window function only lets you put the rows of each group in order first.', isCorrect: false },
      { id: 'c', text: 'A window function returns a value on every row, but only in a query that also has a GROUP BY to form its groups.', isCorrect: false },
      { id: 'd', text: 'A window function returns a value on every row, so it can be filtered in WHERE; a GROUP BY aggregate needs HAVING.', isCorrect: false },
    ],
    explanation: 'A window function keeps every detail row and attaches a computed value (rank, running total, lag) beside it, whereas GROUP BY collapses each group to a single summary row. `PARTITION BY` forms the window\'s groups on its own, with no GROUP BY needed. A window function is worked out after WHERE, so `WHERE rn = 1` fails: compute it in a CTE or subquery and filter in the outer query.',
    hints: ['Window = value per row, no collapsing', 'GROUP BY = one row per group'],
    tags: ['tsql', 'windows', 'group-by'],
  },
  {
    id: 'tsql-windows-ntile-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the argument that splits the rows into four buckets (quartiles).',
    tables: [sampleTable('dbo.DimProduct', ['ProductName', 'Price'])],
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ProductName, Price,
       NTILE(___) OVER (ORDER BY Price DESC) AS Quartile
FROM dbo.DimProduct;`,
    blanks: ['4'],
    solution: `SELECT ProductName, Price,
       NTILE(4) OVER (ORDER BY Price DESC) AS Quartile
FROM dbo.DimProduct;`,
    explanation: '`NTILE(n)` splits the ordered rows into `n` buckets of nearly equal size, labelling each row 1 to n, so `NTILE(4)` gives quartiles with the most expensive products in bucket 1. When the rows do not divide evenly the first buckets get one extra row: the 6 products here land in buckets of 2, 2, 1 and 1.',
    hints: ['Quartiles = how many buckets?'],
    tags: ['tsql', 'windows', 'ntile', 'cloze'],
  },
  {
    id: 'tsql-windows-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.DimProduct` (Category, ProductName, Price), return Category, ProductName, Price and a column `Rnk` that ranks products by Price descending WITHIN each Category (tied prices share a rank, with gaps).',
    tables: [sampleTable('dbo.DimProduct', ['ProductName', 'Category', 'Price'])],
    starterCode: `-- Return Category, ProductName, Price, and Rnk (Price DESC per Category)
`,
    testCases: [
      {
        input: 'RANK() OVER (PARTITION BY Category ORDER BY Price DESC)',
        expectedOutput: 'Per-category price ranking with gaps on ties',
        description: 'RANK partitioned by category',
      },
    ],
    solution: `SELECT Category, ProductName, Price,
       RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS Rnk
FROM dbo.DimProduct;`,
    explanation: '`RANK()` gives gaps on ties (the prompt asked for that); `PARTITION BY Category` restarts the ranking per category; `ORDER BY Price DESC` makes rank 1 the most expensive. Every product row is kept, which is the window-function advantage over GROUP BY. Here Atlas of Rivers is rank 1 and The Great Novel rank 2 in Books, and the product with a NULL Category forms a partition of its own.',
    hints: ['RANK() for tie-with-gap', 'PARTITION BY Category ORDER BY Price DESC'],
    tieredHints: {
      apiSignature: 'RANK() OVER (PARTITION BY partition_expr, ... ORDER BY sort_expr [ASC|DESC], ...)',
      skeleton: `SELECT ____, ____, ____,
       ____() OVER (PARTITION BY ____ ORDER BY ____ ____) AS ____
FROM dbo.DimProduct;`,
    },
    requires: [/OVER/i, /\bRANK\s*\(/i],
    tags: ['tsql', 'windows', 'rank', 'partition-by'],
  },
];
