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
import { sampleTable } from './tsqlSampleTables';

export const tsql_transactions_questions: Question[] = [
  {
    id: 'tsql-tran-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    question: 'What does wrapping several statements in `BEGIN TRAN ... COMMIT` guarantee?',
    options: [
      { id: 'a', text: 'All the changes become permanent together at COMMIT, and a ROLLBACK before it undoes every one of them.', isCorrect: true },
      { id: 'b', text: 'Each statement is saved as soon as it runs, so a ROLLBACK before COMMIT undoes only the last statement.', isCorrect: false },
      { id: 'c', text: 'If any statement fails, SQL Server rolls back the others by itself, with no XACT_ABORT or TRY...CATCH.', isCorrect: false },
      { id: 'd', text: 'Nothing is written until COMMIT, so a statement inside cannot see the changes made by the ones before it.', isCorrect: false },
    ],
    explanation: 'A transaction makes a group of writes atomic: `COMMIT` makes them all permanent at once, and `ROLLBACK` undoes all of them. The session sees its own changes while the transaction is open (only other sessions are kept from them), so a later statement can read what an earlier one wrote. An error does not roll anything back by itself: without `SET XACT_ABORT ON` or `TRY ... CATCH`, a failed statement fails alone and the script can still reach `COMMIT`. For ELT this all-or-nothing unit matters because a half-applied load (dimension updated, fact not) corrupts the warehouse.',
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
    question: 'What does the final SELECT return (one value)?',
    tables: [{ name: 'dbo.Ticket', columns: ['TicketId'], rows: [[1]] }],
    code: `INSERT INTO dbo.Ticket (TicketId) VALUES (2);
BEGIN TRAN;
    INSERT INTO dbo.Ticket (TicketId) VALUES (3);
    INSERT INTO dbo.Ticket (TicketId) VALUES (4);
ROLLBACK;
SELECT COUNT(*) FROM dbo.Ticket;`,
    expectedOutput: `2`,
    explanation: 'The first INSERT runs outside any transaction, so it commits as soon as it finishes and the table holds tickets 1 and 2. The two INSERTs inside `BEGIN TRAN ... ROLLBACK` are undone together, so tickets 3 and 4 never stay. `ROLLBACK` reverts every change made since `BEGIN TRAN`, and nothing before it.',
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
    tables: [sampleTable('dbo.Account', ['AccountId', 'Balance'])],
    template: `-- dbo.Account(AccountId, Balance)
BEGIN ___;
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;
___;`,
    blanks: ['TRAN', 'COMMIT'],
    solution: `BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;
COMMIT;`,
    blankAlternates: [['TRANSACTION'], ['COMMIT TRAN', 'COMMIT TRANSACTION', 'COMMIT WORK']],
    explanation: '`BEGIN TRAN` (or `BEGIN TRANSACTION`) opens an explicit transaction; `COMMIT` (or `COMMIT TRAN`) makes every change inside it permanent together. Without the transaction each UPDATE commits on its own, so a failure between them would leave account 1 down 100 and account 2 never credited.',
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
      { id: 'a', text: 'Most run-time errors then end the batch and roll back the whole open transaction, not just the failed statement.', isCorrect: true },
      { id: 'b', text: 'Errors then fail only the statement that raised them, so the rest of the transaction can still commit.', isCorrect: false },
      { id: 'c', text: 'It turns off autocommit, so every statement after it waits for an explicit COMMIT before it is saved.', isCorrect: false },
      { id: 'd', text: 'Errors are then swallowed and the batch carries on with the next statement, so a load never stops halfway.', isCorrect: false },
    ],
    explanation: 'With `XACT_ABORT ON`, most run-time errors abort the batch and roll back the active transaction automatically. With it off (the default), an error such as a constraint violation fails only its own statement: the next one still runs and a later `COMMIT` keeps half the work. It does not change autocommit - that is `SET IMPLICIT_TRANSACTIONS ON` - and it makes errors louder, not quieter.',
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
      { id: 'a', text: 'How many BEGIN TRANs are still open on this connection; it tells the procedure whether its caller already has a transaction open.', isCorrect: true },
      { id: 'b', text: 'How many rows were changed since the last COMMIT; it tells the procedure whether there is any work left to commit.', isCorrect: false },
      { id: 'c', text: 'How many transactions this connection has committed so far; it stops the procedure committing the same work twice.', isCorrect: false },
      { id: 'd', text: 'How many transactions are open across all sessions on the server; it lets the procedure wait until nobody else is writing.', isCorrect: false },
    ],
    explanation: '`@@TRANCOUNT` is the nesting depth of open transactions on the current connection - 0 means none is open. A nested `BEGIN TRAN` is not an independent transaction: the inner `COMMIT` only lowers the count and commits nothing, and a bare `ROLLBACK` undoes the caller\'s work too. So a procedure that may run standalone or inside a caller\'s transaction checks it and opens its own transaction only when `@@TRANCOUNT = 0`. Rows changed is `@@ROWCOUNT`, and the count is per connection, not per server.',
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
    requires: [/BEGIN\s+TRAN/i, /COMMIT/i],
    question: 'Wrap two updates in a single explicit transaction so they apply atomically: subtract 250 from `Balance` for `AccountId = 10` and add 250 to `Balance` for `AccountId = 20` in `dbo.Account`, then commit.',
    tables: [sampleTable('dbo.Account', ['AccountId', 'Balance'])],
    starterCode: `-- dbo.Account(AccountId, Balance)
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
COMMIT;
-- OR
BEGIN TRANSACTION;
    UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
    UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;
COMMIT;
-- OR
BEGIN TRAN;
    UPDATE dbo.Account SET Balance -= 250 WHERE AccountId = 10;
    UPDATE dbo.Account SET Balance += 250 WHERE AccountId = 20;
COMMIT;`,
    explanation: 'The two updates are a single logical operation (a transfer), so they must succeed or fail together. `BEGIN TRAN` opens the transaction and `COMMIT` makes both updates permanent at once, so no other session ever sees account 10 at 950 while account 20 is still at 80. `BEGIN TRANSACTION`, `COMMIT TRAN` and `Balance -= 250` are all fine too.',
    hints: ['BEGIN TRAN around both updates', 'COMMIT at the end'],
    tieredHints: {
      apiSignature: 'UPDATE table SET column = expression WHERE condition;',
      skeleton: `BEGIN TRAN;
    UPDATE ____ SET Balance = Balance ____ 250 WHERE AccountId = ____;
    UPDATE ____ SET Balance = Balance ____ 250 WHERE AccountId = ____;
COMMIT;`,
    },
    tags: ['tsql', 'transactions', 'begin-tran'],
  },
  {
    id: 'tsql-tran-savetran-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_TRANSACTIONS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keyword that marks a savepoint, and the name ROLLBACK TRAN needs so it undoes only the bad update, keeping the first update and the open transaction.',
    tables: [sampleTable('dbo.Account', ['AccountId', 'Balance'])],
    template: `-- dbo.Account(AccountId, Balance)
BEGIN TRAN;
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
    explanation: '`SAVE TRAN <name>` marks a savepoint inside an open transaction. `ROLLBACK TRAN <name>` (naming the savepoint, not a bare ROLLBACK) undoes only the work done since that point - the bad bonus update - while the first UPDATE and the transaction itself stay open, ready to COMMIT. After the COMMIT account 1 holds 450. A bare `ROLLBACK` would undo the 50 as well and end the transaction, so the COMMIT would then fail.',
    hints: ['Mark a savepoint with SAVE TRAN <name>', 'Roll back to it by naming it in ROLLBACK TRAN'],
    tags: ['tsql', 'transactions', 'save-tran', 'savepoint', 'cloze'],
  },
];
