import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

// Predict-the-output for SparkSQL — show a SQL query against a small literal
// table, the user types the row(s) the query returns. Forces mental execution
// of the query and exercises the cognitively expensive bits: NULL three-valued
// logic, JOIN cardinality, GROUP BY rules, aggregate behaviour with NULLs.
//
// Authoring rules:
// - Each question defines its inputs INLINE (CTE with VALUES) so there's no
//   external schema dependency.
// - One misconception per question (NULL =, NULL in COUNT, INNER vs LEFT,
//   WHERE vs HAVING, GROUP BY non-aggregated columns, etc.).
// - Expected output is the result table rendered as a small text grid. The
//   PredictOutputQuestion validator collapses comma+space inside `[...]`,
//   `(...)`, `{...}` — but that's not relevant for tabular output.

export const sparkSqlPredictOutputQuestions: Question[] = [
  {
    id: 'sql-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH users AS (
  SELECT 1 AS id, 'Alice' AS name UNION ALL
  SELECT 2, NULL UNION ALL
  SELECT 3, 'Bob' UNION ALL
  SELECT 4, NULL
)
SELECT COUNT(*) FROM users WHERE name = NULL;`,
    expectedOutput: `0`,
    explanation:
      'In SQL three-valued logic, `NULL = NULL` evaluates to NULL (treated as not-true), so `WHERE name = NULL` matches zero rows even though two rows have NULL. Use `WHERE name IS NULL` — it would return 2 here.',
    hints: ['What does `name = NULL` evaluate to in three-valued logic?'],
    tags: ['null', 'where', 'three-valued-logic'],
    concepts: ['ps-null-handling', 'ps-select-filter'],
  },
  {
    id: 'sql-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'What does this query return?',
    code: `WITH payments AS (
  SELECT 1 AS id, 'A1' AS coupon UNION ALL
  SELECT 2, NULL UNION ALL
  SELECT 3, 'B2' UNION ALL
  SELECT 4, NULL UNION ALL
  SELECT 5, NULL
)
SELECT COUNT(*), COUNT(coupon) FROM payments;`,
    expectedOutput: `5, 2`,
    acceptableOutputs: [`5,2`, `5 | 2`, `5\t2`],
    explanation:
      '`COUNT(*)` counts every row regardless of NULLs — 5. `COUNT(coupon)` counts only rows where coupon is non-NULL — 2 (A1 and B2). The difference is exactly the NULL count.',
    hints: ['One COUNT skips NULLs; the other doesn\'t.'],
    tags: ['count', 'null', 'aggregation'],
    concepts: ['ps-actions-vs-transforms', 'ps-null-handling', 'ps-groupby-agg'],
  },
  {
    id: 'sql-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SQL_JOINS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH customers AS (
  SELECT 1 AS id, 'Alice' AS name UNION ALL
  SELECT 2, 'Bob' UNION ALL
  SELECT 3, 'Carol'
), orders AS (
  SELECT 10 AS id, 1 AS customer_id UNION ALL
  SELECT 11, 1 UNION ALL
  SELECT 12, 2
)
SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;`,
    expectedOutput: `3`,
    explanation:
      'INNER JOIN keeps only rows with a match in BOTH tables. Carol (id 3) has no orders and is dropped. Alice has 2 orders → 2 rows; Bob has 1 → 1 row. Total: 3. A LEFT JOIN would return 4 rows (Carol included, with NULL order columns).',
    hints: ['INNER JOIN drops unmatched left-side rows. Then count the matches.'],
    tags: ['join', 'inner-join', 'cardinality'],
    concepts: ['sql-joins-inner-outer', 'dim-grain'],
  },
  {
    id: 'sql-predict-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SQL_JOINS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH customers AS (
  SELECT 1 AS id, 'Alice' AS name UNION ALL
  SELECT 2, 'Bob' UNION ALL
  SELECT 3, 'Carol'
), orders AS (
  SELECT 10 AS id, 1 AS customer_id UNION ALL
  SELECT 11, 1 UNION ALL
  SELECT 12, 2
)
SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;`,
    expectedOutput: `4`,
    explanation:
      'LEFT JOIN keeps every row from the left side (customers), filling unmatched right-side columns with NULL. Alice has 2 orders → 2 rows; Bob has 1 → 1 row; Carol has 0 → 1 row with NULL order columns. Total: 4. (Compare with the INNER JOIN version, which drops Carol.)',
    hints: ['LEFT JOIN keeps unmatched left rows with NULL on the right.'],
    tags: ['join', 'left-join', 'cardinality'],
    concepts: ['sql-joins-inner-outer', 'dim-grain'],
  },
  {
    id: 'sql-predict-5',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'What does this query return? (One row per department, listed alphabetically.)',
    code: `WITH employees AS (
  SELECT 'eng' AS dept, 90 AS salary UNION ALL
  SELECT 'eng', 110 UNION ALL
  SELECT 'eng', 130 UNION ALL
  SELECT 'sales', 80 UNION ALL
  SELECT 'sales', 95 UNION ALL
  SELECT 'hr', 70
)
SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 1 ORDER BY dept;`,
    expectedOutput: `eng, 3
sales, 2`,
    acceptableOutputs: [`eng,3\nsales,2`, `eng | 3\nsales | 2`],
    explanation:
      'GROUP BY collapses by dept (3 groups). HAVING filters AFTER aggregation, so it can reference COUNT(*) — `> 1` drops the hr group (only 1 employee). ORDER BY then sorts the remaining rows alphabetically. WHERE COUNT(*) > 1 would error (WHERE runs before aggregation).',
    hints: ['HAVING applies after GROUP BY and can see aggregate values.'],
    tags: ['group-by', 'having', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-where-having'],
  },
  {
    id: 'sql-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'What does this query return?',
    code: `WITH nums AS (
  SELECT 10 AS x, 3 AS y UNION ALL
  SELECT 5, NULL UNION ALL
  SELECT 8, 2
)
SELECT x + y FROM nums;`,
    expectedOutput: `13
NULL
10`,
    explanation:
      'Any arithmetic with NULL yields NULL — so 5 + NULL is NULL, not 5. To treat NULL as 0 for the sum, wrap it: `x + COALESCE(y, 0)`. This is one of the most common reporting bugs — totals quietly become NULL when one input is missing.',
    hints: ['What does anything plus NULL produce?'],
    tags: ['null', 'arithmetic'],
    concepts: ['ps-null-handling'],
  },
  {
    id: 'sql-predict-7',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'What does this query return?',
    code: `WITH products AS (
  SELECT 'apple' AS name UNION ALL
  SELECT 'apricot' UNION ALL
  SELECT 'banana' UNION ALL
  SELECT 'pineapple'
)
SELECT name FROM products WHERE name LIKE 'ap%' ORDER BY name;`,
    expectedOutput: `apple
apricot`,
    explanation:
      'LIKE \'ap%\' anchors at the START — only strings beginning with "ap" match. "pineapple" contains "ap" but doesn\'t start with it. To match "contains ap" use `LIKE \'%ap%\'`. The ORDER BY then sorts alphabetically.',
    hints: ['Where in the string does `ap%` anchor?'],
    tags: ['like', 'pattern-matching'],
    concepts: ['ps-regex-fns'],
  },
  {
    id: 'sql-predict-8',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH t AS (
  SELECT 1 AS x UNION ALL
  SELECT 2 UNION ALL
  SELECT 3
)
SELECT MAX(x), MIN(x), AVG(x) FROM t;`,
    expectedOutput: `1`,
    explanation:
      'An aggregate query without GROUP BY collapses the entire input to a SINGLE row containing the aggregate values (here: 3, 1, 2.0). The number of rows is always 1 in this case, regardless of input size — that confuses people who expect "one row per input row".',
    hints: ['Aggregates without GROUP BY collapse the whole input to how many rows?'],
    tags: ['aggregation', 'no-group-by'],
    concepts: ['ps-groupby-agg'],
  },
  {
    id: 'sql-predict-9',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH visits AS (
  SELECT 'A' AS user, '2024-01-01' AS day UNION ALL
  SELECT 'A', '2024-01-01' UNION ALL
  SELECT 'A', '2024-01-02' UNION ALL
  SELECT 'B', '2024-01-01'
)
SELECT DISTINCT user, day FROM visits;`,
    expectedOutput: `3`,
    explanation:
      'DISTINCT applies to the FULL row of selected columns, not each column independently. Distinct (user, day) pairs are: (A, Jan 1), (A, Jan 2), (B, Jan 1) — 3 rows. The duplicate (A, Jan 1) collapses to one. A common confusion is reading DISTINCT as "deduplicate each column separately."',
    hints: ['DISTINCT operates on the whole row of selected columns at once.'],
    tags: ['distinct', 'deduplication'],
    concepts: ['ps-distinct-drop-dup'],
  },
  {
    id: 'sql-predict-10',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'How many rows does this query return?',
    code: `WITH scores AS (
  SELECT 90 AS s UNION ALL
  SELECT 80 UNION ALL
  SELECT 70 UNION ALL
  SELECT 60 UNION ALL
  SELECT 50
)
SELECT s FROM scores LIMIT 3;`,
    expectedOutput: `3`,
    explanation:
      'LIMIT 3 caps the result at 3 rows. WITHOUT an ORDER BY, which 3 rows you get is engine-dependent — Spark typically returns them in the input order, but this is not guaranteed. The cardinality is deterministic (3); the specific values are not. In production, always pair LIMIT with ORDER BY.',
    hints: ['LIMIT N caps the result at N rows. Order is a separate question.'],
    tags: ['limit', 'order-by'],
    concepts: ['ps-orderby-sort'],
  },
];
