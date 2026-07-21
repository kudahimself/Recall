/**
 * Topic.TSQL_DML — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): basic DML — INSERT...VALUES (single &
 * multi-row), UPDATE...SET...WHERE, DELETE...WHERE, TRUNCATE vs DELETE,
 * UPDATE/DELETE...FROM...JOIN. Placed last in the pillar so it can build on
 * JOINS and SUBQUERIES_CTE, taught earlier in this same pillar.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_dml_questions: Question[] = [
  {
    id: 'tsql-dml-insert-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    question: "What does `INSERT INTO dbo.DimProduct (ProductName, Price) VALUES ('Widget', 9.99)` do?",
    options: [
      { id: 'a', text: "Adds one new row to dbo.DimProduct with ProductName = 'Widget' and Price = 9.99; any column left out of the list gets its default or NULL.", isCorrect: true },
      { id: 'b', text: "Overwrites every existing row's ProductName and Price with these values.", isCorrect: false },
      { id: 'c', text: 'Creates the dbo.DimProduct table if it does not already exist.', isCorrect: false },
      { id: 'd', text: 'Only validates the values without changing any data.', isCorrect: false },
    ],
    explanation: '`INSERT INTO table (cols) VALUES (...)` adds exactly one new row with the given values in the listed columns. It never touches existing rows and never creates the table - the target must already exist.',
    hints: ['Adds a new row, does not touch existing ones', 'Table must already exist'],
    tags: ['tsql', 'dml', 'insert'],
  },
  {
    id: 'tsql-dml-insert-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two-word statement opener that adds one literal row.',
    template: `___ ___ dbo.DimProduct (ProductName, Price)
VALUES ('Gadget', 14.50);`,
    blanks: ['INSERT', 'INTO'],
    solution: `INSERT INTO dbo.DimProduct (ProductName, Price)
VALUES ('Gadget', 14.50);`,
    explanation: '`INSERT INTO table (cols) VALUES (...)` is the basic single-row insert. Listing the target columns explicitly means the VALUES list only needs to match that order, not the table\'s physical column order.',
    hints: ['Two-word statement opener', 'Literal values go after VALUES'],
    tags: ['tsql', 'dml', 'insert', 'cloze'],
  },
  {
    id: 'tsql-dml-update-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement and clause that change one product\'s Price.',
    template: `___ dbo.DimProduct
___ Price = 12.99
WHERE ProductKey = 101;`,
    blanks: ['UPDATE', 'SET'],
    solution: `UPDATE dbo.DimProduct
SET Price = 12.99
WHERE ProductKey = 101;`,
    explanation: '`UPDATE table SET col = value WHERE filter` changes matching rows in place. Only the row(s) satisfying WHERE are touched - every other row is untouched.',
    hints: ['Statement that modifies existing rows', 'Clause that names the column and its new value'],
    tags: ['tsql', 'dml', 'update', 'cloze'],
  },
  {
    id: 'tsql-dml-delete-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that removes a single product row.',
    template: `___ FROM dbo.DimProduct
WHERE ProductKey = 101;`,
    blanks: ['DELETE'],
    solution: `DELETE FROM dbo.DimProduct
WHERE ProductKey = 101;`,
    explanation: '`DELETE FROM table WHERE filter` removes only the rows matching the filter, leaving the table (and every other row) intact.',
    hints: ['The row-removal statement'],
    tags: ['tsql', 'dml', 'delete', 'cloze'],
  },
  {
    id: 'tsql-dml-nowhere-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    question: 'What happens if you run `DELETE FROM dbo.DimProduct;` with no WHERE clause?',
    options: [
      { id: 'a', text: 'Every row in the table is deleted - WHERE is what limits DML to specific rows; omit it and the whole table empties. The same danger applies to a WHERE-less UPDATE.', isCorrect: true },
      { id: 'b', text: 'Nothing happens; DELETE is rejected unless a WHERE clause is present.', isCorrect: false },
      { id: 'c', text: 'Only the first row is deleted, since DELETE defaults to affecting one row.', isCorrect: false },
      { id: 'd', text: 'The table itself is dropped along with its structure.', isCorrect: false },
    ],
    explanation: 'WHERE is optional, not required - a WHERE-less DELETE (or UPDATE) matches every row in the table. The table and its structure survive (unlike DROP TABLE); it is simply left empty (or, for UPDATE, every row is overwritten). Always double-check the WHERE clause before running DML against a real table.',
    hints: ['WHERE is optional - no filter means every row matches', 'The table itself survives; only the rows are gone/changed'],
    tags: ['tsql', 'dml', 'delete', 'update', 'where'],
  },
  {
    id: 'tsql-dml-update-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does the final SELECT output?',
    code: `CREATE TABLE #t (id INT, amt INT);
INSERT INTO #t VALUES (1, 100), (2, 200);
UPDATE #t SET amt = amt + 10 WHERE id = 1;
SELECT amt FROM #t ORDER BY id;`,
    expectedOutput: `110
200`,
    explanation: 'Only the row with `id = 1` matches the WHERE clause, so its `amt` becomes 100 + 10 = 110. The row with `id = 2` is untouched and keeps its original 200.',
    hints: ['Only the matching row changes', 'id = 1 → 100 + 10; id = 2 unaffected'],
    tags: ['tsql', 'dml', 'update', 'predict'],
  },
  {
    id: 'tsql-dml-delete-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does the final SELECT output (one value per line)?',
    code: `CREATE TABLE #t (id INT);
INSERT INTO #t VALUES (1), (2), (3);
DELETE FROM #t WHERE id = 2;
SELECT id FROM #t ORDER BY id;`,
    expectedOutput: `1
3`,
    explanation: 'The DELETE removes only the row where `id = 2`, leaving `1` and `3` behind.',
    hints: ['Only the matching row is removed'],
    tags: ['tsql', 'dml', 'delete', 'predict'],
  },
  {
    id: 'tsql-dml-insert-multirow-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the separator that lets one INSERT add two rows at once.',
    template: `INSERT INTO dbo.DimProduct (ProductName, Price)
VALUES ('Widget', 9.99)___
       ('Gadget', 14.50);`,
    blanks: [','],
    solution: `INSERT INTO dbo.DimProduct (ProductName, Price)
VALUES ('Widget', 9.99),
       ('Gadget', 14.50);`,
    explanation: 'A single INSERT can supply several `VALUES` tuples separated by commas, inserting multiple rows in one statement - cheaper than one INSERT per row.',
    hints: ['Row tuples are comma-separated'],
    tags: ['tsql', 'dml', 'insert', 'multi-row', 'cloze'],
  },
  {
    id: 'tsql-dml-update-expr-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the operator that raises every Book's price by 10% using the column's own current value.",
    template: `UPDATE dbo.DimProduct
SET Price = Price ___ 1.1
WHERE Category = 'Books';`,
    blanks: ['*'],
    solution: `UPDATE dbo.DimProduct
SET Price = Price * 1.1
WHERE Category = 'Books';`,
    explanation: 'The new-value expression in SET can reference the column\'s own current value - `Price * 1.1` reads each matching row\'s existing Price before overwriting it, raising it by 10%.',
    hints: ['The new value can reference the column\'s own current value'],
    tags: ['tsql', 'dml', 'update', 'self-reference', 'cloze'],
  },
  {
    id: 'tsql-dml-truncate-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    question: 'How does `TRUNCATE TABLE dbo.StageOrders` differ from `DELETE FROM dbo.StageOrders`?',
    options: [
      { id: 'a', text: 'TRUNCATE deallocates whole data pages at once (minimally logged, resets IDENTITY) and cannot take a WHERE clause; DELETE removes rows individually (fully logged, WHERE-capable) and does not reset IDENTITY.', isCorrect: true },
      { id: 'b', text: 'They are identical in every respect except spelling.', isCorrect: false },
      { id: 'c', text: 'TRUNCATE removes the table structure permanently; DELETE only empties rows.', isCorrect: false },
      { id: 'd', text: 'DELETE always resets the IDENTITY seed; TRUNCATE never does.', isCorrect: false },
    ],
    explanation: 'Both empty a table of rows, but differently: TRUNCATE is a fast, minimally-logged, all-or-nothing operation that also resets IDENTITY, and it cannot filter with WHERE. DELETE is ordinary row-by-row DML - slower on huge tables, but filterable and fully logged/rollback-friendly. Neither drops the table itself.',
    hints: ['TRUNCATE = fast, all rows, resets IDENTITY, no WHERE', 'DELETE = row-by-row, WHERE-capable, fully logged'],
    tags: ['tsql', 'dml', 'truncate', 'delete'],
  },
  {
    id: 'tsql-dml-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'In `dbo.DimCustomer` (CustomerKey, Email, IsActive), set `IsActive` to 0 for the customer with `CustomerKey = 42`.',
    starterCode: `-- UPDATE dbo.DimCustomer SET ... WHERE ...
`,
    testCases: [
      {
        input: 'UPDATE dbo.DimCustomer SET IsActive = 0 WHERE CustomerKey = 42',
        expectedOutput: 'Customer 42 marked inactive',
        description: 'Single-row UPDATE',
      },
    ],
    solution: `UPDATE dbo.DimCustomer
SET IsActive = 0
WHERE CustomerKey = 42;`,
    tieredHints: {
      apiSignature: 'UPDATE table_name SET column = value WHERE condition;',
      skeleton: `UPDATE dbo.DimCustomer
SET ____ = ____
____ CustomerKey ____ 42;`,
    },
    explanation: 'The WHERE clause narrows the update to exactly one customer; `SET IsActive = 0` is the change applied to that row only.',
    hints: ['SET IsActive = 0', 'WHERE CustomerKey = 42'],
    tags: ['tsql', 'dml', 'update'],
  },
  {
    id: 'tsql-dml-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Remove every row from `stg.Customer` (IsActive) where `IsActive = 0` (stale staging rows already processed).',
    starterCode: `-- DELETE FROM stg.Customer WHERE ...
`,
    testCases: [
      {
        input: 'DELETE FROM stg.Customer WHERE IsActive = 0',
        expectedOutput: 'Inactive staging rows removed',
        description: 'Filtered DELETE',
      },
    ],
    solution: `DELETE FROM stg.Customer
WHERE IsActive = 0;`,
    tieredHints: {
      apiSignature: 'DELETE FROM table_name WHERE condition;',
      skeleton: `DELETE ____ stg.Customer
____ IsActive ____ 0;`,
    },
    explanation: 'The WHERE clause limits the DELETE to rows flagged inactive, leaving active staging rows untouched.',
    hints: ['DELETE FROM stg.Customer', 'WHERE IsActive = 0'],
    tags: ['tsql', 'dml', 'delete'],
  },
  {
    id: 'tsql-dml-delete-subquery-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the predicate that deletes staging rows whose CustomerId no longer exists in the dimension.',
    template: `DELETE FROM stg.Customer
WHERE CustomerId ___ (
    SELECT CustomerId FROM dbo.DimCustomer
);`,
    blanks: ['NOT IN'],
    solution: `DELETE FROM stg.Customer
WHERE CustomerId NOT IN (
    SELECT CustomerId FROM dbo.DimCustomer
);`,
    explanation: 'DELETE can filter using a subquery exactly like SELECT: `NOT IN (subquery)` removes staging rows whose key has no match in the dimension. (If the subquery could return a NULL, `NOT EXISTS` with a correlated subquery is the safer choice - NOT IN silently matches nothing once any NULL is in the list.)',
    hints: ['A subquery can filter a DELETE just like a SELECT', 'Rows whose key is absent from the dimension'],
    tags: ['tsql', 'dml', 'delete', 'subquery', 'cloze'],
  },
  {
    id: 'tsql-dml-updatejoin-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that lets UPDATE pull its new value from a joined table, and the join predicate.',
    template: `UPDATE tgt
    SET tgt.City = src.City
___ dbo.DimCustomer AS tgt
    JOIN stg.Customer AS src ___ src.CustomerId = tgt.CustomerId;`,
    blanks: ['FROM', 'ON'],
    solution: `UPDATE tgt
    SET tgt.City = src.City
FROM dbo.DimCustomer AS tgt
    JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId;`,
    explanation: 'T-SQL\'s `UPDATE ... FROM ... JOIN` lets the SET clause read values from a second, joined table: `tgt` is the table being updated, and `src` (matched by the join predicate) supplies the new value. This is the pattern behind every staging-to-target dimension refresh.',
    hints: ['The clause that introduces the joined tables', 'The join predicate keyword'],
    tags: ['tsql', 'dml', 'update', 'join', 'cloze'],
  },
  {
    id: 'tsql-dml-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Update `dbo.DimProduct` (ProductKey, ProductName) so `ProductName` matches the latest value from `stg.Product` (ProductKey, ProductName), for every row where the two currently differ. Use UPDATE...FROM...JOIN.',
    starterCode: `-- dbo.DimProduct(ProductKey, ProductName), stg.Product(ProductKey, ProductName)
-- Update DimProduct.ProductName to match stg.Product.ProductName where they differ using UPDATE...FROM...JOIN
`,
    testCases: [
      {
        input: 'UPDATE tgt SET tgt.ProductName = src.ProductName FROM dbo.DimProduct tgt JOIN stg.Product src ON ProductKey WHERE names differ',
        expectedOutput: 'DimProduct names refreshed from staging where changed',
        description: 'Join-based UPDATE with a change filter',
      },
    ],
    solution: `UPDATE tgt
    SET tgt.ProductName = src.ProductName
FROM dbo.DimProduct AS tgt
JOIN stg.Product AS src ON src.ProductKey = tgt.ProductKey
WHERE tgt.ProductName <> src.ProductName;`,
    tieredHints: {
      apiSignature: 'UPDATE alias SET alias.col = src.col FROM tbl AS alias JOIN src_tbl AS src ON join_cond WHERE diff_cond;',
      skeleton: `UPDATE tgt
    ____ tgt.ProductName = src.ProductName
____ dbo.DimProduct AS tgt
____ stg.Product AS src ____ ____ = ____
WHERE tgt.ProductName ____ src.ProductName;`,
    },
    explanation: 'The FROM/JOIN brings each target row together with its staging counterpart on `ProductKey`; the WHERE clause limits the write to rows that actually changed, avoiding pointless updates to rows already in sync.',
    hints: ['FROM dbo.DimProduct AS tgt JOIN stg.Product AS src ON ProductKey', 'WHERE tgt.ProductName <> src.ProductName limits it to real changes'],
    tags: ['tsql', 'dml', 'update', 'join'],
  },
  {
    id: 'tsql-dml-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DML,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Delete every row from `dbo.FactOrders` (ProductKey) whose `ProductKey` belongs to a product in `dbo.DimProduct` (ProductKey, Discontinued) that has been discontinued (`Discontinued = 1`). Use DELETE...FROM...JOIN.',
    starterCode: `-- DELETE f FROM dbo.FactOrders AS f JOIN dbo.DimProduct AS p ON ... WHERE p.Discontinued = 1;
`,
    testCases: [
      {
        input: 'DELETE f FROM dbo.FactOrders f JOIN dbo.DimProduct p ON ProductKey WHERE p.Discontinued = 1',
        expectedOutput: 'Fact rows for discontinued products removed',
        description: 'Join-based DELETE',
      },
    ],
    solution: `DELETE f
FROM dbo.FactOrders AS f
JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
WHERE p.Discontinued = 1;`,
    tieredHints: {
      apiSignature: 'DELETE alias FROM tbl AS alias JOIN dim_tbl AS dim ON join_cond WHERE filter_cond;',
      skeleton: `DELETE f
____ dbo.FactOrders AS f
____ dbo.DimProduct AS p ____ ____ = ____
WHERE p.Discontinued ____ 1;`,
    },
    explanation: 'T-SQL supports `DELETE <alias> FROM <table> AS alias JOIN ...` - the alias right after DELETE tells the engine which side\'s rows to remove (here `f`, the fact rows), while the join brings in the dimension\'s `Discontinued` flag to filter by.',
    hints: ['DELETE f FROM dbo.FactOrders AS f JOIN dbo.DimProduct AS p ON ProductKey', 'WHERE p.Discontinued = 1'],
    tags: ['tsql', 'dml', 'delete', 'join'],
  },
];
