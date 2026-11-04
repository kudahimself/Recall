/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * Analytical & Window SQL coding questions. Each one must pass outright, not
 * land on the "uncertain, self-grade" fallback, and near-miss wrong answers
 * must not.
 *
 * These pin the question-quality fixes: `-- OR` branches for an explicit ROWS
 * running-total frame, ISNULL / COALESCE around a plain LAG, the legacy
 * `WITH ROLLUP` spelling, a CASE without `ELSE 0`, and a native PIVOT that
 * reads from a subquery.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodeLanguage, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, outputMatches, SQL_OUTPUT_CONVENTION } from './predictOutput';

const ACCEPTED: Record<string, string[]> = {
  'tsql-windows-1': [
    `SELECT Category, ProductName, Price, RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS Rnk FROM dbo.DimProduct;`,
    `select Category, ProductName, Price,
       rank() over (partition by Category order by Price desc) as Rnk
     from dbo.DimProduct`,
  ],
  'tsql-frames-1': [
    `SELECT CustomerKey, OrderDate, Amount,
       SUM(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS RunningTotal
     FROM dbo.FactOrders;`,
    `SELECT CustomerKey, OrderDate, Amount,
       SUM(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal
     FROM dbo.FactOrders;`,
  ],
  'tsql-frames-2': [
    `SELECT CustomerKey, OrderDate, Amount,
       AVG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS MovingAvg3
     FROM dbo.FactOrders;`,
  ],
  'tsql-laglead-1': [
    `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS PrevAmount
     FROM dbo.FactOrders;`,
    `SELECT CustomerKey, OrderDate, Amount,
       ISNULL(LAG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate), 0) AS PrevAmount
     FROM dbo.FactOrders;`,
    `SELECT CustomerKey, OrderDate, Amount,
       COALESCE(LAG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate), 0) AS PrevAmount
     FROM dbo.FactOrders;`,
  ],
  'tsql-gs-1': [
    `SELECT Category, SubCategory, SUM(Amount) AS Total FROM dbo.FactSale GROUP BY ROLLUP (Category, SubCategory);`,
    `SELECT Category, SubCategory, SUM(Amount) AS Total FROM dbo.FactSale GROUP BY Category, SubCategory WITH ROLLUP;`,
  ],
  'tsql-gs-2': [
    `SELECT Category, SubCategory, SUM(Amount) AS Total
     FROM dbo.FactSale
     GROUP BY GROUPING SETS ((Category, SubCategory), (Category), ());`,
  ],
  'tsql-pivot-1': [
    `SELECT SUM(CASE WHEN Category = 'Books' THEN Amount ELSE 0 END) AS Books,
            SUM(CASE WHEN Category = 'Toys' THEN Amount ELSE 0 END) AS Toys
     FROM dbo.FactSale;`,
    `SELECT SUM(CASE WHEN Category = 'Books' THEN Amount END) AS Books,
            SUM(CASE WHEN Category = 'Toys' THEN Amount END) AS Toys
     FROM dbo.FactSale;`,
    `SELECT Books, Toys FROM (SELECT Category, Amount FROM dbo.FactSale) AS src
     PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-windows-1': [
    // DENSE_RANK leaves no gaps after a tie
    `SELECT Category, ProductName, Price, DENSE_RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS Rnk FROM dbo.DimProduct;`,
  ],
  'tsql-frames-1': [
    // no ORDER BY: every row gets the customer's whole total
    `SELECT CustomerKey, OrderDate, Amount, SUM(Amount) OVER (PARTITION BY CustomerKey) AS RunningTotal FROM dbo.FactOrders;`,
  ],
  'tsql-laglead-1': [
    // no PARTITION BY: a customer's first order reads another customer's amount
    `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) OVER (ORDER BY OrderDate) AS PrevAmount
     FROM dbo.FactOrders;`,
  ],
  'tsql-gs-1': [
    `SELECT Category, SubCategory, SUM(Amount) AS Total FROM dbo.FactSale GROUP BY CUBE(Category, SubCategory);`,
  ],
  'tsql-pivot-1': [
    // pivots straight off the table, so it groups by SaleId and SubCategory too
    `SELECT Books, Toys FROM dbo.FactSale PIVOT (SUM(Amount) FOR Category IN ([Books], [Toys])) AS p;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'window', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('Analytical & Window SQL coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('Analytical & Window SQL coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});

const WINDOW_TOPICS = new Set<string>([
  Topic.TSQL_WINDOWS, Topic.TSQL_WINDOW_FRAMES, Topic.TSQL_LAG_LEAD, Topic.TSQL_GROUPING_SETS, Topic.TSQL_PIVOT,
]);
const predicts = questions.filter(
  (q): q is PredictOutputQuestion => q.type === QuestionType.PREDICT_OUTPUT && WINDOW_TOPICS.has(q.topic),
);

describe('Analytical & Window SQL predict questions use the rows convention the card shows', () => {
  it('every expected answer is plain rows: comma-separated cells, no pipes, no Col=value', () => {
    expect(predicts.length).toBe(7);
    const offenders = predicts
      .filter(q => outputInstruction(q.code, q.language) !== SQL_OUTPUT_CONVENTION
        || /\||\w=\w/.test(q.expectedOutput))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('the ROLLUP predict accepts the rows written the way the card says', () => {
    // It used to expect `A | 30`, a pipe format the card never asks for.
    const q = predicts.find(p => p.id === 'tsql-gs-rollup-predict-1') as PredictOutputQuestion;
    const accepted = [q.expectedOutput, ...(q.acceptableOutputs ?? [])];
    expect(outputMatches('Books, 30\nToys, 5\nNULL, 35', accepted, CodeLanguage.SQL)).toBe(true);
    expect(outputMatches("'Books',30\n'Toys',5\nnull,35", accepted, CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('Books, 30\nToys, 5', accepted, CodeLanguage.SQL)).toBe(false);
    expect(outputMatches('NULL, 35\nBooks, 30\nToys, 5', accepted, CodeLanguage.SQL)).toBe(false);
  });

  it('the ROLLUP predict no longer accepts the old pipe spelling', () => {
    const q = predicts.find(p => p.id === 'tsql-gs-rollup-predict-1') as PredictOutputQuestion;
    const accepted = [q.expectedOutput, ...(q.acceptableOutputs ?? [])];
    expect(outputMatches('Books | 30\nToys | 5\nNULL | 35', accepted, CodeLanguage.SQL)).toBe(false);
  });

  it('the conditional-aggregation predict accepts its one row of two columns', () => {
    const q = predicts.find(p => p.id === 'tsql-pivot-predict-1') as PredictOutputQuestion;
    expect(outputMatches('30, 5', [q.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('30\t5', [q.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('5, 30', [q.expectedOutput], CodeLanguage.SQL)).toBe(false);
  });
});
