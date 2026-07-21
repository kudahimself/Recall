/**
 * Topic.TSQL_FILTERING — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): comparison/BETWEEN/IN/LIKE, IS NULL,
 * AND/OR/NOT, CASE, IIF, ISNULL/COALESCE/NULLIF.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_filtering_questions: Question[] = [
  {
    id: 'tsql-filter-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    question: 'How do you correctly find rows where `Email` has no value?',
    options: [
      { id: 'a', text: '`WHERE Email = NULL` — the equals operator treats NULL like any other literal value.', isCorrect: false },
      { id: 'b', text: '`WHERE Email = \'\'` — an empty string and NULL are the same thing in SQL.', isCorrect: false },
      { id: 'c', text: '`WHERE Email IS NULL` — a comparison like `= NULL` is never true, because NULL means "unknown".', isCorrect: true },
      { id: 'd', text: '`WHERE Email <> NULL` — the not-equals operator returns the NULL rows.', isCorrect: false },
    ],
    explanation: 'In three-valued logic any comparison against NULL yields UNKNOWN, which `WHERE` treats as not-true — so `= NULL` and `<> NULL` both match zero rows. You must use the `IS NULL` / `IS NOT NULL` predicates. An empty string is also distinct from NULL.',
    hints: ['NULL = anything → UNKNOWN, never true', 'Use IS NULL / IS NOT NULL'],
    tags: ['tsql', 'filtering', 'is-null', 'three-valued-logic'],
  },
  {
    id: 'tsql-filter-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT v.n
FROM (VALUES (5), (12), (20), (25)) AS v(n)
WHERE v.n BETWEEN 10 AND 22
ORDER BY v.n;`,
    expectedOutput: `12
20`,
    explanation: '`BETWEEN 10 AND 22` is inclusive of both bounds, so it matches 12 and 20 but not 5 (too low) or 25 (too high).',
    hints: ['BETWEEN includes both endpoints'],
    tags: ['tsql', 'filtering', 'between', 'predict'],
  },
  {
    id: 'tsql-filter-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the predicates: an inclusive range, a set membership test, and a prefix match.',
    template: `SELECT ProductName
FROM dbo.DimProduct
WHERE Price ___ 10 AND 100
  AND Category ___ ('Books', 'Toys')
  AND ProductName ___ 'A%';`,
    blanks: ['BETWEEN', 'IN', 'LIKE'],
    solution: `SELECT ProductName
FROM dbo.DimProduct
WHERE Price BETWEEN 10 AND 100
  AND Category IN ('Books', 'Toys')
  AND ProductName LIKE 'A%';`,
    explanation: '`BETWEEN x AND y` is an inclusive range; `IN (…)` tests membership in a list; `LIKE \'A%\'` matches text starting with A (`%` = any run of characters). These three cover most everyday filtering.',
    hints: ['inclusive range / set membership / pattern match', '% is the LIKE wildcard'],
    tags: ['tsql', 'filtering', 'between', 'in', 'like', 'cloze'],
  },
  {
    id: 'tsql-filter-iif-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    question: "What does `IIF(Price > 100, 'Premium', 'Standard')` return?",
    options: [
      { id: 'a', text: "Both 'Premium' and 'Standard' concatenated together, separated by a comma.", isCorrect: false },
      { id: 'b', text: "'Premium' when Price > 100 is true, otherwise 'Standard' — the false branch.", isCorrect: true },
      { id: 'c', text: "'Premium' always, regardless of how the Price comparison evaluates.", isCorrect: false },
      { id: 'd', text: "NULL, because IIF requires exactly one argument in T-SQL syntax.", isCorrect: false },
    ],
    explanation: "`IIF(condition, true_value, false_value)` is T-SQL's inline shorthand for a simple two-branch `CASE WHEN condition THEN true_value ELSE false_value END`. It only handles one condition - anything with more branches needs a full CASE.",
    hints: ['IIF(cond, if_true, if_false)', 'Shorthand for a two-branch CASE'],
    tags: ['tsql', 'filtering', 'iif'],
  },
  {
    id: 'tsql-filter-coalesce-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    question: 'How do `COALESCE`, `ISNULL`, and `NULLIF` differ?',
    options: [
      { id: 'a', text: '`COALESCE` and `ISNULL` both take exactly two args and behave identically; `NULLIF` converts NULL into a zero-length string.', isCorrect: false },
      { id: 'b', text: '`COALESCE` returns the last non-NULL value; `ISNULL` raises an error on any NULL; `NULLIF` returns 1 when a equals b.', isCorrect: false },
      { id: 'c', text: '`COALESCE` only works on numbers; `ISNULL` only works on text; `NULLIF` swaps two values when both are NULL.', isCorrect: false },
      { id: 'd', text: '`COALESCE(a, b, …)` returns the first non-NULL argument (ANSI); `ISNULL(a, b)` is the 2-arg T-SQL form; `NULLIF(a, b)` returns NULL when a equals b.', isCorrect: true },
    ],
    explanation: '`COALESCE` is the ANSI, variadic choice — first non-NULL wins. `ISNULL` is the T-SQL two-argument shorthand (and returns the first argument\'s data type). `NULLIF(a, b)` returns NULL when the two are equal — handy for turning a sentinel like 0 into NULL before dividing.',
    hints: ['COALESCE = variadic first-non-null', 'NULLIF(a,b) → NULL when a = b'],
    tags: ['tsql', 'filtering', 'coalesce', 'isnull', 'nullif'],
  },
  {
    id: 'tsql-filter-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT COALESCE(NULL, NULL, 'fallback', 'other') AS Result;`,
    expectedOutput: `fallback`,
    explanation: '`COALESCE` returns the first argument that is not NULL, scanning left to right. The first two are NULL, so `\'fallback\'` (the third) is returned and `\'other\'` is never considered.',
    hints: ['First non-NULL, left to right'],
    tags: ['tsql', 'filtering', 'coalesce', 'predict'],
  },
  {
    id: 'tsql-filter-case-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords that open a searched conditional, give its default, and close it.',
    template: `SELECT ProductName,
       ___ WHEN Price >= 100 THEN 'Premium'
            WHEN Price >= 20  THEN 'Standard'
            ___ 'Budget'
       ___ AS PriceBand
FROM dbo.DimProduct;`,
    blanks: ['CASE', 'ELSE', 'END'],
    solution: `SELECT ProductName,
       CASE WHEN Price >= 100 THEN 'Premium'
            WHEN Price >= 20  THEN 'Standard'
            ELSE 'Budget'
       END AS PriceBand
FROM dbo.DimProduct;`,
    explanation: 'A searched `CASE` evaluates each `WHEN` top-down and returns the first matching `THEN`; `ELSE` supplies the fallback and `END` closes the expression. Without `ELSE`, unmatched rows get NULL.',
    hints: ['Opens with CASE, default is ELSE, closes with END'],
    tags: ['tsql', 'filtering', 'case', 'cloze'],
  },
  {
    id: 'tsql-filter-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FILTERING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "From `dbo.DimCustomer` (FullName, Email, Country), return FullName and a column `ContactEmail` that shows Email, or the text 'none' when Email is NULL — for customers in country 'NO' or 'SE' whose FullName is not NULL.",
    starterCode: `-- dbo.DimCustomer(FullName, Email, Country); return FullName, ContactEmail
`,
    testCases: [
      {
        input: "COALESCE(Email,'none'), WHERE Country IN ('NO','SE') AND FullName IS NOT NULL",
        expectedOutput: 'FullName + ContactEmail for NO/SE customers with a name',
        description: 'COALESCE + IN + IS NOT NULL',
      },
    ],
    solution: `SELECT FullName, COALESCE(Email, 'none') AS ContactEmail
FROM dbo.DimCustomer
WHERE Country IN ('NO', 'SE')
  AND FullName IS NOT NULL;`,
    tieredHints: {
      apiSignature: 'COALESCE(expression, ...) -> first non-null expression',
      skeleton: `SELECT FullName, ____(____, ____) AS ____
FROM dbo.DimCustomer
WHERE Country ____ (____, ____)
  AND FullName ____ ____ ____;`,
    },
    explanation: '`COALESCE(Email, \'none\')` substitutes a default for missing emails; `Country IN (\'NO\', \'SE\')` filters the set; `FullName IS NOT NULL` excludes nameless rows (a plain `<>` would not catch NULLs).',
    hints: ["COALESCE(Email, 'none') for the default", "IN ('NO','SE') and IS NOT NULL"],
    tags: ['tsql', 'filtering', 'coalesce', 'in', 'is-null'],
  },
];
