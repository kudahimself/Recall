/**
 * Topic.TSQL_PARTITIONING — SQL for Data Engineering (T-SQL).
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
      { id: 'a', text: 'When a query filters on the partitioning column, the engine reads only the relevant partitions and skips the rest — far less I/O on a large date-partitioned fact.', isCorrect: true },
      { id: 'b', text: 'It permanently deletes old partitions to free disk space during every query.', isCorrect: false },
      { id: 'c', text: 'It merges all partitions into one before scanning so the query is simpler.', isCorrect: false },
      { id: 'd', text: 'It removes duplicate rows across partitions automatically.', isCorrect: false },
    ],
    explanation: 'If a fact is partitioned by month and a query filters `WHERE OrderDate >= \'2026-01-01\'`, the optimizer can touch only the matching monthly partitions and ignore the others. On a multi-billion-row fact that turns a full scan into reading a small slice.',
    hints: ['Filter on the partition column → skip irrelevant partitions', 'Big I/O saving on large facts'],
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
      { id: 'a', text: 'It is a metadata-only operation: an entire partition is swapped in/out instantly, avoiding row-by-row INSERT/DELETE and the huge log + locking they cause.', isCorrect: true },
      { id: 'b', text: 'It physically copies every row twice to guarantee durability, which is why it is recommended.', isCorrect: false },
      { id: 'c', text: 'It works only on tables smaller than 1000 rows, where speed does not matter.', isCorrect: false },
      { id: 'd', text: 'It disables all constraints permanently so loads never fail.', isCorrect: false },
    ],
    explanation: 'SWITCH reassigns a whole partition between a staging table and the partitioned table by changing metadata pointers — near-instant and minimally logged, regardless of row count. Loading a month = build it in a staging table, then SWITCH it in; purging = SWITCH the old partition out and drop the staging table. Both avoid massive DELETE/INSERT.',
    hints: ['Metadata-only swap of a whole partition', 'Avoids row-by-row DELETE/INSERT + huge logging'],
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
      { id: 'a', text: 'It must have an identical schema and indexes, sit on the same filegroup as the target partition, and carry a CHECK constraint guaranteeing its rows fall in that partition\'s range.', isCorrect: true },
      { id: 'b', text: 'It only needs the same table name; schema and storage can differ freely.', isCorrect: false },
      { id: 'c', text: 'It must be empty at all times; SWITCH cannot move any rows.', isCorrect: false },
      { id: 'd', text: 'It must be on a different server to avoid locking conflicts.', isCorrect: false },
    ],
    explanation: 'Because SWITCH is metadata-only, SQL Server enforces that the data already physically qualifies: matching columns/indexes, same filegroup, and a CHECK constraint proving every staging row belongs in the target partition\'s boundaries. Without the constraint the engine can\'t trust the rows fit, and the SWITCH is rejected.',
    hints: ['Identical schema/indexes, same filegroup', 'CHECK constraint proving rows fit the partition range'],
    tags: ['tsql', 'partitioning', 'partition-switching', 'check-constraint'],
  },
  {
    id: 'tsql-part-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_PARTITIONING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords to define a monthly RANGE RIGHT partition function on a date.',
    template: `CREATE PARTITION ___ pf_Month (DATE)
AS RANGE ___ FOR VALUES ('2026-01-01', '2026-02-01', '2026-03-01');`,
    blanks: ['FUNCTION', 'RIGHT'],
    solution: `CREATE PARTITION FUNCTION pf_Month (DATE)
AS RANGE RIGHT FOR VALUES ('2026-01-01', '2026-02-01', '2026-03-01');`,
    explanation: 'A `PARTITION FUNCTION` maps a column\'s values to partition numbers via boundary values. `RANGE RIGHT` puts each boundary value into the partition to its right (so 2026-02-01 starts the February partition) — the natural choice for date partitioning. A `PARTITION SCHEME` then maps those partitions to filegroups.',
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
    question: 'Fill in the object that maps a partition function\'s partitions onto physical filegroups.',
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
    question: "Fill in the statement that instantly reassigns a staging table's rows into a target partition.",
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
    question: 'Instantly move all rows of `dbo.FactSales_Stash` (a properly-constrained staging table) into partition number 3 of the partitioned table `dbo.FactSales`. Write the ALTER TABLE … SWITCH statement.',
    starterCode: `-- ALTER TABLE ... SWITCH ... TO ... PARTITION ...;
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
    explanation: '`ALTER TABLE <staging> SWITCH TO <partitioned> PARTITION <n>` reassigns the staging table\'s data into partition 3 of the target as a metadata-only operation — instant and minimally logged no matter how many rows. The staging table must match schema/indexes/filegroup and carry a CHECK constraint proving its rows belong in that partition\'s range.',
    hints: ['ALTER TABLE staging SWITCH TO target PARTITION n', 'Metadata-only, needs a matching CHECK constraint'],
    requires: [/SWITCH/i, /PARTITION/i],
    tags: ['tsql', 'partitioning', 'partition-switching'],
  },
];
