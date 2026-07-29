/**
 * Function-library gap fill - Databricks course, "ELT with Spark SQL & Python".
 *
 * Three topics in this section shipped covering less than their labels promise:
 *  - "Math & Aggregate Functions (sum, avg, round)" had six scalar math questions
 *    and no aggregate functions at all
 *  - "Null Handling (coalesce, isNull, fillna)" had no fillna question
 *  - "Collection Functions (arrays, maps, explode)" covered arrays and structs
 *    but touched MapType only as a clause inside one size() question
 *
 * The existing questions were also all the same shape: withColumn("x", fn(col))
 * repeated per function name, which drills the wrapper rather than the function.
 * These lean on MCQ for the recall and contrast layer and keep coding for the
 * two places where the call itself carries real decisions (multi-aggregate agg(),
 * fillna's per-column dict).
 *
 * Coding questions carry `requires` listing tokens present in EVERY accepted
 * solution branch - see the "Required keywords" section of /write-questions.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

export const pysparkFunctionLibraryQuestions: Question[] = [
  // ===== MAPS (Collection Functions) =====

  {
    id: 'ps-maplib-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'DataFrame "df" has StringType columns "attribute" and "reading". Which function builds a single MapType column pairing them as key and value?',
    options: [
      { id: 'a', text: 'struct("attribute", "reading") — produces a named record with two fields, not a key-value map', isCorrect: false },
      { id: 'b', text: 'array("attribute", "reading") — produces a two-element list that loses the key-value pairing', isCorrect: false },
      { id: 'c', text: 'create_map("attribute", "reading") — reads its arguments as alternating key and value expressions', isCorrect: true },
      { id: 'd', text: 'map("attribute", "reading") — this is the Spark SQL spelling and is not exported to Python', isCorrect: false },
    ],
    explanation: 'create_map() takes an alternating sequence of key and value columns, so create_map(k1, v1, k2, v2) builds a two-entry map. struct() gives fixed named fields you address by name, and array() gives positional elements. MAP is the SQL keyword and works inside expr() or spark.sql() but is not a Python function.',
    tags: ['collection', 'map', 'create_map', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  {
    id: 'ps-maplib-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Column "props" is a MapType. You need one column holding just its keys and another holding just its values, with both staying arrays. Which pair does that?',
    options: [
      { id: 'a', text: 'map_keys(props) and map_values(props) — each returns an ArrayType column of the requested side', isCorrect: true },
      { id: 'b', text: 'explode(props) and explode_outer(props) — each adds rows rather than returning array columns', isCorrect: false },
      { id: 'c', text: 'props.keys() and props.values() — Python dict methods are not defined on a Spark Column', isCorrect: false },
      { id: 'd', text: 'map_entries(props) and map_from_entries(props) — these convert between maps and structs, not sides', isCorrect: false },
    ],
    explanation: 'map_keys() and map_values() each collapse a map to one side as an array, preserving the row count. explode() is the alternative when you want one row per entry instead. map_entries() turns a map into an array of key-value structs, and map_from_entries() reverses that.',
    tags: ['collection', 'map', 'map_keys', 'map_values', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  {
    id: 'ps-maplib-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'You call df.select("id", explode("props")) where "props" is a MapType column. How does the output differ from exploding an array column?',
    options: [
      { id: 'a', text: 'It fails, because explode() accepts ArrayType input only and maps need map_entries() first', isCorrect: false },
      { id: 'b', text: 'It emits one row per entry with two new columns, key and value, instead of a single column', isCorrect: true },
      { id: 'c', text: 'It emits one row per entry with a single struct column that you address as col.key', isCorrect: false },
      { id: 'd', text: 'It emits one row per map, with the whole map rendered into one string-typed column', isCorrect: false },
    ],
    explanation: 'explode() on a MapType generates two columns named key and value, so a select that assumed one output column will not line up. Use .alias() on the exploded map to rename them, or explode a map_entries() array if you would rather work with a struct.',
    tags: ['collection', 'map', 'explode', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  {
    id: 'ps-maplib-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Column "props" is a MapType. Some rows have no "colour" key at all. What does df.select(df.props["colour"]) return for those rows?',
    options: [
      { id: 'a', text: 'An empty string, because Spark substitutes the zero value of the map value type', isCorrect: false },
      { id: 'b', text: 'A KeyError at runtime, matching how a Python dict behaves on a missing key', isCorrect: false },
      { id: 'c', text: 'An AnalysisException, because Spark checks map keys against the schema while planning', isCorrect: false },
      { id: 'd', text: 'null, because a missing key resolves to null rather than raising or substituting', isCorrect: true },
    ],
    explanation: 'Map lookup is null-safe in Spark: a missing key gives null, so a typo in the key name produces an all-null column rather than an error. element_at(props, "colour") does the same. Wrap the lookup in coalesce() when you need a default, and remember that a null result cannot be distinguished from a key that genuinely stored null.',
    tags: ['collection', 'map', 'element_at', 'null-handling', 'functions'],
    concepts: ['ps-collection-fns', 'ps-null-handling'],
  },

  // ===== AGGREGATE FUNCTIONS (Math & Aggregate) =====

  {
    id: 'ps-agglib-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MATH_FUNCTIONS,
    question: 'What happens when you call df.withColumn("total", sum("amount")) on a DataFrame?',
    options: [
      { id: 'a', text: 'Every row gets the column total, because sum() broadcasts its result back across the rows', isCorrect: false },
      { id: 'b', text: 'It raises an AnalysisException, because an aggregate cannot be used outside a grouping context', isCorrect: true },
      { id: 'c', text: 'Every row gets its own amount, because sum() falls back to the identity on a single value', isCorrect: false },
      { id: 'd', text: 'It returns one row holding the total, because withColumn() collapses when given an aggregate', isCorrect: false },
    ],
    explanation: 'sum(), avg(), min(), max() and count() are aggregate functions: they need groupBy().agg(), a bare agg(), or an OVER window. withColumn() is a row-wise projection, so Spark rejects the plan. To put a table-wide total on every row, use an unbounded window: sum("amount").over(Window.partitionBy()).',
    tags: ['math', 'aggregate', 'sum', 'functions'],
    concepts: ['ps-math-fns', 'ps-groupby-agg'],
  },

  {
    id: 'ps-agglib-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MATH_FUNCTIONS,
    question: 'A DataFrame has 100 rows in column "score", 20 of which are null. What does agg(avg("score")) divide the sum by?',
    options: [
      { id: 'a', text: '80, because avg() ignores nulls in both the running sum and the divisor', isCorrect: true },
      { id: 'b', text: '100, because avg() counts every row and treats each null as a zero contribution', isCorrect: false },
      { id: 'c', text: '100, because avg() counts every row and returns null if any value is missing', isCorrect: false },
      { id: 'd', text: '80, because avg() drops null rows first but still divides by the original row count', isCorrect: false },
    ],
    explanation: 'Spark aggregates skip nulls entirely, so avg() is the mean of the present values, not of the rows. That differs from treating nulls as zero, which would drag the mean down. mean() is an exact alias for avg(). Use fillna(0) first if a null genuinely means zero.',
    tags: ['math', 'aggregate', 'avg', 'mean', 'null-handling', 'functions'],
    concepts: ['ps-math-fns', 'ps-null-handling'],
  },

  {
    id: 'ps-agglib-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    question: 'A table has 100 rows and column "email" is null on 12 of them. What do count("*") and count("email") return?',
    options: [
      { id: 'a', text: '100 and 100, because count() counts rows and the argument only names the source column', isCorrect: false },
      { id: 'b', text: '88 and 88, because any null in the row excludes it from both forms of the count', isCorrect: false },
      { id: 'c', text: '100 and 88, because count("*") counts rows while count(col) counts non-null values', isCorrect: true },
      { id: 'd', text: '100 and null, because counting a column that contains nulls propagates null to the result', isCorrect: false },
    ],
    explanation: 'count("*") counts rows regardless of content; count(col) counts rows where that column is not null. The gap between the two is a cheap null-completeness check. countDistinct(col) also ignores nulls, so it never counts null as its own value.',
    tags: ['math', 'aggregate', 'count', 'null-handling', 'functions'],
    concepts: ['ps-math-fns', 'ps-null-handling'],
  },

  {
    id: 'ps-agglib-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    question: 'On a very large table, what does approx_count_distinct("user_id") trade away compared with countDistinct("user_id")?',
    options: [
      { id: 'a', text: 'Nothing measurable; it is the same algorithm with a shorter name kept for SQL compatibility', isCorrect: false },
      { id: 'b', text: 'Determinism; it samples a random subset per run, so repeated runs disagree on the same data', isCorrect: false },
      { id: 'c', text: 'Exactness; it returns an estimate within a configurable error bound and avoids a full shuffle', isCorrect: true },
      { id: 'd', text: 'Null handling; it counts null as a distinct value while countDistinct() skips nulls entirely', isCorrect: false },
    ],
    explanation: 'approx_count_distinct() uses HyperLogLog: bounded memory, no wide shuffle of the distinct values, and a default relative error around 5% that you can tighten with the rsd argument. It is deterministic for a given input. Exact countDistinct() has to shuffle every distinct value, which is what gets expensive at scale.',
    tags: ['math', 'aggregate', 'countDistinct', 'approx_count_distinct', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'ps-agglib-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    question: 'DataFrame "df" has numeric columns "q1" and "q2". You want the larger of the two values on each row. Which function does that, and how does it differ from max()?',
    options: [
      { id: 'a', text: 'max("q1", "q2") — max() switches to row-wise comparison as soon as it is given two arguments', isCorrect: false },
      { id: 'b', text: 'greatest("q1", "q2") — compares across columns within one row; max() compares down a column', isCorrect: true },
      { id: 'c', text: 'array_max(array("q1", "q2")) — the only row-wise option, since greatest() is Spark SQL only', isCorrect: false },
      { id: 'd', text: 'greatest("q1", "q2") — compares down a column within a group; max() compares across columns', isCorrect: false },
    ],
    explanation: 'greatest() and least() are row-wise across columns and skip nulls unless every argument is null. max() and min() are aggregates running down a column within a group. array_max() over an array() does work row-wise, but it builds an intermediate array for no benefit here.',
    tags: ['math', 'aggregate', 'greatest', 'max', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'ps-agglib-6',
    requires: [/\.groupBy\s*\(/i, /\.agg\s*\(/i, /sum\s*\(/i, /avg\s*\(|mean\s*\(/i],
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "df" has columns "region", "amount" and "units". For each region, return one row carrying the total of amount as "total_amount" and the mean of units as "avg_units". Assign the result to "result".',
    starterCode: `# One row per region carrying both figures\nresult = `,
    testCases: [
      {
        input: 'df with region, amount, units columns',
        expectedOutput: 'one row per region with total_amount and avg_units',
        description: 'Should aggregate two measures in a single pass',
      },
    ],
    solution: `from pyspark.sql.functions import sum, avg

result = df.groupBy("region").agg(sum("amount").alias("total_amount"), avg("units").alias("avg_units"))
# OR
from pyspark.sql.functions import sum, avg, col

result = df.groupBy(col("region")).agg(sum(col("amount")).alias("total_amount"), avg(col("units")).alias("avg_units"))
# OR
from pyspark.sql.functions import sum, mean

result = df.groupBy("region").agg(sum("amount").alias("total_amount"), mean("units").alias("avg_units"))`,
    explanation: 'agg() accepts several aggregate expressions at once, so both measures are computed in one shuffle. Without .alias() the columns come back named "sum(amount)" and "avg(units)", which are awkward to reference downstream. mean() is an alias for avg().',
    tieredHints: {
      apiSignature: 'DataFrame.groupBy(*cols).agg(*exprs) -> DataFrame; Column.alias(name) -> Column',
      skeleton: `result = ____.____("region").____(
    ____("amount").____("total_amount"),
    ____("units").____("avg_units"),
)`,
    },
    hints: ['One groupBy, one agg, two expressions inside it', 'Name the output columns explicitly'],
    tags: ['math', 'aggregate', 'sum', 'avg', 'groupby', 'functions'],
    concepts: ['ps-math-fns', 'ps-groupby-agg'],
  },

  // ===== FILLNA AND NULL SEMANTICS (Null Handling) =====

  {
    id: 'ps-nulllib-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NULL_HANDLING,
    question: 'DataFrame "df" has nulls in the numeric column "qty" and in the string column "notes". What does df.fillna(0) change?',
    options: [
      { id: 'a', text: 'Both columns; nulls in "notes" become the string "0" through implicit type coercion', isCorrect: false },
      { id: 'b', text: 'Only "qty"; fillna() applies a value solely to columns whose type matches that value', isCorrect: true },
      { id: 'c', text: 'Neither column; fillna() needs an explicit subset argument before it replaces anything', isCorrect: false },
      { id: 'd', text: 'Both columns; nulls in "notes" become an empty string, the string equivalent of zero', isCorrect: false },
    ],
    explanation: 'fillna() silently skips columns whose type does not match the fill value, so fillna(0) leaves every string column untouched and reports no error. That silence is the trap: the pipeline looks clean and the string nulls survive. Pass a dict to cover several types at once, as in fillna({"qty": 0, "notes": "none"}).',
    tags: ['null-handling', 'fillna', 'na'],
    concepts: ['ps-null-handling'],
  },

  {
    id: 'ps-nulllib-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    question: 'Which call fills nulls in column "qty" with 0 and leaves nulls in every other numeric column of the DataFrame alone?',
    options: [
      { id: 'a', text: 'df.fillna(0) — the value applies to the first numeric column found and stops there', isCorrect: false },
      { id: 'b', text: 'df.fillna(0).select("qty") — filling everything then selecting restores the other columns', isCorrect: false },
      { id: 'c', text: 'df.fillna(0, "qty") — the second positional argument is read as the target column name', isCorrect: false },
      { id: 'd', text: 'df.fillna(0, subset=["qty"]) — subset restricts the fill to the listed columns only', isCorrect: true },
    ],
    explanation: 'subset= scopes the fill to named columns; the equivalent dict form is fillna({"qty": 0}). A bare fillna(0) hits every numeric column in the frame. Option c fails because the second positional parameter of fillna is subset but it expects a list, and selecting after filling does not undo the fill on columns you kept.',
    tags: ['null-handling', 'fillna', 'subset', 'na'],
    concepts: ['ps-null-handling'],
  },

  {
    id: 'ps-nulllib-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    question: 'PySpark exposes coalesce() in pyspark.sql.functions and coalesce() as a DataFrame method. What do they do?',
    options: [
      { id: 'a', text: 'The function returns the first non-null of several columns; the method reduces partition count', isCorrect: true },
      { id: 'b', text: 'The function returns the first non-null of several columns; the method fills nulls across the frame', isCorrect: false },
      { id: 'c', text: 'Both merge nulls, one at column scope and one at frame scope, so they are interchangeable', isCorrect: false },
      { id: 'd', text: 'The function reduces partition count on a column; the method merges small files on write', isCorrect: false },
    ],
    explanation: 'They share a name and nothing else. functions.coalesce(a, b, c) is a row-wise null fallback returning the first non-null argument. DataFrame.coalesce(n) narrows the frame to n partitions without a full shuffle. Writing df.coalesce(df.email, df.phone) reads plausibly and fails, because the method wants an integer.',
    tags: ['null-handling', 'coalesce', 'partitioning'],
    concepts: ['ps-null-handling', 'ps-partitioning'],
  },

  {
    id: 'ps-nulllib-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    question: 'You are joining on a key that is null on both sides for some rows, and you want those rows to match. Which comparison treats two nulls as equal?',
    options: [
      { id: 'a', text: 'df.a == df.b — standard equality already returns true when both operands are null', isCorrect: false },
      { id: 'b', text: 'df.a.equalTo(df.b) — the explicit method form applies null-aware comparison semantics', isCorrect: false },
      { id: 'c', text: 'df.a.eqNullSafe(df.b) — null-safe equality returns true when both sides are null', isCorrect: true },
      { id: 'd', text: 'df.a.isin(df.b) — membership testing sidesteps three-valued logic and matches nulls', isCorrect: false },
    ],
    explanation: 'eqNullSafe() is the Python name for the SQL <=> operator: null <=> null is true, and null <=> value is false rather than null. Plain == yields null for those rows, so the join drops them. equalTo() is just the method spelling of ==, with the same null behaviour.',
    tags: ['null-handling', 'eqNullSafe', 'three-valued-logic', 'join'],
    concepts: ['ps-null-handling', 'sql-joins-inner-outer'],
  },

  {
    id: 'ps-nulllib-5',
    requires: [/fillna\s*\(|na\s*\.\s*fill\s*\(/i],
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "df" has an integer column "qty" and a string column "notes", both containing nulls. In a single call, replace nulls in qty with 0 and nulls in notes with "unknown". Assign the result to "result".',
    starterCode: `# Replace the nulls in both columns at once\nresult = `,
    testCases: [
      {
        input: 'df with null values in qty and notes',
        expectedOutput: 'qty nulls become 0 and notes nulls become "unknown"',
        description: 'Should fill two columns of different types in one call',
      },
    ],
    solution: `result = df.fillna({"qty": 0, "notes": "unknown"})
# OR
result = df.na.fill({"qty": 0, "notes": "unknown"})`,
    explanation: 'The dict form maps each column to its own fill value, which is the only single-call way to cover columns of different types: a scalar fillna(0) would skip every string column silently. na.fill() is the same method under the DataFrameNaFunctions namespace.',
    tieredHints: {
      apiSignature: 'DataFrame.fillna(value: int | float | str | dict, subset: list[str] = None) -> DataFrame',
      skeleton: `result = ____.____({"____": 0, "notes": "____"})`,
    },
    hints: ['One argument covers both columns', 'A scalar fill value only reaches columns of the matching type'],
    tags: ['null-handling', 'fillna', 'na'],
    concepts: ['ps-null-handling'],
  },
];
