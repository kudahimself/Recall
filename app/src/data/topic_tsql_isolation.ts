/**
 * Topic.TSQL_ISOLATION — SQL for Data Engineering (T-SQL).
 * Pillar 4 (Transactions & Procedural): isolation levels, lock hints,
 * dirty / non-repeatable / phantom reads.
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

export const tsql_isolation_questions: Question[] = [
  {
    id: 'tsql-iso-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    question: 'What is a "dirty read", and which isolation level allows it?',
    options: [
      { id: 'a', text: 'Reading another transaction\'s change before it commits, which may still be rolled back; only READ UNCOMMITTED allows it.', isCorrect: true },
      { id: 'b', text: 'Reading the same row twice and getting two different committed values; READ COMMITTED, the default, allows it.', isCorrect: false },
      { id: 'c', text: 'Reading another transaction\'s change before it commits; every locking level allows it, and only SNAPSHOT stops it.', isCorrect: false },
      { id: 'd', text: 'Reading a change your own open transaction made but has not committed yet; only READ UNCOMMITTED allows it.', isCorrect: false },
    ],
    explanation: 'A dirty read sees data another transaction has written but not yet committed; if that writer rolls back, you acted on data that never officially existed. Only READ UNCOMMITTED (and the `WITH (NOLOCK)` hint) permits it: READ COMMITTED and every level above it block it. Two values for the same row from two committed changes is a non-repeatable read, a different anomaly. Seeing your own uncommitted changes is normal at every level and is not a dirty read.',
    hints: ['Dirty = reading uncommitted data', 'Only READ UNCOMMITTED / NOLOCK allows it'],
    tags: ['tsql', 'isolation', 'dirty-read'],
  },
  {
    id: 'tsql-iso-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    question: 'A reporting query uses `FROM dbo.FactSales WITH (NOLOCK)`. What is the real trade-off?',
    options: [
      { id: 'a', text: 'It avoids taking shared locks (so it won\'t block writers) but can return dirty, missing, or duplicated rows from in-flight changes.', isCorrect: true },
      { id: 'b', text: 'It guarantees the most up-to-date committed data while running faster than any other option, with no downside.', isCorrect: false },
      { id: 'c', text: 'It locks the entire table exclusively so no one else can read or write until the query finishes.', isCorrect: false },
      { id: 'd', text: 'It reads the last committed version of each row, like SNAPSHOT, so it never blocks and never sees in-flight changes.', isCorrect: false },
    ],
    explanation: '`WITH (NOLOCK)` is READ UNCOMMITTED for one table: it skips shared locks so it neither blocks nor is blocked by writers, at the cost of dirty reads and, during page splits, rows that are skipped or read twice. It is not SNAPSHOT: SNAPSHOT also avoids blocking but reads committed row versions, so it never sees in-flight changes. NOLOCK is acceptable for rough dashboards and dangerous for anything that must reconcile.',
    hints: ['NOLOCK = no shared locks = dirty reads possible', 'Fast and non-blocking but inconsistent'],
    tags: ['tsql', 'isolation', 'nolock', 'lock-hints'],
  },
  {
    id: 'tsql-iso-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Two sessions run these statements on separate connections, in the order shown. What does Session B\'s SELECT return (one value)?',
    tables: [{ name: 'dbo.Account', columns: ['AccountId', 'Balance'], rows: [[1, 500]] }],
    code: `-- Session A
BEGIN TRAN;
UPDATE dbo.Account SET Balance = 0 WHERE AccountId = 1;
-- Session B, while A is still open
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT Balance FROM dbo.Account WHERE AccountId = 1;
-- Session A
ROLLBACK;`,
    expectedOutput: `0`,
    explanation: 'READ UNCOMMITTED takes no shared locks, so Session B reads the 0 that Session A wrote but has not committed - a dirty read. Session A then rolls back, so the balance was never really 0. Under READ COMMITTED, the default, B never sees the 0: its SELECT waits for A to finish and then reads 500.',
    hints: ['READ UNCOMMITTED sees changes that are not committed yet', 'The ROLLBACK happens after B has already read'],
    tags: ['tsql', 'isolation', 'dirty-read', 'read-uncommitted', 'predict'],
  },
  {
    id: 'tsql-iso-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that sets the session to SNAPSHOT isolation (readers see a consistent committed version without blocking writers).',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'Amount'])],
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
SET TRANSACTION ___ LEVEL ___;
BEGIN TRAN;
    SELECT SUM(Amount) FROM dbo.FactSales;
COMMIT;`,
    blanks: ['ISOLATION', 'SNAPSHOT'],
    solution: `SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRAN;
    SELECT SUM(Amount) FROM dbo.FactSales;
COMMIT;`,
    explanation: '`SET TRANSACTION ISOLATION LEVEL SNAPSHOT` makes the transaction read the data as it was committed when the transaction started, from row versions. The SUM is consistent and repeatable without taking shared locks, so it neither blocks nor is blocked by writers (the database needs `ALLOW_SNAPSHOT_ISOLATION ON`).',
    hints: ['SET TRANSACTION ISOLATION LEVEL <level>', 'The versioned, non-blocking level is SNAPSHOT'],
    tags: ['tsql', 'isolation', 'snapshot', 'cloze'],
  },
  {
    id: 'tsql-iso-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the table hint that takes an update lock while reading, so a second session running the same code has to wait instead of reading the same Stock before you update it.',
    tables: [{ name: 'dbo.Inventory', columns: ['Sku', 'Stock'], rows: [['A100', 1], ['B200', 4]] }],
    template: `DECLARE @qty INT;
BEGIN TRAN;
    SELECT @qty = Stock
    FROM dbo.Inventory WITH (___)
    WHERE Sku = 'A100';
    UPDATE dbo.Inventory SET Stock = @qty - 1 WHERE Sku = 'A100';
COMMIT;`,
    blanks: ['UPDLOCK'],
    blankAlternates: [['UPDLOCK, HOLDLOCK', 'UPDLOCK, ROWLOCK', 'ROWLOCK, UPDLOCK']],
    solution: `DECLARE @qty INT;
BEGIN TRAN;
    SELECT @qty = Stock
    FROM dbo.Inventory WITH (UPDLOCK)
    WHERE Sku = 'A100';
    UPDATE dbo.Inventory SET Stock = @qty - 1 WHERE Sku = 'A100';
COMMIT;`,
    explanation: 'The `WITH (UPDLOCK)` hint takes an update lock at read time and holds it until COMMIT. Only one session can hold an update lock on the row, so a second session running the same code waits at its SELECT, then reads the new Stock. Without it, both could read 1 and both write 0, selling the last A100 twice (the lost-update race). A plain SELECT elsewhere can still read the row, and nothing locks the whole table.',
    hints: ['The hint that reserves a row for a coming update', 'Prevents the lost-update race'],
    tags: ['tsql', 'isolation', 'updlock', 'lock-hints', 'cloze'],
  },
  {
    id: 'tsql-iso-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    question: 'Under READ COMMITTED, a transaction reads a row, and a moment later reads the same row again and gets a different value. What is this anomaly, and which level prevents it?',
    options: [
      { id: 'a', text: 'A non-repeatable read; REPEATABLE READ prevents it by keeping the rows it read locked until the transaction ends.', isCorrect: true },
      { id: 'b', text: 'A phantom read; REPEATABLE READ cannot stop it, so the transaction needs SERIALIZABLE to lock the range.', isCorrect: false },
      { id: 'c', text: 'A dirty read; the second value came from another transaction that has not committed its change yet.', isCorrect: false },
      { id: 'd', text: 'A non-repeatable read; READ COMMITTED prevents it once both reads sit inside one BEGIN TRAN ... COMMIT.', isCorrect: false },
    ],
    explanation: 'Re-reading a row and seeing a committed change made in between is a non-repeatable read. REPEATABLE READ holds shared locks on rows it has read until commit, so they cannot change underneath it (SERIALIZABLE and SNAPSHOT prevent it too). It is not a dirty read: READ COMMITTED never shows uncommitted data. A transaction alone does not help, because READ COMMITTED releases each read lock as soon as the row is read. A phantom is a new row matching the WHERE, not a changed one.',
    hints: ['Same row, two reads, two values → non-repeatable read', 'REPEATABLE READ holds read locks to the end'],
    tags: ['tsql', 'isolation', 'non-repeatable-read'],
  },
  {
    id: 'tsql-iso-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    question: 'Under REPEATABLE READ, a transaction re-runs `SELECT * FROM dbo.Account WHERE Balance > 1000` and this time sees a brand-new row that did not exist on the first read (another transaction inserted and committed it in between). What is this anomaly, and which level prevents it?',
    options: [
      { id: 'a', text: 'A phantom read; SERIALIZABLE prevents it by locking the range the WHERE covers, so no new matching row can go in.', isCorrect: true },
      { id: 'b', text: 'A non-repeatable read; REPEATABLE READ already prevents those, so the second read cannot see the new row.', isCorrect: false },
      { id: 'c', text: 'A phantom read; no isolation level can prevent it, only an exclusive lock on the whole table such as TABLOCKX.', isCorrect: false },
      { id: 'd', text: 'A dirty read; READ COMMITTED or higher hides new rows, so REPEATABLE READ should not have shown it.', isCorrect: false },
    ],
    explanation: 'REPEATABLE READ locks the specific rows it has already read so their values cannot change - but it does not lock the range those rows come from, so a new row matching the predicate can still appear. That is a phantom read. Among the locking levels only SERIALIZABLE closes the gap, by range-locking the predicate itself; SNAPSHOT avoids it differently, by reading the data as it was when the transaction started. It is not a dirty read, because the insert was committed before the second read.',
    hints: ['New matching row appears between two reads of the same predicate → phantom read', 'Only SERIALIZABLE range-locks the predicate'],
    tags: ['tsql', 'isolation', 'phantom-read', 'serializable'],
  },
];
