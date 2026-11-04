/**
 * Topic.TSQL_VIEWS - SQL for Data Engineering (T-SQL).
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
import { sampleTable } from './tsqlSampleTables';

export const tsql_views_questions: Question[] = [
  {
    id: 'tsql-views-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    question: 'What is a VIEW, and what makes it an "indexed" (materialized) view?',
    options: [
      { id: 'a', text: 'A VIEW is a stored SELECT that holds no rows of its own; creating it `WITH SCHEMABINDING` and adding a unique clustered index makes SQL Server store and maintain its result.', isCorrect: true },
      { id: 'b', text: 'A VIEW stores a copy of its rows when it is created and refreshes it on a schedule; an "indexed" view is one built over indexed base tables.', isCorrect: false },
      { id: 'c', text: 'A VIEW is a stored SELECT that holds no rows of its own; making it "indexed" means indexing each base table it reads, which then stores the view\'s result.', isCorrect: false },
      { id: 'd', text: 'A VIEW is a stored SELECT that holds no rows of its own; creating it `WITH SCHEMABINDING` is enough on its own for SQL Server to store its result.', isCorrect: false },
    ],
    explanation: 'A regular view is just a named query - it is expanded into the referencing statement at run time and stores nothing, and indexes on its base tables do not change that. To materialize it, create it `WITH SCHEMABINDING` (which only locks the view to the base tables\' schema and stores nothing by itself) and then build a unique clustered index on the view; that index is what makes SQL Server store and maintain the result, speeding up expensive aggregations at the cost of write overhead.',
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
    tables: [
      sampleTable('dbo.DimCustomer', ['CustomerKey', 'FullName']),
      sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'Amount']),
    ],
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
___ VIEW dbo.vCustomerOrders ___
SELECT c.FullName, o.OrderId, o.Amount
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey;`,
    blanks: ['CREATE', 'AS'],
    blankAlternates: [['CREATE OR ALTER'], []],
    solution: `CREATE VIEW dbo.vCustomerOrders AS
SELECT c.FullName, o.OrderId, o.Amount
FROM dbo.DimCustomer c
JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey;`,
    explanation: '`CREATE VIEW <name> AS <select>` stores the query under a name (`CREATE OR ALTER VIEW` does the same and replaces the view if it already exists). Querying `dbo.vCustomerOrders` then runs the underlying SELECT - handy for hiding join complexity behind a stable, reusable interface.',
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
    question: 'Create a view `dbo.vSalesByCustomer` that joins `dbo.DimCustomer` (alias `c`) to `dbo.FactOrders` (alias `o`) and returns, for each customer with at least one order, their `CustomerKey`, `FullName`, and total order amount aliased as `TotalAmount`.',
    tables: [
      sampleTable('dbo.DimCustomer', ['CustomerKey', 'FullName']),
      sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'Amount']),
    ],
    requires: [/CREATE\s+(OR\s+ALTER\s+)?VIEW/i],
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
    explanation: 'The view wraps an aggregating join: `SUM(o.Amount)` per customer, with both non-aggregated columns in `GROUP BY`. The inner join keeps only customers who have orders, so against the rows shown customer 5 is left out (a `LEFT JOIN` would list them with a NULL total). Consumers then `SELECT … FROM dbo.vSalesByCustomer` without re-deriving the rollup each time.',
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
    explanation: 'A computed column `AS (<expr>)` derives its value from other columns. By default it is virtual (recomputed on read); adding `PERSISTED` stores it physically, which lets you index it and avoids recomputation on every query - useful for a frequently-read derived measure.',
    hints: ['The keyword that stores a computed column on disk'],
    tags: ['tsql', 'views', 'computed-column', 'cloze'],
  },
  {
    id: 'tsql-views-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_VIEWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: '`dbo.DimCustomer` holds the rows shown when the view is created. What single number does the final SELECT return?',
    tables: [
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerKey', 'FullName', 'IsActive'],
        rows: [
          [1, 'Ingrid Berg', 1],
          [2, 'Lars Holm', 1],
          [3, 'Sofia Lind', 0],
        ],
      },
    ],
    code: `CREATE VIEW dbo.vActiveCustomer AS
SELECT CustomerKey FROM dbo.DimCustomer WHERE IsActive = 1;
GO
INSERT INTO dbo.DimCustomer (CustomerKey, FullName, IsActive)
VALUES (4, N'Lena Ortiz', 1);
SELECT COUNT(*) FROM dbo.vActiveCustomer;`,
    expectedOutput: `3`,
    explanation: 'A plain view stores only its `SELECT`, not a copy of the rows. Each query against it runs that `SELECT` on the base table as it is now, so the customer inserted after `CREATE VIEW` is counted: the 2 active rows shown (Sofia Lind is inactive) plus Lena Ortiz make 3. A snapshot that does not change needs a table, for example from `SELECT ... INTO`.',
    hints: ['A view holds a query, not rows', 'The view reads the base table each time it is queried'],
    tags: ['tsql', 'views', 'predict'],
  },
];
