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
    id: 'tsql-joins-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    question: 'What does a FULL OUTER JOIN return?',
    options: [
      { id: 'a', text: 'Every row from both tables - matched rows combined, and unmatched rows from either side padded with NULL on the missing side.', isCorrect: true },
      { id: 'b', text: 'Only rows that match in both tables, same result as an INNER JOIN.', isCorrect: false },
      { id: 'c', text: 'Every row from the right table only, matched against the left where possible.', isCorrect: false },
      { id: 'd', text: 'The Cartesian product of both tables - every combination of rows.', isCorrect: false },
    ],
    explanation: 'FULL OUTER JOIN is the union of LEFT and RIGHT: it keeps every row from both tables, filling in NULL on whichever side has no match. INNER JOIN would drop unmatched rows entirely, and a Cartesian product is what CROSS JOIN produces.',
    hints: ['FULL OUTER = union of LEFT and RIGHT', 'unmatched rows on either side get NULL padding'],
    tags: ['tsql', 'joins', 'full-join'],
  },
  {
    id: 'tsql-joins-right-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    question: 'How does RIGHT JOIN differ from LEFT JOIN?',
    options: [
      { id: 'a', text: 'RIGHT JOIN keeps every row from the right-hand table, filling unmatched left-side columns with NULL - the mirror image of LEFT JOIN.', isCorrect: true },
      { id: 'b', text: 'RIGHT JOIN keeps every row from the left-hand table, identical to LEFT JOIN, just sorted in reverse.', isCorrect: false },
      { id: 'c', text: 'RIGHT JOIN only returns rows matching in both tables, identical to INNER JOIN.', isCorrect: false },
      { id: 'd', text: 'RIGHT JOIN is not valid T-SQL syntax; the tables must be swapped and written as LEFT JOIN instead.', isCorrect: false },
    ],
    explanation: 'RIGHT JOIN is LEFT JOIN with the preserved side flipped - it keeps every row of the right-hand table. It is valid, standard T-SQL, but rarely used in practice since swapping the table order in a LEFT JOIN reads more naturally and achieves the same result.',
    hints: ['RIGHT JOIN = LEFT JOIN with sides swapped', 'keeps all rows from the right table'],
    tags: ['tsql', 'joins', 'right-join'],
  },
  {
    id: 'tsql-joins-cross-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    question: "What does `SELECT * FROM dbo.DimColor CROSS JOIN dbo.DimSize` return, given DimColor has 4 rows and DimSize has 3 rows?",
    options: [
      { id: 'a', text: '12 rows - every combination of a color and a size (the Cartesian product).', isCorrect: true },
      { id: 'b', text: '7 rows - the two tables stacked on top of each other.', isCorrect: false },
      { id: 'c', text: '3 rows - one per DimSize row, matched arbitrarily to a color.', isCorrect: false },
      { id: 'd', text: '0 rows - CROSS JOIN requires an ON clause or it returns nothing.', isCorrect: false },
    ],
    explanation: 'CROSS JOIN (no ON clause, no shared key needed) produces the Cartesian product: every row of the first table paired with every row of the second, so 4 x 3 = 12 rows. It is often used deliberately to generate combinations, like a color/size matrix for products.',
    hints: ['No ON clause - every row pairs with every row', '4 colors x 3 sizes = 12 combinations'],
    tags: ['tsql', 'joins', 'cross-join'],
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
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT c.FullName, o.Amount
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
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT c.FullName
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
    requires: [/INNER\s+JOIN/i],
    question: 'Join `dbo.DimCustomer c` (CustomerKey, FullName) to `dbo.FactOrders o` (CustomerKey, Amount) and return each customer\'s FullName and Amount, for orders with Amount over 100.',
    starterCode: `-- Join dbo.DimCustomer and dbo.FactOrders to return FullName and Amount for orders over 100
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
    tieredHints: {
      apiSignature: 'INNER JOIN table ON left_col = right_col',
      skeleton: `SELECT c.____, o.____
FROM dbo.DimCustomer c
____ ____ dbo.FactOrders o ____ o.____ = c.____
WHERE o.Amount ____ ____;`,
    },
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
    requires: [/LEFT\s+JOIN|NOT\s+EXISTS/i],
    question: 'From `dbo.DimCustomer` (CustomerKey, FullName) and `dbo.FactOrders` (OrderId, CustomerKey, Amount), return the FullName of every customer who has NO matching rows in FactOrders (matched on CustomerKey).',
    starterCode: `-- dbo.DimCustomer(CustomerKey, FullName); return customers with no dbo.FactOrders(OrderId, CustomerKey) match
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
    tieredHints: {
      apiSignature: 'NOT EXISTS (SELECT 1 FROM table WHERE correlated_condition)',
      skeleton: `SELECT c.____
FROM dbo.DimCustomer c
____ ____ dbo.FactOrders o ____ o.____ = c.____
WHERE o.____ ____ ____;`,
    },
    explanation: 'Two idiomatic anti-joins: a LEFT JOIN keeping only rows where the right side is NULL, or `NOT EXISTS` with a correlated subquery. Both return customers with zero orders; `NOT EXISTS` is often the clearer intent and handles NULLs safely.',
    hints: ['LEFT JOIN then WHERE o.OrderId IS NULL', 'or NOT EXISTS (correlated subquery)'],
    tags: ['tsql', 'joins', 'left-join', 'anti-join'],
  },
  {
    id: 'tsql-joins-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_JOINS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/JOIN/i],
    question: "Join `dbo.FactOrders o` (CustomerKey, ProductKey, Amount) to both `dbo.DimCustomer c` (CustomerKey, FullName, Country) and `dbo.DimProduct p` (ProductKey, ProductName, Category). Return FullName, ProductName, and Amount for orders where the customer's Country is 'NO' and the product's Category is 'Books', ordered by Amount descending.",
    starterCode: `-- join across three tables
`,
    testCases: [
      {
        input: "3-table INNER JOIN, WHERE c.Country='NO' AND p.Category='Books', ORDER BY Amount DESC",
        expectedOutput: 'FullName + ProductName + Amount for matching orders',
        description: 'Multi-table join with cross-table filter',
      },
    ],
    solution: `SELECT c.FullName, p.ProductName, o.Amount
FROM dbo.FactOrders o
INNER JOIN dbo.DimCustomer c ON c.CustomerKey = o.CustomerKey
INNER JOIN dbo.DimProduct p ON p.ProductKey = o.ProductKey
WHERE c.Country = 'NO' AND p.Category = 'Books'
ORDER BY o.Amount DESC;`,
    tieredHints: {
      apiSignature: 'ORDER BY column ASC|DESC',
      skeleton: `SELECT c.____, p.____, o.____
FROM dbo.FactOrders o
____ ____ dbo.DimCustomer c ____ c.____ = o.____
____ ____ dbo.DimProduct p ____ p.____ = o.____
WHERE c.____ = 'NO' ____ p.____ = 'Books'
ORDER BY o.Amount ____;`,
    },
    explanation: 'A fact table commonly joins to several dimension tables at once - here FactOrders joins to both DimCustomer and DimProduct on their respective keys. Once joined, the WHERE clause can filter on columns from either dimension, and ORDER BY sorts the combined result.',
    hints: ['Two INNER JOINs, one per dimension table', 'Filter on columns from both joined tables', 'ORDER BY Amount DESC'],
    tags: ['tsql', 'joins', 'multi-table-join', 'inner-join'],
  },
];
