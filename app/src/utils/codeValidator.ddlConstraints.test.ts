/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * DDL & Constraints coding questions. Each one must pass outright, not land on
 * the "uncertain, self-grade" fallback, and near-miss wrong answers must not.
 *
 * These pin the question-quality fixes: `-- OR` branches for column-level
 * named constraints and the ISO basic date literal, prompts that name the
 * constraints and aliases the grader needs, and a `requires` that no longer
 * rejects `CREATE OR ALTER VIEW`.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodingQuestion } from '../types';

const ACCEPTED: Record<string, string[]> = {
  'tsql-ddl-create-1': [
    `CREATE TABLE dbo.DimCustomer (CustomerKey INT, FullName NVARCHAR(100), Email NVARCHAR(255), CreatedAt DATETIME2(7));`,
    `create table dbo.DimCustomer (
       CustomerKey int primary key, FullName nvarchar(100) not null, Email nvarchar(255) null, CreatedAt datetime2
     )`,
  ],
  'tsql-ddl-selectinto-1': [
    `SELECT OrderId, CustomerKey, Amount INTO #StageOrders FROM dbo.FactOrders WHERE OrderDate >= '2026-10-01'`,
    `SELECT OrderId, CustomerKey, Amount INTO #StageOrders FROM dbo.FactOrders WHERE OrderDate >= '20261001';`,
    `SELECT o.OrderId, o.CustomerKey, o.Amount INTO #StageOrders FROM dbo.FactOrders o WHERE o.OrderDate >= '2026-10-01';`,
  ],
  'tsql-constraints-1': [
    // named FK and CHECK as table-level constraints, PK and UNIQUE also table-level
    `CREATE TABLE dbo.FactOrders (
       OrderId INT NOT NULL, CustomerKey INT NOT NULL, OrderRef NVARCHAR(40),
       Amount DECIMAL(10,2) NOT NULL, IsShipped BIT NOT NULL DEFAULT (0),
       CONSTRAINT PK_FactOrders PRIMARY KEY (OrderId),
       CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerKey) REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE CASCADE,
       CONSTRAINT UQ_Orders_OrderRef UNIQUE (OrderRef),
       CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0));`,
    // named FK and CHECK right after their columns
    `CREATE TABLE dbo.FactOrders (
       OrderId INT PRIMARY KEY,
       CustomerKey INT NOT NULL CONSTRAINT FK_Orders_Customer REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE CASCADE,
       OrderRef NVARCHAR(40) UNIQUE,
       Amount DECIMAL(10, 2) NOT NULL CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0),
       IsShipped BIT DEFAULT 0);`,
    // column-level FK with the optional FOREIGN KEY keywords
    `CREATE TABLE dbo.FactOrders (
       OrderId INT PRIMARY KEY,
       CustomerKey INT NOT NULL CONSTRAINT FK_Orders_Customer FOREIGN KEY REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE CASCADE,
       OrderRef NVARCHAR(40) UNIQUE,
       Amount DECIMAL(10, 2) NOT NULL,
       IsShipped BIT DEFAULT 0,
       CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0));`,
  ],
  'tsql-views-1': [
    `CREATE VIEW dbo.vSalesByCustomer AS
     SELECT c.CustomerKey, c.FullName, SUM(o.Amount) AS TotalAmount
     FROM dbo.DimCustomer AS c INNER JOIN dbo.FactOrders AS o ON c.CustomerKey = o.CustomerKey
     GROUP BY c.CustomerKey, c.FullName;`,
    `CREATE OR ALTER VIEW dbo.vSalesByCustomer AS
     SELECT c.CustomerKey, c.FullName, SUM(o.Amount) AS TotalAmount
     FROM dbo.DimCustomer c JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
     GROUP BY c.FullName, c.CustomerKey`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-ddl-selectinto-1': [
    // `>` drops the orders placed on 2026-10-01 itself
    `SELECT OrderId, CustomerKey, Amount INTO #StageOrders FROM dbo.FactOrders WHERE OrderDate > '2026-10-01';`,
  ],
  'tsql-constraints-1': [
    // no cascade
    `CREATE TABLE dbo.FactOrders (
       OrderId INT PRIMARY KEY, CustomerKey INT NOT NULL, OrderRef NVARCHAR(40) UNIQUE,
       Amount DECIMAL(10, 2) NOT NULL, IsShipped BIT DEFAULT 0,
       CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerKey) REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE NO ACTION,
       CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0));`,
    // `> 0` rejects a zero amount
    `CREATE TABLE dbo.FactOrders (
       OrderId INT PRIMARY KEY,
       CustomerKey INT NOT NULL CONSTRAINT FK_Orders_Customer REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE CASCADE,
       OrderRef NVARCHAR(40) UNIQUE,
       Amount DECIMAL(10, 2) NOT NULL CONSTRAINT CK_Orders_Amount CHECK (Amount > 0),
       IsShipped BIT DEFAULT 0);`,
    // no UNIQUE on OrderRef
    `CREATE TABLE dbo.FactOrders (
       OrderId INT PRIMARY KEY,
       CustomerKey INT NOT NULL CONSTRAINT FK_Orders_Customer REFERENCES dbo.DimCustomer (CustomerKey) ON DELETE CASCADE,
       OrderRef NVARCHAR(40),
       Amount DECIMAL(10, 2) NOT NULL CONSTRAINT CK_Orders_Amount CHECK (Amount >= 0),
       IsShipped BIT DEFAULT 0);`,
  ],
  'tsql-views-1': [
    `CREATE VIEW dbo.vSalesByCustomer AS
     SELECT c.CustomerKey, c.FullName, COUNT(o.Amount) AS TotalAmount
     FROM dbo.DimCustomer c JOIN dbo.FactOrders o ON o.CustomerKey = c.CustomerKey
     GROUP BY c.CustomerKey, c.FullName;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'ddl', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('DDL & Constraints coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('DDL & Constraints coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});
