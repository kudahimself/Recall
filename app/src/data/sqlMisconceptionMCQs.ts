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
    topic: Topic.NULL_HANDLING,
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
      { id: 'a', text: '70 - COUNT(column_name) evaluates and counts only non-NULL row entries', isCorrect: true },
      { id: 'b', text: '100 - COUNT(column_name) counts every total row regardless of NULL values', isCorrect: false, misconceptionTag: 'sql-null-in-aggregate' },
      { id: 'c', text: '30 - COUNT(column_name) filters and counts only rows that contain NULL values', isCorrect: false },
      { id: 'd', text: 'NULL - COUNT(column_name) yields NULL whenever any column entry contains NULL', isCorrect: false, misconceptionTag: 'sql-null-in-aggregate' },
    ],
    explanation:
      '`COUNT(col)` counts only rows where `col` is non-NULL. `COUNT(*)` counts every row regardless. The two return different numbers whenever the column has NULLs - using one when you wanted the other is a common reporting bug.',
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
      { id: 'b', text: 'SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 10 GROUP BY department', isCorrect: false },
      { id: 'c', text: 'SELECT department, COUNT(*) FROM employees GROUP BY department WHERE COUNT(*) > 10', isCorrect: false },
      { id: 'd', text: 'SELECT department, COUNT(*) FROM employees WHERE department > 10 GROUP BY department', isCorrect: false },
    ],
    explanation: 'HAVING filters groups after GROUP BY, so it is where an aggregate condition such as COUNT(*) > 10 goes. WHERE filters single rows before any group exists and cannot use an aggregate, whether it is written before GROUP BY or after it (the latter is also a syntax error), and WHERE department > 10 compares the department name with a number instead of counting people.',
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
      { id: 'b', text: 'SELECT department, emp_name, MAX(salary) FROM employees GROUP BY department', isCorrect: false },
      { id: 'c', text: 'SELECT department, emp_name FROM employees GROUP BY department ORDER BY MAX(salary)', isCorrect: false },
      { id: 'd', text: 'SELECT * FROM employees GROUP BY department HAVING MAX(salary) > 50000', isCorrect: false },
    ],
    explanation: 'Every selected column that is not inside an aggregate must appear in GROUP BY. A department has many emp_name values, so selecting emp_name next to MAX(salary) has no single answer per group, and SELECT * has the same problem. Older MySQL silently picked an arbitrary row; strict ANSI SQL and Spark SQL reject the query.',
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
      { id: 'a', text: 'At least 800 rows: the 200 customers with no order drop out, and a customer with several orders appears once per order.', isCorrect: true },
      { id: 'b', text: 'Exactly 1000 rows: INNER JOIN keeps every customer and fills the order columns with NULL where nothing matches.', isCorrect: false },
      { id: 'c', text: 'Exactly 800 rows: INNER JOIN keeps each matched customer once, however many orders that customer has placed.', isCorrect: false },
      { id: 'd', text: 'Exactly 200 rows: INNER JOIN keeps only the customers whose id has no matching row in the orders table.', isCorrect: false },
    ],
    explanation: 'INNER JOIN returns one row for every matching (customer, order) pair. The 200 customers without orders have no pair and disappear, so at most 800 customers remain, and each contributes one row per order, which can push the total above 800. To keep the unmatched customers with NULL order columns, use LEFT JOIN.',
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
      { id: 'a', text: 'Nothing happens - standard database engines automatically refuse to execute an UPDATE statement without a WHERE clause', isCorrect: false, misconceptionTag: 'sql-update-without-where' },
      { id: 'b', text: 'Every row in the `users` table is updated to `account_status = \'inactive\'` - omitting WHERE applies changes globally across all rows', isCorrect: true },
      { id: 'c', text: 'The first matching row in index order is updated while all subsequent records remain untouched', isCorrect: false, misconceptionTag: 'sql-update-without-where' },
      { id: 'd', text: 'A SyntaxError exception is raised - SQL syntax strictly mandates an explicit WHERE predicate on UPDATE operations', isCorrect: false },
    ],
    explanation:
      'An UPDATE (or DELETE) without a WHERE clause applies to every row in the table. Most engines run the statement happily - there is no built-in safeguard. A few clients (MySQL Workbench in safe-update mode) refuse, but you can\'t rely on that. Always run the matching SELECT first.',
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
      { id: 'c', text: 'The literal string `emp_name` (eight characters) - single quotes delimit string literals', isCorrect: true },
      { id: 'd', text: 'A SyntaxError exception - single quotes are invalid syntax for column projections', isCorrect: false },
    ],
    explanation: `Single quotes delimit string literals, so 'emp_name' is the eight-character text "emp_name", not a reference to the emp_name column, and every row returns that same text. To quote a column name in Spark SQL (when it collides with a keyword or holds a space) use backticks: \`emp_name\`. Double quotes are no help here, since Spark SQL also reads "emp_name" as a string literal.`,
    tags: ['quoting', 'identifiers', 'literals'],
    concepts: ['sql-temp-views'],
  },
];
