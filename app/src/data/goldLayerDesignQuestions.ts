import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// GOLD_LAYER_DESIGN — Databricks course, "Lakehouse Architecture &
// Engineering Practice" section. Second of three new design-judgment topics
// (siblings: orchestration_design [built], ingestion_architecture [still to
// come]).
//
// This is NOT re-teaching data_modeling/scd_patterns (star-vs-snowflake,
// grain, surrogate keys, SCD1/2 MERGE) or pipeline_design (idempotency,
// replaceWhere backfill, data contracts) or medallion_architecture (what
// each layer IS) — all already exist and are assumed as prerequisites,
// including dim-additivity (additive/semi-additive/non-additive measure
// DEFINITIONS, already taught in data_modeling). This topic is the
// Databricks-specific GOLD-LAYER DESIGN JUDGMENT layer on top: how to shape
// a gold table (OBT vs star), how to choose its grain, how to split gold
// ownership (single catalog vs domain marts), where a transform belongs
// (silver vs gold), how to reprocess gold after a bug — plus the production
// failure modes that show up when these are misjudged.
//
// Sources: Databricks Medallion Architecture docs, Uber/Airbnb engineering
// blogs on trillion-record lakehouse pipelines and the Minerva semantic
// layer (see databricks_de_research_results.md).
//
// Coverage (39 questions):
//   Beginner (5 MCQ): define each of the 5 core primitives (additivity
//     itself is NOT redefined here — see dim-additivity in data_modeling).
//   Intermediate (12): 6 PREDICT_OUTPUT tracing Fan-Out Bug / Non-Additive
//     Aggregation Trap arithmetic as small deterministic Python functions
//     (genuinely deterministic, unlike most of this topic — a real faded
//     layer) + 6 scenario MCQs (OBT-vs-star x2, placement x2, domain-marts
//     x1, reprocessing x1).
//   Advanced (19): 3 anti-patterns x 3 domain-transfer scenarios each
//     (Fan-Out Bug, Non-Additive Aggregation Trap, Grain Shift Catastrophe)
//     + 3 decision-judgment primitives x 3 domain-transfer scenarios each
//     (OBT vs star, domain marts, reprocessing strategy) + 1 discrimination
//     question distinguishing two anti-patterns with a similar symptom.
//   Coding/Parsons (3): fix a Fan-Out Bug by pre-aggregating before the
//     join, implement a scoped replaceWhere reprocessing fix, Parsons
//     assembly of a blue/green versioned-gold swap.

export const goldLayerDesignQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (5) — define each core primitive
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'gld-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "In a Databricks gold layer, what's the fundamental tradeoff between building One Big Table (OBT) versus a star schema (dimensional model)?",
    options: [
      { id: 'a', text: 'OBT flattens facts and dimensions into a single wide table, paying join costs once at ETL time so BI queries execute zero runtime joins; star schema keeps facts and dimensions separate, avoiding ETL duplication while pushing joins to query time.', isCorrect: true },
      { id: 'b', text: 'OBT stores raw data as uncompressed Avro files, while star schema persists data as Delta tables; the choice is purely a file format decision that can be freely swapped without altering how business intelligence dashboards query the tables.', isCorrect: false },
      { id: 'c', text: "OBT is required whenever a table uses date partitioning, and star schema is required when using Liquid Clustering; the choice is dictated entirely by storage clustering strategies rather than how business intelligence tools query the layer.", isCorrect: false },
      { id: 'd', text: 'OBT is a star schema with dimension tables physically deleted after loading, meaning any pipeline using OBT permanently loses the ability to update dimension attributes like customer address without performing a full historical rebuild.', isCorrect: false },
    ],
    explanation:
      "Neither shape is universally 'better' - OBT trades storage/ETL cost for query-time simplicity, star schema trades query-time joins for storage efficiency and reusable conformed dimensions. Which one fits depends on the consuming BI tool's query mode, covered in the intermediate/advanced scenarios in this topic.",
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },
  {
    id: 'gld-mcq-b2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "When designing a gold fact table's grain, what should the grain declaration describe, and why does it matter that every measure column matches it?",
    options: [
      { id: 'a', text: 'The grain specifies the table primary key column name; declaring a PRIMARY KEY constraint in Unity Catalog automatically enforces table grain and guarantees that all downstream measure aggregations remain mathematically valid.', isCorrect: false },
      { id: 'b', text: 'The grain is the finest level one row represents (e.g. "one row per order line item"), stated as a business fact; every measure column must be valid at that exact grain, or aggregating it later silently produces corrupt numbers.', isCorrect: true },
      { id: 'c', text: 'The grain should be set as coarse as possible (e.g. "one row per month") to minimize storage, since finer-grained gold tables can always be re-aggregated down to a daily or line-item level on demand without any loss of detail.', isCorrect: false },
      { id: 'd', text: "The grain only matters for OBT tables; star-schema fact tables do not require explicit grain declarations because the surrounding dimension tables implicitly define the grain for all possible business intelligence queries.", isCorrect: false },
    ],
    explanation:
      "Declaring the grain explicitly ('one row per X') is what lets you check whether a measure is valid to sum at that grain. Get the grain wrong or leave it implicit and you get exactly the failure modes covered later in this topic: the Fan-Out Bug (grain finer than assumed) and Grain Shift Catastrophe (grain coarsened and the detail lost).",
    tags: ['gold-granularity'],
    concepts: ['gld-granularity'],
  },
  {
    id: 'gld-mcq-b3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "What's the tradeoff between a single shared gold catalog versus splitting gold into per-domain marts (e.g. finance_gold, marketing_gold)?",
    options: [
      { id: 'a', text: 'A single shared gold is suitable only for streaming pipelines, whereas domain marts apply exclusively to batch jobs; the architectural choice is determined entirely by source ingestion modes rather than team organizational structures.', isCorrect: false },
      { id: 'b', text: "Domain marts are an anti-pattern in a Lakehouse, because Unity Catalog's 3-level namespace architecture was specifically designed to enforce a single shared gold catalog across all engineering teams regardless of organizational scale.", isCorrect: false },
      { id: 'c', text: 'A single shared gold centralizes governance and is simplest for small teams and unified dashboards, but becomes an engineering bottleneck as more domains contend for the same schema; domain marts give each domain independent ownership and schema evolution at the cost of duplicated logic and looser central control.', isCorrect: true },
      { id: 'd', text: 'A single shared gold uses Delta tables while domain marts require migrating to Iceberg tables, since the two catalog structures are backed by incompatible physical storage formats under Unity Catalog metastores.', isCorrect: false },
    ],
    explanation:
      "This is a team-topology decision as much as a technical one - it mirrors data mesh's core argument (autonomous domain ownership) versus the simplicity and consistency a single centrally-governed catalog gives a small team. The right answer depends on org size and compliance boundaries, explored in the advanced scenarios.",
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },
  {
    id: 'gld-mcq-b4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "What's the general rule for deciding whether a transformation belongs in silver or in gold?",
    options: [
      { id: 'a', text: 'Silver holds transformations running on streaming sources, while gold holds transformations running on batch sources; layer placement is determined by trigger mode rather than the business nature of the transformation.', isCorrect: false },
      { id: 'b', text: 'Silver only adds new columns, while gold only removes columns; any transformation altering existing values, like type casting or currency conversion, belongs in bronze regardless of consumer requirements.', isCorrect: false },
      { id: 'c', text: 'Silver holds transformations owned by the data platform team, while gold holds transformations written by business analysts; layer assignment depends on author role rather than transformation semantics.', isCorrect: false },
      { id: 'd', text: 'Silver holds transformations that make the data itself correct and conformed regardless of who consumes it — deduplication, type casting, technical filtering. Gold holds transformations specific to a business question — filtering to a business rule, joining across domains, computing KPIs.', isCorrect: true },
    ],
    explanation:
      'The test is "would every consumer need this, or just this one"? A dedup fix belongs in silver because every downstream table needs correct row counts. A business rule like "exclude test accounts from the revenue dashboard" belongs in gold because a different consumer might legitimately want test accounts included.',
    tags: ['placement-rule'],
    concepts: ['gld-placement-rule'],
  },
  {
    id: 'gld-mcq-b5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'What are the main strategies for reprocessing a Databricks multi-hop pipeline after fixing a transformation bug, from most to least expensive?',
    options: [
      { id: 'a', text: 'Full pipeline rebuild (drop silver/gold, replay everything from bronze) is deterministic but expensive at scale; selective replay (Delta time travel to find a good state, then REPLACE WHERE/MERGE over just the affected partitions) is cheaper and targeted; versioned gold (build a new table in parallel, then atomically swap the view) avoids any BI downtime during the fix.', isCorrect: true },
      { id: 'b', text: 'The only supported strategy is a full pipeline rebuild, because Delta Lake transaction logs lack sufficient metadata history to support targeted partition-level reprocessing or view swapping after bug fixes.', isCorrect: false },
      { id: 'c', text: 'Reprocessing strategy is determined strictly by dataset file size: tables under 1 GB use full rebuilds, tables between 1 GB and 100 GB use selective replay, and tables over 100 GB cannot be safely reprocessed.', isCorrect: false },
      { id: 'd', text: 'All three strategies yield different output values for the same bug fix, making choice a trade-off in business data accuracy rather than an engineering optimization of cost, time, and service downtime.', isCorrect: false },
    ],
    explanation:
      "All three strategies should converge on the same correct result for a well-scoped bug - the choice between them is about cost, turnaround time, and downtime tolerance, not correctness. Which one fits a given situation is explored in the advanced scenarios later in this topic.",
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) — 6 PREDICT_OUTPUT (deterministic trace of Fan-Out
  // Bug / Non-Additive Aggregation Trap arithmetic) + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'gld-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function models a naive join between an order and its line items, without pre-aggregating first. Trace it and print the result.',
    code: `def total_without_preagg(order_amount, line_items):
    return sum(order_amount for _ in line_items)

order_amount = 100
line_items = ["sku_1", "sku_2", "sku_3"]
print(total_without_preagg(order_amount, line_items))`,
    expectedOutput: '300',
    explanation:
      'This models the Fan-Out Bug: joining a 1-to-many table without pre-aggregating means the parent row\'s amount gets counted once per matching child row. A $100 order with 3 line items reports as $300.',
    tags: ['fan-out-bug', 'predict-output'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same idea, now fixed by pre-aggregating: the order amount is looked up once, independent of how many line items the order has. Trace it and print the result.',
    code: `def total_with_preagg(order_amount, line_items):
    return order_amount

order_amount = 100
line_items = ["sku_1", "sku_2", "sku_3", "sku_4", "sku_5"]
print(total_with_preagg(order_amount, line_items))`,
    expectedOutput: '100',
    explanation:
      'The fix for the Fan-Out Bug: the order amount is read once, entirely independent of the line-item count. Whether the order has 3 line items or 5, the correct total stays $100.',
    tags: ['fan-out-bug', 'predict-output'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function models the naive fan-out across MULTIPLE orders, each with its own line-item count. Trace it and print the result.',
    code: `def naive_revenue(orders):
    total = 0
    for order_amount, line_items in orders:
        for _ in line_items:
            total += order_amount
    return total

orders = [(100, ["a", "b"]), (50, ["c", "d", "e"])]
print(naive_revenue(orders))`,
    expectedOutput: '350',
    explanation:
      'The real total revenue is $150 (100 + 50). The naive fan-out join inflates it to $350 by counting the first order\'s $100 twice (2 line items) and the second order\'s $50 three times (3 line items) - the inflation scales with how many line items each order happens to have.',
    tags: ['fan-out-bug', 'predict-output'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-predict-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function sums a semi-additive measure (account balance) across a week of daily snapshots. Trace it and print the result.',
    code: `def sum_daily_balance(daily_balances):
    return sum(daily_balances)

daily_balances = [1000, 1000, 1000, 1000, 1000, 1000, 1000]
print(sum_daily_balance(daily_balances))`,
    expectedOutput: '7000',
    explanation:
      'Summing a semi-additive measure like account balance across 7 days produces a meaningless "balance-days" number, not a real balance - the correct weekly figure is a single point-in-time snapshot (e.g. the last day\'s balance, 1000), not the sum.',
    tags: ['non-additive-trap', 'additivity', 'predict-output'],
    concepts: ['gld-non-additive-trap'],
  },
  {
    id: 'gld-predict-5',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function sums daily active users across 5 days to try to report a weekly figure. Trace it and print the result.',
    code: `def sum_daily_active_users(daily_dau):
    return sum(daily_dau)

daily_dau = [500, 520, 510, 505, 515]
print(sum_daily_active_users(daily_dau))`,
    expectedOutput: '2550',
    explanation:
      'Summing daily active users across days produces "user-days," not weekly active users - the same person active all 5 days gets counted 5 times, badly inflating the true distinct-user weekly figure, which requires a distinct count over the window instead.',
    tags: ['non-additive-trap', 'additivity', 'predict-output'],
    concepts: ['gld-non-additive-trap'],
  },
  {
    id: 'gld-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function computes the CORRECT weekly balance as a point-in-time snapshot instead of a sum. Trace it and print the result.',
    code: `def correct_weekly_balance(daily_balances):
    return daily_balances[-1]

daily_balances = [1000, 950, 980, 1020, 990, 990, 990]
print(correct_weekly_balance(daily_balances))`,
    expectedOutput: '990',
    explanation:
      'The correct weekly balance is the final day\'s snapshot value, not a sum across the 7 days - this is the fix for the Non-Additive Aggregation Trap when the measure is semi-additive across time.',
    tags: ['non-additive-trap', 'additivity', 'predict-output'],
    concepts: ['gld-non-additive-trap'],
  },
  {
    id: 'gld-mcq-i1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A new embedded analytics dashboard needs sub-second interactive filtering directly against the gold layer (DirectQuery, no import/cache step). Which gold shape fits better, and why?',
    options: [
      { id: 'a', text: 'OBT — a DirectQuery dashboard issues live queries straight at the gold table on every filter change, so pre-materializing joins into one wide table avoids runtime Spark shuffle joins; star schema forces query-time joins.', isCorrect: true },
      { id: 'b', text: 'Star schema — DirectQuery dashboards are specifically optimized to push multi-table joins down efficiently, so keeping dimensions separate produces faster interactive filtering than single wide tables.', isCorrect: false },
      { id: 'c', text: 'Neither shape matters for DirectQuery — the choice between OBT and star schema only affects Import Mode dashboards, because DirectQuery bypasses physical table structures during execution.', isCorrect: false },
      { id: 'd', text: 'OBT — DirectQuery dashboards cannot execute queries involving more than one physical table, making OBT mandatory regardless of query latency or compute resource considerations.', isCorrect: false },
    ],
    explanation:
      'This is the core OBT use case from the research: DirectQuery / embedded real-time dashboards eliminate runtime Spark shuffle joins by paying the join cost once, at ETL time, instead of on every user interaction.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },
  {
    id: 'gld-mcq-i2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A BI team uses Power BI Import Mode and needs full historical tracking of customer attribute changes over time (address, segment) via SCD Type 2. Which gold shape fits, and why?',
    options: [
      { id: 'a', text: "Star schema — Import Mode compresses a conformed dim_customer dimension extremely well via columnar dictionary encoding, and SCD Type 2 history naturally lives in a dimension table with effective-date columns; flattening that history into a wide OBT would duplicate every fact row's dimension attributes on every version change.", isCorrect: true },
      { id: 'b', text: "OBT — Import Mode's VertiPaq engine only supports single-table imports, so any dashboard using Import Mode is required to use a flattened OBT gold table regardless of historical-tracking requirements.", isCorrect: false },
      { id: 'c', text: 'Star schema — SCD Type 2 tracking is impossible in a Databricks gold layer regardless of shape choice, requiring full change history to be reconstructed from Delta time travel on every BI query.', isCorrect: false },
      { id: 'd', text: "OBT — SCD Type 2 effective-date columns are supported exclusively within single wide table schemas, as separate dimension tables cannot maintain temporal attribute change histories.", isCorrect: false },
    ],
    explanation:
      'This is the core star-schema use case: conformed dimensions with SCD Type 2 history compress well under Import Mode and avoid the duplication an OBT would force on every attribute change.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },
  {
    id: 'gld-mcq-i3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A pipeline needs to (1) drop exact-duplicate raw events coming from a retrying producer, and (2) exclude internal test accounts from the customer-facing revenue dashboard. Which hop does each belong in?',
    options: [
      { id: 'a', text: "Deduplication is a data-correctness fix that should apply no matter who consumes the table, so it belongs in silver. Excluding test accounts is a business rule specific to one consumer (the revenue dashboard) - other consumers might legitimately want test accounts included - so it belongs in gold.", isCorrect: true },
      { id: 'b', text: 'Both belong in silver — any filtering logic, whether a technical correctness fix or a business rule, must run as early as possible so gold tables never contain rows requiring downstream filtration.', isCorrect: false },
      { id: 'c', text: 'Both belong in gold — silver is restricted to type casting and column renaming, forcing all row-removal logic, including deduplication, to execute downstream in the business gold layer.', isCorrect: false },
      { id: 'd', text: 'Deduplication belongs in gold because modifying row counts is a business concern; excluding test accounts belongs in silver because boolean filters are generic technical transformations.', isCorrect: false },
    ],
    explanation:
      'The test is whether every consumer needs the fix (silver) or only one specific business question needs it (gold). A retry-caused duplicate is wrong for everyone; whether test accounts belong in a given number is specific to that number\'s purpose.',
    tags: ['placement-rule'],
    concepts: ['gld-placement-rule'],
  },
  {
    id: 'gld-mcq-i4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A pipeline needs to (1) cast a raw string "2024-03-15T10:00:00Z" column into a proper timestamp type, and (2) compute a rolling 7-day average order value for an executive dashboard. Which hop does each belong in?',
    options: [
      { id: 'a', text: "Casting a raw string into its correct type is a conformance fix every downstream consumer needs regardless of use case, so it belongs in silver. A rolling 7-day average is a business-specific KPI computed for one particular dashboard's needs, so it belongs in gold.", isCorrect: true },
      { id: 'b', text: 'Both belong in gold — type casting affects only BI display formats rather than underlying data correctness, allowing type conversions to be deferred to the final consumption layer.', isCorrect: false },
      { id: 'c', text: 'Type casting belongs in bronze because bronze enforces schema-on-read for string columns; rolling averages belong in silver so all downstream gold tables can share precomputed aggregations.', isCorrect: false },
      { id: 'd', text: 'Both belong in silver — rolling averages are standard statistical transformations that should be precalculated once in silver to maximize downstream gold layer reusability across teams.', isCorrect: false },
    ],
    explanation:
      'Type casting is exactly the kind of "makes the data itself correct" fix every consumer needs - it belongs in silver. A rolling average tailored to one executive dashboard\'s definition of "recent" is a business computation, so it belongs in gold.',
    tags: ['placement-rule'],
    concepts: ['gld-placement-rule'],
  },
  {
    id: 'gld-mcq-i5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A 200-person data org has finance, marketing, and product teams each wanting to evolve their own gold schemas independently, with finance under strict GDPR/audit requirements the other teams don\'t need. What structure fits better than one shared gold catalog?',
    options: [
      { id: 'a', text: 'Domain marts (e.g. finance_gold, marketing_gold, product_gold) — splitting by domain lets each team own its own schema evolution and lets finance apply stricter Unity Catalog access controls to just its own catalog, without those constraints or that coordination overhead spilling into marketing\'s or product\'s tables.', isCorrect: true },
      { id: 'b', text: 'A single shared gold catalog — Unity Catalog enforces governance exclusively at the workspace level rather than per catalog, making domain marts redundant for isolating compliance rules.', isCorrect: false },
      { id: 'c', text: 'Domain marts for finance only — marketing and product should share a combined catalog, as neither domain has compliance rules justifying independent catalog boundaries.', isCorrect: false },
      { id: 'd', text: 'A single shared gold catalog — 200 engineers is small enough for a central platform team to review and approve all cross-domain schema changes without creating engineering bottlenecks.', isCorrect: false },
    ],
    explanation:
      'Domain marts let compliance-driven access boundaries be scoped per-catalog rather than layered on top of one shared schema, and let each team evolve its own tables without funneling every change through a central review queue.',
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },
  {
    id: 'gld-mcq-i6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold sales_summary table has a bug affecting only the last 5 days of data; the table is 8 TB and rebuilding it from bronze would take 6+ hours. What reprocessing approach fits?',
    options: [
      { id: 'a', text: 'Selective replay — use Delta time travel (VERSION AS OF/TIMESTAMP AS OF) to find the last good state, then run REPLACE WHERE/MERGE INTO scoped to just the affected 5 days, instead of dropping and rebuilding the entire 8 TB table from bronze.', isCorrect: true },
      { id: 'b', text: 'Full pipeline rebuild — replaying from bronze is mandatory whenever transformation code changes, regardless of how small the affected partition range or how long the rebuild duration takes.', isCorrect: false },
      { id: 'c', text: 'Versioned blue/green swap — build sales_summary_v2 from scratch and repoint the view, as blue/green swaps are the only supported reprocessing mechanism for tables exceeding 5 TB in scale.', isCorrect: false },
      { id: 'd', text: 'Direct Parquet modification — tables over 5 TB require manual file system scripts because Delta transactions like REPLACE WHERE cannot operate reliably at petabyte storage scale.', isCorrect: false },
    ],
    explanation:
      'When the bug\'s scope is known and narrow relative to the table, selective replay gets the same correctness as a full rebuild at a fraction of the cost - reserve the full rebuild for when you can\'t bound the affected range.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (19) — 3 anti-patterns x 3 domain-transfer scenarios (9) +
  // 3 decision primitives x 3 domain-transfer scenarios (9) + 1
  // discrimination question
  // ────────────────────────────────────────────────────────────────────

  // Fan-Out Bug (x3)
  {
    id: 'gld-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold daily_revenue table is built by joining orders (one row per order, with order_amount) to order_line_items (many rows per order) and then running SUM(order_amount) over the joined result. A single $100 order with 3 line items shows up as $300 in the joined rows before aggregation. What\'s this anti-pattern called, and what\'s the fix?',
    options: [
      { id: 'a', text: "The Fan-Out Bug (fan trap) — joining a 1-to-many table without pre-aggregating multiplies the parent row's amount once per matching child row. The fix is to pre-aggregate order_line_items down to one row per order (or aggregate order_amount before the join) so each order's amount is counted exactly once.", isCorrect: true },
      { id: 'b', text: 'This is expected Delta Lake behavior for any join, not a bug — SUM() is defined to include a duplicated value once per row it appears in, so a $100 order with 3 line items correctly contributes $300 to any revenue total by design.', isCorrect: false },
      { id: 'c', text: 'Liquid Clustering misconfiguration — clustering the orders table by the wrong key causes Delta to physically duplicate matching rows during a join, which is fixed by re-clustering the table on order_id instead of order_amount.', isCorrect: false },
      { id: 'd', text: 'A rounding error in floating-point summation — SUM(order_amount) accumulates small precision errors across line items, which is fixed by casting order_amount to a DECIMAL type before running the aggregation.', isCorrect: false },
    ],
    explanation:
      'This is the canonical, named production failure mode - reported as up to 340% over-reporting in real cases. Pre-aggregate the many-side before joining, never after.',
    tags: ['fan-out-bug'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-mcq-a2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A SaaS company's gold mrr_summary table joins subscriptions (one row per subscription, with monthly_amount) to subscription_seats (many rows per subscription, one per licensed seat) and sums monthly_amount over the joined rows. A $500/month subscription with 10 seats reports as $5,000 in the summary. What's happening, and what's the fix?",
    options: [
      { id: 'a', text: 'This is correct MRR accounting — since each seat represents a separate licensed user, the $500 monthly_amount should legitimately be attributed once per seat, meaning the true MRR contribution of this subscription actually is $5,000, not $500.', isCorrect: false },
      { id: 'b', text: 'Same Fan-Out Bug as the order/line-item case — joining the 1-to-many subscription_seats table without pre-aggregating multiplies each subscription\'s monthly_amount by its seat count. The fix is to aggregate seats down to a count column joined against the subscription\'s amount once, not repeat the amount per seat row.', isCorrect: true },
      { id: 'c', text: "A schema drift issue — the subscription_seats table's _rescued_data column is capturing duplicate seat records from an upstream schema change, which is fixed by adding a rescued-data check to the Auto Loader ingestion for that table.", isCorrect: false },
      { id: 'd', text: 'An idempotency failure in the MERGE that builds subscriptions — re-running the MERGE without a proper key match condition is inserting the same subscription row multiple times, which is fixed by adding a deterministic merge key.', isCorrect: false },
    ],
    explanation:
      'Same mechanism, different domain - a 10x seat count produces a 10x inflated MRR figure for exactly the same reason a 3x line-item count produced a 3x inflated order total.',
    tags: ['fan-out-bug'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-mcq-a3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A ride-share gold driver_earnings table joins trips (one row per trip, with base_fare) to fare_adjustments (many rows per trip - surge, tip, toll reimbursement) and sums base_fare over the joined rows. A trip with a $20 base fare and 4 fare adjustment rows reports $80 in base fare alone. What\'s the underlying issue, and what\'s the fix?',
    options: [
      { id: 'a', text: 'This is intended behavior — base_fare should be split evenly across each fare_adjustments row so that summing the joined result reconstructs the total earnings including adjustments, meaning $80 is the trip\'s genuinely correct total earnings figure.', isCorrect: false },
      { id: 'b', text: "A late-arriving data issue — fare_adjustments rows for this trip arrived after the gold table's watermark cutoff, which is fixed by widening the watermark window so all adjustment rows land in the same micro-batch.", isCorrect: false },
      { id: 'c', text: 'The Fan-Out Bug again — joining the 1-to-many fare_adjustments table without pre-aggregating repeats base_fare once per adjustment row. The fix is to pre-aggregate adjustments into their own summed column(s) and join that against the trip\'s base_fare exactly once, rather than letting the join itself multiply base_fare.', isCorrect: true },
      { id: 'd', text: 'A grain mismatch between trips and fare_adjustments caused by using Liquid Clustering on one table and traditional PARTITIONED BY on the other — the fix is making both tables use the same partitioning strategy.', isCorrect: false },
    ],
    explanation:
      'Three domains, one mechanism: whenever a 1-to-many join runs before an aggregation instead of after, the parent-side measure gets multiplied by the child row count. Recognizing the shape matters more than the specific tables involved.',
    tags: ['fan-out-bug'],
    concepts: ['gld-fan-out-bug'],
  },

  // Non-Additive Aggregation Trap (x3)
  {
    id: 'gld-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold weekly_balance_summary table computes each account\'s weekly balance as SUM(daily_balance) across the 7 daily snapshot rows for that account. An account with a stable $1,000 balance all week reports $7,000 for the week. What\'s wrong, and what\'s the fix?',
    options: [
      { id: 'a', text: "Non-Additive Aggregation Trap — daily_balance is semi-additive: it can be summed across accounts on a given day, but summing it across days for the same account produces a meaningless 'balance-days' figure, not a real balance. The fix is to report a point-in-time snapshot for the week, like the last day's balance, instead of summing.", isCorrect: true },
      { id: 'b', text: "This is correct — a weekly balance is genuinely the sum of that account's daily balances across the 7 days, since 'weekly' just means aggregating the daily grain up to a coarser time bucket, the same way daily revenue sums up to weekly revenue.", isCorrect: false },
      { id: 'c', text: "A timezone bug — the 7 daily snapshot rows are being read using UTC instead of the account holder's local timezone, which causes the same day's balance to be counted twice, and is fixed by adding a timezone conversion before aggregating.", isCorrect: false },
      { id: 'd', text: "A duplicate-row issue in the bronze ingestion — the balance snapshot job is writing each day's balance twice due to a retry without deduplication, which is fixed by adding a dropDuplicates step in silver.", isCorrect: false },
    ],
    explanation:
      'The word "daily revenue sums to weekly revenue" is a trap in distractor (a): revenue is additive across time, balance is not. Confirming which category a measure falls into (additive/semi-additive/non-additive, from data_modeling) is the prerequisite check before choosing how to roll it up.',
    tags: ['non-additive-trap', 'additivity'],
    concepts: ['gld-non-additive-trap'],
  },
  {
    id: 'gld-mcq-a5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold weekly_active_users table computes SUM(daily_active_users) across 7 daily DAU rows to report weekly active users. A product with 500 DAU every day of the week reports 3,500 weekly active users. What\'s wrong, and what\'s the fix?',
    options: [
      { id: 'a', text: 'A Fan-Out Bug caused by joining the DAU table against a dim_date dimension without pre-aggregating first, which is fixed by aggregating dim_date down to one row per week before performing the join.', isCorrect: false },
      { id: 'b', text: "Non-Additive Aggregation Trap — daily active users is non-additive across time because the same person can be active on multiple days; summing it produces 'user-days,' not a real distinct-user count. The fix is to compute weekly active users directly as a distinct count of users over the 7-day window, not as a sum of the daily counts.", isCorrect: true },
      { id: 'c', text: 'This is correct, assuming the product has no repeat users within a week — since 500 users were active each day for 7 days, 3,500 genuinely represents seven separate cohorts of 500 first-time users each, which the sum correctly captures.', isCorrect: false },
      { id: 'd', text: 'A double-counting bug caused by running the DAU job twice per day due to a Cron Surgery scheduling issue, which is fixed by consolidating the two separately-scheduled DAU jobs into one Databricks Workflow with proper task dependencies.', isCorrect: false },
    ],
    explanation:
      'The assumption in distractor (c) - "no repeat users" - is exactly the assumption that almost never holds in practice; a real distinct-user count over the window is the only way to get a defensible weekly figure.',
    tags: ['non-additive-trap', 'additivity'],
    concepts: ['gld-non-additive-trap'],
  },
  {
    id: 'gld-mcq-a6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold weekly_inventory_summary table computes SUM(inventory_on_hand) across 7 daily snapshot rows per warehouse to report a weekly inventory figure. A warehouse holding a stable 10,000 units all week reports 70,000 units for the week. What\'s wrong, and what should the weekly figure be instead?',
    options: [
      { id: 'a', text: 'This is correct — inventory naturally accumulates over time the same way revenue does, so summing 7 days of 10,000-unit snapshots into a 70,000-unit weekly total accurately reflects a full week\'s worth of inventory being held.', isCorrect: false },
      { id: 'b', text: "A double-write issue from a Naked Overwrite — the daily inventory job is using mode('overwrite') without a date filter, which is duplicating the previous 6 days' snapshots into the current day's partition and inflating the sum.", isCorrect: false },
      { id: 'c', text: 'A grain mismatch — the inventory_on_hand column was declared at the SKU grain in silver but the gold table aggregates at the warehouse grain, so the fix is adding a SKU-level dimension table to reconcile the two grains before summing.', isCorrect: false },
      { id: 'd', text: 'Non-Additive Aggregation Trap again — inventory-on-hand is a semi-additive, point-in-time measure; it can be summed across warehouses on a given day but not across days for the same warehouse. The correct weekly figure is a snapshot, typically the last day\'s on-hand count (10,000 here), not a sum across the 7 days.', isCorrect: true },
    ],
    explanation:
      'Third domain, same mechanism as balance and DAU: any "how much do we have right now" measure is semi-additive across time and needs a point-in-time snapshot for a period rollup, never a sum across the period.',
    tags: ['non-additive-trap', 'additivity'],
    concepts: ['gld-non-additive-trap'],
  },

  // Grain Shift Catastrophe (x3)
  {
    id: 'gld-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'To save storage, a team redesigns their gold sales table to store only weekly rollups instead of the original daily-grain transactional table, then deletes the daily-grain table entirely. Three months later, finance asks for a day-by-day drill-down for a specific promotional week. What\'s the resulting problem called, and what\'s the fix?',
    options: [
      { id: 'a', text: "Grain Shift Catastrophe — the destroyed daily grain can never be reconstructed from the weekly rollup alone. The fix is keeping the transactional-grain table alongside the rollup, as a derived addition rather than a destructive replacement.", isCorrect: true },
      { id: 'b', text: 'Nothing is actually lost — a weekly rollup can always be evenly divided by 7 to reconstruct each day\'s individual sales figure, since daily sales within a stable week are assumed to be roughly uniform across all 7 days.', isCorrect: false },
      { id: 'c', text: "A Partition Blast Radius issue — the weekly redesign accidentally used an unscoped mode('overwrite') that wiped historical partitions, which is fixed by re-running the daily job with a replaceWhere predicate scoped to the missing week.", isCorrect: false },
      { id: 'd', text: "A Time-Gap Roulette issue — the weekly rollup job is scheduled too soon after the daily job finishes, so it's silently reading a stale, pre-promotion snapshot; the fix is a table-update trigger instead of a fixed cron time.", isCorrect: false },
    ],
    explanation:
      "This is Grain Shift Catastrophe: prematurely aggregating gold to a coarser grain and discarding the finer-grained table destroys information no arithmetic can recover - dividing a weekly total back down only produces an estimate, never the real daily figures. Answering the drill-down now needs a full rebuild from bronze, if bronze even retained the raw data that far back. Keep the fine grain as the source of truth; build rollups as additions, not replacements.",
    tags: ['grain-shift-catastrophe', 'gold-granularity'],
    concepts: ['gld-grain-shift-catastrophe'],
  },
  {
    id: 'gld-mcq-a8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A marketing team rebuilds their gold ad_spend table to store only monthly totals per campaign, discarding the original daily-grain fact table to cut storage costs. Two months later, an analyst needs to identify which specific day a campaign\'s cost-per-click spiked. What\'s this called, and what should have been done differently?',
    options: [
      { id: 'a', text: 'No problem exists here — since a month is just 30ish rolled-up days, the analyst can approximate the daily cost-per-click by dividing the monthly total by the number of days in the month and treating that as the daily figure.', isCorrect: false },
      { id: 'b', text: "A Non-Additive Aggregation Trap — cost-per-click is a ratio and can't be legitimately summed across days into a monthly total in the first place, so the real fix is to stop reporting a monthly cost-per-click at all, independent of the grain question.", isCorrect: false },
      { id: 'c', text: "A Naked Overwrite issue — the monthly rebuild used mode('overwrite') without scoping to the current month, which is fixed with a replaceWhere predicate for the affected month's partition.", isCorrect: false },
      { id: 'd', text: "Grain Shift Catastrophe — once the daily-grain table is gone, the monthly rollup can't be un-aggregated to recover which day the spike happened on; that granularity is permanently lost. The fix is to always retain the transactional/finest grain as the source of truth and treat the monthly rollup as a derived, non-destructive summary built on top of it.", isCorrect: true },
    ],
    explanation:
      'Distractor (b) is a real observation about cost-per-click being non-additive, but it\'s a distraction from the actual failure here - the daily grain itself was destroyed, which is a different problem than how a ratio measure should be aggregated.',
    tags: ['grain-shift-catastrophe', 'gold-granularity'],
    concepts: ['gld-grain-shift-catastrophe'],
  },
  {
    id: 'gld-mcq-a9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A support team redesigns gold to store only quarterly ticket-volume totals per category, dropping the original per-ticket fact table since 'nobody looks at individual tickets in gold anyway.' The next quarter, a spike in one category triggers an investigation that needs to see exactly which tickets and which days drove it. What's the structural mistake, and what's the durable fix?",
    options: [
      { id: 'a', text: "Grain Shift Catastrophe — collapsing to a quarterly rollup and deleting the per-ticket table removes the only path back to a ticket-by-ticket investigation. The durable fix is keeping the per-ticket fact table as the retained source of truth, with the rollup built as an additional, non-destructive table.", isCorrect: true },
      { id: 'b', text: "A Silent Drop Sinking issue — the quarterly aggregation job is using expect_or_drop on malformed ticket rows without a quarantine stream, which is fixed by routing dropped rows to a dead-letter table via DLT's dual-stream pattern.", isCorrect: false },
      { id: 'c', text: 'A Cron Surgery issue — the quarterly rollup job and the underlying per-ticket ingestion job are on separate, offset schedules, which is fixed by merging them into a single Databricks Workflow with explicit task dependencies.', isCorrect: false },
      { id: 'd', text: "This isn't actually a mistake, since 'nobody looks at individual tickets in gold anyway' was already true before the redesign — deleting a table nobody queries has no real cost, independent of what grain the remaining table is stored at.", isCorrect: false },
    ],
    explanation:
      '"Nobody looks at it" is a description of today\'s access pattern, not a guarantee about tomorrow\'s - an investigation is exactly the kind of unplanned need that a destroyed fine grain can never satisfy again, and there\'s no way to derive finer detail back out of a coarser aggregate after the fact.',
    tags: ['grain-shift-catastrophe', 'gold-granularity'],
    concepts: ['gld-grain-shift-catastrophe'],
  },

  // OBT vs star, complex decision scenarios (x3)
  {
    id: 'gld-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A single gold orders_summary table currently in OBT shape serves both (1) a DirectQuery embedded dashboard needing sub-second filtering and (2) a data science team building repeated ad-hoc feature joins against dim_customer attributes that change weekly. The OBT shape is starting to strain under duplicated dimension data that goes stale between refreshes. What\'s the better long-term design?',
    options: [
      { id: 'a', text: "Split into a star schema with a properly refreshed dim_customer for the data science team's feature work, and materialize a separate OBT (or a materialized view over the star schema) specifically for the DirectQuery dashboard's query pattern — each consumer gets the shape suited to how it actually queries, instead of forcing one shape to serve two conflicting access patterns.", isCorrect: true },
      { id: 'b', text: 'Keep the single OBT table but increase the refresh frequency to hourly — since the underlying problem is only staleness of the duplicated dimension data, refreshing more often fully resolves both the DirectQuery latency and the data science team\'s staleness concern with no structural change needed.', isCorrect: false },
      { id: 'c', text: "Move both consumers to query bronze directly instead of gold, since bronze retains the most granular, freshest version of every dimension attribute and neither the DirectQuery latency requirement nor the feature-join pattern actually depends on any gold-layer transformation.", isCorrect: false },
      { id: 'd', text: 'This is not a real design conflict — OBT and star schema are functionally interchangeable representations of the same data, and Databricks automatically converts between the two behind the scenes depending on which query pattern is detected at runtime.', isCorrect: false },
    ],
    explanation:
      'One gold shape forced to serve two conflicting access patterns is a design smell, not a fact of life - splitting into a shape-per-consumer (backed by unity catalog materialized views where useful) is the standard fix once a table is straining this way.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },
  {
    id: 'gld-mcq-a11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A team currently has a star-schema gold layer (fact_orders, dim_customer, dim_product) serving nightly-refreshed Import Mode dashboards. Product now wants to add a real-time, embedded DirectQuery view for a customer-facing order-status page. What\'s the right move, and what\'s the wrong move?',
    options: [
      { id: 'a', text: 'Right move: fully migrate fact_orders/dim_customer/dim_product into one OBT table and retire the star schema entirely, since a single gold shape should always serve every consumer the org has, present and future, to keep the design simple.', isCorrect: false },
      { id: 'b', text: "Right move: add a purpose-built OBT (or materialized view flattening the star schema) specifically for the new DirectQuery use case, keeping the existing star schema intact for the Import Mode dashboards it already serves well. Wrong move: migrating the entire existing gold layer to OBT just because the new consumer needs it, which would hurt the Import Mode dashboards that were already well-served by the star schema.", isCorrect: true },
      { id: 'c', text: "Right move: leave the star schema completely unchanged and tell product that DirectQuery isn't achievable in a lakehouse architecture at all, since DirectQuery is fundamentally incompatible with any table built from a Databricks gold layer.", isCorrect: false },
      { id: 'd', text: 'Right move: convert the existing dashboards from Import Mode to DirectQuery against the current star schema with no other changes, since DirectQuery performance against a star schema and against an OBT table is identical in every case.', isCorrect: false },
    ],
    explanation:
      'A new consumer with a different query pattern is a reason to add a purpose-built table, not a reason to migrate everything - the existing star schema was already the right fit for its existing consumers.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },
  {
    id: 'gld-mcq-a12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A finance team is deciding gold shape for a new expenses table. It\'s queried heavily by a self-service DirectQuery dashboard used by 50 non-technical analysts running varied ad-hoc filters all day, and rarely by any tool that would benefit from a shared, reusable dimension. Storage cost is a secondary concern. What shape fits, and why?',
    options: [
      { id: 'a', text: "OBT — the dominant access pattern (frequent, varied, non-technical ad-hoc filtering against a live DirectQuery dashboard) is exactly what OBT optimizes for by eliminating runtime joins, and since there's little reuse of a shared conformed dimension across other consumers, the storage-duplication cost that would normally argue for a star schema barely applies here.", isCorrect: true },
      { id: 'b', text: 'Star schema — since storage cost is described as a secondary concern, that removes the main argument for OBT (avoiding duplication), leaving star schema as the safer default choice regardless of the dashboard\'s query pattern or its DirectQuery mode.', isCorrect: false },
      { id: 'c', text: 'Neither — 50 concurrent analysts running ad-hoc filters exceeds what any single gold table shape can support, so the table needs to be pre-aggregated into a fixed, non-interactive summary that the dashboard reads once per day instead of querying live.', isCorrect: false },
      { id: 'd', text: 'OBT, but only because expenses is a financial table — table shape for gold in a lakehouse is chosen by which business domain the data belongs to (finance, marketing, product), not by the consuming tool\'s query pattern.', isCorrect: false },
    ],
    explanation:
      'Two signals point the same direction here: the DirectQuery access pattern favors OBT, and the usual counter-argument (storage duplication, or losing a genuinely shared/reused dimension) doesn\'t really apply in this case - so there\'s no real tension pulling toward star schema.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },

  // Domain marts, complex decision scenarios (x3)
  {
    id: 'gld-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A company grows from 30 to 300 data engineers over two years, all still funneling schema changes through one shared gold catalog owned by a 5-person platform team. PR review queues for gold schema changes now regularly exceed two weeks. What\'s the structural problem, and what\'s the fix?',
    options: [
      { id: 'a', text: 'This is the classic single-shared-gold bottleneck — one team can\'t keep up with schema-change review volume from 300 engineers across many domains. The fix is splitting into domain marts, each owned and evolved independently by its own domain team, with the platform team setting standards (naming, access, governance) rather than gatekeeping every individual change.', isCorrect: true },
      { id: 'b', text: 'The fix is to hire more people onto the 5-person platform team proportional to headcount growth, since a single shared gold catalog scales cleanly with team size as long as the review team itself grows at the same rate as the rest of the org.', isCorrect: false },
      { id: 'c', text: 'The fix is to freeze the gold schema entirely and require every new business need to be served by ad-hoc queries against silver instead, since further schema evolution at this org size is inherently unmanageable regardless of catalog structure.', isCorrect: false },
      { id: 'd', text: "The fix is to move from Delta Lake to a different storage format, since the two-week review queue is a limitation of Delta's transaction log serializing schema changes across the org's tables, not a team-structure or process problem.", isCorrect: false },
    ],
    explanation:
      'This is the review-queue symptom the "domain marts vs single shared gold" tradeoff predicts directly: a central bottleneck team can\'t scale with headcount the way independently-owned domain marts can.',
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },
  {
    id: 'gld-mcq-a14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A healthcare company's data platform serves both a clinical-operations domain under strict HIPAA controls and a marketing-analytics domain with no such requirement, both currently reading and writing to one shared gold catalog. An audit flags that marketing engineers technically have query access to clinical gold tables. What's the structural fix?",
    options: [
      { id: 'a', text: "Split into domain marts with clinical operations in its own catalog (clinical_gold) under HIPAA-appropriate Unity Catalog access controls, separate from a marketing_gold catalog with looser access — a shared catalog structurally can't express that clinical and marketing teams need fundamentally different access boundaries.", isCorrect: true },
      { id: 'b', text: 'Keep the single shared catalog and instead train marketing engineers on HIPAA policy, since the underlying issue is a knowledge gap about what they\'re allowed to query, not a structural gap in how access is actually enforced by the catalog.', isCorrect: false },
      { id: 'c', text: 'Keep the single shared catalog and encrypt only the clinical tables\' columns at rest, since column-level encryption alone is sufficient to satisfy a HIPAA audit even when a marketing engineer\'s account technically retains query access to those tables.', isCorrect: false },
      { id: 'd', text: "This isn't fixable within a lakehouse architecture at all — Unity Catalog has no mechanism for restricting table access by team, so any HIPAA-compliant separation of clinical and marketing data would require moving clinical data out of Databricks entirely.", isCorrect: false },
    ],
    explanation:
      'This is exactly the compliance-boundary case the research highlights for domain marts: strict regulatory boundaries (GDPR/HIPAA) are the clearest justification for splitting a catalog, independent of team size.',
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },
  {
    id: 'gld-mcq-a15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A 15-person startup, all data work handled by one small team with one shared executive dashboard, splits gold into 6 separate domain marts (sales_gold, marketing_gold, product_gold, support_gold, finance_gold, ops_gold) because 'that's what data mesh recommends.' What's the likely outcome, and what would have been the better call?",
    options: [
      { id: 'a', text: 'At this size, splitting into 6 marts mostly adds coordination overhead (6 catalogs, 6 sets of access controls, duplicated conformance logic) with none of the benefit domain marts exist for, since there\'s no team-ownership boundary to actually decouple — one team still does all the work. A single shared gold catalog would have been the better fit; domain marts pay off once there are genuinely separate teams that need independent schema evolution.', isCorrect: true },
      { id: 'b', text: "This is the correct call regardless of team size — data mesh's domain-mart pattern is a strict best practice that should always be followed as soon as an organization has more than one identifiable business domain in its data, independent of how many people actually work on it.", isCorrect: false },
      { id: 'c', text: 'The outcome will be positive because 6 separate catalogs allow Unity Catalog to parallelize query execution across domains, meaning the executive dashboard will run measurably faster once it\'s rebuilt against the 6 split marts instead of the original single catalog.', isCorrect: false },
      { id: 'd', text: 'The likely outcome is a Fan-Out Bug, since splitting one gold table into 6 separate catalogs forces every cross-domain query to perform an implicit 1-to-many join across catalog boundaries that wasn\'t present in the single shared design.', isCorrect: false },
    ],
    explanation:
      'The domain-marts tradeoff cuts both ways - it\'s just as much a mistake to over-apply it (splitting when there\'s no ownership boundary to decouple) as it is to under-apply it (staying centralized when review queues or compliance boundaries demand a split).',
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },

  // Reprocessing/replay, complex decision scenarios (x3)
  {
    id: 'gld-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold revenue table has a bug in a currency-conversion transform affecting all of 2023 (12 TB of gold data; silver and bronze are unaffected and still correct). The team has a maintenance window long enough for a full rebuild, and wants to guarantee the fix is completely correct with no risk of a partially-applied patch. What\'s the right reprocessing choice, and what tradeoff is being accepted?',
    options: [
      { id: 'a', text: "A full pipeline rebuild for 2023 — since the bug is deterministic, silver is unaffected, and there's a maintenance window available, replaying the affected date range from silver through the currency-conversion transform is the most certain way to guarantee correctness. The tradeoff is accepted compute cost and time, in exchange for not having to reason about whether a selective replaceWhere/MERGE patch covers every edge case the bug touched.", isCorrect: true },
      { id: 'b', text: "A versioned blue/green swap — build revenue_v2 from scratch in parallel and atomically swap the view, since this is always strictly better than any other reprocessing strategy regardless of the bug's scope or how much maintenance window is available.", isCorrect: false },
      { id: 'c', text: 'Selective replay via REPLACE WHERE scoped to 2023 — since the bug\'s scope is exactly known (all of 2023), this is guaranteed to be both faster and just as correct as a full rebuild, with no tradeoff being accepted at all.', isCorrect: false },
      { id: 'd', text: 'None of the standard strategies apply, since a bug spanning a full calendar year is too large in scope for selective replay and too small in scope to justify a full rebuild — this situation requires a custom one-off script outside the normal pipeline.', isCorrect: false },
    ],
    explanation:
      'A full rebuild isn\'t automatically the "safe" default, but it is the right call here specifically because a maintenance window exists and certainty matters more than speed - the same bug at a smaller scale with no maintenance window would favor selective replay instead.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },
  {
    id: 'gld-mcq-a17',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A gold inventory_levels table backs a live, customer-facing 'in stock' indicator with continuous read traffic that can't tolerate even a brief gap or inconsistent read. The team needs to fix a bug affecting the whole table's current logic. What reprocessing approach avoids customer-visible downtime?",
    options: [
      { id: 'a', text: "Versioned gold (blue/green view swap) — build the corrected table (inventory_levels_v2) in parallel while the current table keeps serving live traffic unaffected, validate v2, then atomically repoint the Unity Catalog view to v2 in one instant switch, so customers never see a gap or an inconsistent intermediate state.", isCorrect: true },
      { id: 'b', text: 'A full pipeline rebuild in place — drop and rebuild inventory_levels directly from bronze, since Delta Lake\'s snapshot isolation guarantees customer reads stay fully consistent throughout the entire multi-hour rebuild window with zero visible impact.', isCorrect: false },
      { id: 'c', text: "Selective replay via REPLACE WHERE run directly against the live table during business hours, since REPLACE WHERE is defined to be atomic across the entire predicate's matching partitions regardless of how large the affected partition set is.", isCorrect: false },
      { id: 'd', text: "There's no way to avoid some visible downtime here — any reprocessing strategy applied to a table serving continuous live read traffic necessarily produces at least a brief window where reads see partially-updated data, no matter which approach is used.", isCorrect: false },
    ],
    explanation:
      'Blue/green is the reprocessing strategy purpose-built for exactly this constraint - zero-downtime is a property of NOT touching the table consumers are reading until the moment of an atomic view swap, not a property Delta gives you automatically on any in-place rebuild.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },
  {
    id: 'gld-mcq-a18',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "A team needs to backfill just the last 3 days of a gold table after a minor bug, but reaches for a full versioned blue/green rebuild (parallel _v2 table, full historical replay from bronze) because 'that's the safest option.' What's the actual downside of defaulting to this for a small, targeted fix?",
    options: [
      { id: 'a', text: "It's significant wasted cost and time for no real benefit — a blue/green rebuild replays the ENTIRE table's history to build _v2, when a selective REPLACE WHERE/MERGE scoped to just the last 3 days would fix the same bug at a fraction of the compute and turnaround time, with equivalent correctness for a change this narrow in scope.", isCorrect: true },
      { id: 'b', text: 'There is no real downside — a blue/green rebuild is strictly the safest reprocessing option in every situation, so defaulting to it for even a small, 3-day fix is always the correct engineering choice regardless of the extra cost.', isCorrect: false },
      { id: 'c', text: 'The downside is that blue/green rebuilds are only supported for tables under 1 TB in Delta Lake, so this approach would fail outright on any larger gold table rather than simply being more expensive than necessary.', isCorrect: false },
      { id: 'd', text: 'The downside is purely aesthetic — a _v2 table left behind after the swap clutters the catalog\'s naming, but there is no actual difference in compute cost or turnaround time between a blue/green rebuild and a selective 3-day patch.', isCorrect: false },
    ],
    explanation:
      'This closes the loop on all three reprocessing scenarios in this topic: the "safest" strategy isn\'t free, and reaching for the heaviest tool by default wastes real compute and time when a scoped fix would do the job with equivalent correctness.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // Discrimination question
  {
    id: 'gld-mcq-disc1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "Both the Fan-Out Bug and the Non-Additive Aggregation Trap can produce a gold revenue-like number that's inflated far above the true value. What's the concrete difference between the two, in terms of WHERE the inflation comes from?",
    options: [
      { id: 'a', text: "The Fan-Out Bug's inflation comes from a join — a 1-to-many join without pre-aggregating causes a parent value to be repeated once per matching child row. The Non-Additive Aggregation Trap's inflation comes from an aggregation — summing a semi-additive or non-additive measure (like a balance or DAU) across a dimension, usually time, that it isn't valid to sum across, with no join involved at all.", isCorrect: true },
      { id: 'b', text: "There's no real difference — both names describe the exact same underlying mechanism (a join multiplying a value across duplicate rows), just discovered independently in two different domains (order data and account-balance data) and given two different names for historical reasons.", isCorrect: false },
      { id: 'c', text: 'The Fan-Out Bug only happens in streaming pipelines, while the Non-Additive Aggregation Trap only happens in batch pipelines — the distinguishing factor is the trigger mode of the job, not anything about joins or aggregation.', isCorrect: false },
      { id: 'd', text: 'The Fan-Out Bug is a bronze-layer issue caused by schema drift, while the Non-Additive Aggregation Trap is a silver-layer issue caused by late-arriving data — the distinguishing factor is which hop of the medallion architecture the bug originates in.', isCorrect: false },
    ],
    explanation:
      "The practical test: does the inflated number involve a join between two tables of different grain (Fan-Out Bug), or a plain SUM() over one table's own rows across a dimension the measure isn't additive over (Non-Additive Aggregation Trap)? The predict-output questions earlier in this topic modeled each mechanism separately for exactly this reason.",
    tags: ['fan-out-bug', 'non-additive-trap'],
    concepts: ['gld-fan-out-bug', 'gld-non-additive-trap'],
  },

  // ────────────────────────────────────────────────────────────────────
  // CODING (2) + PARSONS (1)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'gld-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question: `A gold pipeline joins orders_df (order_id, order_amount) to line_items_df (order_id, sku, quantity - 1-to-many) to compute total_items per order alongside order_amount.

Pre-aggregate line_items_df by order_id to compute total_items (SUM of quantity) BEFORE left-joining to orders_df, preventing Fan-Out Bug inflation of order_amount. Store the result in \`result\`.`,
    starterCode: `# Pre-aggregate line_items_df and join to orders_df\nimport pyspark.sql.functions as F\n\nresult = None\n`,
    solution: `line_item_totals = line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items"))
result = orders_df.join(line_item_totals, on="order_id", how="left")
# OR
result = orders_df.join(
    line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items")),
    on="order_id",
    how="left"
)`,
    testCases: [],
    explanation: 'Pre-aggregating line_items_df by order_id before joining prevents fan-out inflation of order_amount.',
    tieredHints: {
      apiSignature: 'df.groupBy(*cols).agg(*exprs)',
      skeleton: `line_item_totals = line_items_df.groupBy("order_id").____(F.____("quantity").alias("total_items"))\nresult = orders_df.____(line_item_totals, on="order_id", how="____")`,
    },
    tags: ['fan-out-bug'],
    concepts: ['gld-fan-out-bug'],
  },
  {
    id: 'gld-coding-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question: `A gold sales_summary table partitioned by sales_date has a bug affecting only sales_date = '2024-03-15'.

Write PySpark code to overwrite ONLY the sales_date = '2024-03-15' partition in sales_summary using corrected_df via Delta replaceWhere.`,
    starterCode: `# Overwrite partition sales_date = '2024-03-15' using replaceWhere\n`,
    solution: `corrected_df.write \\
    .format("delta") \\
    .mode("overwrite") \\
    .option("replaceWhere", "sales_date = '2024-03-15'") \\
    .saveAsTable("sales_summary")
# OR
corrected_df.write.format("delta").mode("overwrite").option("replaceWhere", "sales_date = '2024-03-15'").saveAsTable("sales_summary")`,
    testCases: [],
    explanation: 'replaceWhere overwrites only the matching partition slice without affecting existing historical partitions.',
    tieredHints: {
      apiSignature: 'dfWriter.option(key, value)',
      skeleton: `corrected_df.____ \\\n    .____("delta") \\\n    .____("overwrite") \\\n    .____("replaceWhere", "sales_date = '2024-03-15'") \\\n    .____("sales_summary")`,
    },
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },
  {
    id: 'gld-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Order the steps to implement a zero-downtime versioned gold swap: build corrected table sales_summary_v2, validate it, and atomically update sales_summary_view.',
    correctOrder: [
      'build_v2_df = build_corrected_gold_transform(source_df)',
      'build_v2_df.write.format("delta").mode("overwrite").saveAsTable("sales_summary_v2")',
      'validate_v2 = run_validation_checks("sales_summary_v2")',
      'spark.sql("ALTER VIEW sales_summary_view AS SELECT * FROM sales_summary_v2")',
    ],
    distractorLines: [
      'spark.sql("DROP TABLE sales_summary")',
      'build_v2_df.write.format("delta").mode("overwrite").saveAsTable("sales_summary")',
    ],
    solution: `build_v2_df = build_corrected_gold_transform(source_df)\nbuild_v2_df.write.format("delta").mode("overwrite").saveAsTable("sales_summary_v2")\nvalidate_v2 = run_validation_checks("sales_summary_v2")\nspark.sql("ALTER VIEW sales_summary_view AS SELECT * FROM sales_summary_v2")`,
    explanation: 'Atomic view repointing ensures zero downtime for downstream consumers during a versioned gold rebuild.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },
];
