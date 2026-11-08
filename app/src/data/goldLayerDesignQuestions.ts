import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// GOLD_LAYER_DESIGN - Databricks course, "Lakehouse Architecture &
// Engineering Practice" section.
//
// This topic is the gold-layer design judgment layer on top of data_modeling,
// scd_patterns, pipeline_design and medallion_architecture: how to shape a gold
// table (OBT vs star), how to choose its grain, how to split gold ownership
// (one catalog vs domain marts), where a transform belongs (silver vs gold),
// how to reprocess gold after a bug, and the failure modes that follow when
// these are misjudged (the Fan-Out Bug, summing a measure that cannot be
// summed, collapsing the grain).
//
// Coverage (39 questions):
//   Beginner (5 MCQ): the five core ideas.
//   Intermediate (12): 6 predicts that run the fan-out and non-additive
//     arithmetic as Spark SQL on small tables, and 6 scenario MCQs.
//   Advanced (19 MCQ): each failure mode and each decision in three settings,
//     and one question that tells two look-alike failures apart.
//   Coding/Parsons (3): pre-aggregate before a join, a scoped replaceWhere
//     write, and a blue/green swap.

export const goldLayerDesignQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (5)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'gld-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'What is the main tradeoff between a One Big Table (OBT) and a star schema in a gold layer?',
    options: [
      { id: 'a', text: 'An OBT pre-joins everything once at load time, so queries run no joins but repeat dimension values on every row; a star schema joins at query time.', isCorrect: true },
      { id: 'b', text: 'An OBT is stored as Parquet files and a star schema as Delta tables, so the choice is only a file format decision that dashboards cannot tell apart.', isCorrect: false },
      { id: 'c', text: 'An OBT is meant for tables under 1 TB and a star schema for tables above it, so the size of the data alone decides which shape to build.', isCorrect: false },
      { id: 'd', text: 'An OBT keeps facts and dimensions in separate tables that are joined when a query runs, while a star schema pre-joins them once at load time into one wide table.', isCorrect: false },
    ],
    explanation:
      'Neither shape is better everywhere. An OBT pays the join once, when the table is loaded, so interactive queries are simple and fast, at the cost of repeated dimension values and a rewrite when a dimension changes. A star schema keeps each fact and dimension once and joins them when a query runs. The right choice depends on how the consumer queries, which the next questions practise.',
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
      "What does a gold fact table's grain declaration state, and why must every measure column match it?",
    options: [
      { id: 'a', text: 'It names the primary key column, and a PRIMARY KEY constraint in Unity Catalog then enforces the grain, so every measure can be summed safely.', isCorrect: false },
      { id: 'b', text: 'It sets how coarse the table is, and the coarsest grain, such as one row per month, is best because any finer view can be rebuilt from it later.', isCorrect: false },
      { id: 'c', text: "It only matters for an OBT, because a star schema's dimension tables already fix the grain for every query that joins to them.", isCorrect: false },
      { id: 'd', text: "It says what one row represents, such as one row per order line; a measure not valid at that grain gives wrong totals when summed.", isCorrect: true },
    ],
    explanation:
      "Stating the grain as \"one row per X\" is what lets you check whether a measure can be summed at that grain. PRIMARY KEY constraints on Delta tables document intent but are not enforced. Leaving the grain implicit leads to the failures later in this topic: a measure repeated by a join, and detail lost by a rollup that replaces the finer table.",
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
      'What is the tradeoff between one shared gold catalog and one gold catalog per domain, such as finance_gold and marketing_gold?',
    options: [
      { id: 'a', text: "One shared catalog is simplest to govern but queues changes behind one owner; domain catalogs let teams move alone, with repeated logic.", isCorrect: true },
      { id: 'b', text: "Per-domain catalogs do not suit Unity Catalog, whose three-level namespace is designed for exactly one gold catalog shared by every team.", isCorrect: false },
      { id: 'c', text: 'A shared catalog is only for streaming tables and per-domain catalogs only for batch tables, so the ingestion mode decides the layout.', isCorrect: false },
      { id: 'd', text: 'Per-domain catalogs need a different table format from a shared catalog, so splitting gold means migrating every table to a new format.', isCorrect: false },
    ],
    explanation:
      "This is a team and compliance decision as much as a technical one. A single catalog gives one place to govern and a consistent set of tables, which suits a small team. Separate domain catalogs give each team its own schema changes and its own access grants, and they pay for it with some repeated logic and looser central control.",
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
      'What is the general rule for deciding whether a transformation belongs in silver or in gold?',
    options: [
      { id: 'a', text: 'Silver holds transformations on streaming sources and gold holds transformations on batch sources, so the trigger mode decides the layer.', isCorrect: false },
      { id: 'b', text: 'Silver holds the work of the platform team and gold holds the work of the analysts, so the author decides the layer rather than the transformation.', isCorrect: false },
      { id: 'c', text: "Silver fixes what all consumers need, like deduplicating and casting; gold holds rules for one business question, like excluding test accounts.", isCorrect: true },
      { id: 'd', text: 'Any step that changes a value, such as casting a type or converting a currency, belongs in gold, because silver must keep the source values untouched.', isCorrect: false },
    ],
    explanation:
      'Ask whether every consumer needs the change or only one. Removing duplicates is right for everyone, so it belongs in silver. Leaving out test accounts is right for the revenue dashboard but another consumer may want them, so it belongs in gold. Who writes the code and whether the source streams do not decide it.',
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
      'After a transformation bug is fixed, which description of the ways to reprocess a pipeline is right?',
    options: [
      { id: 'a', text: "Always rebuild the whole table from bronze, because Delta cannot rewrite only part of a table once it has been written and committed to storage.", isCorrect: false },
      { id: 'b', text: "Replay only the damaged slice with REPLACE WHERE if the damage is bounded, rebuild everything if not, or build a copy and repoint the view.", isCorrect: true },
      { id: 'c', text: "Choose by table size: under 1 GB rebuild, up to 100 GB replay a slice, and above 100 GB a table cannot safely be reprocessed at all.", isCorrect: false },
      { id: 'd', text: "The three approaches give different numbers for the same fix, so the choice is about which numbers the business prefers to report.", isCorrect: false },
    ],
    explanation:
      'The approaches differ in cost and in what readers see, not in the answer. Replaying a slice is the cheapest when you know which rows are wrong. A full rebuild is for damage you cannot bound. Blue/green builds a new copy beside the live one, checks it, then repoints the view, so readers never see a half-built table.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) - 6 predicts + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'gld-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'In a Databricks notebook, the tables orders and order_lines hold exactly the rows shown; order_lines has one row per item on an order. What does the cell print? The answer is a single whole number.',
    tables: [
      { name: 'orders', columns: ['order_id', 'amount'], rows: [
        [1, 100],
        [2, 50],
      ] },
      { name: 'order_lines', columns: ['order_id', 'sku'], rows: [
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'd'],
        [2, 'e'],
      ] },
    ],
    code: `r = spark.sql("""SELECT SUM(o.amount) AS revenue
    FROM orders o JOIN order_lines l
      ON o.order_id = l.order_id""").first()
print(r.revenue)`,
    expectedOutput: '400',
    explanation:
      'The join gives one row per order line: order 1 meets three lines and order 2 meets two. Each order\'s amount is therefore repeated once per line, so the sum is 100 + 100 + 100 + 50 + 50 = 400, not the true revenue of 150. This is the Fan-Out Bug: joining the parent to the many side before aggregating.',
    hints: [
      'How many rows does the join return for order 1?',
      'The amount is a column of orders, but it rides along on every joined row.',
    ],
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
      'Same two tables, now queried by counting the lines per order first and joining that to orders. What does the cell print? The answer is one line: two whole numbers separated by a space (revenue, then items).',
    tables: [
      { name: 'orders', columns: ['order_id', 'amount'], rows: [
        [1, 100],
        [2, 50],
      ] },
      { name: 'order_lines', columns: ['order_id', 'sku'], rows: [
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'd'],
        [2, 'e'],
      ] },
    ],
    code: `r = spark.sql("""WITH per_order AS (
      SELECT order_id, COUNT(*) AS n
      FROM order_lines GROUP BY order_id)
    SELECT SUM(o.amount) AS revenue, SUM(p.n) AS items
    FROM orders o LEFT JOIN per_order p
      ON o.order_id = p.order_id""").first()
print(r.revenue, r.items)`,
    expectedOutput: '150 5',
    explanation:
      'per_order has one row per order (order 1 with 3 lines, order 2 with 2), so each order meets exactly one row. Revenue is 100 + 50 = 150 and the items add to 3 + 2 = 5. Bringing the many side to the parent\'s grain before the join keeps the parent\'s measure from being repeated.',
    hints: [
      'How many rows does per_order have?',
      'Each order now meets one row, so its amount is counted once.',
    ],
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
      'The tables below hold exactly these rows; order 3 has no lines. The cell joins without aggregating the lines first. What does it print? The answer is one line: two whole numbers separated by a space (rows, then revenue).',
    tables: [
      { name: 'orders', columns: ['order_id', 'amount'], rows: [
        [1, 100],
        [2, 50],
        [3, 30],
      ] },
      { name: 'order_lines', columns: ['order_id', 'sku'], rows: [
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'd'],
        [2, 'e'],
      ] },
    ],
    code: `r = spark.sql("""SELECT COUNT(*) AS n, SUM(o.amount) AS revenue
    FROM orders o LEFT JOIN order_lines l
      ON o.order_id = l.order_id""").first()
print(r.n, r.revenue)`,
    expectedOutput: '6 430',
    explanation:
      'The left join returns 3 rows for order 1, 2 rows for order 2 and 1 row for order 3, whose missing lines give it a single row with NULLs: 6 rows in all. The sum is 300 + 100 + 30 = 430, against a true revenue of 180. The inflation depends on how many lines each order has: the order with no lines is the only one counted correctly.',
    hints: [
      'A left join keeps an order that has no matching line, once.',
      'Multiply each amount by the number of rows its order produces.',
    ],
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
      'The table balance_snapshot holds one row per account per day with the closing balance, exactly the rows shown. A report adds up the days to show a balance for the period. What does the cell print? The answer is a single whole number.',
    tables: [
      { name: 'balance_snapshot', columns: ['account', 'day', 'balance'], rows: [
        ['a1', '2026-03-02', 1000],
        ['a1', '2026-03-03', 1000],
        ['a1', '2026-03-04', 1000],
        ['a1', '2026-03-05', 1000],
      ] },
    ],
    code: `r = spark.sql("""SELECT SUM(balance) AS b
    FROM balance_snapshot
    WHERE account = 'a1'""").first()
print(r.b)`,
    expectedOutput: '4000',
    explanation:
      'The account held 1000 on each of 4 days, so the sum is 4000. That figure is "balance-days", not a balance: the account never held 4000. A balance is semi-additive. It can be added across accounts on one day, but across days a report needs one point in time, such as the last day\'s balance (1000 here).',
    hints: [
      'Add the four balance values.',
      'Is the result an amount the account ever actually held?',
    ],
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
      'The table logins has one row each time a user logs in on a day, exactly the rows shown. The cell adds up the daily active users and also counts the distinct users for the whole period. What does it print? The answer is one line: two whole numbers separated by a space (sum of daily counts, then distinct users).',
    tables: [
      { name: 'logins', columns: ['day', 'user_id'], rows: [
        ['2026-03-02', 'u1'],
        ['2026-03-02', 'u2'],
        ['2026-03-03', 'u1'],
        ['2026-03-03', 'u2'],
        ['2026-03-03', 'u3'],
        ['2026-03-04', 'u1'],
      ] },
    ],
    code: `r = spark.sql("""SELECT SUM(dau) AS summed,
        (SELECT COUNT(DISTINCT user_id) FROM logins) AS distinct_users
    FROM (SELECT day, COUNT(DISTINCT user_id) AS dau
          FROM logins GROUP BY day)""").first()
print(r.summed, r.distinct_users)`,
    expectedOutput: '6 3',
    explanation:
      'The daily active users are 2, 3 and 1, which sum to 6, but only 3 different people logged in. Summing daily distinct counts counts a returning user once per day ("user-days"). A distinct count is not additive across days, so a weekly figure has to be a distinct count over the whole window.',
    hints: [
      'First work out the distinct users on each day.',
      'u1 appears on all three days.',
    ],
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
      'The table balance_snapshot holds exactly these rows. The cell takes each account\'s balance on its last day, then adds the accounts together. What does it print? The answer is a single whole number.',
    tables: [
      { name: 'balance_snapshot', columns: ['account', 'day', 'balance'], rows: [
        ['a1', '2026-03-02', 1000],
        ['a1', '2026-03-03', 950],
        ['a1', '2026-03-04', 980],
        ['b1', '2026-03-02', 500],
        ['b1', '2026-03-03', 500],
        ['b1', '2026-03-04', 520],
      ] },
    ],
    code: `r = spark.sql("""SELECT SUM(balance) AS total
    FROM (SELECT account, MAX_BY(balance, day) AS balance
          FROM balance_snapshot GROUP BY account)""").first()
print(r.total)`,
    expectedOutput: '1500',
    explanation:
      'MAX_BY(balance, day) returns the balance on each account\'s latest day: 980 for a1 and 520 for b1. Those are added across accounts, which is valid for a balance on one day: 980 + 520 = 1500. This is the fix for summing a semi-additive measure over time: take one point in time per account, then add across accounts.',
    hints: [
      'What does MAX_BY(balance, day) return for each account?',
      'Adding across accounts on the same day is fine for a balance.',
    ],
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
      'An embedded dashboard in a customer-facing app needs sub-second filtering straight against the gold layer, with DirectQuery and no import step. Which gold shape fits better, and why?',
    options: [
      { id: 'a', text: 'A star schema, because the dimension tables are small, so joining them on every filter change is always free and a pre-joined table adds nothing.', isCorrect: false },
      { id: 'b', text: 'Neither shape matters for DirectQuery, because it ignores the physical table design and reads every table as one flat view of the data.', isCorrect: false },
      { id: 'c', text: 'An OBT, because DirectQuery sends a live query on every filter change, and a pre-joined table means that query needs no join at run time.', isCorrect: true },
      { id: 'd', text: 'A star schema, because DirectQuery engines run a single-table scan faster only when the table is split into a fact and its dimensions.', isCorrect: false },
    ],
    explanation:
      'With DirectQuery every click becomes a query against gold, so work done at query time is paid for on every interaction. An OBT pays the join once at load time. This is the standard OBT case; a star schema also works, but each filter change then joins the fact to its dimensions.',
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
      'A BI team uses Power BI Import Mode and must keep full history of customer attribute changes, such as address and segment, with SCD Type 2. Which gold shape fits, and why?',
    options: [
      { id: 'a', text: 'An OBT, because SCD Type 2 date columns are only supported in a single wide table, so a separate dimension cannot keep a change history.', isCorrect: false },
      { id: 'b', text: "A star schema: the history lives once in dim_customer with valid dates, where an OBT would repeat it on every fact row.", isCorrect: true },
      { id: 'c', text: 'An OBT, because Import Mode can only load one table, so every dashboard on Import Mode needs its data flattened first.', isCorrect: false },
      { id: 'd', text: 'A star schema, because SCD Type 2 is not possible in gold at all, so history has to be rebuilt from Delta time travel on every query.', isCorrect: false },
    ],
    explanation:
      'A Type 2 dimension is a table of customer versions with valid-from and valid-to dates, and facts point at the right version. Flattening that into an OBT would copy every attribute onto every fact row and rewrite many rows whenever a customer changes. Import Mode loads several related tables without trouble, so a star schema suits it.',
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
      'A pipeline must (1) drop exact-duplicate raw events sent twice by a retrying producer, and (2) leave internal test accounts out of the customer-facing revenue dashboard. Which layer does each belong in?',
    options: [
      { id: 'a', text: "Deduplication in silver, since a repeated event is wrong for everyone; test accounts in gold, since another consumer may want them.", isCorrect: true },
      { id: 'b', text: 'Both in gold, because silver is limited to casting types and renaming columns, so every step that removes rows runs in the business layer.', isCorrect: false },
      { id: 'c', text: 'Deduplication in gold, because changing row counts is a business matter, and the test-account filter in silver, because it is a plain condition.', isCorrect: false },
      { id: 'd', text: 'Both in silver, because filtering should happen as early as possible, so that gold never holds rows that something downstream has to remove.', isCorrect: false },
    ],
    explanation:
      'Ask whether every consumer needs the fix. A duplicate caused by a retry is wrong for everyone, so it is fixed once in silver. Whether test accounts belong in a number depends on that number\'s purpose, so the rule lives in the gold table that serves the revenue dashboard.',
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
      'A pipeline must (1) cast a raw string such as "2024-03-15T10:00:00Z" into a timestamp column, and (2) compute a rolling 7-day average order value for an executive dashboard. Which layer does each belong in?',
    options: [
      { id: 'a', text: 'Both in silver, because a rolling average is a standard statistic that is best computed once, so that every gold table can reuse it.', isCorrect: false },
      { id: 'b', text: "The cast in silver, as all consumers need a timestamp; the rolling average in gold, as one dashboard's own definition of recent.", isCorrect: true },
      { id: 'c', text: 'The cast in bronze, because bronze applies types to string columns as it reads them, and the rolling average in silver for reuse.', isCorrect: false },
      { id: 'd', text: 'Both in gold, because a cast only changes how a value is displayed, so it can wait until the final layer that people actually query.', isCorrect: false },
    ],
    explanation:
      'Bronze keeps the data as it arrived. Turning a string into a timestamp makes the data itself correct for every consumer, so it belongs in silver. A 7-day average is a business calculation that one dashboard defines, so it belongs in the gold table for that dashboard.',
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
      'A 200-person data org has finance, marketing and product teams, and each wants to change its own gold schemas without waiting for the others. Finance also has strict GDPR and audit rules the other teams do not. What fits better than one shared gold catalog?',
    options: [
      { id: 'a', text: 'One shared catalog, because Unity Catalog applies governance only at the workspace level, so a separate catalog could not isolate finance anyway.', isCorrect: false },
      { id: 'b', text: "Domain catalogs such as finance_gold and marketing_gold: each team owns its schema changes, and finance gets stricter grants on its own catalog.", isCorrect: true },
      { id: 'c', text: 'A separate catalog for finance only, with marketing and product sharing one, since only finance has a compliance need worth isolating.', isCorrect: false },
      { id: 'd', text: 'One shared catalog, because 200 people is small enough for a central team to review every schema change without delaying the other teams.', isCorrect: false },
    ],
    explanation:
      'Splitting by domain gives each team its own schema changes and lets the compliance boundary be a grant on one catalog instead of a pile of table-level rules in a shared schema. The question says all three teams want independence, so keeping marketing and product together would leave them waiting on each other.',
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
      'A bug in a gold sales_summary table affected only the last 5 days of data. The table is 8 TB and a rebuild from bronze would take over 6 hours. Silver is correct. What reprocessing fits?',
    options: [
      { id: 'a', text: 'Rebuild the whole table, because any change to transformation code means every row must be recomputed from bronze, however small the damage.', isCorrect: false },
      { id: 'b', text: 'Build sales_summary_v2 from scratch and repoint the view, since a blue/green copy is the only supported way to reprocess a table above 5 TB.', isCorrect: false },
      { id: 'c', text: 'Rewrite the data files by hand with a script, because Delta transactions such as REPLACE WHERE cannot run reliably on tables this large.', isCorrect: false },
      { id: 'd', text: 'Recompute just those 5 days from silver and write them with REPLACE WHERE or MERGE, so the other days of the table are not rewritten.', isCorrect: true },
    ],
    explanation:
      'The damage is bounded, so replay only that slice: recompute it from silver and replace it atomically. This gives the same result as a full rebuild at a fraction of the cost. Keep the full rebuild for damage you cannot bound.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (19)
  // ────────────────────────────────────────────────────────────────────

  // Fan-Out Bug (x3)
  {
    id: 'gld-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold daily_revenue table joins orders (one row per order, with order_amount) to order_line_items (many rows per order) and then runs SUM(order_amount) over the joined rows. A single $100 order with 3 line items shows as $300. What is wrong, and what is the fix?',
    options: [
      { id: 'a', text: 'The join repeats order_amount once per line item (the Fan-Out Bug); the fix is to reduce the line items to one row per order before joining.', isCorrect: true },
      { id: 'b', text: 'Liquid Clustering on the wrong key makes Delta copy matching rows during a join; the fix is to re-cluster orders on order_id instead of order_amount.', isCorrect: false },
      { id: 'c', text: 'Floating-point error builds up across the line items; the fix is to cast order_amount to DECIMAL before the aggregation.', isCorrect: false },
      { id: 'd', text: 'SUM adds a repeated value once per row by design, so $300 is correct; the fix is to report the total per line item instead of per order.', isCorrect: false },
    ],
    explanation:
      'Joining a parent to its many side before aggregating repeats the parent\'s measure once for every child row, so the sum is multiplied by the number of line items. Aggregate the many side to one row per order first, then join, so each order\'s amount is counted exactly once.',
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
      "A SaaS company's gold mrr_summary joins subscriptions (one row per subscription, with monthly_amount) to subscription_seats (one row per licensed seat) and sums monthly_amount. A $500/month subscription with 10 seats reports $5,000. What is happening, and what is the fix?",
    options: [
      { id: 'a', text: 'The $500 is billed once per seat, so $5,000 is the true monthly revenue of this subscription and the summary is correct.', isCorrect: false },
      { id: 'b', text: 'The MERGE that builds subscriptions inserts the same row more than once; the fix is a deterministic merge key on the subscription id.', isCorrect: false },
      { id: 'c', text: "The join repeats the subscription's amount once per seat; reduce seats to one row per subscription, such as a count, before joining.", isCorrect: true },
      { id: 'd', text: 'Schema drift fills _rescued_data with duplicate seat records; the fix is a rescued-data check in the Auto Loader that ingests the seats.', isCorrect: false },
    ],
    explanation:
      'The same mechanism as orders and line items: a one-to-many join before the aggregation repeats the subscription\'s amount for each seat, so 10 seats inflate the figure 10 times. Aggregate the seats to the subscription\'s grain first and join that.',
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
      'A ride-share gold driver_earnings table joins trips (one row per trip, with base_fare) to fare_adjustments (many rows per trip: surge, tip, toll) and sums base_fare over the joined rows. A trip with a $20 base fare and 4 adjustment rows reports $80 of base fare. What is the issue, and what is the fix?',
    options: [
      { id: 'a', text: 'The adjustments for this trip arrived after the watermark; the fix is to widen the watermark so every adjustment lands in the same micro-batch.', isCorrect: false },
      { id: 'b', text: 'The join repeats base_fare once per adjustment row; the fix is to sum the adjustments per trip first and join that single row to the trip.', isCorrect: true },
      { id: 'c', text: 'base_fare is meant to be split evenly across the adjustment rows, so $80 is the trip\'s correct total once the adjustments are added.', isCorrect: false },
      { id: 'd', text: 'One table uses Liquid Clustering and the other PARTITIONED BY, so the grains differ; the fix is to give both tables the same layout.', isCorrect: false },
    ],
    explanation:
      'Whenever a one-to-many join runs before the aggregation, the parent\'s measure is multiplied by the number of child rows. Here that is 4 adjustment rows, so $20 becomes $80. Recognising the shape matters more than the table names: reduce the many side to the parent\'s grain, then join.',
    tags: ['fan-out-bug'],
    concepts: ['gld-fan-out-bug'],
  },

  // Summing a measure that cannot be summed (x3)
  {
    id: 'gld-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A gold weekly_balance_summary computes an account\'s weekly balance as SUM(daily_balance) over its 7 daily snapshot rows. An account that holds a steady $1,000 all week reports $7,000. What is wrong, and what is the fix?',
    options: [
      { id: 'a', text: 'Nothing is wrong: a weekly balance is the sum of the daily balances, in the same way that daily revenue adds up to weekly revenue.', isCorrect: false },
      { id: 'b', text: "A balance is semi-additive, so adding it across days gives \"balance-days\"; use a point-in-time value for the week, such as the last day's.", isCorrect: true },
      { id: 'c', text: 'The 7 snapshot rows are read in UTC instead of the holder\'s time zone, which counts a day twice; the fix is a time-zone conversion before the sum.', isCorrect: false },
      { id: 'd', text: 'The snapshot job wrote each day twice after a retry; the fix is a dropDuplicates step in silver so every day is counted once.', isCorrect: false },
    ],
    explanation:
      'Revenue is additive over time, but a balance describes how much there is at one moment. It can be added across accounts on the same day, not across days of the same account. Revenue summing to a weekly total is the trap in option A. Check how a measure behaves before choosing how to roll it up.',
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
      'A gold weekly_active_users table sums 7 daily active user (DAU) rows to report weekly active users. A product with 500 DAU on every day of the week reports 3,500. What is wrong, and what is the fix?',
    options: [
      { id: 'a', text: "The same person is active on several days, so summing counts people once per day; use a distinct count of users over the 7-day window.", isCorrect: true },
      { id: 'b', text: 'The DAU table is joined to dim_date without aggregating first, which repeats each row; the fix is to reduce dim_date to one row per week.', isCorrect: false },
      { id: 'c', text: 'Nothing is wrong when the product has no repeat users, since 3,500 then counts seven separate groups of 500 first-time users each.', isCorrect: false },
      { id: 'd', text: 'The DAU job runs twice a day because of two separate schedules; the fix is to merge them into one job with proper task dependencies.', isCorrect: false },
    ],
    explanation:
      'A distinct count is not additive across days: someone active on 5 days is counted 5 times by the sum. The only defensible weekly figure is a distinct count of users over the whole window. The "no repeat users" case in option C almost never holds for a real product.',
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
      'A gold weekly_inventory_summary sums inventory_on_hand over 7 daily snapshot rows per warehouse. A warehouse holding a steady 10,000 units reports 70,000 for the week. What is wrong, and what should the weekly figure be?',
    options: [
      { id: 'a', text: "Inventory builds up over time like revenue does, so 70,000 correctly shows a full week of stock being held, which is why the sum is the right rollup.", isCorrect: false },
      { id: 'b', text: 'A mode("overwrite") without a date filter copies the previous 6 days into the current partition, which inflates the sum; the fix is a replaceWhere.', isCorrect: false },
      { id: 'c', text: 'The column was declared at SKU grain in silver but is summed at warehouse grain; the fix is a SKU dimension to reconcile the two grains.', isCorrect: false },
      { id: 'd', text: "Inventory on hand is a point-in-time, semi-additive measure; the weekly figure is a snapshot such as the last day's 10,000, not a sum of days.", isCorrect: true },
    ],
    explanation:
      'Any "how much do we have right now" measure is semi-additive. It can be added across warehouses on one day but not across days for the same warehouse. A period rollup takes a snapshot, such as the closing count, never the sum.',
    tags: ['non-additive-trap', 'additivity'],
    concepts: ['gld-non-additive-trap'],
  },

  // Collapsing the grain (x3)
  {
    id: 'gld-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'To save storage, a team replaces its daily-grain gold sales table with weekly rollups and deletes the daily table. Three months later finance asks for a day-by-day drill-down for one promotional week. What went wrong, and what should have been done?',
    options: [
      { id: 'a', text: 'Nothing is lost: each weekly figure can be divided by 7 to recover the days, since sales within a week are roughly even.', isCorrect: false },
      { id: 'b', text: 'The weekly job ran an unscoped overwrite that wiped old partitions; the fix is to re-run the daily job with a replaceWhere for the missing week.', isCorrect: false },
      { id: 'c', text: 'The finer grain was destroyed and cannot be recovered from the rollup; the daily table should have been kept and the rollup added beside it.', isCorrect: true },
      { id: 'd', text: 'The weekly job ran too soon after the daily job and read a stale snapshot; the fix is a table update trigger instead of a fixed time.', isCorrect: false },
    ],
    explanation:
      'Collapsing gold to a coarser grain and deleting the finer table destroys information no arithmetic can restore: dividing a weekly total gives an estimate, not the real days. Answering the drill-down now means a rebuild from bronze, if bronze still holds the data. Keep the finest grain as the source of truth and build rollups beside it.',
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
      'A marketing team keeps only monthly totals per campaign in gold ad_spend and drops the daily table to cut storage. Two months later an analyst must find the day a campaign\'s cost per click spiked. What went wrong, and what should have been done differently?',
    options: [
      { id: 'a', text: "Nothing: the analyst can divide the monthly total by the days in the month and treat that as the daily figure, since cost per click is steady within a month.", isCorrect: false },
      { id: 'b', text: 'Cost per click is a ratio and cannot be summed into a monthly total, so the real fix is to stop reporting a monthly figure at all.', isCorrect: false },
      { id: 'c', text: 'The monthly rebuild used an overwrite not scoped to the current month; the fix is a replaceWhere on the month being rebuilt.', isCorrect: false },
      { id: 'd', text: 'The daily detail is gone and cannot be recovered from a monthly rollup; keep the daily table as the source of truth and build the rollup from it.', isCorrect: true },
    ],
    explanation:
      'Option B notices something true, that a ratio cannot be summed, but it is not what stopped the analyst. The cause is that the daily grain no longer exists. A coarse rollup cannot be turned back into the days, so keep the finest grain and derive the rollup.',
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
      "A support team keeps only quarterly ticket totals per category in gold and drops the per-ticket table, because \"nobody looks at individual tickets in gold\". Next quarter a spike in one category needs an investigation of which tickets and days drove it. What is the mistake, and the durable fix?",
    options: [
      { id: 'a', text: "Deleting a table nobody queries costs nothing, so the design was fine and the investigation should use the quarterly totals it already has.", isCorrect: false },
      { id: 'b', text: 'The quarterly job drops malformed tickets with expect_or_drop and no quarantine table; the fix is a dead-letter table for the dropped rows.', isCorrect: false },
      { id: 'c', text: "Dropping the per-ticket table removed the only route to ticket detail; keep it as the source of truth and build the rollup beside it.", isCorrect: true },
      { id: 'd', text: 'The rollup and the ticket ingestion job run on offset schedules; the fix is one Databricks job with explicit task dependencies.', isCorrect: false },
    ],
    explanation:
      '"Nobody looks at it" describes today\'s access pattern, not tomorrow\'s. An investigation is exactly the unplanned need that a destroyed fine grain can never meet, and detail cannot be derived back out of an aggregate. Keep the ticket-level table and add the quarterly rollup beside it.',
    tags: ['grain-shift-catastrophe', 'gold-granularity'],
    concepts: ['gld-grain-shift-catastrophe'],
  },

  // OBT vs star in harder scenarios (x3)
  {
    id: 'gld-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'One gold orders_summary OBT serves (1) a DirectQuery embedded dashboard that needs sub-second filtering and (2) a data science team that repeatedly joins to dim_customer attributes that change weekly. The OBT\'s copied dimension values go stale between refreshes. What is the better long-term design?',
    options: [
      { id: 'a', text: 'Keep the single OBT and refresh it hourly, since staleness is the only problem and a faster refresh solves both consumers without a structural change.', isCorrect: false },
      { id: 'b', text: 'Treat this as no real conflict: Databricks converts between an OBT and a star schema at run time, depending on which query pattern it detects.', isCorrect: false },
      { id: 'c', text: 'Let both consumers read bronze, which keeps the freshest, most detailed version of every dimension attribute and needs no gold transformation.', isCorrect: false },
      { id: 'd', text: "Use a star schema with a current dim_customer for the data science work and a separate OBT, or materialized view, for the dashboard: one shape each.", isCorrect: true },
    ],
    explanation:
      'One shape forced to serve two different access patterns is a design smell. Keep the star schema as the source of truth, with its dimension refreshed once, and build the flat table the dashboard needs from it, for example as a materialized view. Each consumer then gets the shape that matches how it queries.',
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
      'A team has a star-schema gold layer (fact_orders, dim_customer, dim_product) serving nightly Import Mode dashboards. Product now wants a real-time DirectQuery order-status page in a customer-facing app. What is the right move?',
    options: [
      { id: 'a', text: 'Migrate the whole gold layer into one OBT and retire the star schema, so that a single shape serves every present and future consumer.', isCorrect: false },
      { id: 'b', text: 'Tell product that DirectQuery cannot be done on a table built in a Databricks gold layer, and leave the star schema as it is.', isCorrect: false },
      { id: 'c', text: 'Move the existing dashboards to DirectQuery against the current star schema, since DirectQuery on a star schema and on an OBT performs the same.', isCorrect: false },
      { id: 'd', text: "Add a purpose-built OBT, or a view that flattens the star, for the new page, and keep the star for the dashboards it already suits.", isCorrect: true },
    ],
    explanation:
      'A new consumer with a different query pattern is a reason to add a table made for it, not to migrate everything. The star schema still fits the Import Mode dashboards, and moving them to an OBT would give up what suited them.',
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
      'A finance team is choosing a gold shape for a new expenses table. It is queried by one self-service DirectQuery dashboard with 50 non-technical analysts running varied ad-hoc filters all day, and nothing else needs to reuse its dimensions. Storage cost matters little. Which shape fits?',
    options: [
      { id: 'a', text: "An OBT: live ad-hoc filtering is what an OBT serves best, and with no other consumer reusing a dimension, duplication barely matters.", isCorrect: true },
      { id: 'b', text: 'A star schema, because storage cost is not a concern, so the main argument for an OBT is gone and a star schema is the safer default.', isCorrect: false },
      { id: 'c', text: 'Neither, because 50 analysts filtering at once is more than any single gold table can serve, so the table has to become a fixed daily summary.', isCorrect: false },
      { id: 'd', text: 'An OBT, because expenses is a finance table, and gold shape follows the business domain rather than how the consuming tool queries it.', isCorrect: false },
    ],
    explanation:
      'Both signals point the same way. The access pattern, frequent and varied live filtering, favours an OBT because it removes runtime joins. The usual reasons to prefer a star schema, saving storage and reusing a shared dimension, hardly apply here.',
    tags: ['obt-vs-star'],
    concepts: ['gld-obt-vs-star'],
  },

  // Domain marts in harder scenarios (x3)
  {
    id: 'gld-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A company grew from 30 to 300 data engineers in two years, and every gold schema change still goes through one shared catalog owned by a 5-person platform team. Review queues for schema changes now exceed two weeks. What is the structural problem, and the fix?',
    options: [
      { id: 'a', text: 'Hire platform engineers in proportion to headcount, since one shared catalog scales as long as the review team grows at the same rate.', isCorrect: false },
      { id: 'b', text: 'Freeze the gold schema and serve every new need with ad-hoc queries on silver, because schema change at this size cannot be managed.', isCorrect: false },
      { id: 'c', text: "One team cannot review 300 engineers' changes; split into domain catalogs owned by their teams, the platform team setting standards.", isCorrect: true },
      { id: 'd', text: 'Move off Delta to another format, since the queue comes from the Delta log serializing schema changes across the organisation.', isCorrect: false },
    ],
    explanation:
      'A central team is a bottleneck that does not scale with headcount. Domain catalogs owned by domain teams remove the queue, while the platform team keeps the rules on naming, access and governance instead of approving every change. The Delta log has nothing to do with the review queue.',
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
      "A healthcare company's clinical-operations data is under strict HIPAA rules, while marketing analytics has none, yet both sit in one shared gold catalog. An audit finds marketing engineers can query clinical tables. The team wants the boundary to be part of the structure, not a long list of per-table rules. What is the fix?",
    options: [
      { id: 'a', text: "Put clinical data in its own catalog, clinical_gold, granted only to clinical staff; marketing gets a separate catalog with its own grants.", isCorrect: true },
      { id: 'b', text: 'Keep one catalog and revoke marketing\'s access table by table, then repeat that for every new clinical table that appears.', isCorrect: false },
      { id: 'c', text: 'Keep one catalog and train marketing engineers on HIPAA, since the gap is knowledge of what they may query, not how access is set.', isCorrect: false },
      { id: 'd', text: 'Keep one catalog and encrypt the clinical columns at rest, since column encryption alone satisfies the audit even if marketing can query them.', isCorrect: false },
    ],
    explanation:
      'A catalog is a boundary you grant as a whole, so putting the regulated domain in its own catalog makes "marketing cannot see clinical data" true by structure. Per-table revokes work only until someone forgets one. Training and encryption at rest do not change who can query the tables.',
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
      "A 15-person startup, with one small data team and one executive dashboard, splits gold into six domain catalogs (sales_gold, marketing_gold, product_gold, support_gold, finance_gold, ops_gold) because \"that is what data mesh recommends\". What is the likely outcome, and what would have been better?",
    options: [
      { id: 'a', text: "It is right at any size: the domain pattern is a strict best practice once there is more than one business area in the data, whatever the team structure.", isCorrect: false },
      { id: 'b', text: 'It adds overhead and no benefit, since one team still does all the work; a single shared catalog fits until separate teams need their own changes.', isCorrect: true },
      { id: 'c', text: 'It makes the dashboard faster, because Unity Catalog runs queries in parallel across catalogs once the data is split into six.', isCorrect: false },
      { id: 'd', text: 'It causes the Fan-Out Bug, because every query across the six catalogs becomes an implicit one-to-many join across catalog boundaries.', isCorrect: false },
    ],
    explanation:
      'Domain catalogs pay off when separate teams need independent schema changes or a compliance boundary. With one team there is no ownership boundary to decouple, so six catalogs only add six sets of grants and repeated shared logic. The tradeoff cuts both ways: it is as much a mistake to split too early as to stay central too long.',
    tags: ['domain-marts'],
    concepts: ['gld-domain-marts'],
  },

  // Reprocessing in harder scenarios (x3)
  {
    id: 'gld-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      'A currency-conversion transform in a 12 TB gold revenue table has been wrong since launch, and nobody can say which dates it affected. Silver and bronze are correct and there is a maintenance window long enough for a rebuild. What is the right reprocessing choice, and what tradeoff is accepted?',
    options: [
      { id: 'a', text: 'Replay only the last 30 days with REPLACE WHERE, because recent dates are the ones people read and a smaller replay always gives the same result.', isCorrect: false },
      { id: 'b', text: "Rebuild the whole table from silver, because the damage cannot be bounded; the tradeoff is compute and time for certainty nothing is missed.", isCorrect: true },
      { id: 'c', text: 'Use a blue/green copy, which is strictly better than every other approach whatever the scope of the bug or the window available.', isCorrect: false },
      { id: 'd', text: 'Write a one-off script outside the pipeline, since the damage is too wide to replay a slice and too small to justify a full rebuild.', isCorrect: false },
    ],
    explanation:
      'A bounded bug calls for replaying a slice. When you cannot say which rows are wrong, a slice replay may leave bad rows behind, so recompute the whole table. The cost is compute and time, which a maintenance window makes affordable. Building a v2 copy first would also work if readers must not see the rebuild.',
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
      "A gold inventory_levels table backs a live \"in stock\" indicator with constant read traffic. A bug affects the whole table's logic. The team must check the corrected table before any customer reads it, and be able to switch back instantly. What approach does that?",
    options: [
      { id: 'a', text: 'Drop inventory_levels and rebuild it from bronze, since Delta snapshot isolation keeps reads consistent through the whole rebuild.', isCorrect: false },
      { id: 'b', text: 'Build inventory_levels_v2 beside it, check it, then repoint the view customers read to v2, keeping the old table as the way back.', isCorrect: true },
      { id: 'c', text: 'Run REPLACE WHERE on the live table during business hours, since it is atomic, so customers only ever see old or new rows.', isCorrect: false },
      { id: 'd', text: 'Accept that any reprocessing of a table under constant reads shows customers some partly updated data, whichever approach is used.', isCorrect: false },
    ],
    explanation:
      'Blue/green leaves the table customers read untouched until the checked copy is ready, then switches the view in one step, with the old table still there to switch back to. Dropping the table leaves nothing to read. REPLACE WHERE is atomic but publishes the new rows straight away with no chance to check them first.',
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
      "To backfill just the last 3 days of a gold table after a minor bug, a team builds a full blue/green copy, replaying the whole table's history into a _v2 table, because \"it is the safest option\". What is the downside of using that for a small fix?",
    options: [
      { id: 'a', text: 'It is strictly the safest approach in every case, so reaching for it even on a 3-day fix is always right whatever it costs.', isCorrect: false },
      { id: 'b', text: 'It replays the whole table to fix 3 days; a REPLACE WHERE or MERGE on those days gives the same result for far less compute and time.', isCorrect: true },
      { id: 'c', text: 'Blue/green copies are only supported for tables under 1 TB, so the approach fails outright on a larger gold table.', isCorrect: false },
      { id: 'd', text: "The only cost is a leftover _v2 table that clutters the catalog; the compute and time are the same as a 3-day patch, and nothing else changes.", isCorrect: false },
    ],
    explanation:
      'The safest-looking option is not free. A blue/green rebuild recomputes everything to fix 3 days, while a scoped replay recomputes only the damaged slice and is just as correct for a change this narrow. Match the tool to the size of the damage.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },

  // Telling two failures apart
  {
    id: 'gld-mcq-disc1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.GOLD_LAYER_DESIGN,
    course: Course.DATABRICKS,
    question:
      "Both the Fan-Out Bug and summing a measure that cannot be summed can leave a gold revenue-like number far above the true value. Where does the inflation come from in each?",
    options: [
      { id: 'a', text: 'The Fan-Out Bug happens only in streaming pipelines and the summing problem only in batch, so the trigger mode tells them apart.', isCorrect: false },
      { id: 'b', text: "They are one mechanism, a join multiplying a value across duplicate rows, which was found in two domains and named twice by different teams over the years.", isCorrect: false },
      { id: 'c', text: 'The Fan-Out Bug comes from schema drift in bronze and the summing problem from late-arriving data in silver, so the layer tells them apart.', isCorrect: false },
      { id: 'd', text: "The Fan-Out Bug comes from a join repeating a parent value per child row; the other from a plain SUM across a dimension, usually time, with no join.", isCorrect: true },
    ],
    explanation:
      'Ask whether the inflated number involves a join between tables of different grain, which is the Fan-Out Bug, or only a SUM over one table\'s own rows across a dimension the measure cannot be added over, such as a balance across days. The fixes differ too: pre-aggregate before joining, or take a snapshot or a distinct count.',
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
    requires: ['groupBy', 'sum', 'quantity', 'total_items', '.join(', 'left'],
    question: `A gold pipeline has two DataFrames: orders_df (order_id, order_amount, one row per order) and line_items_df (order_id, sku, quantity, many rows per order).

Build result: every order with its order_amount and a total_items column holding the sum of quantity over its line items. Orders with no line items must stay in result.

Reduce line_items_df to one row per order BEFORE joining, so order_amount is not repeated for each line item.`,
    starterCode: `import pyspark.sql.functions as F

result = None
`,
    solution: `line_item_totals = line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items"))
result = orders_df.join(line_item_totals, on="order_id", how="left")
# OR
result = orders_df.join(
    line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items")),
    "order_id",
    "left",
)
# OR
totals = line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items"))
result = orders_df.join(totals, orders_df.order_id == totals.order_id, "left").drop(totals.order_id)`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'line_item_totals = line_items_df.groupBy("order_id").agg(F.sum("quantity").alias("total_items"))\nresult = orders_df.join(line_item_totals, on="order_id", how="left")',
        description:
          'Groups line_items_df by order_id with SUM(quantity) as total_items, then left-joins those per-order totals to orders_df, so each order keeps one row and its order_amount is not repeated.',
      },
    ],
    explanation:
      'Grouping line_items_df by order_id first leaves one row per order, so the join cannot repeat an order\'s amount. A left join keeps orders that have no line items, with a NULL total_items. Joining first and then aggregating would repeat order_amount once per line item.',
    hints: [
      'What is the grain of the table you join in? It should match the grain of orders_df.',
      'Which join type keeps an order that has no matching row?',
    ],
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
    requires: ['replaceWhere', 'overwrite', 'sales_date', '2024-03-15'],
    question: `The gold Delta table sales_summary has a bug in the rows for sales_date = '2024-03-15' only. The DataFrame corrected_df holds the corrected rows for that one date.

Write PySpark code that replaces only the rows for sales_date = '2024-03-15' in sales_summary with the rows of corrected_df, using Delta's replaceWhere. Every other date in the table must stay as it is.`,
    starterCode: `# Replace only the sales_date = '2024-03-15' rows of sales_summary
`,
    solution: `corrected_df.write \\
    .format("delta") \\
    .mode("overwrite") \\
    .option("replaceWhere", "sales_date = '2024-03-15'") \\
    .saveAsTable("sales_summary")
# OR
corrected_df.write.format("delta").mode("overwrite").option("replaceWhere", "sales_date = '2024-03-15'").saveAsTable("sales_summary")
# OR
(corrected_df.write
    .mode("overwrite")
    .option("replaceWhere", "sales_date = DATE'2024-03-15'")
    .saveAsTable("sales_summary"))`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'corrected_df.write.format("delta").mode("overwrite").option("replaceWhere", "sales_date = \'2024-03-15\'").saveAsTable("sales_summary")',
        description:
          'Overwrites in Delta with replaceWhere set to the sales_date predicate, so only that date is replaced. A plain overwrite with no replaceWhere fails.',
      },
    ],
    explanation:
      'With mode("overwrite") alone, Delta replaces the whole table with the DataFrame. The replaceWhere option limits the overwrite to rows matching its predicate, so only the 2024-03-15 rows are replaced, in one atomic commit. Rows in corrected_df that do not match the predicate make the write fail.',
    hints: [
      'A DataFrameWriter option set with .option(key, value) can narrow an overwrite.',
      'The predicate is a SQL condition written as a string.',
    ],
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
      'The DataFrame fixed_df holds the corrected rows of a gold table that readers query through the view gold_orders. Order the lines that write the corrected rows to a new table gold_orders_v2, check the new table, and only then repoint the view. Two lines do not belong.',
    correctOrder: [
      'fixed_df.write.format("delta").mode("overwrite").saveAsTable("gold_orders_v2")',
      'ok = spark.table("gold_orders_v2").count() == fixed_df.count()',
      'if ok:',
      '    spark.sql("ALTER VIEW gold_orders AS SELECT * FROM gold_orders_v2")',
    ],
    distractorLines: [
      'spark.sql("DROP VIEW gold_orders")',
      'fixed_df.write.format("delta").mode("overwrite").saveAsTable("gold_orders")',
    ],
    solution: `fixed_df.write.format("delta").mode("overwrite").saveAsTable("gold_orders_v2")\nok = spark.table("gold_orders_v2").count() == fixed_df.count()\nif ok:\n    spark.sql("ALTER VIEW gold_orders AS SELECT * FROM gold_orders_v2")`,
    explanation:
      'The new table is written beside the live one, checked, and only then does the view switch to it in a single statement, so readers never see a half-built table. Dropping the view first would leave readers with nothing, and writing over gold_orders itself skips the check and the old table as a way back. The old table stays in place until the new one is trusted.',
    tags: ['gold-reprocessing'],
    concepts: ['gld-reprocessing'],
  },
];
