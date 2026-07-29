/**
 * Topic.PYSPARK_TRANSFORMATIONS — Databricks course, "ELT with Spark SQL & Python".
 *
 * Fills the gaps the legacy transformation questions left open:
 *  - narrow vs wide (the shuffle model behind groupBy/orderBy/repartition)
 *  - union / unionByName (positional vs name matching, missing columns)
 *  - distinct vs dropDuplicates(subset)
 *  - higher-order array functions (transform / filter) - map-over-elements
 *    without an explode + collect_list round trip
 *  - a beginner rung and non-coding types, which the legacy set had none of
 *
 * Every coding question carries `requires`: a hard gate listing tokens that
 * appear in EVERY accepted solution branch, so a valid-but-off-target idiom
 * fails with a targeted message instead of a misleading similarity score.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

export const pysparkTransformationsQuestions: Question[] = [
  // ===== NARROW VS WIDE =====
  {
    id: 'ps-trans-narrow-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'What makes a Spark transformation "wide" rather than "narrow"?',
    options: [
      { id: 'a', text: 'Each output partition needs rows from several input partitions, so Spark must shuffle data across the network between executors.', isCorrect: true },
      { id: 'b', text: 'It returns more columns than it received, so Spark must widen the schema and rewrite every row of the DataFrame.', isCorrect: false },
      { id: 'c', text: 'It runs on every executor at once, whereas a narrow transformation is restricted to executing on the driver node alone.', isCorrect: false },
      { id: 'd', text: 'It reads its input from disk, whereas a narrow transformation only reads data that is already cached in executor memory.', isCorrect: false },
    ],
    explanation: 'Narrow: each output partition is computed from exactly one input partition (select, filter, withColumn, drop) - no data moves, and Spark can pipeline the whole chain inside one stage. Wide: producing an output partition needs rows that live in many input partitions (groupBy, orderBy, distinct, join, repartition), so Spark writes shuffle files and starts a new stage. Stage boundaries in the Spark UI are exactly the wide transformations.',
    hints: ['Think about whether rows have to move between partitions', 'Shuffle = new stage'],
    tags: ['transformations', 'narrow', 'wide', 'shuffle'],
    concepts: ['ps-narrow-vs-wide', 'ps-shuffle'],
  },
  {
    id: 'ps-trans-narrow-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'Which list contains only narrow transformations?',
    options: [
      { id: 'a', text: 'select(), filter(), withColumn(), repartition() - repartition just relabels partitions without moving any rows.', isCorrect: false },
      { id: 'b', text: 'filter(), drop(), coalesce(), orderBy() - sorting happens inside each partition, so no exchange is needed.', isCorrect: false },
      { id: 'c', text: 'select(), filter(), withColumn(), drop() - every output partition is built from exactly one input partition.', isCorrect: true },
      { id: 'd', text: 'select(), distinct(), withColumn(), dropDuplicates() - deduplication only compares rows already in the partition.', isCorrect: false },
    ],
    explanation: 'Only option c is shuffle-free. repartition() always shuffles (that is the point - it redistributes rows to hit an exact partition count). orderBy() needs a global ordering, so it samples and range-partitions the data first. distinct() and dropDuplicates() must compare rows that can start out on different partitions, so both shuffle. coalesce() is the odd one out in b: it IS narrow, because it only merges existing partitions without moving rows between machines - but the orderBy() beside it is not.',
    hints: ['Which of these could change which machine a row lives on?', 'coalesce is narrow, repartition is wide'],
    tags: ['transformations', 'narrow', 'wide', 'shuffle'],
    concepts: ['ps-narrow-vs-wide', 'ps-shuffle', 'ps-partitioning'],
  },
  {
    id: 'ps-trans-partitions-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'What does this print?',
    code: `base = spark.range(20).repartition(8)
print(base.rdd.getNumPartitions())

merged = base.coalesce(2)
print(merged.rdd.getNumPartitions())

grown = merged.coalesce(6)
print(grown.rdd.getNumPartitions())`,
    expectedOutput: `8
2
2`,
    explanation: 'repartition(8) does a full shuffle and lands on exactly 8 partitions. coalesce(2) merges those 8 down to 2 without moving rows between machines - it is narrow, which is why it is cheap. The catch is on the last line: coalesce can only ever REDUCE the partition count. Asking it for 6 when you have 2 is a no-op, so it stays at 2. Growing the count requires repartition(6) and its shuffle.',
    hints: ['coalesce only merges downward', 'Which of these three calls actually shuffles?'],
    tags: ['transformations', 'partitioning', 'coalesce', 'repartition', 'predict'],
    concepts: ['ps-partitioning', 'ps-narrow-vs-wide', 'ps-shuffle'],
  },
  {
    id: 'ps-trans-sortwithin-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement that sorts DataFrame "df" (columns: emp_id, department, salary) by "salary" descending WITHIN each existing partition, without triggering the full shuffle that a global sort would cost. Assign the result to "result".',
    starterCode: `# df columns: emp_id, department, salary
# Sort by salary descending inside each partition only
result = `,
    testCases: [
      {
        input: 'df with columns: emp_id, department, salary',
        expectedOutput: 'df.sortWithinPartitions(desc("salary"))',
        description: 'Should sort per-partition without a global shuffle',
      },
    ],
    solution: `from pyspark.sql.functions import desc

result = df.sortWithinPartitions(desc("salary"))
# OR
result = df.sortWithinPartitions("salary", ascending=False)`,
    explanation: 'orderBy() guarantees a global ordering, which forces a range-partitioning shuffle across the whole cluster. sortWithinPartitions() sorts each partition independently and moves no rows, so it stays a narrow transformation. It is the right tool when a downstream step only needs locally ordered data - writing sorted files per partition, or feeding an operation that processes one partition at a time.',
    tieredHints: {
      apiSignature: 'DataFrame.sortWithinPartitions(*cols, ascending: bool | list = True) -> DataFrame',
      skeleton: `result = ____.____(____("salary"))`,
    },
    hints: ['Not orderBy - that sorts globally and shuffles', 'There is a dedicated per-partition sort method'],
    requires: ['sortWithinPartitions'],
    tags: ['transformations', 'sort', 'narrow', 'shuffle'],
    concepts: ['ps-narrow-vs-wide', 'ps-orderby-sort', 'ps-shuffle'],
  },

  // ===== UNION / UNIONBYNAME =====
  {
    id: 'ps-trans-union-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'DataFrame "a" has columns (customer_id, region) and DataFrame "b" has columns (region, customer_id). What does a.union(b) return?',
    options: [
      { id: 'a', text: 'An AnalysisException at analysis time, because the two DataFrames declare their shared columns in a different order.', isCorrect: false },
      { id: 'b', text: 'Rows stacked by column POSITION, so b\'s region values land under customer_id and vice versa - silent data corruption.', isCorrect: true },
      { id: 'c', text: 'Rows stacked by column NAME, giving exactly the same result that calling a.unionByName(b) would have produced.', isCorrect: false },
      { id: 'd', text: 'Only the rows whose customer_id and region values appear in both DataFrames, behaving the way an intersection does.', isCorrect: false },
    ],
    explanation: 'union() is positional, matching SQL UNION ALL: it lines up column 1 with column 1, column 2 with column 2, and never looks at the names. Since both columns here are strings, nothing fails - you just get region values sitting in the customer_id column. unionByName() matches on names instead and is what you almost always want when the two schemas were built by different code paths.',
    hints: ['Does union() look at column names at all?', 'Compare with SQL UNION ALL'],
    tags: ['transformations', 'union', 'unionByName'],
    concepts: ['ps-union'],
  },
  {
    id: 'ps-trans-union-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "current_df" (columns: customer_id, region, amount) and DataFrame "archive_df" (columns: amount, customer_id, region) carry the same three fields in a different column order. Write a PySpark statement that stacks archive_df underneath current_df, matching columns by name, and assign it to "result".',
    starterCode: `# current_df columns: customer_id, region, amount
# archive_df columns: amount, customer_id, region
# Stack archive rows under current rows, matching on column names
result = `,
    testCases: [
      {
        input: 'current_df (customer_id, region, amount) and archive_df (amount, customer_id, region)',
        expectedOutput: 'current_df.unionByName(archive_df)',
        description: 'Should stack both frames matching columns by name',
      },
    ],
    solution: `result = current_df.unionByName(archive_df)`,
    explanation: 'unionByName() resolves columns by name, so the differing declaration order is irrelevant. Reaching for union() here would line up amount against customer_id and quietly produce garbage - and because all three columns would still type-check in many schemas, nothing raises.',
    tieredHints: {
      apiSignature: 'DataFrame.unionByName(other: DataFrame, allowMissingColumns: bool = False) -> DataFrame',
      skeleton: `result = ____.____(____)`,
    },
    hints: ['union() is positional - you need the name-matching variant', 'The column order difference must not matter'],
    requires: ['unionByName'],
    tags: ['transformations', 'union', 'unionByName'],
    concepts: ['ps-union'],
  },
  {
    id: 'ps-trans-union-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the keyword argument that lets the union succeed when one side is missing a column, filling it with null instead of raising.',
    template: `# current_df columns: customer_id, region, amount
# archive_df columns: customer_id, region          (no amount column)
result = current_df.unionByName(archive_df, ___=True)`,
    blanks: ['allowMissingColumns'],
    solution: `result = current_df.unionByName(archive_df, allowMissingColumns=True)`,
    explanation: 'Without allowMissingColumns=True, unionByName raises an AnalysisException the moment the two schemas differ. With it, the absent column is filled with null on the side that lacks it - the standard way to union an older archive snapshot against a schema that has since gained columns.',
    hints: ['It names what is permitted, not what is filled in'],
    tags: ['transformations', 'union', 'unionByName', 'cloze'],
    concepts: ['ps-union'],
  },

  // ===== DISTINCT VS DROPDUPLICATES =====
  {
    id: 'ps-trans-dedup-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'DataFrame "df" (columns: customer_id, region, amount) holds two rows with customer_id 7 that differ only in amount. How do df.distinct() and df.dropDuplicates(["customer_id"]) differ on it?',
    options: [
      { id: 'a', text: 'distinct() compares only the leading column so one row survives; dropDuplicates(["customer_id"]) compares whole rows so both survive.', isCorrect: false },
      { id: 'b', text: 'They return the same two rows here, because dropDuplicates always falls back to comparing every column when rows conflict.', isCorrect: false },
      { id: 'c', text: 'distinct() keeps both rows and returns them ordered by customer_id; dropDuplicates(["customer_id"]) keeps both rows in arbitrary order.', isCorrect: false },
      { id: 'd', text: 'distinct() compares whole rows so both customer_id 7 rows survive; dropDuplicates(["customer_id"]) keeps just one, chosen arbitrarily.', isCorrect: true },
    ],
    explanation: 'distinct() is dropDuplicates() with no subset: it dedupes on the full row, so two rows differing in any column are both kept. Passing a subset changes the key - dropDuplicates(["customer_id"]) collapses to one row per customer and Spark does NOT define which one you get. If a specific row matters (say the newest), a row_number() window filtered to rank 1 is the deterministic tool; dropDuplicates is not.',
    hints: ['What key is each one comparing on?', 'Which row does the subset form keep?'],
    tags: ['transformations', 'distinct', 'dropDuplicates', 'dedup'],
    concepts: ['ps-distinct-drop-dup'],
  },
  {
    id: 'ps-trans-dedup-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'What does this print?',
    code: `# df rows, as (customer_id, region, amount):
#   (7, "north", 100)
#   (7, "north", 250)
#   (8, "south",  50)
#   (8, "south",  50)

print(df.count())
print(df.distinct().count())
print(df.dropDuplicates(["customer_id"]).count())`,
    expectedOutput: `4
3
2`,
    explanation: 'All 4 rows are there to start. distinct() removes only the exact duplicate pair (8, "south", 50), leaving 3 - the two customer_id 7 rows differ in amount, so both stay. dropDuplicates(["customer_id"]) keys on customer_id alone, collapsing to one row per customer: 2.',
    hints: ['Which two rows are identical across every column?', 'The subset form ignores the other columns entirely'],
    tags: ['transformations', 'distinct', 'dropDuplicates', 'dedup', 'predict'],
    concepts: ['ps-distinct-drop-dup'],
  },
  {
    id: 'ps-trans-dedup-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "events_df" (columns: event_id, customer_id, event_ts, payload) repeats each customer across many rows. Write a PySpark statement that keeps one arbitrary row per "customer_id" and assign it to "result".',
    starterCode: `# events_df columns: event_id, customer_id, event_ts, payload
# Keep one row per customer_id
result = `,
    testCases: [
      {
        input: 'events_df with columns: event_id, customer_id, event_ts, payload',
        expectedOutput: 'events_df.dropDuplicates(["customer_id"])',
        description: 'Should dedupe on customer_id only, not the whole row',
      },
    ],
    solution: `result = events_df.dropDuplicates(["customer_id"])
# OR
result = events_df.drop_duplicates(["customer_id"])`,
    explanation: 'Passing a subset makes customer_id the dedup key, so the differing event_id, event_ts, and payload values are ignored. distinct() would not work here - every row differs in event_id, so nothing would be removed. drop_duplicates is a snake_case alias of the same method.',
    tieredHints: {
      apiSignature: 'DataFrame.dropDuplicates(subset: list[str] | None = None) -> DataFrame',
      skeleton: `result = ____.____([____])`,
    },
    hints: ['distinct() compares whole rows - that will not help here', 'The method takes a list of key columns'],
    requires: [/dropDuplicates|drop_duplicates/],
    tags: ['transformations', 'dropDuplicates', 'dedup'],
    concepts: ['ps-distinct-drop-dup'],
  },

  // ===== HIGHER-ORDER ARRAY FUNCTIONS =====
  {
    id: 'ps-trans-hof-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'Column "scores" is an array<int>. What does df.withColumn("bumped", transform("scores", lambda x: x + 5)) produce?',
    options: [
      { id: 'a', text: 'One row per array element with 5 added to each, so the DataFrame ends up with more rows than it started with.', isCorrect: false },
      { id: 'b', text: 'A new array column where every element of each row\'s array is 5 higher, with the row count and array lengths unchanged.', isCorrect: true },
      { id: 'c', text: 'An array column where only the first element of each row has been raised by 5, with later elements left untouched.', isCorrect: false },
      { id: 'd', text: 'An integer column holding the sum of each row\'s array elements plus 5, collapsing the array into one scalar value.', isCorrect: false },
    ],
    explanation: 'transform() is the array higher-order function: it maps a lambda over the elements INSIDE each row\'s array and hands back an array of the same length. It replaces the old explode -> compute -> groupBy + collect_list round trip, which shuffles twice and loses the original element order. Being a plain column expression, transform() stays narrow.',
    hints: ['Does the row count change?', 'Compare with the explode + collect_list alternative'],
    tags: ['transformations', 'higher-order-functions', 'arrays', 'transform'],
    concepts: ['ps-collection-fns', 'ps-narrow-vs-wide'],
  },
  {
    id: 'ps-trans-hof-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "df" (columns: student, scores) stores "scores" as an array<int>. Write a PySpark statement adding a column "curved" that holds every score raised by 5, without exploding the array. Assign the result to "result".',
    starterCode: `# df columns: student, scores (array<int>)
# Raise every element of the scores array by 5
result = `,
    testCases: [
      {
        input: 'df with columns: student, scores (array<int>)',
        expectedOutput: 'df.withColumn("curved", transform("scores", lambda x: x + 5))',
        description: 'Should map over array elements in place, keeping one row per student',
      },
    ],
    solution: `from pyspark.sql.functions import transform

result = df.withColumn("curved", transform("scores", lambda x: x + 5))
# OR
from pyspark.sql.functions import expr

result = df.withColumn("curved", expr("transform(scores, x -> x + 5)"))`,
    explanation: 'transform(array_column, lambda) applies the lambda to each element and returns a new array. The expr() form uses the SQL lambda arrow syntax and compiles to exactly the same plan. Both stay within the row, so no shuffle and no row-count change - unlike explode + collect_list, which needs a groupBy to put the array back together.',
    tieredHints: {
      apiSignature: 'transform(col: Column | str, f: Callable[[Column], Column]) -> Column',
      skeleton: `result = df.____("curved", ____("scores", lambda x: ____))`,
    },
    hints: ['There is a higher-order function that maps over array elements', 'The lambda receives one element at a time'],
    requires: ['transform'],
    tags: ['transformations', 'higher-order-functions', 'arrays', 'transform'],
    concepts: ['ps-collection-fns'],
  },
  {
    id: 'ps-trans-hof-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the pyspark.sql.functions higher-order array function that filters elements INSIDE each row\'s array column (keeping elements >= 50) without dropping rows from the DataFrame.',
    template: `# df columns: student, scores (array<int>)
# Keep only the passing scores (>= 50) inside each row's array
from pyspark.sql.functions import ___

result = df.withColumn("passing", ___("scores", lambda x: x >= 50))`,
    blanks: ['filter', 'filter'],
    solution: `from pyspark.sql.functions import filter

result = df.withColumn("passing", filter("scores", lambda x: x >= 50))`,
    explanation: 'The array higher-order filter() is a different thing from DataFrame.filter(): it drops ELEMENTS inside each row\'s array rather than dropping rows from the DataFrame, so the row count is untouched and a row whose scores all fail ends up with an empty array. Because pyspark.sql.functions.filter shadows the Python builtin, many codebases import it as F and write F.filter(...).',
    hints: ['Same name as the DataFrame method, but it operates on array elements'],
    tags: ['transformations', 'higher-order-functions', 'arrays', 'cloze'],
    concepts: ['ps-collection-fns'],
  },

  // ===== BEGINNER RUNG: COLUMN-LEVEL NARROW OPS =====
  {
    id: 'ps-trans-drop-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement that removes the columns "ssn" and "home_phone" from DataFrame "df" (columns: emp_id, emp_name, ssn, home_phone, department), assigning the result to "result".',
    starterCode: `# df columns: emp_id, emp_name, ssn, home_phone, department
# Remove the two sensitive columns
result = `,
    testCases: [
      {
        input: 'df with columns: emp_id, emp_name, ssn, home_phone, department',
        expectedOutput: 'df.drop("ssn", "home_phone")',
        description: 'Should drop both columns by name',
      },
    ],
    solution: `result = df.drop("ssn", "home_phone")
# OR
result = df.drop("ssn").drop("home_phone")`,
    explanation: 'drop() takes any number of column names and returns a new DataFrame without them. Unlike select(), it is subtractive - you name what goes rather than restating everything that stays, which keeps the code correct when new columns are added upstream. Dropping an absent column is a silent no-op, not an error.',
    tieredHints: {
      apiSignature: 'DataFrame.drop(*cols: str | Column) -> DataFrame',
      skeleton: `result = df.____("____", "____")`,
    },
    hints: ['Name what you remove, not what you keep', 'It accepts several column names in one call'],
    requires: ['drop'],
    tags: ['transformations', 'drop', 'columns', 'narrow'],
    concepts: ['ps-select-filter', 'ps-narrow-vs-wide'],
  },
  {
    id: 'ps-trans-rename-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the method that renames a single existing column.',
    template: `# df columns: emp_id, emp_name, dept, salary
result = df.___("dept", "department")`,
    blanks: ['withColumnRenamed'],
    solution: `result = df.withColumnRenamed("dept", "department")`,
    explanation: 'withColumnRenamed(existing, new) renames one column and leaves everything else alone. The argument order is old name first, new name second - the reverse of withColumn(), which takes the new name first. Renaming a column that does not exist is a silent no-op, which is a common source of "my rename did nothing" confusion.',
    hints: ['Same family as withColumn', 'Old name first, then new name'],
    tags: ['transformations', 'withColumnRenamed', 'columns', 'cloze'],
    concepts: ['ps-with-column'],
  },
  {
    id: 'ps-trans-chain-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Arrange the code blocks to build an efficient PySpark pipeline over `events_df` (columns: `event_id`, `customer_id`, `event_ts`, `payload`).\n\nThe pipeline should:\n1. Import the `col` function from `pyspark.sql.functions`.\n2. Filter `events_df` for events occurring on or after `"2026-01-01"`, assigning the result to variable `recent`.\n3. Deduplicate `recent` to keep only one row per `customer_id`, assigning the result to variable `one_per_customer`.\n4. Globally sort `one_per_customer` by `event_ts` descending, assigning the final result to variable `result`.',
    correctOrder: [
      'from pyspark.sql.functions import col',
      'recent = events_df.filter(col("event_ts") >= "2026-01-01")',
      'one_per_customer = recent.dropDuplicates(["customer_id"])',
      'result = one_per_customer.orderBy(col("event_ts").desc())',
    ],
    distractorLines: [
      'one_per_customer = recent.distinct()',
      'result = one_per_customer.sortWithinPartitions(col("event_ts").desc())',
    ],
    solution: `from pyspark.sql.functions import col

recent = events_df.filter(col("event_ts") >= "2026-01-01")
one_per_customer = recent.dropDuplicates(["customer_id"])
result = one_per_customer.orderBy(col("event_ts").desc())`,
    explanation: 'Filtering first is the cheap move: it shrinks the data before the two wide steps that follow. distinct() is the wrong decoy because every row carries a unique event_id, so it would remove nothing. sortWithinPartitions() is the other decoy - it sorts inside each partition only, which does not give the global ordering the task asks for.',
    hints: ['Cut the data down before the expensive steps', 'One decoy dedupes on the wrong key, the other sorts on the wrong scope'],
    tags: ['transformations', 'chain', 'parsons', 'dedup'],
    concepts: ['ps-distinct-drop-dup', 'ps-orderby-sort', 'ps-select-filter'],
  },
];
