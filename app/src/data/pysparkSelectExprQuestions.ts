/**
 * selectExpr / SQL-expression strings — Databricks course, "ELT with Spark SQL & Python".
 *
 * Introduces the SQL-string bridge in the DataFrame Basics unit, where select()
 * and filter() already live. Before this file the course used selectExpr and
 * expr() inside solutions (the stack() unpivot, the withWatermark interval) while
 * never teaching either - so a learner met them cold at ADVANCED.
 *
 * Ramp: what the arguments are (beginner) -> writing one (beginner) -> the
 * projection rule and the "*" idiom that follows from it (intermediate).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

export const pysparkSelectExprQuestions: Question[] = [
  {
    id: 'ps-selectexpr-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'What does df.selectExpr("item", "price * qty AS total") take as its arguments?',
    options: [
      { id: 'a', text: 'Column objects built with col(), which selectExpr evaluates eagerly rather than adding to a lazy plan.', isCorrect: false },
      { id: 'b', text: 'One complete SQL SELECT statement as a single string, which selectExpr parses and runs over the DataFrame.', isCorrect: false },
      { id: 'c', text: 'SQL expression strings, one per output column - the same thing as select() with each argument wrapped in expr().', isCorrect: true },
      { id: 'd', text: 'Column names only, with any arithmetic or aliasing passed separately through a keyword argument.', isCorrect: false },
    ],
    explanation: 'selectExpr(*expr) is shorthand for select() where every argument is parsed as a SQL expression. Each string is ONE output column, not a whole statement - there is no SELECT or FROM keyword involved. It buys you SQL syntax (AS aliases, CAST, CASE WHEN, arithmetic) without importing anything from pyspark.sql.functions, and it is the only way to reach SQL-only constructs like stack() from the DataFrame API.',
    hints: ['How many output columns does each string describe?', 'Think select() + expr() collapsed into one call'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions'],
    concepts: ['ps-select-expr', 'ps-select-filter'],
  },
  {
    id: 'ps-selectexpr-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the method that projects columns using SQL expression strings.',
    template: `# df columns: item, price, qty
# Keep item, and return price under the name unit_price
result = df.___("item", "price AS unit_price")`,
    blanks: ['selectExpr'],
    solution: `result = df.selectExpr("item", "price AS unit_price")`,
    explanation: 'The SQL AS keyword renames inside the expression string, so no separate .alias() call is needed. The DataFrame-API equivalent is df.select("item", col("price").alias("unit_price")) - same plan, more imports.',
    hints: ['Same family as select, but the arguments are SQL text'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions', 'cloze'],
    concepts: ['ps-select-expr'],
  },
  {
    id: 'ps-selectexpr-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using SQL expression strings rather than Column objects, write a PySpark statement over DataFrame "df" (columns: item, price, qty) returning "item" plus a column named "total" holding price multiplied by qty. Assign the result to "result".',
    starterCode: `# df columns: item, price, qty
# Project item and a computed total, using SQL expression strings
result = `,
    testCases: [
      {
        input: 'df with columns: item, price, qty',
        expectedOutput: 'df.selectExpr("item", "price * qty AS total")',
        description: 'Should return item and a computed total column',
      },
    ],
    solution: `result = df.selectExpr("item", "price * qty AS total")`,
    explanation: 'Each argument is one output column written as SQL. The AS clause names the computed column - without it Spark derives a name from the expression itself and you end up with a column literally called "(price * qty)".',
    tieredHints: {
      apiSignature: 'DataFrame.selectExpr(*expr: str) -> DataFrame',
      skeleton: `result = ____.____("item", "price * qty ____ total")`,
    },
    hints: ['One string per output column', 'SQL has a keyword for naming a computed column'],
    requires: ['selectExpr'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions'],
    concepts: ['ps-select-expr', 'ps-select-filter'],
  },
  {
    id: 'ps-selectexpr-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'What does this print?',
    code: `# df rows, as (item, price, qty):
#   ("pen",   2.5, 4)
#   ("book", 10.0, 2)

result = df.selectExpr("item", "CAST(price * qty AS INT) AS total")
print(result.columns)
print([row.total for row in result.collect()])`,
    expectedOutput: `['item', 'total']
[10, 20]`,
    explanation: 'selectExpr projects exactly the two columns listed, so price and qty are gone from the output. SQL CAST inside the expression converts the double result to an int, and AS names it. Note that the surviving columns are the ones you LISTED, not the ones your expressions happened to read.',
    hints: ['Which columns survive the projection?', 'CAST(... AS INT) on 2.5 * 4'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions', 'predict'],
    concepts: ['ps-select-expr', 'ps-cast-types'],
  },
  {
    id: 'ps-selectexpr-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'DataFrame "df" has columns item, price, qty. What does df.selectExpr("price * qty AS total") return?',
    options: [
      { id: 'a', text: 'A DataFrame with one column, total - selectExpr projects exactly what you list, so item and qty are dropped.', isCorrect: true },
      { id: 'b', text: 'A DataFrame with four columns - the original three, plus total appended on the right-hand side.', isCorrect: false },
      { id: 'c', text: 'A DataFrame with three columns - price and qty are kept because the expression reads them, plus total.', isCorrect: false },
      { id: 'd', text: 'An AnalysisException, because selectExpr needs at least one bare column name among its expressions.', isCorrect: false },
    ],
    explanation: 'selectExpr is a projection, exactly like select: the output is the list you gave it and nothing else. Reading a column inside an expression does not keep that column in the result. When you want everything plus a derived column, list the star first - df.selectExpr("*", "price * qty AS total") - which is the selectExpr equivalent of withColumn.',
    hints: ['Is this adding a column or replacing the projection?', 'Compare it with withColumn'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions'],
    concepts: ['ps-select-expr', 'ps-select-filter'],
  },
  {
    id: 'ps-selectexpr-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using SQL expression strings, write a PySpark statement over DataFrame "df" (columns: item, price, qty) that keeps every existing column AND adds a column named "total" holding price multiplied by qty. Assign the result to "result".',
    starterCode: `# df columns: item, price, qty
# Keep all existing columns and append a computed total
result = `,
    testCases: [
      {
        input: 'df with columns: item, price, qty',
        expectedOutput: 'df.selectExpr("*", "price * qty AS total")',
        description: 'Should return all four columns',
      },
    ],
    solution: `result = df.selectExpr("*", "price * qty AS total")`,
    explanation: 'Because selectExpr replaces the projection rather than adding to it, keeping the existing columns means listing them - and "*" is how SQL says "all of them". This is the selectExpr counterpart to withColumn("total", ...), and it is the form you want when the derived column is easier to express in SQL than with Column objects.',
    tieredHints: {
      apiSignature: 'DataFrame.selectExpr(*expr: str) -> DataFrame',
      skeleton: `result = ____.____("____", "price * qty AS total")`,
    },
    hints: ['Listing nothing else would drop the original columns', 'SQL already has a token meaning "every column"'],
    requires: ['selectExpr'],
    tags: ['dataframe', 'selectExpr', 'sql-expressions'],
    concepts: ['ps-select-expr', 'ps-select-filter'],
  },
];
