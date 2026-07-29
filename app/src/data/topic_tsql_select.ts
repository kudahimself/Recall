/**
 * Topic.TSQL_SELECT — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): SELECT/FROM/WHERE/ORDER BY, TOP, OFFSET…FETCH,
 * DISTINCT, aliases.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_select_questions: Question[] = [
  {
    id: 'tsql-select-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    question: 'Which query returns the 5 most expensive products from `dbo.DimProduct` (ProductName, Price)?',
    options: [
      { id: 'a', text: 'SELECT TOP (5) ProductName, Price FROM dbo.DimProduct ORDER BY Price DESC;', isCorrect: true },
      { id: 'b', text: 'SELECT ProductName, Price FROM dbo.DimProduct ORDER BY Price DESC LIMIT 5;', isCorrect: false },
      { id: 'c', text: 'SELECT TOP (5) ProductName, Price FROM dbo.DimProduct;', isCorrect: false },
      { id: 'd', text: 'SELECT MAX(5) ProductName, Price FROM dbo.DimProduct ORDER BY Price DESC;', isCorrect: false },
    ],
    explanation: 'T-SQL limits rows with `TOP (n)`, not `LIMIT` (that is MySQL/Postgres). Crucially, `TOP` without `ORDER BY` returns an arbitrary 5 rows — the sort is what makes "most expensive" meaningful. `MAX(5)` is not valid syntax.',
    hints: ['T-SQL uses TOP (n), not LIMIT', 'TOP without ORDER BY is non-deterministic'],
    tags: ['tsql', 'select', 'top', 'order-by'],
  },
  {
    id: 'tsql-select-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT v.City
FROM (VALUES ('Oslo'), ('Cairo'), ('Lima')) AS v(City)
ORDER BY v.City DESC;`,
    expectedOutput: `Oslo
Lima
Cairo`,
    explanation: '`ORDER BY … DESC` sorts text in reverse alphabetical order: Oslo, Lima, Cairo. Ascending (the default) would give Cairo, Lima, Oslo.',
    hints: ['DESC = reverse alphabetical for text'],
    tags: ['tsql', 'select', 'order-by', 'predict'],
  },
  {
    id: 'tsql-select-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that filters rows, and the keyword that sorts highest-first.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT TOP (10) ProductName, Price
FROM dbo.DimProduct
___ Price > 100
ORDER BY Price ___;`,
    blanks: ['WHERE', 'DESC'],
    solution: `SELECT TOP (10) ProductName, Price
FROM dbo.DimProduct
WHERE Price > 100
ORDER BY Price DESC;`,
    explanation: '`WHERE` filters rows before they are returned; `ORDER BY Price DESC` sorts the result highest-first. Combined with `TOP (10)` this is the canonical "top-N by a metric" query.',
    hints: ['Row filter clause', 'Sort direction for highest-first'],
    tags: ['tsql', 'select', 'where', 'order-by', 'cloze'],
  },
  {
    id: 'tsql-select-offset-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    question: 'What does `OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY` do to an ordered result set?',
    options: [
      { id: 'a', text: 'Skips the first 20 rows, then returns the next 10 rows.', isCorrect: true },
      { id: 'b', text: 'Returns only the first 20 rows, ignoring anything after row 30.', isCorrect: false },
      { id: 'c', text: 'Returns rows 20 through 30 without needing an ORDER BY.', isCorrect: false },
      { id: 'd', text: 'Deletes the first 20 rows before returning the rest.', isCorrect: false },
    ],
    explanation: '`OFFSET n ROWS` skips the first `n` rows of the (required) ordered result, and `FETCH NEXT m ROWS ONLY` returns the next `m` after that skip. This is how T-SQL implements paging - page 3 of a 10-per-page list is `OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY`.',
    hints: ['OFFSET skips, FETCH NEXT takes', 'Requires ORDER BY to be meaningful'],
    tags: ['tsql', 'select', 'offset-fetch', 'pagination'],
  },
  {
    id: 'tsql-select-distinct-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    question: 'What does `SELECT DISTINCT Country FROM dbo.DimCustomer` return?',
    options: [
      { id: 'a', text: 'Each unique Country value once, with duplicate rows collapsed into one.', isCorrect: true },
      { id: 'b', text: 'Every row including duplicates, just sorted by Country ascending.', isCorrect: false },
      { id: 'c', text: 'Only the Country values that are different from NULL, dropping the rest.', isCorrect: false },
      { id: 'd', text: 'A single number — the count of how many distinct countries exist.', isCorrect: false },
    ],
    explanation: '`DISTINCT` deduplicates the result set on the selected columns, returning each combination once. It does not sort, does not count, and (unlike a filter) NULL counts as one distinct value too.',
    hints: ['DISTINCT collapses duplicate rows', 'It does not count or sort'],
    tags: ['tsql', 'select', 'distinct'],
  },
  {
    id: 'tsql-select-offset-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the paging keywords: skip 20 rows, then return the next 10.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ProductName, Price
FROM dbo.DimProduct
ORDER BY Price DESC
OFFSET 20 ___ FETCH ___ 10 ROWS ONLY;`,
    blanks: ['ROWS', 'NEXT'],
    solution: `SELECT ProductName, Price
FROM dbo.DimProduct
ORDER BY Price DESC
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;`,
    explanation: '`OFFSET n ROWS FETCH NEXT m ROWS ONLY` is the ANSI paging clause T-SQL uses (it requires an `ORDER BY`). Here it skips 20 and returns the next 10 — page 3 of a 10-per-page list.',
    hints: ['OFFSET n <unit> FETCH <which> m ROWS ONLY', 'paging requires ORDER BY'],
    tags: ['tsql', 'select', 'offset-fetch', 'pagination', 'cloze'],
  },
  {
    id: 'tsql-select-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/TOP/i, /ORDER\s+BY/i],
    question: "From `dbo.DimProduct` (ProductName, Category, Price), return the ProductName and Price of the 5 most expensive products in the 'Books' category, highest price first.",
    starterCode: `-- SELECT TOP (5) ...
`,
    testCases: [
      {
        input: "SELECT TOP (5) ... WHERE Category = 'Books' ORDER BY Price DESC",
        expectedOutput: 'Top 5 Books products by price descending',
        description: 'TOP + WHERE + ORDER BY',
      },
    ],
    solution: `SELECT TOP (5) ProductName, Price
FROM dbo.DimProduct
WHERE Category = 'Books'
ORDER BY Price DESC;`,
    tieredHints: {
      apiSignature: 'SELECT TOP (n) cols FROM tbl WHERE cond ORDER BY sort_col ASC|DESC;',
      skeleton: `SELECT ____ (5) ProductName, Price
FROM dbo.DimProduct
WHERE ____ = ____
ORDER BY ____ ____;`,
    },
    explanation: '`TOP (5)` caps the result, `WHERE Category = \'Books\'` restricts the category, and `ORDER BY Price DESC` makes "most expensive" well-defined — the sort must be present for TOP to be deterministic.',
    hints: ['TOP (5) for the cap', "WHERE Category = 'Books'", 'ORDER BY Price DESC'],
    tags: ['tsql', 'select', 'top', 'where', 'order-by'],
  },
  {
    id: 'tsql-select-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SELECT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/OFFSET/i, /FETCH/i],
    question: 'From `dbo.DimProduct` (ProductName), return the second page of 20 rows (rows 21–40) ordered by ProductName ascending, using OFFSET/FETCH.',
    starterCode: `-- SELECT ProductName ... OFFSET ... FETCH ...
`,
    testCases: [
      {
        input: 'ORDER BY ProductName OFFSET 20 ROWS FETCH NEXT 20 ROWS ONLY',
        expectedOutput: 'Rows 21-40 by ProductName',
        description: 'Pagination with OFFSET/FETCH',
      },
    ],
    solution: `SELECT ProductName
FROM dbo.DimProduct
ORDER BY ProductName
OFFSET 20 ROWS FETCH NEXT 20 ROWS ONLY;`,
    tieredHints: {
      apiSignature: 'OFFSET count ROWS FETCH NEXT count ROWS ONLY',
      skeleton: `SELECT ProductName
FROM dbo.DimProduct
ORDER BY ____
____ 20 ____ FETCH ____ 20 ROWS ____;`,
    },
    explanation: 'To get the second page of 20, skip the first 20 (`OFFSET 20 ROWS`) and take the next 20 (`FETCH NEXT 20 ROWS ONLY`). The `ORDER BY` is mandatory for OFFSET/FETCH and makes paging stable.',
    hints: ['Skip 20, fetch next 20', 'OFFSET/FETCH needs ORDER BY'],
    tags: ['tsql', 'select', 'offset-fetch', 'pagination'],
  },
];
