/**
 * Pivot / unpivot ramp — Databricks course, "ELT with Spark SQL & Python".
 *
 * The legacy pivot set (pivot-1..pivot-6 in masteryQuestions.ts) is six ADVANCED
 * coding questions and nothing else: no beginner rung, no recall-cheap types, and
 * both reverse-pivot questions written in Spark SQL only. This file adds:
 *  - a beginner introduction to each direction (long -> wide, wide -> long)
 *  - the gotchas that suit MCQ/predict: null cells, the hidden distinct scan when
 *    pivot values are not listed, stack()'s type rule, PIVOT's implicit grouping
 *  - the missing PySpark side of unpivot: DataFrame.unpivot/melt (Spark 3.4+)
 *    and the selectExpr("stack(...)") bridge for older runtimes
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

export const pysparkPivotQuestions: Question[] = [
  // ===== BEGINNER: THE TWO DIRECTIONS =====
  {
    id: 'ps-pivot-intro-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'What does df.groupBy("region").pivot("product").sum("amount") do to the shape of the data?',
    options: [
      { id: 'a', text: 'It sorts the rows by the pivot column and returns them grouped, leaving the schema of the DataFrame unchanged.', isCorrect: false },
      { id: 'b', text: 'It turns each distinct value of "product" into its own column, holding the summed amount for that region and product.', isCorrect: true },
      { id: 'c', text: 'It removes rows that repeat a product within a region, keeping one row per distinct region and product pair.', isCorrect: false },
      { id: 'd', text: 'It joins the DataFrame to itself on the product column, widening every row with its own matching rows.', isCorrect: false },
    ],
    explanation: 'A pivot goes long -> wide: values that were rows become columns. You get one row per groupBy key (region) and one column per distinct pivot value (product), with the aggregate filling each cell. The aggregate is not optional - pivot() returns a GroupedData, and something has to decide what a cell holds when several rows land in it.',
    hints: ['Long to wide: row values become column headers', 'What is the row count afterwards?'],
    tags: ['pivot', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot', 'ps-groupby-agg'],
  },
  {
    id: 'ps-pivot-intro-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    question: 'A row of wide_df is ("ana", 90, 80, 70) for columns (student, math, science, english). What does stack(3, "math", math, "science", science, "english", english) AS (subject, score) do to that row?',
    options: [
      { id: 'a', text: 'It sums the three subject columns into one total, replacing the three columns with a single score column.', isCorrect: false },
      { id: 'b', text: 'It keeps the row as one row but reorders the three subject columns so they come out alphabetically.', isCorrect: false },
      { id: 'c', text: 'It expands the row into 3 rows, each carrying one subject label and that subject\'s value in two new columns.', isCorrect: true },
      { id: 'd', text: 'It creates 3 extra columns on the same row, each labelled with a subject name and holding a copy of the score.', isCorrect: false },
    ],
    explanation: 'stack() goes wide -> long, the reverse of a pivot. The leading 3 says how many (label, value) pairs follow, and each pair becomes its own row: ("ana", "math", 90), ("ana", "science", 80), ("ana", "english", 70). Columns not fed to stack() - here student - are carried along and repeated on every generated row.',
    hints: ['Wide to long: columns become rows', 'What does the leading 3 count?'],
    tags: ['unpivot', 'stack', 'reshape'],
    concepts: ['ps-pivot-unpivot'],
  },
  {
    id: 'ps-pivot-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the method that turns each distinct "product" value into its own column.',
    template: `# sales_df columns: region, product, amount
# One row per region, one column per product, cells hold summed amount
result = sales_df.groupBy("region").___("product").sum("amount")`,
    blanks: ['pivot'],
    solution: `result = sales_df.groupBy("region").pivot("product").sum("amount")`,
    explanation: 'pivot() sits between the groupBy and the aggregate. It returns a GroupedData, not a DataFrame, which is why an aggregate call has to follow it - sum(), count(), or agg() decides what fills each cell.',
    hints: ['It goes after groupBy and before the aggregate'],
    tags: ['pivot', 'reshape', 'cloze'],
    concepts: ['ps-pivot-unpivot', 'ps-groupby-agg'],
  },
  {
    id: 'ps-pivot-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Fill in stack()\'s leading argument for unpivoting these three subject columns.',
    template: `# wide_df columns: student, math, science, english
long_df = wide_df.selectExpr(
    "student",
    "stack(___, 'math', math, 'science', science, 'english', english) as (subject, score)"
)`,
    blanks: ['3'],
    solution: `long_df = wide_df.selectExpr(
    "student",
    "stack(3, 'math', math, 'science', science, 'english', english) as (subject, score)"
)`,
    explanation: 'The first argument counts the (label, value) PAIRS that follow, not the total number of arguments. Three subjects means 3, followed by six arguments. Getting this wrong is the most common stack() error: pass 6 here and analysis fails, because the argument count no longer divides evenly into the declared number of rows.',
    hints: ['Count the subjects, not the arguments'],
    tags: ['unpivot', 'stack', 'reshape', 'cloze'],
    concepts: ['ps-pivot-unpivot'],
  },

  // ===== INTERMEDIATE: THE GOTCHAS =====
  {
    id: 'ps-pivot-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'What does this print?',
    code: `# sales_df rows, as (region, product, amount):
#   ("north", "Toys",  10)
#   ("north", "Books", 20)
#   ("south", "Books",  5)

result = sales_df.groupBy("region").pivot("product").sum("amount")
print(result.columns)`,
    expectedOutput: `['region', 'Books', 'Toys']`,
    explanation: 'The groupBy key stays as the first column, then one column per distinct pivot value. When you do not supply the values yourself, Spark scans the column for distinct values and returns them SORTED, so Books precedes Toys regardless of the order they appear in the data. That scan is a real job over the whole dataset - which is exactly what passing the values list explicitly avoids.',
    hints: ['The groupBy column survives', 'What order does Spark put discovered pivot values in?'],
    tags: ['pivot', 'reshape', 'wide-format', 'predict'],
    concepts: ['ps-pivot-unpivot', 'ps-groupby-agg'],
  },
  {
    id: 'ps-pivot-nulls-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'sales_df is pivoted with groupBy("region").pivot("product").sum("amount"). Region "south" has no rows at all for product "Toys". What lands in that cell?',
    options: [
      { id: 'a', text: 'null, because pivot only fills cells backed by matching rows and applies no implicit zero fill.', isCorrect: true },
      { id: 'b', text: '0, because the sum of an empty set of rows is defined as zero by the aggregate function.', isCorrect: false },
      { id: 'c', text: 'The south row is dropped, because pivot emits only groups holding every pivoted value.', isCorrect: false },
      { id: 'd', text: 'An AnalysisException, because pivot requires every group to contain every pivoted value.', isCorrect: false },
    ],
    explanation: 'Empty cells come back null, not 0. This bites downstream: sums over a pivoted column skip nulls silently, but arithmetic like Books + Toys returns null for any row with a gap. If a zero is what you mean, follow the pivot with fillna(0) - and do it deliberately, because null ("no rows") and 0 ("rows summing to zero") are genuinely different facts.',
    hints: ['Does an aggregate over zero rows produce a value at all?', 'Think about what a later Books + Toys would return'],
    tags: ['pivot', 'reshape', 'null-handling'],
    concepts: ['ps-pivot-unpivot', 'ps-null-handling'],
  },
  {
    id: 'ps-pivot-values-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'What does passing the values list explicitly - pivot("product", ["Books", "Toys"]) - buy you over pivot("product")?',
    options: [
      { id: 'a', text: 'It sorts the generated columns alphabetically, which pivot cannot do when it discovers the values itself.', isCorrect: false },
      { id: 'b', text: 'It lets the pivot run without a groupBy() in front of it, removing one shuffle stage from the query plan.', isCorrect: false },
      { id: 'c', text: 'It turns the pivot from a wide transformation into a narrow one, so the data never has to be shuffled.', isCorrect: false },
      { id: 'd', text: 'It skips the extra distinct-scan job Spark otherwise runs across the whole dataset just to learn the values.', isCorrect: true },
    ],
    explanation: 'Without a values list Spark must first run a separate job collecting the distinct pivot values before it can even plan the output schema - a full pass over the data. Supplying them removes that pass. It also makes the output schema deterministic and pins the column set, so a new product value appearing upstream cannot silently widen your table. The pivot itself still shuffles either way.',
    hints: ['Spark has to know the output columns before it can build the plan', 'How would it find them out on its own?'],
    tags: ['pivot', 'performance', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot', 'ps-shuffle'],
  },
  {
    id: 'ps-pivot-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'What does this print?',
    code: `# wide_df rows, as (student, math, science, english):
#   ("ana", 90, 80, 70)
#   ("bo",  60, 50, 40)

long_df = wide_df.selectExpr(
    "student",
    "stack(3, 'math', math, 'science', science, 'english', english) as (subject, score)"
)
print(long_df.count())
print(len(long_df.columns))`,
    expectedOutput: `6
3`,
    explanation: 'stack(3, ...) emits 3 rows for every input row, so 2 students become 6 rows. The output has 3 columns: the carried-along student, plus the two the AS clause names (subject, score). Row count multiplies while column count shrinks - the signature of a wide -> long reshape.',
    hints: ['Each input row becomes how many output rows?', 'Count the columns the AS clause names, plus the carried one'],
    tags: ['unpivot', 'stack', 'reshape', 'predict'],
    concepts: ['ps-pivot-unpivot'],
  },
  {
    id: 'ps-pivot-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Arrange the code blocks to build a pivot transformation over `sales_df` (columns: `region`, `product`, `amount`).\n\nThe pipeline should:\n1. Group `sales_df` by `region`, assigning to variable `by_region`.\n2. Pivot on column `product` specifying the explicit list `["Books", "Toys"]`, assigning to variable `pivoted`.\n3. Aggregate by summing column `amount`, assigning the final result to variable `result`.',
    correctOrder: [
      'by_region = sales_df.groupBy("region")',
      'pivoted = by_region.pivot("product", ["Books", "Toys"])',
      'result = pivoted.sum("amount")',
    ],
    distractorLines: [
      'by_region = sales_df.pivot("product").groupBy("region")',
      'pivoted = by_region.pivot("product")',
    ],
    solution: `by_region = sales_df.groupBy("region")
pivoted = by_region.pivot("product", ["Books", "Toys"])
result = pivoted.sum("amount")`,
    explanation: 'The order is forced by what each call returns: groupBy() gives GroupedData, pivot() gives back GroupedData again, and only an aggregate turns it into a DataFrame. The first decoy inverts that - pivot() is not a DataFrame method, so it cannot come before groupBy(). The second drops the explicit values list, which still works but costs Spark a full distinct scan to discover Books and Toys for itself.',
    hints: ['Follow what each call returns: DataFrame, then GroupedData, then DataFrame', 'One decoy calls pivot too early, the other forgets the values list'],
    tags: ['pivot', 'reshape', 'parsons'],
    concepts: ['ps-pivot-unpivot', 'ps-groupby-agg'],
  },

  // ===== THE MISSING PYSPARK SIDE OF UNPIVOT =====
  {
    id: 'ps-pivot-unpivot-py-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "wide_df" (columns: student, math, science, english) holds one column per subject. Using the DataFrame API rather than a SQL expression, write a PySpark statement that unpivots the three subject columns into rows with columns "student", "subject", and "score". Assign the result to "result".',
    starterCode: `# wide_df columns: student, math, science, english
# Reshape the three subject columns into (subject, score) rows
result = `,
    testCases: [
      {
        input: 'wide_df with columns: student, math, science, english',
        expectedOutput: 'wide_df.unpivot(["student"], ["math", "science", "english"], "subject", "score")',
        description: 'Should produce one row per student per subject',
      },
    ],
    solution: `result = wide_df.unpivot(["student"], ["math", "science", "english"], "subject", "score")
# OR
result = wide_df.melt(["student"], ["math", "science", "english"], "subject", "score")`,
    explanation: 'DataFrame.unpivot(ids, values, variableColumnName, valueColumnName) arrived in Spark 3.4 and is the native reverse of pivot(): ids are the columns carried through unchanged, values are the columns collapsed into rows, and the last two arguments name the label and value columns. melt() is the same method under its pandas-familiar name.',
    tieredHints: {
      apiSignature: 'DataFrame.unpivot(ids, values, variableColumnName, valueColumnName) -> DataFrame',
      skeleton: `result = ____.____(["student"], [____], "subject", "score")`,
    },
    hints: ['Spark 3.4 added a native DataFrame method for this', 'First the columns to keep, then the columns to collapse'],
    requires: [/unpivot|melt/],
    tags: ['unpivot', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot'],
  },
  {
    id: 'ps-pivot-unpivot-py-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'On a runtime older than Spark 3.4 there is no DataFrame.unpivot(). Using selectExpr and the stack() SQL function, reshape "wide_df" (columns: student, math, science, english) into rows with columns "student", "subject", and "score". Assign the result to "result".',
    starterCode: `# wide_df columns: student, math, science, english
# Unpivot via selectExpr + stack(), carrying student through
result = `,
    testCases: [
      {
        input: 'wide_df with columns: student, math, science, english',
        expectedOutput: 'wide_df.selectExpr("student", "stack(3, \'math\', math, ...) as (subject, score)")',
        description: 'Should produce one row per student per subject using stack()',
      },
    ],
    solution: `result = wide_df.selectExpr(
    "student",
    "stack(3, 'math', math, 'science', science, 'english', english) as (subject, score)"
)`,
    explanation: 'selectExpr() takes SQL expression strings, which is what makes stack() reachable from the DataFrame API - stack() is a SQL generator function with no Python counterpart in pyspark.sql.functions. Columns to carry through are listed as plain expressions alongside it, and the AS clause names the two generated columns. This is the portable form: it runs on every Spark 3.x runtime, unlike DataFrame.unpivot().',
    tieredHints: {
      apiSignature: 'DataFrame.selectExpr(*expr: str) -> DataFrame   //   stack(n, label1, col1, ...) AS (labelCol, valueCol)',
      skeleton: `result = ____.____(
    "student",
    "____(3, 'math', ____, 'science', ____, 'english', ____) as (____, ____)"
)`,
    },
    hints: ['stack() has no Python function - it must arrive as a SQL string', 'The carried column is just another expression in the same call'],
    requires: ['stack', 'selectExpr'],
    tags: ['unpivot', 'stack', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot'],
  },

  // ===== ADVANCED: THE RULES THAT BITE =====
  {
    id: 'ps-pivot-stack-types-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    question: 'wide_df has "math" typed int and "remark" typed string. What happens with stack(2, "math", math, "remark", remark) AS (field, value)?',
    options: [
      { id: 'a', text: 'It succeeds and types value as int, casting each remark string to null as it goes.', isCorrect: false },
      { id: 'b', text: 'It fails analysis - columns stacked into one output column must share a data type, and int and string do not.', isCorrect: true },
      { id: 'c', text: 'It succeeds and emits two value columns per row, one typed int and the other typed string.', isCorrect: false },
      { id: 'd', text: 'It succeeds and types value as binary, storing the raw bytes of both the int and the string together.', isCorrect: false },
    ],
    explanation: 'Every value that lands in the same generated column has to agree on type, because that column gets one type in the output schema. Spark checks this at analysis time and rejects the query rather than silently coercing. The fix is to cast at the call site - CAST(math AS STRING) - which is a deliberate decision to give up the numeric type, not something you want happening behind your back.',
    hints: ['How many types can one output column have?', 'When would Spark notice - at analysis or at runtime?'],
    tags: ['unpivot', 'stack', 'reshape', 'types'],
    concepts: ['ps-pivot-unpivot', 'ps-cast-types'],
  },
  {
    id: 'ps-pivot-grain-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    question: 'A SQL PIVOT runs over a subquery selecting (respondent_id, region, question_text, response), with MAX(response) FOR question_text IN (...). What is the grain of the result?',
    options: [
      { id: 'a', text: 'One row per question_text value, because the FOR column always sets the grain of a pivot result.', isCorrect: false },
      { id: 'b', text: 'One row overall, because PIVOT collapses all input rows into a single summary row by default.', isCorrect: false },
      { id: 'c', text: 'One row per (respondent_id, region) pair - PIVOT implicitly groups by every column the aggregate and FOR clause leave unnamed.', isCorrect: true },
      { id: 'd', text: 'One row per respondent_id, because PIVOT groups only by the first column the subquery lists.', isCorrect: false },
    ],
    explanation: 'There is no GROUP BY to read, which is what makes this dangerous: PIVOT groups by every remaining column implicitly. Adding one more column to the subquery silently changes the grain and can split what should have been a single row per respondent into several. That is why the standard advice is to restrict the subquery to exactly three things - the grouping columns, the pivot column, and the value column.',
    hints: ['Which columns does the PIVOT clause never mention?', 'What would adding one more column to the subquery do?'],
    tags: ['pivot', 'sql', 'reshape', 'grain'],
    concepts: ['ps-pivot-unpivot', 'ps-groupby-agg'],
  },
];
