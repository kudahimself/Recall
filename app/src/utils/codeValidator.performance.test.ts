/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * Performance & Optimization coding questions. Each one must pass outright,
 * not land on the "uncertain, self-grade" fallback, and near-miss wrong
 * answers must not.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodeLanguage, CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, outputMatches, SQL_OUTPUT_CONVENTION } from './predictOutput';

const ACCEPTED: Record<string, string[]> = {
  'tsql-idx-1': [
    `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date ON dbo.FactOrders (CustomerKey, OrderDate) INCLUDE (Amount);`,
    `CREATE INDEX IX_FactOrders_Cust_Date
     ON dbo.FactOrders (CustomerKey, OrderDate)
     INCLUDE (Amount);`,
    `create nonclustered index IX_FactOrders_Cust_Date on dbo.FactOrders (CustomerKey, OrderDate) include (Amount)`,
    `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date ON dbo.FactOrders (CustomerKey ASC, OrderDate ASC) INCLUDE (Amount);`,
  ],
  'tsql-anti-1': [
    `SELECT OrderId, Amount FROM dbo.FactOrders WHERE OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01';`,
    `SELECT OrderId, Amount
     FROM dbo.FactOrders
     WHERE OrderDate < '2027-01-01' AND OrderDate >= '2026-01-01'`,
    `SELECT OrderId, Amount FROM dbo.FactOrders WHERE OrderDate >= '20260101' AND OrderDate < '20270101';`,
  ],
  'tsql-col-1': [
    `CREATE CLUSTERED COLUMNSTORE INDEX CCI_FactOrders ON dbo.FactOrders;`,
    `create clustered columnstore index CCI_FactOrders
     on dbo.FactOrders`,
  ],
  'tsql-part-1': [
    `ALTER TABLE dbo.FactSales_Stash SWITCH TO dbo.FactSales PARTITION 3;`,
    `alter table dbo.FactSales_Stash
     switch to dbo.FactSales partition 3`,
  ],
};

const REJECTED: Record<string, string[]> = {
  'tsql-idx-1': [
    `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date ON dbo.FactOrders (OrderDate, CustomerKey) INCLUDE (Amount);`,
    `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date ON dbo.FactOrders (CustomerKey, OrderDate, Amount);`,
    `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date ON dbo.FactOrders (CustomerKey) INCLUDE (Amount);`,
  ],
  'tsql-anti-1': [
    `SELECT OrderId, Amount FROM dbo.FactOrders WHERE YEAR(OrderDate) = 2026;`,
    `SELECT OrderId, Amount FROM dbo.FactOrders WHERE OrderDate BETWEEN '2026-01-01' AND '2026-12-31';`,
    `SELECT OrderId, Amount FROM dbo.FactOrders WHERE OrderDate >= '2026-01-01';`,
  ],
  'tsql-col-1': [
    `CREATE NONCLUSTERED COLUMNSTORE INDEX CCI_FactOrders ON dbo.FactOrders (Amount);`,
    `CREATE CLUSTERED INDEX CCI_FactOrders ON dbo.FactOrders (OrderId);`,
  ],
  'tsql-part-1': [
    `ALTER TABLE dbo.FactSales SWITCH TO dbo.FactSales_Stash PARTITION 3;`,
    `ALTER TABLE dbo.FactSales_Stash SWITCH TO dbo.FactSales PARTITION 2;`,
    `ALTER TABLE dbo.FactSales_Stash SWITCH TO dbo.FactSales;`,
  ],
};

const byId = new Map(questions.map(q => [q.id, q as CodingQuestion]));

function grade(id: string, code: string) {
  const q = byId.get(id);
  if (!q) throw new Error(`no question ${id}`);
  return validateAnswer(code, q.solution, q.language, 'performance', q.starterCode, {
    requires: q.requires,
    requiredKeywords: q.requiredKeywords,
  });
}

describe('Performance & Optimization coding questions accept reasonable correct answers', () => {
  Object.entries(ACCEPTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} accepted answer ${i + 1}`, () => {
        const r = grade(id, code);
        expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
      });
    });
  });
});

describe('Performance & Optimization coding questions still reject near-miss wrong answers', () => {
  Object.entries(REJECTED).forEach(([id, answers]) => {
    answers.forEach((code, i) => {
      it(`${id} rejected answer ${i + 1}`, () => {
        expect(grade(id, code).verdict).not.toBe('pass');
      });
    });
  });
});

const PERFORMANCE_TOPICS = new Set<string>([
  Topic.TSQL_INDEXES, Topic.TSQL_EXECUTION_PLANS, Topic.TSQL_PARTITIONING, Topic.TSQL_COLUMNSTORE, Topic.TSQL_ANTIPATTERNS,
]);

describe('Performance & Optimization predict questions state the answer they expect', () => {
  const predicts = questions.filter(
    (q): q is PredictOutputQuestion => q.type === QuestionType.PREDICT_OUTPUT && PERFORMANCE_TOPICS.has(q.topic),
  );

  it('every predict uses the comma rows convention and names its row shape in the prompt', () => {
    expect(predicts.length).toBe(5);
    const offenders = predicts
      .filter(q => /\||\w=\w/.test(q.expectedOutput) || outputInstruction(q.code, q.language) !== SQL_OUTPUT_CONVENTION)
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('the two-column predicts take plain comma rows', () => {
    const idx = predicts.find(p => p.id === 'tsql-idx-predict-1') as PredictOutputQuestion;
    expect(outputMatches('4, 2026-02-20\n4, 2026-03-09\n7, 2026-03-01\n9, 2026-01-15\n9, 2026-03-02', [idx.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('4, 2026-03-09\n4, 2026-02-20\n7, 2026-03-01\n9, 2026-01-15\n9, 2026-03-02', [idx.expectedOutput], CodeLanguage.SQL)).toBe(false);
    const part = predicts.find(p => p.id === 'tsql-part-predict-1') as PredictOutputQuestion;
    expect(outputMatches('1, 1\n2, 2\n3, 2\n4, 3\n5, 4', [part.expectedOutput], CodeLanguage.SQL)).toBe(true);
    expect(outputMatches('1, 1\n2, 1\n3, 2\n4, 3\n5, 4', [part.expectedOutput], CodeLanguage.SQL)).toBe(false);
  });
});
