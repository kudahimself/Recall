/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * ELT & Transformation Patterns coding questions. Each one must pass
 * outright, not land on the "uncertain, self-grade" fallback, and near-miss
 * wrong answers must not.
 *
 * These pin the question-quality fixes: MERGE INTO and a bare WHEN NOT MATCHED,
 * CREATE PROC with BEGIN TRANSACTION / COMMIT TRANSACTION and a guarded
 * ROLLBACK, DELETE through the CTE name or an INNER JOIN fact load with the aliases the prompt names, the
 * watermark read as a DECLARE initialiser or a SET, and COALESCE or
 * HAVING >= 2 in the quality checks.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { blankMatches } from '../components/ClozeCodeQuestion';
import { ClozeCodeQuestion, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, SQL_OUTPUT_CONVENTION, SQL_PRINT_CONVENTION, SQL_MIXED_PRINT_CONVENTION } from './predictOutput';

const ACCEPTED: Record<string, string[]> = {
  'tsql-insert-1': [
    `INSERT INTO dbo.FactSales (CustomerKey, ProductKey, Amount)
     SELECT c.CustomerKey, p.ProductKey, s.Amount
     FROM stg.Sales AS s
     INNER JOIN dbo.DimCustomer AS c ON c.CustomerId = s.CustomerId
     INNER JOIN dbo.DimProduct AS p ON p.ProductCode = s.ProductCode;`,
    `INSERT INTO dbo.FactSales (CustomerKey, ProductKey, Amount)
     SELECT c.CustomerKey, p.ProductKey, s.Amount
     FROM stg.Sales s
     JOIN dbo.DimCustomer c ON c.CustomerId = s.CustomerId
     JOIN dbo.DimProduct p ON p.ProductCode = s.ProductCode`,
  ],
  'tsql-merge-1': [
    `MERGE INTO dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category
     WHEN NOT MATCHED BY TARGET THEN INSERT (ProductCode, ProductName, Category) VALUES (src.ProductCode, src.ProductName, src.Category)
     WHEN NOT MATCHED BY SOURCE THEN DELETE;`,
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category
     WHEN NOT MATCHED THEN INSERT (ProductCode, ProductName, Category) VALUES (src.ProductCode, src.ProductName, src.Category)
     WHEN NOT MATCHED BY SOURCE THEN DELETE;`,
    `MERGE INTO dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category
     WHEN NOT MATCHED THEN INSERT (ProductCode, ProductName, Category) VALUES (src.ProductCode, src.ProductName, src.Category)
     WHEN NOT MATCHED BY SOURCE THEN DELETE;`,
  ],
  'tsql-dedup-1': [
    `WITH d AS (
       SELECT ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn
       FROM stg.Orders
     )
     DELETE d WHERE rn > 1;`,
    `WITH d AS (
       SELECT OrderId, ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn
       FROM stg.Orders
     )
     DELETE FROM d
     WHERE rn > 1;`,
  ],
  'tsql-etlproc-1': [
    `CREATE PROC dbo.LoadDimProduct
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         BEGIN TRANSACTION;
           MERGE dbo.DimProduct AS tgt
           USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
           WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
           WHEN NOT MATCHED BY TARGET THEN INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);
         COMMIT TRANSACTION;
       END TRY
       BEGIN CATCH
         ROLLBACK TRANSACTION;
         THROW;
       END CATCH
     END;`,
    `CREATE OR ALTER PROCEDURE dbo.LoadDimProduct
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         BEGIN TRAN;
           MERGE INTO dbo.DimProduct AS tgt
           USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
           WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
           WHEN NOT MATCHED THEN INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);
         COMMIT;
       END TRY
       BEGIN CATCH
         IF @@TRANCOUNT > 0 ROLLBACK;
         THROW;
       END CATCH
     END;`,
  ],
  'tsql-etlproc-2': [
    `DECLARE @lastLoaded DATETIME2 = (SELECT LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales');
     INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
     SELECT s.OrderId, s.Amount, s.UpdatedAt FROM stg.Sales AS s WHERE s.UpdatedAt > @lastLoaded;
     UPDATE dbo.EtlControl SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales) WHERE TableName = 'FactSales';`,
    `DECLARE @lastLoaded DATETIME2;
     SET @lastLoaded = (SELECT LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales');
     INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
     SELECT s.OrderId, s.Amount, s.UpdatedAt FROM stg.Sales AS s WHERE s.UpdatedAt > @lastLoaded;
     UPDATE dbo.EtlControl SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales) WHERE TableName = 'FactSales';`,
  ],
  'tsql-etlproc-3': [
    `CREATE PROC dbo.LoadDimCustomerSCD2
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         BEGIN TRANSACTION;
           UPDATE tgt SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
           FROM dbo.DimCustomer AS tgt JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId
           WHERE tgt.IsCurrent = 1 AND tgt.City <> src.City;
           INSERT INTO dbo.DimCustomer (CustomerId, City, EffectiveDate, EndDate, IsCurrent)
           SELECT src.CustomerId, src.City, CAST(GETDATE() AS DATE), NULL, 1
           FROM stg.Customer AS src
           WHERE NOT EXISTS (SELECT 1 FROM dbo.DimCustomer AS tgt WHERE tgt.CustomerId = src.CustomerId AND tgt.IsCurrent = 1);
         COMMIT TRANSACTION;
       END TRY
       BEGIN CATCH
         ROLLBACK TRANSACTION;
         THROW;
       END CATCH
     END;`,
  ],
  'tsql-incr-1': [
    `SELECT COALESCE(MAX(UpdatedAt), '1900-01-01') AS NewWatermark FROM dbo.FactSales;`,
    `SELECT ISNULL(MAX(UpdatedAt), '1900-01-01') AS NewWatermark FROM dbo.FactSales`,
  ],
  'tsql-quality-1': [
    `SELECT COUNT(*) AS BadRows FROM dbo.FactSales WHERE Amount < 0 OR Amount IS NULL;`,
    `SELECT COUNT(*) AS BadRows FROM dbo.FactSales WHERE Amount IS NULL OR Amount < 0`,
  ],
  'tsql-quality-2': [
    `SELECT CustomerId, COUNT(*) AS NumRows FROM dbo.DimCustomer GROUP BY CustomerId HAVING COUNT(*) >= 2;`,
    `SELECT CustomerId, COUNT(*) AS NumRows
     FROM dbo.DimCustomer
     GROUP BY CustomerId
     HAVING COUNT(*) > 1
     ORDER BY CustomerId;`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-insert-1': [
    // no join to the dimensions: loads the natural keys
    `INSERT INTO dbo.FactSales (CustomerKey, ProductKey, Amount)
     SELECT s.CustomerId, s.ProductCode, s.Amount FROM stg.Sales AS s;`,
  ],
  'tsql-merge-1': [
    // no WHEN NOT MATCHED BY SOURCE branch
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category
     WHEN NOT MATCHED BY TARGET THEN INSERT (ProductCode, ProductName, Category) VALUES (src.ProductCode, src.ProductName, src.Category);`,
    // deletes nothing: only an update
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category;`,
  ],
  'tsql-dedup-1': [
    // keeps the oldest row: ascending order
    `WITH d AS (
       SELECT ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt) AS rn FROM stg.Orders
     )
     DELETE FROM d WHERE rn > 1;`,
    // selects instead of deleting
    `WITH d AS (
       SELECT ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn FROM stg.Orders
     )
     SELECT * FROM d WHERE rn = 1;`,
  ],
  'tsql-etlproc-1': [
    // no transaction
    `CREATE PROCEDURE dbo.LoadDimProduct
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         MERGE dbo.DimProduct AS tgt
         USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
         WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
         WHEN NOT MATCHED BY TARGET THEN INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);
       END TRY
       BEGIN CATCH
         THROW;
       END CATCH
     END;`,
    // swallows the error instead of re-throwing
    `CREATE PROCEDURE dbo.LoadDimProduct
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         BEGIN TRAN;
           MERGE dbo.DimProduct AS tgt
           USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
           WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
           WHEN NOT MATCHED BY TARGET THEN INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);
         COMMIT;
       END TRY
       BEGIN CATCH
         ROLLBACK;
         PRINT ERROR_MESSAGE();
       END CATCH
     END;`,
  ],
  'tsql-etlproc-2': [
    // filters with < : reloads old rows and skips new ones
    `DECLARE @lastLoaded DATETIME2 = (SELECT LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales');
     INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
     SELECT s.OrderId, s.Amount, s.UpdatedAt FROM stg.Sales AS s WHERE s.UpdatedAt < @lastLoaded;
     UPDATE dbo.EtlControl SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales) WHERE TableName = 'FactSales';`,
  ],
  'tsql-etlproc-3': [
    // never re-throws
    `CREATE PROCEDURE dbo.LoadDimCustomerSCD2
     AS
     BEGIN
       SET XACT_ABORT ON;
       BEGIN TRY
         BEGIN TRAN;
           UPDATE tgt SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
           FROM dbo.DimCustomer AS tgt JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId
           WHERE tgt.IsCurrent = 1 AND tgt.City <> src.City;
         COMMIT;
       END TRY
       BEGIN CATCH
         ROLLBACK;
       END CATCH
     END;`,
  ],
  'tsql-incr-1': [
    // no NULL floor
    `SELECT MAX(UpdatedAt) AS NewWatermark FROM dbo.FactSales;`,
  ],
  'tsql-quality-1': [
    // misses the NULLs
    `SELECT COUNT(*) AS BadRows FROM dbo.FactSales WHERE Amount < 0;`,
  ],
  'tsql-quality-2': [
    // keys that appear exactly once
    `SELECT CustomerId, COUNT(*) AS NumRows FROM dbo.DimCustomer GROUP BY CustomerId HAVING COUNT(*) = 1;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'elt', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('ELT & Transformation coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('ELT & Transformation coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});

describe('ELT & Transformation cloze blanks accept the equivalent spellings', () => {
  const cloze = (id: string) => questions.find(q => q.id === id) as ClozeCodeQuestion;
  const accepts = (id: string, idx: number, got: string) => blankMatches(cloze(id), idx, got);

  it('MERGE INTO is as good as MERGE, but USING is not', () => {
    expect(accepts('tsql-merge-cloze-1', 0, 'MERGE INTO')).toBe(true);
    expect(accepts('tsql-merge-cloze-1', 0, 'USING')).toBe(false);
  });

  it('the load procedure takes PROC, TRANSACTION and the long COMMIT spellings', () => {
    expect(accepts('tsql-etlproc-cloze-1', 0, 'PROC')).toBe(true);
    expect(accepts('tsql-etlproc-cloze-1', 1, 'TRANSACTION')).toBe(true);
    expect(accepts('tsql-etlproc-cloze-1', 2, 'COMMIT TRAN')).toBe(true);
    expect(accepts('tsql-etlproc-cloze-1', 2, 'COMMIT TRANSACTION')).toBe(true);
    expect(accepts('tsql-etlproc-cloze-1', 2, 'ROLLBACK')).toBe(false);
  });

  it('rn <= 1 keeps the same rows as rn = 1', () => {
    expect(accepts('tsql-dedup-cloze-1', 1, '<=')).toBe(true);
    expect(accepts('tsql-dedup-cloze-1', 1, '>')).toBe(false);
  });

  it('the watermark comparison is strictly greater', () => {
    expect(accepts('tsql-incr-cloze-1', 0, '>')).toBe(true);
    expect(accepts('tsql-incr-cloze-1', 0, '>=')).toBe(false);
  });
});

const ELT_TOPICS = new Set<string>([
  Topic.TSQL_INSERT, Topic.TSQL_MERGE, Topic.TSQL_DEDUP, Topic.TSQL_ETL_PROC, Topic.TSQL_INCREMENTAL, Topic.TSQL_QUALITY,
]);
const predicts = questions.filter(
  (q): q is PredictOutputQuestion => q.type === QuestionType.PREDICT_OUTPUT && ELT_TOPICS.has(q.topic),
);

describe('ELT & Transformation predict questions state the answer they expect', () => {
  it('a query predict uses the comma rows convention and says "return"; a PRINT predict names PRINT', () => {
    expect(predicts.length).toBe(6);
    const offenders = predicts
      .filter(q => {
        const conv = outputInstruction(q.code, q.language);
        if (/\||\w=\w/.test(q.expectedOutput)) return true;
        if (conv === SQL_OUTPUT_CONVENTION) return !/\breturn\b/i.test(q.question) && !/\bpick up\b/i.test(q.question);
        if (conv === SQL_MIXED_PRINT_CONVENTION || conv === SQL_PRINT_CONVENTION) return !/\bprint\b/i.test(q.question);
        return true;
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});
