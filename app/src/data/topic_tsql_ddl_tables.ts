/**
 * Topic.TSQL_DDL_TABLES — SQL for Data Engineering (T-SQL).
 * Pillar 2 (DDL & Constraints): CREATE/ALTER/DROP TABLE, SELECT INTO, schemas,
 * temp tables (#t / ##g) and table variables (@t).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_ddl_tables_questions: Question[] = [
  {
    id: 'tsql-ddl-create-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    question: 'What does `CREATE TABLE dbo.DimCustomer (...)` do, and why schema-qualify the name with `dbo.`?',
    options: [
      { id: 'a', text: 'Defines a new persistent table in the `dbo` schema with the given columns and types; qualifying with `dbo.` avoids name ambiguity and is the recommended practice.', isCorrect: true },
      { id: 'b', text: 'Creates a temporary table that is dropped at the end of the session; the `dbo.` prefix is what marks the table as session-scoped.', isCorrect: false },
      { id: 'c', text: 'Inserts a batch of rows into an existing `DimCustomer` table; the `dbo.` prefix chooses which database the rows are written to.', isCorrect: false },
      { id: 'd', text: 'Declares an in-memory table variable for the current batch; the `dbo.` prefix selects the memory pool it is allocated from.', isCorrect: false },
    ],
    explanation: 'CREATE TABLE is DDL — it defines schema, it does not move data. Names resolve as `schema.object`; `dbo` is the default schema. Always two-part-name your objects (`dbo.DimCustomer`) so resolution does not depend on the caller\'s default schema. Temp tables use a `#` prefix and table variables use `@`, not `dbo.`.',
    hints: ['DDL defines structure; DML (INSERT/UPDATE) changes data', 'schema.object — dbo is the default schema'],
    tags: ['tsql', 'ddl', 'create-table', 'schema'],
  },
  {
    id: 'tsql-ddl-create-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement keyword that defines a new table, and the Unicode string type for the product name.',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
___ TABLE dbo.DimProduct (
    ProductKey  INT,
    ProductName ___(100)
);`,
    blanks: ['CREATE', 'NVARCHAR'],
    solution: `CREATE TABLE dbo.DimProduct (
    ProductKey  INT,
    ProductName NVARCHAR(100)
);`,
    explanation: '`CREATE TABLE` defines the table. `NVARCHAR(n)` stores Unicode text (two bytes/char) — use it over `VARCHAR` whenever the data may contain non-ASCII characters, which is the safe default for names in a warehouse.',
    hints: ['The DDL verb that makes a new object', 'N-prefixed VARCHAR = Unicode'],
    tags: ['tsql', 'ddl', 'create-table', 'cloze'],
  },
  {
    id: 'tsql-ddl-create-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a `CREATE TABLE` statement for `dbo.DimCustomer` with these columns: `CustomerKey` (INT), `FullName` (Unicode text up to 100 chars), `Email` (Unicode text up to 255 chars), and `CreatedAt` (a modern date-and-time type).',
    requires: [/CREATE\s+TABLE/i],
    starterCode: `-- CREATE TABLE dbo.DimCustomer ( ... )
`,
    testCases: [
      {
        input: 'CREATE TABLE dbo.DimCustomer',
        expectedOutput: 'Table with CustomerKey INT, FullName NVARCHAR(100), Email NVARCHAR(255), CreatedAt DATETIME2',
        description: 'Defines the customer dimension table',
      },
    ],
    solution: `CREATE TABLE dbo.DimCustomer (
    CustomerKey INT,
    FullName    NVARCHAR(100),
    Email       NVARCHAR(255),
    CreatedAt   DATETIME2
);`,
    tieredHints: {
      apiSignature: 'CREATE TABLE table_name (column_name data_type, ...);',
      skeleton: `CREATE TABLE dbo.DimCustomer (
    CustomerKey ____,
    FullName    ____(100),
    Email       ____(255),
    CreatedAt   ____
);`,
    },
    explanation: 'Each column is `name type`. `NVARCHAR(n)` for Unicode text with a length cap; `DATETIME2` is the modern timestamp type (wider range and higher precision than the legacy `DATETIME`). Keys/constraints come later — this is the bare table definition.',
    hints: ['One `column type` per line, comma-separated', 'NVARCHAR(n) for text, DATETIME2 for timestamps'],
    tags: ['tsql', 'ddl', 'create-table'],
  },
  {
    id: 'tsql-ddl-drop-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    question: 'How does `DROP TABLE dbo.StageOrders` differ from `DELETE FROM dbo.StageOrders`?',
    options: [
      { id: 'a', text: 'DROP TABLE removes the table definition itself, along with all its data - the table no longer exists; DELETE only removes rows and leaves the (now empty) table and its structure intact.', isCorrect: true },
      { id: 'b', text: 'They are equivalent - both remove every row and leave an empty table behind.', isCorrect: false },
      { id: 'c', text: 'DROP TABLE only removes rows matching a WHERE clause; DELETE removes the table structure.', isCorrect: false },
      { id: 'd', text: 'DROP TABLE is DML and can be rolled back automatically; DELETE is DDL and cannot.', isCorrect: false },
    ],
    explanation: '`DROP TABLE` is DDL - it erases the table\'s definition and data entirely, so the object is gone and would need `CREATE TABLE` again to exist. `DELETE` is DML - it removes rows (optionally filtered by WHERE) but the empty table, its columns, and its constraints remain.',
    hints: ['DROP removes the whole object (structure + data)', 'DELETE removes rows, keeps the table'],
    tags: ['tsql', 'ddl', 'drop-table'],
  },
  {
    id: 'tsql-ddl-alter-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    question: 'Which statement correctly adds a new nullable `Phone` column to an existing `dbo.DimCustomer` table?',
    options: [
      { id: 'a', text: 'ALTER TABLE dbo.DimCustomer ADD Phone NVARCHAR(20) NULL;', isCorrect: true },
      { id: 'b', text: 'ALTER TABLE dbo.DimCustomer ADD COLUMN Phone NVARCHAR(20) NULL;', isCorrect: false },
      { id: 'c', text: 'ALTER TABLE dbo.DimCustomer MODIFY Phone NVARCHAR(20) NULL;', isCorrect: false },
      { id: 'd', text: 'UPDATE TABLE dbo.DimCustomer ADD Phone NVARCHAR(20) NULL;', isCorrect: false },
    ],
    explanation: 'In T-SQL the syntax is `ALTER TABLE … ADD <col> <type>` — note there is NO `COLUMN` keyword when adding (unlike some other dialects). `MODIFY` is MySQL/Oracle; T-SQL changes a type with `ALTER COLUMN`. To remove a column you DO write `DROP COLUMN`. Adding a nullable column is a metadata-only, fast operation.',
    hints: ['T-SQL ADD has no COLUMN keyword (but DROP COLUMN does)', 'changing a type is ALTER COLUMN, not MODIFY'],
    tags: ['tsql', 'ddl', 'alter-table'],
  },
  {
    id: 'tsql-ddl-alter-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two ALTER TABLE sub-clauses: one widens an existing column\'s type, the other removes a column.',
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- widen the Email column
ALTER TABLE dbo.DimCustomer ___ COLUMN Email NVARCHAR(320);
-- remove the Phone column
ALTER TABLE dbo.DimCustomer DROP ___ Phone;`,
    blanks: ['ALTER', 'COLUMN'],
    solution: `-- widen the Email column
ALTER TABLE dbo.DimCustomer ALTER COLUMN Email NVARCHAR(320);
-- remove the Phone column
ALTER TABLE dbo.DimCustomer DROP COLUMN Phone;`,
    explanation: 'Changing a column\'s type is `ALTER TABLE … ALTER COLUMN`; dropping one is `ALTER TABLE … DROP COLUMN`. The asymmetry is a classic gotcha: adding takes no `COLUMN` keyword, but altering and dropping both do.',
    hints: ['Change a type → ALTER COLUMN', 'Remove a column → DROP COLUMN'],
    tags: ['tsql', 'ddl', 'alter-table', 'cloze'],
  },
  {
    id: 'tsql-ddl-temp-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    question: 'In T-SQL, how do `#tmp`, `@tbl`, and `##tmp` differ?',
    options: [
      { id: 'a', text: '`#tmp` is a session-scoped temp table in tempdb (visible to nested procs in that session); `@tbl` is a table variable scoped to the batch/proc; `##tmp` is a global temp table visible to all sessions until the creator disconnects.', isCorrect: true },
      { id: 'b', text: '`#tmp` is global to every session; `@tbl` is written to the user database; `##tmp` is an in-memory variable that vanishes after the current statement finishes.', isCorrect: false },
      { id: 'c', text: 'All three are identical aliases for tempdb tables; the prefix is purely stylistic and chosen by team convention.', isCorrect: false },
      { id: 'd', text: '`#tmp` and `##tmp` are permanent staging tables in `dbo`; `@tbl` is the only one that lives in tempdb and is cleaned up automatically.', isCorrect: false },
    ],
    explanation: 'All three live in tempdb, but scope differs. `#local` temp tables last for the session and are seen by called procedures; `@table` variables are scoped to the batch/procedure and don\'t participate in transactions or get statistics (good for small sets); `##global` temp tables are shared across sessions and dropped when the creating session ends and no one else references them. ETL staging usually uses `#temp`.',
    hints: ['# = session, @ = batch/proc, ## = global', 'all three live in tempdb'],
    tags: ['tsql', 'ddl', 'temp-tables', 'table-variable'],
  },
  {
    id: 'tsql-ddl-selectinto-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that materializes the query result into a brand-new staging temp table in a single statement.',
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
SELECT CustomerKey, FullName
___ #StageCustomer
FROM dbo.DimCustomer
WHERE IsActive = 1;`,
    blanks: ['INTO'],
    solution: `SELECT CustomerKey, FullName
INTO #StageCustomer
FROM dbo.DimCustomer
WHERE IsActive = 1;`,
    explanation: '`SELECT … INTO <new_table>` creates the target table on the fly from the result set\'s column names and types, then inserts the rows — no prior `CREATE TABLE` needed. It is a staging workhorse, but note the new table inherits no indexes or constraints from the source.',
    hints: ['SELECT … <keyword> #NewTable FROM …', 'creates + populates in one shot'],
    tags: ['tsql', 'ddl', 'select-into', 'staging', 'cloze'],
  },
  {
    id: 'tsql-ddl-selectinto-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DDL_TABLES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Using a single `SELECT … INTO` statement, build a staging temp table `#StageOrders` holding `OrderId`, `CustomerKey`, and `Amount` for every row in `dbo.FactOrders` with `OrderDate` on or after 2026-01-01.',
    requires: [/SELECT/i, /INTO/i],
    starterCode: `-- SELECT ... INTO #StageOrders FROM dbo.FactOrders ...
`,
    testCases: [
      {
        input: "SELECT ... INTO #StageOrders FROM dbo.FactOrders WHERE OrderDate >= '2026-01-01'",
        expectedOutput: 'A temp table #StageOrders with OrderId, CustomerKey, Amount for recent orders',
        description: 'Creates and fills a staging temp table in one statement',
      },
    ],
    solution: `SELECT OrderId, CustomerKey, Amount
INTO #StageOrders
FROM dbo.FactOrders
WHERE OrderDate >= '2026-01-01';`,
    tieredHints: {
      apiSignature: 'SELECT column_list INTO new_table FROM source_table WHERE condition;',
      skeleton: `SELECT ____, ____, ____
____ #StageOrders
FROM ____
WHERE OrderDate ____ ____;`,
    },
    explanation: '`SELECT … INTO #StageOrders` creates the temp table from the projected columns and loads the filtered rows in one pass — the common first step of an ELT load before transforming and merging into the target.',
    hints: ['The INTO clause goes between SELECT list and FROM', 'Filter with WHERE OrderDate >= the date literal'],
    tags: ['tsql', 'ddl', 'select-into', 'staging'],
  },
];
