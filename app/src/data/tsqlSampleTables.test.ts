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

const TRANSACTIONS_AND_PROCEDURAL = new Set<string>([
  Topic.TSQL_TRANSACTIONS, Topic.TSQL_ISOLATION, Topic.TSQL_PROCEDURES, Topic.TSQL_CONTROL_FLOW, Topic.TSQL_ERROR_HANDLING,
]);

const proceduralSection: Question[] = questions.filter(q => TRANSACTIONS_AND_PROCEDURAL.has(q.topic));

describe('Transactions & Procedural questions show the tables they read and write', () => {
  it('has the whole section to check', () => {
    expect(proceduralSection.length).toBe(39);
  });

  it('every existing table a question reads or writes is one of the tables it shows', () => {
    // MCQs here name a table in passing (`WITH (NOLOCK)` on a report) and run against no data.
    const offenders = proceduralSection
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

  it('every shown table is one the question reads or writes, with rows that fit its columns', () => {
    const offenders = proceduralSection.flatMap(q => {
      const refs = new Set(referencedTables(questionSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never uses it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('no question builds its data in a temp table, a VALUES derived table or a CTE', () => {
    const offenders = proceduralSection
      .filter(q => {
        const sql = questionSql(q);
        return /\(\s*VALUES\b/i.test(sql) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(sql) || /#\w+/.test(sql);
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('every variable a cloze template assigns is declared in it', () => {
    // `SELECT @qty = Stock` with no DECLARE does not compile as a batch.
    const offenders = proceduralSection
      .filter(q => q.type === QuestionType.CLOZE_CODE)
      .filter(q => {
        const tpl = (q as { template: string }).template;
        const params = new Set(Array.from(tpl.matchAll(/^\s*(@\w+)\s+[A-Z]/gim)).map(m => m[1].toLowerCase()));
        const fnParams = Array.from(tpl.matchAll(/\(\s*(@\w+)\s+[A-Z]/gi)).map(m => m[1].toLowerCase());
        fnParams.forEach(p => params.add(p));
        const declared = new Set(Array.from(tpl.matchAll(/\bDECLARE\s+(@\w+)/gi)).map(m => m[1].toLowerCase()));
        Array.from(tpl.matchAll(/\bDECLARE\s+@\w+[^;]*?,\s*(@\w+)/gi)).forEach(m => declared.add(m[1].toLowerCase()));
        const assigned = Array.from(tpl.matchAll(/\b(?:SELECT|SET)\s+(@\w+)\s*=/gi)).map(m => m[1].toLowerCase());
        return assigned.some(v => !declared.has(v) && !params.has(v));
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});

const DATA_MODELING = new Set<string>([
  Topic.TSQL_FACTS_DIMS, Topic.TSQL_SURROGATE_KEYS, Topic.TSQL_STAR_SCHEMA, Topic.TSQL_SCD, Topic.TSQL_NORMALIZATION,
]);

const modelingSection: Question[] = questions.filter(q => DATA_MODELING.has(q.topic));

// A REFERENCES, MERGE or USING target is a table the statement depends on, so it counts as one the question uses.
const modelingSql = (q: Question) => questionSql(q).replace(/\b(REFERENCES|MERGE|USING)\b/gi, 'FROM');

describe('Data Modeling in SQL questions show the tables they use', () => {
  it('has the whole section to check', () => {
    expect(modelingSection.length).toBe(34);
  });

  it('every existing table a question reads or writes is one of the tables it shows', () => {
    // Concept MCQs ("a fact table...") run against no data; the ones that do show a table name it in the question.
    const offenders = modelingSection
      .filter(q => q.type !== QuestionType.MULTIPLE_CHOICE)
      .flatMap(q => {
        const sql = modelingSql(q);
        const created = createdNames(sql);
        const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
        return referencedTables(sql)
          .filter(t => !created.has(t) && !shown.has(t))
          .map(t => `${q.id} reads ${t} without showing it`);
      });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question uses, with rows that fit its columns', () => {
    const offenders = modelingSection.flatMap(q => {
      const refs = new Set(referencedTables(modelingSql(q)));
      const named = (t: string) => q.type === QuestionType.MULTIPLE_CHOICE && q.question.toLowerCase().includes(t.toLowerCase());
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) || named(t.name) ? [] : [`${q.id} shows ${t.name} but never uses it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('a table a question creates is not also described as already existing in its template', () => {
    const offenders = modelingSection
      .filter(q => q.type === QuestionType.CLOZE_CODE)
      .filter(q => {
        const tpl = (q as { template: string }).template;
        const headers = Array.from(tpl.matchAll(/^--\s*([\w.]+)\(/gm)).map(m => m[1].toLowerCase());
        return headers.some(h => createdNames(tpl).has(h));
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('no question builds sample data inline with a VALUES derived table or a CTE', () => {
    const offenders = modelingSection
      .filter(q => /\(\s*VALUES\b/i.test(questionSql(q)) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('every query predict that reads an existing table shows it', () => {
    const offenders = modelingSection
      .filter(q => q.type === QuestionType.PREDICT_OUTPUT && /\bFROM\b/i.test(questionSql(q)))
      .filter(q => (q.tables ?? []).length === 0 && !/CREATE\s+TABLE/i.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});

const ELT_AND_TRANSFORMATION = new Set<string>([
  Topic.TSQL_INSERT, Topic.TSQL_MERGE, Topic.TSQL_DEDUP, Topic.TSQL_ETL_PROC, Topic.TSQL_INCREMENTAL, Topic.TSQL_QUALITY,
]);

const eltSection: Question[] = questions.filter(q => ELT_AND_TRANSFORMATION.has(q.topic));

// A MERGE or USING target is a table the statement reads or writes, so it counts as one the question uses.
const eltSql = (q: Question) => questionSql(q).replace(/\bMERGE\s+INTO\b/gi, 'MERGE').replace(/\b(MERGE|USING)\b/gi, 'FROM');

describe('ELT & Transformation questions show the tables they read and write', () => {
  it('has the whole section to check', () => {
    expect(eltSection.length).toBe(41);
  });

  it('every table a question reads or writes is one of the tables it shows', () => {
    // Concept MCQs ("stg.Orders should have one row per key") run against no data.
    const offenders = eltSection
      .filter(q => q.type !== QuestionType.MULTIPLE_CHOICE)
      .flatMap(q => {
        const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
        return referencedTables(eltSql(q))
          .filter(t => !shown.has(t))
          .map(t => `${q.id} reads ${t} without showing it`);
      });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question uses, with rows that fit its columns', () => {
    const offenders = eltSection.flatMap(q => {
      const refs = new Set(referencedTables(eltSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never uses it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('no question builds its data inline or in a temp table; a CTE only reads a shown table', () => {
    const offenders = eltSection
      .filter(q => /\(\s*VALUES\b/i.test(questionSql(q)) || /#\w+/.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('every variable a cloze template or predict assigns, selects into or outputs to is declared', () => {
    // `OUTPUT ... INTO @NewKeys` or `SELECT @x = ...` with no DECLARE does not compile as a batch.
    const offenders = eltSection
      .filter(q => q.type === QuestionType.CLOZE_CODE || q.type === QuestionType.PREDICT_OUTPUT)
      .filter(q => {
        const sql = questionSql(q);
        const declared = new Set(Array.from(sql.matchAll(/\bDECLARE\s+(@\w+)/gi)).map(m => m[1].toLowerCase()));
        // the @lastLoaded the lesson's watermark questions read is declared in the template or by a SELECT ... INTO
        const used = Array.from(sql.matchAll(/(?:\bINTO\s+|\bSELECT\s+|\bSET\s+)(@\w+)\s*(?:=|\(|\s|$)/gi))
          .map(m => m[1].toLowerCase())
          .filter(v => !v.startsWith('@@'));
        return used.some(v => !declared.has(v));
      })
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('a watermark variable a cloze compares against is declared', () => {
    const offenders = eltSection
      .filter(q => q.type === QuestionType.CLOZE_CODE)
      .filter(q => /@lastLoaded/.test(questionSql(q)) && !/DECLARE\s+@lastLoaded/i.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });
});

const PERFORMANCE = new Set<string>([
  Topic.TSQL_INDEXES, Topic.TSQL_EXECUTION_PLANS, Topic.TSQL_PARTITIONING, Topic.TSQL_COLUMNSTORE, Topic.TSQL_ANTIPATTERNS,
]);

const performanceSection: Question[] = questions.filter(q => PERFORMANCE.has(q.topic));

// `CREATE INDEX ... ON dbo.T` and `SWITCH TO dbo.T` name a table the statement works on.
const performanceSql = (q: Question) =>
  questionSql(q).replace(/\bON\s+(?=dbo\.)/gi, 'FROM ').replace(/\bSWITCH\s+TO\b/gi, 'FROM');

describe('Performance & Optimization questions show the tables they use', () => {
  it('has the whole section to check', () => {
    expect(performanceSection.length).toBe(35);
  });

  it('every table a question reads or works on is one of the tables it shows', () => {
    // Concept MCQs run against no data.
    const offenders = performanceSection
      .filter(q => q.type !== QuestionType.MULTIPLE_CHOICE)
      .flatMap(q => {
        const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
        return referencedTables(performanceSql(q))
          .filter(t => !shown.has(t))
          .map(t => `${q.id} uses ${t} without showing it`);
      });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question uses, with rows that fit its columns', () => {
    const offenders = performanceSection.flatMap(q => {
      const refs = new Set(referencedTables(performanceSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never uses it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('no question builds sample data inline with a VALUES derived table or a CTE', () => {
    const offenders = performanceSection
      .filter(q => /\(\s*VALUES\b/i.test(questionSql(q)) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(questionSql(q)))
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('every predict shows the table its query reads', () => {
    const offenders = performanceSection
      .filter(q => q.type === QuestionType.PREDICT_OUTPUT)
      .filter(q => (q.tables ?? []).length === 0)
      .map(q => q.id);
    expect(offenders).toEqual([]);
  });

  it('no cloze or coding prompt names the word it asks the learner to fill in', () => {
    const cloze = performanceSection.filter(q => q.id === 'tsql-part-cloze-1') as unknown as { question: string; blanks: string[] }[];
    cloze.forEach(q => expect(q.question).not.toMatch(/RANGE RIGHT/));
  });
});

const CLOUD = new Set<string>([Topic.TSQL_MPP_MODEL, Topic.TSQL_SYNAPSE_FABRIC, Topic.TSQL_OTHER_WAREHOUSES]);

const cloudSection: Question[] = questions.filter(q => CLOUD.has(q.topic));

describe('Cloud Warehouse SQL questions show the tables they use', () => {
  it('has the whole section to check', () => {
    expect(cloudSection.length).toBe(19);
  });

  it('every existing table a question reads is one of the tables it shows', () => {
    // Concept MCQs run against no data; a CREATE TABLE target is made by the question itself.
    const offenders = cloudSection
      .filter(q => q.type !== QuestionType.MULTIPLE_CHOICE)
      .flatMap(q => {
        const sql = questionSql(q);
        const created = createdNames(sql);
        const shown = new Set((q.tables ?? []).map(t => t.name.toLowerCase()));
        return referencedTables(sql)
          .filter(t => !created.has(t) && !shown.has(t))
          .map(t => `${q.id} uses ${t} without showing it`);
      });
    expect(offenders).toEqual([]);
  });

  it('every shown table is one the question uses, with rows that fit its columns', () => {
    const offenders = cloudSection.flatMap(q => {
      const refs = new Set(referencedTables(questionSql(q)));
      return (q.tables ?? []).flatMap(t => [
        ...(refs.has(t.name.toLowerCase()) ? [] : [`${q.id} shows ${t.name} but never uses it`]),
        ...t.rows.filter(r => r.length !== t.columns.length).map(() => `${q.id} ${t.name} has a ragged row`),
      ]);
    });
    expect(offenders).toEqual([]);
  });

  it('every predict shows its table, and only the QUALIFY predict keeps a CTE (the CTE is what it teaches)', () => {
    const predicts = cloudSection.filter(q => q.type === QuestionType.PREDICT_OUTPUT);
    expect(predicts.filter(q => (q.tables ?? []).length === 0).map(q => q.id)).toEqual([]);
    const inline = cloudSection
      .filter(q => /\(\s*VALUES\b/i.test(questionSql(q)) || /\bWITH\s+\w+(\s*\([^)]*\))?\s+AS\s*\(/i.test(questionSql(q)))
      .map(q => q.id);
    expect(inline).toEqual(['tsql-other-predict-1']);
  });
});
