/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * Querying Foundations coding questions. Each one must pass outright, not land
 * on the "uncertain, self-grade" fallback: the learner wrote a right answer.
 *
 * These pin the question-quality fixes (extra `-- OR` branches, `requires`
 * that no longer reject a valid idiom) and the SQL normalizer's symmetric
 * column comparisons (`ON o.k = c.k` is the same predicate as `ON c.k = o.k`,
 * `!=` is `<>`).
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodingQuestion } from '../types';

const ACCEPTED: Record<string, string[]> = {
  'tsql-filter-1': [
    `SELECT FullName, ISNULL(Email, 'none') AS ContactEmail FROM dbo.DimCustomer
     WHERE Country IN ('NO', 'SE') AND FullName IS NOT NULL;`,
    `SELECT FullName, COALESCE(Email, 'none') AS ContactEmail FROM dbo.DimCustomer
     WHERE (Country = 'NO' OR Country = 'SE') AND FullName IS NOT NULL;`,
  ],
  'tsql-str-1': [
    `SELECT UPPER(CONCAT_WS(' - ', Category, ProductName)) AS Label FROM dbo.DimProduct;`,
  ],
  'tsql-str-2': [
    `SELECT Email, LEN(LTRIM(RTRIM(Email))) AS EmailLength FROM stg.Customer;`,
  ],
  'tsql-str-3': [
    `SELECT CustomerId, REPLACE(TRIM(Phone), '-', '') AS Phone FROM stg.Customer;`,
  ],
  'tsql-dt-1': [
    `SELECT OrderId, DATEPART(year, OrderDate) AS OrderYear, DATEPART(month, OrderDate) AS OrderMonth
     FROM dbo.FactOrders;`,
  ],
  'tsql-dt-3': [
    `SELECT OrderId, Amount, CAST(OrderDate AS DATE) AS OrderDay FROM dbo.FactOrders
     WHERE DATEDIFF(DAY, CAST(OrderDate AS DATE), CAST(GETDATE() AS DATE)) > 30;`,
  ],
  'tsql-joins-1': [
    `SELECT c.FullName, o.Amount FROM dbo.DimCustomer c
     JOIN dbo.FactOrders o ON c.CustomerKey = o.CustomerKey WHERE o.Amount > 100;`,
  ],
  'tsql-joins-2': [
    `SELECT c.FullName FROM dbo.DimCustomer c
     LEFT JOIN dbo.FactOrders o ON c.CustomerKey = o.CustomerKey WHERE o.OrderId IS NULL;`,
  ],
  'tsql-joins-3': [
    `SELECT c.FullName, p.ProductName, o.Amount FROM dbo.FactOrders o
     JOIN dbo.DimCustomer c ON o.CustomerKey = c.CustomerKey
     JOIN dbo.DimProduct p ON o.ProductKey = p.ProductKey
     WHERE c.Country = 'NO' AND p.Category = 'Books' ORDER BY o.Amount DESC;`,
  ],
  'tsql-subq-1': [
    `WITH CustomerTotals AS (SELECT CustomerKey, SUM(Amount) AS Total FROM dbo.FactOrders GROUP BY CustomerKey)
     SELECT * FROM CustomerTotals WHERE Total >= 500;`,
  ],
  'tsql-subq-2': [
    `SELECT c.FullName, (SELECT COUNT(*) FROM dbo.FactOrders o WHERE c.CustomerKey = o.CustomerKey) AS OrderCount
     FROM dbo.DimCustomer c;`,
  ],
  'tsql-dml-3': [
    `UPDATE tgt SET tgt.ProductName = src.ProductName FROM dbo.DimProduct tgt
     JOIN stg.Product src ON tgt.ProductKey = src.ProductKey WHERE tgt.ProductName != src.ProductName;`,
  ],
  'tsql-dml-4': [
    `DELETE f FROM dbo.FactOrders f JOIN dbo.DimProduct p ON f.ProductKey = p.ProductKey WHERE p.Discontinued = 1;`,
  ],
};

// Wrong answers that share most tokens with a right one must still not pass.
const REJECTED: Record<string, string[]> = {
  'tsql-joins-2': [
    // INNER JOIN keeps only customers WITH orders
    `SELECT c.FullName FROM dbo.DimCustomer c
     JOIN dbo.FactOrders o ON c.CustomerKey = o.CustomerKey WHERE o.OrderId IS NULL;`,
  ],
  'tsql-filter-1': [
    // `= NULL` is never true
    `SELECT FullName, COALESCE(Email, 'none') AS ContactEmail FROM dbo.DimCustomer
     WHERE Country IN ('NO', 'SE') AND FullName = NULL;`,
  ],
  'tsql-dml-3': [
    // updates rows that already match
    `UPDATE tgt SET tgt.ProductName = src.ProductName FROM dbo.DimProduct tgt
     JOIN stg.Product src ON tgt.ProductKey = src.ProductKey WHERE tgt.ProductName = src.ProductName;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'qf', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('Querying Foundations coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('Querying Foundations coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});
