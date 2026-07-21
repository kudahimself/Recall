import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

/**
 * Mastery-level questions covering critical gaps:
 * - File I/O (CSV, JSON, Parquet, Avro)
 * - Schema Management (StructType, StructField)
 * - CASE/WHEN expressions
 * - CTEs (WITH clause)
 * - UDFs (Python, Pandas)
 * - SQL Set Operations (UNION, INTERSECT, EXCEPT)
 * - Semi-joins & Anti-joins
 * - Pivot / Unpivot
 * - Type Casting
 * - PySpark Actions (show, count, collect, take)
 * - Delta RESTORE
 * - Table Constraints (CHECK, NOT NULL)
 */

export const masteryQuestions: Question[] = [

  // =====================================================================
  // FILE I/O (12 questions)
  // =====================================================================

  {
    id: 'io-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to read a CSV file from "/data/employees.csv" into DataFrame "df" with headers enabled and schema inference enabled.`,
    starterCode: `# Read CSV file into df\ndf = `,
    testCases: [
      {
        input: 'CSV file with headers',
        expectedOutput: '.format("csv").option("header", "true").option("inferSchema", "true").load()',
        description: 'Should read CSV with header and inferSchema',
      },
    ],
    solution: `df = spark.read.format("csv").option("header", "true").option("inferSchema", "true").load("/data/employees.csv")
# OR
df = spark.read.csv("/data/employees.csv", header=True, inferSchema=True)`,
    explanation: 'header=True treats the first row as column headers. inferSchema=True auto-detects column data types by scanning the file. In production, prefer explicit StructType schemas for performance.',
    tieredHints: {
      apiSignature: 'DataFrameReader.csv(path: str, header: bool = None, inferSchema: bool = None) -> DataFrame',
      skeleton: `df = spark.read.____("/data/employees.csv", ____=True, ____=True)`,
    },
    hints: ['Use spark.read.csv() or spark.read.format("csv")', 'Set header and inferSchema options'],
    tags: ['csv', 'read', 'io', 'file-formats'],
    concepts: ['ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to save DataFrame "df" as a Parquet file at storage path "/output/employees.parquet", replacing any existing files at that location.`,
    starterCode: `# Write df to Parquet in overwrite mode\n`,
    testCases: [
      {
        input: 'DataFrame to write',
        expectedOutput: '.format("parquet").mode("overwrite").save()',
        description: 'Should write Parquet in overwrite mode',
      },
    ],
    solution: `df.write.format("parquet").mode("overwrite").save("/output/employees.parquet")
# OR
df.write.parquet("/output/employees.parquet", mode="overwrite")`,
    explanation: 'Parquet is a compressed columnar storage format. Specifying mode("overwrite") replaces existing output files. Available save modes include: "append", "overwrite", "errorifexists" (default), and "ignore".',
    tieredHints: {
      apiSignature: 'DataFrameWriter.parquet(path: str, mode: str = None) -> None',
      skeleton: `df.write.____("/output/employees.parquet", ____="____")`,
    },
    hints: ['Use .write.parquet() or .write.format("parquet")', 'Set mode to "overwrite"'],
    tags: ['parquet', 'write', 'io', 'file-formats'],
    concepts: ['ps-io-parquet', 'ps-write-modes', 'ps-io-csv'],
  },

  {
    id: 'io-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to read a JSON dataset from "/data/events.json" into DataFrame "df".`,
    starterCode: `# Read JSON file into df\ndf = `,
    testCases: [
      {
        input: 'JSON file',
        expectedOutput: 'spark.read.json() or spark.read.format("json")',
        description: 'Should read JSON file',
      },
    ],
    solution: `df = spark.read.json("/data/events.json")
# OR
df = spark.read.format("json").load("/data/events.json")`,
    explanation: 'spark.read.json() parses single-line or multi-line JSON files. For multi-line JSON objects, pass option("multiLine", "true").',
    tieredHints: {
      apiSignature: 'DataFrameReader.json(path: str) -> DataFrame',
      skeleton: `-- ____ read JSON file
df = ____.____.____("/data/events.json")`,
    },
    hints: ['Use spark.read.json() or spark.read.format("json")'],
    tags: ['json', 'read', 'io', 'file-formats'],
    concepts: ['ps-io-json', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to read a metastore-registered Delta table named "sales" into DataFrame "df".`,
    starterCode: `# Read catalog table into df\ndf = `,
    testCases: [
      {
        input: 'Delta table',
        expectedOutput: 'spark.read.table("sales") or spark.table("sales")',
        description: 'Should read Delta table',
      },
    ],
    solution: `df = spark.read.table("sales")
# OR
df = spark.table("sales")
# OR
df = spark.read.format("delta").table("sales")`,
    explanation: 'spark.table("table_name") reads a managed or external table registered in the metastore. For un-registered Delta paths, use spark.read.format("delta").load("/path").',
    tieredHints: {
      apiSignature: 'SparkSession.table(tableName: str) -> DataFrame',
      skeleton: `df = ____.____("____")`,
    },
    hints: ['Use spark.table("sales") or spark.read.table("sales")'],
    tags: ['delta', 'read', 'io', 'file-formats'],
    concepts: ['delta-acid', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to write DataFrame "df" to a catalog Delta table named "output_sales", appending new records to the existing table.`,
    starterCode: `# Append df to catalog Delta table\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: '.format("delta").mode("append").saveAsTable("output_sales")',
        description: 'Should write Delta in append mode',
      },
    ],
    solution: `df.write.format("delta").mode("append").saveAsTable("output_sales")
# OR
df.write.mode("append").saveAsTable("output_sales")`,
    explanation: 'saveAsTable("table_name") writes DataFrame contents into a catalog table. Specifying mode("append") appends rows without overwriting existing data.',
    tieredHints: {
      apiSignature: 'DataFrameWriter.saveAsTable(name: str, mode: str = None) -> None',
      skeleton: `df.write.____("____").____("output_sales")`,
    },
    hints: ['Use .format("delta").saveAsTable()', 'Set mode to "append"'],
    tags: ['delta', 'write', 'io', 'file-formats'],
    concepts: ['delta-acid', 'ps-write-modes', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    question: 'Which set represents the four valid DataFrame save modes supported by PySpark?',
    options: [
      { id: 'a', text: 'overwrite (replaces table data), append (attaches rows), error (fails if path exists, default), ignore (skips write if path exists).', isCorrect: true },
      { id: 'b', text: 'create (initializes storage path), update (modifies matching rows), delete (purges files), merge (combines underlying schemas).', isCorrect: false },
      { id: 'c', text: 'insert (applies new records), replace (swaps target files), truncate (wipes table data), drop (deletes metastore catalog entity).', isCorrect: false },
      { id: 'd', text: 'read (opens data stream), write (commits data stream), append (attaches new records), overwrite (replaces storage directory).', isCorrect: false },
    ],
    explanation: 'PySpark supports four write modes: "error" / "errorifexists" (default: throws AnalysisException if data exists), "overwrite" (replaces data), "append" (adds rows), and "ignore" (skips write silently if data exists).',
    tags: ['write-modes', 'io', 'file-formats'],
    concepts: ['ps-write-modes', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    question: 'Which file format features columnar storage, min/max statistics for file skipping, and serves as the default storage format for Delta Lake?',
    options: [
      { id: 'a', text: 'CSV (Comma-Separated Values text file format)', isCorrect: false },
      { id: 'b', text: 'Parquet (Columnar binary format with statistics)', isCorrect: true },
      { id: 'c', text: 'JSON (JavaScript Object Notation text format)', isCorrect: false },
      { id: 'd', text: 'Avro (Row-based binary serialization format)', isCorrect: false },
    ],
    explanation: 'Parquet is a columnar binary file format that stores per-file and per-row-group column statistics (min, max, null count), enabling efficient column pruning and predicate pushdown.',
    tags: ['parquet', 'file-formats', 'columnar'],
    concepts: ['ps-io-parquet'],
  },

  {
    id: 'io-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to read a pipe-delimited ("|") CSV file from "/data/sales.csv" into DataFrame "df" with headers enabled and schema inference enabled.`,
    starterCode: `# Read pipe-delimited CSV into df\ndf = `,
    testCases: [
      {
        input: 'pipe-separated CSV',
        expectedOutput: '.option("delimiter", "|") or .option("sep", "|")',
        description: 'Should read with pipe delimiter',
      },
    ],
    solution: `df = spark.read.format("csv").option("header", "true").option("inferSchema", "true").option("delimiter", "|").load("/data/sales.csv")
# OR
df = spark.read.csv("/data/sales.csv", header=True, inferSchema=True, sep="|")`,
    explanation: 'Custom delimiters can be set using option("delimiter", "|") or option("sep", "|") in chained style, or via sep="|" keyword argument in spark.read.csv(). Note that the header option is singular "header".',
    tieredHints: {
      apiSignature: 'DataFrameReader.csv(path: str, header: bool = None, inferSchema: bool = None, sep: str = None) -> DataFrame',
      skeleton: `df = spark.read.____("/data/sales.csv", ____=True, ____=True, ____="|")`,
    },
    hints: ['Use option("delimiter", "|") or option("sep", "|")', 'Or use sep="|" in spark.read.csv()'],
    tags: ['csv', 'delimiter', 'io', 'file-formats'],
    concepts: ['ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.SQL,
    question: `Write a SQL DDL statement to create a table named "employees" using CSV format from data files at "/data/employees.csv", specifying header="true" and inferSchema="true".`,
    starterCode: `-- Create SQL table from CSV path\n`,
    testCases: [
      {
        input: 'CSV file',
        expectedOutput: 'CREATE TABLE ... USING CSV',
        description: 'Should create table from CSV',
      },
    ],
    solution: `CREATE TABLE employees
USING CSV
OPTIONS (header "true", inferSchema "true")
LOCATION "/data/employees.csv"
-- OR
CREATE TABLE IF NOT EXISTS employees
USING CSV
OPTIONS (header "true", inferSchema "true")
LOCATION "/data/employees.csv"`,
    explanation: 'CREATE TABLE ... USING CSV specifies the table format. OPTIONS (header "true", inferSchema "true") sets format options, and LOCATION "/path" points to the underlying data directory.',
    tieredHints: {
      apiSignature: 'CREATE TABLE table_name USING CSV OPTIONS (option "value") LOCATION "path"',
      skeleton: `-- ____ table from CSV
CREATE TABLE employees
____ CSV
____ (header "true", inferSchema "true")
____ "/data/employees.csv"`,
    },
    hints: ['Use CREATE TABLE table_name USING CSV', 'Use OPTIONS (header "true", inferSchema "true")', 'Specify LOCATION "/data/employees.csv"'],
    tags: ['sql', 'create-table', 'csv', 'io'],
    concepts: ['ps-dataframe-create', 'ps-io-csv'],
  },

  // =====================================================================
  // SCHEMA MANAGEMENT (8 questions)
  // =====================================================================

  {
    id: 'schema-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark script to define an explicit StructType schema variable "schema" for a DataFrame with four fields: id (integer), name (string), salary (double), and is_active (boolean).

Target Schema Definition:
\`\`\`text
+-----------+-------------+----------+
| Column    | Data Type   | Nullable |
+-----------+-------------+----------+
| id        | IntegerType | True     |
| name      | StringType  | True     |
| salary    | DoubleType  | True     |
| is_active | BooleanType | True     |
+-----------+-------------+----------+
\`\`\``,
    starterCode: `# Import StructType, StructField, and data types\n# Build schema = StructType([...])\n`,
    testCases: [
      {
        input: 'Schema definition',
        expectedOutput: 'StructType with StructFields',
        description: 'Should define schema with correct types',
      },
    ],
    solution: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType, BooleanType

schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("salary", DoubleType(), True),
    StructField("is_active", BooleanType(), True)
])`,
    explanation: 'StructType defines a schema as a list of StructFields. Each StructField takes column name, data type object, and nullable flag (True/False). Explicit schemas eliminate schema inference overhead and prevent unexpected data type casting bugs.',
    tieredHints: {
      apiSignature: 'StructType(fields: List[StructField])',
      skeleton: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType, BooleanType

schema = ____([
    ____("id", ____(), True),
    ____("name", ____(), True),
    ____("salary", ____(), True),
    ____("is_active", ____(), True)
])`,
    },
    hints: ['Use StructField(name, type, nullable)', 'Import IntegerType, StringType, DoubleType, BooleanType'],
    tags: ['schema', 'structtype', 'structfield', 'types'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'schema-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark script to define an explicit schema for columns id (integer), name (string), email (string), and read a CSV file at "/data/users.csv" into DataFrame "df" with headers enabled using that schema.

Input File Schema Target:
\`\`\`text
+-----------+-------------+
| Column    | Data Type   |
+-----------+-------------+
| id        | IntegerType |
| name      | StringType  |
| email     | StringType  |
+-----------+-------------+
\`\`\``,
    starterCode: `# Define StructType schema and read CSV into df\n`,
    testCases: [
      {
        input: 'CSV with explicit schema',
        expectedOutput: 'spark.read.schema(schema).csv()',
        description: 'Should read with explicit schema',
      },
    ],
    solution: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType

schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("email", StringType(), True)
])

df = spark.read.schema(schema).option("header", "true").csv("/data/users.csv")
# OR
df = spark.read.option("header", "true").schema(schema).csv("/data/users.csv")`,
    explanation: 'Using .schema(schema) applies your pre-defined StructType directly during reading. This bypasses the extra file scan required by inferSchema="true", guaranteeing data type safety in production pipelines.',
    tieredHints: {
      apiSignature: 'DataFrameReader.schema(schema: StructType) -> DataFrameReader',
      skeleton: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType

schema = ____([
    ____("id", ____(), True),
    ____("name", ____(), True),
    ____("email", ____(), True)
])

df = ____.____.____(schema).____("header", "true").____("/data/users.csv")`,
    },
    hints: ['Define StructType first, then pass to .schema()', 'Use option("header", "true")'],
    tags: ['schema', 'read', 'csv', 'structtype'],
    concepts: ['ps-dataframe-create', 'ps-io-csv'],
  },

  {
    id: 'schema-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to define a schema variable "schema" using a concise DDL formatted string for columns: id (INT), name (STRING), amount (DOUBLE).

DDL Schema Format Target:
\`\`\`text
"id INT, name STRING, amount DOUBLE"
\`\`\``,
    starterCode: `# Define DDL schema string\nschema = `,
    testCases: [
      {
        input: 'DDL string',
        expectedOutput: '"id INT, name STRING, amount DOUBLE"',
        description: 'Should define DDL schema string',
      },
    ],
    solution: `schema = "id INT, name STRING, amount DOUBLE"
# OR
schema = 'id INT, name STRING, amount DOUBLE'`,
    explanation: 'DDL schema strings provide a compact, human-readable alternative to verbose StructType definitions: "col_name DATA_TYPE, ...". Supported data types include INT, BIGINT, DOUBLE, STRING, BOOLEAN, DATE, TIMESTAMP.',
    tieredHints: {
      apiSignature: 'DDL Schema String: "col1 TYPE1, col2 TYPE2, ..."',
      skeleton: `# ____ DDL schema string
schema = "id ____, name ____, amount ____"`,
    },
    hints: ['Use "column_name TYPE" format', 'Separate column definitions with commas'],
    tags: ['schema', 'ddl', 'types'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'schema-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to print the tree structure of DataFrame "df"'s schema to stdout.

Expected Console Output Display:
\`\`\`text
root
 |-- id: integer (nullable = true)
 |-- name: string (nullable = true)
 |-- salary: double (nullable = true)
\`\`\``,
    starterCode: `# Print DataFrame schema tree\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.printSchema()',
        description: 'Should print schema',
      },
    ],
    solution: `df.printSchema()`,
    explanation: 'printSchema() outputs the DataFrame schema in a tree layout showing field names, data types, and nullability flags. For programmatically accessing schema metadata as a StructType object, use df.schema.',
    tieredHints: {
      apiSignature: 'DataFrame.printSchema() -> None',
      skeleton: `# ____ schema tree
____.____()`,
    },
    hints: ['Use the .printSchema() method on DataFrame df'],
    tags: ['schema', 'printSchema', 'inspect'],
    concepts: ['ps-dataframe-create'],
  },

  // =====================================================================
  // CASE/WHEN EXPRESSIONS (8 questions)
  // =====================================================================

  {
    id: 'casewhen-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "salary_band" to DataFrame "df" (columns: id, name, salary): "High" if salary > 100000, "Medium" if salary > 50000, otherwise "Low".',
    starterCode: `# Add salary_band column using conditional logic\nresult = `,
    testCases: [
      {
        input: 'df with salary column',
        expectedOutput: 'when(col("salary") > 100000, "High").when(...).otherwise("Low")',
        description: 'Should create salary bands with when/otherwise',
      },
    ],
    solution: `from pyspark.sql.functions import when, col

result = df.withColumn("salary_band",
    when(col("salary") > 100000, "High")
    .when(col("salary") > 50000, "Medium")
    .otherwise("Low")
)
# OR
from pyspark.sql.functions import when

result = df.withColumn("salary_band",
    when(df.salary > 100000, "High")
    .when(df.salary > 50000, "Medium")
    .otherwise("Low")
)`,
    explanation: 'when(condition, value) is PySpark\'s equivalent of CASE/WHEN. Chain multiple .when() calls for elif logic, and end with .otherwise() for the default value.',
    tieredHints: {
      apiSignature: 'when(condition: Column, value: Any).otherwise(value: Any) -> Column',
      skeleton: `from pyspark.sql.functions import when, col

result = df.withColumn("salary_band",
    ____(col("salary") > 100000, "High")
    .____(col("salary") > 50000, "Medium")
    .____("Low")
)`,
    },
    hints: ['Chain .when() calls for multiple conditions', 'Use .otherwise() for the default case'],
    tags: ['when', 'otherwise', 'conditional', 'case'],
    concepts: ['ps-when-otherwise', 'sql-case-expr'],
  },

  {
    id: 'casewhen-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "orders" table (columns: id, amount, order_status), write a query that adds a "size" column: "Large" if amount > 1000, "Medium" if amount > 100, otherwise "Small".',
    starterCode: `-- CASE/WHEN query\n`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'CASE WHEN amount > 1000 THEN "Large" ...',
        description: 'Should use CASE/WHEN',
      },
    ],
    solution: `SELECT *,\n  CASE\n    WHEN amount > 1000 THEN "Large"\n    WHEN amount > 100 THEN "Medium"\n    ELSE "Small"\n  END AS size\nFROM orders\n-- OR\nSELECT id, amount, order_status,\n  CASE WHEN amount > 1000 THEN 'Large' WHEN amount > 100 THEN 'Medium' ELSE 'Small' END AS size\nFROM orders`,
    explanation: 'SQL CASE/WHEN is the standard way to add conditional logic. WHEN conditions are evaluated in order — first match wins. ELSE provides the default. END closes the expression.',
    tieredHints: {
      apiSignature: 'CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE default END AS alias',
      skeleton: `SELECT *,
  ____
    ____ amount > 1000 ____ "Large"
    ____ amount > 100 ____ "Medium"
    ____ "Small"
  ____ AS size
FROM orders`,
    },
    hints: ['Use CASE WHEN condition THEN value', 'End with ELSE and END AS alias'],
    tags: ['case', 'when', 'sql', 'conditional'],
    concepts: ['sql-case-expr', 'ps-when-otherwise'],
  },

  {
    id: 'casewhen-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add an "age_group" column to DataFrame "df" (columns: id, emp_name, age): "Minor" if age < 18, "Adult" if age < 65, otherwise "Senior".',
    starterCode: `# Categorize age groups\nresult = `,
    testCases: [
      {
        input: 'df with age column',
        expectedOutput: 'when(col("age") < 18, "Minor").when(...).otherwise("Senior")',
        description: 'Should categorize by age',
      },
    ],
    solution: `from pyspark.sql.functions import when, col\n\nresult = df.withColumn("age_group",\n    when(col("age") < 18, "Minor")\n    .when(col("age") < 65, "Adult")\n    .otherwise("Senior")\n)\n# OR\nfrom pyspark.sql.functions import when\n\nresult = df.withColumn("age_group",\n    when(df.age < 18, "Minor")\n    .when(df.age < 65, "Adult")\n    .otherwise("Senior")\n)`,
    explanation: 'Chain .when() conditions sequentially to implement multi-branch categorization. The first matching condition determines the output value.',
    tieredHints: {
      apiSignature: 'when(condition: Column, value: Any).otherwise(value: Any) -> Column',
      skeleton: `from pyspark.sql.functions import when, col

result = ____.____("____",
    ____(col("____") < ____, "____")
    .____(col("____") < ____, "____")
    .____("____")
)`,
    },
    hints: ['Use when(condition, value)', 'Chain .when() for second condition and .otherwise() for default'],
    tags: ['when', 'otherwise', 'conditional', 'case'],
    concepts: ['ps-when-otherwise', 'sql-case-expr'],
  },

  {
    id: 'casewhen-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), write a query that calculates a bonus: 20% of salary for "Engineering", 15% for "Sales", 10% for all others. Return emp_name, department, salary, and bonus.',
    starterCode: `-- Calculate department-based bonus\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'CASE WHEN department = "Engineering" THEN salary * 0.2 ...',
        description: 'Should calculate conditional bonus',
      },
    ],
    solution: `SELECT emp_name, department, salary,\n  CASE\n    WHEN department = "Engineering" THEN salary * 0.2\n    WHEN department = "Sales" THEN salary * 0.15\n    ELSE salary * 0.1\n  END AS bonus\nFROM employees\n-- OR\nSELECT emp_name, department, salary,\n  CASE WHEN department = 'Engineering' THEN salary * 0.20 WHEN department = 'Sales' THEN salary * 0.15 ELSE salary * 0.10 END AS bonus\nFROM employees`,
    explanation: 'CASE/WHEN can include calculations, not just static values. The result expression after THEN can be any valid SQL expression including arithmetic on other columns.',
    tieredHints: {
      apiSignature: 'CASE WHEN cond1 THEN expr1 WHEN cond2 THEN expr2 ELSE expr3 END AS alias',
      skeleton: `SELECT ____, ____, ____,
  ____
    ____ department = "____" ____ salary * 0.2
    ____ department = "____" ____ salary * 0.15
    ____ salary * 0.1
  ____ AS ____
FROM ____`,
    },
    hints: ['THEN can contain expressions like salary * 0.2', 'Use ELSE for the default calculation'],
    tags: ['case', 'when', 'calculation', 'sql'],
    concepts: ['sql-case-expr', 'ps-when-otherwise'],
  },

  // =====================================================================
  // CTEs - Common Table Expressions (6 questions)
  // =====================================================================

  {
    id: 'cte-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), write a CTE named "dept_avg" that calculates average salary per department, then select departments where average salary exceeds 60000. Name the aggregate column "avg_salary".',
    starterCode: `-- Write query using a CTE\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'WITH dept_avg AS (SELECT ... GROUP BY) SELECT ... WHERE',
        description: 'Should use CTE with WITH clause',
      },
    ],
    solution: `WITH dept_avg AS (\n  SELECT department, AVG(salary) as avg_salary\n  FROM employees\n  GROUP BY department\n)\nSELECT * FROM dept_avg WHERE avg_salary > 60000\n-- OR\nWITH dept_avg AS (\n  SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department\n)\nSELECT department, avg_salary FROM dept_avg WHERE avg_salary > 60000`,
    explanation: 'CTEs (WITH clause) create named temporary result sets that exist only for the duration of the query. They improve readability over subqueries and can be referenced multiple times.',
    tieredHints: {
      apiSignature: 'WITH cte_name AS (query) SELECT ... FROM cte_name',
      skeleton: `____ dept_avg ____ (
  SELECT ____, ____(salary) as ____
  FROM ____
  GROUP BY ____
)
SELECT * FROM ____ WHERE ____ > 60000`,
    },
    hints: ['Use WITH name AS (query)', 'Then SELECT FROM the CTE name'],
    tags: ['cte', 'with', 'sql', 'subquery'],
    concepts: ['sql-cte', 'sql-subqueries'],
  },

  {
    id: 'cte-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Write a query with two CTEs: "active_orders" (orders where order_status = "active" from "orders" table with columns: id, customer_id, amount, order_status) and "customer_totals" (sum of amount per customer_id from active_orders named "total"). Select customer_id and total where total exceeds 5000.',
    starterCode: `-- Multiple CTEs\n`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'WITH cte1 AS (...), cte2 AS (...) SELECT ...',
        description: 'Should chain multiple CTEs',
      },
    ],
    solution: `WITH active_orders AS (\n  SELECT * FROM orders WHERE order_status = "active"\n),\ncustomer_totals AS (\n  SELECT customer_id, SUM(amount) as total\n  FROM active_orders\n  GROUP BY customer_id\n)\nSELECT * FROM customer_totals WHERE total > 5000\n-- OR\nWITH active_orders AS (SELECT id, customer_id, amount FROM orders WHERE order_status = 'active'), customer_totals AS (SELECT customer_id, SUM(amount) AS total FROM active_orders GROUP BY customer_id) SELECT customer_id, total FROM customer_totals WHERE total > 5000`,
    explanation: 'Multiple CTEs are separated by commas. Later CTEs can reference earlier ones. This creates a readable pipeline of transformations.',
    tieredHints: {
      apiSignature: 'WITH cte1 AS (query1), cte2 AS (query2) SELECT ... FROM cte2',
      skeleton: `____ active_orders ____ (
  SELECT * FROM ____ WHERE ____ = "active"
),
customer_totals ____ (
  SELECT customer_id, ____(amount) as ____
  FROM ____
  GROUP BY ____
)
SELECT * FROM ____ WHERE ____ > 5000`,
    },
    hints: ['Separate CTEs with commas', 'Later CTEs can reference earlier ones'],
    tags: ['cte', 'with', 'multiple', 'sql'],
    concepts: ['sql-cte'],
  },

  {
    id: 'cte-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    question: 'What primary architectural advantage do Common Table Expressions (CTEs via WITH) offer compared to inline nested subqueries?',
    options: [
      { id: 'a', text: 'CTEs force Spark SQL to materialise intermediate tables to persistent disk storage automatically', isCorrect: false },
      { id: 'b', text: 'CTEs improve code readability and enable reusable modular subqueries within the same execution scope', isCorrect: true },
      { id: 'c', text: 'CTEs bypass Catalyst query optimization to enforce deterministic procedural step execution', isCorrect: false },
      { id: 'd', text: 'CTEs restrict query execution exclusively to Delta Lake transactional table storage formats', isCorrect: false },
    ],
    explanation: 'CTEs improve readability by naming intermediate results. They can be referenced multiple times in the main query (unlike subqueries which must be repeated). Performance is typically the same as equivalent subqueries.',
    tags: ['cte', 'with', 'advantages', 'sql'],
    concepts: ['sql-cte'],
  },

  // =====================================================================
  // UDFs (8 questions)
  // =====================================================================

  {
    id: 'udf-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.ADVANCED_TOPICS,
    language: CodeLanguage.PYTHON,
    question: 'Create a Python UDF named "reverse_string" that reverses a string input, and use it to add a "reversed_name" column to DataFrame "df" (columns: id, name).',
    starterCode: `# Create and apply reverse_string UDF\n`,
    testCases: [
      {
        input: 'df with name column',
        expectedOutput: 'udf(lambda, StringType) or @udf decorator',
        description: 'Should create and apply UDF',
      },
    ],
    solution: `from pyspark.sql.functions import udf\nfrom pyspark.sql.types import StringType\n\nreverse_string = udf(lambda s: s[::-1] if s else None, StringType())\nresult = df.withColumn("reversed_name", reverse_string(df.name))\n# OR\nfrom pyspark.sql.functions import udf, col\nfrom pyspark.sql.types import StringType\n\n@udf(returnType=StringType())\ndef reverse_string(s):\n    return s[::-1] if s else None\n\nresult = df.withColumn("reversed_name", reverse_string(col("name")))`,
    explanation: 'udf(function, return_type) creates a User Defined Function. The function is serialised and sent to executors. Always handle None/null values in your UDF. UDFs are slower than built-in functions due to JVM-Python serialisation.',
    tieredHints: {
      apiSignature: 'udf(f: Callable, returnType: DataType = StringType()) -> UserDefinedFunction',
      skeleton: `from pyspark.sql.functions import ____
from pyspark.sql.types import ____

reverse_string = ____(lambda s: ____[::-1] if ____ else ____, ____())
result = ____.____("____", ____(____.____))`,
    },
    hints: ['Use udf(function, return_type)', 'Always handle None values', 'Apply with df.withColumn()'],
    tags: ['udf', 'python', 'custom-function'],
    concepts: ['ps-udf-pandas-udf'],
  },

  {
    id: 'udf-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    language: CodeLanguage.PYTHON,
    question: 'Register a Python function "classify_amount" as a SQL UDF returning "High" for amounts > 1000 and "Low" otherwise, then execute a SQL query on table "transactions" (columns: id, amount) returning id, amount, and the calculated "category" column.',
    starterCode: `# Register UDF for SQL use\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'spark.udf.register() and spark.sql()',
        description: 'Should register UDF for SQL',
      },
    ],
    solution: `def classify_amount(amount):\n    return "High" if amount and amount > 1000 else "Low"\n\nspark.udf.register("classify_amount", classify_amount, StringType())\n\nresult = spark.sql("SELECT id, amount, classify_amount(amount) as category FROM transactions")\n# OR\nfrom pyspark.sql.types import StringType\n\nspark.udf.register("classify_amount", lambda amount: "High" if amount and amount > 1000 else "Low", StringType())\n\nresult = spark.sql("SELECT id, amount, classify_amount(amount) AS category FROM transactions")`,
    explanation: 'spark.udf.register(name, function, return_type) registers a UDF for use in SQL queries. The registered name can then be called like a built-in function in spark.sql() statements.',
    tieredHints: {
      apiSignature: 'UDFRegistration.register(name: str, f: Callable, returnType: DataType = StringType()) -> UserDefinedFunction',
      skeleton: `def classify_amount(amount):
    return "High" if ____ and ____ > 1000 else "Low"

____.____.____("____", ____, ____())

result = ____.____("SELECT ____, ____, ____(____) as ____ FROM ____")`,
    },
    hints: ['Use spark.udf.register(name, func, type)', 'Then use the name in SQL queries'],
    tags: ['udf', 'register', 'sql', 'custom-function'],
    concepts: ['ps-udf-pandas-udf', 'sql-temp-views'],
  },

  {
    id: 'udf-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    question: 'What is a Pandas UDF (vectorised UDF) in PySpark, and why does it outperform standard Python UDFs?',
    options: [
      { id: 'a', text: 'It executes calculations on physical GPU hardware accelerators rather than CPU cores', isCorrect: false },
      { id: 'b', text: 'It completely bypasses null value checks and type assertions during runtime evaluation', isCorrect: false },
      { id: 'c', text: 'It operates strictly on primitive integer and float types by casting all inputs to 64-bit arrays', isCorrect: false },
      { id: 'd', text: 'It processes data in Apache Arrow batches as pandas Series, avoiding per-row serialization between JVM and Python', isCorrect: true },
    ],
    explanation: 'Regular UDFs serialise one row at a time between JVM and Python. Pandas UDFs use Apache Arrow to transfer data in batches as pandas Series/DataFrames, which is 10-100x faster. Use @pandas_udf decorator.',
    tags: ['pandas-udf', 'vectorized', 'performance', 'arrow'],
    concepts: ['ps-udf-pandas-udf', 'ps-cache-persist'],
  },

  {
    id: 'udf-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    language: CodeLanguage.PYTHON,
    question: 'Define a Pandas UDF named "double_price" that multiplies a pandas Series input by 2, returning DoubleType, and apply it to create a "double_price" column in DataFrame "df" (columns: id, product, price).',
    starterCode: `import pandas as pd\nfrom pyspark.sql.functions import pandas_udf\nfrom pyspark.sql.types import DoubleType\n\n# Define and apply Pandas UDF\n`,
    testCases: [
      {
        input: 'df with price column',
        expectedOutput: '@pandas_udf decorator with Series input/output',
        description: 'Should create and apply Pandas UDF',
      },
    ],
    solution: `import pandas as pd\nfrom pyspark.sql.functions import pandas_udf\nfrom pyspark.sql.types import DoubleType\n\n@pandas_udf(DoubleType())\ndef double_price(price: pd.Series) -> pd.Series:\n    return price * 2\n\nresult = df.withColumn("double_price", double_price(df.price))\n# OR\nimport pandas as pd\nfrom pyspark.sql.functions import pandas_udf, col\nfrom pyspark.sql.types import DoubleType\n\n@pandas_udf(DoubleType())\ndef double_price(p: pd.Series) -> pd.Series:\n    return p * 2\n\nresult = df.withColumn("double_price", double_price(col("price")))`,
    explanation: 'The @pandas_udf decorator creates a vectorised UDF. Input and output are pandas Series (for scalar UDFs). Operations on Series are vectorised and much faster than row-by-row processing.',
    tieredHints: {
      apiSignature: 'pandas_udf(f: Callable, returnType: DataType) -> UserDefinedFunction',
      skeleton: `import pandas as pd
from pyspark.sql.functions import ____
from pyspark.sql.types import ____

@____(____())
def double_price(price: pd.Series) -> pd.Series:
    return ____ * ____

result = ____.____("____", ____(____.____))`,
    },
    hints: ['Use @pandas_udf(return_type) decorator', 'Function takes and returns pd.Series'],
    tags: ['pandas-udf', 'vectorized', 'decorator'],
    concepts: ['ps-udf-pandas-udf'],
  },

  // =====================================================================
  // SQL SET OPERATIONS (6 questions)
  // =====================================================================

  {
    id: 'setop-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Combine all rows from the "us_customers" table (columns: id, customer_name, email) and "eu_customers" table (same columns), removing duplicate rows.',
    starterCode: `-- Combine tables\n`,
    testCases: [
      {
        input: 'us_customers and eu_customers',
        expectedOutput: 'SELECT * FROM us_customers UNION SELECT * FROM eu_customers',
        description: 'Should UNION two tables',
      },
    ],
    solution: `SELECT * FROM us_customers\nUNION\nSELECT * FROM eu_customers\n-- OR\nSELECT id, customer_name, email FROM us_customers\nUNION\nSELECT id, customer_name, email FROM eu_customers`,
    explanation: 'UNION combines results from two queries and removes duplicates. Both queries must have the same number of columns with compatible types.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 UNION SELECT cols FROM t2',
      skeleton: `-- ____ tables removing duplicates
SELECT * FROM ____
____
SELECT * FROM ____`,
    },
    hints: ['UNION removes duplicates', 'Both tables must have the same columns'],
    tags: ['union', 'set-operations', 'sql'],
    concepts: ['sql-set-operations'],
  },

  {
    id: 'setop-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Combine all rows from "jan_sales" and "feb_sales" tables (both have columns: id, product, amount), keeping all rows including duplicate records.',
    starterCode: `-- Combine keeping duplicates\n`,
    testCases: [
      {
        input: 'jan_sales and feb_sales',
        expectedOutput: 'UNION ALL',
        description: 'Should UNION ALL',
      },
    ],
    solution: `SELECT * FROM jan_sales\nUNION ALL\nSELECT * FROM feb_sales\n-- OR\nSELECT id, product, amount FROM jan_sales\nUNION ALL\nSELECT id, product, amount FROM feb_sales`,
    explanation: 'UNION ALL keeps all rows including duplicates. It is faster than UNION because it skips the deduplication step. Use UNION ALL when you know there are no duplicates or want to keep them.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 UNION ALL SELECT cols FROM t2',
      skeleton: `-- ____ keeping duplicates
SELECT * FROM ____
____ ____
SELECT * FROM ____`,
    },
    hints: ['UNION ALL keeps duplicates', 'Faster than UNION'],
    tags: ['union-all', 'set-operations', 'sql'],
    concepts: ['sql-set-operations'],
  },

  {
    id: 'setop-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Find customer records that exist in both the "online_customers" and "store_customers" tables (both have columns: id, customer_name, email).',
    starterCode: `-- Find common customers\n`,
    testCases: [
      {
        input: 'online_customers and store_customers',
        expectedOutput: 'INTERSECT',
        description: 'Should use INTERSECT',
      },
    ],
    solution: `SELECT * FROM online_customers\nINTERSECT\nSELECT * FROM store_customers\n-- OR\nSELECT id, customer_name, email FROM online_customers\nINTERSECT\nSELECT id, customer_name, email FROM store_customers`,
    explanation: 'INTERSECT returns only rows that appear in both result sets. Useful for finding common records between two tables.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 INTERSECT SELECT cols FROM t2',
      skeleton: `-- ____ common records
SELECT * FROM ____
____
SELECT * FROM ____`,
    },
    hints: ['INTERSECT returns common rows'],
    tags: ['intersect', 'set-operations', 'sql'],
    concepts: ['sql-set-operations'],
  },

  {
    id: 'setop-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Find employees in the "all_employees" table (columns: id, emp_name, department) who are NOT present in the "terminated_employees" table (same columns).',
    starterCode: `-- Find active employees\n`,
    testCases: [
      {
        input: 'all_employees and terminated_employees',
        expectedOutput: 'EXCEPT',
        description: 'Should use EXCEPT',
      },
    ],
    solution: `SELECT * FROM all_employees\nEXCEPT\nSELECT * FROM terminated_employees\n-- OR\nSELECT id, emp_name, department FROM all_employees\nEXCEPT\nSELECT id, emp_name, department FROM terminated_employees`,
    explanation: 'EXCEPT (also called MINUS in some databases) returns rows from the first query that are not in the second query. Order matters — it subtracts the second set from the first.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 EXCEPT SELECT cols FROM t2',
      skeleton: `-- ____ non-matching records
SELECT * FROM ____
____
SELECT * FROM ____`,
    },
    hints: ['EXCEPT removes matching rows', 'Order matters: first EXCEPT second'],
    tags: ['except', 'minus', 'set-operations', 'sql'],
    concepts: ['sql-set-operations'],
  },

  {
    id: 'setop-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SET_OPERATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using PySpark, combine DataFrames "df1" and "df2" (same schema: id, user_name, email), removing duplicate rows.',
    starterCode: `# Union DataFrames removing duplicates\n`,
    testCases: [
      {
        input: 'df1 and df2',
        expectedOutput: 'df1.union(df2).distinct() or df1.unionByName(df2)',
        description: 'Should union DataFrames',
      },
    ],
    solution: `result = df1.union(df2).distinct()\n# OR\nresult = df1.unionByName(df2).distinct()`,
    explanation: 'PySpark union() combines DataFrames by position (like UNION ALL — keeps duplicates). Add .distinct() to remove duplicates. unionByName() matches columns by name, not position — safer when column order might differ.',
    tieredHints: {
      apiSignature: 'DataFrame.union(other: DataFrame).distinct() -> DataFrame',
      skeleton: `-- ____ DataFrames removing duplicates
result = ____.____(____).____()`,
    },
    hints: ['union() is UNION ALL (keeps duplicates)', 'Add .distinct() for dedup', 'unionByName() matches by column name'],
    tags: ['union', 'distinct', 'set-operations'],
    concepts: ['sql-set-operations', 'ps-distinct-drop-dup'],
  },

  // =====================================================================
  // SEMI-JOINS & ANTI-JOINS (6 questions)
  // =====================================================================

  {
    id: 'semijoin-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    question: 'What is the difference between a LEFT SEMI JOIN and a LEFT ANTI JOIN?',
    options: [
      { id: 'a', text: 'Semi join returns rows from the left table that have a match in the right table. Anti join returns rows that do NOT have a match.', isCorrect: true },
      { id: 'b', text: 'Semi join is faster than anti join', isCorrect: false },
      { id: 'c', text: 'Anti join includes columns from both tables', isCorrect: false },
      { id: 'd', text: 'They produce the same result', isCorrect: false },
    ],
    explanation: 'Semi join acts like an EXISTS filter — it returns left rows where a match exists in the right table, but only returns left table columns. Anti join is the opposite — it returns left rows where NO match exists (like NOT EXISTS).',
    tags: ['semi-join', 'anti-join', 'join-types'],
    concepts: ['sql-joins-semi-anti', 'sql-joins-inner-outer'],
  },

  {
    id: 'semijoin-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Using PySpark, find all orders in "orders_df" (columns: id, customer_id, amount) where the customer exists in "active_customers_df" (columns: customer_id, customer_name) using a left semi join.',
    starterCode: `# Semi join - find orders with active customers\nresult = orders_df.join(`,
    testCases: [
      {
        input: 'orders_df and active_customers_df',
        expectedOutput: '.join(active_customers_df, "customer_id", "left_semi")',
        description: 'Should use left semi join',
      },
    ],
    solution: `result = orders_df.join(active_customers_df, "customer_id", "left_semi")`,
    explanation: 'Left semi join returns only rows from the left DataFrame where a matching key exists in the right DataFrame. It does not add any columns from the right table — it acts purely as a filter.',
    tieredHints: {
      apiSignature: 'DataFrame.join(other: DataFrame, on: str, how: str = "left_semi") -> DataFrame',
      skeleton: `-- ____ semi join
result = ____.____(____, "____", "____")`,
    },
    hints: ['Use "left_semi" as the join type', 'Only left table columns are returned'],
    tags: ['semi-join', 'left-semi', 'join', 'pyspark'],
    concepts: ['sql-joins-semi-anti', 'sql-joins-inner-outer', 'ps-session-init'],
  },

  {
    id: 'semijoin-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Using PySpark, find all products in "products_df" (columns: id, product_name, category) that have NEVER been ordered by checking against "order_items_df" (columns: order_id, product_id) using a left anti join.',
    starterCode: `# Anti join - find unordered products\nresult = products_df.join(`,
    testCases: [
      {
        input: 'products_df and order_items_df',
        expectedOutput: '.join(order_items_df, col("id") == col("product_id"), "left_anti")',
        description: 'Should use left anti join',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nresult = products_df.join(order_items_df, products_df.id == order_items_df.product_id, "left_anti")`,
    explanation: 'Left anti join returns rows from the left table that have NO match in the right table. It is the equivalent of NOT EXISTS or NOT IN. Only left table columns are returned.',
    tieredHints: {
      apiSignature: 'DataFrame.join(other: DataFrame, on: Column, how: str = "left_anti") -> DataFrame',
      skeleton: `from pyspark.sql.functions import col

result = ____.____(____, ____.____ ____ order_items_df.____, "____")`,
    },
    hints: ['Use "left_anti" as the join type', 'Returns rows with NO match in the right table'],
    tags: ['anti-join', 'left-anti', 'join', 'pyspark'],
    concepts: ['sql-joins-semi-anti', 'sql-joins-inner-outer', 'ps-session-init'],
  },

  {
    id: 'semijoin-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using SQL, find all employees from the "employees" table (columns: id, emp_name, department) who have submitted at least one expense report in the "expense_reports" table (columns: id, employee_id, amount) using EXISTS.\n\nEXISTS returns TRUE if a correlated subquery returns at least one row. Use SELECT 1 inside — the actual value doesn\'t matter, only whether any row matches.',
    starterCode: `-- Find employees with expense reports\n`,
    testCases: [
      {
        input: 'employees and expense_reports tables',
        expectedOutput: 'WHERE EXISTS (SELECT 1 FROM expense_reports WHERE ...)',
        description: 'Should use EXISTS',
      },
    ],
    solution: `SELECT * FROM employees e\nWHERE EXISTS (\n  SELECT 1 FROM expense_reports er\n  WHERE er.employee_id = e.id\n)`,
    explanation: 'EXISTS returns TRUE if the subquery returns at least one row. It is the SQL equivalent of a semi join. SELECT 1 is conventional — the actual selected value does not matter.',
    tieredHints: {
      apiSignature: 'WHERE EXISTS (SELECT 1 FROM table WHERE condition)',
      skeleton: `SELECT * FROM employees e
____ ____ (
  SELECT 1 FROM ____ er
  ____ er.____ = e.id
)`,
    },
    hints: ['Use WHERE EXISTS (subquery)', 'Correlate with WHERE er.employee_id = e.id'],
    tags: ['exists', 'semi-join', 'sql', 'subquery'],
    concepts: ['sql-subqueries', 'sql-joins-semi-anti'],
  },

  // =====================================================================
  // PIVOT / UNPIVOT (4 questions)
  // =====================================================================

  {
    id: 'pivot-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to pivot DataFrame "df" (columns: year, quarter, revenue) so each quarter value becomes its own column showing sum of revenue, grouped by year.',
    starterCode: `# Pivot quarter into columns grouped by year\nresult = `,
    testCases: [
      {
        input: 'df with year, quarter, revenue',
        expectedOutput: '.groupBy("year").pivot("quarter").sum("revenue")',
        description: 'Should pivot quarters to columns',
      },
    ],
    solution: `result = df.groupBy("year").pivot("quarter").sum("revenue")
# OR
result = df.groupBy("year").pivot("quarter").agg({"revenue": "sum"})`,
    explanation: 'pivot() rotates distinct values of a column into headers. An aggregation method like sum() or agg() is required to combine values for each pivoted cell.',
    tieredHints: {
      apiSignature: 'GroupedData.pivot(pivotCol: str, values: list = None) -> GroupedData',
      skeleton: `result = df.____("year").____("quarter").____("revenue")`,
    },
    hints: ['Chain: groupBy("year").pivot("quarter").sum("revenue")', 'An aggregation is required after pivot()'],
    tags: ['pivot', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot'],
  },

  {
    id: 'pivot-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Given a "monthly_sales" table with columns "product", "sale_month", and "amount", write a SQL query to pivot the monthly sale amounts into separate columns for months "Jan", "Feb", "Mar", "Apr", "May", and "Jun", grouped by product.',
    starterCode: `-- Pivot sales months to columns\n`,
    testCases: [
      {
        input: 'monthly_sales table',
        expectedOutput: 'PIVOT (SUM(amount) FOR sale_month IN (...))',
        description: 'Should pivot months to columns',
      },
    ],
    solution: `SELECT * FROM (\n  SELECT product, sale_month, amount FROM monthly_sales\n)\nPIVOT (\n  SUM(amount) FOR sale_month IN ("Jan", "Feb", "Mar", "Apr", "May", "Jun")\n)\n-- OR\nSELECT * FROM (SELECT product, sale_month, amount FROM monthly_sales) PIVOT (SUM(amount) FOR sale_month IN ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'))`,
    explanation: 'PIVOT transforms rows into columns. The aggregate (SUM) is applied for each value listed in the IN clause, creating one column per value. The subquery must only include the group column, pivot column, and value column — any extra columns would create unintended groupings.',
    tieredHints: {
      apiSignature: 'PIVOT (AGG(val) FOR col IN (v1, v2, ...))',
      skeleton: `SELECT * FROM (
  SELECT product, sale_month, amount FROM ____
)
____ (
  ____(____) ____ sale_month ____ ("Jan", "Feb", "Mar", "Apr", "May", "Jun")
)`,
    },
    hints: ['The aggregate goes first: SUM(amount)', 'FOR sale_month tells PIVOT which column\'s values become headers', 'IN ("Jan", "Feb", ...) lists the exact values that become columns'],
    tags: ['pivot', 'sql', 'reshape'],
    concepts: ['ps-pivot-unpivot'],
  },

  {
    id: 'pivot-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "wide_scores" table (columns: student, math, science, english), unpivot it so each subject becomes a row with columns: student, subject, score. Use the stack() function.',
    starterCode: `-- Unpivot wide scores table to long format\n`,
    testCases: [
      {
        input: 'wide_scores table',
        expectedOutput: 'stack(3, "math", math, "science", science, "english", english)',
        description: 'Should unpivot using stack',
      },
    ],
    solution: `SELECT student, stack(3, "math", math, "science", science, "english", english) AS (subject, score)\nFROM wide_scores\n-- OR\nSELECT student, stack(3, 'math', math, 'science', science, 'english', english) as (subject, score)\nFROM wide_scores`,
    explanation: 'stack(n, label1, col1, label2, col2, ...) converts n columns from wide format to long format. The first argument is the number of column pairs. Each pair is a label string and the column value.',
    tieredHints: {
      apiSignature: 'stack(n: int, expr1, expr2, ...) AS (col1, col2, ...)',
      skeleton: `SELECT student, ____(3, "____", math, "____", science, "____", english) AS (____, ____)
FROM ____`,
    },
    hints: ['stack(n, label, col, label, col, ...)', 'First arg is the number of columns to unpivot'],
    tags: ['unpivot', 'stack', 'reshape', 'sql'],
    concepts: ['ps-pivot-unpivot'],
  },

  {
    id: 'pivot-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to pivot DataFrame "df" (columns: region, product_type, total_sales) on "product_type" grouped by "region", explicitly passing values ["Electronics", "Clothing", "Food"] to avoid an extra dataset scan.',
    starterCode: `# Pivot with explicit values\nresult = `,
    testCases: [
      {
        input: 'df with region, product_type, total_sales',
        expectedOutput: '.pivot("product_type", ["Electronics", "Clothing", "Food"]).sum("total_sales")',
        description: 'Should pivot with explicit values',
      },
    ],
    solution: `result = df.groupBy("region").pivot("product_type", ["Electronics", "Clothing", "Food"]).sum("total_sales")
# OR
result = df.groupBy("region").pivot("product_type", ["Electronics", "Clothing", "Food"]).agg({"total_sales": "sum"})`,
    explanation: 'Passing a explicit list of values to pivot(column, values) prevents PySpark from executing an extra distinct scan over the entire dataset.',
    tieredHints: {
      apiSignature: 'GroupedData.pivot(pivotCol: str, values: list) -> GroupedData',
      skeleton: `result = df.____("region").____("product_type", ["Electronics", "Clothing", "Food"]).____("total_sales")`,
    },
    hints: ['Pass the pivot values list as the second argument to pivot()', 'Chain sum("total_sales") as the aggregate'],
    tags: ['pivot', 'performance', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot', 'ps-cache-persist'],
  },

  {
    id: 'pivot-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Given an "employee_ratings" table (columns: emp_id, emp_name, q1_rating, q2_rating, q3_rating, q4_rating), unpivot the 4 quarterly ratings into individual rows with output columns "emp_id", "emp_name", "quarter", and "rating". Use stack().',
    starterCode: `-- Unpivot quarterly ratings to rows\n`,
    testCases: [
      {
        input: 'employee_ratings table',
        expectedOutput: 'stack(4, "Q1", q1_rating, "Q2", q2_rating, "Q3", q3_rating, "Q4", q4_rating)',
        description: 'Should unpivot 4 quarters using stack',
      },
    ],
    solution: `SELECT emp_id, emp_name, stack(4, "Q1", q1_rating, "Q2", q2_rating, "Q3", q3_rating, "Q4", q4_rating) AS (quarter, rating)\nFROM employee_ratings\n-- OR\nSELECT emp_id, emp_name, stack(4, 'Q1', q1_rating, 'Q2', q2_rating, 'Q3', q3_rating, 'Q4', q4_rating) as (quarter, rating)\nFROM employee_ratings`,
    explanation: 'stack(4, ...) creates 4 rows per input row, each with a label and the corresponding column value. The AS (quarter, rating) names the output columns. Non-pivoted columns (emp_id, emp_name) are carried along unchanged.',
    tieredHints: {
      apiSignature: 'stack(n: int, expr1, expr2, ...) AS (col1, col2, ...)',
      skeleton: `SELECT emp_id, emp_name, ____(4, "Q1", ____, "Q2", ____, "Q3", ____, "Q4", ____) AS (____, ____)
FROM ____`,
    },
    hints: ['n=4 because there are 4 quarter columns to unpivot', 'Each pair: "Q1", q1_rating gives the label and the value', 'AS (quarter, rating) names the two output columns'],
    tags: ['unpivot', 'stack', 'reshape', 'sql'],
    concepts: ['ps-pivot-unpivot'],
  },

  {
    id: 'pivot-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Given a "survey_responses" table (columns: respondent_id, question_text, response), write a SQL query to pivot the responses so each question ("Satisfaction", "Likelihood", "Effort") becomes a separate column containing the MAX response value grouped by respondent_id.',
    starterCode: `-- Pivot survey responses: long to wide\n`,
    testCases: [
      {
        input: 'survey_responses table',
        expectedOutput: 'PIVOT (MAX(response) FOR question_text IN ("Satisfaction", "Likelihood", "Effort"))',
        description: 'Should pivot survey questions to columns',
      },
    ],
    solution: `SELECT * FROM (\n  SELECT respondent_id, question_text, response FROM survey_responses\n)\nPIVOT (\n  MAX(response) FOR question_text IN ("Satisfaction", "Likelihood", "Effort")\n)\n-- OR\nSELECT * FROM (SELECT respondent_id, question_text, response FROM survey_responses) PIVOT (MAX(response) FOR question_text IN ('Satisfaction', 'Likelihood', 'Effort'))`,
    explanation: 'MAX(response) is used as the aggregate because each respondent has exactly one response per question — MAX just picks that single value. If there could be multiple responses, you might use FIRST() or collect_list(). The subquery limits to only the 3 needed columns to avoid unintended groupings.',
    tieredHints: {
      apiSignature: 'PIVOT (AGG(val) FOR col IN (v1, v2, ...))',
      skeleton: `SELECT * FROM (
  SELECT respondent_id, question_text, response FROM ____
)
____ (
  ____(____) ____ question_text ____ ("Satisfaction", "Likelihood", "Effort")
)`,
    },
    hints: ['Use MAX(response) since each respondent has one answer per question', 'FOR question_text IN (...) lists the questions that become columns', 'The subquery must only include respondent_id, question_text, and response'],
    tags: ['pivot', 'sql', 'reshape', 'survey'],
    concepts: ['ps-pivot-unpivot'],
  },

  // =====================================================================
  // TYPE CASTING (5 questions)
  // =====================================================================

  {
    id: 'cast-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to cast string column "price" in DataFrame "df" to double type, overwriting column "price".',
    starterCode: `# Cast price column to double\nresult = `,
    testCases: [
      {
        input: 'df with string price',
        expectedOutput: 'col("price").cast("double")',
        description: 'Should cast string to double',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nresult = df.withColumn("price", col("price").cast("double"))\n# OR\nfrom pyspark.sql.types import DoubleType\n\nresult = df.withColumn("price", df.price.cast(DoubleType()))`,
    explanation: 'cast(type) converts column data types using string names ("double", "int") or DataType instances (DoubleType()). Unparseable values become null.',
    tieredHints: {
      apiSignature: 'Column.cast(dataType: str | DataType) -> Column',
      skeleton: `from pyspark.sql.functions import ____

result = ____.____("____", ____("____").____("____"))`,
    },
    hints: ['Use .cast("double") or .cast(DoubleType())'],
    tags: ['cast', 'type-conversion', 'double'],
    concepts: ['ps-cast-types'],
  },

  {
    id: 'cast-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "raw_data" table (columns: id, amount — where amount is stored as STRING), cast the amount column to DOUBLE in a SELECT query. Name the calculated column "amount".',
    starterCode: `-- Cast string to double\n`,
    testCases: [
      {
        input: 'raw_data with string amount',
        expectedOutput: 'CAST(amount AS DOUBLE)',
        description: 'Should cast to double',
      },
    ],
    solution: `SELECT id, CAST(amount AS DOUBLE) as amount\nFROM raw_data\n-- OR\nSELECT id, CAST(amount AS double) AS amount\nFROM raw_data`,
    explanation: 'CAST(column AS type) converts data types in SQL. Common types: INT, BIGINT, DOUBLE, FLOAT, STRING, DATE, TIMESTAMP, BOOLEAN. Use :: as shorthand in some contexts: amount::DOUBLE.',
    tieredHints: {
      apiSignature: 'CAST(expression AS dataType)',
      skeleton: `-- ____ string to double
SELECT id, ____(amount ____ DOUBLE) as ____
FROM ____`,
    },
    hints: ['Use CAST(column AS TYPE)', 'Common types: INT, DOUBLE, STRING, DATE'],
    tags: ['cast', 'sql', 'type-conversion'],
    concepts: ['ps-cast-types'],
  },

  {
    id: 'cast-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to cast string column "created_at" (ISO format "YYYY-MM-DD") in DataFrame "df" to date type.',
    starterCode: `# Cast created_at column to date\nresult = `,
    testCases: [
      {
        input: 'df with string date',
        expectedOutput: 'col("created_at").cast("date")',
        description: 'Should cast string to date',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nresult = df.withColumn("created_at", col("created_at").cast("date"))\n# OR\nfrom pyspark.sql.types import DateType\n\nresult = df.withColumn("created_at", df.created_at.cast(DateType()))`,
    explanation: 'cast("date") parses standard ISO date strings (yyyy-MM-dd). For non-standard date formats, use to_date(col, format_string).',
    tieredHints: {
      apiSignature: 'Column.cast(dataType: str = "date") -> Column',
      skeleton: `from pyspark.sql.functions import ____

result = ____.____("____", ____("____").____("____"))`,
    },
    hints: ['Use .cast("date") or .cast(DateType())'],
    tags: ['cast', 'date', 'type-conversion'],
    concepts: ['ps-cast-types', 'ps-datetime-fns'],
  },

  // =====================================================================
  // PYSPARK ACTIONS (6 questions)
  // =====================================================================

  {
    id: 'action-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_ACTIONS,
    question: 'How do PySpark transformations differ fundamental from PySpark actions during query execution?',
    options: [
      { id: 'a', text: 'Transformations execute faster across partitions, while actions spend latency building execution plans.', isCorrect: false },
      { id: 'b', text: 'Transformations build a lazy execution DAG without running jobs, whereas actions trigger immediate computation.', isCorrect: true },
      { id: 'c', text: 'Actions build a lazy execution DAG without running jobs, whereas transformations trigger immediate computation.', isCorrect: false },
      { id: 'd', text: 'Transformations and actions perform identical processing tasks and follow identical execution workflows.', isCorrect: false },
    ],
    explanation: 'Transformations (select, filter, groupBy) build a lazy logical plan (DAG). Actions (show, count, collect, write) trigger physical Spark execution.',
    tags: ['lazy', 'transformation', 'action', 'fundamentals'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture'],
  },

  {
    id: 'action-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_ACTIONS,
    question: 'Which list contains exclusively PySpark actions that trigger immediate cluster job execution?',
    options: [
      { id: 'a', text: 'select(), filter(), groupBy(), and join() (all construct DataFrame DAGs).', isCorrect: false },
      { id: 'b', text: 'withColumn(), drop(), alias(), and cast() (all construct DataFrame DAGs).', isCorrect: false },
      { id: 'c', text: 'show(), count(), collect(), take(), first(), and write() (all trigger jobs).', isCorrect: true },
      { id: 'd', text: 'orderBy(), distinct(), union(), and limit() (all construct DataFrame DAGs).', isCorrect: false },
    ],
    explanation: 'Actions evaluate the lineage graph and return values or save output. show(), count(), collect(), take(), first(), and write() are all actions.',
    tags: ['action', 'transformation', 'lazy', 'fundamentals'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture'],
  },

  {
    id: 'action-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_ACTIONS,
    question: 'Why is invoking collect() on multi-terabyte DataFrames considered a dangerous anti-pattern?',
    options: [
      { id: 'a', text: 'The collect() method has been deprecated since Spark 3.0 and will throw an AnalysisException in production.', isCorrect: false },
      { id: 'b', text: 'The collect() method runs significantly slower than show() because it disables executor parallel execution.', isCorrect: false },
      { id: 'c', text: 'The collect() method can only be executed on low-level RDDs and fails on structured DataFrame collections.', isCorrect: false },
      { id: 'd', text: 'The collect() method brings all rows to driver memory as a list, causing OOM exceptions on large datasets.', isCorrect: true },
    ],
    explanation: 'collect() pulls every partition row to the driver JVM memory. For large datasets, this overwhelms driver RAM and causes OutOfMemory (OOM) crashes.',
    tags: ['collect', 'driver', 'memory', 'action'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture', 'ps-cache-persist'],
  },

  {
    id: 'action-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_ACTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write PySpark statements to display the first 5 rows of DataFrame "df" in tabular format, then assign its total row count to variable "row_count".',
    starterCode: `# Display top 5 rows and compute total count\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.show(5) and df.count()',
        description: 'Should show and count',
      },
    ],
    solution: `df.show(5)\nrow_count = df.count()`,
    explanation: 'show(5) displays the top 5 rows in console tabular format, and count() returns total row count as an integer.',
    tieredHints: {
      apiSignature: 'DataFrame.show(n: int = 20) -> None; DataFrame.count() -> int',
      skeleton: `-- ____ top 5 rows and count
____.____(5)
row_count = ____.____()`,
    },
    hints: ['Call show(5) on df', 'Assign df.count() to row_count'],
    tags: ['show', 'count', 'action', 'basics'],
    concepts: ['ps-actions-vs-transforms'],
  },

  {
    id: 'action-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_ACTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write PySpark statements to extract the first Row object into "first_row", and the top 3 Row objects into list "first_three" from DataFrame "df".',
    starterCode: `# Extract top rows into driver variables\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.first() and df.take(3)',
        description: 'Should use first and take',
      },
    ],
    solution: `first_row = df.first()\nfirst_three = df.take(3)\n# OR\nfirst_row = df.head()\nfirst_three = df.head(3)`,
    explanation: 'first() returns a single Row object, while take(n) or head(n) returns a list of n Row objects.',
    tieredHints: {
      apiSignature: 'DataFrame.first() -> Row; DataFrame.take(num: int) -> List[Row]',
      skeleton: `-- ____ top rows
first_row = ____.____()
first_three = ____.____(3)`,
    },
    hints: ['Use df.first() or df.head() for the first row', 'Use df.take(3) or df.head(3) for the list'],
    tags: ['first', 'take', 'head', 'action'],
    concepts: ['ps-aggregate-fns', 'ps-actions-vs-transforms'],
  },

  // =====================================================================
  // DELTA RESTORE & CONSTRAINTS (8 questions)
  // =====================================================================

  {
    id: 'restore-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to revert Delta table "orders" back to commit version 5 following an erroneous data update.`,
    starterCode: `-- Revert orders table to version 5\n`,
    testCases: [
      {
        input: 'orders Delta table',
        expectedOutput: 'RESTORE TABLE orders TO VERSION AS OF 5',
        description: 'Should restore to version 5',
      },
    ],
    solution: `RESTORE TABLE orders TO VERSION AS OF 5
-- OR
RESTORE orders TO VERSION AS OF 5`,
    explanation: 'RESTORE TABLE orders TO VERSION AS OF 5 creates a new commit version in the transaction log that restores the table state to version 5. Data files from version 5 are re-referenced without physically duplicating storage.',
    tieredHints: {
      apiSignature: 'RESTORE TABLE table_name TO VERSION AS OF version',
      skeleton: `-- ____ table to version
____ TABLE orders ____ ____ AS OF 5`,
    },
    hints: ['Use RESTORE TABLE table_name TO VERSION AS OF version_number'],
    tags: ['restore', 'delta', 'time-travel', 'recovery'],
    concepts: ['delta-time-travel', 'delta-acid', 'stream-checkpoint'],
  },

  {
    id: 'restore-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to restore Delta table "users" back to its state at timestamp "2024-01-15T10:00:00".`,
    starterCode: `-- Restore users table to timestamp\n`,
    testCases: [
      {
        input: 'users Delta table',
        expectedOutput: 'RESTORE TABLE users TO TIMESTAMP AS OF',
        description: 'Should restore to timestamp',
      },
    ],
    solution: `RESTORE TABLE users TO TIMESTAMP AS OF "2024-01-15T10:00:00"
-- OR
RESTORE users TO TIMESTAMP AS OF '2024-01-15T10:00:00'`,
    explanation: 'RESTORE TABLE supports TIMESTAMP AS OF "yyyy-MM-ddTHH:mm:ss". Delta resolves the commit version that was active at that timestamp and commits a new version restoring that data state.',
    tieredHints: {
      apiSignature: 'RESTORE TABLE table_name TO TIMESTAMP AS OF timestamp',
      skeleton: `-- ____ table to timestamp
____ TABLE users ____ ____ AS OF "2024-01-15T10:00:00"`,
    },
    hints: ['Use RESTORE TABLE table_name TO TIMESTAMP AS OF "timestamp"'],
    tags: ['restore', 'timestamp', 'delta', 'time-travel'],
    concepts: ['delta-time-travel', 'ps-datetime-fns', 'delta-acid'],
  },

  {
    id: 'restore-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to view the complete operational audit log and commit history of Delta table "transactions".

Expected Command Output Format:
\`\`\`text
+---------+-------------------+---------+-----------+-----------------------+
| version | timestamp         | userName| operation | operationParameters   |
+---------+-------------------+---------+-----------+-----------------------+
| 3       | 2024-01-15 10:05  | user_a  | RESTORE   | {"versionTo": 1}      |
| 2       | 2024-01-15 09:30  | user_b  | DELETE    | {"predicate": "id=5"} |
| 1       | 2024-01-15 09:00  | user_a  | WRITE     | {"mode": "Append"}    |
+---------+-------------------+---------+-----------+-----------------------+
\`\`\``,
    starterCode: `-- Inspect table commit history\n`,
    testCases: [
      {
        input: 'transactions Delta table',
        expectedOutput: 'DESCRIBE HISTORY transactions',
        description: 'Should show table history',
      },
    ],
    solution: `DESCRIBE HISTORY transactions`,
    explanation: 'DESCRIBE HISTORY returns table lineage and metadata changes (version, timestamp, userId, operation, parameters, metrics), allowing data engineers to identify specific commits for time travel or auditing.',
    tieredHints: {
      apiSignature: 'DESCRIBE HISTORY table_name',
      skeleton: `-- ____ table commit history
____ ____ transactions`,
    },
    hints: ['Use DESCRIBE HISTORY table_name'],
    tags: ['history', 'delta', 'time-travel', 'describe'],
    concepts: ['delta-time-travel', 'delta-acid', 'ps-dataframe-create'],
  },

  {
    id: 'constraint-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to add a CHECK constraint named "valid_salary" to Delta table "employees", enforcing that the "salary" column must be strictly greater than 0.`,
    starterCode: `-- Add CHECK constraint to employees table\n`,
    testCases: [
      {
        input: 'employees Delta table',
        expectedOutput: 'ALTER TABLE employees ADD CONSTRAINT valid_salary CHECK (salary > 0)',
        description: 'Should add CHECK constraint',
      },
    ],
    solution: `ALTER TABLE employees ADD CONSTRAINT valid_salary CHECK (salary > 0)`,
    explanation: 'ALTER TABLE table_name ADD CONSTRAINT constraint_name CHECK (condition) enforces data quality at write time. Any INSERT or UPDATE violating the expression is rejected with an exception.',
    tieredHints: {
      apiSignature: 'ALTER TABLE table_name ADD CONSTRAINT name CHECK (condition)',
      skeleton: `____ TABLE employees ____ ____ valid_salary ____ (salary > 0)`,
    },
    hints: ['Use ALTER TABLE table_name ADD CONSTRAINT name CHECK (expression)'],
    tags: ['constraint', 'check', 'delta', 'data-quality'],
    concepts: ['delta-constraints', 'delta-acid', 'dlt-expectations'],
  },

  {
    id: 'constraint-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to enforce a NOT NULL constraint on column "email" in Delta table "users".`,
    starterCode: `-- Enforce NOT NULL constraint on email column\n`,
    testCases: [
      {
        input: 'users Delta table',
        expectedOutput: 'ALTER TABLE users ALTER COLUMN email SET NOT NULL',
        description: 'Should add NOT NULL',
      },
    ],
    solution: `ALTER TABLE users ALTER COLUMN email SET NOT NULL`,
    explanation: 'ALTER TABLE users ALTER COLUMN email SET NOT NULL verifies existing data for NULLs and prevents any future writes containing NULL values in the email column.',
    tieredHints: {
      apiSignature: 'ALTER TABLE table_name ALTER COLUMN col_name SET NOT NULL',
      skeleton: `____ TABLE users ____ ____ email ____ ____ ____`,
    },
    hints: ['Use ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL'],
    tags: ['constraint', 'not-null', 'delta', 'data-quality'],
    concepts: ['delta-constraints', 'delta-acid', 'dlt-expectations'],
  },

  {
    id: 'constraint-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to drop the CHECK constraint named "valid_salary" from Delta table "employees".`,
    starterCode: `-- Drop constraint from employees table\n`,
    testCases: [
      {
        input: 'employees table with constraint',
        expectedOutput: 'ALTER TABLE employees DROP CONSTRAINT valid_salary',
        description: 'Should drop constraint',
      },
    ],
    solution: `ALTER TABLE employees DROP CONSTRAINT valid_salary`,
    explanation: 'ALTER TABLE table_name DROP CONSTRAINT constraint_name removes an existing CHECK constraint from the table metadata without altering historical data files.',
    tieredHints: {
      apiSignature: 'ALTER TABLE table_name DROP CONSTRAINT name',
      skeleton: `____ TABLE employees ____ ____ valid_salary`,
    },
    hints: ['Use ALTER TABLE table_name DROP CONSTRAINT constraint_name'],
    tags: ['constraint', 'drop', 'delta'],
    concepts: ['delta-constraints', 'ps-distinct-drop-dup', 'delta-acid'],
  },

  {
    id: 'constraint-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'Which constraint types are actively enforced at write time by Delta Lake?',
    options: [
      { id: 'a', text: 'NOT NULL constraints on individual columns, and CHECK constraints for arbitrary table-level boolean rules.', isCorrect: true },
      { id: 'b', text: 'PRIMARY KEY and FOREIGN KEY constraints, which are actively enforced during all concurrent micro-batch writes.', isCorrect: false },
      { id: 'c', text: 'UNIQUE index constraints only, requiring explicit Z-Ordering to detect duplicate key violations prior to commit.', isCorrect: false },
      { id: 'd', text: 'No write-time constraints are supported; all validation rules must be applied via Delta Live Tables expectations.', isCorrect: false },
    ],
    explanation: 'Delta Lake actively enforces NOT NULL and CHECK constraints at write time. Informational PRIMARY KEY and FOREIGN KEY constraints exist in Unity Catalog for query planning but are not enforced on write.',
    tags: ['constraint', 'types', 'delta', 'data-quality'],
    concepts: ['delta-constraints', 'delta-acid', 'dlt-expectations'],
  },

  // =====================================================================
  // SQL SUBQUERIES - Correlated, EXISTS, IN (8 questions)
  // =====================================================================

  {
    id: 'subq-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), find all employees whose salary is above the company-wide average salary.\n\nRecall: aggregate functions like AVG() cannot be used directly in a WHERE clause — WHERE filters rows before aggregation. You need a scalar subquery (a subquery that returns a single value) to compute the average first.',
    starterCode: `-- Subquery in WHERE\n-- Hint: WHERE salary > AVG(salary) won't work\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'WHERE salary > (SELECT AVG(salary) FROM employees)',
        description: 'Should use scalar subquery',
      },
    ],
    solution: `SELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)`,
    explanation: 'A scalar subquery returns a single value. (SELECT AVG(salary) FROM employees) computes the average once, and the outer query filters every row against that number. This is necessary because WHERE cannot use aggregate functions directly.',
    tieredHints: {
      apiSignature: 'WHERE col operator (SELECT agg_fn(col) FROM table)',
      skeleton: `SELECT * FROM employees
WHERE salary > (____ ____(salary) ____ ____)`,
    },
    hints: ['WHERE salary > AVG(salary) fails — aggregates can\'t go in WHERE', 'Use (SELECT AVG(salary) FROM employees) as a scalar subquery', 'The outer query compares each row\'s salary against that single number'],
    tags: ['subquery', 'scalar', 'where', 'sql'],
    concepts: ['sql-subqueries', 'ps-select-filter'],
  },

  {
    id: 'subq-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), find employees whose salary is above the average salary OF THEIR OWN department using a correlated subquery.\n\nA correlated subquery references the outer query — it runs once per row. Use table aliases (e1, e2) to distinguish the outer and inner references to the same table.',
    starterCode: `-- Correlated subquery\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department)',
        description: 'Should use correlated subquery',
      },
    ],
    solution: `SELECT * FROM employees e1\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees e2\n  WHERE e2.department = e1.department\n)`,
    explanation: 'A correlated subquery references the outer query (e1.department). It executes once per row in the outer query, comparing each employee\'s salary to their own department\'s average. Use table aliases to distinguish outer vs inner references.',
    tieredHints: {
      apiSignature: 'WHERE col > (SELECT AVG(col) FROM t2 WHERE t2.fk = t1.pk)',
      skeleton: `SELECT * FROM employees e1
WHERE salary > (
  SELECT ____(____)
  FROM ____ e2
  ____ e2.____ = e1.____
)`,
    },
    hints: ['The inner query references the outer query\'s row', 'Use aliases: e1 for outer, e2 for inner', 'Filter inner by e2.department = e1.department'],
    tags: ['subquery', 'correlated', 'sql', 'advanced'],
    concepts: ['sql-subqueries'],
  },

  {
    id: 'subq-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "orders" table (columns: id, customer_id, amount) and "customers" table (columns: id, customer_name, country), find all customers who have placed at least one order using IN with a subquery.',
    starterCode: `-- Subquery with IN\n`,
    testCases: [
      {
        input: 'orders and customers tables',
        expectedOutput: 'WHERE id IN (SELECT customer_id FROM orders)',
        description: 'Should use IN subquery',
      },
    ],
    solution: `SELECT * FROM customers\nWHERE id IN (SELECT customer_id FROM orders)`,
    explanation: 'IN with a subquery checks if a value exists in the subquery result set. It is equivalent to a semi join. For large datasets, EXISTS is often more efficient than IN.',
    tieredHints: {
      apiSignature: 'WHERE col IN (SELECT col2 FROM table2)',
      skeleton: `SELECT * FROM customers
WHERE id ____ (____ ____ ____ ____)`,
    },
    hints: ['Use WHERE column IN (SELECT ...)', 'The subquery returns a list of values'],
    tags: ['subquery', 'in', 'sql'],
    concepts: ['sql-subqueries'],
  },

  {
    id: 'subq-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "products" table (columns: id, product_name, category) and "order_items" table (columns: order_id, product_id, quantity), find all products that have NEVER been ordered using NOT IN.\n\nIMPORTANT: If the subquery can return NULL values, NOT IN returns no rows at all. Always filter NULLs in the subquery with WHERE product_id IS NOT NULL.',
    starterCode: `-- Products never ordered\n`,
    testCases: [
      {
        input: 'products and order_items tables',
        expectedOutput: 'WHERE id NOT IN (SELECT product_id FROM order_items)',
        description: 'Should use NOT IN',
      },
    ],
    solution: `SELECT * FROM products\nWHERE id NOT IN (SELECT product_id FROM order_items WHERE product_id IS NOT NULL)`,
    explanation: 'NOT IN returns rows where the value is not in the subquery result. IMPORTANT: if the subquery returns any NULL values, NOT IN returns no rows at all. Always filter NULLs in the subquery or use NOT EXISTS instead.',
    tieredHints: {
      apiSignature: 'WHERE col NOT IN (SELECT col2 FROM table2 WHERE col2 IS NOT NULL)',
      skeleton: `SELECT * FROM products
WHERE id ____ ____ (SELECT ____ FROM ____ WHERE ____ ____ ____ ____)`,
    },
    hints: ['Use WHERE column NOT IN (SELECT ...)', 'Filter NULLs in the subquery to avoid empty results'],
    tags: ['subquery', 'not-in', 'sql'],
    concepts: ['sql-subqueries'],
  },

  {
    id: 'subq-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "departments" table (columns: id, dept_name) and "employees" table (columns: id, emp_name, department_id, salary), find departments that have NO employees using NOT EXISTS.\n\nNOT EXISTS returns TRUE when the correlated subquery returns zero rows. Unlike NOT IN, it handles NULLs correctly.',
    starterCode: `-- Empty departments\n`,
    testCases: [
      {
        input: 'departments and employees tables',
        expectedOutput: 'WHERE NOT EXISTS (SELECT 1 FROM employees WHERE ...)',
        description: 'Should use NOT EXISTS',
      },
    ],
    solution: `SELECT * FROM departments d\nWHERE NOT EXISTS (\n  SELECT 1 FROM employees e\n  WHERE e.department_id = d.id\n)`,
    explanation: 'NOT EXISTS returns TRUE if the correlated subquery returns zero rows. It is the SQL equivalent of an anti join. Unlike NOT IN, NOT EXISTS handles NULLs correctly and is often more efficient.',
    tieredHints: {
      apiSignature: 'WHERE NOT EXISTS (SELECT 1 FROM table2 WHERE t2.fk = t1.pk)',
      skeleton: `SELECT * FROM departments d
____ ____ ____ (
  SELECT 1 FROM ____ e
  WHERE e.____ = d.id
)`,
    },
    hints: ['Use WHERE NOT EXISTS (correlated subquery)', 'Safer than NOT IN with nullable columns'],
    tags: ['subquery', 'not-exists', 'anti-join', 'sql'],
    concepts: ['sql-subqueries', 'sql-joins-semi-anti'],
  },

  {
    id: 'subq-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_SUBQUERIES,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), find the top earner in each department using a subquery in FROM (a derived table).\n\nA derived table is a subquery in the FROM clause that you give an alias. Use ROW_NUMBER() to rank employees within each department, then filter to rank 1 in the outer query.',
    starterCode: `-- Derived table subquery\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'FROM (SELECT ... ROW_NUMBER() ...) WHERE rn = 1',
        description: 'Should use derived table',
      },
    ],
    solution: `SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn\n  FROM employees\n) ranked\nWHERE rn = 1`,
    explanation: 'A subquery in FROM creates a derived table (inline view). Here we use ROW_NUMBER() inside the subquery to rank employees per department, then filter to keep only rank 1 in the outer query.',
    tieredHints: {
      apiSignature: 'SELECT * FROM (SELECT cols, ROW_NUMBER() OVER (...) as rn FROM table) alias WHERE rn = 1',
      skeleton: `SELECT * FROM (
  SELECT *, ____() OVER (____ BY department ____ BY salary DESC) as rn
  FROM ____
) ranked
WHERE rn = 1`,
    },
    hints: ['Use a subquery in FROM with an alias', 'ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) for ranking'],
    tags: ['subquery', 'derived-table', 'row-number', 'sql'],
    concepts: ['sql-subqueries', 'sql-window-ranking'],
  },

  // =====================================================================
  // CROSS JOINS & REPARTITION (6 questions)
  // =====================================================================

  {
    id: 'crossjoin-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to perform a cross join between DataFrame "sizes_df" (columns: size) and "colors_df" (columns: color) to compute all size-color combinations.',
    starterCode: `# Cross join sizes_df and colors_df\nresult = `,
    testCases: [
      {
        input: 'sizes_df and colors_df',
        expectedOutput: 'sizes_df.crossJoin(colors_df)',
        description: 'Should cross join',
      },
    ],
    solution: `result = sizes_df.crossJoin(colors_df)
# OR
result = sizes_df.join(colors_df, how="cross")`,
    explanation: 'crossJoin() generates a Cartesian product of both DataFrames (N × M rows). Alternatively, pass how="cross" to join().',
    tieredHints: {
      apiSignature: 'DataFrame.crossJoin(other: DataFrame) -> DataFrame',
      skeleton: `-- ____ cross join
result = sizes_df.____(colors_df)
-- ____`,
    },
    hints: ['Use sizes_df.crossJoin(colors_df)', 'Or use sizes_df.join(colors_df, how="cross")'],
    tags: ['cross-join', 'cartesian', 'join'],
    concepts: ['sql-joins-cross-self', 'sql-joins-inner-outer'],
  },

  {
    id: 'crossjoin-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "dates" table (columns: cal_date) and "stores" table (columns: store_id, store_name), generate all date-store combinations using a cross join in SQL.',
    starterCode: `-- All date-store combinations\n`,
    testCases: [
      {
        input: 'dates and stores tables',
        expectedOutput: 'CROSS JOIN',
        description: 'Should cross join',
      },
    ],
    solution: `SELECT d.cal_date, s.store_id, s.store_name\nFROM dates d\nCROSS JOIN stores s\n-- OR\nSELECT cal_date, store_id, store_name\nFROM dates\nCROSS JOIN stores`,
    explanation: 'CROSS JOIN produces every combination of rows from both tables. Useful for generating scaffolding (all dates × all stores) that you then LEFT JOIN actual data onto to find gaps.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM t1 CROSS JOIN t2',
      skeleton: `-- ____ date-store combinations
SELECT d.cal_date, s.store_id, s.store_name
FROM ____ d
____ ____ ____ s`,
    },
    hints: ['Use CROSS JOIN between the tables', 'No ON clause needed'],
    tags: ['cross-join', 'sql', 'cartesian'],
    concepts: ['sql-joins-cross-self'],
  },

  {
    id: 'repart-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'In which scenario must you choose repartition() over coalesce() for DataFrame partition optimization?',
    options: [
      { id: 'a', text: 'Always choose repartition() because it outperforms coalesce() across all cluster operations.', isCorrect: false },
      { id: 'b', text: 'Use repartition() when increasing partitions or shuffling data evenly by key columns for joins.', isCorrect: true },
      { id: 'c', text: 'Use repartition() when reducing total partition count to write fewer output files to storage.', isCorrect: false },
      { id: 'd', text: 'Never use repartition() because coalesce() automatically handles all partition scaling needs.', isCorrect: false },
    ],
    explanation: 'repartition() performs a full shuffle to increase partition count or hash-repartition rows by column keys. coalesce() avoids shuffles and can only decrease partition count.',
    tags: ['repartition', 'coalesce', 'partitioning'],
    concepts: ['ps-partitioning', 'ps-null-handling'],
  },

  {
    id: 'repart-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to increase the number of partitions of DataFrame "df" from 10 to 100 for higher cluster parallelism.',
    starterCode: `# Increase partitions to 100\nresult = `,
    testCases: [
      {
        input: 'df with 10 partitions',
        expectedOutput: 'df.repartition(100)',
        description: 'Should repartition to 100',
      },
    ],
    solution: `result = df.repartition(100)`,
    explanation: 'repartition(n) triggers a full shuffle to redistribute data into n partitions (can increase or decrease count). coalesce(n) cannot increase partition count.',
    tieredHints: {
      apiSignature: 'DataFrame.repartition(numPartitions: int) -> DataFrame',
      skeleton: `-- ____ partitions to 100
result = ____.____(100)
-- ____`,
    },
    hints: ['Use df.repartition(100)', 'coalesce cannot increase partition count'],
    tags: ['repartition', 'partitioning', 'parallelism'],
    concepts: ['ps-partitioning', 'ps-shuffle'],
  },

  // =====================================================================
  // WINDOW FUNCTIONS - ntile, percent_rank, frame specs (8 questions)
  // =====================================================================

  {
    id: 'winfn-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'Three employees have salaries: 50000, 50000, 60000 (ordered ascending). What values do rank(), dense_rank(), and row_number() assign?',
    options: [
      { id: 'a', text: 'rank: 1,1,2 | dense_rank: 1,1,2 | row_number: 1,1,2 — assumes all functions treat ties identically', isCorrect: false },
      { id: 'b', text: 'rank: 1,2,3 | dense_rank: 1,1,2 | row_number: 1,1,3 — assumes rank increments sequentially without ties', isCorrect: false },
      { id: 'c', text: 'rank: 1,1,3 | dense_rank: 1,1,2 | row_number: 1,2,3 — rank skips after ties, dense_rank does not skip', isCorrect: true },
      { id: 'd', text: 'rank: 1,1,2 | dense_rank: 1,1,3 | row_number: 1,2,3 — reverses skip behavior between rank and dense_rank', isCorrect: false },
    ],
    explanation: 'rank() assigns the same rank to ties but skips the next position (1,1,3). dense_rank() assigns the same rank to ties but doesn\'t skip (1,1,2). row_number() always assigns unique sequential numbers regardless of ties (1,2,3) — the order of tied rows is nondeterministic.',
    tags: ['rank', 'dense-rank', 'row-number', 'window', 'comparison'],
    concepts: ['sql-window-ranking'],
  },

  {
    id: 'winfn-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Given a DataFrame "df" with columns "id", "emp_name", "department", and "salary", calculate the relative rank of each employee\'s salary within their department scaled between 0.0 (lowest) and 1.0 (highest). Store the output in a column named "pct_rank".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'percent_rank().over(Window.partitionBy("department").orderBy("salary"))',
        description: 'Should use percent_rank',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import percent_rank\n\nwindowSpec = Window.partitionBy("department").orderBy("salary")\nresult = df.withColumn("pct_rank", percent_rank().over(windowSpec))\n# OR\nfrom pyspark.sql.window import Window\nfrom pyspark.sql.functions import percent_rank, col\n\nwindowSpec = Window.partitionBy("department").orderBy(col("salary"))\nresult = df.withColumn("pct_rank", percent_rank().over(windowSpec))`,
    explanation: 'percent_rank() returns a value between 0 and 1 representing the relative rank: (rank - 1) / (total_rows - 1). The lowest value gets 0.0, the highest gets 1.0. Useful for percentile calculations.',
    tieredHints: {
      apiSignature: 'percent_rank().over(windowSpec: WindowSpec) -> Column',
      skeleton: `from pyspark.sql.window import Window
from pyspark.sql.functions import percent_rank

windowSpec = ____.____("____").____("____")
result = ____.____("____", ____().____(____))`,
    },
    hints: ['percent_rank() returns 0.0 to 1.0', 'Use partitionBy for within-group ranking'],
    tags: ['percent-rank', 'window', 'percentile'],
    concepts: ['sql-window-ranking', 'ps-aggregate-fns'],
  },

  {
    id: 'winfn-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_WINDOW_FUNCTIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: sale_date, amount), calculate a 7-day moving average of amount across a window frame containing the current row and the 6 preceding rows. Alias the resulting column as "moving_avg_7d".',
    starterCode: `-- 7-day moving average\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW',
        description: 'Should use window frame for moving average',
      },
    ],
    solution: `SELECT sale_date, amount, AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d FROM sales\n-- OR\nSELECT sale_date, amount, AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d FROM sales`,
    explanation: 'ROWS BETWEEN defines a window frame. "6 PRECEDING AND CURRENT ROW" includes the current row plus the 6 before it (7 rows total). This creates a rolling/moving average. RANGE BETWEEN uses logical ranges instead of row counts.',
    tieredHints: {
      apiSignature: 'AVG(col) OVER (ORDER BY date_col ROWS BETWEEN n PRECEDING AND CURRENT ROW)',
      skeleton: `SELECT sale_date, amount, ____(____) OVER (____ BY ____ ____ BETWEEN 6 PRECEDING AND ____ ROW) as ____ FROM ____`,
    },
    hints: ['Use ROWS BETWEEN n PRECEDING AND CURRENT ROW', '6 preceding + current = 7 rows'],
    tags: ['window-frame', 'rows-between', 'moving-average', 'sql'],
    concepts: ['sql-window-frame'],
  },

  {
    id: 'winfn-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_WINDOW_FUNCTIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "transactions" table (columns: id, account_id, amount, txn_date), calculate the cumulative sum of amount per account ordered chronologically by txn_date. Name the calculated column "cumulative_sum".',
    starterCode: `-- Cumulative sum per account\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
        description: 'Should calculate cumulative sum',
      },
    ],
    solution: `SELECT id, account_id, amount, txn_date, SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cumulative_sum FROM transactions\n-- OR\nSELECT id, account_id, amount, txn_date, SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_date) as cumulative_sum FROM transactions`,
    explanation: 'SUM() OVER (PARTITION BY ... ORDER BY ...) calculates a cumulative sum within each partition. The explicit frame ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW is actually the default when ORDER BY is present, so both versions produce the same result. Being explicit is clearer but not required.',
    tieredHints: {
      apiSignature: 'SUM(col) OVER (PARTITION BY p_col ORDER BY o_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
      skeleton: `SELECT id, account_id, amount, txn_date, ____(amount) OVER (____ BY account_id ____ BY txn_date ____ BETWEEN ____ PRECEDING AND ____ ROW) as ____ FROM ____`,
    },
    hints: ['Use SUM(amount) OVER (...) with PARTITION BY account_id', 'ORDER BY txn_date defines the accumulation order', 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW is optional — it is the default when ORDER BY is specified'],
    tags: ['window-frame', 'cumulative', 'running-total', 'sql'],
    concepts: ['sql-window-frame'],
  },

  {
    id: 'winfn-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'What is the difference between ROWS BETWEEN and RANGE BETWEEN in window frames?',
    options: [
      { id: 'a', text: 'ROWS operates on physical row offsets; RANGE operates on logical value ranges including tied values', isCorrect: true },
      { id: 'b', text: 'ROWS restricts calculations to integer values; RANGE expands calculations to handle float data types', isCorrect: false },
      { id: 'c', text: 'ROWS requires explicit partition keys; RANGE applies globally across all unpartitioned dataset rows', isCorrect: false },
      { id: 'd', text: 'ROWS and RANGE execute identical window evaluation logic but RANGE incurs lower memory overhead', isCorrect: false },
    ],
    explanation: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW always includes exactly 3 rows. RANGE BETWEEN 2 PRECEDING AND CURRENT ROW includes all rows whose ORDER BY value is within 2 of the current value — which could be more than 3 rows if there are ties.',
    tags: ['window-frame', 'rows', 'range', 'window'],
    concepts: ['sql-window-frame', 'sql-window-ranking'],
  },

  {
    id: 'winfn-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Given a DataFrame "df" with columns "id", "department", and "salary", project the lowest and highest salary values within each department ordered by salary into new columns "lowest_salary" and "highest_salary" respectively.',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'first("salary").over(...) and last("salary").over(...)',
        description: 'Should use first and last window functions',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import first, last\n\nwindowSpec = Window.partitionBy("department").orderBy("salary")\nresult = df.withColumn("lowest_salary", first("salary").over(windowSpec)).withColumn("highest_salary", last("salary").over(windowSpec))\n# OR\nfrom pyspark.sql.window import Window\nfrom pyspark.sql.functions import first, last, col\n\nwindowSpec = Window.partitionBy("department").orderBy(col("salary"))\nresult = df.withColumn("lowest_salary", first(col("salary")).over(windowSpec)).withColumn("highest_salary", last(col("salary")).over(windowSpec))`,
    explanation: 'first() returns the first value in the window frame. last() returns the last value. With ORDER BY salary, first gives the lowest and last gives the highest within each partition.',
    tieredHints: {
      apiSignature: 'first(col).over(windowSpec); last(col).over(windowSpec)',
      skeleton: `from pyspark.sql.window import Window
from pyspark.sql.functions import first, last

windowSpec = ____.____("____").____("____")
result = ____.____("____", ____("____").____(____)).____("____", ____("____").____(____))`,
    },
    hints: ['first() and last() are window functions', 'Apply .over(windowSpec)'],
    tags: ['first', 'last', 'window', 'aggregate'],
    concepts: ['ps-aggregate-fns', 'sql-window-offset', 'sql-window-ranking'],
  },

  // =====================================================================
  // STREAMING - State management, error handling (8 questions)
  // =====================================================================

  {
    id: 'stream-adv-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is stateful processing in Structured Streaming?',
    options: [
      { id: 'a', text: 'Processing execution that relies exclusively on the single current micro-batch payload without tracking history', isCorrect: false },
      { id: 'b', text: 'Operations maintaining intermediate state across micro-batches (aggregations, dedup, stream joins) using checkpoints and watermarks', isCorrect: true },
      { id: 'c', text: 'Persisting all incoming stream records in worker node RAM permanently to guarantee zero disk I/O overhead', isCorrect: false },
      { id: 'd', text: 'Restricting streaming query execution to a single dedicated driver node to simplify state coordination', isCorrect: false },
    ],
    explanation: 'Stateful operations keep track of data across batches. For example, a running count needs to remember previous counts. Spark stores this state in checkpoints. Watermarks help clean up old state to prevent unbounded growth.',
    tags: ['streaming', 'stateful', 'state-management'],
    concepts: ['stream-readstream-writestream', 'stream-stateful-aggs'],
  },

  {
    id: 'stream-adv-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'Why are watermarks necessary for streaming aggregations with event-time windows?',
    options: [
      { id: 'a', text: 'Watermarks automatically increase socket buffer limits to optimize cross-cluster network transfer speed', isCorrect: false },
      { id: 'b', text: 'Watermarks enforce strict schema validation rules on all incoming stream records before transformation', isCorrect: false },
      { id: 'c', text: 'Watermarks are required exclusively for file-based sources to detect directory file movement events', isCorrect: false },
      { id: 'd', text: 'Watermarks define how long to wait for late data before finalizing a window and dropping its state from memory', isCorrect: true },
    ],
    explanation: 'Without watermarks, Spark must keep state for ALL windows forever (memory grows unbounded). A watermark of "10 minutes" means: once the max event time advances past window_end + 10 min, that window is finalised and its state is dropped.',
    tags: ['streaming', 'watermark', 'state', 'event-time'],
    concepts: ['stream-readstream-writestream', 'stream-watermarks', 'stream-stateful-aggs'],
  },

  {
    id: 'stream-adv-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given streaming DataFrame "events_df" (columns: event_id, event_time, user_id, action), calculate event counts per user in 1-hour tumbling windows with a 15-minute watermark on "event_time". Store the result in "result".',
    starterCode: `result = events_df`,
    testCases: [
      {
        input: 'streaming events',
        expectedOutput: 'withWatermark and groupBy(window())',
        description: 'Should do windowed aggregation with watermark',
      },
    ],
    solution: `from pyspark.sql.functions import window, col\n\nresult = events_df.withWatermark("event_time", "15 minutes").groupBy(window(col("event_time"), "1 hour"), "user_id").count()\n# OR\nfrom pyspark.sql.functions import window\n\nresult = events_df.withWatermark("event_time", "15 minutes").groupBy(window("event_time", "1 hour"), "user_id").count()`,
    explanation: 'window(timeColumn, windowDuration) creates tumbling (non-overlapping) time windows. The watermark defines how long to wait for late data. Events arriving more than 15 minutes late are dropped from the aggregation.',
    tieredHints: {
      apiSignature: 'DataFrame.withWatermark(timeCol: str, delayThreshold: str).groupBy(window(timeCol, windowDuration), *cols)',
      skeleton: `from pyspark.sql.functions import window, col

result = ____.____("event_time", "15 minutes").____(____(col("____"), "1 hour"), "____").____()`,
    },
    hints: ['Apply withWatermark before groupBy', 'Pass window(col("event_time"), "1 hour") and "user_id" to groupBy'],
    tags: ['streaming', 'window', 'watermark', 'aggregation'],
    concepts: ['stream-readstream-writestream', 'sql-window-ranking', 'stream-watermarks', 'ps-groupby-agg'],
  },

  {
    id: 'stream-adv-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given streaming DataFrame "orders_df" (columns: order_id, event_time, amount), filter out duplicate records using column "order_id" with a 1-hour threshold on "event_time" to limit state retention. Store the result in "result".',
    starterCode: `result = orders_df`,
    testCases: [
      {
        input: 'streaming with duplicates',
        expectedOutput: '.withWatermark().dropDuplicates()',
        description: 'Should deduplicate with watermark',
      },
    ],
    solution: `result = orders_df.withWatermark("event_time", "1 hour").dropDuplicates(["order_id"])\n# OR\nresult = orders_df.withWatermark("event_time", "1 hour").dropDuplicates("order_id")`,
    explanation: 'dropDuplicates() in streaming is stateful — Spark remembers seen keys. The watermark limits how long it tracks old keys. Without a watermark, state grows unbounded. Events with the same order_id arriving within the watermark are deduped.',
    tieredHints: {
      apiSignature: 'DataFrame.withWatermark(timeCol: str, delayThreshold: str).dropDuplicates(subset: List[str] = None)',
      skeleton: `-- ____ deduplication with watermark
result = ____.____("event_time", "1 hour").____(["order_id"])`,
    },
    hints: ['Configure watermark on "event_time" before deduplicating', 'Pass "order_id" to dropDuplicates'],
    tags: ['streaming', 'dedup', 'watermark', 'stateful'],
    concepts: ['stream-readstream-writestream', 'ps-distinct-drop-dup', 'stream-watermarks', 'stream-stateful-aggs'],
  },

  {
    id: 'stream-adv-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What happens to a Structured Streaming job when it encounters corrupted or unparseable records in the source data?',
    options: [
      { id: 'a', text: 'By default it fails; options like PERMISSIVE mode or badRecordsPath allow handling corrupted rows gracefully', isCorrect: true },
      { id: 'b', text: 'Corrupted records are always silently skipped without logging warnings or raising runtime exceptions', isCorrect: false },
      { id: 'c', text: 'The stream automatically retries reading the corrupted payload indefinitely until manually cancelled', isCorrect: false },
      { id: 'd', text: 'Corrupted records are routed automatically to a default dead letter queue topic in cloud storage', isCorrect: false },
    ],
    explanation: 'Spark provides three parse modes: PERMISSIVE (default — puts corrupt data in a special column), DROPMALFORMED (silently drops bad rows), FAILFAST (throws exception). Use option("badRecordsPath", "/path") to redirect bad records for later analysis.',
    tags: ['streaming', 'error-handling', 'corrupt-records', 'parse-mode'],
    concepts: ['stream-readstream-writestream', 'ps-io-json'],
  },

  {
    id: 'stream-adv-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is a stream-stream join and what are its requirements?',
    options: [
      { id: 'a', text: 'Joining a live streaming DataFrame with a static lookup table stored in Delta Lake format', isCorrect: false },
      { id: 'b', text: 'Executing any standard relational equi-join between two arbitrary in-memory batch DataFrames', isCorrect: false },
      { id: 'c', text: 'Joining two live streaming DataFrames requiring watermarks on both sides and time-bound join constraints', isCorrect: true },
      { id: 'd', text: 'Merging two append-only stream queries without requiring event-time watermarks or checkpointing', isCorrect: false },
    ],
    explanation: 'Stream-stream joins match records from two live streams. Watermarks on both sides are required so Spark knows when old state can be cleaned up. Inner joins always work. Outer joins need time constraints (e.g., event time within 1 hour).',
    tags: ['streaming', 'stream-stream-join', 'watermark', 'stateful'],
    concepts: ['stream-readstream-writestream', 'stream-stream-join', 'stream-watermarks', 'stream-stateful-aggs'],
  },

  {
    id: 'stream-adv-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Join streaming DataFrame "impressions_df" (columns: ad_id, impression_time) with streaming DataFrame "clicks_df" (columns: ad_id, click_time) matching on "ad_id" where "click_time" occurs between "impression_time" and 1 hour after "impression_time". Both streams use 2-hour watermarks. Store the result in "result".',
    starterCode: `from pyspark.sql.functions import expr\n\n# Apply 2-hour watermarks to impressions_df and clicks_df, then join them on ad_id with time constraint\n`,
    testCases: [
      {
        input: 'two streaming DataFrames',
        expectedOutput: 'withWatermark on both, join with time condition',
        description: 'Should do stream-stream join with time constraint',
      },
    ],
    solution: `from pyspark.sql.functions import expr\n\nimpressions = impressions_df.withWatermark("impression_time", "2 hours")\nclicks = clicks_df.withWatermark("click_time", "2 hours")\n\nresult = impressions.join(clicks, expr("impressions.ad_id = clicks.ad_id AND click_time >= impression_time AND click_time <= impression_time + interval 1 hour"))\n# OR\nfrom pyspark.sql.functions import expr\n\nimpressions = impressions_df.withWatermark("impression_time", "2 hours")\nclicks = clicks_df.withWatermark("click_time", "2 hours")\n\nresult = impressions.join(clicks, expr("impressions.ad_id = clicks.ad_id AND click_time >= impression_time AND click_time <= impression_time + INTERVAL 1 HOUR"))`,
    explanation: 'Stream-stream joins require watermarks on both sides. The time constraint (click within 1 hour of impression) limits how long Spark must buffer unmatched records. Without time constraints, state grows unbounded.',
    tieredHints: {
      apiSignature: 'DataFrame.withWatermark(timeCol, delay).join(other, expr_condition)',
      skeleton: `from pyspark.sql.functions import expr

impressions = ____.____("____", "2 hours")
clicks = ____.____("____", "2 hours")

result = ____.____(____, ____("____.ad_id = clicks.ad_id AND click_time >= impression_time AND click_time <= impression_time + interval 1 hour"))`,
    },
    hints: ['Use expr to build the join condition matching ad_id and time bounds', 'Join impressions with clicks using the time interval condition'],
    tags: ['streaming', 'stream-stream-join', 'time-constraint'],
    concepts: ['stream-readstream-writestream', 'stream-stream-join'],
  },

  {
    id: 'stream-adv-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is the difference between a stream-static join and a stream-stream join?',
    options: [
      { id: 'a', text: 'Stream-static joins combine two batch DataFrames; stream-stream joins combine a stream with a static lookup table', isCorrect: false },
      { id: 'b', text: 'Stream-static joins a stream with a static table (no watermarks needed); stream-stream joins two live streams (watermarks required)', isCorrect: true },
      { id: 'c', text: 'Stream-static joins require complex state management; stream-stream joins require zero checkpointing overhead', isCorrect: false },
      { id: 'd', text: 'Stream-static and stream-stream joins execute identical physical plans without difference in state retention', isCorrect: false },
    ],
    explanation: 'Stream-static joins are simpler: the static DataFrame is like a lookup table that gets joined with each streaming micro-batch. No state management or watermarks needed. Stream-stream is more complex as both sides are continuously changing.',
    tags: ['streaming', 'stream-static', 'stream-stream', 'join'],
    concepts: ['stream-readstream-writestream', 'stream-stream-join', 'sql-joins-inner-outer'],
  },
];
