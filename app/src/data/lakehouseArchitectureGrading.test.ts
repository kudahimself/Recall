import { questions } from './questions';
import { QuestionType, CodingQuestion } from '../types';
import { gradeCodingSubmission } from '../utils/codeValidator';

// The coding questions of Lakehouse Architecture & Engineering Practice
// (gold_layer_design, ingestion_architecture, orchestration_design): every
// reference branch passes, the starter does not, and the textbook wrong answer
// fails outright instead of reaching the self-grade panel.

function codingQuestion(id: string): CodingQuestion {
  const q = questions.find(question => question.id === id);
  if (!q || q.type !== QuestionType.CODING) throw new Error(`${id} is not a coding question`);
  return q as CodingQuestion;
}

function verdicts(question: CodingQuestion, code: string): string[] {
  return gradeCodingSubmission(question, code).map(r => r.verdict);
}

function passes(question: CodingQuestion, code: string): boolean {
  const v = verdicts(question, code);
  return v.length > 0 && v.every(x => x === 'pass');
}

function fails(question: CodingQuestion, code: string): boolean {
  const v = verdicts(question, code);
  return v.length > 0 && v.every(x => x === 'fail');
}

const IDS = ['gld-coding-1', 'gld-coding-2', 'ing-coding-1', 'ing-coding-2', 'orc-coding-1', 'orc-coding-2'];

describe.each(IDS)('%s', id => {
  const question = codingQuestion(id);

  it('passes every reference branch', () => {
    for (const branch of question.solution.split(/^\s*(?:#|--) OR\s*$/m)) {
      expect(passes(question, branch.trim())).toBe(true);
    }
  });

  it('does not pass on the starter alone', () => {
    expect(passes(question, question.starterCode)).toBe(false);
  });
});

describe('replaceWhere questions', () => {
  const cases: Array<[string, string, string, string]> = [
    ['gld-coding-2', 'corrected_df', 'sales_summary', "sales_date = '2024-03-15'"],
    ['ing-coding-2', 'updated_df', 'warehouse_inventory', "warehouse_id = 'WH-42'"],
    ['orc-coding-2', 'corrected_df', 'gold_daily_sales', "event_date = '2024-03-15'"],
  ];
  describe.each(cases)('%s', (id, df, table, predicate) => {
    const question = codingQuestion(id);
    const write = (opts: string) => `${df}.write.format("delta").mode("overwrite")${opts}.saveAsTable("${table}")`;

    it('fails a naked overwrite', () => {
      expect(fails(question, write(''))).toBe(true);
    });
    it('fails an append', () => {
      expect(fails(question, `${df}.write.format("delta").mode("append").option("replaceWhere", "${predicate}").saveAsTable("${table}")`)).toBe(true);
    });
    it('fails a replaceWhere on the wrong value', () => {
      const wrong = predicate.replace(/\d{4}-\d{2}-\d{2}|WH-\d+/, m => (m.startsWith('WH') ? 'WH-7' : '2024-03-16'));
      expect(fails(question, write(`.option("replaceWhere", "${wrong}")`))).toBe(true);
    });
    it('accepts == and single quotes', () => {
      expect(verdicts(question, write(`.option("replaceWhere", "${predicate.replace(' = ', ' == ')}")`))).not.toContain('fail');
      expect(verdicts(question, `${df}.write.format('delta').mode('overwrite').option('replaceWhere', "${predicate}").saveAsTable('${table}')`)).not.toContain('fail');
    });
  });
});

describe('gld-coding-1', () => {
  const question = codingQuestion('gld-coding-1');
  it('fails a join before the aggregation', () => {
    expect(fails(question, 'result = orders_df.join(line_items_df, on="order_id", how="left")')).toBe(true);
  });
  it('fails an inner join that drops orders without lines', () => {
    expect(fails(question, 'totals = line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items"))\nresult = orders_df.join(totals, on="order_id", how="inner")')).toBe(true);
  });
  it('accepts an aliased dictionary aggregation', () => {
    expect(verdicts(question, 'import pyspark.sql.functions as F\nt = line_items_df.groupBy("order_id").agg({"quantity": "sum"}).withColumnRenamed("sum(quantity)", "total_items")\nresult = orders_df.join(t, on="order_id", how="left")')).not.toContain('fail');
  });
});

describe('ing-coding-1', () => {
  const question = codingQuestion('ing-coding-1');
  it('fails a partitioned rebuild', () => {
    expect(fails(question, 'CREATE OR REPLACE TABLE page_views PARTITIONED BY (day) AS SELECT * FROM page_views_raw;')).toBe(true);
  });
  it('fails clustering plus partitioning', () => {
    expect(fails(question, 'CREATE OR REPLACE TABLE page_views CLUSTER BY (event_time) PARTITIONED BY (day) AS SELECT * FROM page_views_raw;')).toBe(true);
  });
  it('fails clustering on the wrong column', () => {
    expect(fails(question, 'CREATE OR REPLACE TABLE page_views CLUSTER BY (url) AS SELECT * FROM page_views_raw;')).toBe(true);
  });
  it('accepts lowercase, USING DELTA and a column list', () => {
    expect(verdicts(question, 'create or replace table page_views using delta cluster by (event_time) as select view_id, url, event_time from page_views_raw')).not.toContain('fail');
  });
});

describe('orc-coding-1', () => {
  const question = codingQuestion('orc-coding-1');
  const table = (decorators: string) => `from pyspark import pipelines as dp\n\n@dp.table(name="silver_orders")\n${decorators}\ndef silver_orders():\n    return spark.read.table("bronze_orders")`;
  it('fails expect_or_drop on the hard rule', () => {
    expect(fails(question, table('@dp.expect_or_drop("a", "order_total > 0")\n@dp.expect("b", "customer_id IS NOT NULL")'))).toBe(true);
  });
  it('fails when both rules are fatal', () => {
    expect(fails(question, table('@dp.expect_or_fail("a", "order_total > 0")\n@dp.expect_or_fail("b", "customer_id IS NOT NULL")'))).toBe(true);
  });
  it('fails when both rules only record', () => {
    expect(fails(question, table('@dp.expect("a", "order_total > 0")\n@dp.expect("b", "customer_id IS NOT NULL")'))).toBe(true);
  });
  it('accepts either decorator order and the dlt module', () => {
    expect(verdicts(question, table('@dp.expect("b", "customer_id IS NOT NULL")\n@dp.expect_or_fail("a", "order_total > 0")'))).not.toContain('fail');
    expect(verdicts(question, 'import dlt\n\n@dlt.table(name="silver_orders")\n@dlt.expect_or_fail("a", "order_total > 0")\n@dlt.expect("b", "customer_id IS NOT NULL")\ndef silver_orders():\n    return dlt.read("bronze_orders")')).not.toContain('fail');
  });
});
