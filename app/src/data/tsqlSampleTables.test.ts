import { questions } from './questions';
import { Question, QuestionType, Topic } from '../types';
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

const DDL_AND_CONSTRAINTS = new Set<string>([
  Topic.TSQL_DDL_TABLES, Topic.TSQL_TYPES, Topic.TSQL_CONSTRAINTS, Topic.TSQL_VIEWS,
]);

const ddlSection: Question[] = questions.filter(q => DDL_AND_CONSTRAINTS.has(q.topic));

/** Tables and views the SQL makes itself: CREATE TABLE / VIEW targets and temp tables. */
function createdNames(sql: string): Set<string> {
  const code = sql.replace(/--[^\n]*/g, '');
  const names = new Set<string>();
  for (const m of Array.from(code.matchAll(/\bCREATE\s+(?:OR\s+ALTER\s+)?(?:TABLE|VIEW)\s+(#?[\w.]+)/gi))) {
    names.add(m[1].toLowerCase());
  }
  for (const m of Array.from(code.matchAll(/#{1,2}\w+/g))) names.add(m[0].toLowerCase());
  return names;
}

describe('DDL & Constraints questions show the existing tables they read', () => {
  it('has the whole section to check', () => {
    expect(ddlSection.length).toBe(27);
  });

  it('every existing table a question reads or alters is one of the tables it shows', () => {
    // MCQs here compare statements as concepts and run against no data.
    const offenders = ddlSection
      .filter(q => q.type !== QuestionType.MULTIPLE_CHOICE)
      .flatMap(q => {
        const sql = questionSql(q);
        const created = createdNames(sql);
        const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
        return referencedTables(sql)
          .filter(t => !created.has(t) && !shown.has(t))
          .map(t => `${q.id} reads ${t} without showing it`);
      });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question reads, with rows that fit its columns', () => {
    const offenders = ddlSection.flatMap(q => {
      const sql = questionSql(q);
      const refs = new Set(referencedTables(sql));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) && !createdNames(sql).has(t.name.toLowerCase())
          ? [] : [`${q.id} shows ${t.name} but does not read an existing table by that name`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('no question builds sample data inline with a VALUES derived table or a CTE', () => {
    const offenders = ddlSection
      .filter(q => /\(\s*VALUES\b/i.test(questionSql(q)) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('no cloze template describes a table it then creates with different columns', () => {
    // A `-- dbo.T(cols)` header claims T already exists; above `CREATE TABLE dbo.T` it contradicts the statement.
    const offenders = ddlSection
      .filter(q => q.type === QuestionType.CLOZE_CODE)
      .filter(q => {
        const tpl = (q as { template: string }).template;
        const headers = Array.from(tpl.matchAll(/^--\s*([\w.]+)\(/gm)).map(m => m[1].toLowerCase());
        return headers.some(h => createdNames(tpl).has(h));
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});

const ANALYTICAL_AND_WINDOW = new Set<string>([
  Topic.TSQL_WINDOWS, Topic.TSQL_WINDOW_FRAMES, Topic.TSQL_LAG_LEAD, Topic.TSQL_GROUPING_SETS, Topic.TSQL_PIVOT,
]);

const windowSection: Question[] = questions.filter(q => ANALYTICAL_AND_WINDOW.has(q.topic));

describe('Analytical & Window SQL questions show the tables they query', () => {
  it('has the whole section to check', () => {
    expect(windowSection.length).toBe(34);
  });

  it('every table a question queries is one of the tables it shows', () => {
    const offenders = windowSection.flatMap(q => {
      const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
      return referencedTables(questionSql(q))
        .filter(t => !shown.has(t))
        .map(t => `${q.id} reads ${t} without showing it`);
    });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question queries, with rows that fit its columns', () => {
    const offenders = windowSection.flatMap(q => {
      const refs = new Set(referencedTables(questionSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never queries it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('every predict question reads from a shown table, not inline VALUES or a CTE', () => {
    const offenders = windowSection
      .filter(q => {
        const sql = questionSql(q);
        return /\(\s*VALUES\b/i.test(sql) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(sql)
          || (q.type === QuestionType.PREDICT_OUTPUT && (q.tables ?? []).length === 0);
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('a native PIVOT reads from a subquery of only the columns it uses', () => {
    // PIVOT groups by every input column it does not pivot, so straight off
    // dbo.FactSale it would return one row per sale instead of one total row.
    const offenders = windowSection
      .filter(q => /\bPIVOT\s*\(/i.test(questionSql(q)))
      .filter(q => questionSql(q).split(/^-- OR$/m).some(branch =>
        /\bPIVOT\s*\(/i.test(branch) && /\bFROM\s+dbo\.FactSale\s+PIVOT\b/i.test(branch)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});
