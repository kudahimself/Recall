/**
 * Topic.TSQL_CONSTRAINTS — SQL for Data Engineering (T-SQL).
 * Pillar 2 (DDL & Constraints): PRIMARY KEY, FOREIGN KEY + ON DELETE, UNIQUE,
 * CHECK, NOT NULL, DEFAULT.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_constraints_questions: Question[] = [
  {
    id: 'tsql-constraints-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    question: 'How do PRIMARY KEY, UNIQUE, and FOREIGN KEY constraints differ?',
    options: [
      { id: 'a', text: 'PRIMARY KEY uniquely identifies each row (one per table, not nullable); UNIQUE forbids duplicates on other columns (allows a single NULL); FOREIGN KEY requires values to exist in a referenced table.', isCorrect: true },
      { id: 'b', text: 'PRIMARY KEY and UNIQUE are identical; FOREIGN KEY simply marks a column as indexed for faster joins but enforces no rule.', isCorrect: false },
      { id: 'c', text: 'PRIMARY KEY may repeat as long as it is not NULL; UNIQUE allows unlimited NULLs and duplicates; FOREIGN KEY auto-creates the referenced table.', isCorrect: false },
      { id: 'd', text: 'PRIMARY KEY allows many per table; UNIQUE enforces referential integrity; FOREIGN KEY guarantees each row is not nullable.', isCorrect: false },
    ],
    explanation: 'A table has at most one PRIMARY KEY (unique + NOT NULL, the row identity). UNIQUE enforces no duplicates on other column(s) and permits a single NULL in SQL Server. A FOREIGN KEY enforces referential integrity: a child value must match an existing parent key (or be NULL). These are the integrity backbone of a dimensional model.',
    hints: ['PK = one per table, unique + not null', 'FK = value must exist in the parent table'],
    tags: ['tsql', 'constraints', 'primary-key', 'foreign-key'],
  },
  {
    id: 'tsql-constraints-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the inline constraints: make CustomerKey the primary key, FullName required, and IsActive default to 1.',
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
CREATE TABLE dbo.DimCustomer (
    CustomerKey INT ___ KEY,
    FullName    NVARCHAR(100) ___ NULL,
    IsActive    BIT ___ 1
);`,
    blanks: ['PRIMARY', 'NOT', 'DEFAULT'],
    solution: `CREATE TABLE dbo.DimCustomer (
    CustomerKey INT PRIMARY KEY,
    FullName    NVARCHAR(100) NOT NULL,
    IsActive    BIT DEFAULT 1
);`,
    explanation: '`PRIMARY KEY` marks the row identity, `NOT NULL` makes a column required, and `DEFAULT <expr>` supplies a value when an INSERT omits the column. Declaring them inline keeps a simple table definition readable.',
    hints: ['Row identity → PRIMARY KEY', 'required → NOT NULL', 'fallback value → DEFAULT'],
    tags: ['tsql', 'constraints', 'default', 'cloze'],
  },
  {
    id: 'tsql-constraints-fk-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the foreign-key clause: it must point at the parent table, and cascade deletes to children.',
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
CREATE TABLE dbo.FactOrders (
    OrderId     INT PRIMARY KEY,
    CustomerKey INT NOT NULL,
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerKey)
        ___ dbo.DimCustomer (CustomerKey)
        ON ___ CASCADE
);`,
    blanks: ['REFERENCES', 'DELETE'],
    solution: `CREATE TABLE dbo.FactOrders (
    OrderId     INT PRIMARY KEY,
    CustomerKey INT NOT NULL,
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerKey)
        REFERENCES dbo.DimCustomer (CustomerKey)
        ON DELETE CASCADE
);`,
    explanation: '`FOREIGN KEY (col) REFERENCES parent (col)` declares the relationship; `ON DELETE CASCADE` automatically removes child rows when the parent is deleted. Naming the constraint (`FK_Orders_Customer`) makes errors and migrations far easier to read than a system-generated name.',
    hints: ['FK points at the parent with REFERENCES', 'cascade on a parent removal → ON DELETE CASCADE'],
    tags: ['tsql', 'constraints', 'foreign-key', 'cloze'],
  },
  {
    id: 'tsql-constraints-check-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the constraint type that rejects rows whose Amount is negative.',
    template: `-- dbo.FactSale(SaleId, Category, SubCategory, Amount, SaleDate)
CREATE TABLE dbo.FactSale (
    SaleKey INT PRIMARY KEY,
    Amount  DECIMAL(10, 2) NOT NULL,
    CONSTRAINT CK_Sale_Amount ___ (Amount >= 0)
);`,
    blanks: ['CHECK'],
    solution: `CREATE TABLE dbo.FactSale (
    SaleKey INT PRIMARY KEY,
    Amount  DECIMAL(10, 2) NOT NULL,
    CONSTRAINT CK_Sale_Amount CHECK (Amount >= 0)
);`,
    explanation: 'A `CHECK` constraint enforces a boolean predicate on every row, rejecting any INSERT/UPDATE that violates it. It pushes a data-quality rule (no negative amounts) into the schema itself so bad data can never land — far stronger than relying on application code.',
    hints: ['The constraint that validates a per-row predicate'],
    tags: ['tsql', 'constraints', 'check', 'cloze'],
  },
  {
    id: 'tsql-constraints-unique-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the constraint that forbids duplicate OrderRef values (but still allows one NULL).',
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
CREATE TABLE dbo.FactOrders (
    OrderId  INT PRIMARY KEY,
    OrderRef NVARCHAR(40) ___
);`,
    blanks: ['UNIQUE'],
    solution: `CREATE TABLE dbo.FactOrders (
    OrderId  INT PRIMARY KEY,
    OrderRef NVARCHAR(40) UNIQUE
);`,
    explanation: '`UNIQUE` forbids duplicate values on the column (unlike PRIMARY KEY, a table can have several), and SQL Server permits one NULL through it since NULL is never considered equal to another NULL.',
    hints: ['No-duplicates constraint, distinct from PRIMARY KEY'],
    tags: ['tsql', 'constraints', 'unique', 'cloze'],
  },
  {
    id: 'tsql-constraints-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_CONSTRAINTS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create `dbo.FactOrders` with: `OrderId` INT as PRIMARY KEY; `CustomerKey` INT NOT NULL with a FOREIGN KEY referencing `dbo.DimCustomer (CustomerKey)` that cascades on delete; `OrderRef` NVARCHAR(40) with a UNIQUE constraint; `Amount` DECIMAL(10,2) NOT NULL with a CHECK that it is `>= 0`; and `IsShipped` BIT defaulting to 0.',
    requires: [/CREATE\s+TABLE/i, /CONSTRAINT/i],
    starterCode: `-- CREATE TABLE dbo.FactOrders ( ... )
`,
    testCases: [
      {
        input: 'CREATE TABLE dbo.FactOrders with PK, FK ON DELETE CASCADE, UNIQUE, CHECK, DEFAULT',
        expectedOutput: 'Table enforcing identity, referential integrity, uniqueness, a non-negative amount, and a shipped default',
        description: 'Full constraint set on a fact table',
      },
    ],
    solution: `CREATE TABLE dbo.FactOrders (
    OrderId     INT PRIMARY KEY,
    CustomerKey INT NOT NULL,
    OrderRef    NVARCHAR(40) UNIQUE,
    Amount      DECIMAL(10, 2) NOT NULL,
    IsShipped   BIT DEFAULT 0,
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerKey)
        REFERENCES dbo.DimCustomer (CustomerKey)
        ON DELETE CASCADE,
    CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0)
);`,
    tieredHints: {
      apiSignature: 'CONSTRAINT ck_name CHECK (boolean_expression)',
      skeleton: `CREATE TABLE dbo.FactOrders (
    OrderId     INT ____ KEY,
    CustomerKey INT ____ ____,
    OrderRef    NVARCHAR(40) ____,
    Amount      DECIMAL(10, 2) ____ ____,
    IsShipped   BIT ____ 0,
    CONSTRAINT FK_Orders_Customer ____ ____ (CustomerKey)
        ____ dbo.DimCustomer (CustomerKey)
        ON ____ ____,
    CONSTRAINT CK_Orders_Amount ____ (Amount ____ 0)
);`,
    },
    explanation: 'This single statement wires up the full integrity set: PRIMARY KEY (identity), FOREIGN KEY … ON DELETE CASCADE (referential integrity), UNIQUE (no duplicate business key), CHECK (no negative amounts), and DEFAULT (sensible omitted value). Column-level constraints (UNIQUE, DEFAULT) can sit inline; multi-part ones (FK, CHECK) read best as named table-level constraints.',
    hints: ['Inline: PRIMARY KEY, UNIQUE, DEFAULT, NOT NULL', 'Named table-level: FOREIGN KEY … REFERENCES … ON DELETE CASCADE, and CHECK (…)'],
    tags: ['tsql', 'constraints', 'foreign-key', 'check', 'unique'],
  },
];
