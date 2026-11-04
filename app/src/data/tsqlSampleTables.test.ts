import { questions } from './questions';
import { Question, Topic } from '../types';
import { questionSql } from './tsqlSampleTables';
import { definedNames, referencedTables } from '../utils/sqlTableRefs';

const QUERYING_FOUNDATIONS = new Set<string>([
  Topic.TSQL_SELECT, Topic.TSQL_FILTERING, Topic.TSQL_STRING_FUNCTIONS, Topic.TSQL_DATE_FUNCTIONS,
  Topic.TSQL_JOINS, Topic.TSQL_AGGREGATION, Topic.TSQL_SUBQUERIES_CTE, Topic.TSQL_SET_OPS, Topic.TSQL_DML,
]);

const section: Question[] = questions.filter(q => QUERYING_FOUNDATIONS.has(q.topic));

describe('table references', () => {
  it('reads table names and skips the query\'s own aliases and CTEs', () => {
    expect(referencedTables(
      `UPDATE tgt SET tgt.City = src.City
       FROM dbo.DimCustomer AS tgt JOIN stg.Customer src ON src.CustomerId = tgt.CustomerId;`,
    )).toEqual(['dbo.dimcustomer', 'stg.customer']);
    expect(referencedTables(
      `WITH Totals AS (SELECT CustomerKey FROM dbo.FactOrders) SELECT * FROM Totals WHERE 1 = 1;`,
    )).toEqual(['dbo.factorders']);
    expect(referencedTables(`DELETE f FROM dbo.FactOrders AS f JOIN dbo.DimProduct AS p ON p.ProductKey = f.ProductKey;`))
      .toEqual(['dbo.factorders', 'dbo.dimproduct']);
    expect(referencedTables(`-- dbo.Ignored(Col)\nINSERT INTO dbo.DimProduct (ProductName) VALUES ('x');`))
      .toEqual(['dbo.dimproduct']);
    expect(definedNames(`WITH EmpChain AS (SELECT 1) SELECT * FROM EmpChain c`).has('empchain')).toBe(true);
  });
});

describe('Querying Foundations questions show the tables they query', () => {
  it('has questions to check', () => {
    expect(section.length).toBeGreaterThan(80);
  });

  it('every table a question queries is one of the tables it shows', () => {
    const offenders = section.flatMap(q => {
      const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
      return referencedTables(questionSql(q))
        .filter(t => !shown.has(t))
        .map(t => `${q.id} reads ${t} without showing it`);
    });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question queries, with rows that fit its columns', () => {
    const offenders = section.flatMap(q => {
      const refs = new Set(referencedTables(questionSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never queries it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('no question builds its data inline; a CTE appears only where the CTE is what it teaches', () => {
    const offenders = section
      .filter(q => {
        const sql = questionSql(q);
        const inlineValues = /\(\s*VALUES\b/i.test(sql);
        const cte = /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(sql);
        return inlineValues || (cte && !(q.tags ?? []).some(t => t === 'cte' || t === 'recursive-cte'));
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});
