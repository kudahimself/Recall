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
    question: 'Read a CSV file from "/data/employees.csv" into a DataFrame with headers and schema inference enabled.',
    starterCode: `# Read CSV file\ndf = spark.read`,
    testCases: [
      {
        input: 'CSV file with headers',
        expectedOutput: '.format("csv").option("header", "true").option("inferSchema", "true").load()',
        description: 'Should read CSV with header and inferSchema',
      },
    ],
    solution: `df = spark.read.format("csv").option("header", "true").option("inferSchema", "true").load("/data/employees.csv")\n# OR\ndf = spark.read.csv("/data/employees.csv", header=True, inferSchema=True)`,
    explanation: 'header=True treats the first row as column names. inferSchema=True auto-detects data types (slower but convenient). In production, prefer explicit schemas for reliability.',
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
    question: 'Write DataFrame "df" to a Parquet file at "/output/employees.parquet" in overwrite mode.',
    starterCode: `# Write to Parquet\ndf.write`,
    testCases: [
      {
        input: 'DataFrame to write',
        expectedOutput: '.format("parquet").mode("overwrite").save()',
        description: 'Should write Parquet in overwrite mode',
      },
    ],
    solution: `df.write.format("parquet").mode("overwrite").save("/output/employees.parquet")\n# OR\ndf.write.parquet("/output/employees.parquet", mode="overwrite")`,
    explanation: 'Parquet is a columnar format that provides efficient compression and encoding. mode("overwrite") replaces existing data. Other modes: "append", "error" (default), "ignore".',
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
    question: 'Read a JSON file from "/data/events.json" into a DataFrame.',
    starterCode: `# Read JSON file\ndf = spark.read`,
    testCases: [
      {
        input: 'JSON file',
        expectedOutput: 'spark.read.json() or spark.read.format("json")',
        description: 'Should read JSON file',
      },
    ],
    solution: `df = spark.read.json("/data/events.json")\n# OR\ndf = spark.read.format("json").load("/data/events.json")`,
    explanation: 'Spark can read single-line and multi-line JSON. Schema is inferred by default. For multi-line JSON objects, use option("multiLine", "true").',
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
    question: 'Read a Delta table called "sales" using spark.read.',
    starterCode: `# Read Delta table\ndf = spark.read`,
    testCases: [
      {
        input: 'Delta table',
        expectedOutput: 'spark.read.format("delta").table("sales") or spark.table("sales")',
        description: 'Should read Delta table',
      },
    ],
    solution: `df = spark.read.table("sales")\n# OR\ndf = spark.read.format("delta").table("sales")`,
    explanation: 'spark.table("name") reads a registered table. For path-based Delta: spark.read.format("delta").load("/path/to/delta"). Tables registered in the metastore can be read by name.',
    hints: ['Use spark.table() or spark.read.format("delta")'],
    tags: ['delta', 'read', 'io', 'file-formats'],
    concepts: ['delta-acid', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Write DataFrame "df" to a Delta table called "output_sales" in append mode.',
    starterCode: `# Write to Delta table\ndf.write`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: '.format("delta").mode("append").saveAsTable("output_sales")',
        description: 'Should write Delta in append mode',
      },
    ],
    solution: `df.write.format("delta").mode("append").saveAsTable("output_sales")`,
    explanation: 'saveAsTable() creates a managed table in the metastore. mode("append") adds data to existing table. Use .save("/path") for path-based tables instead.',
    hints: ['Use .format("delta").saveAsTable()', 'Set mode to "append"'],
    tags: ['delta', 'write', 'io', 'file-formats'],
    concepts: ['delta-acid', 'ps-write-modes', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    question: 'What are the four write modes available in Spark?',
    options: [
      { id: 'a', text: 'overwrite (replace), append (add), error/errorifexists (fail if exists, default), ignore (skip if exists)', isCorrect: true },
      { id: 'b', text: 'create, update, delete, merge', isCorrect: false },
      { id: 'c', text: 'insert, replace, truncate, drop', isCorrect: false },
      { id: 'd', text: 'write, read, append, overwrite', isCorrect: false },
    ],
    explanation: '"error" (default) throws an exception if data already exists. "overwrite" replaces it. "append" adds to it. "ignore" silently skips the write if data exists.',
    tags: ['write-modes', 'io', 'file-formats'],
    concepts: ['ps-write-modes', 'ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    question: 'Which file format is columnar, supports predicate pushdown, and is the default storage format for Delta Lake?',
    options: [
      { id: 'a', text: 'CSV', isCorrect: false },
      { id: 'b', text: 'Parquet', isCorrect: true },
      { id: 'c', text: 'JSON', isCorrect: false },
      { id: 'd', text: 'Avro', isCorrect: false },
    ],
    explanation: 'Parquet is a columnar format that supports efficient compression, predicate pushdown, and column pruning. Delta Lake stores data as Parquet files with an added transaction log. Avro is row-based (good for streaming), CSV/JSON are text-based (no native types).',
    tags: ['parquet', 'file-formats', 'columnar'],
    concepts: ['ps-io-parquet'],
  },

  {
    id: 'io-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Read a CSV file "/data/sales.csv" with a custom delimiter "|" (pipe-separated), headers enabled, and inferSchema.\n\nTwo valid approaches:\n- Chained: spark.read.format("csv").option("header", "true").option("delimiter", "|").option("inferSchema", "true").load(path)\n- Shorthand: spark.read.csv(path, header=True, inferSchema=True, sep="|")\n\nNote: the header parameter is singular "header" (not "headers"), and the delimiter can be set with "delimiter" or "sep".',
    starterCode: `# Read pipe-separated file\ndf = spark.read`,
    testCases: [
      {
        input: 'pipe-separated CSV',
        expectedOutput: '.option("delimiter", "|") or .option("sep", "|")',
        description: 'Should read with pipe delimiter',
      },
    ],
    solution: `df = spark.read.format("csv")\n  .option("header", "true")\n  .option("inferSchema", "true")\n  .option("delimiter", "|")\n  .load("/data/sales.csv")\n# OR\ndf = spark.read.csv("/data/sales.csv", header=True, inferSchema=True, sep="|")`,
    explanation: 'Both approaches are valid. The chained .option() style is more explicit and common in production. The shorthand .csv() style passes options as keyword arguments. The delimiter parameter is "header" (singular, not "headers"), and can be "delimiter" or "sep".',
    hints: ['Use option("delimiter", "|") or option("sep", "|") in chained style', 'Or use sep="|" as a keyword argument in spark.read.csv()', 'The parameter is "header" (singular), not "headers"'],
    tags: ['csv', 'delimiter', 'io', 'file-formats'],
    concepts: ['ps-io-csv', 'ps-io-parquet'],
  },

  {
    id: 'io-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.SQL,
    question: 'Create a Delta table "employees" by reading from a CSV file at "/data/employees.csv" using SQL.',
    starterCode: `-- Create table from CSV\n`,
    testCases: [
      {
        input: 'CSV file',
        expectedOutput: 'CREATE TABLE ... USING CSV',
        description: 'Should create table from CSV',
      },
    ],
    solution: `CREATE TABLE employees\nUSING CSV\nOPTIONS (header "true", inferSchema "true")\nLOCATION "/data/employees.csv"`,
    explanation: 'CREATE TABLE with USING specifies the data source format. OPTIONS passes format-specific settings. LOCATION points to the data files.',
    hints: ['Use CREATE TABLE with USING CSV', 'Set OPTIONS for header and inferSchema'],
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
    question: 'Define an explicit schema with StructType for a DataFrame with columns: id (integer), name (string), salary (double), and is_active (boolean).',
    starterCode: `# Import StructType, StructField, and the four needed pyspark.sql.types\n# Build schema = StructType([...]) listing id/name/salary/is_active with the right types\n`,
    testCases: [
      {
        input: 'Schema definition',
        expectedOutput: 'StructType with StructFields',
        description: 'Should define schema with correct types',
      },
    ],
    solution: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType, BooleanType\n\nschema = StructType([\n    StructField("id", IntegerType(), True),\n    StructField("name", StringType(), True),\n    StructField("salary", DoubleType(), True),\n    StructField("is_active", BooleanType(), True)\n])`,
    explanation: 'StructType defines a schema as a list of StructFields. Each StructField takes: column name, data type, and nullable (True/False). Explicit schemas are faster than inferSchema and ensure type safety.',
    hints: ['Use StructField(name, type, nullable)', 'IntegerType(), StringType(), DoubleType(), BooleanType()'],
    tags: ['schema', 'structtype', 'structfield', 'types'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'schema-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Read a CSV file "/data/users.csv" using an explicit schema instead of inferSchema. The schema should have: id (integer), name (string), email (string).',
    starterCode: `# Build an explicit StructType schema for id (Integer), name (String), email (String)
# Use spark.read.schema(schema).option("header", "true").csv("/data/users.csv") to load df
`,
    testCases: [
      {
        input: 'CSV with explicit schema',
        expectedOutput: 'spark.read.schema(schema).csv()',
        description: 'Should read with explicit schema',
      },
    ],
    solution: `from pyspark.sql.types import StructType, StructField, IntegerType, StringType\n\nschema = StructType([\n    StructField("id", IntegerType(), True),\n    StructField("name", StringType(), True),\n    StructField("email", StringType(), True)\n])\n\ndf = spark.read.schema(schema).option("header", "true").csv("/data/users.csv")`,
    explanation: 'Using .schema(schema) applies your explicit schema instead of inferring it. This is faster (no extra scan) and more reliable than inferSchema. Always use explicit schemas in production.',
    hints: ['Define StructType first, then pass to .schema()', 'Explicit schemas skip the inference scan'],
    tags: ['schema', 'read', 'csv', 'structtype'],
    concepts: ['ps-dataframe-create', 'ps-io-csv'],
  },

  {
    id: 'schema-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Define a schema using DDL string format for columns: id INT, name STRING, amount DOUBLE.',
    starterCode: `# DDL schema string\nschema = `,
    testCases: [
      {
        input: 'DDL string',
        expectedOutput: '"id INT, name STRING, amount DOUBLE"',
        description: 'Should define DDL schema string',
      },
    ],
    solution: `schema = "id INT, name STRING, amount DOUBLE"`,
    explanation: 'DDL strings are a compact way to define schemas: "col_name TYPE, ...". Supported types: INT, LONG, DOUBLE, FLOAT, STRING, BOOLEAN, DATE, TIMESTAMP, etc. Pass to .schema(ddl_string).',
    hints: ['Use "column_name TYPE" format', 'Separate columns with commas'],
    tags: ['schema', 'ddl', 'types'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'schema-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df", print the schema showing column names, types, and nullable info.',
    starterCode: `# Print schema\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.printSchema()',
        description: 'Should print schema',
      },
    ],
    solution: `df.printSchema()`,
    explanation: 'printSchema() displays the schema in a tree format showing column names, data types, and whether they are nullable. Use df.schema to get the schema as a StructType object.',
    hints: ['Use .printSchema() method'],
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
    question: 'Using DataFrame "df" (columns: id, name, salary), add a "salary_band" column: "High" if salary > 100000, "Medium" if salary > 50000, otherwise "Low".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with salary column',
        expectedOutput: 'when(col("salary") > 100000, "High").when(...).otherwise("Low")',
        description: 'Should create salary bands with when/otherwise',
      },
    ],
    solution: `from pyspark.sql.functions import when, col\n\nresult = df.withColumn("salary_band",\n    when(col("salary") > 100000, "High")\n    .when(col("salary") > 50000, "Medium")\n    .otherwise("Low")\n)`,
    explanation: 'when(condition, value) is PySpark\'s equivalent of CASE/WHEN. Chain multiple .when() for elif logic. End with .otherwise() for the default value (like ELSE).',
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
    question: 'Using the "orders" table (columns: id, amount, status), write a query that adds a "size" column: "Large" if amount > 1000, "Medium" if amount > 100, otherwise "Small".',
    starterCode: `-- CASE/WHEN query\nSELECT *,\n  CASE`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'CASE WHEN amount > 1000 THEN "Large" ...',
        description: 'Should use CASE/WHEN',
      },
    ],
    solution: `SELECT *,\n  CASE\n    WHEN amount > 1000 THEN "Large"\n    WHEN amount > 100 THEN "Medium"\n    ELSE "Small"\n  END AS size\nFROM orders`,
    explanation: 'SQL CASE/WHEN is the standard way to add conditional logic. WHEN conditions are evaluated in order — first match wins. ELSE provides the default. END closes the expression.',
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
    question: 'Using DataFrame "df" (columns: id, name, age), add an "age_group" column: "Minor" if age < 18, "Adult" if age < 65, otherwise "Senior".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with age column',
        expectedOutput: 'when(col("age") < 18, "Minor").when(...).otherwise("Senior")',
        description: 'Should categorize by age',
      },
    ],
    solution: `from pyspark.sql.functions import when, col\n\nresult = df.withColumn("age_group",\n    when(col("age") < 18, "Minor")\n    .when(col("age") < 65, "Adult")\n    .otherwise("Senior")\n)`,
    explanation: 'Conditions are checked in order. Since we check < 18 first, the second .when(< 65) only applies to ages 18-64. Always order conditions from most specific to least specific.',
    hints: ['Order conditions from most specific to least', 'First matching condition wins'],
    tags: ['when', 'otherwise', 'conditional'],
    concepts: ['ps-when-otherwise'],
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
    solution: `SELECT emp_name, department, salary,\n  CASE\n    WHEN department = "Engineering" THEN salary * 0.2\n    WHEN department = "Sales" THEN salary * 0.15\n    ELSE salary * 0.1\n  END AS bonus\nFROM employees`,
    explanation: 'CASE/WHEN can include calculations, not just static values. The result expression after THEN can be any valid SQL expression including arithmetic on other columns.',
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
    question: 'Using the "employees" table (columns: id, name, department, salary), write a CTE called "dept_avg" that calculates average salary per department, then select departments where avg salary > 60000.',
    starterCode: `-- CTE query\nWITH`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'WITH dept_avg AS (SELECT ... GROUP BY) SELECT ... WHERE',
        description: 'Should use CTE with WITH clause',
      },
    ],
    solution: `WITH dept_avg AS (\n  SELECT department, AVG(salary) as avg_salary\n  FROM employees\n  GROUP BY department\n)\nSELECT * FROM dept_avg WHERE avg_salary > 60000`,
    explanation: 'CTEs (WITH clause) create named temporary result sets that exist only for the duration of the query. They improve readability over subqueries and can be referenced multiple times.',
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
    question: 'Write a query with two CTEs: "active_orders" (orders where order_status = "active" from "orders" table with columns: id, customer_id, amount, order_status) and "customer_totals" (sum of amount per customer_id from active_orders). Select customers with total > 5000.',
    starterCode: `-- Multiple CTEs\nWITH`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'WITH cte1 AS (...), cte2 AS (...) SELECT ...',
        description: 'Should chain multiple CTEs',
      },
    ],
    solution: `WITH active_orders AS (\n  SELECT * FROM orders WHERE order_status = "active"\n),\ncustomer_totals AS (\n  SELECT customer_id, SUM(amount) as total\n  FROM active_orders\n  GROUP BY customer_id\n)\nSELECT * FROM customer_totals WHERE total > 5000`,
    explanation: 'Multiple CTEs are separated by commas. Later CTEs can reference earlier ones. This creates a readable pipeline of transformations.',
    hints: ['Separate CTEs with commas', 'Later CTEs can reference earlier ones'],
    tags: ['cte', 'with', 'multiple', 'sql'],
    concepts: ['sql-cte'],
  },

  {
    id: 'cte-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    question: 'What is the advantage of using CTEs (WITH clause) over subqueries?',
    options: [
      { id: 'a', text: 'CTEs are faster than subqueries', isCorrect: false },
      { id: 'b', text: 'CTEs persist data to disk', isCorrect: false },
      { id: 'c', text: 'CTEs are more readable, can be referenced multiple times in the same query, and make complex queries easier to maintain', isCorrect: true },
      { id: 'd', text: 'CTEs can only be used with Delta tables', isCorrect: false },
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
    question: 'Create a Python UDF called "reverse_string" that reverses a string, register it, and use it to add a "reversed_name" column to DataFrame "df" (columns: id, name).',
    starterCode: ``,
    testCases: [
      {
        input: 'df with name column',
        expectedOutput: 'udf(lambda, StringType) or @udf decorator',
        description: 'Should create and apply UDF',
      },
    ],
    solution: `from pyspark.sql.functions import udf\nfrom pyspark.sql.types import StringType\n\nreverse_string = udf(lambda s: s[::-1] if s else None, StringType())\n\nresult = df.withColumn("reversed_name", reverse_string(df.name))`,
    explanation: 'udf(function, return_type) creates a User Defined Function. The function is serialised and sent to executors. Always handle None/null values in your UDF. UDFs are slower than built-in functions due to JVM-Python serialisation.',
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
    question: 'Register a Python function "classify_amount" as a SQL UDF that returns "High" for amounts > 1000 and "Low" otherwise, then use it in a SQL query on the "transactions" table (columns: id, amount).',
    starterCode: `# Register UDF for SQL use\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'spark.udf.register() and spark.sql()',
        description: 'Should register UDF for SQL',
      },
    ],
    solution: `def classify_amount(amount):\n    return "High" if amount and amount > 1000 else "Low"\n\nspark.udf.register("classify_amount", classify_amount, StringType())\n\nresult = spark.sql("SELECT id, amount, classify_amount(amount) as category FROM transactions")`,
    explanation: 'spark.udf.register(name, function, return_type) registers a UDF for use in SQL queries. The registered name can then be called like a built-in function in spark.sql() statements.',
    hints: ['Use spark.udf.register(name, func, type)', 'Then use the name in SQL queries'],
    tags: ['udf', 'register', 'sql', 'custom-function'],
    concepts: ['ps-udf-pandas-udf', 'sql-temp-views'],
  },

  {
    id: 'udf-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    question: 'What is a Pandas UDF (vectorised UDF) and why is it faster than a regular Python UDF?',
    options: [
      { id: 'a', text: 'It runs on the GPU', isCorrect: false },
      { id: 'b', text: 'It skips null handling', isCorrect: false },
      { id: 'c', text: 'It only works with numeric data', isCorrect: false },
      { id: 'd', text: 'It processes data in Arrow batches (chunks of rows) instead of row-by-row, avoiding per-row JVM-Python serialisation overhead', isCorrect: true },
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
    question: 'Create a Pandas UDF that multiplies a column by 2 and apply it to the "price" column in DataFrame "df" (columns: id, product, price).',
    starterCode: ``,
    testCases: [
      {
        input: 'df with price column',
        expectedOutput: '@pandas_udf decorator with Series input/output',
        description: 'Should create and apply Pandas UDF',
      },
    ],
    solution: `import pandas as pd\nfrom pyspark.sql.functions import pandas_udf\nfrom pyspark.sql.types import DoubleType\n\n@pandas_udf(DoubleType())\ndef double_price(price: pd.Series) -> pd.Series:\n    return price * 2\n\nresult = df.withColumn("double_price", double_price(df.price))`,
    explanation: 'The @pandas_udf decorator creates a vectorised UDF. Input and output are pandas Series (for scalar UDFs). Operations on Series are vectorised and much faster than row-by-row processing.',
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
    question: 'Combine all rows from the "us_customers" table (columns: id, customer_name, email) and "eu_customers" table (same columns), removing duplicates.',
    starterCode: `-- Combine tables\n`,
    testCases: [
      {
        input: 'us_customers and eu_customers',
        expectedOutput: 'SELECT * FROM us_customers UNION SELECT * FROM eu_customers',
        description: 'Should UNION two tables',
      },
    ],
    solution: `SELECT * FROM us_customers\nUNION\nSELECT * FROM eu_customers`,
    explanation: 'UNION combines results from two queries and removes duplicates. Both queries must have the same number of columns with compatible types.',
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
    question: 'Combine all rows from "jan_sales" and "feb_sales" tables (both have columns: id, product, amount), keeping all rows including duplicates.',
    starterCode: `-- Combine keeping duplicates\n`,
    testCases: [
      {
        input: 'jan_sales and feb_sales',
        expectedOutput: 'UNION ALL',
        description: 'Should UNION ALL',
      },
    ],
    solution: `SELECT * FROM jan_sales\nUNION ALL\nSELECT * FROM feb_sales`,
    explanation: 'UNION ALL keeps all rows including duplicates. It is faster than UNION because it skips the deduplication step. Use UNION ALL when you know there are no duplicates or want to keep them.',
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
    question: 'Find customers who exist in both the "online_customers" and "store_customers" tables (both have columns: id, customer_name, email).',
    starterCode: `-- Find common customers\n`,
    testCases: [
      {
        input: 'online_customers and store_customers',
        expectedOutput: 'INTERSECT',
        description: 'Should use INTERSECT',
      },
    ],
    solution: `SELECT * FROM online_customers\nINTERSECT\nSELECT * FROM store_customers`,
    explanation: 'INTERSECT returns only rows that appear in both result sets. Useful for finding common records between two tables.',
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
    question: 'Find employees in the "all_employees" table (columns: id, emp_name, department) who are NOT in the "terminated_employees" table (same columns).',
    starterCode: `-- Find active employees\n`,
    testCases: [
      {
        input: 'all_employees and terminated_employees',
        expectedOutput: 'EXCEPT',
        description: 'Should use EXCEPT',
      },
    ],
    solution: `SELECT * FROM all_employees\nEXCEPT\nSELECT * FROM terminated_employees`,
    explanation: 'EXCEPT (also called MINUS in some databases) returns rows from the first query that are not in the second query. Order matters — it subtracts the second set from the first.',
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
    question: 'Using PySpark, combine DataFrames "df1" and "df2" (same schema: id, name, email), removing duplicates.',
    starterCode: `# Union DataFrames\nresult = df1.`,
    testCases: [
      {
        input: 'df1 and df2',
        expectedOutput: 'df1.union(df2).distinct() or df1.unionByName(df2)',
        description: 'Should union DataFrames',
      },
    ],
    solution: `result = df1.union(df2).distinct()\n# OR\nresult = df1.unionByName(df2).distinct()`,
    explanation: 'PySpark union() combines DataFrames by position (like UNION ALL — keeps duplicates). Add .distinct() to remove duplicates. unionByName() matches columns by name, not position — safer when column order might differ.',
    hints: ['union() is UNION ALL (keeps duplicates)', 'Add .distinct() for dedup', 'unionByName() matches by column name'],
    tags: ['union', 'distinct', 'pyspark', 'set-operations'],
    concepts: ['sql-set-operations', 'ps-distinct-drop-dup', 'ps-session-init'],
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
    question: 'Using DataFrame "df" (columns: year, quarter, revenue), pivot so each quarter (Q1, Q2, Q3, Q4) becomes its own column showing total revenue, grouped by year.\n\nPySpark pivot syntax: df.groupBy(group_col).pivot(pivot_col).agg(aggregate)\n\n1. groupBy("year") — one row per year\n2. pivot("quarter") — each distinct quarter value becomes a column\n3. sum("revenue") — the aggregation to fill each cell (required because multiple rows may map to one cell)',
    starterCode: `# Pivot: rows → columns\n# groupBy(group).pivot(pivot_col).agg()\nresult = df.groupBy("year").pivot(`,
    testCases: [
      {
        input: 'df with year, quarter, revenue',
        expectedOutput: '.groupBy("year").pivot("quarter").sum("revenue")',
        description: 'Should pivot quarters to columns',
      },
    ],
    solution: `result = df.groupBy("year").pivot("quarter").sum("revenue")`,
    explanation: 'pivot() rotates distinct values of the pivot column into separate columns. An aggregation is REQUIRED because multiple source rows may map to the same cell (e.g., two Q1 2024 entries). The result has one row per group and one column per pivot value. Without an agg, PySpark doesn\'t know how to combine duplicates.',
    hints: ['Chain: groupBy("year").pivot("quarter").sum("revenue")', 'An aggregation (sum, avg, max) is required after pivot()', 'Each distinct quarter value becomes a column header'],
    tags: ['pivot', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot'],
  },

  {
    id: 'pivot-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "monthly_sales" table (columns: product, sale_month, amount), pivot the data so each month becomes its own column with the sum of amount, grouped by product. The sale_month values are: "Jan", "Feb", "Mar", "Apr", "May", "Jun".\n\nPIVOT rotates row values into columns. The syntax is:\n  SELECT * FROM (source_query)\n  PIVOT (aggregate_function FOR pivot_column IN (value1, value2, ...))\n\nThe subquery must contain only the columns needed: the grouping column (product), the pivot column (sale_month), and the value column (amount). The IN clause lists the specific values of sale_month that become column headers.',
    starterCode: `-- Pivot months to columns\n-- Each sale_month value ("Jan", "Feb", ...) becomes a column\nSELECT * FROM (\n  SELECT product, sale_month, amount FROM monthly_sales\n)\nPIVOT (`,
    testCases: [
      {
        input: 'monthly_sales table',
        expectedOutput: 'PIVOT (SUM(amount) FOR sale_month IN (...))',
        description: 'Should pivot months to columns',
      },
    ],
    solution: `SELECT * FROM (\n  SELECT product, sale_month, amount FROM monthly_sales\n)\nPIVOT (\n  SUM(amount) FOR sale_month IN ("Jan", "Feb", "Mar", "Apr", "May", "Jun")\n)`,
    explanation: 'PIVOT transforms rows into columns. The aggregate (SUM) is applied for each value listed in the IN clause, creating one column per value. The subquery must only include the group column, pivot column, and value column — any extra columns would create unintended groupings.',
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
    starterCode: `-- Unpivot wide to long\nSELECT student, stack(`,
    testCases: [
      {
        input: 'wide_scores table',
        expectedOutput: 'stack(3, "math", math, "science", science, "english", english)',
        description: 'Should unpivot using stack',
      },
    ],
    solution: `SELECT student, stack(3, "math", math, "science", science, "english", english) AS (subject, score)\nFROM wide_scores`,
    explanation: 'stack(n, label1, col1, label2, col2, ...) converts n columns from wide format to long format. The first argument is the number of column pairs. Each pair is a label string and the column value.',
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
    question: 'Using DataFrame "df" (columns: region, product_type, total_sales), pivot on "product_type" to get one column per product type showing total sales, grouped by region. Limit pivot values to ["Electronics", "Clothing", "Food"] for performance.\n\nWhen the pivot column has many distinct values, specifying them explicitly avoids an extra pass over the data to discover them.',
    starterCode: `# Pivot with explicit values for performance\nresult = df.groupBy("region").pivot(`,
    testCases: [
      {
        input: 'df with region, product_type, total_sales',
        expectedOutput: '.pivot("product_type", ["Electronics", "Clothing", "Food"]).sum("total_sales")',
        description: 'Should pivot with explicit values',
      },
    ],
    solution: `result = df.groupBy("region").pivot("product_type", ["Electronics", "Clothing", "Food"]).sum("total_sales")`,
    explanation: 'Passing a list of values as the second argument to pivot() avoids an expensive extra scan to discover distinct values. This is a best practice for large datasets. Values not in the list are ignored.',
    hints: ['pivot(column, values_list) takes an optional second argument', 'Explicit values avoid an extra pass over the data', 'Values not in the list are silently ignored'],
    tags: ['pivot', 'performance', 'reshape', 'wide-format'],
    concepts: ['ps-pivot-unpivot', 'ps-cache-persist'],
  },

  {
    id: 'pivot-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employee_ratings" table (columns: emp_id, emp_name, q1_rating, q2_rating, q3_rating, q4_rating), unpivot it so each quarter becomes a row with columns: emp_id, emp_name, quarter, rating. Use the stack() function.\n\nstack(n, label1, col1, label2, col2, ...) converts n wide columns into rows. Here n=4 for the 4 quarters. Each pair is a string label and the column to read from.',
    starterCode: `-- Unpivot quarterly ratings to rows\nSELECT emp_id, emp_name, stack(`,
    testCases: [
      {
        input: 'employee_ratings table',
        expectedOutput: 'stack(4, "Q1", q1_rating, "Q2", q2_rating, "Q3", q3_rating, "Q4", q4_rating)',
        description: 'Should unpivot 4 quarters using stack',
      },
    ],
    solution: `SELECT emp_id, emp_name, stack(4, "Q1", q1_rating, "Q2", q2_rating, "Q3", q3_rating, "Q4", q4_rating) AS (quarter, rating)\nFROM employee_ratings`,
    explanation: 'stack(4, ...) creates 4 rows per input row, each with a label and the corresponding column value. The AS (quarter, rating) names the output columns. Non-pivoted columns (emp_id, emp_name) are carried along unchanged.',
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
    question: 'Using the "survey_responses" table (columns: respondent_id, question_text, response), pivot so each distinct question_text becomes its own column with the response value, grouped by respondent_id. The questions are: "Satisfaction", "Likelihood", "Effort".\n\nThis is the reverse of stack() — you are going from long format (one row per question) to wide format (one column per question).',
    starterCode: `-- Pivot survey responses: long to wide\nSELECT * FROM (\n  SELECT respondent_id, question_text, response FROM survey_responses\n)\nPIVOT (`,
    testCases: [
      {
        input: 'survey_responses table',
        expectedOutput: 'PIVOT (MAX(response) FOR question_text IN ("Satisfaction", "Likelihood", "Effort"))',
        description: 'Should pivot survey questions to columns',
      },
    ],
    solution: `SELECT * FROM (\n  SELECT respondent_id, question_text, response FROM survey_responses\n)\nPIVOT (\n  MAX(response) FOR question_text IN ("Satisfaction", "Likelihood", "Effort")\n)`,
    explanation: 'MAX(response) is used as the aggregate because each respondent has exactly one response per question — MAX just picks that single value. If there could be multiple responses, you might use FIRST() or collect_list(). The subquery limits to only the 3 needed columns to avoid unintended groupings.',
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
    question: 'Assume DataFrame `df` has columns `id` and `price`, where `price` is a string like `"29.99"`. Using `pyspark.sql.functions.col`, assign `result = df.withColumn("price", col("price").cast("double"))` to overwrite `price` with its double-typed version.',
    starterCode: `# Import col from pyspark.sql.functions\n# Assign result = df with the price column cast to double\n`,
    testCases: [
      {
        input: 'df with string price',
        expectedOutput: 'col("price").cast("double")',
        description: 'Should cast string to double',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nresult = df.withColumn("price", col("price").cast("double"))`,
    explanation: 'cast(type) converts a column to another data type. Type can be a string ("double", "int", "string", "date") or a type object (DoubleType()). Invalid values become null.',
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
    question: 'Using the "raw_data" table (columns: id, amount — where amount is stored as STRING), cast the amount column to DOUBLE in a SELECT query.',
    starterCode: `-- Cast string to double\n`,
    testCases: [
      {
        input: 'raw_data with string amount',
        expectedOutput: 'CAST(amount AS DOUBLE)',
        description: 'Should cast to double',
      },
    ],
    solution: `SELECT id, CAST(amount AS DOUBLE) as amount\nFROM raw_data`,
    explanation: 'CAST(column AS type) converts data types in SQL. Common types: INT, BIGINT, DOUBLE, FLOAT, STRING, DATE, TIMESTAMP, BOOLEAN. Use :: as shorthand in some contexts: amount::DOUBLE.',
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
    question: 'Using DataFrame "df" (columns: id, created_at — where created_at is a string like "2024-01-15"), cast "created_at" to DateType.',
    starterCode: `# Import col from pyspark.sql.functions\n# Overwrite created_at by casting it to a date type; assign to result\n`,
    testCases: [
      {
        input: 'df with string date',
        expectedOutput: 'col("created_at").cast("date")',
        description: 'Should cast string to date',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nresult = df.withColumn("created_at", col("created_at").cast("date"))`,
    explanation: 'Casting strings to dates works automatically with ISO format (yyyy-MM-dd). For custom formats, use to_date(col, format) instead of cast. For timestamps, use "timestamp" or to_timestamp().',
    hints: ['Use .cast("date") for ISO format strings', 'For custom formats use to_date()'],
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
    question: 'What is the difference between a transformation and an action in Spark?',
    options: [
      { id: 'a', text: 'Transformations are faster than actions', isCorrect: false },
      { id: 'b', text: 'Transformations are lazy (build a plan but don\'t execute). Actions trigger actual computation and return results.', isCorrect: true },
      { id: 'c', text: 'Actions are lazy and transformations execute immediately', isCorrect: false },
      { id: 'd', text: 'There is no difference', isCorrect: false },
    ],
    explanation: 'Transformations (select, filter, groupBy, join) are lazy — they just build a DAG of operations. Actions (show, count, collect, write) trigger the entire chain to execute. This lazy evaluation allows Spark to optimise the entire plan before executing.',
    tags: ['lazy', 'transformation', 'action', 'fundamentals'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture'],
  },

  {
    id: 'action-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_ACTIONS,
    question: 'Which of the following are actions (not transformations) in Spark?',
    options: [
      { id: 'a', text: 'select(), filter(), groupBy(), join()', isCorrect: false },
      { id: 'b', text: 'withColumn(), drop(), alias(), cast()', isCorrect: false },
      { id: 'c', text: 'show(), count(), collect(), take(), first(), write()', isCorrect: true },
      { id: 'd', text: 'orderBy(), distinct(), union(), limit()', isCorrect: false },
    ],
    explanation: 'Actions trigger computation: show() displays rows, count() returns the count, collect() brings all data to the driver, take(n) returns n rows, first() returns the first row, write() saves to storage. All others are lazy transformations.',
    tags: ['action', 'transformation', 'lazy', 'fundamentals'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture'],
  },

  {
    id: 'action-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_ACTIONS,
    question: 'Why should you avoid using collect() on large DataFrames?',
    options: [
      { id: 'a', text: 'collect() is deprecated', isCorrect: false },
      { id: 'b', text: 'collect() is slower than show()', isCorrect: false },
      { id: 'c', text: 'collect() only works with RDDs', isCorrect: false },
      { id: 'd', text: 'collect() brings ALL data to the driver node as a Python list, which can cause out-of-memory errors on large datasets', isCorrect: true },
    ],
    explanation: 'collect() transfers all rows from executors to the driver as a Python list. For millions of rows, this will crash the driver. Use show(n) to preview, take(n) to get a small sample, or write to a file for full results.',
    tags: ['collect', 'driver', 'memory', 'action'],
    concepts: ['ps-actions-vs-transforms', 'dbx-architecture', 'ps-cache-persist'],
  },

  {
    id: 'action-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_ACTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, emp_name, salary), display the first 5 rows in a formatted table, then get the total row count.',
    starterCode: `# Display and count\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.show(5) and df.count()',
        description: 'Should show and count',
      },
    ],
    solution: `df.show(5)\nrow_count = df.count()`,
    explanation: 'show(n) displays the first n rows in a formatted table (default 20). count() returns the total number of rows as an integer. Both are actions that trigger computation.',
    hints: ['show(n) displays rows', 'count() returns total rows'],
    tags: ['show', 'count', 'action', 'basics'],
    concepts: ['ps-actions-vs-transforms'],
  },

  {
    id: 'action-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_ACTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df", get the first row as a Row object, and get the first 3 rows as a list.',
    starterCode: `# Get rows\n`,
    testCases: [
      {
        input: 'DataFrame',
        expectedOutput: 'df.first() and df.take(3)',
        description: 'Should use first and take',
      },
    ],
    solution: `first_row = df.first()\nfirst_three = df.take(3)`,
    explanation: 'first() returns the first Row object (same as take(1)[0]). take(n) returns a list of n Row objects. Both bring data to the driver — use on small results only. head(n) is an alias for take(n).',
    hints: ['first() returns one Row', 'take(n) returns a list of n Rows'],
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
    question: 'Restore the "orders" Delta table to version 5 after an accidental bad write.',
    starterCode: `-- Restore to previous version\n`,
    testCases: [
      {
        input: 'orders Delta table',
        expectedOutput: 'RESTORE TABLE orders TO VERSION AS OF 5',
        description: 'Should restore to version 5',
      },
    ],
    solution: `RESTORE TABLE orders TO VERSION AS OF 5`,
    explanation: 'RESTORE TABLE undoes changes by reverting to a previous version. The data files from that version are used. A new version is created (the restore itself is a versioned operation). Works within the retention period.',
    hints: ['Use RESTORE TABLE name TO VERSION AS OF n'],
    tags: ['restore', 'delta', 'time-travel', 'recovery'],
    concepts: ['delta-time-travel', 'delta-acid', 'stream-checkpoint'],
  },

  {
    id: 'restore-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: 'Restore the "users" Delta table to how it was at timestamp "2024-01-15T10:00:00".',
    starterCode: `-- Restore to timestamp\n`,
    testCases: [
      {
        input: 'users Delta table',
        expectedOutput: 'RESTORE TABLE users TO TIMESTAMP AS OF',
        description: 'Should restore to timestamp',
      },
    ],
    solution: `RESTORE TABLE users TO TIMESTAMP AS OF "2024-01-15T10:00:00"`,
    explanation: 'RESTORE supports both VERSION AS OF and TIMESTAMP AS OF. Timestamp-based restore finds the version that was current at that point in time. Useful when you know when the bad change happened.',
    hints: ['Use RESTORE TABLE name TO TIMESTAMP AS OF'],
    tags: ['restore', 'timestamp', 'delta', 'time-travel'],
    concepts: ['delta-time-travel', 'ps-datetime-fns', 'delta-acid'],
  },

  {
    id: 'restore-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: 'View the full history of changes to the "transactions" Delta table.',
    starterCode: `-- View table history\n`,
    testCases: [
      {
        input: 'transactions Delta table',
        expectedOutput: 'DESCRIBE HISTORY transactions',
        description: 'Should show table history',
      },
    ],
    solution: `DESCRIBE HISTORY transactions`,
    explanation: 'DESCRIBE HISTORY shows all versions of a Delta table: version number, timestamp, operation type (WRITE, MERGE, DELETE, RESTORE), and user info. Use this to find the version you want to restore to.',
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
    question: 'Add a CHECK constraint called "valid_salary" to the "employees" Delta table that ensures salary is greater than 0.',
    starterCode: `-- Add check constraint\n`,
    testCases: [
      {
        input: 'employees Delta table',
        expectedOutput: 'ALTER TABLE employees ADD CONSTRAINT valid_salary CHECK (salary > 0)',
        description: 'Should add CHECK constraint',
      },
    ],
    solution: `ALTER TABLE employees ADD CONSTRAINT valid_salary CHECK (salary > 0)`,
    explanation: 'CHECK constraints enforce data quality at the table level. Any INSERT or UPDATE that violates the constraint will fail. Use DESCRIBE DETAIL to see existing constraints.',
    hints: ['Use ALTER TABLE ADD CONSTRAINT name CHECK (condition)'],
    tags: ['constraint', 'check', 'delta', 'data-quality'],
    concepts: ['delta-constraints', 'delta-acid', 'dlt-expectations'],
  },

  {
    id: 'constraint-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Add a NOT NULL constraint to the "email" column of the "users" Delta table.',
    starterCode: `-- Add NOT NULL constraint\n`,
    testCases: [
      {
        input: 'users Delta table',
        expectedOutput: 'ALTER TABLE users ALTER COLUMN email SET NOT NULL',
        description: 'Should add NOT NULL',
      },
    ],
    solution: `ALTER TABLE users ALTER COLUMN email SET NOT NULL`,
    explanation: 'SET NOT NULL prevents null values in the column. Any INSERT with a null email will fail. Use DROP NOT NULL to remove the constraint. Existing nulls must be fixed before adding the constraint.',
    hints: ['Use ALTER TABLE ALTER COLUMN column SET NOT NULL'],
    tags: ['constraint', 'not-null', 'delta', 'data-quality'],
    concepts: ['delta-constraints', 'delta-acid', 'dlt-expectations'],
  },

  {
    id: 'constraint-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Drop the CHECK constraint "valid_salary" from the "employees" Delta table.',
    starterCode: `-- Drop constraint\n`,
    testCases: [
      {
        input: 'employees table with constraint',
        expectedOutput: 'ALTER TABLE employees DROP CONSTRAINT valid_salary',
        description: 'Should drop constraint',
      },
    ],
    solution: `ALTER TABLE employees DROP CONSTRAINT valid_salary`,
    explanation: 'DROP CONSTRAINT removes a CHECK constraint. Existing data that violates the constraint is not affected — only future writes were enforced.',
    hints: ['Use ALTER TABLE DROP CONSTRAINT name'],
    tags: ['constraint', 'drop', 'delta'],
    concepts: ['delta-constraints', 'ps-distinct-drop-dup', 'delta-acid'],
  },

  {
    id: 'constraint-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What types of constraints does Delta Lake support?',
    options: [
      { id: 'a', text: 'NOT NULL constraints and CHECK constraints (arbitrary boolean expressions)', isCorrect: true },
      { id: 'b', text: 'Only PRIMARY KEY constraints', isCorrect: false },
      { id: 'c', text: 'Only FOREIGN KEY constraints', isCorrect: false },
      { id: 'd', text: 'No constraints are supported', isCorrect: false },
    ],
    explanation: 'Delta Lake supports NOT NULL (column-level) and CHECK constraints (table-level boolean expressions like "salary > 0"). Primary and foreign keys are informational only (not enforced) in Unity Catalog.',
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
    question: 'Using DataFrame "sizes_df" (columns: size — values S, M, L) and "colors_df" (columns: color — values Red, Blue, Green), create all possible size-color combinations using a cross join.',
    starterCode: `# Cross join for all combinations\nresult = sizes_df.`,
    testCases: [
      {
        input: 'sizes_df and colors_df',
        expectedOutput: 'sizes_df.crossJoin(colors_df)',
        description: 'Should cross join',
      },
    ],
    solution: `result = sizes_df.crossJoin(colors_df)`,
    explanation: 'crossJoin() produces a Cartesian product — every row from the left paired with every row from the right. 3 sizes × 3 colors = 9 rows. Use carefully on large DataFrames as the result grows multiplicatively.',
    hints: ['Use .crossJoin(other_df)', 'Result size = left rows × right rows'],
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
    solution: `SELECT d.cal_date, s.store_id, s.store_name\nFROM dates d\nCROSS JOIN stores s`,
    explanation: 'CROSS JOIN produces every combination of rows from both tables. Useful for generating scaffolding (all dates × all stores) that you then LEFT JOIN actual data onto to find gaps.',
    hints: ['Use CROSS JOIN between the tables', 'No ON clause needed'],
    tags: ['cross-join', 'sql', 'cartesian'],
    concepts: ['sql-joins-cross-self'],
  },

  {
    id: 'repart-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'When should you use repartition() instead of coalesce()?',
    options: [
      { id: 'a', text: 'Always — repartition is better than coalesce', isCorrect: false },
      { id: 'b', text: 'When you need to INCREASE the number of partitions, or redistribute data evenly by a column for downstream joins/aggregations', isCorrect: true },
      { id: 'c', text: 'When reducing partitions to save files', isCorrect: false },
      { id: 'd', text: 'Never — coalesce handles all cases', isCorrect: false },
    ],
    explanation: 'repartition() does a full shuffle, so it can increase or decrease partitions and redistribute data evenly. Use it when: (1) increasing partitions for parallelism, (2) repartitioning by a column before joins. Use coalesce() when only reducing partitions (no shuffle needed).',
    tags: ['repartition', 'coalesce', 'partitioning'],
    concepts: ['ps-partitioning', 'ps-null-handling'],
  },

  {
    id: 'repart-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "df" has 10 partitions but you need 100 for better parallelism. Increase the partitions to 100.',
    starterCode: `# Increase partitions\nresult = df.`,
    testCases: [
      {
        input: 'df with 10 partitions',
        expectedOutput: 'df.repartition(100)',
        description: 'Should repartition to 100',
      },
    ],
    solution: `result = df.repartition(100)`,
    explanation: 'repartition(n) increases or decreases partitions via a full shuffle. coalesce() cannot increase partitions — it only merges existing ones. Use repartition() when you need more partitions.',
    hints: ['coalesce cannot increase partitions', 'repartition does a full shuffle'],
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
      { id: 'a', text: 'All three return 1,1,2 for tied values', isCorrect: false },
      { id: 'b', text: 'rank: 1,2,3 | dense_rank: 1,1,2 | row_number: 1,1,3', isCorrect: false },
      { id: 'c', text: 'rank: 1,1,3 | dense_rank: 1,1,2 | row_number: 1,2,3 — rank skips after ties, dense_rank doesn\'t, row_number is always unique', isCorrect: true },
      { id: 'd', text: 'rank and dense_rank are identical, only row_number differs', isCorrect: false },
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
    question: 'Using DataFrame "df" (columns: id, emp_name, department, salary), calculate the percent_rank of each employee\'s salary within their department, storing in "pct_rank".\n\npercent_rank() returns a value between 0.0 and 1.0: (rank - 1) / (total_rows - 1). The lowest salary gets 0.0, the highest gets 1.0.',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'percent_rank().over(Window.partitionBy("department").orderBy("salary"))',
        description: 'Should use percent_rank',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import percent_rank\n\nwindowSpec = Window.partitionBy("department").orderBy("salary")\nresult = df.withColumn("pct_rank", percent_rank().over(windowSpec))`,
    explanation: 'percent_rank() returns a value between 0 and 1 representing the relative rank: (rank - 1) / (total_rows - 1). The lowest value gets 0.0, the highest gets 1.0. Useful for percentile calculations.',
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
    question: 'Using the "sales" table (columns: sale_date, amount), calculate a 7-day moving average of amount using a window frame that includes the current row and the 6 preceding rows.',
    starterCode: `-- 7-day moving average\nSELECT sale_date, amount,\n  AVG(amount) OVER (\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW',
        description: 'Should use window frame for moving average',
      },
    ],
    solution: `SELECT sale_date, amount,\n  AVG(amount) OVER (\n    ORDER BY sale_date\n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) as moving_avg_7d\nFROM sales`,
    explanation: 'ROWS BETWEEN defines a window frame. "6 PRECEDING AND CURRENT ROW" includes the current row plus the 6 before it (7 rows total). This creates a rolling/moving average. RANGE BETWEEN uses logical ranges instead of row counts.',
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
    question: 'Using the "transactions" table (columns: id, account_id, amount, txn_date), calculate the cumulative sum of amount per account ordered by txn_date. Alias the result as "cumulative_sum".\n\nYou can write the window frame explicitly with ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, or rely on the default frame (which is the same when ORDER BY is present).',
    starterCode: `-- Cumulative sum per account\n-- transactions: id, account_id, amount, txn_date\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
        description: 'Should calculate cumulative sum',
      },
    ],
    solution: `SELECT id, account_id, amount, txn_date,\n  SUM(amount) OVER (\n    PARTITION BY account_id\n    ORDER BY txn_date\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) as cumulative_sum\nFROM transactions\n# OR\nSELECT id, account_id, amount, txn_date,\n  SUM(amount) OVER (\n    PARTITION BY account_id\n    ORDER BY txn_date\n  ) as cumulative_sum\nFROM transactions`,
    explanation: 'SUM() OVER (PARTITION BY ... ORDER BY ...) calculates a cumulative sum within each partition. The explicit frame ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW is actually the default when ORDER BY is present, so both versions produce the same result. Being explicit is clearer but not required.',
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
      { id: 'a', text: 'ROWS is faster than RANGE', isCorrect: false },
      { id: 'b', text: 'RANGE only works with dates', isCorrect: false },
      { id: 'c', text: 'They are identical', isCorrect: false },
      { id: 'd', text: 'ROWS operates on physical row positions (exact count). RANGE operates on logical value ranges (includes ties with the same value).', isCorrect: true },
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
    question: 'Using DataFrame "df" (columns: id, department, salary), get the first and last salary value within each department ordered by salary using first() and last() window functions.',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'first("salary").over(...) and last("salary").over(...)',
        description: 'Should use first and last window functions',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import first, last\n\nwindowSpec = Window.partitionBy("department").orderBy("salary")\n\nresult = df.withColumn("lowest_salary", first("salary").over(windowSpec))\n  .withColumn("highest_salary", last("salary").over(windowSpec))`,
    explanation: 'first() returns the first value in the window frame. last() returns the last value. With ORDER BY salary, first gives the lowest and last gives the highest within each partition.',
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
      { id: 'a', text: 'Operations that maintain state across micro-batches, such as aggregations, deduplication, and stream-stream joins, requiring checkpointing and watermarks', isCorrect: true },
      { id: 'b', text: 'Processing that only uses the current batch of data', isCorrect: false },
      { id: 'c', text: 'Storing all data in memory permanently', isCorrect: false },
      { id: 'd', text: 'Processing that runs on a single node', isCorrect: false },
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
      { id: 'a', text: 'Watermarks improve network throughput', isCorrect: false },
      { id: 'b', text: 'Watermarks tell Spark how long to wait for late data before finalising a window and cleaning up its state, preventing unbounded state growth', isCorrect: true },
      { id: 'c', text: 'Watermarks are only needed for file-based sources', isCorrect: false },
      { id: 'd', text: 'Watermarks compress data', isCorrect: false },
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
    question: 'Given streaming DataFrame "events_df" (columns: event_id, event_time, user_id, action), perform a windowed aggregation: count events per user in 1-hour tumbling windows with a 15-minute watermark on event_time.',
    starterCode: ``,
    testCases: [
      {
        input: 'streaming events',
        expectedOutput: 'withWatermark and groupBy(window())',
        description: 'Should do windowed aggregation with watermark',
      },
    ],
    solution: `from pyspark.sql.functions import window, col\n\nresult = events_df\n  .withWatermark("event_time", "15 minutes")\n  .groupBy(\n    window(col("event_time"), "1 hour"),\n    "user_id"\n  ).count()`,
    explanation: 'window(timeColumn, windowDuration) creates tumbling (non-overlapping) time windows. The watermark defines how long to wait for late data. Events arriving more than 15 minutes late are dropped from the aggregation.',
    hints: ['Set watermark before groupBy', 'window() creates time-based windows', 'Tumbling = non-overlapping'],
    tags: ['streaming', 'window', 'watermark', 'aggregation'],
    concepts: ['stream-readstream-writestream', 'sql-window-ranking', 'stream-watermarks', 'ps-groupby-agg'],
  },

  {
    id: 'stream-adv-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given streaming DataFrame "orders_df" (columns: order_id, event_time, amount), deduplicate orders based on order_id within a 1-hour watermark on event_time.',
    starterCode: `# Streaming deduplication\nresult = orders_df`,
    testCases: [
      {
        input: 'streaming with duplicates',
        expectedOutput: '.withWatermark().dropDuplicates()',
        description: 'Should deduplicate with watermark',
      },
    ],
    solution: `result = orders_df\n  .withWatermark("event_time", "1 hour")\n  .dropDuplicates(["order_id"])`,
    explanation: 'dropDuplicates() in streaming is stateful — Spark remembers seen keys. The watermark limits how long it tracks old keys. Without a watermark, state grows unbounded. Events with the same order_id arriving within the watermark are deduped.',
    hints: ['Set watermark to limit state', 'dropDuplicates works on streaming DataFrames'],
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
      { id: 'a', text: 'Corrupted records are always silently skipped', isCorrect: false },
      { id: 'b', text: 'The stream automatically retries until the record is fixed', isCorrect: false },
      { id: 'c', text: 'By default it fails. You can use options like "columnNameOfCorruptRecord" for JSON, PERMISSIVE/DROPMALFORMED modes, or badRecordsPath to handle bad data gracefully.', isCorrect: true },
      { id: 'd', text: 'Corrupted records are sent to a dead letter queue by default', isCorrect: false },
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
      { id: 'a', text: 'Joining a stream with a static table', isCorrect: false },
      { id: 'b', text: 'Any join between DataFrames', isCorrect: false },
      { id: 'c', text: 'A join that produces a new stream of join results', isCorrect: false },
      { id: 'd', text: 'Joining two streaming DataFrames together. Both sides need watermarks defined, and only certain join types (inner, left outer with watermark conditions) are supported.', isCorrect: true },
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
    question: 'Join streaming DataFrame "impressions_df" (columns: ad_id, impression_time) with streaming DataFrame "clicks_df" (columns: ad_id, click_time) where the click happened within 1 hour after the impression. Both have watermarks of 2 hours.',
    starterCode: `from pyspark.sql.functions import expr\n\n`,
    testCases: [
      {
        input: 'two streaming DataFrames',
        expectedOutput: 'withWatermark on both, join with time condition',
        description: 'Should do stream-stream join with time constraint',
      },
    ],
    solution: `from pyspark.sql.functions import expr\n\nimpressions = impressions_df.withWatermark("impression_time", "2 hours")\nclicks = clicks_df.withWatermark("click_time", "2 hours")\n\nresult = impressions.join(\n  clicks,\n  expr("""\n    impressions_df.ad_id = clicks_df.ad_id AND\n    click_time >= impression_time AND\n    click_time <= impression_time + interval 1 hour\n  """)\n)`,
    explanation: 'Stream-stream joins require watermarks on both sides. The time constraint (click within 1 hour of impression) limits how long Spark must buffer unmatched records. Without time constraints, state grows unbounded.',
    hints: ['Set watermarks on both streams', 'Add time constraints in the join condition', 'Use interval for time math'],
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
      { id: 'a', text: 'Stream-static joins one streaming DataFrame with one batch/static DataFrame. No watermarks needed. The static side is re-read each micro-batch. Stream-stream joins two live streams and requires watermarks.', isCorrect: true },
      { id: 'b', text: 'They are the same thing', isCorrect: false },
      { id: 'c', text: 'Stream-static is faster in all cases', isCorrect: false },
      { id: 'd', text: 'Stream-stream does not require watermarks', isCorrect: false },
    ],
    explanation: 'Stream-static joins are simpler: the static DataFrame is like a lookup table that gets joined with each streaming micro-batch. No state management or watermarks needed. Stream-stream is more complex as both sides are continuously changing.',
    tags: ['streaming', 'stream-static', 'stream-stream', 'join'],
    concepts: ['stream-readstream-writestream', 'stream-stream-join', 'sql-joins-inner-outer'],
  },
];
