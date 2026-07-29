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

export const tsql_error_handling_questions: Question[] = [
  {
    id: 'tsql-err-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_ERROR_HANDLING,
    course: Course.SQL,
    question: 'What happens when a statement inside a `BEGIN TRY … END TRY` block raises an error?',
    options: [
      { id: 'a', text: 'Control jumps immediately to the matching `BEGIN CATCH … END CATCH` block; the rest of the TRY block is skipped.', isCorrect: true },
      { id: 'b', text: 'The error is silently ignored and execution continues with the next statement in the TRY block.', isCorrect: false },
      { id: 'c', text: 'The whole batch stops instantly and the CATCH block is never reached.', isCorrect: false },
      { id: 'd', text: 'The TRY block automatically retries the failed statement until it succeeds.', isCorrect: false },
    ],
    explanation: 'On a catchable error, T-SQL abandons the remaining TRY statements and runs the CATCH block, where you can inspect the error (`ERROR_MESSAGE()`), roll back, log it, and re-raise. This is the structured alternative to checking `@@ERROR` after every statement.',
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
    question: 'What does this batch print?',
    code: `BEGIN TRY
    SELECT 1 / 0;
    PRINT 'after divide';
END TRY
BEGIN CATCH
    PRINT 'handled';
END CATCH`,
    expectedOutput: `handled`,
    explanation: 'The divide-by-zero raises an error, so control jumps to CATCH before `PRINT \'after divide\'` can run. Only `handled` is printed — the statement after the failing one inside TRY is skipped.',
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
      { id: 'a', text: '`THROW;` with no arguments re-raises the original error unchanged (same number, message, severity); RAISERROR cannot re-raise the original and can\'t emit error numbers ≥ 50000 without sysmessages setup.', isCorrect: true },
      { id: 'b', text: '`THROW` suppresses the error so the caller never sees it, which keeps logs clean.', isCorrect: false },
      { id: 'c', text: 'They are identical; `THROW` is just the older spelling kept for backward compatibility.', isCorrect: false },
      { id: 'd', text: '`RAISERROR` rolls back the transaction automatically while `THROW` cannot affect transactions at all.', isCorrect: false },
    ],
    explanation: 'A parameterless `THROW;` inside CATCH re-raises the caught error verbatim, preserving its number and severity for the caller — exactly what you want after rolling back. `RAISERROR` is the older mechanism, can\'t re-raise the original error faithfully, and has fiddlier rules for custom message numbers.',
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
    question: 'Assemble the canonical transactional pattern: open a transaction and do both updates inside TRY, commit on success; in CATCH, roll back and re-raise. Order the lines so the transaction opens inside TRY, commits last in TRY, and CATCH rolls back before re-raising.',
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
      '    COMMIT;  -- inside CATCH',
      '    ROLLBACK;  -- inside TRY before COMMIT',
      '    RETURN;',
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
    explanation: 'This is the workhorse ELT pattern: open the transaction and do the writes inside TRY, `COMMIT` as the last TRY step. If anything fails, control jumps to CATCH, which `ROLLBACK`s the partial work and `THROW`s the original error up to the caller so the failure is visible (not swallowed).',
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
    requires: [/TRY/i, /CATCH/i],
    question: 'Write a transactional block that, inside a TRY, opens a transaction, INSERTs into `dbo.FactSales (CustomerKey, Amount)` the values `(5, 100)` then `(6, 200)`, and COMMITs. In the CATCH, ROLLBACK the transaction and re-raise the original error with a bare THROW.',
    starterCode: `-- dbo.FactSales(CustomerKey, Amount); wrap two inserts in a transaction; roll back and re-raise on error
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
    explanation: 'Both inserts must land together, so they sit inside `BEGIN TRAN … COMMIT` within the TRY. If either fails, control jumps to CATCH, which `ROLLBACK`s so neither row persists and `THROW`s the original error to the caller — the load fails loudly and atomically rather than leaving one orphan row.',
    hints: ['TRY: BEGIN TRAN, two INSERTs, COMMIT', 'CATCH: ROLLBACK then THROW'],
    tags: ['tsql', 'error-handling', 'try-catch', 'transactions'],
  },
];
