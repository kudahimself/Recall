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

export const tsql_isolation_questions: Question[] = [
  {
    id: 'tsql-iso-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    question: 'What is a "dirty read", and which isolation level allows it?',
    options: [
      { id: 'a', text: 'Reading another transaction\'s uncommitted change that may later be rolled back — allowed only under READ UNCOMMITTED.', isCorrect: true },
      { id: 'b', text: 'Reading a row that was deleted by your own transaction — allowed only under SERIALIZABLE.', isCorrect: false },
      { id: 'c', text: 'Reading the same row twice and getting two different values — allowed only under READ COMMITTED.', isCorrect: false },
      { id: 'd', text: 'Reading rows in a different order than they were inserted — allowed under every isolation level.', isCorrect: false },
    ],
    explanation: 'A dirty read sees data another transaction has written but not yet committed; if that writer rolls back, you acted on data that never officially existed. Only READ UNCOMMITTED (and the `WITH (NOLOCK)` hint) permits it. READ COMMITTED and above block it.',
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
      { id: 'd', text: 'It forces the query to run under SERIALIZABLE, giving the strongest consistency guarantee.', isCorrect: false },
    ],
    explanation: '`WITH (NOLOCK)` is READ UNCOMMITTED for one table: it skips shared locks so it neither blocks nor is blocked by writers — at the cost of dirty reads and, during page splits, rows that are skipped or read twice. Acceptable for rough dashboards, dangerous for anything that must reconcile.',
    hints: ['NOLOCK = no shared locks = dirty reads possible', 'Fast and non-blocking but inconsistent'],
    tags: ['tsql', 'isolation', 'nolock', 'lock-hints'],
  },
  {
    id: 'tsql-iso-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ISOLATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that sets the session to SNAPSHOT isolation (readers see a consistent committed version without blocking writers).',
    template: `SET TRANSACTION ___ LEVEL ___;
BEGIN TRAN;
    SELECT SUM(Amount) FROM dbo.FactSales;
COMMIT;`,
    blanks: ['ISOLATION', 'SNAPSHOT'],
    solution: `SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRAN;
    SELECT SUM(Amount) FROM dbo.FactSales;
COMMIT;`,
    explanation: '`SET TRANSACTION ISOLATION LEVEL SNAPSHOT` makes the transaction read a row-versioned snapshot taken at its start — consistent and repeatable without taking shared locks, so it neither blocks nor is blocked by writers (requires `ALLOW_SNAPSHOT_ISOLATION ON` for the database).',
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
    question: 'Fill in the table hint that takes an update lock while reading, so a concurrent reader can\'t grab the same row before you update it.',
    template: `BEGIN TRAN;
    SELECT @qty = Stock
    FROM dbo.Inventory WITH (___)
    WHERE Sku = 'A100';
    UPDATE dbo.Inventory SET Stock = @qty - 1 WHERE Sku = 'A100';
COMMIT;`,
    blanks: ['UPDLOCK'],
    solution: `BEGIN TRAN;
    SELECT @qty = Stock
    FROM dbo.Inventory WITH (UPDLOCK)
    WHERE Sku = 'A100';
    UPDATE dbo.Inventory SET Stock = @qty - 1 WHERE Sku = 'A100';
COMMIT;`,
    explanation: 'The `WITH (UPDLOCK)` hint takes an update lock at read time, so two sessions can\'t both read the same stock value and then each decrement it (the classic lost-update race). It serialises the read-then-write on that row without escalating to a full exclusive table lock.',
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
      { id: 'a', text: 'A non-repeatable read; REPEATABLE READ (or higher) prevents it by holding shared locks on read rows until the transaction ends.', isCorrect: true },
      { id: 'b', text: 'A phantom read; only READ UNCOMMITTED prevents it by skipping locks entirely.', isCorrect: false },
      { id: 'c', text: 'A dirty read; READ COMMITTED already prevents it, so this scenario is impossible.', isCorrect: false },
      { id: 'd', text: 'A deadlock; SERIALIZABLE causes it rather than preventing it.', isCorrect: false },
    ],
    explanation: 'Re-reading a row and seeing a committed change made in between is a non-repeatable read. REPEATABLE READ holds shared locks on rows it has read until commit, so they can\'t change underneath it. (Phantoms — new rows matching your predicate — need SERIALIZABLE.)',
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
      { id: 'a', text: 'A phantom read; only SERIALIZABLE prevents it, by locking the predicate\'s range so no new matching row can be inserted until the transaction ends.', isCorrect: true },
      { id: 'b', text: 'A non-repeatable read; REPEATABLE READ already prevents this, so the scenario described is impossible.', isCorrect: false },
      { id: 'c', text: 'A dirty read; it means the new row\'s insert was never actually committed.', isCorrect: false },
      { id: 'd', text: 'A deadlock; it means two transactions are waiting on each other\'s locks.', isCorrect: false },
    ],
    explanation: 'REPEATABLE READ locks the specific rows it has already read so their values cannot change - but it does not lock the range those rows come from, so a new row matching the predicate can still appear. That is a phantom read. Only SERIALIZABLE closes the gap, by range-locking the predicate itself.',
    hints: ['New matching row appears between two reads of the same predicate → phantom read', 'Only SERIALIZABLE range-locks the predicate'],
    tags: ['tsql', 'isolation', 'phantom-read', 'serializable'],
  },
];
