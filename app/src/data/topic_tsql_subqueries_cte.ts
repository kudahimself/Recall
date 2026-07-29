/**
 * Topic.TSQL_SUBQUERIES_CTE — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): scalar/IN/EXISTS subqueries, correlated
 * subqueries, WITH CTEs, recursive CTEs.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_subqueries_cte_questions: Question[] = [
  {
    id: 'tsql-subq-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    question: 'What is the difference between filtering with `IN (SELECT …)` and `EXISTS (SELECT 1 …)`?',
    options: [
      { id: 'a', text: '`IN` filters rows against the subquery\'s returned value set; `EXISTS` tests whether any matching row exists and short-circuits on the first one.', isCorrect: true },
      { id: 'b', text: '`IN` can only compare numbers; `EXISTS` can only be used on text columns.', isCorrect: false },
      { id: 'c', text: '`IN` always runs faster because it caches the subquery; `EXISTS` re-reads the whole table per row.', isCorrect: false },
      { id: 'd', text: 'They are syntax errors unless wrapped in a CTE first; neither can appear directly in WHERE.', isCorrect: false },
    ],
    explanation: '`IN` compares each row against the set of values the subquery produces. `EXISTS` is a boolean test — it stops as soon as one matching row is found, which is often more efficient for "is there any match" checks and avoids the NULL pitfalls of `NOT IN`.',
    hints: ['IN = value-set membership', 'EXISTS = does any matching row exist (short-circuits)'],
    tags: ['tsql', 'subqueries', 'in', 'exists'],
  },
  {
    id: 'tsql-subq-cte-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords that define a common table expression (CTE).',
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
___ HighValue ___ (
    SELECT CustomerKey, SUM(Amount) AS Total
    FROM dbo.FactOrders
    GROUP BY CustomerKey
)
SELECT * FROM HighValue WHERE Total > 1000;`,
    blanks: ['WITH', 'AS'],
    solution: `WITH HighValue AS (
    SELECT CustomerKey, SUM(Amount) AS Total
    FROM dbo.FactOrders
    GROUP BY CustomerKey
)
SELECT * FROM HighValue WHERE Total > 1000;`,
    explanation: '`WITH <name> AS ( … )` defines a named, inline result set you can query like a table in the statement that follows. CTEs make multi-step logic readable without creating real objects.',
    hints: ['Opens with WITH <name>', 'The keyword before the parenthesised query'],
    tags: ['tsql', 'subqueries', 'cte', 'cloze'],
  },
  {
    id: 'tsql-subq-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `WITH t(n) AS (VALUES (1), (2), (3), (4))
SELECT n FROM t
WHERE n IN (SELECT v.x FROM (VALUES (2), (4), (9)) AS v(x))
ORDER BY n;`,
    expectedOutput: `2
4`,
    explanation: 'The subquery returns the set {2, 4, 9}; `WHERE n IN (…)` keeps rows of `t` whose `n` is in that set. Only 2 and 4 are present in `t` (9 is not), so they are returned.',
    hints: ['Keep rows whose n is in the subquery set'],
    tags: ['tsql', 'subqueries', 'in', 'cte', 'predict'],
  },
  {
    id: 'tsql-subq-exists-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator for a correlated existence test: customers having at least one order.',
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT c.FullName
FROM dbo.DimCustomer c
WHERE ___ (
    SELECT 1 FROM dbo.FactOrders o
    WHERE o.CustomerKey = c.CustomerKey
);`,
    blanks: ['EXISTS'],
    solution: `SELECT c.FullName
FROM dbo.DimCustomer c
WHERE EXISTS (
    SELECT 1 FROM dbo.FactOrders o
    WHERE o.CustomerKey = c.CustomerKey
);`,
    explanation: 'The subquery is *correlated* — it references the outer `c.CustomerKey`, so it runs per candidate customer. `EXISTS` returns true as soon as one matching order is found, giving "customers who have ordered".',
    hints: ['Boolean existence test operator', 'subquery references the outer row → correlated'],
    tags: ['tsql', 'subqueries', 'exists', 'correlated', 'cloze'],
  },
  {
    id: 'tsql-subq-recursive-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    question: 'How does a recursive CTE work?',
    options: [
      { id: 'a', text: "It has an anchor query (the starting rows) UNION ALL'd with a recursive query that references the CTE's own name; SQL Server repeats the recursive part until it returns no more rows.", isCorrect: true },
      { id: 'b', text: 'It re-runs the entire CTE body twice in a row, with no other change in behavior.', isCorrect: false },
      { id: 'c', text: 'It calls a stored procedure once per row of the base table, recursively.', isCorrect: false },
      { id: 'd', text: 'It is just a naming convention - "recursive" has no effect on how the query executes.', isCorrect: false },
    ],
    explanation: "A recursive CTE unions an anchor member (the base case) with a recursive member that joins back to the CTE's own name. SQL Server re-executes the recursive member against only the rows produced in the previous step, accumulating results until a step produces zero rows - the classic pattern for walking a hierarchy (e.g. an employee/manager chain).",
    hints: ['Anchor UNION ALL recursive member', 'Recursive member references the CTE by name'],
    tags: ['tsql', 'subqueries', 'cte', 'recursive-cte'],
  },
  {
    id: 'tsql-subq-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/WITH/i, /SUM/i],
    question: 'Using a CTE named `CustomerTotals` that sums `Amount` per `CustomerKey` from `dbo.FactOrders`, return the CustomerKey and Total for customers whose total is at least 500.',
    starterCode: `-- WITH CustomerTotals AS ( ... ) SELECT ... WHERE Total >= 500;
`,
    testCases: [
      {
        input: 'WITH CustomerTotals AS (SUM per CustomerKey) SELECT WHERE Total >= 500',
        expectedOutput: 'Customers with total spend >= 500',
        description: 'CTE then filter',
      },
    ],
    solution: `WITH CustomerTotals AS (
    SELECT CustomerKey, SUM(Amount) AS Total
    FROM dbo.FactOrders
    GROUP BY CustomerKey
)
SELECT CustomerKey, Total
FROM CustomerTotals
WHERE Total >= 500;`,
    explanation: 'The CTE computes per-customer totals once; the outer query then filters them with a simple `WHERE Total >= 500`. This is cleaner than repeating the aggregate, and you can reference `Total` directly because the CTE already named it.',
    hints: ['Define the rollup in WITH … AS ( … )', 'Filter the CTE in the outer query'],
    tieredHints: {
      apiSignature: 'WITH cte_name AS ( SELECT col, agg_func(col) FROM table GROUP BY col )',
      skeleton: `WITH ____ AS (
    SELECT ____, ____(Amount) AS Total
    FROM dbo.FactOrders
    GROUP BY ____
)
SELECT CustomerKey, Total
FROM ____
WHERE Total ____ ____;`,
    },
    tags: ['tsql', 'subqueries', 'cte', 'aggregation'],
  },
  {
    id: 'tsql-subq-recursive-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the operator joining anchor and recursive members, and the join that walks each employee back to their manager.',
    template: `-- dbo.Employee(EmployeeId, ManagerId, FullName)
WITH EmpChain AS (
    SELECT EmployeeId, ManagerId, 0 AS Lvl
    FROM dbo.Employee
    WHERE ManagerId IS NULL
    ___ ___
    SELECT e.EmployeeId, e.ManagerId, c.Lvl + 1
    FROM dbo.Employee e
    ___ EmpChain c ON e.ManagerId = c.EmployeeId
)
SELECT * FROM EmpChain;`,
    blanks: ['UNION', 'ALL', 'JOIN'],
    solution: `WITH EmpChain AS (
    SELECT EmployeeId, ManagerId, 0 AS Lvl
    FROM dbo.Employee
    WHERE ManagerId IS NULL
    UNION ALL
    SELECT e.EmployeeId, e.ManagerId, c.Lvl + 1
    FROM dbo.Employee e
    JOIN EmpChain c ON e.ManagerId = c.EmployeeId
)
SELECT * FROM EmpChain;`,
    explanation: 'The anchor member picks top-level employees (no manager); `UNION ALL` combines it with the recursive member, which joins the base table back to the CTE\'s own name (`EmpChain c`) to pull in the next level down. SQL Server repeats the recursive member against the newest rows until a pass produces none.',
    hints: ['Combine anchor and recursive members with UNION ALL', 'Recursive member joins the base table to the CTE by name'],
    tags: ['tsql', 'subqueries', 'cte', 'recursive-cte', 'cloze'],
  },
  {
    id: 'tsql-subq-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SUBQUERIES_CTE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/SELECT/i, /COUNT/i],
    question: 'From `dbo.DimCustomer c` (FullName, CustomerKey), return each FullName and their number of orders — using a correlated scalar subquery against `dbo.FactOrders` (matched on CustomerKey) aliased `OrderCount`.',
    starterCode: `-- Return FullName and OrderCount for each customer using a correlated scalar subquery
`,
    testCases: [
      {
        input: 'Correlated scalar subquery counting orders per customer',
        expectedOutput: 'FullName + OrderCount for every customer',
        description: 'Correlated scalar subquery',
      },
    ],
    solution: `SELECT c.FullName,
       (SELECT COUNT(*)
        FROM dbo.FactOrders o
        WHERE o.CustomerKey = c.CustomerKey) AS OrderCount
FROM dbo.DimCustomer c;`,
    explanation: 'A scalar subquery in the SELECT list returns one value per outer row. Because it references `c.CustomerKey`, it is correlated — evaluated per customer — yielding that customer\'s order count (0 for customers with none, unlike an INNER JOIN which would drop them).',
    hints: ['Put (SELECT COUNT(*) … WHERE o.CustomerKey = c.CustomerKey) in the SELECT list', 'It returns 0 for customers with no orders'],
    tieredHints: {
      apiSignature: '(SELECT agg_func(*) FROM table alias WHERE outer_alias.col = inner_alias.col) AS alias',
      skeleton: `SELECT c.____,
       (SELECT ____(*)
        FROM ____ ____
        WHERE ____.CustomerKey ____ c.CustomerKey) AS ____
FROM dbo.DimCustomer c;`,
    },
    tags: ['tsql', 'subqueries', 'correlated', 'scalar-subquery'],
  },
];
