/**
 * Correct answers a learner would reasonably write for the SQL for DE Data
 * Modeling in SQL coding questions. Each one must pass outright, not land on
 * the "uncertain, self-grade" fallback, and near-miss wrong answers must not.
 *
 * These pin the question-quality fixes: table-level FOREIGN KEY constraints
 * and NUMERIC for the fact DDL, a table-level UNIQUE, a star query with or
 * without ORDER BY, flipped join sides, MERGE with the optional BY TARGET,
 * and an EXISTS form of the Type 2 expire step.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodeLanguage, ClozeCodeQuestion, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, outputMatches, SQL_OUTPUT_CONVENTION } from './predictOutput';

const ACCEPTED: Record<string, string[]> = {
  'tsql-facts-1': [
    `CREATE TABLE dbo.FactOrderLine (
       OrderLineKey BIGINT IDENTITY PRIMARY KEY,
       CustomerKey  INT NOT NULL REFERENCES dbo.DimCustomer (CustomerKey),
       ProductKey   INT NOT NULL REFERENCES dbo.DimProduct (ProductKey),
       OrderNumber  NVARCHAR(20) NOT NULL,
       Quantity     INT NOT NULL,
       LineAmount   DECIMAL(12, 2) NOT NULL
     );`,
    `CREATE TABLE dbo.FactOrderLine (
       OrderLineKey BIGINT IDENTITY(1, 1) PRIMARY KEY,
       CustomerKey  INT NOT NULL,
       ProductKey   INT NOT NULL,
       OrderNumber  NVARCHAR(20) NOT NULL,
       Quantity     INT NOT NULL,
       LineAmount   DECIMAL(12, 2) NOT NULL,
       FOREIGN KEY (CustomerKey) REFERENCES dbo.DimCustomer (CustomerKey),
       FOREIGN KEY (ProductKey) REFERENCES dbo.DimProduct (ProductKey)
     );`,
    `CREATE TABLE dbo.FactOrderLine (
       OrderLineKey BIGINT IDENTITY PRIMARY KEY,
       CustomerKey  INT NOT NULL FOREIGN KEY REFERENCES dbo.DimCustomer (CustomerKey),
       ProductKey   INT NOT NULL FOREIGN KEY REFERENCES dbo.DimProduct (ProductKey),
       OrderNumber  NVARCHAR(20) NOT NULL,
       Quantity     INT NOT NULL,
       LineAmount   DECIMAL(12,2) NOT NULL
     )`,
    `create table dbo.FactOrderLine (
       OrderLineKey bigint identity primary key,
       CustomerKey  int not null references dbo.DimCustomer (CustomerKey),
       ProductKey   int not null references dbo.DimProduct (ProductKey),
       OrderNumber  nvarchar(20) not null,
       Quantity     int not null,
       LineAmount   decimal(12, 2) not null
     );`,
  ],
  'tsql-surr-1': [
    `CREATE TABLE dbo.DimProduct (
       ProductKey  INT IDENTITY(1, 1) PRIMARY KEY,
       ProductCode NVARCHAR(30) NOT NULL UNIQUE,
       ProductName NVARCHAR(120) NOT NULL,
       Category    NVARCHAR(60) NULL
     );`,
    `CREATE TABLE dbo.DimProduct (
       ProductKey  INT IDENTITY PRIMARY KEY,
       ProductCode NVARCHAR(30) NOT NULL UNIQUE,
       ProductName NVARCHAR(120) NOT NULL,
       Category    NVARCHAR(60)
     );`,
    `CREATE TABLE dbo.DimProduct (
       ProductKey  INT IDENTITY(1, 1) PRIMARY KEY,
       ProductCode NVARCHAR(30) NOT NULL,
       ProductName NVARCHAR(120) NOT NULL,
       Category    NVARCHAR(60) NULL,
       CONSTRAINT UQ_DimProduct_ProductCode UNIQUE (ProductCode)
     );`,
  ],
  'tsql-star-1': [
    `SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
     FROM dbo.FactSales AS f
     JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
     JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
     GROUP BY c.Country, p.Category;`,
    `SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
     FROM dbo.FactSales AS f
     JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
     JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
     GROUP BY c.Country, p.Category
     ORDER BY c.Country, p.Category;`,
    `SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
     FROM dbo.FactSales f
     INNER JOIN dbo.DimCustomer c ON f.CustomerKey = c.CustomerKey
     INNER JOIN dbo.DimProduct p ON f.ProductKey = p.ProductKey
     GROUP BY c.Country, p.Category`,
    `SELECT c.Country, p.Category, SUM(f.Amount) AS TotalSales
     FROM dbo.FactSales AS f
     JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
     JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
     GROUP BY p.Category, c.Country;`,
  ],
  'tsql-scd-1': [
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN
         UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category
     WHEN NOT MATCHED BY TARGET THEN
         INSERT (ProductCode, ProductName, Category)
         VALUES (src.ProductCode, src.ProductName, src.Category);`,
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON src.ProductCode = tgt.ProductCode
     WHEN MATCHED THEN
         UPDATE SET tgt.Category = src.Category, tgt.ProductName = src.ProductName
     WHEN NOT MATCHED THEN
         INSERT (ProductCode, ProductName, Category)
         VALUES (src.ProductCode, src.ProductName, src.Category);`,
  ],
  'tsql-scd-2': [
    `UPDATE tgt
       SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
     FROM dbo.DimProduct AS tgt
       JOIN stg.Product AS src ON src.ProductCode = tgt.ProductCode
     WHERE tgt.IsCurrent = 1 AND tgt.Category <> src.Category;`,
    `UPDATE tgt
       SET EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0
     FROM dbo.DimProduct AS tgt
       INNER JOIN stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHERE tgt.IsCurrent = 1 AND tgt.Category != src.Category;`,
    `UPDATE tgt
       SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
     FROM dbo.DimProduct AS tgt
     WHERE tgt.IsCurrent = 1
       AND EXISTS (SELECT 1 FROM stg.Product AS src
                   WHERE src.ProductCode = tgt.ProductCode AND src.Category <> tgt.Category);`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-facts-1': [
    // measure typed as INT, no FK to the product dimension
    `CREATE TABLE dbo.FactOrderLine (
       OrderLineKey BIGINT IDENTITY PRIMARY KEY,
       CustomerKey  INT NOT NULL REFERENCES dbo.DimCustomer (CustomerKey),
       OrderNumber  NVARCHAR(20) NOT NULL,
       Quantity     INT NOT NULL,
       LineAmount   INT NOT NULL
     );`,
  ],
  'tsql-surr-1': [
    // natural key not UNIQUE, surrogate not generated
    `CREATE TABLE dbo.DimProduct (
       ProductKey  INT PRIMARY KEY,
       ProductCode NVARCHAR(30) NOT NULL,
       ProductName NVARCHAR(120) NOT NULL,
       Category    NVARCHAR(60) NULL
     );`,
  ],
  'tsql-star-1': [
    // only one dimension joined
    `SELECT p.Category, SUM(f.Amount) AS TotalSales
     FROM dbo.FactSales AS f
     JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey
     GROUP BY p.Category;`,
    // no aggregation
    `SELECT c.Country, p.Category, f.Amount AS TotalSales
     FROM dbo.FactSales AS f
     JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
     JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey;`,
  ],
  'tsql-scd-1': [
    // update only, new products never inserted
    `MERGE dbo.DimProduct AS tgt
     USING stg.Product AS src ON tgt.ProductCode = src.ProductCode
     WHEN MATCHED THEN
         UPDATE SET tgt.ProductName = src.ProductName, tgt.Category = src.Category;`,
  ],
  'tsql-scd-2': [
    // deletes the history instead of closing it
    `DELETE tgt
     FROM dbo.DimProduct AS tgt
       JOIN stg.Product AS src ON src.ProductCode = tgt.ProductCode
     WHERE tgt.IsCurrent = 1 AND tgt.Category <> src.Category;`,
    // closes every current row, changed or not
    `UPDATE dbo.DimProduct SET EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0 WHERE IsCurrent = 1;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'modeling', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('Data Modeling coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('Data Modeling coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});

const MODELING_TOPICS = new Set<string>([
  Topic.TSQL_FACTS_DIMS, Topic.TSQL_SURROGATE_KEYS, Topic.TSQL_STAR_SCHEMA, Topic.TSQL_SCD, Topic.TSQL_NORMALIZATION,
]);

describe('Data Modeling cloze blanks accept the equivalent spellings', () => {
  const cloze = (id: string) => questions.find(q => q.id === id) as ClozeCodeQuestion;
  const accepts = (id: string, idx: number, got: string) => {
    const q = cloze(id);
    const norm = (v: string) => v.trim().replace(/\s+/g, ' ').toLowerCase();
    return [q.blanks[idx], ...(q.blankAlternates?.[idx] ?? [])].some(a => norm(a) === norm(got));
  };

  it('the FK keyword may carry FOREIGN KEY and the money type may be NUMERIC', () => {
    expect(accepts('tsql-facts-cloze-1', 0, 'FOREIGN KEY REFERENCES')).toBe(true);
    expect(accepts('tsql-facts-cloze-1', 1, 'NUMERIC')).toBe(true);
    expect(accepts('tsql-facts-cloze-1', 1, 'FLOAT')).toBe(false);
  });

  it('NOT MATCHED may omit BY TARGET, and the WHEN clause stays strict', () => {
    expect(accepts('tsql-scd-cloze-1', 1, 'NOT MATCHED')).toBe(true);
    expect(accepts('tsql-scd-cloze-1', 1, 'NOT MATCHED BY SOURCE')).toBe(false);
    expect(accepts('tsql-scd-cloze-1', 0, 'NOT MATCHED')).toBe(false);
  });
});

describe('Data Modeling predict questions state the answer they expect', () => {
  const predicts = questions.filter(
    (q): q is PredictOutputQuestion => q.type === QuestionType.PREDICT_OUTPUT && MODELING_TOPICS.has(q.topic),
  );

  it('a query predict uses the comma rows convention and asks for a value or rows', () => {
    expect(predicts.length).toBe(5);
    const offenders = predicts
      .filter(q => /\||\w=\w/.test(q.expectedOutput) || outputInstruction(q.code, q.language) !== SQL_OUTPUT_CONVENTION)
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('the multi-row predict takes plain comma rows', () => {
    const q = predicts.find(p => p.id === 'tsql-scd-predict-1') as PredictOutputQuestion;
    expect(outputMatches('Leeds, 50\nYork, 25', [q.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('York, 25\nLeeds, 50', [q.expectedOutput], CodeLanguage.SQL)).toBe(false);
    expect(outputMatches('Leeds, 75', [q.expectedOutput], CodeLanguage.SQL)).toBe(false);
  });
});
