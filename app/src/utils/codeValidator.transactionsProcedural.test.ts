/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * Transactions & Procedural T-SQL coding questions. Each one must pass
 * outright, not land on the "uncertain, self-grade" fallback, and near-miss
 * wrong answers must not.
 *
 * These pin the question-quality fixes: the long keyword spellings
 * (BEGIN TRANSACTION, COMMIT TRAN, CREATE PROC, OUT), compound assignment,
 * SET with a subquery, the algebraic forms of the discount, a
 * multi-row INSERT, SET XACT_ABORT ON and a guarded ROLLBACK in CATCH.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodeLanguage, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, outputMatches, SQL_OUTPUT_CONVENTION, SQL_PRINT_CONVENTION, SQL_MIXED_PRINT_CONVENTION } from './predictOutput';

const ACCEPTED: Record<string, string[]> = {
  'tsql-tran-1': [
    `BEGIN TRAN;
       UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
       UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;
     COMMIT;`,
    `BEGIN TRANSACTION;
       UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
       UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;
     COMMIT TRANSACTION;`,
    `BEGIN TRAN
       UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10
       UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20
     COMMIT TRAN`,
    `BEGIN TRAN;
       UPDATE dbo.Account SET Balance -= 250 WHERE AccountId = 10;
       UPDATE dbo.Account SET Balance += 250 WHERE AccountId = 20;
     COMMIT;`,
  ],
  'tsql-proc-1': [
    `CREATE PROCEDURE dbo.GetOrdersSince @FromDate DATE
     AS
     BEGIN
       SELECT OrderId, OrderDate, Amount FROM dbo.FactOrders WHERE OrderDate >= @FromDate ORDER BY OrderDate;
     END;`,
    `CREATE PROC dbo.GetOrdersSince @FromDate DATE
     AS
     BEGIN
       SELECT OrderId, OrderDate, Amount FROM dbo.FactOrders WHERE OrderDate >= @FromDate ORDER BY OrderDate;
     END`,
    `CREATE OR ALTER PROCEDURE dbo.GetOrdersSince (@FromDate DATE)
     AS
     BEGIN
       SELECT OrderId, OrderDate, Amount FROM dbo.FactOrders WHERE OrderDate >= @FromDate ORDER BY OrderDate ASC;
     END;`,
  ],
  'tsql-proc-2': [
    `CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUTPUT
     AS
     BEGIN
       SELECT @OrderCount = COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
     END;`,
    `CREATE PROC dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUT
     AS
     BEGIN
       SELECT @OrderCount = COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
     END`,
    `CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT, @OrderCount INT OUTPUT
     AS
     BEGIN
       SET @OrderCount = (SELECT COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey);
     END;`,
  ],
  'tsql-flow-1': [
    `CREATE FUNCTION dbo.NetAmount (@Gross DECIMAL(10, 2), @DiscountPct DECIMAL(5, 2))
     RETURNS DECIMAL(10, 2)
     AS
     BEGIN
       RETURN @Gross - @Gross * @DiscountPct / 100;
     END;`,
    `CREATE FUNCTION dbo.NetAmount (@Gross DECIMAL(10,2), @DiscountPct DECIMAL(5,2))
     RETURNS DECIMAL(10,2)
     AS
     BEGIN
       RETURN @Gross * (1 - @DiscountPct / 100);
     END`,
    `CREATE FUNCTION dbo.NetAmount (@Gross DECIMAL(10, 2), @DiscountPct DECIMAL(5, 2))
     RETURNS DECIMAL(10, 2)
     AS
     BEGIN
       RETURN @Gross - (@Gross * @DiscountPct / 100);
     END;`,
    `CREATE OR ALTER FUNCTION dbo.NetAmount (@Gross DECIMAL(10, 2), @DiscountPct DECIMAL(5, 2))
     RETURNS DECIMAL(10, 2)
     AS
     BEGIN
       RETURN @Gross * (100 - @DiscountPct) / 100;
     END;`,
  ],
  'tsql-err-1': [
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       ROLLBACK;
       THROW;
     END CATCH`,
    `BEGIN TRY
       BEGIN TRANSACTION;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT TRANSACTION;
     END TRY
     BEGIN CATCH
       ROLLBACK TRANSACTION;
       THROW;
     END CATCH;`,
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100), (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       ROLLBACK;
       THROW;
     END CATCH`,
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       IF XACT_STATE() <> 0 ROLLBACK;
       THROW;
     END CATCH`,
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       IF @@TRANCOUNT > 0 ROLLBACK;
       THROW;
     END CATCH`,
    `SET XACT_ABORT ON;
     BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       ROLLBACK;
       THROW;
     END CATCH`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-tran-1': [
    // no transaction: each UPDATE autocommits on its own
    `UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
     UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;`,
    // rolls the transfer back instead of committing it
    `BEGIN TRAN;
       UPDATE dbo.Account SET Balance = Balance - 250 WHERE AccountId = 10;
       UPDATE dbo.Account SET Balance = Balance + 250 WHERE AccountId = 20;
     ROLLBACK;`,
  ],
  'tsql-proc-1': [
    // a one-off query, not a procedure
    `SELECT OrderId, OrderDate, Amount FROM dbo.FactOrders WHERE OrderDate >= '2026-10-01' ORDER BY OrderDate;`,
  ],
  'tsql-proc-2': [
    // returns the count as a result set instead of through the parameter
    `CREATE PROCEDURE dbo.CountOrdersForCustomer @CustomerKey INT
     AS
     BEGIN
       SELECT COUNT(*) FROM dbo.FactOrders WHERE CustomerKey = @CustomerKey;
     END;`,
  ],
  'tsql-err-1': [
    // swallows the error instead of re-raising it
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       ROLLBACK;
       PRINT ERROR_MESSAGE();
     END CATCH`,
    // commits the partial work in CATCH
    `BEGIN TRY
       BEGIN TRAN;
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (5, 100);
       INSERT INTO dbo.FactSales (CustomerKey, Amount) VALUES (6, 200);
       COMMIT;
     END TRY
     BEGIN CATCH
       COMMIT;
       THROW;
     END CATCH`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'procedural', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('Transactions & Procedural coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('Transactions & Procedural coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});

const PROCEDURAL_TOPICS = new Set<string>([
  Topic.TSQL_TRANSACTIONS, Topic.TSQL_ISOLATION, Topic.TSQL_PROCEDURES, Topic.TSQL_CONTROL_FLOW, Topic.TSQL_ERROR_HANDLING,
]);
const predicts = questions.filter(
  (q): q is PredictOutputQuestion => q.type === QuestionType.PREDICT_OUTPUT && PROCEDURAL_TOPICS.has(q.topic),
);

describe('Transactions & Procedural predict questions state the answer they expect', () => {
  it('a query predict uses the comma rows convention; a PRINT predict names PRINT in its prompt', () => {
    expect(predicts.length).toBe(6);
    const offenders = predicts
      .filter(q => {
        const conv = outputInstruction(q.code, q.language);
        if (/\||\w=\w/.test(q.expectedOutput)) return true;
        if (conv === SQL_OUTPUT_CONVENTION) return !/\breturn\b/i.test(q.question);
        if (conv === SQL_MIXED_PRINT_CONVENTION || conv === SQL_PRINT_CONVENTION) return !/\bprint\b/i.test(q.question);
        return true;
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('the rollback predict counts the autocommitted row and not the rolled-back ones', () => {
    const q = predicts.find(p => p.id === 'tsql-tran-predict-1') as PredictOutputQuestion;
    expect(outputMatches('2', [q.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('1', [q.expectedOutput], CodeLanguage.SQL)).toBe(false);
    expect(outputMatches('4', [q.expectedOutput], CodeLanguage.SQL)).toBe(false);
  });
});
