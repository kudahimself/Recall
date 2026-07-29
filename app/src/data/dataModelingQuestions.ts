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
      'In a Kimball-style dimensional model, what is the primary structural difference between a fact table and a dimension table?',
    options: [
      { id: 'a', text: 'Fact tables store numeric measures and foreign keys to dimensions; dimension tables store descriptive context attributes used for slicing and filtering', isCorrect: true },
      { id: 'b', text: 'Fact tables are append-only physical tables, whereas dimension tables are transient SQL views calculated dynamically during user queries', isCorrect: false },
      { id: 'c', text: 'Fact tables store string attributes exclusively, whereas dimension tables contain floating-point numeric measurements and metrics', isCorrect: false },
      { id: 'd', text: 'Fact tables enforce rigid primary key constraints, whereas dimension tables allow duplicate natural keys across all record columns', isCorrect: false },
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
      'What is the structural difference between a star schema and a snowflake schema in dimensional modeling?',
    options: [
      { id: 'a', text: 'Star schemas maintain denormalized dimension tables joined directly to facts; snowflake schemas normalize dimensions into normalized sub-tables', isCorrect: true },
      { id: 'b', text: 'Star schemas store data in flat CSV files, whereas snowflake schemas rely exclusively on proprietary columnar binary data formats', isCorrect: false },
      { id: 'c', text: 'Star schemas are restricted to online transaction processing (OLTP), whereas snowflake schemas are built for analytical data warehouses', isCorrect: false },
      { id: 'd', text: 'Star schemas generate higher query join overhead, whereas snowflake schemas simplify query predicates by consolidating all attributes', isCorrect: false },
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
      'In dimensional modeling, what is "the grain" of a fact table, and why must it be established before defining columns?',
    options: [
      { id: 'a', text: 'Grain specifies the physical file storage format (Parquet, ORC, Delta) used to persist underlying table data files on object storage', isCorrect: false },
      { id: 'b', text: 'Grain defines the precise business meaning of a single table row, ensuring aggregates remain mathematically accurate across queries', isCorrect: true },
      { id: 'c', text: 'Grain dictates the exact number of shuffle partitions configured during Spark DataFrame transformations across cluster worker nodes', isCorrect: false },
      { id: 'd', text: 'Grain measures the network throughput latency experienced when transferring query results from worker nodes back to the driver', isCorrect: false },
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
      'Why do dimensional warehouses utilize surrogate keys rather than source system natural keys for dimension tables?',
    options: [
      { id: 'a', text: 'Surrogate keys decouple the warehouse from source changes, enable historical version tracking in SCD Type 2, and prevent key collision', isCorrect: true },
      { id: 'b', text: 'Surrogate keys are required by ANSI SQL standards to enable foreign key cascade deletes across distributed Delta tables', isCorrect: false },
      { id: 'c', text: 'Natural keys cannot be indexed or processed by Apache Spark SQL Catalyst optimizer engines during DataFrame joins', isCorrect: false },
      { id: 'd', text: 'Natural keys automatically enforce row-level security policies across Unity Catalog schemas without requiring SQL UDF masks', isCorrect: false },
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
      'How do additive, semi-additive, and non-additive measures differ within a fact table?',
    options: [
      { id: 'a', text: 'Additive measures sum across all dimensions; semi-additive cannot sum across time; non-additive cannot be summed directly', isCorrect: true },
      { id: 'b', text: 'Additive measures are stored as 64-bit integers; semi-additive are stored as floats; non-additive are stored as string values', isCorrect: false },
      { id: 'c', text: 'Additive measures apply only to bronze tables; semi-additive apply to silver tables; non-additive apply strictly to gold tables', isCorrect: false },
      { id: 'd', text: 'Additive measures require foreign key constraints; semi-additive require primary keys; non-additive require surrogate keys', isCorrect: false },
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
      'What is a "conformed dimension" and why is it essential for enterprise data warehousing?',
    options: [
      { id: 'a', text: 'A single dimension shared across multiple fact tables with consistent surrogate keys and definitions, enabling cross-process analytics', isCorrect: true },
      { id: 'b', text: 'A temporary dimension created dynamically inside a SQL WITH clause to optimize subquery execution plans on single tables', isCorrect: false },
      { id: 'c', text: 'A highly normalized dimension table adhering strictly to third normal form (3NF) to eliminate structural data redundancy', isCorrect: false },
      { id: 'd', text: 'A specialized system catalog table maintained by Unity Catalog to track table access permissions and user query lineage', isCorrect: false },
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
      'Which statement best describes the architectural positioning of a Lakehouse compared to legacy Data Lakes and Data Warehouses?',
    options: [
      { id: 'a', text: 'Lakehouses combine cheap cloud object storage with transactional metadata layers (Delta/Iceberg) for ACID queries and ML workloads', isCorrect: true },
      { id: 'b', text: 'Lakehouses replace open file formats with proprietary binary blobs accessible exclusively through closed SQL query engines', isCorrect: false },
      { id: 'c', text: 'Lakehouses restrict query processing to Python DataFrames and disable standard SQL access for business intelligence tools', isCorrect: false },
      { id: 'd', text: 'Lakehouses eliminate the need for schema enforcement and data quality checks across all bronze, silver, and gold pipelines', isCorrect: false },
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
- customer_sk BIGINT (surrogate key)
- customer_id STRING (natural key)
- name STRING
- email STRING
- city STRING

dim_product:
- product_sk BIGINT (surrogate key)
- product_id STRING (natural key)
- product_name STRING
- category STRING

fact_sales (grain: one row per line item on an order):
- sale_id BIGINT
- order_id BIGINT
- customer_sk BIGINT (FK -> dim_customer.customer_sk)
- product_sk BIGINT (FK -> dim_product.product_sk)
- order_date DATE
- quantity INT
- unit_price DECIMAL(10,2)
- line_revenue DECIMAL(12,2)`,
    starterCode: `-- Define star schema tables\n`,
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
  customer_sk BIGINT,        -- FK -> dim_customer
  product_sk BIGINT,         -- FK -> dim_product
  order_date DATE,
  quantity INT,
  unit_price DECIMAL(10,2),
  line_revenue DECIMAL(12,2)
) USING DELTA;
-- OR
CREATE TABLE IF NOT EXISTS dim_customer (
  customer_sk BIGINT,
  customer_id STRING,
  name STRING,
  email STRING,
  city STRING
) USING DELTA;

CREATE TABLE IF NOT EXISTS dim_product (
  product_sk BIGINT,
  product_id STRING,
  product_name STRING,
  category STRING
) USING DELTA;

CREATE TABLE IF NOT EXISTS fact_sales (
  sale_id BIGINT,
  order_id BIGINT,
  customer_sk BIGINT,
  product_sk BIGINT,
  order_date DATE,
  quantity INT,
  unit_price DECIMAL(10,2),
  line_revenue DECIMAL(12,2)
) USING DELTA;`,
    explanation:
      'This creates a classic Star Schema in Delta format. In Spark/Delta, foreign key constraints are not enforced at write time (they are informational metadata in Unity Catalog), but structuring tables this way is essential for efficient dimensional joins and analytical queries.',
    tieredHints: {
      apiSignature: 'CREATE TABLE table_name (col_name data_type, ...) USING DELTA',
      skeleton: `CREATE TABLE dim_customer (
  customer_sk BIGINT,
  customer_id STRING,
  name STRING,
  email STRING,
  city STRING
) ____ DELTA;

CREATE TABLE dim_product (
  product_sk BIGINT,
  product_id STRING,
  product_name STRING,
  category STRING
) ____ DELTA;

CREATE TABLE fact_sales (
  sale_id BIGINT,
  order_id BIGINT,
  customer_sk BIGINT,
  product_sk BIGINT,
  order_date DATE,
  quantity INT,
  unit_price DECIMAL(10,2),
  line_revenue DECIMAL(12,2)
) ____ DELTA;`,
    },
    hints: [
      'Write 3 CREATE TABLE statements with explicit column lists and USING DELTA',
      'dim_customer has customer_sk, customer_id, name, email, city',
      'dim_product has product_sk, product_id, product_name, category',
      'fact_sales has sale_id, order_id, customer_sk, product_sk, order_date, quantity, unit_price, line_revenue',
    ],
    tags: ['star-schema', 'ddl', 'delta', 'dimensional-modeling'],
    concepts: ['dim-star-schema', 'ps-dataframe-create'],
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
      'What is the primary difference between SCD Type 1 and SCD Type 2 in dimensional table management?',
    options: [
      { id: 'a', text: 'Type 1 overwrites attribute values destroying history; Type 2 inserts new rows with effective dates to preserve history', isCorrect: true },
      { id: 'b', text: 'Type 1 is restricted to physical fact tables; Type 2 applies exclusively to transient dimension SQL view objects', isCorrect: false },
      { id: 'c', text: 'Type 1 automatically generates surrogate keys; Type 2 requires natural key unique primary key constraints', isCorrect: false },
      { id: 'd', text: 'Type 1 processes streaming DataFrame updates; Type 2 executes scheduled batch incremental ETL pipeline loads', isCorrect: false },
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
      'When should a data architect choose SCD Type 1 (overwrite) over SCD Type 2 (history tracking) for a dimension attribute?',
    options: [
      { id: 'a', text: 'Use Type 1 for cosmetic correction of typos; use Type 2 when past event facts must join to historical attribute state', isCorrect: true },
      { id: 'b', text: 'Use Type 1 for high-cardinality dimension tables; use Type 2 exclusively for small static lookup dimensions', isCorrect: false },
      { id: 'c', text: 'Use Type 1 for external storage locations; use Type 2 for managed transactional Delta Lake catalog tables', isCorrect: false },
      { id: 'd', text: 'Use Type 1 when streaming ingestion is enabled; use Type 2 when executing backfill batch operations', isCorrect: false },
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
    question: `Write a SQL MERGE statement to perform an SCD Type 1 upsert from staging table "stg_customer_updates" into dimension table "dim_customer" matching on natural key "customer_id".

Update name, email, city, and last_updated_at (current_timestamp()) when matched. Insert all columns plus current_timestamp() as last_updated_at when not matched.`,
    requires: [/MERGE\s+INTO/i],
    starterCode: `-- Perform SCD Type 1 MERGE\n`,
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
);
-- OR
MERGE INTO dim_customer
USING stg_customer_updates
  ON dim_customer.customer_id = stg_customer_updates.customer_id
WHEN MATCHED THEN UPDATE SET
  name = stg_customer_updates.name,
  email = stg_customer_updates.email,
  city = stg_customer_updates.city,
  last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT *;`,
    explanation:
      'MERGE is the standard SQL pattern for upserts. The matching predicate (ON) is the natural key. WHEN MATCHED handles existing customers — overwriting all tracked attributes. WHEN NOT MATCHED handles new customers. Since this is Type 1, we don\'t care about old values — they\'re simply lost.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON predicate WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ...',
      skeleton: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.____ = src.____
WHEN MATCHED THEN UPDATE SET
  tgt.name = src.name,
  tgt.email = src.email,
  tgt.city = src.city,
  tgt.last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT (
  customer_id, name, email, city, last_updated_at
) VALUES (
  src.customer_id, src.name, src.email, src.city, ____()
);`,
    },
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
    question: `Write the two-step SQL implementation (MERGE to close current rows, then INSERT for new versions/customers) for an SCD Type 2 dimension update from "stg_customer_updates" into "dim_customer".

dim_customer schema: (customer_sk, customer_id, name, email, city, effective_from, effective_to, is_current).
stg_customer_updates schema: (customer_id, name, email, city).`,
    requires: [/MERGE\s+INTO/i],
    starterCode: `-- Step 1: MERGE to close current rows\n-- Step 2: INSERT new versions\n`,
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
   OR (dim.name <> src.name OR dim.email <> src.email OR dim.city <> src.city);`,
    explanation:
      'A single MERGE can\'t both close the old row AND insert a new one for the same matching key — the matched UPDATE arm wins and there\'s no way to ALSO append. The "two-step" pattern is the canonical workaround. Step 1\'s MERGE closes out the version-being-replaced. Step 2\'s INSERT adds: (a) brand-new customers (LEFT JOIN with NULL on the right), and (b) the new version for changed customers (the predicate matches the changed-row criterion in step 1). DLT and `dlt.apply_changes(...)` automate this entirely; this exercise teaches the underlying pattern so you understand what DLT is doing.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON predicate WHEN MATCHED THEN UPDATE SET ...; INSERT INTO target SELECT ... FROM source LEFT JOIN target ...',
      skeleton: `-- Step 1: close out current row
MERGE INTO ____ AS tgt
USING ____ AS src
  ON tgt.customer_id = src.customer_id
 AND tgt.is_current = ____
 AND (tgt.name <> src.name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.effective_to = ____(),
  tgt.is_current = ____;

-- Step 2: insert new versions + brand-new customers
  monotonically_increasing_id() AS customer_sk,
  src.customer_id,
  src.name, src.email, src.city,
  current_timestamp() AS effective_from,
  CAST(NULL AS TIMESTAMP) AS effective_to,
  true AS is_current
FROM stg_customer_updates src
____ JOIN dim_customer dim
  ON dim.customer_id = src.customer_id AND dim.is_current = true
WHERE dim.customer_id IS ____
   OR (dim.name <> src.name OR dim.email <> src.email OR dim.city <> src.city);`,
    },
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
      'In an SCD Type 2 dimension table, why must fact tables join to the dimension using the surrogate key (customer_sk) rather than the natural key (customer_id)?',
    options: [
      { id: 'a', text: 'Because natural keys are non-unique in Type 2 dimensions; surrogate keys uniquely identify the specific historical version', isCorrect: true },
      { id: 'b', text: 'Because Spark SQL Catalyst optimizer prohibits joining on string natural key columns across distributed partitions', isCorrect: false },
      { id: 'c', text: 'Because surrogate keys automatically enforce row-level security masking policies within Unity Catalog system schemas', isCorrect: false },
      { id: 'd', text: 'Because natural keys force full table scans by invalidating Delta log min/max file skipping statistics', isCorrect: false },
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
      'WHEN NOT MATCHED THEN INSERT *;',
      ' AND tgt.is_current = false',
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
      'What does it mean for a data pipeline to be "idempotent", and why is idempotency essential for production ETL systems?',
    options: [
      { id: 'a', text: 'Pipeline execution can be repeated multiple times without producing duplicate records or inconsistent target data states', isCorrect: true },
      { id: 'b', text: 'Pipeline execution runs exclusively on serverless ephemeral compute nodes with automated cluster resource auto-termination', isCorrect: false },
      { id: 'c', text: 'Pipeline execution processes streaming source records using micro-batch triggers rather than scheduled cron batch jobs', isCorrect: false },
      { id: 'd', text: 'Pipeline execution enforces rigid primary key constraints on underlying target Delta tables during write operations', isCorrect: false },
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
      'How do at-least-once, at-most-once, and exactly-once processing semantics differ in data pipeline engineering?',
    options: [
      { id: 'a', text: 'At-least-once retries delivery risking duplicates; at-most-once prevents duplicates risking loss; exactly-once avoids both', isCorrect: true },
      { id: 'b', text: 'At-least-once applies to gold tables; at-most-once applies to silver tables; exactly-once applies to bronze raw tables', isCorrect: false },
      { id: 'c', text: 'At-least-once requires static clusters; at-most-once requires single-user pools; exactly-once requires serverless SQL', isCorrect: false },
      { id: 'd', text: 'At-least-once enforces schema evolution; at-most-once enforces strict types; exactly-once enforces primary key uniqueness', isCorrect: false },
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
      'Which architectural strategy correctly handles late-arriving event data in real-time streaming and batch pipelines?',
    options: [
      { id: 'a', text: 'Define streaming watermarks to bound state retention, and combine with idempotent MERGE upserts for late batch arrivals', isCorrect: true },
      { id: 'b', text: 'Purge late-arriving records immediately at bronze ingestion to protect downstream silver tables from schema evolution', isCorrect: false },
      { id: 'c', text: 'Downgrade cluster access mode to Single User and execute unencrypted driver shell scripts to modify target records', isCorrect: false },
      { id: 'd', text: 'Force full table rewrites on every micro-batch trigger execution to overwrite all historical partition directories', isCorrect: false },
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
      'What is the safest, most idempotent pattern for backfilling historical partition data in a daily-partitioned Delta table?',
    options: [
      { id: 'a', text: 'Atomically replace target partitions using REPLACE WHERE or INSERT OVERWRITE PARTITION to ensure safe, repeatable runs', isCorrect: true },
      { id: 'b', text: 'Execute blind INSERT INTO statements repeatedly across historical dates and run deduplication scripts after pipeline completion', isCorrect: false },
      { id: 'c', text: 'DROP and recreate the target Delta table before loading historical records to guarantee complete schema alignment', isCorrect: false },
      { id: 'd', text: 'Disable Delta log checkpoints during historical backfill execution to maximize parallel driver write throughput', isCorrect: false },
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
    question: `Convert a non-idempotent INSERT into an idempotent MERGE statement on target Delta table "fct_orders" using staging table "stg_orders" matched on "order_id".

Insert new records with current_timestamp() as inserted_at when not matched. Do nothing on match (orders are immutable once inserted).`,
    requires: [/MERGE\s+INTO/i],
    starterCode: `-- Convert INSERT to MERGE\n`,
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
);
-- OR
MERGE INTO fct_orders
USING stg_orders
  ON fct_orders.order_id = stg_orders.order_id
WHEN NOT MATCHED THEN INSERT (
  order_id, customer_id, order_date, total_amount, inserted_at
) VALUES (
  stg_orders.order_id, stg_orders.customer_id, stg_orders.order_date, stg_orders.total_amount, current_timestamp()
);`,
    explanation:
      'No WHEN MATCHED clause means existing rows are left untouched — the rerun is a complete no-op for them. New rows in stg_orders that don\'t exist in fct_orders are inserted exactly once. This is the canonical "idempotent append" pattern: same staging in → same target out, regardless of how many times you retry. For tables that DO need updates on rematch, you\'d add WHEN MATCHED THEN UPDATE — but the principle is the same: route every write through MERGE on a unique key.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON predicate WHEN NOT MATCHED THEN INSERT ...',
      skeleton: `MERGE INTO fct_orders AS tgt
USING stg_orders AS src
  ON tgt.____ = src.____
WHEN NOT MATCHED THEN INSERT (
  order_id, customer_id, order_date, total_amount, inserted_at
) VALUES (
  src.order_id, src.customer_id, src.order_date, src.total_amount, ____()
);`,
    },
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
      'What is a "data contract" between an upstream data producer team and a downstream data consumer team?',
    options: [
      { id: 'a', text: 'A formal, version-controlled agreement defining schema, SLA, semantics, and breaking-change policies for a dataset', isCorrect: true },
      { id: 'b', text: 'A legal service level agreement defining cloud billing costs and infrastructure compute resource allocations', isCorrect: false },
      { id: 'c', text: 'A proprietary Delta Lake metadata file containing transaction commit logs and time travel version histories', isCorrect: false },
      { id: 'd', text: 'A cluster access policy restricting notebook execution permissions to approved workspace user principal groups', isCorrect: false },
    ],
    explanation:
      'In the lakehouse era, data contracts are increasingly first-class. Patterns: schemas defined in a registry (Avro, JSON Schema, Protobuf), DLT expectations enforced on bronze→silver, breaking-change CI that fails the producer\'s deploy if a column is dropped/retyped without a migration. The point is to stop "the table changed and three downstream dashboards silently broke" from being how you find out.',
    tags: ['data-contracts', 'schema', 'governance'],
    concepts: ['dim-data-contracts', 'ps-dataframe-create', 'ucat-grants'],
  },
];
