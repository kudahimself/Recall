import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// Data modeling, dimensional design, SCD patterns, and pipeline-design
// fundamentals for the Databricks course. This is the "actual data
// engineering" content that the platform was missing — the per-feature
// SQL/Spark drills don't teach you HOW to think about modelling a
// warehouse, when to choose SCD Type 1 vs Type 2, or what makes a
// pipeline safe to re-run.
//
// Sources / mental models: Kimball's "The Data Warehouse Toolkit"
// (dimensional modelling), Databricks lakehouse / medallion architecture
// docs, Lars Rönnbäck on Data Vault, the standard "idempotent pipeline"
// playbook (Schreiber, Z. Shapira et al.).
//
// Coverage:
//   DATA_MODELING (8): star vs snowflake, fact vs dim, grain, surrogate
//     keys, lakehouse vs DW vs lake, additivity, conformed dims, plus a
//     coding question building a small star schema in Spark SQL.
//   SCD_PATTERNS (6): when to use Type 1 vs 2 vs 3, MERGE for SCD1, MERGE
//     for SCD2 with effective dating, plus a Parsons assembly of the
//     SCD2 MERGE.
//   PIPELINE_DESIGN (6): idempotency, exactly-once vs at-least-once,
//     late-arriving data, backfill, idempotent insert via MERGE, data
//     contracts.

export const dataModelingQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // DATA_MODELING (8)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'dm-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'In a Kimball-style dimensional model, what is the difference between a fact table and a dimension table?',
    options: [
      { id: 'a', text: 'They are the same — "fact" and "dimension" are alternative names for the same table type.', isCorrect: false },
      { id: 'b', text: 'Fact tables hold the measurable events (sales, clicks, page views) along with foreign keys to dimensions and numeric measures. Dimension tables hold the descriptive context (customer, product, date) used to slice and filter facts.', isCorrect: true },
      { id: 'c', text: 'Fact tables are append-only; dimension tables are read-only.', isCorrect: false },
      { id: 'd', text: 'Fact tables store strings; dimension tables store numbers.', isCorrect: false },
    ],
    explanation:
      'A fact table records WHAT HAPPENED — typically narrow but very tall (billions of rows), with foreign keys + numeric measures. Dimensions record WHO/WHAT/WHEN/WHERE — wider (more attributes) but short. The "star" in star schema is one fact table surrounded by its dimensions.',
    tags: ['dimensional-modeling', 'fact', 'dimension'],
    concepts: ['dim-star-schema'],
  },
  {
    id: 'dm-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'What is the difference between a star schema and a snowflake schema?',
    options: [
      { id: 'a', text: 'They are different names for the same design.', isCorrect: false },
      { id: 'b', text: 'Star schema keeps each dimension as a single denormalised table joined directly to the fact. Snowflake schema normalises dimensions into multiple linked tables — saving space but requiring more joins to answer the same query.', isCorrect: true },
      { id: 'c', text: 'Star schemas are for OLTP; snowflakes are for OLAP.', isCorrect: false },
      { id: 'd', text: 'Snowflake schema has fewer tables than a star schema.', isCorrect: false },
    ],
    explanation:
      'Star = denormalised, simple, fast queries. Snowflake = normalised, less storage redundancy, more joins. Modern columnar storage (Delta, Parquet) compresses repeated values cheaply, so the storage argument for snowflaking is mostly gone — most lakehouse warehouses default to star.',
    tags: ['star-schema', 'snowflake-schema', 'normalization'],
    concepts: ['dim-star-schema', 'dim-snowflake-schema'],
  },
  {
    id: 'dm-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'In dimensional modelling, what is "the grain" of a fact table, and why does Kimball insist you declare it before adding any column?',
    options: [
      { id: 'a', text: 'Grain is the file format the table is stored in (Parquet, ORC).', isCorrect: false },
      { id: 'b', text: 'Grain is the precise meaning of one row — "one row per X". Declaring it first prevents you from accidentally mixing different event types into the same table, which makes aggregates wrong and queries ambiguous.', isCorrect: true },
      { id: 'c', text: 'Grain is the number of partitions the table has.', isCorrect: false },
      { id: 'd', text: 'Grain is the granularity of the timestamp column.', isCorrect: false },
    ],
    explanation:
      'Examples: "one row per individual order line" vs "one row per order" vs "one row per order per day". The grain decision determines which dimensions can attach, what additivity the measures have, and whether COUNT(*) means anything sensible. Mixing grains in one fact table is the most common reason "the numbers don\'t add up."',
    tags: ['grain', 'dimensional-modeling'],
    concepts: ['dim-grain', 'dim-star-schema'],
  },
  {
    id: 'dm-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'Why do dimensional warehouses prefer surrogate keys (a meaningless integer/hash) over the source system\'s natural key (e.g. customer_email, product_sku)?',
    options: [
      { id: 'a', text: 'Surrogate keys are smaller, so they\'re always faster.', isCorrect: false },
      { id: 'b', text: 'Surrogate keys decouple the warehouse from source-system changes (renamed SKU, merged customers), let you handle SCD Type 2 (a single natural key needs MULTIPLE surrogate keys, one per version), and protect against source-system reuse of IDs across realms.', isCorrect: true },
      { id: 'c', text: 'Natural keys aren\'t allowed in Spark SQL.', isCorrect: false },
      { id: 'd', text: 'Surrogate keys are required by ANSI SQL.', isCorrect: false },
    ],
    explanation:
      'The biggest reason is SCD Type 2: one customer can have many "versions" (address change, name change) and each version needs its own row in dim_customer with its own surrogate key — but they all share the same natural key (customer_id). Without surrogates, you couldn\'t join a fact to the right historical version of the dimension.',
    tags: ['surrogate-keys', 'natural-keys', 'scd'],
    concepts: ['dim-surrogate-key', 'dim-scd-type2'],
  },
  {
    id: 'dm-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'What\'s the difference between additive, semi-additive, and non-additive measures in a fact table?',
    options: [
      { id: 'a', text: 'They\'re sized differently in storage.', isCorrect: false },
      { id: 'b', text: 'Additive measures (revenue, units sold) can be summed across ANY dimension. Semi-additive (account balance, inventory level) can be summed across some dimensions but NOT time — you average or take last value across days. Non-additive (ratios, percentages, distinct counts) can\'t be summed at all; you must recompute from the underlying components.', isCorrect: true },
      { id: 'c', text: 'Additive measures are integers; non-additive are floats.', isCorrect: false },
      { id: 'd', text: 'Only additive measures belong in fact tables.', isCorrect: false },
    ],
    explanation:
      'Why this matters: a BI tool will happily SUM a balance across all days of the month and give you a number that has no meaning. Knowing the additivity of every measure is what stops "we have $30M in deposits" from actually meaning "$1M today, repeated 30 times."',
    tags: ['measures', 'additivity', 'aggregation'],
    concepts: ['dim-additivity', 'ps-groupby-agg'],
  },
  {
    id: 'dm-mcq-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'What is a "conformed dimension" and why does it matter for an enterprise warehouse?',
    options: [
      { id: 'a', text: 'A dimension that has been validated by a data steward.', isCorrect: false },
      { id: 'b', text: 'A dimension that means the SAME thing across multiple fact tables — same surrogate keys, same attributes, same definitions. Conformed dimensions let you join different facts (sales, returns, inventory) on the same customer or date dimension and get consistent answers.', isCorrect: true },
      { id: 'c', text: 'A dimension that has been normalised into 3NF.', isCorrect: false },
      { id: 'd', text: 'A dimension that has fewer than 100 rows.', isCorrect: false },
    ],
    explanation:
      'If sales and returns each have their own private dim_customer, joining "revenue minus returns" by customer becomes painful and error-prone. One conformed dim_customer used by both is what makes cross-process analysis ("net revenue") possible — Kimball calls this "the bus matrix."',
    tags: ['conformed-dimensions', 'enterprise', 'bus-matrix'],
    concepts: ['dim-conformed-dims'],
  },
  {
    id: 'dm-mcq-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question:
      'When choosing between a data lake, a data warehouse, and a lakehouse, which statement best characterises the lakehouse position?',
    options: [
      { id: 'a', text: 'Lakehouse is just a marketing term for a data warehouse.', isCorrect: false },
      { id: 'b', text: 'Lakehouse stores data in open file formats (Parquet) on cheap object storage with a transactional metadata layer (Delta, Iceberg) on top. You get warehouse features — ACID transactions, schema enforcement, time travel — directly on lake-priced storage, with a single source of truth for both BI and ML workloads.', isCorrect: true },
      { id: 'c', text: 'Lakehouses can only run SQL, not Python.', isCorrect: false },
      { id: 'd', text: 'Lakehouses don\'t support BI tools.', isCorrect: false },
    ],
    explanation:
      'Pre-lakehouse, you\'d typically have raw data in a lake (S3) and a curated copy in a warehouse (Snowflake/Redshift) — paying twice for storage and engineering an ETL between them. Lakehouse collapses this: BI tools and ML pipelines query the same Delta tables. Trade-off: warehouse-native engines are still slightly faster on highly-tuned BI workloads.',
    tags: ['lakehouse', 'data-warehouse', 'data-lake', 'architecture'],
    concepts: ['medallion-architecture', 'dbx-architecture'],
  },
  {
    id: 'dm-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: `Build a minimal star schema for retail sales using Spark SQL.

Create three Delta tables in the current database. Each table needs an explicit CREATE TABLE statement (no inferred schemas) and the USING DELTA clause.

dim_customer:
- customer_sk BIGINT (the surrogate key — primary key in spirit; Spark/Delta won't enforce it but treat it as such)
- customer_id STRING (the natural key from the source system)
- name STRING
- email STRING
- city STRING

dim_product:
- product_sk BIGINT
- product_id STRING
- product_name STRING
- category STRING

fact_sales (the grain is "one row per line item on an order"):
- sale_id BIGINT
- order_id BIGINT
- customer_sk BIGINT (FK → dim_customer.customer_sk)
- product_sk BIGINT (FK → dim_product.product_sk)
- order_date DATE
- quantity INT
- unit_price DECIMAL(10,2)
- line_revenue DECIMAL(12,2)

Use simple comments to mark which columns are surrogate keys, foreign keys, and measures.`,
    starterCode: ``,
    testCases: [
      {
        input: 'star schema for retail sales',
        expectedOutput: 'three CREATE TABLE statements (dim_customer, dim_product, fact_sales) using Delta',
        description: 'Should create the dim and fact tables with surrogate-key + FK structure',
      },
    ],
    solution: `-- dim_customer
CREATE TABLE dim_customer (
  customer_sk BIGINT,        -- surrogate key
  customer_id STRING,        -- natural key from source
  name STRING,
  email STRING,
  city STRING
) USING DELTA;

-- dim_product
CREATE TABLE dim_product (
  product_sk BIGINT,         -- surrogate key
  product_id STRING,         -- natural key
  product_name STRING,
  category STRING
) USING DELTA;

-- fact_sales (grain: one row per order line item)
CREATE TABLE fact_sales (
  sale_id BIGINT,
  order_id BIGINT,
  customer_sk BIGINT,        -- FK → dim_customer
  product_sk BIGINT,         -- FK → dim_product
  order_date DATE,
  quantity INT,
  unit_price DECIMAL(10,2),
  line_revenue DECIMAL(12,2) -- additive measure
) USING DELTA;`,
    explanation:
      'The fact table holds foreign keys to its dimensions plus the additive measures (quantity, unit_price, line_revenue). Note we keep BOTH the surrogate key (customer_sk) and the natural key (customer_id) on each dim — surrogate is used for joins, natural is what links back to the source system for debugging. line_revenue could be derived from quantity × unit_price; storing it materialised is a common pragmatic choice for query speed.',
    hints: [
      'Each dim has BOTH a surrogate key (BIGINT, internal) and a natural key (STRING, from source).',
      'The fact table joins dims via the surrogate keys, not the natural ones.',
      'Comment the grain on the fact table — it should be unambiguous from the column list.',
    ],
    tags: ['star-schema', 'create-table', 'delta'],
    concepts: ['dim-star-schema', 'ps-dataframe-create', 'delta-acid'],
  },

  // ────────────────────────────────────────────────────────────────────
  // SCD_PATTERNS (6)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'scd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    question:
      'What is the difference between SCD Type 1 and SCD Type 2 in dimension management?',
    options: [
      { id: 'a', text: 'They\'re identical — different names from different vendors.', isCorrect: false },
      { id: 'b', text: 'Type 1 OVERWRITES the dimension when an attribute changes — only the current value is preserved, history is lost. Type 2 INSERTS a new row for each change, with effective_from / effective_to dates and an is_current flag, so historical facts can still join to the dimension version that was true at the time.', isCorrect: true },
      { id: 'c', text: 'Type 1 is for facts and Type 2 is for dimensions.', isCorrect: false },
      { id: 'd', text: 'Type 2 is faster than Type 1.', isCorrect: false },
    ],
    explanation:
      'Concrete example: a customer moves from London to Dublin. Under SCD1 the row updates and you lose the fact that earlier orders were shipped to London. Under SCD2 the old row\'s is_current flips to false and gets an effective_to date, and a new row is inserted with the Dublin address — every existing order still joins to the right historical version.',
    tags: ['scd', 'type-1', 'type-2'],
    concepts: ['dim-scd-type2', 'dim-scd-type1'],
  },
  {
    id: 'scd-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    question:
      'When should you use SCD Type 1 (overwrite) versus SCD Type 2 (track history)?',
    options: [
      { id: 'a', text: 'Always use Type 2 — history is always valuable.', isCorrect: false },
      { id: 'b', text: 'Use Type 1 for attributes where ONLY the current value matters and history would be misleading or noise (e.g. typo corrections to a customer name). Use Type 2 for attributes whose historical value is needed to correctly interpret past facts (address-at-time-of-shipment, salary-at-time-of-bonus, plan-tier-at-time-of-event).', isCorrect: true },
      { id: 'c', text: 'Use Type 1 for small dimensions, Type 2 for large ones.', isCorrect: false },
      { id: 'd', text: 'Use whichever your dashboard tool supports — they\'re otherwise interchangeable.', isCorrect: false },
    ],
    explanation:
      'A useful test: "If I run last quarter\'s report today, do I want it to reflect the world AS IT WAS, or as it is NOW?" If as-it-was, you need Type 2 history. If as-it-is, Type 1 is fine. Most warehouses end up mixing: Type 1 on cosmetic fields, Type 2 on business-meaningful ones.',
    tags: ['scd', 'design-decision'],
    concepts: ['dim-scd-type2'],
  },
  {
    id: 'scd-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: `Implement an SCD Type 1 update on a Delta dimension table using MERGE.

You have:

- A dimension table dim_customer with columns (customer_id, name, email, city, last_updated_at). customer_id is the natural key.
- A staging table stg_customer_updates with the latest values for some customers (same column set minus last_updated_at, which you'll fill with current_timestamp()).

Write a single MERGE INTO statement that:

- For customers already present in dim_customer (matched on customer_id), updates name, email, city to the staging values and stamps last_updated_at to the current timestamp.
- For customers NOT in dim_customer, inserts a new row with the staging values and current_timestamp() as last_updated_at.

This is SCD Type 1 — old values are simply OVERWRITTEN. No history is preserved.`,
    starterCode: ``,
    testCases: [
      {
        input: 'dim_customer + stg_customer_updates',
        expectedOutput: 'MERGE INTO with WHEN MATCHED UPDATE SET ... WHEN NOT MATCHED INSERT ...',
        description: 'Should perform an SCD Type 1 upsert via MERGE',
      },
    ],
    solution: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id
WHEN MATCHED THEN UPDATE SET
  tgt.name = src.name,
  tgt.email = src.email,
  tgt.city = src.city,
  tgt.last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT (
  customer_id, name, email, city, last_updated_at
) VALUES (
  src.customer_id, src.name, src.email, src.city, current_timestamp()
);`,
    explanation:
      'MERGE is the standard SQL pattern for upserts. The matching predicate (ON) is the natural key. WHEN MATCHED handles existing customers — overwriting all tracked attributes. WHEN NOT MATCHED handles new customers. Since this is Type 1, we don\'t care about old values — they\'re simply lost.',
    hints: [
      'MERGE INTO target USING source ON match_predicate WHEN MATCHED THEN ... WHEN NOT MATCHED THEN ...',
      'Match on the natural key (customer_id), not the surrogate.',
      'current_timestamp() captures the moment of the update.',
    ],
    tags: ['scd-1', 'merge', 'upsert'],
    concepts: ['dim-scd-type1', 'delta-merge'],
  },
  {
    id: 'scd-coding-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: `Implement an SCD Type 2 update on a Delta dimension table using MERGE.

Schema of dim_customer:

- customer_sk BIGINT (surrogate key, generated however — assume it's already populated for existing rows; new rows can use monotonically_increasing_id() inside an INSERT-only path)
- customer_id STRING (natural key)
- name STRING, email STRING, city STRING
- effective_from TIMESTAMP, effective_to TIMESTAMP, is_current BOOLEAN

Staging table stg_customer_updates has (customer_id, name, email, city) — the latest source values for some customers.

Behaviour required:

- For customers in stg whose CURRENT row in dim has DIFFERENT name/email/city: close out the current row by setting effective_to = current_timestamp() and is_current = false. Then insert a brand-new row for that customer with the staging values, effective_from = current_timestamp(), effective_to = NULL (or a far-future sentinel), is_current = true.
- For customers in stg whose current row already matches: do nothing.
- For brand-new customers (not in dim at all): insert one row with effective_from = current_timestamp(), effective_to = NULL, is_current = true.

Write the MERGE in the standard "two-step" style: one MERGE that closes out changed rows, followed by one INSERT (via a separate statement or a CTE-fed INSERT) that adds the new versions and the brand-new customers. The two-step pattern is necessary because a single MERGE can't both UPDATE the old row AND INSERT a new row for the same matching key.

Show both statements.`,
    starterCode: ``,
    testCases: [
      {
        input: 'dim_customer with effective dating + stg_customer_updates',
        expectedOutput: 'Two statements: MERGE that closes changed rows, then INSERT that adds new versions + brand-new customers',
        description: 'Should perform a Type 2 SCD update via the two-step MERGE+INSERT pattern',
      },
    ],
    solution: `-- Step 1: close out the current row for customers whose tracked attrs changed.
MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id
 AND tgt.is_current = true
 AND (tgt.name <> src.name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.effective_to = current_timestamp(),
  tgt.is_current = false;

-- Step 2: insert new versions for those changed customers, plus brand-new customers.
INSERT INTO dim_customer (
  customer_sk, customer_id, name, email, city,
  effective_from, effective_to, is_current
)
SELECT
  monotonically_increasing_id() AS customer_sk,
  src.customer_id,
  src.name, src.email, src.city,
  current_timestamp() AS effective_from,
  CAST(NULL AS TIMESTAMP) AS effective_to,
  true AS is_current
FROM stg_customer_updates src
LEFT JOIN dim_customer dim
  ON dim.customer_id = src.customer_id AND dim.is_current = true
WHERE dim.customer_id IS NULL                                     -- brand-new
   OR (dim.name <> src.name OR dim.email <> src.email OR dim.city <> src.city);  -- changed`,
    explanation:
      'A single MERGE can\'t both close the old row AND insert a new one for the same matching key — the matched UPDATE arm wins and there\'s no way to ALSO append. The "two-step" pattern is the canonical workaround. Step 1\'s MERGE closes out the version-being-replaced. Step 2\'s INSERT adds: (a) brand-new customers (LEFT JOIN with NULL on the right), and (b) the new version for changed customers (the predicate matches the changed-row criterion in step 1). DLT and `dlt.apply_changes(...)` automate this entirely; this exercise teaches the underlying pattern so you understand what DLT is doing.',
    hints: [
      'Step 1: MERGE that only matches the CURRENT row (is_current = true) AND a tracked attribute differs. Closes it out.',
      'Step 2: INSERT new rows for both brand-new customers AND changed customers. Use a LEFT JOIN to find both groups in one query.',
      'A single MERGE cannot both UPDATE the old row and INSERT a new one for the same key.',
    ],
    tags: ['scd-2', 'merge', 'effective-dating'],
    concepts: ['dim-scd-type2', 'delta-merge'],
  },
  {
    id: 'scd-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    question:
      'In an SCD Type 2 dimension, why must facts join to the dimension on the SURROGATE key (e.g. dim_customer.customer_sk) rather than on the NATURAL key (customer_id)?',
    options: [
      { id: 'a', text: 'Surrogate keys are smaller and faster.', isCorrect: false },
      { id: 'b', text: 'Because the natural key is no longer unique in a Type 2 dimension — one customer has multiple rows, one per version. Joining on natural key would either error or fan out the fact rows. The surrogate key is unique per VERSION, so the fact joins to exactly the dim version that was effective when the fact happened.', isCorrect: true },
      { id: 'c', text: 'It\'s a Spark SQL requirement.', isCorrect: false },
      { id: 'd', text: 'Because natural keys can be NULL.', isCorrect: false },
    ],
    explanation:
      'When loading a fact, you have to LOOK UP the right surrogate key for that natural-key-at-that-time. You query dim_customer WHERE customer_id = X AND fact.event_time BETWEEN effective_from AND COALESCE(effective_to, \'9999-12-31\'). The resulting customer_sk is what gets stored in the fact. After that, fact-to-dim joins are simple equi-joins on customer_sk.',
    tags: ['scd-2', 'surrogate-key', 'fact-loading'],
    concepts: ['dim-scd-type2', 'dim-surrogate-key', 'dim-additivity'],
  },
  {
    id: 'scd-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question:
      'Reassemble the Step-1 MERGE that closes out the current row of an SCD Type 2 dimension when any tracked attribute differs from the staging update.',
    correctOrder: [
      'MERGE INTO dim_customer AS tgt',
      'USING stg_customer_updates AS src',
      '  ON tgt.customer_id = src.customer_id',
      ' AND tgt.is_current = true',
      ' AND (tgt.name <> src.name OR tgt.email <> src.email OR tgt.city <> src.city)',
      'WHEN MATCHED THEN UPDATE SET',
      '  tgt.effective_to = current_timestamp(),',
      '  tgt.is_current = false;',
    ],
    distractorLines: [
      ' AND tgt.is_current = false',
      'WHEN MATCHED THEN INSERT INTO dim_customer ...',
    ],
    solution:
      'MERGE INTO dim_customer AS tgt\nUSING stg_customer_updates AS src\n  ON tgt.customer_id = src.customer_id\n AND tgt.is_current = true\n AND (tgt.name <> src.name OR tgt.email <> src.email OR tgt.city <> src.city)\nWHEN MATCHED THEN UPDATE SET\n  tgt.effective_to = current_timestamp(),\n  tgt.is_current = false;',
    explanation:
      'The match predicate has three parts: same natural key, target row is the CURRENT version, and at least one tracked attribute differs. Without `is_current = true`, you\'d match every historical version too. Without the inequality clause, you\'d close rows even when nothing changed. The WHEN MATCHED arm is UPDATE (closing the row), not INSERT — Step 2 handles the insert separately.',
    hints: [
      'Match on natural key + is_current = true + "any tracked column differs".',
      'WHEN MATCHED is UPDATE (close the row), not INSERT.',
    ],
    tags: ['scd-2', 'merge', 'parsons'],
    concepts: ['dim-scd-type2', 'delta-merge'],
  },

  // ────────────────────────────────────────────────────────────────────
  // PIPELINE_DESIGN (6)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'pd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question:
      'What does it mean for a data pipeline to be "idempotent" and why is it the single most important property of a production pipeline?',
    options: [
      { id: 'a', text: 'It runs faster on idempotent infrastructure.', isCorrect: false },
      { id: 'b', text: 'Running the pipeline N times produces the same end state as running it once. This means re-running is always SAFE — you can recover from a failed run, replay a backfill, or re-process a corrected source without producing duplicates or corrupted aggregates.', isCorrect: true },
      { id: 'c', text: 'It can only run once per day.', isCorrect: false },
      { id: 'd', text: 'It uses idempotent SQL functions only.', isCorrect: false },
    ],
    explanation:
      'A non-idempotent pipeline fails the moment something goes wrong: a partial run leaves dirty state, the retry doubles the data, and now you\'re cleaning up by hand. Idempotent pipelines are built around upserts (MERGE on a unique key), partition-overwrites, or "delete-and-insert by partition" — never blind INSERT-AND-APPEND.',
    tags: ['idempotency', 'pipeline-design'],
    concepts: ['dim-idempotency'],
  },
  {
    id: 'pd-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question:
      'In streaming, what\'s the difference between at-least-once, at-most-once, and exactly-once delivery semantics?',
    options: [
      { id: 'a', text: 'They\'re marketing names for the same thing.', isCorrect: false },
      { id: 'b', text: 'At-most-once: messages may be lost, never duplicated. At-least-once: messages are never lost, may be duplicated on retry. Exactly-once: messages are never lost AND never duplicated — usually achieved by combining at-least-once delivery with idempotent writes (so duplicates collapse), not by truly avoiding duplicates over the wire.', isCorrect: true },
      { id: 'c', text: 'Exactly-once is a network-level guarantee.', isCorrect: false },
      { id: 'd', text: 'At-most-once is the default in Spark Structured Streaming.', isCorrect: false },
    ],
    explanation:
      'Spark Structured Streaming + Delta achieves "effectively exactly-once" by combining at-least-once source reads with checkpointed offsets and idempotent sink writes (the same micro-batch ID is recorded with each commit, so re-processing a batch is detected and skipped). True exactly-once over the wire is impossible; what you actually want is "at-least-once delivery + idempotent write" = exactly-once outcome.',
    tags: ['streaming', 'delivery-semantics', 'idempotency'],
    concepts: ['stream-readstream-writestream', 'dim-delivery-semantics', 'dim-idempotency'],
  },
  {
    id: 'pd-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A user event from yesterday arrives in your stream this morning (the mobile app was offline overnight). What strategies handle this "late-arriving data" correctly?',
    options: [
      { id: 'a', text: 'Drop it — the window has already closed.', isCorrect: false },
      { id: 'b', text: 'For streaming aggregations, set a watermark that bounds how late events can arrive (state is held open until then). For windowed batch jobs, prefer event-time partitioning + an idempotent reprocess of affected partitions when late data lands. For unbounded retention, design the table around upserts on event_id so late arrivals merge cleanly.', isCorrect: true },
      { id: 'c', text: 'Use Type 2 SCDs for everything.', isCorrect: false },
      { id: 'd', text: 'Increase the cluster size so it processes faster.', isCorrect: false },
    ],
    explanation:
      'The watermark trades correctness for memory: setting a 2-hour watermark means the engine can finalise and drop window state once event time advances past window_end + 2h, but events arriving 3h late are silently dropped. The right watermark depends on your business tolerance — strict reporting may demand reprocessing the day instead of relying on a watermark.',
    tags: ['late-arriving-data', 'watermark', 'streaming'],
    concepts: ['dim-late-arrivals', 'stream-watermarks', 'stream-readstream-writestream'],
  },
  {
    id: 'pd-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question:
      'You need to backfill three months of historical data into a daily-partitioned silver table. What\'s the safest pattern?',
    options: [
      { id: 'a', text: 'INSERT INTO silver SELECT ... — the new rows just get appended.', isCorrect: false },
      { id: 'b', text: 'For each affected day, REPLACE that partition atomically: either INSERT OVERWRITE PARTITION (date = X) or use Delta\'s replaceWhere with the day predicate. This makes the backfill idempotent — re-running it produces the same end state, and a partial failure leaves the unaffected days untouched.', isCorrect: true },
      { id: 'c', text: 'TRUNCATE the entire table and re-load everything from scratch.', isCorrect: false },
      { id: 'd', text: 'Manually delete duplicate rows after the load completes.', isCorrect: false },
    ],
    explanation:
      'Atomic per-partition replace is the workhorse pattern. INSERT INTO would double the data. TRUNCATE+reload throws away unaffected partitions and is risky on a busy table. Per-partition REPLACE means you can safely re-run individual days without touching the rest, which matches how real backfills end up needing to work (a few days at a time, often re-corrected later).',
    tags: ['backfill', 'partitioning', 'idempotency'],
    concepts: ['dim-backfill', 'ps-partitioning', 'dim-idempotency'],
  },
  {
    id: 'pd-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: `Convert a non-idempotent INSERT into an idempotent MERGE.

You have a Delta target table fct_orders with columns (order_id BIGINT, customer_id BIGINT, order_date DATE, total_amount DECIMAL(12,2), inserted_at TIMESTAMP). order_id is the unique business key.

The current pipeline runs:

  INSERT INTO fct_orders
  SELECT order_id, customer_id, order_date, total_amount, current_timestamp()
  FROM stg_orders;

This is non-idempotent: re-running on the same staging data produces duplicate rows (one per re-run). Replace it with a MERGE that:

- On a match (same order_id), does nothing — orders are immutable once inserted; we don't want to overwrite anything (this is an append-only fact, but with an idempotent insert).
- On no match, inserts the new row with current_timestamp() as inserted_at.

The end state: re-running the pipeline N times produces the same fct_orders as running once.`,
    starterCode: ``,
    testCases: [
      {
        input: 'fct_orders + stg_orders',
        expectedOutput: 'MERGE INTO fct_orders ... WHEN NOT MATCHED THEN INSERT ...',
        description: 'Should make the insert idempotent via a MERGE that no-ops on existing keys',
      },
    ],
    solution: `MERGE INTO fct_orders AS tgt
USING stg_orders AS src
  ON tgt.order_id = src.order_id
WHEN NOT MATCHED THEN INSERT (
  order_id, customer_id, order_date, total_amount, inserted_at
) VALUES (
  src.order_id, src.customer_id, src.order_date, src.total_amount, current_timestamp()
);`,
    explanation:
      'No WHEN MATCHED clause means existing rows are left untouched — the rerun is a complete no-op for them. New rows in stg_orders that don\'t exist in fct_orders are inserted exactly once. This is the canonical "idempotent append" pattern: same staging in → same target out, regardless of how many times you retry. For tables that DO need updates on rematch, you\'d add WHEN MATCHED THEN UPDATE — but the principle is the same: route every write through MERGE on a unique key.',
    hints: [
      'Use MERGE INTO ... USING ... ON unique_key.',
      'Omit WHEN MATCHED entirely — that\'s the no-op for already-present orders.',
      'WHEN NOT MATCHED THEN INSERT for genuinely new orders.',
    ],
    tags: ['idempotency', 'merge', 'append'],
    concepts: ['dim-idempotency', 'delta-merge', 'ps-write-modes'],
  },
  {
    id: 'pd-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question:
      'What is a "data contract" between an upstream producer team and a downstream consumer team?',
    options: [
      { id: 'a', text: 'A legal document signed before data sharing.', isCorrect: false },
      { id: 'b', text: 'A formal, version-controlled agreement that specifies the schema, semantics, freshness SLA, and breaking-change policy of a dataset. The producer commits to NOT making breaking changes without notice; the consumer commits to using only what\'s in the contract (not undocumented columns or behaviours). Schema enforcement, expectations, and CI checks make the contract executable.', isCorrect: true },
      { id: 'c', text: 'The DDL of a Delta table.', isCorrect: false },
      { id: 'd', text: 'A cluster configuration shared between teams.', isCorrect: false },
    ],
    explanation:
      'In the lakehouse era, data contracts are increasingly first-class. Patterns: schemas defined in a registry (Avro, JSON Schema, Protobuf), DLT expectations enforced on bronze→silver, breaking-change CI that fails the producer\'s deploy if a column is dropped/retyped without a migration. The point is to stop "the table changed and three downstream dashboards silently broke" from being how you find out.',
    tags: ['data-contracts', 'schema', 'governance'],
    concepts: ['dim-data-contracts', 'ps-dataframe-create', 'ucat-grants'],
  },
];
