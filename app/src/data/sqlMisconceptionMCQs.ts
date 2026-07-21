import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
} from '../types';

// SQL MCQs whose distractors encode documented student misconceptions
// (NULL three-valued logic, GROUP BY rules, WHERE-vs-HAVING, JOIN cardinality,
// missing WHERE on UPDATE/DELETE, identifier-vs-string quoting). Tags must come
// from src/data/misconceptions.ts.
//
// Topics chosen from the Databricks Spark SQL track since that's where this
// repo's SQL exposure lives. The misconceptions themselves are dialect-agnostic.

export const sqlMisconceptionMCQs: Question[] = [
  {
    id: 'sql-misc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    question: 'A `users` table has a nullable `manager_id` column. Which query returns the rows where `manager_id` is NULL?',
    options: [
      { id: 'a', text: 'SELECT * FROM users WHERE manager_id IS NULL', isCorrect: true },
      { id: 'b', text: 'SELECT * FROM users WHERE manager_id = NULL', isCorrect: false, misconceptionTag: 'sql-null-equals' },
      { id: 'c', text: 'SELECT * FROM users WHERE manager_id == NULL', isCorrect: false, misconceptionTag: 'sql-null-equals' },
      { id: 'd', text: 'SELECT * FROM users WHERE manager_id = ""', isCorrect: false },
    ],
    explanation:
      'In SQL three-valued logic, `NULL = NULL` evaluates to NULL (treated as not-true), so `WHERE manager_id = NULL` matches zero rows even when many rows have NULL. The dedicated `IS NULL` / `IS NOT NULL` operators are the only way to test for NULL.',
    tags: ['null', 'three-valued-logic'],
    concepts: ['ps-null-handling'],
  },
  {
    id: 'sql-misc-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    question: 'A `payments` table has 100 rows. 30 of them have a NULL `coupon_code`. What does `SELECT COUNT(coupon_code) FROM payments` return?',
    options: [
      { id: 'a', text: '70 — COUNT(column_name) evaluates and counts only non-NULL row entries', isCorrect: true },
      { id: 'b', text: '100 — COUNT(column_name) counts every total row regardless of NULL values', isCorrect: false, misconceptionTag: 'sql-null-in-aggregate' },
      { id: 'c', text: '30 — COUNT(column_name) filters and counts only rows that contain NULL values', isCorrect: false },
      { id: 'd', text: 'NULL — COUNT(column_name) yields NULL whenever any column entry contains NULL', isCorrect: false, misconceptionTag: 'sql-null-in-aggregate' },
    ],
    explanation:
      '`COUNT(col)` counts only rows where `col` is non-NULL. `COUNT(*)` counts every row regardless. The two return different numbers whenever the column has NULLs — using one when you wanted the other is a common reporting bug.',
    tags: ['aggregation', 'null', 'count'],
    concepts: ['ps-groupby-agg', 'ps-null-handling', 'ps-actions-vs-transforms'],
  },
  {
    id: 'sql-misc-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    question: 'Which query returns each `department` together with its total head count, listing only departments with more than 10 people?',
    options: [
      { id: 'a', text: 'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 10', isCorrect: true },
      { id: 'b', text: 'SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 10 GROUP BY department', isCorrect: false, misconceptionTag: 'sql-where-vs-having' },
      { id: 'c', text: 'SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 10 GROUP BY department_id', isCorrect: false, misconceptionTag: 'sql-where-vs-having' },
      { id: 'd', text: 'SELECT department FROM employees WHERE department > 10 GROUP BY department_id, salary', isCorrect: false },
    ],
    explanation:
      'WHERE filters individual rows BEFORE grouping and cannot reference aggregate functions. HAVING filters AFTER grouping and is the only place an aggregate predicate (`COUNT(*) > 10`) can live. Many engines reject `WHERE COUNT(*) > 10` outright.',
    tags: ['group-by', 'having', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-where-having'],
  },
  {
    id: 'sql-misc-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    course: Course.DATABRICKS,
    question: 'In strict ANSI SQL, which of these queries is valid?',
    options: [
      { id: 'a', text: 'SELECT department, MAX(salary) FROM employees GROUP BY department', isCorrect: true },
      { id: 'b', text: 'SELECT department, name, MAX(salary) FROM employees GROUP BY department', isCorrect: false, misconceptionTag: 'sql-group-by-non-aggregated' },
      { id: 'c', text: 'SELECT department, name FROM employees GROUP BY department ORDER BY MAX(salary)', isCorrect: false, misconceptionTag: 'sql-group-by-non-aggregated' },
      { id: 'd', text: 'SELECT * FROM employees GROUP BY department HAVING MAX(salary) > 50000', isCorrect: false, misconceptionTag: 'sql-group-by-non-aggregated' },
    ],
    explanation:
      'Every column in the SELECT list that isn\'t inside an aggregate function must appear in GROUP BY. Selecting `name` alongside `MAX(salary)` doesn\'t make sense — there are many names per department. Older MySQL silently picked an arbitrary row; strict mode (and most other engines, including Spark SQL) reject the query.',
    tags: ['group-by', 'aggregation'],
    concepts: ['ps-groupby-agg'],
  },
  {
    id: 'sql-misc-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SQL_JOINS,
    course: Course.DATABRICKS,
    question: '`customers` has 1000 rows. 200 of them have no matching row in `orders`. How many rows does `SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id` produce?',
    options: [
      { id: 'a', text: 'At most 800 distinct customers (and possibly more total rows if a customer has multiple orders) — INNER JOIN drops the 200 unmatched customers.', isCorrect: true },
      { id: 'b', text: 'Exactly 1000 rows — INNER JOIN retains every left customer row and fills unmatched right order columns with NULL values.', isCorrect: false, misconceptionTag: 'sql-inner-vs-left-join' },
      { id: 'c', text: 'Exactly 200 rows — INNER JOIN filters exclusively for customer rows that do not possess any matching order records in the right table.', isCorrect: false },
      { id: 'd', text: '1000 plus total order count — INNER JOIN sums row counts from both tables together regardless of whether key conditions match.', isCorrect: false, misconceptionTag: 'sql-inner-vs-left-join' },
    ],
    explanation:
      'INNER JOIN returns only rows with a match in BOTH tables — the 200 customers without orders are dropped entirely. To keep them with NULLs in the order columns, use LEFT JOIN. (Customers with multiple orders contribute multiple rows, so the total may exceed 800.)',
    tags: ['join', 'inner-join', 'left-join'],
    concepts: ['sql-joins-inner-outer'],
  },
  {
    id: 'sql-misc-mcq-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    question: 'Your intent is to update the `account_status` of one specific user. You execute `UPDATE users SET account_status = \'inactive\'` without a WHERE clause. What happens?',
    options: [
      { id: 'a', text: 'Nothing happens — standard database engines automatically refuse to execute an UPDATE statement without a WHERE clause', isCorrect: false, misconceptionTag: 'sql-update-without-where' },
      { id: 'b', text: 'Every row in the `users` table is updated to `account_status = \'inactive\'` — omitting WHERE applies changes globally across all rows', isCorrect: true },
      { id: 'c', text: 'The first matching row in index order is updated while all subsequent records remain untouched', isCorrect: false, misconceptionTag: 'sql-update-without-where' },
      { id: 'd', text: 'A SyntaxError exception is raised — SQL syntax strictly mandates an explicit WHERE predicate on UPDATE operations', isCorrect: false },
    ],
    explanation:
      'An UPDATE (or DELETE) without a WHERE clause applies to every row in the table. Most engines run the statement happily — there is no built-in safeguard. A few clients (MySQL Workbench in safe-update mode) refuse, but you can\'t rely on that. Always run the matching SELECT first.',
    tags: ['update', 'where', 'safety'],
    concepts: ['delta-merge', 'ps-select-filter'],
  },
  {
    id: 'sql-misc-mcq-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    course: Course.DATABRICKS,
    question: 'A query `SELECT \'emp_name\' FROM employees` returns one row per employee. What is the output value of each row?',
    options: [
      { id: 'a', text: 'Each employee\'s actual name retrieved directly from the table column', isCorrect: false, misconceptionTag: 'sql-quotes-identifier-vs-string' },
      { id: 'b', text: 'NULL for every row because quotes convert identifiers into unmapped nulls', isCorrect: false, misconceptionTag: 'sql-quotes-identifier-vs-string' },
      { id: 'c', text: 'The literal string `emp_name` (eight characters) — single quotes delimit string literals', isCorrect: true },
      { id: 'd', text: 'A SyntaxError exception — single quotes are invalid syntax for column projections', isCorrect: false },
    ],
    explanation:
      'Single quotes delimit STRING LITERALS in SQL — `\'emp_name\'` is the eight-character text "emp_name", not a reference to the `emp_name` column. To quote a column identifier (e.g. when it collides with a keyword), use double quotes (ANSI/Spark) or backticks (MySQL/Spark). Mixing them up is a classic source of "why does every row say \'emp_name\'?" bugs.',
    tags: ['quoting', 'identifiers', 'literals'],
    concepts: ['sql-temp-views'],
  },
];
