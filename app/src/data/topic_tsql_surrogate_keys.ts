/**
 * Topic.TSQL_SURROGATE_KEYS — SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): IDENTITY, SEQUENCE, natural vs surrogate keys,
 * the date/calendar dimension.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_surrogate_keys_questions: Question[] = [
  {
    id: 'tsql-surr-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    question: 'Why do warehouse dimensions use a surrogate key instead of the source system\'s natural/business key?',
    options: [
      { id: 'a', text: 'A surrogate is a small, warehouse-owned integer that stays stable when source keys change, lets you version rows (SCD2), and integrates multiple sources — facts join on it instead of a volatile business key.', isCorrect: true },
      { id: 'b', text: 'Surrogate keys are required by SQL Server; a table cannot have a primary key made from a natural column.', isCorrect: false },
      { id: 'c', text: 'A surrogate key stores the full business meaning, so the descriptive columns can be dropped to save space.', isCorrect: false },
      { id: 'd', text: 'Surrogate keys are always strings, which makes joins faster than integer natural keys.', isCorrect: false },
    ],
    explanation: 'Surrogate keys decouple the warehouse from source systems: a compact integer that the warehouse controls, survives source-key changes/merges, and—crucially—lets one business entity have multiple dimension rows over time (SCD Type 2). The natural key is kept as an attribute for lookups, but facts join on the surrogate.',
    hints: ['Warehouse-owned stable integer', 'Enables SCD2 versioning + multi-source integration'],
    tags: ['tsql', 'surrogate-keys', 'natural-key'],
  },
  {
    id: 'tsql-surr-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    question: 'How does `IDENTITY` differ from a `SEQUENCE` in T-SQL?',
    options: [
      { id: 'a', text: 'IDENTITY is a column property auto-assigned on INSERT to that one table; a SEQUENCE is a standalone object whose NEXT VALUE FOR can be shared across multiple tables and fetched before the insert.', isCorrect: true },
      { id: 'b', text: 'They are identical; SEQUENCE is just the newer keyword for IDENTITY.', isCorrect: false },
      { id: 'c', text: 'IDENTITY can be shared across tables, while a SEQUENCE is locked to a single column.', isCorrect: false },
      { id: 'd', text: 'SEQUENCE values are always random GUIDs, whereas IDENTITY values are sequential integers.', isCorrect: false },
    ],
    explanation: 'IDENTITY is tied to one column and assigned automatically as rows insert. A SEQUENCE is an independent object — you can call `NEXT VALUE FOR` to get a key before inserting (useful for parent/child loads) and share one number space across several tables. Both give gap-prone monotonic integers.',
    hints: ['IDENTITY = per-column, auto on insert', 'SEQUENCE = standalone, shareable, fetch ahead of insert'],
    tags: ['tsql', 'surrogate-keys', 'identity', 'sequence'],
  },
  {
    id: 'tsql-surr-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that auto-generates a surrogate key starting at 1, incrementing by 1.',
    template: `CREATE TABLE dbo.DimCustomer (
    CustomerKey INT ___(1, 1) PRIMARY KEY,
    CustomerId  NVARCHAR(20) NOT NULL,   -- natural/business key
    FullName    NVARCHAR(100) NOT NULL
);`,
    blanks: ['IDENTITY'],
    solution: `CREATE TABLE dbo.DimCustomer (
    CustomerKey INT IDENTITY(1, 1) PRIMARY KEY,
    CustomerId  NVARCHAR(20) NOT NULL,   -- natural/business key
    FullName    NVARCHAR(100) NOT NULL
);`,
    explanation: '`IDENTITY(seed, increment)` auto-assigns the surrogate key on each INSERT — `IDENTITY(1, 1)` starts at 1 and adds 1 per row. `CustomerKey` is the warehouse surrogate; `CustomerId` keeps the source business key as a lookup attribute.',
    hints: ['The auto-increment column property', 'IDENTITY(seed, increment)'],
    tags: ['tsql', 'surrogate-keys', 'identity', 'cloze'],
  },
  {
    id: 'tsql-surr-sequence-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the object type that defines a standalone key generator, and the expression that fetches its next value.',
    template: `CREATE ___ dbo.OrderKeySeq AS INT START WITH 1 INCREMENT BY 1;

INSERT INTO dbo.FactOrders (OrderKey, Amount)
VALUES (NEXT VALUE ___ dbo.OrderKeySeq, 100);`,
    blanks: ['SEQUENCE', 'FOR'],
    solution: `CREATE SEQUENCE dbo.OrderKeySeq AS INT START WITH 1 INCREMENT BY 1;

INSERT INTO dbo.FactOrders (OrderKey, Amount)
VALUES (NEXT VALUE FOR dbo.OrderKeySeq, 100);`,
    explanation: '`CREATE SEQUENCE` defines a standalone number generator, unlike `IDENTITY` it is not tied to one column or table. `NEXT VALUE FOR <sequence>` fetches the next value - you can grab it before the INSERT, which is handy when a parent and child row both need the same generated key.',
    hints: ['Standalone generator object, not a column property', 'NEXT VALUE FOR <sequence name>'],
    tags: ['tsql', 'surrogate-keys', 'sequence', 'cloze'],
  },
  {
    id: 'tsql-surr-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    question: 'A date dimension commonly uses a key like `20260628` (INT) instead of an IDENTITY. Why?',
    options: [
      { id: 'a', text: 'A "smart" integer date key (yyyymmdd) is human-readable, lets fact partitions align to date ranges, and avoids a lookup just to find a day\'s key during loads.', isCorrect: true },
      { id: 'b', text: 'Because the date dimension is the only table where IDENTITY is forbidden by SQL Server.', isCorrect: false },
      { id: 'c', text: 'Because date keys must be strings and yyyymmdd is the only allowed string format.', isCorrect: false },
      { id: 'd', text: 'Because a meaningless surrogate would make date-range queries impossible on the fact table.', isCorrect: false },
    ],
    explanation: 'The date dimension is the classic exception to "surrogates should be meaningless": a yyyymmdd integer is readable, sorts chronologically, lets you derive the key from a fact\'s date without a lookup, and aligns naturally with date-range partitioning. The general meaningless-surrogate rule still holds for all other dimensions.',
    hints: ['yyyymmdd integer is readable + range-friendly', 'The date dim is the standard exception'],
    tags: ['tsql', 'surrogate-keys', 'date-dimension'],
  },
  {
    id: 'tsql-surr-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create dimension `dbo.DimProduct` with: a surrogate `ProductKey` INT that auto-increments from 1 as the PRIMARY KEY; a natural key `ProductCode` NVARCHAR(30) NOT NULL that must be UNIQUE; `ProductName` NVARCHAR(120) NOT NULL; and `Category` NVARCHAR(60) NULL.',
    starterCode: `-- CREATE TABLE dbo.DimProduct ( ... )
`,
    testCases: [
      {
        input: 'DimProduct with IDENTITY surrogate PK and UNIQUE natural key',
        expectedOutput: 'Dimension separating surrogate key from natural key',
        description: 'Surrogate + natural key dimension',
      },
    ],
    solution: `CREATE TABLE dbo.DimProduct (
    ProductKey  INT IDENTITY(1, 1) PRIMARY KEY,
    ProductCode NVARCHAR(30) NOT NULL UNIQUE,
    ProductName NVARCHAR(120) NOT NULL,
    Category    NVARCHAR(60) NULL
);`,
    explanation: 'The surrogate `ProductKey` (`IDENTITY(1,1)`) is the warehouse-owned join key the facts use; the natural `ProductCode` is kept as a `UNIQUE` attribute so loads can look up the surrogate by business key. Separating the two is what later enables SCD Type 2 — one ProductCode can map to several ProductKeys over time.',
    hints: ['IDENTITY(1,1) PRIMARY KEY for the surrogate', 'ProductCode NVARCHAR(30) NOT NULL UNIQUE for the natural key'],
    tags: ['tsql', 'surrogate-keys', 'identity', 'natural-key'],
    tieredHints: {
      apiSignature: 'column_name INT IDENTITY(seed, increment) PRIMARY KEY',
      skeleton: `CREATE TABLE dbo.DimProduct (
    ProductKey  INT ____(____, ____) PRIMARY KEY,
    ProductCode NVARCHAR(30) ____ ____,
    ProductName NVARCHAR(120) ____,
    Category    NVARCHAR(60) ____
);`,
    },
  },
];
