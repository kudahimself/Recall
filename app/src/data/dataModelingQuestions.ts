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
// engineering" content that the platform was missing: the per-feature
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
//   DATA_MODELING (9): star vs snowflake, fact vs dim, grain, surrogate
//     keys, where a star schema lives on a lakehouse, additivity,
//     conformed dims, plus a coding question building a small star schema
//     with identity surrogate keys in Spark SQL and a
//     predict on summing a measure of a coarser grain.
//   SCD_PATTERNS (7): when to use Type 1 vs 2 vs 3, MERGE for SCD1, MERGE
//     for SCD2 with effective dating, plus a Parsons assembly of the
//     SCD2 MERGE and a predict on joining facts by natural key.
//   PIPELINE_DESIGN (7): idempotency, exactly-once vs at-least-once,
//     late-arriving data, backfill, idempotent insert via MERGE, data
//     contracts, plus a predict on re-running INSERT vs MERGE.

export const dataModelingQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // DATA_MODELING (9)
  // ────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────
  // DATA_MODELING (9)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'dm-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'In a dimensional model, how does a fact table differ from a dimension table?',
    options: [
      { id: 'a', text: 'Facts hold descriptive columns such as product name; dimensions hold the keys and numeric measures of each event', isCorrect: false },
      { id: 'b', text: 'Facts hold the current value of each row; dimensions keep every past version of those facts as their history', isCorrect: false },
      { id: 'c', text: 'Facts record events as dimension keys plus numeric measures; dimensions hold the descriptive columns to group by', isCorrect: true },
      { id: 'd', text: 'Facts are the raw source tables just as they were loaded; dimensions are summaries aggregated from them for reports', isCorrect: false },
    ],
    explanation: `A fact table records events at its grain: each row holds the keys of the dimensions involved and the numeric measures of the event, such as quantity and amount. A dimension table holds the descriptive columns, such as a product's name and category, that queries filter and group those measures by. Option a swaps the two roles. Dimensions do not store the history of facts (b): SCD Type 2 keeps the history of a dimension's own attributes. A dimension is not a summary of a fact (d); summaries are aggregates built from a fact for reports. A star schema is one fact table with its dimensions joined straight to it.`,
    tags: ['dimensional-modeling', 'fact', 'dimension'],
    concepts: ['dim-star-schema'],
  },
  {
    id: 'dm-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'How does a star schema differ from a snowflake schema?',
    options: [
      { id: 'a', text: 'A star puts facts and dimensions into one wide table; a snowflake splits that table into a fact and its dimensions', isCorrect: false },
      { id: 'b', text: 'A star joins each denormalized dimension straight to the fact; a snowflake normalizes dimensions into sub-tables', isCorrect: true },
      { id: 'c', text: 'A star joins its dimensions to each other in a chain; a snowflake joins every dimension directly to the fact', isCorrect: false },
      { id: 'd', text: 'A star needs a surrogate key on every dimension; a snowflake joins the fact to its dimensions on natural keys', isCorrect: false },
    ],
    explanation: 'In a star schema each dimension is one wide, denormalized table, such as dim_product holding its category name, joined directly to the fact. A snowflake schema normalizes a dimension into sub-tables, such as dim_product pointing to dim_category, so queries need more joins. On columnar Delta files repeated values compress well, so the space a snowflake saves is small and lakehouse models usually choose the star. One wide table holding everything (a) is a flat table, not a star; c swaps the two shapes; and the keys (d) do not depend on the shape, since both use surrogate keys.',
    tags: ['star-schema', 'snowflake-schema', 'normalization'],
    concepts: ['dim-star-schema', 'dim-snowflake-schema'],
  },
  {
    id: 'dm-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'In dimensional modeling, what is the grain of a fact table, and why is it declared before choosing the columns?',
    options: [
      { id: 'a', text: 'The level of detail of each dimension, such as city or country; it sets which filters a report can offer on the fact', isCorrect: false },
      { id: 'b', text: 'The business meaning of one fact row, such as one row per order line; it decides which keys and measures belong', isCorrect: true },
      { id: 'c', text: 'The time period the fact is partitioned by, such as one folder per day; it is chosen first to speed up its queries', isCorrect: false },
      { id: 'd', text: 'The list of measures the fact stores, such as amount and quantity; the keys are then derived from those measures', isCorrect: false },
    ],
    explanation: `The grain says what one row of the fact means, such as one row per order line, one per order, or one per product per day. Only keys and measures that are true at that grain belong in the table, so it must be settled first: a value of the whole order copied onto each of its lines is summed once per line, and the totals come out too large. The grain is about the fact's rows, not a dimension's hierarchy (a) or how files are partitioned (c), and the measures follow from the grain, not the other way round (d).`,
    tags: ['grain', 'dimensional-modeling'],
    concepts: ['dim-grain', 'dim-star-schema'],
  },
  {
    id: 'dm-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: `Why does a dimension table get a surrogate key beside the source system's natural key?`,
    options: [
      { id: 'a', text: 'Delta enforces uniqueness and foreign keys on a surrogate key, which it cannot do on a natural key from a source', isCorrect: false },
      { id: 'b', text: 'The surrogate key replaces the natural key, which is then dropped from the dimension so the table takes less space', isCorrect: false },
      { id: 'c', text: 'Integer keys join faster, and that is the only reason: Type 2 history works the same when facts join on natural keys', isCorrect: false },
      { id: 'd', text: `It survives changes to the source's keys and gives each SCD Type 2 version of a row a key of its own to join on`, isCorrect: true },
    ],
    explanation: `A surrogate key is a meaningless integer, such as an identity column, that the warehouse assigns. It frees the warehouse from the source's keys, which can be reused, reformatted, or collide when two sources are merged. In an SCD Type 2 dimension one customer has several version rows sharing one natural key, so only a surrogate key can point a fact at the right version. Unity Catalog's PRIMARY KEY and FOREIGN KEY constraints are not enforced on any key (a), the natural key stays in the dimension for looking rows up (b), and joining facts to a Type 2 dimension on the natural key matches every version and multiplies the rows (c).`,
    tags: ['surrogate-keys', 'natural-keys', 'scd'],
    concepts: ['dim-surrogate-key', 'dim-scd-type2'],
  },
  {
    id: 'dm-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'How do additive, semi-additive and non-additive measures differ?',
    options: [
      { id: 'a', text: 'Additive sum across every dimension; semi-additive, such as a ratio, sum within one group; non-additive, such as a balance, never sum', isCorrect: false },
      { id: 'b', text: 'Additive are counts of rows; semi-additive are sums of a column; non-additive are averages, stored precomputed on each row', isCorrect: false },
      { id: 'c', text: 'Additive sum over every dimension; semi-additive, such as a balance, not over time; non-additive, such as a ratio, are recomputed', isCorrect: true },
      { id: 'd', text: 'All three sum by any dimension; the label only sets whether a BI tool shows a grand total for that column by default', isCorrect: false },
    ],
    explanation: `Quantity and amount are additive: summing them by any dimension, time included, gives a true total. An account balance is semi-additive: summing balances across accounts on one day is right, but adding each day's balance over a month counts the same money 30 times, so across time you take the last value or an average. A ratio such as a margin percentage is non-additive: summing or averaging stored ratios is wrong, so store its parts (profit and revenue) and divide after summing them. Option a swaps the two examples, b confuses additivity with the kind of aggregate, and d treats a property of what the measure means as a display setting.`,
    tags: ['measures', 'additivity', 'aggregation'],
    concepts: ['dim-additivity', 'ps-groupby-agg'],
  },
  {
    id: 'dm-mcq-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'What is a conformed dimension, and why does it matter?',
    options: [
      { id: 'a', text: 'One dimension, such as dim_customer, shared by several facts with the same keys and meaning, so their measures compare', isCorrect: true },
      { id: 'b', text: `A dimension whose rows were cleaned to conform to the source system's schema before being loaded into the warehouse`, isCorrect: false },
      { id: 'c', text: 'A dimension normalized into third normal form, so that each attribute is stored exactly once across its sub-tables', isCorrect: false },
      { id: 'd', text: 'A copy of dim_customer made for each fact table, kept in step with the other copies by a nightly sync job between them', isCorrect: false },
    ],
    explanation: `When the sales fact and the returns fact both join to the same dim_customer, by the same surrogate keys and with the same meaning for every attribute, their measures can be grouped side by side: net revenue per customer segment is one query. With a private customer table per fact, keys and definitions drift apart and the numbers stop lining up; copies kept in sync (d) only hide that until a sync fails. Conformed is about sharing one dimension across facts, not about matching the source's schema (b) or normalizing (c), which is the snowflake shape. Kimball's bus matrix lists which conformed dimensions each business process uses.`,
    tags: ['conformed-dimensions', 'enterprise', 'bus-matrix'],
    concepts: ['dim-conformed-dims'],
  },
  {
    id: 'dm-mcq-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    question: 'A team used to keep raw files in a data lake and copy a curated star schema into a separate warehouse for BI. On a Databricks lakehouse, where does the star schema live?',
    options: [
      { id: 'a', text: 'In a separate warehouse still, since files on object storage cannot give the transactions that BI queries rely on', isCorrect: false },
      { id: 'b', text: 'As views over the raw files only, computed at query time, since a lakehouse keeps no curated tables of its own', isCorrect: false },
      { id: 'c', text: 'As plain Parquet files exported for each report, since BI tools cannot query Delta tables through SQL warehouses', isCorrect: false },
      { id: 'd', text: 'As Delta tables on the same object storage, which SQL warehouses serve to BI tools and notebooks read directly', isCorrect: true },
    ],
    explanation: `A lakehouse brings warehouse features to the lake: Delta's transaction log gives ACID tables on plain object storage, so the facts and dimensions are ordinary Delta tables, usually in the Gold layer, built from Silver. BI tools query them through a SQL warehouse, and notebooks and ML read the same tables, so there is no second copy to load and keep in step. Delta's commits are what make object storage transactional (a), curated tables are the point of the Silver and Gold layers (b), and SQL warehouses query Delta tables directly (c).`,
    tags: ['lakehouse', 'star-schema', 'delta', 'architecture'],
    concepts: ['dim-star-schema', 'medallion-architecture', 'dbx-architecture'],
  },
  {
    id: 'dm-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question: `Create a small star schema for retail sales: three Delta tables in the current schema (on Databricks a table is Delta unless you say otherwise).

dim_customer: customer_sk, a BIGINT surrogate key that the table fills in itself as an identity column; customer_id STRING, the natural key; city STRING.
dim_product: product_sk, a BIGINT identity surrogate key in the same way; product_id STRING, the natural key; category STRING.
fact_sales, with a grain of one row per line of an order: order_id BIGINT, line_no INT, customer_sk BIGINT, product_sk BIGINT, quantity INT and amount DECIMAL(10,2).`,
    requires: [
      /customer_sk\s+BIGINT\s+(NOT\s+NULL\s+)?GENERATED\s+(ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY/i,
      /product_sk\s+BIGINT\s+(NOT\s+NULL\s+)?GENERATED\s+(ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY/i,
      /CREATE\s+(OR\s+REPLACE\s+)?TABLE\s+(IF\s+NOT\s+EXISTS\s+)?fact_sales\s*\(/i,
      /line_no\s+INT/i,
    ],
    starterCode: `-- Define the star schema tables\n`,
    testCases: [
      {
        input: 'star schema for retail sales',
        expectedOutput: 'CREATE TABLE dim_customer and dim_product with identity surrogate keys, and fact_sales holding the surrogate keys and measures',
        description: 'Should create both dimensions with identity surrogate keys and the fact at the order-line grain',
      },
    ],
    solution: `CREATE TABLE dim_customer (
  customer_sk BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id STRING,
  city STRING
);

CREATE TABLE dim_product (
  product_sk BIGINT GENERATED ALWAYS AS IDENTITY,
  product_id STRING,
  category STRING
);

CREATE TABLE fact_sales (
  order_id BIGINT,
  line_no INT,
  customer_sk BIGINT,
  product_sk BIGINT,
  quantity INT,
  amount DECIMAL(10,2)
);
-- OR
CREATE TABLE dim_customer (
  customer_sk BIGINT GENERATED BY DEFAULT AS IDENTITY,
  customer_id STRING,
  city STRING
);

CREATE TABLE dim_product (
  product_sk BIGINT GENERATED BY DEFAULT AS IDENTITY,
  product_id STRING,
  category STRING
);

CREATE TABLE fact_sales (
  order_id BIGINT,
  line_no INT,
  customer_sk BIGINT,
  product_sk BIGINT,
  quantity INT,
  amount DECIMAL(10,2)
);`,
    explanation:
      'Each dimension\'s surrogate key is an identity column: Delta gives every inserted row a new unique BIGINT, so the load never computes keys and each SCD Type 2 version of a customer gets a key of its own. The natural key stays beside it, for looking rows up from the source. The fact\'s grain is one row per order line, so order_id and line_no identify a row; it stores the dimensions\' surrogate keys as plain BIGINT columns, never as identity columns, and the measures that are true at that grain. GENERATED BY DEFAULT AS IDENTITY also works and lets a load supply its own value. Adding USING DELTA, NOT NULL or IF NOT EXISTS is fine. You can document the star with PRIMARY KEY constraints on the dimensions and FOREIGN KEY (customer_sk) REFERENCES dim_customer on the fact, but Unity Catalog does not enforce them.',
    tieredHints: {
      apiSignature: 'CREATE TABLE t (col_sk BIGINT GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY, other_col type, ...)',
      skeleton: `CREATE TABLE dim_customer (
  customer_sk BIGINT ____,
  customer_id STRING,
  city STRING
);

CREATE TABLE dim_product (
  product_sk BIGINT ____,
  ____ STRING,
  ____ STRING
);

CREATE TABLE fact_sales (
  order_id BIGINT,
  line_no INT,
  ____ BIGINT,
  ____ BIGINT,
  quantity INT,
  amount ____
);`,
    },
    hints: [
      'An identity column fills itself in on every insert: declare one on each dimension\'s surrogate key, never on the fact.',
      'The fact holds the order-line grain columns, the two surrogate keys as plain BIGINT columns, and the two measures.',
    ],
    tags: ['star-schema', 'ddl', 'identity-column', 'surrogate-keys', 'dimensional-modeling'],
    concepts: ['dim-star-schema', 'dim-surrogate-key', 'dim-grain'],
  },
  {
    id: 'dm-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_MODELING,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'In a Databricks notebook, the Delta table fact_order_line has one row per order line and holds exactly the rows shown. amount is the price of the line; shipping is the shipping charge of the whole order, which the load copied onto every line of that order. What does the cell print? The answer is one line: three integers separated by single spaces.',
    tables: [
      { name: 'fact_order_line', columns: ['order_id', 'line_no', 'amount', 'shipping'], rows: [
        [1, 1, 30, 5],
        [1, 2, 20, 5],
        [2, 1, 40, 8],
      ] },
    ],
    code: `r = spark.sql("""SELECT COUNT(*) AS n, SUM(amount) AS sales,
    SUM(shipping) AS ship FROM fact_order_line""").first()
print(r.n, r.sales, r.ship)`,
    expectedOutput: '3 90 18',
    explanation:
      'The grain is one row per order line, so COUNT(*) counts 3 lines and SUM(amount), a measure of the line, adds 30 + 20 + 40 = 90 correctly. shipping belongs to the coarser order grain: copied onto both lines of order 1, its 5 is summed twice, so the query returns 5 + 5 + 8 = 18 although the two orders were charged 13. Keep a measure at the grain it describes: put shipping in a fact with one row per order, or allocate it across the lines so they add up to the order\'s charge.',
    hints: [
      'Which column describes a line, and which describes the whole order?',
      'How many times does order 1\'s shipping charge appear in the table?',
    ],
    tags: ['grain', 'additivity', 'fact', 'predict'],
    concepts: ['dim-grain', 'dim-additivity'],
  },


  // ────────────────────────────────────────────────────────────────────
  // SCD_PATTERNS (7)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'scd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    question: `How does SCD Type 1 differ from SCD Type 2 when a customer's city changes?`,
    options: [
      { id: 'a', text: 'Type 1 keeps the old city in a prev_city column; Type 2 overwrites the city and logs the change in the table history', isCorrect: false },
      { id: 'b', text: 'Type 1 overwrites the city, so its history is lost; Type 2 closes the current row and inserts a new version of it', isCorrect: true },
      { id: 'c', text: 'Type 1 inserts a new row for each change; Type 2 updates the row in place and adds a changed_at timestamp column', isCorrect: false },
      { id: 'd', text: 'Both keep history: Type 1 keeps it through Delta time travel, and Type 2 keeps it in extra rows of the dimension', isCorrect: false },
    ],
    explanation: `Under Type 1 the row is updated in place, so every past order now reads the new city. Under Type 2 the current row gets its valid_to date and is_current = false, and a new current row with its own surrogate key carries the new city, so earlier orders keep the city of their time. A prev_city column is Type 3 (a), and c swaps the two types. Delta time travel (d) is not history the model can join to: VACUUM removes old versions' files after the retention period, and no fact points at a table version.`,
    tags: ['scd', 'type-1', 'type-2'],
    concepts: ['dim-scd-type2', 'dim-scd-type1'],
  },
  {
    id: 'scd-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    question: 'When should a dimension attribute use SCD Type 1 (overwrite) instead of Type 2 (keep history)?',
    options: [
      { id: 'a', text: `When the attribute changes often; Type 2 suits only attributes that change at most once in a row's lifetime`, isCorrect: false },
      { id: 'b', text: 'When Delta time travel can recover the old values; Type 2 is needed only once the retention period runs out', isCorrect: false },
      { id: 'c', text: 'When old values have no meaning, such as a typo fix; Type 2 when past facts must keep the value of their time', isCorrect: true },
      { id: 'd', text: 'When reports group facts by the attribute; Type 2 suits attributes that are only shown on screen, never grouped', isCorrect: false },
    ],
    explanation: `Ask whether last quarter's report, run today, should show the world as it was then or as it is now. A corrected spelling has no history worth keeping, so Type 1 overwrites it. A customer's region does: sales made while the customer was in the north should stay in the north, so Type 2 keeps a version per change. How often a value changes (a) does not decide it, time travel (b) is not history the model can join to, and d has it backwards: grouping by an attribute is exactly when its history matters. Many dimensions mix both, Type 1 on cosmetic columns and Type 2 on the ones reports group by.`,
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
    question: `dim_customer (customer_id, customer_name, email, city, last_updated_at) is an SCD Type 1 dimension keyed on the natural key customer_id. stg_customer_updates (customer_id, customer_name, email, city) holds today's changed and new customers.

Write one MERGE that overwrites customer_name, email and city of the customers already in dim_customer and inserts the new ones. In both cases set last_updated_at to current_timestamp().`,
    requires: [
      /MERGE\s+INTO\s+dim_customer/i,
      /USING\s+stg_customer_updates/i,
      /ON\s+[\w.]*customer_id\s*=\s*[\w.]*customer_id/i,
      /WHEN\s+MATCHED\s+THEN\s+UPDATE\s+SET\s+(?!\*)/i,
      /WHEN\s+NOT\s+MATCHED\s+THEN\s+INSERT\s*\(/i,
      /last_updated_at\s*=\s*current_timestamp/i,
    ],
    starterCode: `-- SCD Type 1 load of dim_customer\n`,
    testCases: [
      {
        input: 'dim_customer + stg_customer_updates',
        expectedOutput: 'MERGE INTO dim_customer ... ON customer_id WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT (...) VALUES (...)',
        description: 'Should overwrite matched customers and insert new ones, stamping last_updated_at',
      },
    ],
    solution: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id
WHEN MATCHED THEN UPDATE SET
  tgt.customer_name = src.customer_name,
  tgt.email = src.email,
  tgt.city = src.city,
  tgt.last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT (
  customer_id, customer_name, email, city, last_updated_at
) VALUES (
  src.customer_id, src.customer_name, src.email, src.city, current_timestamp()
);
-- OR
MERGE INTO dim_customer d
USING stg_customer_updates s
  ON d.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET
  d.customer_name = s.customer_name,
  d.email = s.email,
  d.city = s.city,
  d.last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT (
  customer_id, customer_name, email, city, last_updated_at
) VALUES (
  s.customer_id, s.customer_name, s.email, s.city, current_timestamp()
);
-- OR
MERGE INTO dim_customer
USING stg_customer_updates
  ON dim_customer.customer_id = stg_customer_updates.customer_id
WHEN MATCHED THEN UPDATE SET
  customer_name = stg_customer_updates.customer_name,
  email = stg_customer_updates.email,
  city = stg_customer_updates.city,
  last_updated_at = current_timestamp()
WHEN NOT MATCHED THEN INSERT (
  customer_id, customer_name, email, city, last_updated_at
) VALUES (
  stg_customer_updates.customer_id, stg_customer_updates.customer_name,
  stg_customer_updates.email, stg_customer_updates.city, current_timestamp()
);`,
    explanation:
      'Type 1 keeps one row per natural key and overwrites it, so the MERGE matches on customer_id: WHEN MATCHED updates the three attributes in place, and the old values are gone; WHEN NOT MATCHED inserts the new customers. The insert names its columns because the staging table has no last_updated_at: INSERT * would need every target column in the source, and on Delta it fails here, while UPDATE SET * would fail the same way and never set the timestamp. current_timestamp() is the same value for every row of one statement, and current_timestamp without brackets also works.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON key_match WHEN MATCHED THEN UPDATE SET col = value, ... WHEN NOT MATCHED THEN INSERT (cols) VALUES (values)',
      skeleton: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON ____
WHEN MATCHED THEN UPDATE SET
  ____
WHEN NOT MATCHED THEN INSERT (
  customer_id, customer_name, email, city, last_updated_at
) VALUES (
  ____
);`,
    },
    hints: [
      'Match on the natural key customer_id: a Type 1 dimension has one row per customer.',
      'The staging table has no last_updated_at, so neither branch can copy every column with *: list the columns and give the timestamp yourself.',
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
    question: `dim_customer (customer_sk, customer_id, customer_name, email, city, valid_from, valid_to, is_current) is an SCD Type 2 dimension. customer_sk is an identity column that fills itself in, valid_from and valid_to are TIMESTAMPs, and each customer's current row has valid_to NULL and is_current true. stg_customer_updates (customer_id, customer_name, email, city) holds today's snapshot, and its tracked columns customer_name, email and city are never NULL.

Write the two statements of the Type 2 load:
1. A MERGE that closes the current row of each customer whose tracked columns changed, setting valid_to to current_timestamp() and is_current to false.
2. An INSERT with a column list that adds a current row (valid_from current_timestamp(), valid_to NULL, is_current true) for every staging customer that has no current row, which covers changed and new customers alike.`,
    requires: [
      /MERGE\s+INTO\s+dim_customer/i,
      /MERGE[\s\S]*is_current[\s\S]*UPDATE\s+SET/i,
      /UPDATE\s+SET[\s\S]*is_current\s*=\s*false/i,
      /valid_to\s*=\s*current_timestamp/i,
      /<>|!=|DISTINCT\s+FROM|<=>/i,
      /INSERT\s+INTO\s+dim_customer\s*\((?![^)]*customer_sk)/i,
      /LEFT\s+(OUTER\s+)?JOIN[\s\S]*IS\s+NULL|NOT\s+EXISTS|LEFT\s+ANTI\s+JOIN/i,
    ],
    starterCode: `-- Step 1: close the changed current rows\n-- Step 2: add the new current rows\n`,
    testCases: [
      {
        input: 'dim_customer (SCD Type 2) + stg_customer_updates',
        expectedOutput: 'A MERGE that closes changed current rows, then an INSERT of a current row for every staging customer without one',
        description: 'Should run the two-step SCD Type 2 load',
      },
    ],
    solution: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id AND tgt.is_current = true
  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.valid_to = current_timestamp(),
  tgt.is_current = false;

INSERT INTO dim_customer (customer_id, customer_name, email, city,
  valid_from, valid_to, is_current)
SELECT src.customer_id, src.customer_name, src.email, src.city,
  current_timestamp(), NULL, true
FROM stg_customer_updates AS src
LEFT JOIN dim_customer AS dim
  ON dim.customer_id = src.customer_id AND dim.is_current = true
WHERE dim.customer_id IS NULL;
-- OR
MERGE INTO dim_customer d USING stg_customer_updates s
  ON d.customer_id = s.customer_id AND d.is_current
  AND (d.customer_name <> s.customer_name OR d.email <> s.email OR d.city <> s.city)
WHEN MATCHED THEN UPDATE
  SET valid_to = current_timestamp(), is_current = false;

INSERT INTO dim_customer (customer_id, customer_name, email, city,
  valid_from, valid_to, is_current)
SELECT s.customer_id, s.customer_name, s.email, s.city,
  current_timestamp(), NULL, true
FROM stg_customer_updates s LEFT JOIN dim_customer d
  ON d.customer_id = s.customer_id AND d.is_current
WHERE d.customer_id IS NULL;
-- OR
MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id AND tgt.is_current = true
  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.valid_to = current_timestamp(),
  tgt.is_current = false;

INSERT INTO dim_customer (customer_id, customer_name, email, city,
  valid_from, valid_to, is_current)
SELECT src.customer_id, src.customer_name, src.email, src.city,
  current_timestamp(), NULL, true
FROM stg_customer_updates AS src
WHERE NOT EXISTS (
  SELECT 1 FROM dim_customer AS dim
  WHERE dim.customer_id = src.customer_id AND dim.is_current = true
);
-- OR
MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id AND tgt.is_current = true
  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)
WHEN MATCHED THEN UPDATE SET
  tgt.valid_to = current_timestamp(),
  tgt.is_current = false;

INSERT INTO dim_customer (customer_id, customer_name, email, city,
  valid_from, valid_to, is_current)
SELECT src.customer_id, src.customer_name, src.email, src.city,
  current_timestamp(), NULL, true
FROM stg_customer_updates AS src
LEFT ANTI JOIN dim_customer AS dim
  ON dim.customer_id = src.customer_id AND dim.is_current = true;`,
    explanation:
      'A plain MERGE cannot both close a matched row and insert its replacement for the same key, so a Type 2 load is two statements. Step 1 matches only the current row of a customer whose tracked columns differ and closes it: without is_current it would close history rows again, and without the inequality it would close rows that did not change. After step 1 a changed customer has no current row, just like a brand-new one, so step 2 needs a single test for both: the LEFT JOIN to current rows finds no partner and IS NULL keeps that staging row (NOT EXISTS or LEFT ANTI JOIN do the same). Customers that did not change still have a current row and get nothing, so running both statements again changes nothing. The column list leaves out customer_sk for the identity column to fill; a key from monotonically_increasing_id() starts again on every run and collides with existing keys. In a Lakeflow pipeline, AUTO CDC ... STORED AS SCD TYPE 2 does both steps.',
    tieredHints: {
      apiSignature: 'MERGE INTO dim USING stg ON key_match AND current AND changed WHEN MATCHED THEN UPDATE SET ...; INSERT INTO dim (cols) SELECT ... FROM stg LEFT JOIN dim ON ... WHERE ... IS NULL',
      skeleton: `MERGE INTO dim_customer AS tgt
USING stg_customer_updates AS src
  ON tgt.customer_id = src.customer_id AND ____
  AND (____)
WHEN MATCHED THEN UPDATE SET
  ____;

INSERT INTO dim_customer (customer_id, customer_name, email, city,
  valid_from, valid_to, is_current)
SELECT ____
FROM stg_customer_updates AS src
LEFT JOIN dim_customer AS dim
  ON ____
WHERE ____;`,
    },
    hints: [
      'Step 1 must match only a current row, and only when a tracked column differs.',
      'After step 1, which staging customers have no current row left? One LEFT JOIN test finds the changed and the new ones together.',
      'Leave customer_sk out of the INSERT column list: the identity column fills it.',
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
    question: 'dim_customer is an SCD Type 2 dimension. Customer c1 moved from London to Dublin on 2026-03-01, so the London row was closed with valid_to 2026-03-01 and a current Dublin row was added. On 2026-03-05 an order that c1 placed on 2026-02-20 arrives late. Which key should the new fact row for that order store?',
    options: [
      { id: 'a', text: 'The surrogate key of the London row, the version whose valid_from to valid_to range holds the order date', isCorrect: true },
      { id: 'b', text: 'The surrogate key of the Dublin row, since a fact always takes the row that has is_current = true at load time', isCorrect: false },
      { id: 'c', text: 'The natural key c1, so that each later query can join the order to whichever version it needs at that time', isCorrect: false },
      { id: 'd', text: 'A new surrogate key from a reopened London row, inserted so the late order has a current version to join to', isCorrect: false },
    ],
    explanation: `A fact stores the surrogate key of the version that was current when its event happened, not when it was loaded. The order date 2026-02-20 falls in the London row's range, so the load looks up customer_id = 'c1' with valid_from <= the order date and (valid_to IS NULL OR the order date < valid_to), and stores that row's key. Taking the is_current row (b) is right only for events happening now, and would put this February order in Dublin. Storing only the natural key (c) leaves every query to pick a version, and a plain join on it matches both rows and counts the order twice. The dimension already holds the London version, so nothing is inserted (d).`,
    tags: ['scd-2', 'surrogate-key', 'fact-loading', 'late-arriving-data'],
    concepts: ['dim-scd-type2', 'dim-surrogate-key'],
  },
  {
    id: 'scd-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    question:
      'dim_customer is an SCD Type 2 dimension with the tracked columns customer_name, email and city, plus valid_to and is_current. Put the lines in order to build step 1 of the load: the MERGE that closes the current row of each customer in stg_customer_updates whose tracked columns changed.',
    correctOrder: [
      'MERGE INTO dim_customer AS tgt',
      'USING stg_customer_updates AS src',
      '  ON tgt.customer_id = src.customer_id AND tgt.is_current',
      '  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)',
      'WHEN MATCHED THEN UPDATE SET tgt.valid_to = current_timestamp(), tgt.is_current = false;',
    ],
    distractorLines: [
      '  ON tgt.customer_id = src.customer_id',
      'WHEN NOT MATCHED THEN INSERT *;',
    ],
    solution:
      'MERGE INTO dim_customer AS tgt\nUSING stg_customer_updates AS src\n  ON tgt.customer_id = src.customer_id AND tgt.is_current\n  AND (tgt.customer_name <> src.customer_name OR tgt.email <> src.email OR tgt.city <> src.city)\nWHEN MATCHED THEN UPDATE SET tgt.valid_to = current_timestamp(), tgt.is_current = false;',
    explanation:
      'The match has three parts: the same natural key, the current version of the row, and at least one tracked column that differs. The ON line without is_current matches every history row of the customer as well, and closing those again overwrites their valid_to. Without the inequality, step 1 would close rows that did not change. The matched rows are updated, not deleted, so their history stays. A WHEN NOT MATCHED THEN INSERT * cannot add the replacement rows here: a changed customer\'s row was matched, so it never reaches that branch, and the staging table lacks the dimension\'s columns. Step 2, a separate INSERT, adds the new current rows.',
    hints: [
      'Match on the natural key, the current row, and "some tracked column differs".',
      'A matched row is closed by an UPDATE; inserting its new version is a separate step.',
    ],
    tags: ['scd-2', 'merge', 'parsons'],
    concepts: ['dim-scd-type2', 'delta-merge'],
  },
  {
    id: 'scd-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SCD_PATTERNS,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'In a Databricks notebook, dim_customer is an SCD Type 2 dimension: customer c1 moved from London to Dublin, so it has a closed row and a current one. fact_orders stores, for each order, the surrogate key of the version current at the time and also the natural key. Both tables hold exactly the rows shown. What does the cell print? The answer is two lines, each the join key, the row count and the total, separated by single spaces.',
    tables: [
      { name: 'dim_customer', columns: ['customer_sk', 'customer_id', 'city', 'is_current'], rows: [
        [1, 'c1', 'London', 'false'],
        [2, 'c1', 'Dublin', 'true'],
        [3, 'c2', 'Leeds', 'true'],
      ] },
      { name: 'fact_orders', columns: ['order_id', 'customer_sk', 'customer_id', 'amount'], rows: [
        [10, 1, 'c1', 50],
        [11, 2, 'c1', 30],
        [12, 3, 'c2', 20],
      ] },
    ],
    code: `for k in ["customer_sk", "customer_id"]:
    r = spark.sql(f"""SELECT COUNT(*) AS n, SUM(f.amount) AS total
        FROM fact_orders f JOIN dim_customer d ON f.{k} = d.{k}""").first()
    print(k, r.n, r.total)`,
    expectedOutput: `customer_sk 3 100
customer_id 5 180`,
    explanation:
      'The surrogate key is unique per version, so each order matches exactly one dimension row: 3 rows totalling 50 + 30 + 20 = 100. The natural key is not unique in a Type 2 dimension: c1 has two rows, so orders 10 and 11 each match both of them and are counted twice, giving 5 rows and 50 + 50 + 30 + 30 + 20 = 180. Join facts to a Type 2 dimension on the surrogate key stored at load time, or on the natural key with is_current = true when you want only the current attributes.',
    hints: [
      'How many dim_customer rows share customer_id c1?',
      'Each order row is repeated once for every dimension row its key matches.',
    ],
    tags: ['scd-2', 'surrogate-key', 'natural-key', 'join', 'predict'],
    concepts: ['dim-scd-type2', 'dim-surrogate-key'],
  },

  // ────────────────────────────────────────────────────────────────────
  // PIPELINE_DESIGN (7)
  // ────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────
  // PIPELINE_DESIGN (7)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'pd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question: 'What does it mean for a data pipeline to be idempotent?',
    options: [
      { id: 'a', text: 'Each run reads only the rows that arrived since the last run, so that no source row is ever read a second time', isCorrect: false },
      { id: 'b', text: 'A failed run is rolled back automatically, so the target table never keeps a partial write from a half-done run', isCorrect: false },
      { id: 'c', text: 'Its output depends only on its input, so it gives the same rows on any cluster, whatever the target already holds', isCorrect: false },
      { id: 'd', text: 'Running it again on the same input leaves the target exactly as one run did, so retries and re-runs are safe', isCorrect: true },
    ],
    explanation: 'Jobs are retried after failures and re-run by hand, so a write must give the same table however many times it runs on the same input. A MERGE on a unique key, an INSERT INTO ... REPLACE WHERE on the slice the run owns, and a full rebuild all do; a blind INSERT INTO ... SELECT appends the batch again on every run. Reading only new rows (a) is incremental processing and says nothing about a re-run. Rolling back a failed write (b) is atomicity, which Delta gives every commit, yet a retried append still duplicates. Output that depends only on the input (c) is deterministic, but appending the same rows twice still doubles them.',
    tags: ['idempotency', 'pipeline-design'],
    concepts: ['dim-idempotency'],
  },
  {
    id: 'pd-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question: 'How do at-most-once, at-least-once and exactly-once processing differ?',
    options: [
      { id: 'a', text: 'At-most-once may repeat records, at-least-once may lose them, and exactly-once is a source that never resends one', isCorrect: false },
      { id: 'b', text: 'At-most-once may lose records, at-least-once may repeat them, and exactly-once is at-least-once into an idempotent write', isCorrect: true },
      { id: 'c', text: 'At-most-once retries until it succeeds, at-least-once never retries, and exactly-once sends each record over the wire once', isCorrect: false },
      { id: 'd', text: 'At-most-once may lose records, at-least-once may repeat them, and exactly-once is at-least-once into a plain append', isCorrect: false },
    ],
    explanation: 'At-most-once never resends, so a failure can lose records; at-least-once resends until it succeeds, so a record can arrive twice. A pipeline cannot count on exactly-once delivery over the network, so an exactly-once result comes from at-least-once delivery into a write that ignores repeats. Structured Streaming does this with its checkpoint, which records the offsets of each micro-batch, and the Delta sink, which records each committed batch so a replayed one is skipped; a foreachBatch write should be a MERGE for the same reason. A plain append (d) writes a replayed batch twice, a swaps the two terms, and c gets retries backwards.',
    tags: ['streaming', 'delivery-semantics', 'idempotency'],
    concepts: ['stream-readstream-writestream', 'dim-delivery-semantics', 'dim-idempotency'],
  },
  {
    id: 'pd-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question: 'Events can arrive after their day was processed. Which approach handles them in a streaming pipeline and in a daily batch pipeline?',
    options: [
      { id: 'a', text: 'Streaming: a watermark says how late an event may be and still update its window; batch: rebuild the last few days', isCorrect: true },
      { id: 'b', text: 'Streaming: a watermark keeps every late event however late it is; batch: append late rows to the day on which they arrive', isCorrect: false },
      { id: 'c', text: 'Streaming: late events wait in the checkpoint until their window reopens; batch: re-run only today, which takes them in', isCorrect: false },
      { id: 'd', text: 'Both: group events by the time they arrived instead of when they happened, so no event is late and no day is re-run', isCorrect: false },
    ],
    explanation: `withWatermark("ts", "2 hours") lets an event update its window while it is at most about two hours behind the latest event time seen; after that the window's state is dropped and later events for it may be ignored, so the delay trades completeness against state size and does not keep everything (b). Nothing in the checkpoint reopens a closed window (c). In batch, each run rebuilds the last few days with an idempotent write such as REPLACE WHERE, so a row that arrives two days late lands in its own day; appending it to the day it arrived (b) or rebuilding only today (c) misdates or misses it. Grouping by arrival time (d) counts events in the wrong day.`,
    tags: ['late-arriving-data', 'watermark', 'streaming'],
    concepts: ['dim-late-arrivals', 'stream-watermarks', 'stream-readstream-writestream'],
  },
  {
    id: 'pd-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    question: 'A daily job writes one day of a Delta table per run. Which way to backfill a range of past days can be re-run safely and leaves every other day untouched?',
    options: [
      { id: 'a', text: 'Run a blind INSERT INTO for each day of the range, then run a job that removes duplicate rows once the backfill ends', isCorrect: false },
      { id: 'b', text: `Drop and recreate the table, then load only the days of the range, so the table's schema is aligned with the code`, isCorrect: false },
      { id: 'c', text: 'Rebuild each day of the range with INSERT INTO ... REPLACE WHERE on that day, the same write the daily job uses', isCorrect: true },
      { id: 'd', text: `Delete each day's rows in one statement, then insert the rebuilt day in a second statement once the delete commits`, isCorrect: false },
    ],
    explanation: 'INSERT INTO t REPLACE WHERE day = ... SELECT ... deletes and rewrites exactly that day in one atomic commit, so running it again, for a retry or a later correction, gives the same table, and no other day is touched. Blind inserts (a) duplicate the range on every re-run, and readers see doubled rows until the clean-up job runs. Dropping the table (b) loses every day outside the range. A DELETE followed by an INSERT (d) ends with the right rows but takes two commits: between them readers see the day empty, and a failure after the delete leaves it missing. On a table partitioned by day, INSERT OVERWRITE with a PARTITION clause does the same as REPLACE WHERE.',
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
    question: `Today's load is INSERT INTO fct_orders SELECT *, current_timestamp() FROM stg_orders, which adds every staged order again each time the job is retried.

stg_orders has the columns (order_id, customer_id, order_date, total_amount), and fct_orders has the same columns plus inserted_at. An order never changes once it is loaded.
Replace the load with one MERGE that inserts only the orders whose order_id is not yet in fct_orders, with inserted_at set to current_timestamp(), and leaves the orders already there untouched.`,
    requires: [
      /MERGE\s+INTO\s+fct_orders/i,
      /USING\s+stg_orders/i,
      /ON\s+[\w.]*order_id\s*=\s*[\w.]*order_id/i,
      /WHEN\s+NOT\s+MATCHED\s+THEN\s+INSERT\s*\(/i,
      /current_timestamp/i,
      /^(?![\s\S]*WHEN\s+MATCHED\s+(AND|THEN))/i,
    ],
    starterCode: `-- Idempotent load of fct_orders\n`,
    testCases: [
      {
        input: 'fct_orders + stg_orders',
        expectedOutput: 'MERGE INTO fct_orders ... ON order_id WHEN NOT MATCHED THEN INSERT (...) VALUES (...)',
        description: 'Should insert only new order ids and leave existing orders untouched',
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
MERGE INTO fct_orders t USING stg_orders s
  ON t.order_id = s.order_id
WHEN NOT MATCHED THEN INSERT (
  order_id, customer_id, order_date, total_amount, inserted_at
) VALUES (
  s.order_id, s.customer_id, s.order_date, s.total_amount, current_timestamp()
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
      'The MERGE has no WHEN MATCHED clause, so an order already in fct_orders is left exactly as it is, and only order ids not yet there are inserted. A retry or a re-run on the same staging data finds every id matched and changes nothing: the same input gives the same table however often it runs, which is idempotency. The insert names its columns because the staging table has no inserted_at, so INSERT * fails on Delta here. Adding WHEN MATCHED THEN UPDATE SET * would rewrite inserted_at on every re-run, though a loaded order never changes; a table whose rows do change gets that clause, still keyed on the unique id.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON unique_key_match WHEN NOT MATCHED THEN INSERT (cols) VALUES (values)',
      skeleton: `MERGE INTO fct_orders AS tgt
USING stg_orders AS src
  ON ____
WHEN ____ THEN INSERT (
  order_id, customer_id, order_date, total_amount, inserted_at
) VALUES (
  ____
);`,
    },
    hints: [
      'Match on the unique key order_id.',
      'Which clause would touch an order that is already loaded? Leave it out.',
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
    question: 'What is a data contract between a team that produces a table and the teams that consume it?',
    options: [
      { id: 'a', text: `The table's schema as Delta enforces it, so any write that keeps the same columns and types honours the contract`, isCorrect: false },
      { id: 'b', text: 'A Unity Catalog grant giving each consumer team SELECT on the table, which the producer agrees never to revoke', isCorrect: false },
      { id: 'c', text: 'An agreement that consumers copy the table each night and from then on own every change to its schema themselves', isCorrect: false },
      { id: 'd', text: `The producer's promise of the columns, types, meaning and freshness, with notice before any breaking change`, isCorrect: true },
    ],
    explanation: `A data contract is what consumers can rely on: the columns and their types, what each one means, how fresh the data is, and advance notice of breaking changes such as a dropped or retyped column. Delta's schema enforcement (a) checks only columns and types, and only on write: a column whose meaning changes, or a table that stops updating, passes it. Pipeline expectations and CHECK constraints test the rows, and a schema check in the producer's CI can block a breaking change before it ships. A grant (b) is access, not a promise about the data, and copying the table (c) moves the problem instead of solving it.`,
    tags: ['data-contracts', 'schema', 'governance'],
    concepts: ['dim-data-contracts', 'ps-dataframe-create', 'ucat-grants'],
  },
  {
    id: 'pd-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PIPELINE_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'In a Databricks notebook, the loop stands for one task that succeeds and is then re-run twice on the same staging data. stg_orders holds exactly the rows shown; fct_append and fct_merge are Delta tables with the same columns and start empty. What does the cell print? The answer is two lines, each a table name, a space, and its row count.',
    tables: [
      { name: 'stg_orders', columns: ['order_id', 'amount'], rows: [
        [1, 10],
        [2, 20],
      ] },
    ],
    code: `for attempt in range(3):
    spark.sql("INSERT INTO fct_append SELECT * FROM stg_orders")
    spark.sql("""MERGE INTO fct_merge t USING stg_orders s
        ON t.order_id = s.order_id WHEN NOT MATCHED THEN INSERT *""")
for t in ["fct_append", "fct_merge"]:
    print(t, spark.table(t).count())`,
    expectedOutput: `fct_append 6
fct_merge 2`,
    explanation:
      'A blind INSERT INTO ... SELECT appends the whole batch on every run, so three runs leave both orders three times in fct_append: 6 rows. The MERGE inserts only order ids not already in fct_merge: the first run adds both, and the two re-runs find every id matched and, with no WHEN MATCHED clause, change nothing, so fct_merge keeps 2 rows. That is idempotency: running the write again on the same input leaves the target as one run did, which is what makes retries and re-runs safe.',
    hints: [
      'What does INSERT INTO ... SELECT do to rows that are already in the target?',
      'On the second run, which order ids in stg_orders find a match in fct_merge?',
    ],
    tags: ['idempotency', 'merge', 'retry', 'predict'],
    concepts: ['dim-idempotency', 'delta-merge'],
  },
];
