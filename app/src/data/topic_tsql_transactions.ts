/**
 * Topic.TSQL_TRANSACTIONS — SQL for Data Engineering (T-SQL).
 * Pillar 4 (Transactions & Procedural): BEGIN TRAN / COMMIT / ROLLBACK,
 * SAVE TRAN, @@TRANCOUNT, SET XACT_ABORT ON, explicit vs autocommit.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_transactions_questions: Question[] = [
  {
    id: 'tsql-tran-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    question: 'What does wrapping several statements in `BEGIN TRAN … COMMIT` guarantee?',
    options: [
      { id: 'a', text: 'Atomicity — every statement commits together, or if you ROLLBACK none of them take effect.', isCorrect: true },
      { id: 'b', text: 'Speed — the statements run in parallel across CPUs instead of one at a time.', isCorrect: false },
      { id: 'c', text: 'Each statement is saved permanently the instant it runs, so ROLLBACK only affects the last one.', isCorrect: false },
      { id: 'd', text: 'The statements are validated for syntax only and never actually modify any data.', isCorrect: false },
    ],
    explanation: 'A transaction makes a group of writes atomic: `COMMIT` makes them all permanent at once, `ROLLBACK` undoes all of them. This is essential for ELT — a half-applied load (dimension updated, fact not) would corrupt the warehouse.',
    hints: ['All-or-nothing', 'COMMIT keeps everything, ROLLBACK undoes everything'],
    tags: ['tsql', 'transactions', 'atomicity'],
  },
  {
    id: 'tsql-tran-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does the final SELECT output?',
    code: `CREATE TABLE #t (n INT);
INSERT INTO #t VALUES (1);
BEGIN TRAN;
    INSERT INTO #t VALUES (2);
    INSERT INTO #t VALUES (3);
ROLLBACK;
SELECT COUNT(*) FROM #t;`,
    expectedOutput: `1`,
    explanation: 'The first INSERT runs in autocommit mode and persists. The two INSERTs inside `BEGIN TRAN … ROLLBACK` are undone, so only one row survives. ROLLBACK reverts every change made since BEGIN TRAN.',
    hints: ['Only the inserts inside the rolled-back transaction are undone'],
    tags: ['tsql', 'transactions', 'rollback', 'predict'],
  },
  {
    id: 'tsql-tran-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords that open the transaction and make both updates permanent together.',
    template: `BEGIN ___;
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;
___;`,
    blanks: ['TRAN', 'COMMIT'],
    solution: `BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;
COMMIT;`,
    blankAlternates: [['TRANSACTION'], []],
    explanation: '`BEGIN TRAN` (or `BEGIN TRANSACTION`) opens an explicit transaction; `COMMIT` makes every change inside it permanent atomically. Without the transaction, a crash between the two updates would lose money.',
    hints: ['Open with BEGIN TRAN', 'Make permanent with COMMIT'],
    tags: ['tsql', 'transactions', 'begin-tran', 'cloze'],
  },
  {
    id: 'tsql-tran-xact-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    question: 'Why do production T-SQL procedures often start with `SET XACT_ABORT ON`?',
    options: [
      { id: 'a', text: 'So that any run-time error automatically aborts and rolls back the whole transaction, instead of leaving it open in an inconsistent state.', isCorrect: true },
      { id: 'b', text: 'It disables transactions entirely so every statement autocommits for maximum speed.', isCorrect: false },
      { id: 'c', text: 'It forces all queries in the batch to run inside a single CPU core for determinism.', isCorrect: false },
      { id: 'd', text: 'It silently ignores all errors so the procedure always reports success.', isCorrect: false },
    ],
    explanation: 'With `XACT_ABORT ON`, most run-time errors abort the batch and roll back the active transaction automatically. Without it, some errors abort only the statement and leave the transaction open — risking a partially-applied load and orphaned locks.',
    hints: ['Error → automatic rollback of the whole transaction', 'Guards against a left-open transaction'],
    tags: ['tsql', 'transactions', 'xact-abort'],
  },
  {
    id: 'tsql-tran-trancount-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    question: 'What does `@@TRANCOUNT` return, and why do procedures often check it before opening a transaction?',
    options: [
      { id: 'a', text: 'The number of currently open (nested) transactions on the connection; checking it lets a procedure avoid opening a redundant nested transaction when the caller already has one open.', isCorrect: true },
      { id: 'b', text: 'The total number of rows modified since the connection began; it resets to 0 after every COMMIT.', isCorrect: false },
      { id: 'c', text: 'A boolean flag indicating whether the last statement succeeded.', isCorrect: false },
      { id: 'd', text: 'The number of active connections to the database from any session.', isCorrect: false },
    ],
    explanation: '`@@TRANCOUNT` is the nesting depth of open transactions on the current connection - 0 means none is open. A procedure that might run standalone or be called from inside a caller\'s transaction often checks it (e.g. only opening its own transaction when `@@TRANCOUNT = 0`) so a ROLLBACK inside doesn\'t unexpectedly undo the caller\'s work too.',
    hints: ['@@TRANCOUNT = nesting depth of open transactions', 'Guards against opening a redundant nested transaction'],
    tags: ['tsql', 'transactions', 'trancount'],
  },
  {
    id: 'tsql-tran-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Wrap two updates in a single explicit transaction so they apply atomically: subtract 250 from `Balance` for `AccountId = 10` and add 250 to `Balance` for `AccountId = 20` in `dbo.Account`, then commit.',
    starterCode: `-- BEGIN TRAN; ... COMMIT;
`,
    testCases: [
      {
        input: 'BEGIN TRAN; UPDATE -250; UPDATE +250; COMMIT;',
        expectedOutput: 'Both balance updates committed atomically',
        description: 'Explicit transaction around a transfer',
      },
    ],
    solution: `BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
    UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;
COMMIT;`,
    explanation: 'The two updates are a single logical operation (a transfer), so they must succeed or fail together. `BEGIN TRAN` opens the transaction and `COMMIT` makes both updates permanent at once — there is never a moment where the money has left one account but not arrived in the other.',
    hints: ['BEGIN TRAN around both updates', 'COMMIT at the end'],
    tags: ['tsql', 'transactions', 'begin-tran'],
  },
  {
    id: 'tsql-tran-savetran-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that marks a savepoint, and the clause that rolls back only to it (undoing the bad update but keeping the first one and the open transaction).',
    template: `BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 50 WHERE AccountId = 1;
    ___ TRAN BeforeBonus;
    UPDATE dbo.Account SET Balance = Balance + 1000000 WHERE AccountId = 1; -- wrong amount
    ROLLBACK TRAN ___;
COMMIT;`,
    blanks: ['SAVE', 'BeforeBonus'],
    solution: `BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 50 WHERE AccountId = 1;
    SAVE TRAN BeforeBonus;
    UPDATE dbo.Account SET Balance = Balance + 1000000 WHERE AccountId = 1; -- wrong amount
    ROLLBACK TRAN BeforeBonus;
COMMIT;`,
    explanation: '`SAVE TRAN <name>` marks a savepoint inside an open transaction. `ROLLBACK TRAN <name>` (naming the savepoint, not a bare ROLLBACK) undoes only the work done since that point - the bad bonus update - while the first UPDATE and the transaction itself stay open, ready to COMMIT.',
    hints: ['Mark a savepoint with SAVE TRAN <name>', 'Roll back to it by naming it in ROLLBACK TRAN'],
    tags: ['tsql', 'transactions', 'save-tran', 'savepoint', 'cloze'],
  },
];
