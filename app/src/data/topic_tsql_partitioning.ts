/**
 * Topic.TSQL_PARTITIONING - SQL for Data Engineering (T-SQL).
 * Pillar 7 (Performance): partition functions/schemes, partition elimination,
 * partition switching (fast load/delete).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_partitioning_questions: Question[] = [
  {
    id: 'tsql-part-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    question: 'What is "partition elimination" and why does it speed up warehouse queries?',
    options: [
      { id: 'a', text: 'A query that filters on the partitioning column reads only the partitions that can hold matches and skips the rest, so a date-partitioned fact needs far less I/O.', isCorrect: true },
      { id: 'b', text: 'A query that filters on any column reads only the partitions that can hold matches and skips the rest, because the engine tracks every column per partition.', isCorrect: false },
      { id: 'c', text: 'A query that filters on the partitioning column wrapped in a function, such as `YEAR(OrderDate)`, still reads only the matching partitions.', isCorrect: false },
      { id: 'd', text: 'A query that filters on the partitioning column reads every partition but returns only the matching rows, which is what makes it faster.', isCorrect: false },
    ],
    explanation: 'If a fact is partitioned by month and a query filters `WHERE OrderDate >= \'2026-01-01\'`, the optimizer can touch only the matching monthly partitions and ignore the others. On a multi-billion-row fact that turns a full scan into reading a small slice. It needs the partitioning column in the filter, bare, as the lesson\'s pitfall says.',
    hints: ['Filter on the partition column and the other partitions are skipped', 'A big I/O saving on large facts'],
    tags: ['tsql', 'partitioning', 'partition-elimination'],
  },
  {
    id: 'tsql-part-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    question: 'Why is partition SWITCHING the standard way to load or purge a large fact partition?',
    options: [
      { id: 'a', text: 'It changes only metadata, so a whole partition moves in or out almost instantly, with none of the row-by-row logging and locking of an INSERT or DELETE.', isCorrect: true },
      { id: 'b', text: 'It bulk-copies the rows into the partition in minimal-logged batches, so it takes time in proportion to the rows but avoids most of the logging.', isCorrect: false },
      { id: 'c', text: 'It changes only metadata, but the partitioned table is locked for as long as a load of that size would take, so it is only quicker for small loads.', isCorrect: false },
      { id: 'd', text: 'It changes only metadata, but every row in the partition is checked against the table\'s constraints one by one as it moves in.', isCorrect: false },
    ],
    explanation: 'SWITCH reassigns a whole partition between a staging table and the partitioned table by changing metadata pointers - near-instant and minimally logged, regardless of row count. Loading a month = build it in a staging table, then SWITCH it in; purging = SWITCH the old partition out and drop the staging table. Both avoid massive DELETE/INSERT. The time it takes does not depend on how many rows move.',
    hints: ['A metadata-only swap of a whole partition', 'Avoids row-by-row DELETE/INSERT and the huge logging'],
    tags: ['tsql', 'partitioning', 'partition-switching'],
  },
  {
    id: 'tsql-part-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    question: 'For partition SWITCH to succeed, what must be true of the staging (source) table?',
    options: [
      { id: 'a', text: 'It must match the target\'s columns and indexes, sit on the same filegroup, and carry a CHECK constraint proving every row belongs in that partition\'s range.', isCorrect: true },
      { id: 'b', text: 'It must match the target\'s columns and indexes and sit on the same filegroup; the engine reads the rows and moves them to the right partition itself.', isCorrect: false },
      { id: 'c', text: 'It must match the target\'s columns and carry a CHECK constraint, but it may sit on any filegroup because only metadata moves.', isCorrect: false },
      { id: 'd', text: 'It must carry a CHECK constraint proving its rows fit, but its columns and indexes can differ because the rows are copied across.', isCorrect: false },
    ],
    explanation: 'Because SWITCH is metadata-only, SQL Server enforces that the data already physically qualifies: matching columns/indexes, same filegroup, and a CHECK constraint proving every staging row belongs in the target partition\'s boundaries. Without the constraint the engine can\'t trust the rows fit, and the SWITCH is rejected. Nothing is copied and nothing is re-sorted, which is why each of the three has to hold already.',
    hints: ['Matching columns and indexes, and the same filegroup', 'A CHECK constraint proving the rows fit the partition range'],
    tags: ['tsql', 'partitioning', 'partition-switching', 'check-constraint'],
  },
  {
    id: 'tsql-part-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords to define a monthly partition function on a date, where a boundary date such as 2026-02-01 belongs to the partition on its right, so it is the first day of the February partition.',
    template: `CREATE PARTITION ___ pf_Month (DATE)
AS RANGE ___ FOR VALUES ('2026-01-01', '2026-02-01', '2026-03-01');`,
    blanks: ['FUNCTION', 'RIGHT'],
    solution: `CREATE PARTITION FUNCTION pf_Month (DATE)
AS RANGE RIGHT FOR VALUES ('2026-01-01', '2026-02-01', '2026-03-01');`,
    explanation: 'A `PARTITION FUNCTION` maps a column\'s values to partition numbers via boundary values. `RANGE RIGHT` puts each boundary value into the partition to its right (so 2026-02-01 starts the February partition), the natural choice for date partitioning. A `PARTITION SCHEME` then maps those partitions to filegroups.',
    hints: ['CREATE PARTITION FUNCTION', 'Boundary belongs to the right partition → RANGE RIGHT'],
    tags: ['tsql', 'partitioning', 'partition-function', 'cloze'],
  },
  {
    id: 'tsql-part-scheme-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the kind of object that maps the partitions of the function pf_Month onto physical filegroups.',
    template: `CREATE PARTITION ___ ps_Month
AS PARTITION pf_Month ALL TO ([PRIMARY]);`,
    blanks: ['SCHEME'],
    solution: `CREATE PARTITION SCHEME ps_Month
AS PARTITION pf_Month ALL TO ([PRIMARY]);`,
    explanation: 'A `PARTITION FUNCTION` defines the boundary logic (which value goes in which partition number); a `PARTITION SCHEME` then maps those partition numbers onto physical filegroups - here `ALL TO ([PRIMARY])` puts every partition on the same filegroup, the common case unless partitions are deliberately spread across storage tiers. A table is finally built with `ON ps_Month(<column>)` to use it.',
    hints: ['Comes after the function, maps partitions to filegroups', 'ALL TO (...) puts every partition on one filegroup'],
    tags: ['tsql', 'partitioning', 'partition-scheme', 'cloze'],
  },
  {
    id: 'tsql-part-switch-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the two words so the statement moves all of the staging table's rows into partition 2 of dbo.FactSales, the January partition under the monthly function pf_Month, by changing metadata only.",
    tables: [
      { name: 'dbo.FactSales_Stash', columns: ['CustomerKey', 'Amount', 'OrderDate'], rows: [[1, 129.0, '2026-01-05'], [2, 79.0, '2026-01-19']] },
      { name: 'dbo.FactSales', columns: ['CustomerKey', 'Amount', 'OrderDate'], rows: [[4, 640.0, '2026-03-02'], [3, 12.0, '2026-04-11']] },
    ],
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
___ TABLE dbo.FactSales_Stash
SWITCH ___ dbo.FactSales PARTITION 2;`,
    blanks: ['ALTER', 'TO'],
    solution: `ALTER TABLE dbo.FactSales_Stash
SWITCH TO dbo.FactSales PARTITION 2;`,
    explanation: '`ALTER TABLE <staging> SWITCH TO <partitioned table> PARTITION <n>` reassigns the staging table\'s data into that partition as a metadata-only operation - the staging table must match schema/indexes/filegroup and carry a CHECK constraint proving its rows belong in that partition\'s range.',
    hints: ['DDL verb that modifies a table', 'SWITCH TO <target> PARTITION <n>'],
    tags: ['tsql', 'partitioning', 'partition-switching', 'cloze'],
  },
  {
    id: 'tsql-part-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Move all rows of `dbo.FactSales_Stash` (a properly-constrained staging table holding February 2026) into partition number 3 of the partitioned table `dbo.FactSales`, the February partition under the monthly function pf_Month, by changing metadata only. Write the `ALTER TABLE ... SWITCH` statement.',
    tables: [
      { name: 'dbo.FactSales_Stash', columns: ['CustomerKey', 'Amount', 'OrderDate'], rows: [[1, 24.99, '2026-02-10'], [2, 516.0, '2026-02-21']] },
      { name: 'dbo.FactSales', columns: ['CustomerKey', 'Amount', 'OrderDate'], rows: [[1, 129.0, '2026-01-05'], [4, 640.0, '2026-03-02']] },
    ],
    starterCode: `-- dbo.FactSales_Stash and dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
`,
    testCases: [
      {
        input: 'ALTER TABLE dbo.FactSales_Stash SWITCH TO dbo.FactSales PARTITION 3',
        expectedOutput: 'Staging table switched into partition 3 (metadata-only)',
        description: 'Partition switch-in',
      },
    ],
    solution: `ALTER TABLE dbo.FactSales_Stash
SWITCH TO dbo.FactSales PARTITION 3;`,
    tieredHints: {
      apiSignature: 'ALTER TABLE staging_table SWITCH [PARTITION source_partition_num] TO target_table [PARTITION target_partition_num];',
      skeleton: `____ TABLE dbo.FactSales_Stash
____ ____ dbo.FactSales ____ 3;`,
    },
    explanation: '`ALTER TABLE <staging> SWITCH TO <partitioned> PARTITION <n>` reassigns the staging table\'s data into partition 3 of the target as a metadata-only operation, instant and minimally logged no matter how many rows. The staging table must match schema/indexes/filegroup and carry a CHECK constraint proving its rows belong in that partition\'s range.',
    hints: ['ALTER TABLE staging SWITCH TO target PARTITION n', 'Metadata-only, needs a matching CHECK constraint'],
    requires: [/SWITCH/i, /PARTITION/i, /ALTER\s+TABLE\s+(\[?dbo\]?\.)?\[?FactSales_Stash\]?\s+SWITCH\s+TO\s+(\[?dbo\]?\.)?\[?FactSales\]?\s+PARTITION\s+3\b/i],
    tags: ['tsql', 'partitioning', 'partition-switching'],
  },
  {
    id: 'tsql-part-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A RANGE RIGHT partition function has the boundary values in dbo.Boundary, so a boundary value belongs to the partition on its right. The query numbers the partition each sale lands in, starting at 1. Which partition does each sale get? Write one row per line in the ORDER BY order, as SaleId and PartitionNo separated by a comma.',
    tables: [
      { name: 'dbo.Boundary', columns: ['BoundaryDate'], rows: [['2026-02-01'], ['2026-03-01'], ['2026-04-01']] },
      {
        name: 'dbo.FactSales',
        columns: ['SaleId', 'SaleDate'],
        rows: [
          [1, '2026-01-31'],
          [2, '2026-02-01'],
          [3, '2026-02-28'],
          [4, '2026-03-01'],
          [5, '2026-05-15'],
        ],
      },
    ],
    code: `SELECT f.SaleId,
       (SELECT COUNT(*) FROM dbo.Boundary AS b WHERE b.BoundaryDate <= f.SaleDate) + 1 AS PartitionNo
FROM dbo.FactSales AS f
ORDER BY f.SaleId;`,
    expectedOutput: `1, 1
2, 2
3, 2
4, 3
5, 4`,
    explanation: 'The partition number is one more than the count of boundaries at or below the date. Sale 2 is dated exactly on the first boundary and counts it, so it lands in partition 2, not 1: with RANGE RIGHT a boundary value starts the partition on its right. With RANGE LEFT the comparison would be strictly below, and sale 2 would stay in partition 1.',
    hints: ['Count the boundaries that are <= the sale date', 'Partition numbers start at 1, so add 1'],
    tags: ['tsql', 'partitioning', 'range-right', 'boundary', 'predict'],
  },
];
