/**
 * Topic.TSQL_JOINS — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): INNER/LEFT/RIGHT/FULL/CROSS/self joins,
 * multi-table joins, NULL behaviour in outer joins.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_joins_questions: Question[] = [
  {
    id: 'tsql-joins-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    question: 'How does an INNER JOIN differ from a LEFT JOIN?',
    options: [
      { id: 'a', text: 'INNER JOIN keeps only rows with a match in both tables; LEFT JOIN keeps every left-table row, filling unmatched right-side columns with NULL.', isCorrect: true },
      { id: 'b', text: 'INNER JOIN keeps every left-table row; LEFT JOIN keeps only rows that match in both tables.', isCorrect: false },
      { id: 'c', text: 'They return identical rows; LEFT JOIN just orders the output by the left table first.', isCorrect: false },
      { id: 'd', text: 'INNER JOIN merges the two tables into one stored table; LEFT JOIN only previews the match without persisting it.', isCorrect: false },
    ],
    explanation: 'INNER JOIN returns the intersection — rows matched on the join predicate. LEFT (OUTER) JOIN returns all left rows plus matches, and where no match exists the right-hand columns come back NULL. That NULL behaviour is the basis of "find the unmatched rows" queries.',
    hints: ['INNER = intersection', 'LEFT = all left rows, NULLs where no match'],
    tags: ['tsql', 'joins', 'inner-join', 'left-join'],
  },
  {
    id: 'tsql-joins-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `WITH c(id) AS (VALUES (1), (2), (3)),
     o(cid) AS (VALUES (1), (1), (2))
SELECT c.id
FROM c
INNER JOIN o ON o.cid = c.id
ORDER BY c.id;`,
    expectedOutput: `1
1
2`,
    explanation: 'INNER JOIN produces one output row per matching pair. Customer 1 matches two order rows (→ 1, 1), customer 2 matches one (→ 2), and customer 3 has no order so it is dropped entirely.',
    hints: ['One row per matching pair; unmatched left rows are excluded'],
    tags: ['tsql', 'joins', 'inner-join', 'predict'],
  },
  {
    id: 'tsql-joins-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords that join customers to their orders on the matching key.',
    template: `SELECT c.FullName, o.Amount
FROM dbo.DimCustomer c
___ ___ dbo.FactOrders o ___ o.CustomerKey = c.CustomerKey;`,
    blanks: ['INNER', 'JOIN', 'ON'],
    solution: `SELECT c.FullName, o.Amount
FROM dbo.DimCustomer c
INNER JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey;`,
    explanation: '`INNER JOIN <table> ON <predicate>` matches rows across the two tables. Table aliases (`c`, `o`) keep the column references short and unambiguous.',
    hints: ['<which> JOIN … ON <predicate>'],
    tags: ['tsql', 'joins', 'inner-join', 'cloze'],
  },
  {
    id: 'tsql-joins-leftjoin-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the join type and the predicate that together return customers with no orders (an anti-join).',
    template: `SELECT c.FullName
FROM dbo.DimCustomer c
___ JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
WHERE o.OrderId ___;`,
    blanks: ['LEFT', 'IS NULL'],
    solution: `SELECT c.FullName
FROM dbo.DimCustomer c
LEFT JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
WHERE o.OrderId IS NULL;`,
    explanation: 'A LEFT JOIN keeps every customer; unmatched ones have NULL in all `o.*` columns. Filtering `WHERE o.OrderId IS NULL` therefore keeps exactly the customers with no orders — the standard "anti-join" idiom.',
    hints: ['Keep all left rows → LEFT JOIN', 'Unmatched → right key IS NULL'],
    tags: ['tsql', 'joins', 'left-join', 'anti-join', 'cloze'],
  },
  {
    id: 'tsql-joins-selfjoin-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    question: 'An `Employee` table has `EmployeeId` and `ManagerId` (a manager is also an employee). How do you list each employee next to their manager\'s name?',
    options: [
      { id: 'a', text: 'Join the table to itself with two aliases, matching `e.ManagerId = m.EmployeeId` (a self join).', isCorrect: true },
      { id: 'b', text: 'Use a CROSS JOIN of the table with itself and keep every row pair returned.', isCorrect: false },
      { id: 'c', text: 'It is impossible in one query — managers must be stored in a separate table first.', isCorrect: false },
      { id: 'd', text: 'GROUP BY ManagerId and the manager name appears automatically in the aggregate.', isCorrect: false },
    ],
    explanation: 'A self join references the same table twice under different aliases — one instance as the employee (`e`), one as the manager (`m`) — joined on `e.ManagerId = m.EmployeeId`. Use a LEFT self join if you also want employees with no manager (e.g. the CEO).',
    hints: ['Same table, two aliases', 'e.ManagerId = m.EmployeeId'],
    tags: ['tsql', 'joins', 'self-join'],
  },
  {
    id: 'tsql-joins-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Join `dbo.DimCustomer c` (CustomerKey, FullName) to `dbo.FactOrders o` (CustomerKey, Amount) and return each customer\'s FullName and Amount, for orders with Amount over 100.',
    starterCode: `-- SELECT c.FullName, o.Amount FROM ... JOIN ... ON ...
`,
    testCases: [
      {
        input: 'INNER JOIN on CustomerKey, WHERE o.Amount > 100',
        expectedOutput: 'FullName + Amount for orders over 100',
        description: 'INNER JOIN + filter',
      },
    ],
    solution: `SELECT c.FullName, o.Amount
FROM dbo.DimCustomer c
INNER JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
WHERE o.Amount > 100;`,
    explanation: 'Match the two tables on `CustomerKey`, then filter the matched rows with `WHERE o.Amount > 100`. (`JOIN` and `INNER JOIN` are equivalent.)',
    hints: ['Join on CustomerKey', 'Filter the joined rows with WHERE o.Amount > 100'],
    tags: ['tsql', 'joins', 'inner-join'],
  },
  {
    id: 'tsql-joins-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Return the FullName of every customer in `dbo.DimCustomer` who has NO matching rows in `dbo.FactOrders` (matched on CustomerKey).',
    starterCode: `-- anti-join: LEFT JOIN ... WHERE right key IS NULL
`,
    testCases: [
      {
        input: 'LEFT JOIN ... WHERE o.OrderId IS NULL (or NOT EXISTS)',
        expectedOutput: 'Customers with no orders',
        description: 'Anti-join',
      },
    ],
    solution: `SELECT c.FullName
FROM dbo.DimCustomer c
LEFT JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
WHERE o.OrderId IS NULL;
-- OR
SELECT c.FullName
FROM dbo.DimCustomer c
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.FactOrders o WHERE o.CustomerKey = c.CustomerKey
);`,
    explanation: 'Two idiomatic anti-joins: a LEFT JOIN keeping only rows where the right side is NULL, or `NOT EXISTS` with a correlated subquery. Both return customers with zero orders; `NOT EXISTS` is often the clearer intent and handles NULLs safely.',
    hints: ['LEFT JOIN then WHERE o.OrderId IS NULL', 'or NOT EXISTS (correlated subquery)'],
    tags: ['tsql', 'joins', 'left-join', 'anti-join'],
  },
];
