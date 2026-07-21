/**
 * Topic.TSQL_FACTS_DIMS — SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): fact vs dimension tables, grain,
 * additive / semi-additive / non-additive measures, degenerate dimensions.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_facts_dims_questions: Question[] = [
  {
    id: 'tsql-facts-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    question: 'In a dimensional model, what distinguishes a fact table from a dimension table?',
    options: [
      { id: 'a', text: 'A fact table stores measurable events (numeric measures + foreign keys to dimensions); a dimension table stores descriptive context (who/what/where/when) you filter and group by.', isCorrect: true },
      { id: 'b', text: 'A fact table stores text descriptions while a dimension table stores all the numeric totals of the warehouse.', isCorrect: false },
      { id: 'c', text: 'Fact and dimension tables are identical in role; the names just indicate which was created first.', isCorrect: false },
      { id: 'd', text: 'A fact table can never have foreign keys, whereas a dimension table is made entirely of foreign keys.', isCorrect: false },
    ],
    explanation: 'Facts record events — measures like Amount or Quantity plus foreign keys pointing at the dimensions. Dimensions hold the descriptive attributes (customer name, product category, date) you slice and group by. Facts are tall and narrow with many rows; dimensions are short and wide.',
    hints: ['Fact = measurable events (numbers + FKs)', 'Dimension = descriptive context to filter/group by'],
    tags: ['tsql', 'facts-dims', 'dimensional-modeling'],
  },
  {
    id: 'tsql-facts-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    question: 'Why is declaring the "grain" of a fact table the first modeling decision?',
    options: [
      { id: 'a', text: 'The grain defines exactly what one row represents (e.g. one order line); every measure and dimension must be consistent with that level, or aggregations double-count.', isCorrect: true },
      { id: 'b', text: 'The grain sets the physical page size on disk and has no effect on query correctness.', isCorrect: false },
      { id: 'c', text: 'The grain only matters for indexing and can be decided after all the data is loaded.', isCorrect: false },
      { id: 'd', text: 'The grain is the number of columns in the table; more columns always means a finer grain.', isCorrect: false },
    ],
    explanation: 'Grain = the meaning of a single row ("one product on one order"). Fixing it first guarantees every measure is additive at that level and every dimension applies to every row. Mixing grains (order-level totals stored beside line-level rows) causes silent double-counting in `SUM`.',
    hints: ['Grain = what one row means', 'Mixed grains → double-counting'],
    tags: ['tsql', 'facts-dims', 'grain'],
  },
  {
    id: 'tsql-facts-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    question: 'An account-balance snapshot fact stores `Balance` per account per day. How should `Balance` be treated across the Date dimension?',
    options: [
      { id: 'a', text: 'As semi-additive — you can sum it across accounts but NOT across dates (summing daily balances over time is meaningless); use an average or end-of-period value instead.', isCorrect: true },
      { id: 'b', text: 'As fully additive — summing balances across every date and account is always correct.', isCorrect: false },
      { id: 'c', text: 'As non-additive — it can never be aggregated in any way, only displayed row by row.', isCorrect: false },
      { id: 'd', text: 'As a degenerate dimension — balances should be moved out of the fact into their own table.', isCorrect: false },
    ],
    explanation: 'A balance is semi-additive: summing across accounts on a given day is fine, but summing the same account\'s balance across days double-counts money that never moved. Snapshot measures are typically aggregated over time with AVG or a period-end value, not SUM.',
    hints: ['Balances sum across accounts, not across time', 'That property is "semi-additive"'],
    tags: ['tsql', 'facts-dims', 'semi-additive', 'measures'],
  },
  {
    id: 'tsql-facts-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the column roles: the fact references the customer and product dimensions, and stores a measure.',
    template: `CREATE TABLE dbo.FactSales (
    SalesKey    BIGINT IDENTITY PRIMARY KEY,
    CustomerKey INT NOT NULL ___ dbo.DimCustomer (CustomerKey),
    ProductKey  INT NOT NULL REFERENCES dbo.DimProduct (ProductKey),
    Quantity    INT NOT NULL,
    Amount      ___ (10, 2) NOT NULL
);`,
    blanks: ['REFERENCES', 'DECIMAL'],
    solution: `CREATE TABLE dbo.FactSales (
    SalesKey    BIGINT IDENTITY PRIMARY KEY,
    CustomerKey INT NOT NULL REFERENCES dbo.DimCustomer (CustomerKey),
    ProductKey  INT NOT NULL REFERENCES dbo.DimProduct (ProductKey),
    Quantity    INT NOT NULL,
    Amount      DECIMAL (10, 2) NOT NULL
);`,
    explanation: 'A fact table is foreign keys to its dimensions (`REFERENCES dbo.DimCustomer …`) plus numeric measures (`Quantity`, `Amount DECIMAL(10,2)`). The inline `REFERENCES` shorthand declares the FK; `DECIMAL(10,2)` is the right money type (never FLOAT for currency).',
    hints: ['Inline FK keyword is REFERENCES', 'Money measure → DECIMAL(p, s)'],
    tags: ['tsql', 'facts-dims', 'foreign-key', 'cloze'],
  },
  {
    id: 'tsql-facts-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    question: 'What is a degenerate dimension, and how is it stored?',
    options: [
      { id: 'a', text: 'A dimension attribute with no other attributes of its own (like an order/invoice number) — kept as a column directly in the fact table rather than in a separate dimension.', isCorrect: true },
      { id: 'b', text: 'A dimension table that has lost its primary key and must be rebuilt before it can be used.', isCorrect: false },
      { id: 'c', text: 'A measure that has become non-additive and is therefore moved out of the fact table.', isCorrect: false },
      { id: 'd', text: 'A dimension shared by every fact, which is why it is stored once in a central config table.', isCorrect: false },
    ],
    explanation: 'A degenerate dimension is an identifier (transaction/order/invoice number) that you want to group or filter by but which has no descriptive attributes worth a separate table. It lives as a plain column in the fact — building a one-column DimOrderNumber would add a pointless join.',
    hints: ['An ID with no attributes of its own', 'Stays in the fact table, no separate dim'],
    tags: ['tsql', 'facts-dims', 'degenerate-dimension'],
  },
  {
    id: 'tsql-facts-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_FACTS_DIMS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create a fact table `dbo.FactOrderLine` at the grain of one product on one order. It needs: `OrderLineKey` BIGINT IDENTITY PRIMARY KEY; FKs `CustomerKey` and `ProductKey` (both INT NOT NULL) referencing `dbo.DimCustomer (CustomerKey)` and `dbo.DimProduct (ProductKey)`; a degenerate dimension `OrderNumber` NVARCHAR(20) NOT NULL; and measures `Quantity` INT NOT NULL and `LineAmount` DECIMAL(12,2) NOT NULL.',
    starterCode: `-- CREATE TABLE dbo.FactOrderLine ( ... )
`,
    testCases: [
      {
        input: 'FactOrderLine with IDENTITY PK, two dimension FKs, degenerate OrderNumber, two measures',
        expectedOutput: 'Order-line-grain fact table',
        description: 'Fact table DDL with FKs, degenerate dim, and measures',
      },
    ],
    solution: `CREATE TABLE dbo.FactOrderLine (
    OrderLineKey BIGINT IDENTITY PRIMARY KEY,
    CustomerKey  INT NOT NULL REFERENCES dbo.DimCustomer (CustomerKey),
    ProductKey   INT NOT NULL REFERENCES dbo.DimProduct (ProductKey),
    OrderNumber  NVARCHAR(20) NOT NULL,
    Quantity     INT NOT NULL,
    LineAmount   DECIMAL(12, 2) NOT NULL
);`,
    tieredHints: {
      apiSignature: 'col INT NOT NULL REFERENCES dim_table (dim_pk_col)',
      skeleton: `CREATE TABLE dbo.FactOrderLine (
    OrderLineKey BIGINT ____ PRIMARY KEY,
    CustomerKey  INT ____ ____ dbo.DimCustomer (CustomerKey),
    ProductKey   INT ____ ____ dbo.DimProduct (ProductKey),
    OrderNumber  NVARCHAR(20) ____,
    Quantity     INT ____,
    LineAmount   ____(12, 2) ____
);`,
    },
    explanation: 'The grain (one product per order) drives the design: a surrogate `IDENTITY` PK, foreign keys to the customer and product dimensions, the `OrderNumber` as a degenerate dimension (an ID with no attributes of its own, so it stays in the fact), and the additive measures `Quantity` and `LineAmount`. Every column is consistent with the stated grain.',
    hints: ['IDENTITY surrogate PK, two REFERENCES FKs', 'OrderNumber stays inline (degenerate); measures are Quantity + LineAmount'],
    tags: ['tsql', 'facts-dims', 'grain', 'degenerate-dimension'],
  },
];
