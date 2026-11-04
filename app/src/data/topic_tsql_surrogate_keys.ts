/**
 * Topic.TSQL_SURROGATE_KEYS - SQL for Data Engineering (T-SQL).
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
      { id: 'a', text: 'A surrogate is a small integer the warehouse owns: it stays stable when source keys change, allows several versions of one entity (SCD2) and joins across sources.', isCorrect: true },
      { id: 'b', text: 'SQL Server cannot build a primary key on a natural column, so every table needs an IDENTITY surrogate to have one.', isCorrect: false },
      { id: 'c', text: 'A surrogate key encodes the full business meaning of the row, so the descriptive columns can be dropped from the dimension.', isCorrect: false },
      { id: 'd', text: 'A surrogate key is always a short string, and short strings join faster than the integer keys of the source system.', isCorrect: false },
    ],
    explanation: 'Surrogate keys decouple the warehouse from source systems: a compact integer that the warehouse controls, survives source-key changes/merges, and, crucially, lets one business entity have multiple dimension rows over time (SCD Type 2). The natural key is kept as an attribute for lookups, but facts join on the surrogate.',
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
      { id: 'a', text: 'IDENTITY is a property of one column, filled in on INSERT; a SEQUENCE is a standalone object whose NEXT VALUE FOR can be shared by several tables and fetched before the insert.', isCorrect: true },
      { id: 'b', text: 'A SEQUENCE never skips a number, whereas IDENTITY can leave gaps after a rollback or a failed insert.', isCorrect: false },
      { id: 'c', text: 'IDENTITY is a standalone object that several tables can share, whereas a SEQUENCE belongs to a single column.', isCorrect: false },
      { id: 'd', text: 'They are one feature under two names: SEQUENCE is the newer keyword and IDENTITY is deprecated.', isCorrect: false },
    ],
    explanation: 'IDENTITY is tied to one column and assigned automatically as rows insert. A SEQUENCE is an independent object: you can call `NEXT VALUE FOR` to get a key before inserting (useful for parent/child loads) and share one number space across several tables. Neither promises gap-free numbers, since a rolled-back insert still uses up a value.',
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
    question: 'Fill in the column property that makes CustomerKey a surrogate key the database numbers itself, starting at 1 and adding 1 for each new row.',
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
    explanation: '`IDENTITY(seed, increment)` auto-assigns the surrogate key on each INSERT - `IDENTITY(1, 1)` starts at 1 and adds 1 per row. `CustomerKey` is the warehouse surrogate; `CustomerId` keeps the source business key as a lookup attribute.',
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
    question: 'The empty dbo.DimStore table gets its StoreKey from a standalone number generator rather than IDENTITY. Fill in the object type that creates the generator and the keyword that fetches its next value.',
    tables: [{ name: 'dbo.DimStore', columns: ['StoreKey', 'StoreCode'], rows: [] }],
    template: `CREATE ___ dbo.StoreKeySeq AS INT START WITH 1 INCREMENT BY 1;

INSERT INTO dbo.DimStore (StoreKey, StoreCode)
VALUES (NEXT VALUE ___ dbo.StoreKeySeq, 'S-10');`,
    blanks: ['SEQUENCE', 'FOR'],
    solution: `CREATE SEQUENCE dbo.StoreKeySeq AS INT START WITH 1 INCREMENT BY 1;

INSERT INTO dbo.DimStore (StoreKey, StoreCode)
VALUES (NEXT VALUE FOR dbo.StoreKeySeq, 'S-10');`,
    explanation: '`CREATE SEQUENCE` defines a standalone number generator; unlike `IDENTITY` it is not tied to one column or table. `NEXT VALUE FOR <sequence>` fetches the next value - you can grab it before the INSERT, which is handy when a parent and child row both need the same generated key.',
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
      { id: 'a', text: 'A yyyymmdd integer is readable, sorts in date order, and can be computed from a fact\'s date during a load with no lookup join.', isCorrect: true },
      { id: 'b', text: 'SQL Server does not allow an IDENTITY column on a table that holds dates, so the key has to be typed in by hand.', isCorrect: false },
      { id: 'c', text: 'A DATE column cannot be used as a join key, so the fact must store an integer that stands in for the date.', isCorrect: false },
      { id: 'd', text: 'Meaningful keys are better for every dimension, so the yyyymmdd pattern should be copied to customers and products too.', isCorrect: false },
    ],
    explanation: 'The date dimension is the classic exception to "surrogates should be meaningless": a yyyymmdd integer is readable, sorts chronologically, lets you derive the key from a fact\'s date without a lookup, and aligns naturally with date-range partitioning. The exception does not spread: customers and products still use meaningless surrogates, because their business attributes change.',
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
    starterCode: `-- Write the CREATE TABLE statement below.
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
);
-- OR
CREATE TABLE dbo.DimProduct (
    ProductKey  INT IDENTITY(1, 1) PRIMARY KEY,
    ProductCode NVARCHAR(30) NOT NULL UNIQUE,
    ProductName NVARCHAR(120) NOT NULL,
    Category    NVARCHAR(60)
);
-- OR
CREATE TABLE dbo.DimProduct (
    ProductKey  INT IDENTITY PRIMARY KEY,
    ProductCode NVARCHAR(30) NOT NULL UNIQUE,
    ProductName NVARCHAR(120) NOT NULL,
    Category    NVARCHAR(60) NULL
);
-- OR
CREATE TABLE dbo.DimProduct (
    ProductKey  INT IDENTITY PRIMARY KEY,
    ProductCode NVARCHAR(30) NOT NULL UNIQUE,
    ProductName NVARCHAR(120) NOT NULL,
    Category    NVARCHAR(60)
);`,
    explanation: 'The surrogate `ProductKey` (`IDENTITY(1,1)`) is the warehouse-owned join key the facts use; the natural `ProductCode` is kept as a `UNIQUE` attribute so loads can look up the surrogate by business key. Separating the two is what later enables SCD Type 2 - one ProductCode can map to several ProductKeys over time.',
    hints: ['IDENTITY(1,1) PRIMARY KEY for the surrogate', 'ProductCode NVARCHAR(30) NOT NULL UNIQUE for the natural key'],
    requires: [/IDENTITY/i],
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
  {
    id: 'tsql-surr-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SURROGATE_KEYS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The table starts empty. What single value does the final SELECT return?',
    code: `CREATE TABLE dbo.DimStore (
    StoreKey  INT IDENTITY(1, 1) PRIMARY KEY,
    StoreCode VARCHAR(10) NOT NULL UNIQUE
);
INSERT INTO dbo.DimStore (StoreCode) VALUES ('S-10'), ('S-20');
DELETE FROM dbo.DimStore WHERE StoreCode = 'S-20';
INSERT INTO dbo.DimStore (StoreCode) VALUES ('S-30');
SELECT StoreKey FROM dbo.DimStore WHERE StoreCode = 'S-30';`,
    expectedOutput: `3`,
    explanation: 'The two inserts take keys 1 and 2. `DELETE` removes the S-20 row but does not give key 2 back: `IDENTITY` only moves forward, so S-30 gets 3. Surrogate keys carry no meaning and may have gaps, which is why nothing should depend on them being dense. Only `TRUNCATE TABLE` or a reseed starts the count again.',
    hints: ['IDENTITY never hands out a deleted value again', 'Keys 1 and 2 were already used'],
    tags: ['tsql', 'surrogate-keys', 'identity', 'gaps', 'predict'],
  },
];
