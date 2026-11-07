import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

// Predict-the-output for SparkSQL - show a SQL query against a small sample
// table, the user types the row(s) the query returns. Forces mental execution
// of the query and exercises the cognitively expensive bits: NULL three-valued
// logic, JOIN cardinality, GROUP BY rules, aggregate behaviour with NULLs.
//
// Authoring rules:
// - Each question shows its input rows in `tables` (rendered as grids above
//   the code), so the query reads `FROM payments` rather than building its
//   data in a WITH/VALUES block.
// - One misconception per question (NULL =, NULL in COUNT, INNER vs LEFT,
//   WHERE vs HAVING, GROUP BY non-aggregated columns, etc.).
// - The prompt states the exact answer format (one number, or rows one per
//   line with values separated by a comma). The PredictOutputQuestion
//   validator collapses comma+space inside `[...]`, `(...)`, `{...}`.

export const sparkSqlPredictOutputQuestions: Question[] = [
  {
    id: 'sql-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NULL_HANDLING,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The users table holds the rows shown. What does this query return? The answer is one whole number.',
    tables: [
      { name: 'users', columns: ['id', 'username'], rows: [
        [1, 'Alice'],
        [2, null],
        [3, 'Bob'],
        [4, null],
      ] },
    ],
    code: 'SELECT COUNT(*) FROM users WHERE username = NULL;',
    expectedOutput: `0`,
    explanation:
      'In SQL three-valued logic, `NULL = NULL` evaluates to NULL (treated as not-true), so `WHERE username = NULL` matches zero rows even though two rows have NULL. Use `WHERE username IS NULL` - it would return 2 here.',
    hints: ['What does `username = NULL` evaluate to in three-valued logic?'],
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
    question: 'The payments table holds the rows shown. What does this query return? The answer is one row: two whole numbers separated by a comma.',
    tables: [
      { name: 'payments', columns: ['id', 'coupon'], rows: [
        [1, 'A1'],
        [2, null],
        [3, 'B2'],
        [4, null],
        [5, null],
      ] },
    ],
    code: 'SELECT COUNT(*), COUNT(coupon) FROM payments;',
    expectedOutput: `5, 2`,
    acceptableOutputs: [`5,2`, `5 | 2`, `5\t2`],
    explanation:
      '`COUNT(*)` counts every row regardless of NULLs - 5. `COUNT(coupon)` counts only rows where coupon is non-NULL - 2 (A1 and B2). The difference is exactly the NULL count.',
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
    question: 'The customers and orders tables hold the rows shown. How many rows does this query return? The answer is one whole number.',
    tables: [
      { name: 'customers', columns: ['id', 'username'], rows: [
        [1, 'Alice'],
        [2, 'Bob'],
        [3, 'Carol'],
      ] },
      { name: 'orders', columns: ['id', 'customer_id'], rows: [
        [10, 1],
        [11, 1],
        [12, 2],
      ] },
    ],
    code: 'SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;',
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
    question: 'The customers and orders tables hold the rows shown. How many rows does this query return? The answer is one whole number.',
    tables: [
      { name: 'customers', columns: ['id', 'username'], rows: [
        [1, 'Alice'],
        [2, 'Bob'],
        [3, 'Carol'],
      ] },
      { name: 'orders', columns: ['id', 'customer_id'], rows: [
        [10, 1],
        [11, 1],
        [12, 2],
      ] },
    ],
    code: 'SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;',
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
    question: 'The employees table holds the rows shown. What does this query return? The answer is its rows, one per line: the dept, a comma, then the count.',
    tables: [
      { name: 'employees', columns: ['dept', 'salary'], rows: [
        ['eng', 90],
        ['eng', 110],
        ['eng', 130],
        ['sales', 80],
        ['sales', 95],
        ['hr', 70],
      ] },
    ],
    code: 'SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 1 ORDER BY dept;',
    expectedOutput: `eng, 3
sales, 2`,
    acceptableOutputs: [`eng,3\nsales,2`, `eng | 3\nsales | 2`],
    explanation:
      'GROUP BY collapses by dept (3 groups). HAVING filters AFTER aggregation, so it can reference COUNT(*) - `> 1` drops the hr group (only 1 employee). ORDER BY then sorts the remaining rows alphabetically. WHERE COUNT(*) > 1 would error (WHERE runs before aggregation).',
    hints: ['HAVING applies after GROUP BY and can see aggregate values.'],
    tags: ['group-by', 'having', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-where-having'],
  },
  {
    id: 'sql-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NULL_HANDLING,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The nums table holds the rows shown. What does this query return? The answer is its rows, one value per line, in table order; write NULL for a null.',
    tables: [
      { name: 'nums', columns: ['x', 'y'], rows: [
        [10, 3],
        [5, null],
        [8, 2],
      ] },
    ],
    code: 'SELECT x + y FROM nums;',
    expectedOutput: `13
NULL
10`,
    explanation:
      'Any arithmetic with NULL yields NULL - so 5 + NULL is NULL, not 5. To treat NULL as 0 for the sum, wrap it: `x + COALESCE(y, 0)`. This is one of the most common reporting bugs - totals quietly become NULL when one input is missing.',
    hints: ['What does anything plus NULL produce?'],
    tags: ['null', 'arithmetic'],
    concepts: ['ps-null-handling'],
  },
  {
    id: 'sql-predict-7',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The products table holds the rows shown. What does this query return? The answer is its rows, one product name per line.',
    tables: [
      { name: 'products', columns: ['product_name'], rows: [
        ['apple'],
        ['apricot'],
        ['banana'],
        ['pineapple'],
      ] },
    ],
    code: `SELECT product_name FROM products WHERE product_name LIKE 'ap%' ORDER BY product_name;`,
    expectedOutput: `apple
apricot`,
    explanation:
      'LIKE \'ap%\' anchors at the START - only strings beginning with "ap" match. "pineapple" contains "ap" but doesn\'t start with it. To match "contains ap" use `LIKE \'%ap%\'`. The ORDER BY then sorts alphabetically.',
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
    question: 'The table t holds the rows shown. How many rows does this query return? The answer is one whole number.',
    tables: [
      { name: 't', columns: ['x'], rows: [
        [1],
        [2],
        [3],
      ] },
    ],
    code: 'SELECT MAX(x), MIN(x), AVG(x) FROM t;',
    expectedOutput: `1`,
    explanation:
      'An aggregate query without GROUP BY collapses the entire input to a SINGLE row containing the aggregate values (here: 3, 1, 2.0). The number of rows is always 1 in this case, regardless of input size - that confuses people who expect "one row per input row".',
    hints: ['Aggregates without GROUP BY collapse the whole input to how many rows?'],
    tags: ['aggregation', 'no-group-by'],
    concepts: ['ps-groupby-agg'],
  },
  {
    id: 'sql-predict-9',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The visits table holds the rows shown. How many rows does this query return? The answer is one whole number.',
    tables: [
      { name: 'visits', columns: ['user_id', 'visit_date'], rows: [
        ['A', '2024-01-01'],
        ['A', '2024-01-01'],
        ['A', '2024-01-02'],
        ['B', '2024-01-01'],
      ] },
    ],
    code: 'SELECT DISTINCT user_id, visit_date FROM visits;',
    expectedOutput: `3`,
    explanation:
      'DISTINCT applies to the FULL row of selected columns, not each column independently. Distinct (user_id, visit_date) pairs are: (A, Jan 1), (A, Jan 2), (B, Jan 1) - 3 rows. The duplicate (A, Jan 1) collapses to one. A common confusion is reading DISTINCT as "deduplicate each column separately."',
    hints: ['DISTINCT operates on the whole row of selected columns at once.'],
    tags: ['distinct', 'deduplication'],
    concepts: ['ps-distinct-drop-dup'],
  },
  {
    id: 'sql-predict-10',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The scores table holds the rows shown. How many rows does this query return? The answer is one whole number.',
    tables: [
      { name: 'scores', columns: ['s'], rows: [
        [90],
        [80],
        [70],
        [60],
        [50],
      ] },
    ],
    code: 'SELECT s FROM scores LIMIT 3;',
    expectedOutput: `3`,
    explanation:
      'LIMIT 3 caps the result at 3 rows. WITHOUT an ORDER BY, which 3 rows you get is engine-dependent - Spark typically returns them in the input order, but this is not guaranteed. The cardinality is deterministic (3); the specific values are not. In production, always pair LIMIT with ORDER BY.',
    hints: ['LIMIT N caps the result at N rows. Order is a separate question.'],
    tags: ['limit', 'order-by'],
    concepts: ['ps-orderby-sort'],
  },
  {
    id: 'sql-predict-11',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SUBQUERIES,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The members and loans tables hold the rows shown. What does this query return? The answer is one whole number.',
    tables: [
      { name: 'members', columns: ['id'], rows: [
        [1],
        [2],
        [3],
      ] },
      { name: 'loans', columns: ['loan_id', 'member_id'], rows: [
        [10, 1],
        [11, null],
      ] },
    ],
    code: `SELECT COUNT(*) FROM members
WHERE id NOT IN (SELECT member_id FROM loans);`,
    expectedOutput: `0`,
    explanation:
      'Members 2 and 3 have no loans, yet the count is 0. `id NOT IN (1, NULL)` means `id <> 1 AND id <> NULL`, and `id <> NULL` is NULL, so the condition is never true for any member. One NULL in the subquery empties a NOT IN. `NOT EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)` returns 2 here, as does adding `WHERE member_id IS NOT NULL` inside the subquery.',
    hints: ['Write NOT IN out as a chain of <> comparisons joined by AND.', 'What is 2 <> NULL?'],
    tags: ['subquery', 'not-in', 'null', 'predict'],
    concepts: ['sql-subqueries', 'ps-null-handling'],
  },
  {
    id: 'sql-predict-12',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'Tables a and b hold the rows shown. What does this query return? The answer is one row: two whole numbers separated by a comma.',
    tables: [
      { name: 'a', columns: ['id'], rows: [
        [1],
        [1],
        [2],
      ] },
      { name: 'b', columns: ['id'], rows: [
        [2],
        [3],
      ] },
    ],
    code: `SELECT
  (SELECT COUNT(*) FROM (SELECT id FROM a UNION ALL SELECT id FROM b)),
  (SELECT COUNT(*) FROM (SELECT id FROM a UNION SELECT id FROM b));`,
    expectedOutput: `5, 3`,
    explanation:
      'UNION ALL stacks every row of both inputs: 3 + 2 = 5. UNION removes duplicates from the whole combined result, including the two 1s that both come from `a`, which leaves the distinct ids 1, 2 and 3. UNION does not only drop rows that appear in both inputs.',
    hints: ['UNION ALL keeps every row.', 'Does UNION also remove a duplicate that sits inside one input?'],
    tags: ['union', 'union-all', 'set-operations', 'predict'],
    concepts: ['sql-set-operations'],
  },
  {
    id: 'sql-predict-13',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: 'The loans table holds the rows shown. What does this query return? The answer is its rows, one per line: the id, a comma, then the flag.',
    tables: [
      { name: 'loans', columns: ['id', 'days_out'], rows: [
        [1, 45],
        [2, 10],
        [3, 20],
      ] },
    ],
    code: `SELECT id,
  CASE WHEN days_out > 14 THEN 'late'
       WHEN days_out > 30 THEN 'very late'
       ELSE 'ok' END AS flag
FROM loans ORDER BY id;`,
    expectedOutput: `1, late
2, ok
3, late`,
    explanation:
      'CASE tries its WHEN branches top to bottom and returns the first one that is true. 45 is greater than 14, so loan 1 is "late" and the `> 30` branch is never reached: as written it can never fire. Put the narrower condition first (`> 30`, then `> 14`) to get "very late" for loan 1.',
    hints: ['CASE stops at the first true WHEN.', 'Is 45 > 14?'],
    tags: ['case-when', 'spark-sql', 'predict'],
    concepts: ['sql-case-expr'],
  },
];
