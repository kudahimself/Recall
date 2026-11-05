/**
 * Correct answers a learner would reasonably write for the SQL for DE
 * Cloud Warehouse SQL coding and cloze questions must pass outright, and
 * near-miss wrong answers must not.
 */
import { questions } from '../data/questions';
import { validateAnswer } from './codeValidator';
import { CodingQuestion, PredictOutputQuestion, QuestionType, Topic } from '../types';
import { outputInstruction, SQL_OUTPUT_CONVENTION } from './predictOutput';

const ID = 'tsql-syn-1';

const ACCEPTED = [
  `CREATE TABLE dbo.FactSalesByCustomer
   WITH (DISTRIBUTION = HASH(CustomerKey), CLUSTERED COLUMNSTORE INDEX)
   AS SELECT CustomerKey, SUM(Amount) AS TotalAmount FROM dbo.FactSales GROUP BY CustomerKey;`,
  `create table dbo.FactSalesByCustomer
   with (clustered columnstore index, distribution = hash (CustomerKey))
   as
   select CustomerKey, sum(Amount) as TotalAmount
   from dbo.FactSales
   group by CustomerKey`,
  `CREATE TABLE dbo.FactSalesByCustomer
   WITH (DISTRIBUTION = HASH([CustomerKey]), CLUSTERED COLUMNSTORE INDEX)
   AS
   SELECT CustomerKey, SUM(Amount) AS TotalAmount
   FROM dbo.FactSales
   GROUP BY CustomerKey;`,
];

const REJECTED = [
  `CREATE TABLE dbo.FactSalesByCustomer WITH (DISTRIBUTION = ROUND_ROBIN, CLUSTERED COLUMNSTORE INDEX) AS SELECT CustomerKey, SUM(Amount) AS TotalAmount FROM dbo.FactSales GROUP BY CustomerKey;`,
  `CREATE TABLE dbo.FactSalesByCustomer WITH (DISTRIBUTION = HASH(Amount), CLUSTERED COLUMNSTORE INDEX) AS SELECT CustomerKey, SUM(Amount) AS TotalAmount FROM dbo.FactSales GROUP BY CustomerKey;`,
  `CREATE TABLE dbo.FactSalesByCustomer WITH (DISTRIBUTION = HASH(CustomerKey), HEAP) AS SELECT CustomerKey, SUM(Amount) AS TotalAmount FROM dbo.FactSales GROUP BY CustomerKey;`,
  `SELECT CustomerKey, SUM(Amount) AS TotalAmount INTO dbo.FactSalesByCustomer FROM dbo.FactSales GROUP BY CustomerKey;`,
  `CREATE TABLE dbo.FactSalesByCustomer WITH (DISTRIBUTION = HASH(CustomerKey), CLUSTERED COLUMNSTORE INDEX) AS SELECT CustomerKey, Amount FROM dbo.FactSales;`,
];

const q = questions.find(x => x.id === ID) as CodingQuestion;
const grade = (code: string) =>
  validateAnswer(code, q.solution, q.language, 'cloud', q.starterCode, { requires: q.requires, requiredKeywords: q.requiredKeywords });

describe('Cloud Warehouse SQL coding question accepts reasonable correct answers', () => {
  ACCEPTED.forEach((code, i) => {
    it(`${ID} accepted answer ${i + 1}`, () => {
      const r = grade(code);
      expect({ verdict: r.verdict, error: r.error }).toEqual({ verdict: 'pass', error: undefined });
    });
  });
});

describe('Cloud Warehouse SQL coding question rejects near-miss wrong answers', () => {
  REJECTED.forEach((code, i) => {
    it(`${ID} rejected answer ${i + 1}`, () => {
      expect(grade(code).verdict).not.toBe('pass');
    });
  });
});

describe('Cloud Warehouse SQL predict questions state the answer they expect', () => {
  const predicts = questions.filter(
    (p): p is PredictOutputQuestion =>
      p.type === QuestionType.PREDICT_OUTPUT &&
      [Topic.TSQL_MPP_MODEL, Topic.TSQL_SYNAPSE_FABRIC, Topic.TSQL_OTHER_WAREHOUSES].includes(p.topic as Topic),
  );

  it('every predict uses the comma rows convention and says how to write the answer', () => {
    expect(predicts.length).toBe(3);
    const offenders = predicts
      .filter(p => /\||\w=\w/.test(p.expectedOutput) || outputInstruction(p.code, p.language) !== SQL_OUTPUT_CONVENTION)
      .map(p => p.id);
    expect(offenders).toEqual([]);
  });
});
