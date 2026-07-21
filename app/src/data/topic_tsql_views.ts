/**
 * Topic.TSQL_VIEWS — SQL for Data Engineering (T-SQL).
 * Pillar 2 (DDL & Constraints): CREATE VIEW, indexed/schemabound views,
 * computed (persisted) columns.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_views_questions: Question[] = [
  {
    id: 'tsql-views-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    question: 'What is a VIEW, and what makes it an "indexed" (materialized) view?',
    options: [
      { id: 'a', text: 'A VIEW is a stored SELECT (a virtual table) that holds no data of its own; adding `WITH SCHEMABINDING` plus a clustered index turns it into an indexed view whose results are physically persisted.', isCorrect: true },
      { id: 'b', text: 'A VIEW always stores a private copy of its rows; an "indexed" view is just a view that happens to query an indexed base table.', isCorrect: false },
      { id: 'c', text: 'A VIEW is a saved query that can only be read once per session; the "indexed" variant lets you read it repeatedly by caching it in tempdb.', isCorrect: false },
      { id: 'd', text: 'A VIEW is a stored procedure with no parameters; making it "indexed" means granting it an execution-plan hint at create time.', isCorrect: false },
    ],
    explanation: 'A regular view is just a named query — it is expanded into the referencing statement at run time and stores nothing. To materialize it, create it `WITH SCHEMABINDING` (which locks the view to the base tables\' schema) and then build a unique clustered index on it; SQL Server then stores and maintains the result, speeding up expensive aggregations at the cost of write overhead.',
    hints: ['Plain view = virtual, stores nothing', 'Indexed view = SCHEMABINDING + clustered index → persisted'],
    tags: ['tsql', 'views', 'indexed-view'],
  },
  {
    id: 'tsql-views-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords that define a view over a join.',
    template: `___ VIEW dbo.vCustomerOrders ___
SELECT c.FullName, o.OrderId, o.Amount
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey;`,
    blanks: ['CREATE', 'AS'],
    solution: `CREATE VIEW dbo.vCustomerOrders AS
SELECT c.FullName, o.OrderId, o.Amount
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey;`,
    explanation: '`CREATE VIEW <name> AS <select>` stores the query under a name. Querying `dbo.vCustomerOrders` then runs the underlying SELECT — handy for hiding join complexity behind a stable, reusable interface.',
    hints: ['DDL verb to define the object', 'The keyword before the SELECT body'],
    tags: ['tsql', 'views', 'create-view', 'cloze'],
  },
  {
    id: 'tsql-views-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create a view `dbo.vSalesByCustomer` that, joining `dbo.DimCustomer` (CustomerKey, FullName) to `dbo.FactOrders` (CustomerKey, Amount), returns each customer\'s `CustomerKey`, `FullName`, and total order amount aliased as `TotalAmount`.',
    starterCode: `-- CREATE VIEW dbo.vSalesByCustomer AS ...
`,
    testCases: [
      {
        input: 'CREATE VIEW dbo.vSalesByCustomer summing Amount per customer',
        expectedOutput: 'View returning CustomerKey, FullName, SUM(Amount) AS TotalAmount grouped by customer',
        description: 'Aggregating view over a join',
      },
    ],
    solution: `CREATE VIEW dbo.vSalesByCustomer AS
SELECT c.CustomerKey, c.FullName, SUM(o.Amount) AS TotalAmount
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
GROUP BY c.CustomerKey, c.FullName;`,
    explanation: 'The view wraps an aggregating join: `SUM(o.Amount)` per customer, with both non-aggregated columns in `GROUP BY`. Consumers then `SELECT … FROM dbo.vSalesByCustomer` without re-deriving the rollup each time.',
    hints: ['CREATE VIEW … AS SELECT … SUM(Amount) AS TotalAmount', 'GROUP BY every non-aggregated column'],
    tieredHints: {
      apiSignature: 'SUM([ALL | DISTINCT] expression)',
      skeleton: `CREATE VIEW dbo.vSalesByCustomer AS
SELECT c.CustomerKey, c.FullName, ____(o.Amount) AS ____
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = ____
GROUP BY ____, ____;`,
    },
    tags: ['tsql', 'views', 'create-view', 'aggregation'],
  },
  {
    id: 'tsql-views-computed-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that makes a computed column store its value physically (rather than recompute on read).',
    template: `CREATE TABLE dbo.FactSale (
    SaleKey   INT PRIMARY KEY,
    Quantity  INT NOT NULL,
    Price     DECIMAL(10, 2) NOT NULL,
    LineTotal AS (Quantity * Price) ___
);`,
    blanks: ['PERSISTED'],
    solution: `CREATE TABLE dbo.FactSale (
    SaleKey   INT PRIMARY KEY,
    Quantity  INT NOT NULL,
    Price     DECIMAL(10, 2) NOT NULL,
    LineTotal AS (Quantity * Price) PERSISTED
);`,
    explanation: 'A computed column `AS (<expr>)` derives its value from other columns. By default it is virtual (recomputed on read); adding `PERSISTED` stores it physically, which lets you index it and avoids recomputation on every query — useful for a frequently-read derived measure.',
    hints: ['The keyword that stores a computed column on disk'],
    tags: ['tsql', 'views', 'computed-column', 'cloze'],
  },
];
