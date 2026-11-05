/**
 * Topic.TSQL_INSERT — SQL for Data Engineering (T-SQL).
 * Pillar 6 (ELT & Transformation): INSERT, INSERT … SELECT, SELECT … INTO,
 * the OUTPUT clause.
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

export const tsql_insert_questions: Question[] = [
  {
    id: 'tsql-insert-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    question: 'In an ELT pipeline, what does `INSERT INTO … SELECT …` let you do that a plain `INSERT … VALUES` cannot?',
    options: [
      { id: 'a', text: 'Load every row a query returns in one set-based statement, such as staging rows moving into a target table.', isCorrect: true },
      { id: 'b', text: 'Pair source and target columns by name, so the target column list can be left out.', isCorrect: false },
      { id: 'c', text: 'Create the target table first when it does not exist, then load the rows into it.', isCorrect: false },
      { id: 'd', text: 'Skip rows the target already holds, so running the same load twice is safe.', isCorrect: false },
    ],
    explanation: '`INSERT … SELECT` is set-based: it loads the entire result of a query in one statement, which is how you move and transform data from staging into a target. `INSERT … VALUES` only supplies literal rows. Columns pair by position, not by name, so list the target columns. The target must already exist (creating and filling a table at once is `SELECT … INTO`), and nothing checks for rows that are already there, so a rerun adds them again.',
    hints: ['Loads rows from a query, set-based', 'The staging → target workhorse'],
    tags: ['tsql', 'insert', 'insert-select'],
  },
  {
    id: 'tsql-insert-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    question: 'How does `SELECT … INTO NewTable` differ from `INSERT INTO ExistingTable … SELECT`?',
    options: [
      { id: 'a', text: '`SELECT … INTO` creates a new table from the query result, while `INSERT … SELECT` loads into a table that must already exist.', isCorrect: true },
      { id: 'b', text: '`SELECT … INTO` copies the source table\'s keys and constraints to the new table, while `INSERT … SELECT` copies only the rows.', isCorrect: false },
      { id: 'c', text: '`SELECT … INTO` loads into a table that must already exist, while `INSERT … SELECT` creates the table on the fly.', isCorrect: false },
      { id: 'd', text: '`SELECT … INTO` adds only the rows the table lacks, while `INSERT … SELECT` overwrites the rows it already has.', isCorrect: false },
    ],
    explanation: '`SELECT … INTO NewTable FROM …` creates the table on the fly and copies the rows, which suits scratch or staging tables, but it does NOT copy keys, constraints or indexes. `INSERT … SELECT` needs a target that already exists with its constraints in place, so it is the right choice for loading a real warehouse table. Neither one skips or overwrites existing rows: `SELECT … INTO` fails if the table exists, and `INSERT … SELECT` simply appends.',
    hints: ['INTO = create new table from the query', 'INSERT…SELECT = target must already exist'],
    tags: ['tsql', 'insert', 'select-into'],
  },
  {
    id: 'tsql-insert-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords to copy the active customers from staging into the dimension: the word after INSERT, and the word that starts the query supplying the rows.',
    tables: [
      { name: 'dbo.DimCustomer', columns: ['CustomerId', 'FullName'], rows: [['C-002', 'Lars Holm']] },
      {
        name: 'stg.Customer',
        columns: ['CustomerId', 'FullName', 'IsActive'],
        rows: [['C-001', 'Ingrid Berg', 1], ['C-003', 'Sofia Lind', 0], ['C-004', 'Amara Okafor', 1]],
      },
    ],
    template: `INSERT ___ dbo.DimCustomer (CustomerId, FullName)
___ CustomerId, FullName
FROM stg.Customer
WHERE IsActive = 1;`,
    blanks: ['INTO', 'SELECT'],
    solution: `INSERT INTO dbo.DimCustomer (CustomerId, FullName)
SELECT CustomerId, FullName
FROM stg.Customer
WHERE IsActive = 1;`,
    explanation: '`INSERT INTO target (cols) SELECT … FROM source` loads the query result into an existing table: here customers C-001 and C-004 are added next to C-002, and inactive C-003 stays out. Always list the target columns explicitly so the load is insulated from column-order changes on either side.',
    hints: ['INSERT INTO target (cols)', 'Source rows come from a SELECT'],
    tags: ['tsql', 'insert', 'insert-select', 'cloze'],
  },
  {
    id: 'tsql-insert-output-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that sends the ProductKey the database generates for each new row into the table variable @NewKeys.',
    tables: [
      { name: 'dbo.DimProduct', columns: ['ProductKey', 'ProductCode', 'ProductName'], rows: [[101, 'BK-1001-PB', 'The Great Novel']] },
      { name: 'stg.Product', columns: ['ProductCode', 'ProductName'], rows: [['TY-2001-ST', 'Wooden Train'], ['GD-3001-XL', 'Desk Lamp']] },
    ],
    template: `-- ProductKey is an IDENTITY column: the database generates it
DECLARE @NewKeys TABLE (ProductKey INT);
INSERT INTO dbo.DimProduct (ProductCode, ProductName)
___ inserted.ProductKey INTO @NewKeys (ProductKey)
SELECT ProductCode, ProductName
FROM stg.Product;`,
    blanks: ['OUTPUT'],
    solution: `-- ProductKey is an IDENTITY column: the database generates it
DECLARE @NewKeys TABLE (ProductKey INT);
INSERT INTO dbo.DimProduct (ProductCode, ProductName)
OUTPUT inserted.ProductKey INTO @NewKeys (ProductKey)
SELECT ProductCode, ProductName
FROM stg.Product;`,
    explanation: 'The `OUTPUT` clause exposes the `inserted` pseudo-table (and `deleted` for updates and deletes), so the statement can hand back the generated surrogate keys as it writes them. Here @NewKeys ends up holding the two new keys, 102 and 103, which a later load step can use. It goes between the column list and the SELECT.',
    hints: ['The clause exposing the inserted pseudo-table', 'OUTPUT inserted.<col> INTO …'],
    tags: ['tsql', 'insert', 'output-clause', 'cloze'],
  },
  {
    id: 'tsql-insert-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Load `dbo.FactSales (CustomerKey, ProductKey, Amount)` from `stg.Sales (CustomerId, ProductCode, Amount)`, resolving the natural keys to surrogate keys by joining `dbo.DimCustomer (CustomerKey, CustomerId)` and `dbo.DimProduct (ProductKey, ProductCode)`. Use INSERT … SELECT, with the aliases `s` for staging, `c` for the customer dimension and `p` for the product dimension.',
    tables: [
      sampleTable('dbo.FactSales', ['CustomerKey', 'ProductKey', 'Amount']),
      sampleTable('dbo.DimCustomer', ['CustomerKey', 'CustomerId']),
      sampleTable('dbo.DimProduct', ['ProductKey', 'ProductCode']),
      {
        name: 'stg.Sales',
        columns: ['CustomerId', 'ProductCode', 'Amount'],
        rows: [['C-001', 'BK-1001-PB', 24.99], ['C-004', 'TY-2001-ST', 39.5]],
      },
    ],
    starterCode: `-- dbo.FactSales (CustomerKey, ProductKey, Amount)
-- stg.Sales (CustomerId, ProductCode, Amount)
`,
    testCases: [
      {
        input: 'INSERT INTO FactSales SELECT surrogate keys by joining staging to both dimensions',
        expectedOutput: 'Fact loaded with surrogate keys resolved from natural keys',
        description: 'Surrogate-key lookup load via INSERT…SELECT',
      },
    ],
    solution: `INSERT INTO dbo.FactSales (CustomerKey, ProductKey, Amount)
SELECT c.CustomerKey, p.ProductKey, s.Amount
FROM stg.Sales AS s
JOIN dbo.DimCustomer AS c ON c.CustomerId = s.CustomerId
JOIN dbo.DimProduct AS p ON p.ProductCode = s.ProductCode;`,
    tieredHints: {
      apiSignature: 'JOIN table AS alias ON alias.col = other_alias.col',
      skeleton: `INSERT INTO dbo.FactSales (____, ____, Amount)
SELECT c.____, p.____, s.Amount
FROM stg.Sales AS s
JOIN dbo.DimCustomer AS c ON c.____ = s.____
JOIN dbo.DimProduct AS p ON p.____ = s.____;`,
    },
    explanation: 'This is the canonical fact load: the staging rows carry natural keys (`CustomerId`, `ProductCode`), so you join to each dimension to translate them into the warehouse surrogate keys (`CustomerKey`, `ProductKey`) before inserting. Here C-001 becomes customer key 1 and BK-1001-PB becomes product key 101. The fact stores surrogates, never the source business keys.',
    hints: ['JOIN staging to each dimension on the natural key', 'SELECT the surrogate keys + measure into the fact'],
    requires: [/INSERT\s+INTO/i, /JOIN/i],
    tags: ['tsql', 'insert', 'insert-select', 'surrogate-keys'],
  },
  {
    id: 'tsql-insert-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_INSERT,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The load copies active staging products into a dimension that already holds one product. What does the final SELECT return? Write one row per line in the ORDER BY order, as ProductCode and Copies separated by a comma.',
    tables: [
      { name: 'dbo.DimProduct', columns: ['ProductCode', 'ProductName'], rows: [['P-10', 'Helmet']] },
      {
        name: 'stg.Product',
        columns: ['ProductCode', 'ProductName', 'IsActive'],
        rows: [['P-10', 'Helmet', 1], ['P-20', 'Lock', 1], ['P-30', 'Pump', 0]],
      },
    ],
    code: `INSERT INTO dbo.DimProduct (ProductCode, ProductName)
SELECT ProductCode, ProductName
FROM stg.Product
WHERE IsActive = 1;
SELECT ProductCode, COUNT(*) AS Copies
FROM dbo.DimProduct
GROUP BY ProductCode
ORDER BY ProductCode;`,
    expectedOutput: `P-10, 2
P-20, 1`,
    explanation: 'INSERT ... SELECT appends every row the query returns: the two active products, P-10 and P-20, while the WHERE leaves out the inactive P-30. It never looks at what the target already holds, so P-10 is now stored twice. Running a plain INSERT ... SELECT again would add another copy of each; a load that must be safe to repeat filters with NOT EXISTS or uses MERGE.',
    hints: ['Which staging rows pass the WHERE?', 'Does INSERT check whether P-10 is already in the target?'],
    tags: ['tsql', 'insert', 'insert-select', 'duplicates', 'predict'],
  },
];
