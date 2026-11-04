/**
 * Topic.TSQL_ERROR_HANDLING — SQL for Data Engineering (T-SQL).
 * Pillar 4 (Transactions & Procedural): TRY … CATCH, THROW / RAISERROR,
 * ERROR_MESSAGE(), the rollback-in-CATCH pattern.
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

export const tsql_error_handling_questions: Question[] = [
  {
    id: 'tsql-err-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    question: 'What happens when a statement inside a `BEGIN TRY ... END TRY` block raises an error?',
    options: [
      { id: 'a', text: 'The rest of the TRY block is skipped, and control jumps straight to the CATCH block that follows it.', isCorrect: true },
      { id: 'b', text: 'The rest of the TRY block still runs, and CATCH runs once TRY reaches its end because an error was recorded.', isCorrect: false },
      { id: 'c', text: 'The batch stops at once and the error goes to the caller; CATCH runs only for errors raised with THROW.', isCorrect: false },
      { id: 'd', text: 'Control jumps to CATCH, and every change made inside the TRY block is undone before CATCH starts.', isCorrect: false },
    ],
    explanation: 'On a catchable error, T-SQL abandons the remaining TRY statements and runs the CATCH block, where you can inspect the error (`ERROR_MESSAGE()`), roll back, log it, and re-raise. CATCH handles system errors such as a divide by zero, not only THROW. Nothing is undone for you: changes made before the error stay, and an open transaction is still open when CATCH starts, which is why CATCH rolls back. This is the structured alternative to checking `@@ERROR` after every statement.',
    hints: ['Error → jump to CATCH', 'Remaining TRY statements are skipped'],
    tags: ['tsql', 'error-handling', 'try-catch'],
  },
  {
    id: 'tsql-err-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this batch PRINT? Give only the PRINT output, not the result of the SELECT.',
    code: `BEGIN TRY
    SELECT 1 / 0;
    PRINT 'after divide';
END TRY
BEGIN CATCH
    PRINT 'handled';
END CATCH`,
    expectedOutput: `handled`,
    explanation: 'The divide-by-zero raises an error, so control jumps to CATCH before `PRINT \'after divide\'` can run. Only `handled` is printed - the statement after the failing one inside TRY is skipped.',
    hints: ['Divide by zero errors before the PRINT in TRY', 'Only the CATCH branch runs'],
    tags: ['tsql', 'error-handling', 'try-catch', 'predict'],
  },
  {
    id: 'tsql-err-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the block keywords that wrap risky work and catch any error.',
    tables: [sampleTable('dbo.Account', ['AccountId', 'Balance'])],
    template: `-- dbo.Account(AccountId, Balance)
BEGIN ___
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
END TRY
BEGIN ___
    PRINT ERROR_MESSAGE();
END ___`,
    blanks: ['TRY', 'CATCH', 'CATCH'],
    solution: `BEGIN TRY
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
END TRY
BEGIN CATCH
    PRINT ERROR_MESSAGE();
END CATCH`,
    explanation: 'The risky work goes in `BEGIN TRY … END TRY`; the handler is `BEGIN CATCH … END CATCH`. Inside CATCH, `ERROR_MESSAGE()` returns the text of the error that diverted control there.',
    hints: ['Risky work → BEGIN TRY … END TRY', 'Handler → BEGIN CATCH … END CATCH'],
    tags: ['tsql', 'error-handling', 'try-catch', 'cloze'],
  },
  {
    id: 'tsql-err-throw-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    question: 'In a modern CATCH block, why is a bare `THROW;` preferred over `RAISERROR`?',
    options: [
      { id: 'a', text: 'It raises the caught error again with its original number, message and severity; RAISERROR can only raise a new error.', isCorrect: true },
      { id: 'b', text: 'It ends the CATCH block quietly, so the caller sees success while the error is kept in the log.', isCorrect: false },
      { id: 'c', text: 'It also rolls back the open transaction, so a CATCH that ends with it needs no ROLLBACK first.', isCorrect: false },
      { id: 'd', text: 'It re-raises the error as number 50000 with the same message, so callers can filter on one number.', isCorrect: false },
    ],
    explanation: 'A parameterless `THROW;` inside CATCH re-raises the caught error verbatim, preserving its number (8134 for a divide by zero, say) and severity for the caller, so the job that called the load fails with the real reason. `RAISERROR` is the older statement and can only raise a new error, which gets its own number. Neither one rolls back: CATCH must `ROLLBACK` first, then `THROW;`.',
    hints: ['Bare THROW; re-raises the original error unchanged', 'RAISERROR is the older, less faithful mechanism'],
    tags: ['tsql', 'error-handling', 'throw', 'raiserror'],
  },
  {
    id: 'tsql-err-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Assemble the canonical transactional pattern: inside TRY, open a transaction, take 100 from account 1, then add 100 to account 2, and commit; in CATCH, roll back and re-raise the original error.',
    tables: [sampleTable('dbo.Account', ['AccountId', 'Balance'])],
    correctOrder: [
      'BEGIN TRY',
      '    BEGIN TRAN;',
      '    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;',
      '    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;',
      '    COMMIT;',
      'END TRY',
      'BEGIN CATCH',
      '    ROLLBACK;',
      '    THROW;',
      'END CATCH',
    ],
    distractorLines: [
      '    PRINT ERROR_MESSAGE();',
      '    IF @@ERROR <> 0 ROLLBACK;',
    ],
    solution: `BEGIN TRY
    BEGIN TRAN;
    UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountId = 1;
    UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountId = 2;
    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH`,
    explanation: 'This is the workhorse ELT pattern: open the transaction and do the writes inside TRY, `COMMIT` as the last TRY step. If anything fails, control jumps to CATCH, which `ROLLBACK`s the partial work and `THROW`s the original error up to the caller so the failure is visible. `PRINT ERROR_MESSAGE()` in place of THROW would swallow the error, and an `@@ERROR` check inside TRY never runs after a failure, because control has already left for CATCH. Production code often writes `IF XACT_STATE() <> 0 ROLLBACK;`, so CATCH does not fail when no transaction is open.',
    hints: ['TRY: BEGIN TRAN → updates → COMMIT', 'CATCH: ROLLBACK → THROW'],
    tags: ['tsql', 'error-handling', 'try-catch', 'transactions', 'parsons'],
  },
  {
    id: 'tsql-err-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    requires: [/BEGIN\s+TRY/i, /BEGIN\s+CATCH/i, /ROLLBACK/i, /THROW/i],
    question: 'Write a transactional block that, inside a TRY, opens a transaction, INSERTs into `dbo.FactSales (CustomerKey, Amount)` the values `(5, 100)` then `(6, 200)`, and COMMITs. In the CATCH, ROLLBACK the transaction and re-raise the original error with a bare THROW.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'Amount'])],
    starterCode: `-- dbo.FactSales(CustomerKey, Amount)
`,
    testCases: [
      {
        input: 'BEGIN TRY / BEGIN TRAN / 2 inserts / COMMIT / END TRY / BEGIN CATCH / ROLLBACK / THROW / END CATCH',
        expectedOutput: 'Atomic insert that rolls back and re-raises on failure',
        description: 'Transaction with TRY/CATCH rollback and re-throw',
      },
    ],
    solution: `BEGIN TRY
    BEGIN TRAN;
    INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
    INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH
-- OR
BEGIN TRY
    BEGIN TRANSACTION;
    INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
    INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH
-- OR
BEGIN TRY
    BEGIN TRAN;
    INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100), (6, 200);
    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH`,
    tieredHints: {
      apiSignature: 'INSERT INTO table (col1, col2, ...) VALUES (val1, val2, ...);',
      skeleton: `BEGIN TRY
    ____;
    INSERT INTO dbo.FactSales (CustomerKey, Amount) ____ (5, 100);
    INSERT INTO dbo.FactSales (CustomerKey, Amount) ____ (6, 200);
    ____;
END TRY
BEGIN CATCH
    ____;
    ____;
END CATCH`,
    },
    explanation: 'Both inserts must land together, so they sit inside `BEGIN TRAN ... COMMIT` within the TRY. If either fails, control jumps to CATCH, which `ROLLBACK`s so neither row persists and `THROW`s the original error to the caller - the load fails loudly and atomically rather than leaving one orphan row. One INSERT with both rows, `SET XACT_ABORT ON` first, or a guarded `IF XACT_STATE() <> 0 ROLLBACK;` are all fine too.',
    hints: ['TRY: BEGIN TRAN, two INSERTs, COMMIT', 'CATCH: ROLLBACK then THROW'],
    tags: ['tsql', 'error-handling', 'try-catch', 'transactions'],
  },
];
