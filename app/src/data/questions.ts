import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';
import { generateAllVariations } from '../utils/questionVariations';
import { expandedQuestions } from './expandedQuestions';
import { certificationQuestions } from './certificationQuestions';
import { masteryQuestions } from './masteryQuestions';
// Ordered question banks — progressive within each topic
import { webdevOrderedQuestions } from './webdevOrderedQuestions';
import { advancedWebdevOrderedQuestions } from './advancedWebdevOrderedQuestions';
import { backendOrderedQuestions } from './backendOrderedQuestions';
import { sqlOrderedQuestions } from './sqlOrderedQuestions';
// Parsons (drag-the-line) question banks
import { jsBasicsParsonsQuestions } from './jsBasicsParsonsQuestions';
// Predict-the-output question banks
import { jsBasicsPredictOutputQuestions } from './jsBasicsPredictOutputQuestions';
import { sparkSqlPredictOutputQuestions } from './sparkSqlPredictOutputQuestions';
// Cloze (faded worked example) question banks
import { jsBasicsClozeQuestions } from './jsBasicsClozeQuestions';
// Misconception-targeted MCQ banks (distractors tagged with documented student errors)
import { jsMisconceptionMCQs } from './jsMisconceptionMCQs';
import { sqlMisconceptionMCQs } from './sqlMisconceptionMCQs';
// Data Modeling & Warehousing Design — dimensional modeling, SCD, pipeline design
import { dataModelingQuestions } from './dataModelingQuestions';
// Data Engineering Concepts course (tool-agnostic, MCQ-only)
import { dataEngineeringFoundationsQuestions } from './dataEngineeringFoundationsQuestions';
import { dataEngineeringArchitectureQuestions } from './dataEngineeringArchitectureQuestions';
import { dataEngineeringModelingQuestions } from './dataEngineeringModelingQuestions';
import { dataEngineeringStreamingQuestions } from './dataEngineeringStreamingQuestions';
import { dataEngineeringDistributedQuestions } from './dataEngineeringDistributedQuestions';
import { dataEngineeringOpsQuestions } from './dataEngineeringOpsQuestions';
import { tsql_select_questions } from './topic_tsql_select';
import { tsql_filtering_questions } from './topic_tsql_filtering';
import { tsql_string_functions_questions } from './topic_tsql_string_functions';
import { tsql_date_functions_questions } from './topic_tsql_date_functions';
import { tsql_joins_questions } from './topic_tsql_joins';
import { tsql_aggregation_questions } from './topic_tsql_aggregation';
import { tsql_subqueries_cte_questions } from './topic_tsql_subqueries_cte';
import { tsql_set_ops_questions } from './topic_tsql_set_ops';
import { tsql_dml_questions } from './topic_tsql_dml';
import { tsql_windows_questions } from './topic_tsql_windows';
import { tsql_window_frames_questions } from './topic_tsql_window_frames';
import { tsql_lag_lead_questions } from './topic_tsql_lag_lead';
import { tsql_grouping_sets_questions } from './topic_tsql_grouping_sets';
import { tsql_pivot_questions } from './topic_tsql_pivot';
import { tsql_ddl_tables_questions } from './topic_tsql_ddl_tables';
import { tsql_types_questions } from './topic_tsql_types';
import { tsql_constraints_questions } from './topic_tsql_constraints';
import { tsql_views_questions } from './topic_tsql_views';
import { tsql_transactions_questions } from './topic_tsql_transactions';
import { tsql_isolation_questions } from './topic_tsql_isolation';
import { tsql_procedures_questions } from './topic_tsql_procedures';
import { tsql_control_flow_questions } from './topic_tsql_control_flow';
import { tsql_error_handling_questions } from './topic_tsql_error_handling';
import { tsql_facts_dims_questions } from './topic_tsql_facts_dims';
import { tsql_surrogate_keys_questions } from './topic_tsql_surrogate_keys';
import { tsql_star_schema_questions } from './topic_tsql_star_schema';
import { tsql_scd_questions } from './topic_tsql_scd';
import { tsql_normalization_questions } from './topic_tsql_normalization';
import { tsql_insert_questions } from './topic_tsql_insert';
import { tsql_merge_questions } from './topic_tsql_merge';
import { tsql_dedup_questions } from './topic_tsql_dedup';
import { tsql_etl_proc_questions } from './topic_tsql_etl_proc';
import { tsql_incremental_questions } from './topic_tsql_incremental';
import { tsql_quality_questions } from './topic_tsql_quality';
import { tsql_indexes_questions } from './topic_tsql_indexes';
import { tsql_execution_plans_questions } from './topic_tsql_execution_plans';
import { tsql_partitioning_questions } from './topic_tsql_partitioning';
import { tsql_columnstore_questions } from './topic_tsql_columnstore';
import { tsql_antipatterns_questions } from './topic_tsql_antipatterns';
import { tsql_mpp_model_questions } from './topic_tsql_mpp_model';
import { tsql_synapse_fabric_questions } from './topic_tsql_synapse_fabric';
import { tsql_other_warehouses_questions } from './topic_tsql_other_warehouses';
import { dj_admin_questions } from './topic_dj_admin';
import { dj_api_docs_questions } from './topic_dj_api_docs';
import { dj_auth_questions } from './topic_dj_auth';
import { dj_caching_questions } from './topic_dj_caching';
import { dj_celery_questions } from './topic_dj_celery';
import { dj_channels_questions } from './topic_dj_channels';
import { dj_cicd_questions } from './topic_dj_cicd';
import { dj_custom_managers_questions } from './topic_dj_custom_managers';
import { dj_deployment_questions } from './topic_dj_deployment';
import { dj_factory_boy_questions } from './topic_dj_factory_boy';
import { dj_file_uploads_questions } from './topic_dj_file_uploads';
import { dj_forms_questions } from './topic_dj_forms';
import { dj_management_questions } from './topic_dj_management';
import { dj_models_questions } from './topic_dj_models';
import { dj_monitoring_questions } from './topic_dj_monitoring';
import { dj_nginx_questions } from './topic_dj_nginx';
import { dj_orm_questions } from './topic_dj_orm';
import { dj_orm_mastery_questions } from './topic_dj_orm_mastery';
import { dj_models_mastery_questions } from './topic_dj_models_mastery';
import { dj_views_mastery_questions } from './topic_dj_views_mastery';
import { dj_forms_mastery_questions } from './topic_dj_forms_mastery';
import { dj_auth_mastery_questions } from './topic_dj_auth_mastery';
import { dj_rest_mastery_questions } from './topic_dj_rest_mastery';
import { dj_pagination_generics_questions } from './topic_dj_pagination_generics';
import { dj_postgres_questions } from './topic_dj_postgres';
import { dj_redis_questions } from './topic_dj_redis';
import { dj_rest_questions } from './topic_dj_rest';
import { dj_service_layer_questions } from './topic_dj_service_layer';
import { dj_settings_questions } from './topic_dj_settings';
import { dj_setup_questions } from './topic_dj_setup';
import { dj_signals_mw_questions } from './topic_dj_signals_mw';
import { dj_templates_questions } from './topic_dj_templates';
import { dj_transactions_questions } from './topic_dj_transactions';
import { dj_urls_questions } from './topic_dj_urls';
import { dj_views_questions } from './topic_dj_views';
import { dj_cbv_questions } from './topic_dj_cbv';
import { py_async_questions } from './topic_py_async';
import { py_basics_questions } from './topic_py_basics';
import { py_cli_questions } from './topic_py_cli';
import { py_collections_questions } from './topic_py_collections';
import { py_comprehensions_questions } from './topic_py_comprehensions';
import { py_generators_questions } from './topic_py_generators';
import { py_threading_questions } from './topic_py_threading';
import { py_futures_questions } from './topic_py_futures';
import { py_context_managers_questions } from './topic_py_context_managers';
import { py_daily_patterns_questions } from './topic_py_daily_patterns';
import { py_data_structures_questions } from './topic_py_data_structures';
import { py_dataclasses_questions } from './topic_py_dataclasses';
import { py_datetime_paths_questions } from './topic_py_datetime_paths';
import { py_decorators_questions } from './topic_py_decorators';
import { py_error_handling_questions } from './topic_py_error_handling';
import { py_file_io_questions } from './topic_py_file_io';
import { py_functions_questions } from './topic_py_functions';
import { py_functools_questions } from './topic_py_functools';
import { py_http_questions } from './topic_py_http';
import { py_itertools_questions } from './topic_py_itertools';
import { py_logging_questions } from './topic_py_logging';
import { py_magic_methods_questions } from './topic_py_magic_methods';
import { py_modern_questions } from './topic_py_modern';
import { py_modules_questions } from './topic_py_modules';
import { py_oop_questions } from './topic_py_oop';
import { py_oop_advanced_questions } from './topic_py_oop_advanced';
import { py_metaclasses_questions } from './topic_py_metaclasses';
import { py_packaging_questions } from './topic_py_packaging';
import { py_pydantic_questions } from './topic_py_pydantic';
import { py_regex_questions } from './topic_py_regex';
import { py_security_questions } from './topic_py_security';
import { py_serialization_questions } from './topic_py_serialization';
import { py_shell_os_questions } from './topic_py_shell_os';
import { py_testing_basics_questions } from './topic_py_testing_basics';
import { py_fixtures_questions } from './topic_py_fixtures';
import { py_mocking_questions } from './topic_py_mocking';
import { py_type_hints_questions } from './topic_py_type_hints';

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(q => seen.has(q.id) ? false : (seen.add(q.id), true));
}

const baseQuestions: Question[] = [
  // ===== DATABRICKS BASICS - BEGINNER =====
  {
    id: 'db-basic-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_BASICS,
    question: 'What is Databricks primarily built on?',
    options: [
      { id: 'a', text: 'Apache Spark', isCorrect: true },
      { id: 'b', text: 'Hadoop MapReduce', isCorrect: false },
      { id: 'c', text: 'Apache Kafka', isCorrect: false },
      { id: 'd', text: 'Apache Flink', isCorrect: false },
    ],
    explanation: 'Databricks is a unified analytics platform built on top of Apache Spark, providing a collaborative environment for big data processing and machine learning.',
    tags: ['fundamentals', 'architecture'],
    concepts: ['dbx-architecture'],
  },
  {
    id: 'db-basic-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_BASICS,
    question: 'Which component in Databricks is responsible for executing Spark jobs?',
    options: [
      { id: 'a', text: 'Notebook', isCorrect: false },
      { id: 'b', text: 'Cluster', isCorrect: true },
      { id: 'c', text: 'Workspace', isCorrect: false },
      { id: 'd', text: 'DBFS', isCorrect: false },
    ],
    explanation: 'Clusters are groups of computers that work together to execute Spark jobs. They contain a driver node and worker nodes.',
    tags: ['cluster', 'execution'],
    concepts: ['dbx-cluster-config', 'dbx-architecture'],
  },
  {
    id: 'db-basic-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_BASICS,
    question: 'What does DBFS stand for in Databricks?',
    options: [
      { id: 'a', text: 'Database File Storage', isCorrect: false },
      { id: 'b', text: 'Distributed Binary File System', isCorrect: false },
      { id: 'c', text: 'Databricks File System', isCorrect: true },
      { id: 'd', text: 'Data Block File System', isCorrect: false },
    ],
    explanation: 'DBFS (Databricks File System) is a distributed file system mounted into a Databricks workspace and available on Databricks clusters.',
    tags: ['storage', 'dbfs'],
    concepts: ['dbx-dbfs'],
  },

  // ===== PYSPARK BASICS - BEGINNER =====
  {
    id: 'ps-basic-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    question: 'What is the entry point for PySpark applications?',
    options: [
      { id: 'a', text: 'SparkContext', isCorrect: false },
      { id: 'b', text: 'SQLContext', isCorrect: false },
      { id: 'c', text: 'HiveContext', isCorrect: false },
      { id: 'd', text: 'SparkSession', isCorrect: true },
    ],
    explanation: 'SparkSession is the unified entry point for Spark applications in Spark 2.0+. It combines SQLContext, HiveContext, and SparkContext.',
    tags: ['spark-session', 'entry-point'],
    concepts: ['ps-session-init'],
  },
  {
    id: 'ps-basic-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Create a SparkSession with the app name "MyFirstApp".',
    starterCode: `# Import SparkSession and assign 'spark' to a newly built session with appName "MyFirstApp"
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'SparkSession.builder.appName("MyFirstApp").getOrCreate()',
        description: 'Should create a SparkSession with app name MyFirstApp',
      },
    ],
    solution: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("MyFirstApp").getOrCreate()`,
    explanation: 'SparkSession.builder provides a fluent API to configure and create a SparkSession. appName() sets the application name, and getOrCreate() creates a new session or returns an existing one.',
    hints: ['Use SparkSession.builder', 'Chain appName() and getOrCreate() methods'],
    tags: ['spark-session', 'initialization'],
    concepts: ['ps-session-init'],
  },
  {
    id: 'ps-basic-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Create a simple DataFrame from a list of tuples: [(1, "Alice"), (2, "Bob"), (3, "Charlie")] with columns "id" and "name".',
    starterCode: `# Build a SparkSession, declare the list of tuples from the prompt,
# and assign df to a DataFrame created from that data with columns "id" and "name"
`,
    testCases: [
      {
        input: 'data = [(1, "Alice"), (2, "Bob"), (3, "Charlie")]',
        expectedOutput: 'spark.createDataFrame(data, ["id", "name"])',
        description: 'Should create DataFrame with id and name columns',
      },
    ],
    solution: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DataFrameExample").getOrCreate()
data = [(1, "Alice"), (2, "Bob"), (3, "Charlie")]
df = spark.createDataFrame(data, ["id", "name"])`,
    explanation: 'The createDataFrame() method can accept a list of tuples and a list of column names to create a DataFrame.',
    hints: ['Use spark.createDataFrame()', 'Pass the data and column names as arguments'],
    tags: ['dataframe', 'creation'],
    concepts: ['ps-dataframe-create'],
  },

  // ===== PYSPARK DATAFRAMES - BEGINNER TO INTERMEDIATE =====
  {
    id: 'ps-df-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    question: 'Which method is used to display the first n rows of a DataFrame?',
    options: [
      { id: 'a', text: 'show()', isCorrect: true },
      { id: 'b', text: 'head()', isCorrect: false },
      { id: 'c', text: 'display()', isCorrect: false },
      { id: 'd', text: 'print()', isCorrect: false },
    ],
    explanation: 'show(n) displays the first n rows of a DataFrame in tabular format. head(n) returns rows as Row objects, while display() is Databricks-specific.',
    tags: ['dataframe', 'display'],
    concepts: ['ps-dataframe-create', 'ps-actions-vs-transforms'],
  },
  {
    id: 'ps-df-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, name, age, email, department), select only the "name" and "age" columns.',
    starterCode: `# Assuming df exists with columns: id, name, age, city
# Select name and age columns
result = df.`,
    testCases: [
      {
        input: 'df with columns: id, name, age, city',
        expectedOutput: 'df.select("name", "age")',
        description: 'Should select only name and age columns',
      },
    ],
    solution: `result = df.select("name", "age")`,
    explanation: 'The select() method is used to choose specific columns from a DataFrame. You can pass column names as strings.',
    hints: ['Use the select() method', 'Pass column names as strings'],
    tags: ['dataframe', 'select', 'columns'],
    concepts: ['ps-dataframe-create', 'ps-select-filter'],
  },
  {
    id: 'ps-df-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Filter the DataFrame "df" (which has an "age" column) to show only rows where age is greater than 25.',
    starterCode: `# Filter for age > 25
result = df.`,
    testCases: [
      {
        input: 'df with age column',
        expectedOutput: 'df.filter(df.age > 25) or df.where(df.age > 25) or df.filter("age > 25")',
        description: 'Should filter rows where age > 25',
      },
    ],
    solution: `result = df.filter(df.age > 25)
# OR
result = df.where(df.age > 25)
# OR using SQL expression
result = df.filter("age > 25")`,
    explanation: 'filter() and where() are aliases - they work identically. You can use column expressions (df.age > 25) or SQL strings ("age > 25").',
    hints: ['Use filter() or where()', 'You can use column notation or SQL strings'],
    tags: ['dataframe', 'filter', 'where'],
    concepts: ['ps-dataframe-create', 'ps-select-filter'],
  },
  {
    id: 'ps-df-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Given DataFrame "df" with an "age" column, add a new column "age_group" that contains "adult" if age >= 18, else "minor".',
    starterCode: `# Import the conditional helper from pyspark.sql.functions
# Assign result = df with "age_group" column: "adult" when age >= 18, else "minor"
`,
    testCases: [
      {
        input: 'df with age column',
        expectedOutput: 'when(df.age >= 18, "adult").otherwise("minor")',
        description: 'Should create age_group column with conditional logic',
      },
    ],
    solution: `from pyspark.sql.functions import when

result = df.withColumn("age_group", when(df.age >= 18, "adult").otherwise("minor"))`,
    explanation: 'withColumn() adds or replaces a column. The when() function provides conditional logic similar to CASE WHEN in SQL.',
    hints: ['Use when() function for conditional logic', 'Chain with otherwise() for the else case'],
    tags: ['dataframe', 'withColumn', 'when', 'conditional'],
    concepts: ['ps-dataframe-create', 'ps-with-column', 'ps-when-otherwise'],
  },
  {
    id: 'ps-df-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (which has a "department" column), group by department and count the number of employees in each department.',
    starterCode: `# Group by department and count
result = df.`,
    testCases: [
      {
        input: 'df with department column',
        expectedOutput: 'df.groupBy("department").count()',
        description: 'Should group by department and count rows',
      },
    ],
    solution: `result = df.groupBy("department").count()`,
    explanation: 'groupBy() groups rows by one or more columns, and count() returns the number of rows in each group.',
    hints: ['Use groupBy() on the department column', 'Chain with count()'],
    tags: ['dataframe', 'groupBy', 'aggregation'],
    concepts: ['ps-dataframe-create', 'ps-groupby-agg'],
  },

  // ===== PYSPARK TRANSFORMATIONS - INTERMEDIATE =====
  {
    id: 'ps-transform-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    question: 'Which of the following is a transformation (not an action)?',
    options: [
      { id: 'a', text: 'count()', isCorrect: false },
      { id: 'b', text: 'map()', isCorrect: true },
      { id: 'c', text: 'collect()', isCorrect: false },
      { id: 'd', text: 'show()', isCorrect: false },
    ],
    explanation: 'map() is a transformation - it is lazy and returns a new RDD/DataFrame. count(), collect(), and show() are actions that trigger execution.',
    tags: ['transformations', 'actions', 'lazy-evaluation'],
    concepts: ['ps-actions-vs-transforms'],
  },
  {
    id: 'ps-transform-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Join two DataFrames — df1 (columns: id, name, age) and df2 (columns: id, department, salary) — on the "id" column using an inner join.',
    starterCode: `# Join df1 and df2 on 'id' column
result = df1.`,
    testCases: [
      {
        input: 'df1 and df2 with id columns',
        expectedOutput: 'df1.join(df2, "id", "inner") or df1.join(df2, on="id", how="inner")',
        description: 'Should perform inner join on id column',
      },
    ],
    solution: `result = df1.join(df2, "id", "inner")
# OR
result = df1.join(df2, on="id", how="inner")`,
    explanation: 'The join() method combines DataFrames. Parameters are: other DataFrame, join column(s), and join type (inner, left, right, outer).',
    hints: ['Use the join() method', 'Specify the column name and join type'],
    tags: ['dataframe', 'join', 'transformation'],
    concepts: ['ps-dataframe-create', 'sql-joins-inner-outer', 'ps-actions-vs-transforms'],
  },
  {
    id: 'ps-transform-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Remove duplicate rows from a DataFrame based on all columns.',
    starterCode: `# Remove duplicates
result = df.`,
    testCases: [
      {
        input: 'df with duplicate rows',
        expectedOutput: 'df.distinct() or df.dropDuplicates()',
        description: 'Should remove duplicate rows',
      },
    ],
    solution: `result = df.distinct()
# OR
result = df.dropDuplicates()`,
    explanation: 'distinct() and dropDuplicates() both remove duplicate rows. dropDuplicates() can also take specific columns as parameters.',
    hints: ['Use distinct() or dropDuplicates()'],
    tags: ['dataframe', 'distinct', 'deduplication'],
    concepts: ['ps-dataframe-create', 'ps-distinct-drop-dup'],
  },
  {
    id: 'ps-transform-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Sort a DataFrame by "salary" in descending order.',
    starterCode: `# Sort by salary descending
result = df.`,
    testCases: [
      {
        input: 'df with salary column',
        expectedOutput: 'df.orderBy(df.salary.desc()) or df.sort(df.salary.desc())',
        description: 'Should sort by salary in descending order',
      },
    ],
    solution: `from pyspark.sql.functions import desc

result = df.orderBy(desc("salary"))
# OR
result = df.orderBy(df.salary.desc())
# OR
result = df.sort(desc("salary"))`,
    explanation: 'orderBy() and sort() are aliases. Use desc() function or .desc() method on columns for descending order.',
    hints: ['Use orderBy() or sort()', 'Use desc() for descending order'],
    tags: ['dataframe', 'orderBy', 'sort'],
    concepts: ['ps-dataframe-create', 'ps-orderby-sort'],
  },

  // ===== SPARK SQL - BEGINNER TO INTERMEDIATE =====
  {
    id: 'sql-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to select all columns from the "employees" table (which has columns: id, name, department, salary, age, email) where department is "Sales".',
    starterCode: `-- Write your SQL query here
`,
    testCases: [
      {
        input: 'employees table with department column',
        expectedOutput: 'SELECT * FROM employees WHERE department = "Sales"',
        description: 'Should select all Sales employees',
      },
    ],
    solution: `SELECT * FROM employees WHERE department = 'Sales'`,
    explanation: 'Basic SQL SELECT statement with WHERE clause to filter rows.',
    hints: ['Use SELECT * to get all columns', 'Use WHERE to filter'],
    tags: ['sql', 'select', 'where'],
    concepts: ['ps-select-filter'],
  },
  {
    id: 'sql-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.PYTHON,
    question: 'Register a DataFrame as a temporary view named "employees" so you can query it with SQL.',
    starterCode: `# Register df as temporary view
df.`,
    testCases: [
      {
        input: 'df DataFrame',
        expectedOutput: 'df.createOrReplaceTempView("employees")',
        description: 'Should create temp view named employees',
      },
    ],
    solution: `df.createOrReplaceTempView("employees")`,
    explanation: 'createOrReplaceTempView() registers a DataFrame as a temporary view that can be queried using SQL. The view is session-scoped.',
    hints: ['Use createOrReplaceTempView()', 'Pass the view name as a string'],
    tags: ['sql', 'temp-view', 'dataframe'],
    concepts: ['sql-temp-views', 'ps-dataframe-create'],
  },
  {
    id: 'sql-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Query the "employees" table (which has department and salary columns) to find the average salary by department, ordered by average salary descending.',
    starterCode: `-- Write your SQL query here
`,
    testCases: [
      {
        input: 'employees table with department and salary columns',
        expectedOutput: 'SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC',
        description: 'Should calculate average salary by department',
      },
    ],
    solution: `SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC`,
    explanation: 'This uses GROUP BY to aggregate by department, AVG() to calculate average salary, and ORDER BY to sort results.',
    hints: ['Use GROUP BY department', 'Use AVG() function', 'Use ORDER BY with DESC'],
    tags: ['sql', 'groupby', 'aggregate', 'orderby'],
    concepts: ['ps-groupby-agg', 'ps-aggregate-fns', 'ps-orderby-sort'],
  },
  {
    id: 'sql-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, department, salary), find all employees whose salary is above the company-wide average salary.\n\nIMPORTANT: You cannot use WHERE salary > AVG(salary) directly — SQL does not allow aggregate functions in the WHERE clause because WHERE filters rows one at a time before any aggregation happens. To solve this, you need a subquery that calculates the average first, then compare against it.',
    starterCode: `-- Find employees paid above average\n-- Hint: WHERE cannot use AVG() directly — use a subquery\n`,
    testCases: [
      {
        input: 'employees table with salary column',
        expectedOutput: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)',
        description: 'Should find employees with above-average salary',
      },
    ],
    solution: `SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)`,
    explanation: 'WHERE filters rows before aggregation, so AVG(salary) cannot appear directly in a WHERE clause. The subquery (SELECT AVG(salary) FROM employees) runs first and returns a single number (a "scalar subquery"), which the outer WHERE then uses to filter each row.',
    hints: ['WHERE salary > AVG(salary) won\'t work — aggregates can\'t go in WHERE', 'Use a subquery: (SELECT AVG(salary) FROM employees) returns a single number', 'The outer query then filters: WHERE salary > (that number)'],
    tags: ['sql', 'subquery', 'aggregate'],
    concepts: ['sql-subqueries', 'ps-aggregate-fns'],
  },

  // ===== ADVANCED PYSPARK =====
  {
    id: 'ps-advanced-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    question: 'Which operation triggers a shuffle in Spark?',
    options: [
      { id: 'a', text: 'select()', isCorrect: false },
      { id: 'b', text: 'filter()', isCorrect: false },
      { id: 'c', text: 'groupBy()', isCorrect: true },
      { id: 'd', text: 'withColumn()', isCorrect: false },
    ],
    explanation: 'groupBy() triggers a shuffle because data needs to be redistributed across partitions to group by keys. select(), filter(), and withColumn() are narrow transformations.',
    tags: ['shuffle', 'performance', 'partitioning'],
    concepts: ['ps-shuffle', 'ps-cache-persist', 'ps-partitioning'],
  },
  {
    id: 'ps-advanced-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, name, department, salary), use a window function to add a "rank" column that ranks employees by salary (highest first) within each department.',
    starterCode: `# Import Window and the ranking + descending helpers from pyspark
# Build a windowSpec partitioned by department and ordered by salary descending
# Assign result = df with a "rank" column derived from that window
`,
    testCases: [
      {
        input: 'df with department and salary columns',
        expectedOutput: 'windowSpec = Window.partitionBy("department").orderBy(desc("salary")) result = df.withColumn("rank", rank().over(windowSpec))',
        description: 'Should rank by salary within department',
      },
    ],
    solution: `from pyspark.sql.window import Window
from pyspark.sql.functions import rank, desc

windowSpec = Window.partitionBy("department").orderBy(desc("salary"))
result = df.withColumn("rank", rank().over(windowSpec))`,
    explanation: 'Window functions operate on a group of rows and return a value for each row. partitionBy() defines the partition, orderBy() defines the order within each partition.',
    hints: ['Use Window.partitionBy() for grouping', 'Use orderBy() to define ranking order', 'Apply rank() over the window'],
    tags: ['window-functions', 'rank', 'advanced'],
    concepts: ['sql-window-ranking'],
  },
  {
    id: 'ps-advanced-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Cache a DataFrame that will be reused multiple times to improve performance.',
    starterCode: `# Cache the DataFrame
df_cached = df.`,
    testCases: [
      {
        input: 'df DataFrame',
        expectedOutput: 'df.cache() or df.persist()',
        description: 'Should cache the DataFrame',
      },
    ],
    solution: `df_cached = df.cache()
# OR
df_cached = df.persist()`,
    explanation: 'cache() stores the DataFrame in memory for faster access on repeated operations. persist() allows more control over storage levels.',
    hints: ['Use cache() method', 'cache() is an alias for persist(StorageLevel.MEMORY_ONLY)'],
    tags: ['caching', 'performance', 'optimization'],
    concepts: ['ps-cache-persist', 'ps-execution-plans'],
  },
  {
    id: 'ps-advanced-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.ADVANCED_TOPICS,
    language: CodeLanguage.PYTHON,
    question: 'Join streaming DataFrame "impressions_df" (columns: ad_id, impression_time) with streaming DataFrame "clicks_df" (columns: ad_id, click_time) where the click happened within 1 hour after the impression. Both have watermarks of 2 hours.',
    starterCode: ``,
    testCases: [
      {
        input: 'impressions_df and clicks_df streaming DataFrames',
        expectedOutput: 'withWatermark("impression_time", "2 hours") withWatermark("click_time", "2 hours") join with expr ad_id match and click_time between impression_time and impression_time + interval 1 hour',
        description: 'Should join streams with watermarks and time range condition',
      },
    ],
    solution: `from pyspark.sql.functions import expr

impressions = impressions_df.withWatermark("impression_time", "2 hours")
clicks = clicks_df.withWatermark("click_time", "2 hours")

result = impressions.join(
    clicks,
    expr("""
        impressions.ad_id = clicks.ad_id AND
        click_time >= impression_time AND
        click_time <= impression_time + interval 1 hour
    """),
    "inner"
)`,
    explanation: 'Stream-stream joins require watermarks on both sides and a time range condition so Spark knows how long to buffer state. The watermark tells Spark when data is "too late" to matter, and the interval condition bounds how far apart matching events can be.',
    hints: [
      'Use withWatermark() on both DataFrames before joining',
      'The join condition needs both the key match (ad_id) and a time range',
      'Use expr() with interval syntax to express the time bound',
    ],
    tags: ['streaming', 'join', 'watermark', 'structured-streaming'],
    concepts: ['stream-readstream-writestream', 'sql-joins-inner-outer', 'stream-watermarks'],
  },

  // ===== MORE BEGINNER QUESTIONS FOR REPETITION =====
  {
    id: 'ps-basic-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Read a CSV file from "/data/employees.csv" into a DataFrame with header.',
    starterCode: `# Read CSV file
df = spark.`,
    testCases: [
      {
        input: 'CSV file at /data/employees.csv',
        expectedOutput: 'spark.read.csv("/data/employees.csv", header=True)',
        description: 'Should read CSV with header',
      },
    ],
    solution: `df = spark.read.csv("/data/employees.csv", header=True)
# OR
df = spark.read.format("csv").option("header", "true").load("/data/employees.csv")`,
    explanation: 'spark.read.csv() reads CSV files. The header=True option indicates the first row contains column names.',
    hints: ['Use spark.read.csv()', 'Set header=True to use first row as column names'],
    tags: ['io', 'csv', 'read'],
    concepts: ['ps-io-csv'],
  },
  {
    id: 'ps-df-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (which has columns: id, name, age, email), show the schema (column names, data types, and nullable info).',
    starterCode: `# Print the schema
df.`,
    testCases: [
      {
        input: 'df DataFrame',
        expectedOutput: 'df.printSchema() or df.schema',
        description: 'Should access the schema',
      },
    ],
    solution: `df.printSchema()
# OR
df.schema`,
    explanation: 'printSchema() displays the schema of a DataFrame in a tree format. Alternatively, df.schema returns the StructType schema object.',
    hints: ['Use printSchema() method or access the schema attribute'],
    tags: ['dataframe', 'schema'],
    concepts: ['ps-dataframe-create'],
  },
  {
    id: 'ps-df-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Count the total number of rows in a DataFrame.',
    starterCode: `# Count rows
row_count = df.`,
    testCases: [
      {
        input: 'df DataFrame',
        expectedOutput: 'df.count()',
        description: 'Should count total rows',
      },
    ],
    solution: `row_count = df.count()`,
    explanation: 'count() is an action that returns the number of rows in a DataFrame.',
    hints: ['Use count() method'],
    tags: ['dataframe', 'count', 'action'],
    concepts: ['ps-dataframe-create', 'ps-actions-vs-transforms'],
  },
  {
    id: 'ps-df-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Rename column "old_name" to "new_name".',
    starterCode: `# Rename column
result = df.`,
    testCases: [
      {
        input: 'df with old_name column',
        expectedOutput: 'df.withColumnRenamed("old_name", "new_name")',
        description: 'Should rename column',
      },
    ],
    solution: `result = df.withColumnRenamed("old_name", "new_name")`,
    explanation: 'withColumnRenamed() returns a new DataFrame with a column renamed.',
    hints: ['Use withColumnRenamed()', 'Pass old name and new name as arguments'],
    tags: ['dataframe', 'rename', 'columns'],
    concepts: ['ps-dataframe-create', 'ps-with-column', 'ps-select-filter'],
  },
  {
    id: 'ps-df-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Drop the "temp_column" from a DataFrame.',
    starterCode: `# Drop column
result = df.`,
    testCases: [
      {
        input: 'df with temp_column',
        expectedOutput: 'df.drop("temp_column")',
        description: 'Should drop temp_column',
      },
    ],
    solution: `result = df.drop("temp_column")`,
    explanation: 'drop() removes one or more columns from a DataFrame and returns a new DataFrame.',
    hints: ['Use drop() method', 'Pass the column name as a string'],
    tags: ['dataframe', 'drop', 'columns'],
    concepts: ['ps-dataframe-create', 'ps-distinct-drop-dup', 'ps-select-filter'],
  },
  {
    id: 'ps-df-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, name, country, city), select only the distinct values from the "country" column.',
    starterCode: `# Get distinct countries
result = df.select("country").`,
    testCases: [
      {
        input: 'df with country column',
        expectedOutput: 'df.select("country").distinct()',
        description: 'Should get distinct countries',
      },
    ],
    solution: `result = df.select("country").distinct()`,
    explanation: 'Combining select() with distinct() returns unique values from specified columns.',
    hints: ['Use select() first', 'Chain with distinct()'],
    tags: ['dataframe', 'distinct', 'select'],
    concepts: ['ps-dataframe-create', 'ps-distinct-drop-dup', 'ps-select-filter'],
  },

  // ===== MORE SQL QUESTIONS =====
  {
    id: 'sql-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, name, department, salary), write a query to find the top 5 highest paid employees. Return all columns.',
    starterCode: `-- Write your SQL query here
`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'SELECT * FROM employees ORDER BY salary DESC LIMIT 5',
        description: 'Should get top 5 by salary',
      },
    ],
    solution: `SELECT * FROM employees
ORDER BY salary DESC
LIMIT 5`,
    explanation: 'ORDER BY sorts rows, DESC for descending order, and LIMIT restricts the number of results.',
    hints: ['Use ORDER BY salary DESC', 'Use LIMIT 5'],
    tags: ['sql', 'orderby', 'limit'],
    concepts: ['ps-orderby-sort'],
  },
  {
    id: 'sql-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, name, department, salary), write a query to select the department and count of employees in each department, showing only departments with more than 10 employees.',
    starterCode: `-- Write your SQL query here
`,
    testCases: [
      {
        input: 'employees table with department',
        expectedOutput: 'SELECT department, COUNT(*) as count FROM employees GROUP BY department HAVING count > 10',
        description: 'Should count employees by department, filter by HAVING',
      },
    ],
    solution: `SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING employee_count > 10
-- OR
SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10`,
    explanation: 'HAVING filters groups after aggregation, unlike WHERE which filters before. Use it with GROUP BY to filter aggregated results.',
    hints: ['Use GROUP BY and COUNT()', 'Use HAVING to filter aggregated results'],
    tags: ['sql', 'groupby', 'having', 'aggregate'],
    concepts: ['ps-groupby-agg', 'sql-where-having', 'ps-aggregate-fns'],
  },
  {
    id: 'sql-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_SQL,
    language: CodeLanguage.SQL,
    question: 'Query the "sales" table (columns: sale_date, amount) using a window function to calculate the running total of sales ordered by sale_date.',
    starterCode: `-- Write your SQL query here
`,
    testCases: [
      {
        input: 'sales table with sale_date and amount',
        expectedOutput: 'SELECT sale_date, amount, SUM(amount) OVER (ORDER BY sale_date) as running_total FROM sales',
        description: 'Should calculate running total',
      },
    ],
    solution: `SELECT sale_date, amount,
       SUM(amount) OVER (ORDER BY sale_date) as running_total
FROM sales`,
    explanation: 'Window functions use OVER clause. SUM(amount) OVER (ORDER BY sale_date) calculates cumulative sum ordered by sale_date.',
    hints: ['Use SUM() with OVER clause', 'ORDER BY sale_date in the window'],
    tags: ['sql', 'window-functions', 'advanced'],
    concepts: ['sql-window-ranking'],
  },

  // ===== MORE DATABRICKS QUESTIONS =====
  {
    id: 'db-basic-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_BASICS,
    question: 'What is Delta Lake?',
    options: [
      { id: 'a', text: 'A data visualization tool', isCorrect: false },
      { id: 'b', text: 'A machine learning framework', isCorrect: false },
      { id: 'c', text: 'A SQL query engine', isCorrect: false },
      { id: 'd', text: 'An open-source storage layer that brings ACID transactions to Apache Spark', isCorrect: true },
    ],
    explanation: 'Delta Lake is an open-source storage layer that provides ACID transactions, scalable metadata handling, and unified streaming/batch data processing on top of existing data lakes.',
    tags: ['delta-lake', 'storage', 'acid'],
    concepts: ['delta-acid'],
  },
  {
    id: 'db-basic-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_BASICS,
    question: 'What is the purpose of Auto Loader in Databricks?',
    options: [
      { id: 'a', text: 'Efficiently processes new data files as they arrive in cloud storage', isCorrect: true },
      { id: 'b', text: 'Automatically scales clusters', isCorrect: false },
      { id: 'c', text: 'Automatically optimizes queries', isCorrect: false },
      { id: 'd', text: 'Loads data into memory automatically', isCorrect: false },
    ],
    explanation: 'Auto Loader incrementally and efficiently processes new data files as they arrive in cloud storage, without having to manually track which files have been processed.',
    tags: ['auto-loader', 'streaming', 'incremental'],
    concepts: ['stream-autoloader', 'stream-readstream-writestream'],
  },

  // ===== ADDITIONAL PRACTICE QUESTIONS =====
  {
    id: 'ps-transform-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Perform a left join between df1 (columns: id, name, dept_id) and df2 (columns: id, department_name) on the "id" column.',
    starterCode: `# Left join df1 and df2
result = df1.`,
    testCases: [
      {
        input: 'df1 and df2 with id column',
        expectedOutput: 'df1.join(df2, "id", "left")',
        description: 'Should perform left join',
      },
    ],
    solution: `result = df1.join(df2, "id", "left")`,
    explanation: 'Left join keeps all rows from the left DataFrame (df1) and matching rows from the right DataFrame (df2).',
    hints: ['Use join() with "left" as the join type'],
    tags: ['dataframe', 'join', 'left-join'],
    concepts: ['ps-dataframe-create', 'sql-joins-inner-outer'],
  },
  {
    id: 'ps-df-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, product, amount), calculate the sum of the "amount" column.',
    starterCode: `# Import the sum aggregate from pyspark.sql.functions
# Assign result to the aggregation of df returning the total of "amount"
`,
    testCases: [
      {
        input: 'df with amount column',
        expectedOutput: 'df.agg(sum("amount"))',
        description: 'Should calculate sum of amount',
      },
    ],
    solution: `from pyspark.sql.functions import sum

result = df.agg(sum("amount"))
# OR
result = df.select(sum("amount"))`,
    explanation: 'agg() performs aggregations. sum() is an aggregate function that calculates the total of a numeric column.',
    hints: ['Use agg() with sum() function', 'Or use select() with sum()'],
    tags: ['dataframe', 'aggregate', 'sum'],
    concepts: ['ps-dataframe-create', 'ps-aggregate-fns'],
  },
  {
    id: 'ps-df-12',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_DATAFRAMES,
    language: CodeLanguage.PYTHON,
    question: 'Fill null values in the "age" column with 0.',
    starterCode: `# Fill null values in age column
result = df.`,
    testCases: [
      {
        input: 'df with age column containing nulls',
        expectedOutput: 'df.fillna(0, subset=["age"]) or df.na.fill(0, subset=["age"])',
        description: 'Should fill nulls with 0',
      },
    ],
    solution: `result = df.fillna(0, subset=["age"])
# OR
result = df.na.fill(0, subset=["age"])`,
    explanation: 'fillna() or na.fill() replaces null values. The subset parameter specifies which columns to fill.',
    hints: ['Use fillna() or na.fill()', 'Use subset parameter to specify columns'],
    tags: ['dataframe', 'null-handling', 'fillna'],
    concepts: ['ps-dataframe-create', 'ps-null-handling'],
  },
];

// Generate variations of key concepts (5 variations per template)
// We now have 28 variation templates (8 original + 20 new)
const variationQuestions = generateAllVariations(5);

// Combine base questions, expanded questions, and variations
// Base: 36 questions
// Databricks: base + expanded + certification + mastery + variations
// Web Dev basics: htmlCss + webdev + webdevAdvanced + webdevGap (will be consolidated to webdevOrderedQuestions)
// Web Dev advanced: advancedWebdevOrderedQuestions (Next.js, Prisma, Forms, Testing, a11y, Patterns, Security, Projects)
// Backend: backendOrderedQuestions (Python, Django, Celery, Infrastructure, Projects)
export const questions: Question[] = dedupeById([
  // Databricks (ordered in source files)
  ...baseQuestions, ...expandedQuestions, ...certificationQuestions, ...masteryQuestions, ...variationQuestions,
  // Web Dev — basics (HTML/CSS/JS/TS/React) then advanced (Next.js → Projects)
  ...webdevOrderedQuestions,
  ...advancedWebdevOrderedQuestions,
  // Backend — Python → Django → Celery → Infrastructure → Projects
  ...backendOrderedQuestions,
  // SQL for Data Engineering (T-SQL) — DDL pilot, then pillars in path order
  ...sqlOrderedQuestions,
  // Parsons (drag-the-line) — interleaved with Backend by topic
  ...jsBasicsParsonsQuestions,
  // Predict-the-output — interleaved with Backend by topic
  ...jsBasicsPredictOutputQuestions,
  ...sparkSqlPredictOutputQuestions,
  // Cloze (faded worked examples) — interleaved with Backend by topic
  ...jsBasicsClozeQuestions,
  // Misconception-targeted MCQs (distractors encode documented student errors)
  ...jsMisconceptionMCQs,
  ...sqlMisconceptionMCQs,
  // Data Modeling & Warehousing Design (Databricks)
  ...dataModelingQuestions,
  // Data Engineering Concepts course
  ...dataEngineeringFoundationsQuestions,
  ...dataEngineeringArchitectureQuestions,
  ...dataEngineeringModelingQuestions,
  ...dataEngineeringStreamingQuestions,
  ...dataEngineeringDistributedQuestions,
  ...dataEngineeringOpsQuestions,
  ...tsql_select_questions,
  ...tsql_filtering_questions,
  ...tsql_string_functions_questions,
  ...tsql_date_functions_questions,
  ...tsql_joins_questions,
  ...tsql_aggregation_questions,
  ...tsql_subqueries_cte_questions,
  ...tsql_set_ops_questions,
  ...tsql_dml_questions,
  ...tsql_windows_questions,
  ...tsql_window_frames_questions,
  ...tsql_lag_lead_questions,
  ...tsql_grouping_sets_questions,
  ...tsql_pivot_questions,
  ...tsql_ddl_tables_questions,
  ...tsql_types_questions,
  ...tsql_constraints_questions,
  ...tsql_views_questions,
  ...tsql_transactions_questions,
  ...tsql_isolation_questions,
  ...tsql_procedures_questions,
  ...tsql_control_flow_questions,
  ...tsql_error_handling_questions,
  ...tsql_facts_dims_questions,
  ...tsql_surrogate_keys_questions,
  ...tsql_star_schema_questions,
  ...tsql_scd_questions,
  ...tsql_normalization_questions,
  ...tsql_insert_questions,
  ...tsql_merge_questions,
  ...tsql_dedup_questions,
  ...tsql_etl_proc_questions,
  ...tsql_incremental_questions,
  ...tsql_quality_questions,
  ...tsql_indexes_questions,
  ...tsql_execution_plans_questions,
  ...tsql_partitioning_questions,
  ...tsql_columnstore_questions,
  ...tsql_antipatterns_questions,
  ...tsql_mpp_model_questions,
  ...tsql_synapse_fabric_questions,
  ...tsql_other_warehouses_questions,
  ...dj_admin_questions,
  ...dj_api_docs_questions,
  ...dj_auth_questions,
  ...dj_caching_questions,
  ...dj_celery_questions,
  ...dj_channels_questions,
  ...dj_cicd_questions,
  ...dj_custom_managers_questions,
  ...dj_deployment_questions,
  ...dj_factory_boy_questions,
  ...dj_file_uploads_questions,
  ...dj_forms_questions,
  ...dj_management_questions,
  ...dj_models_questions,
  ...dj_monitoring_questions,
  ...dj_nginx_questions,
  ...dj_orm_questions,
  ...dj_orm_mastery_questions,
  ...dj_models_mastery_questions,
  ...dj_views_mastery_questions,
  ...dj_forms_mastery_questions,
  ...dj_auth_mastery_questions,
  ...dj_rest_mastery_questions,
  ...dj_pagination_generics_questions,
  ...dj_postgres_questions,
  ...dj_redis_questions,
  ...dj_rest_questions,
  ...dj_service_layer_questions,
  ...dj_settings_questions,
  ...dj_setup_questions,
  ...dj_signals_mw_questions,
  ...dj_templates_questions,
  ...dj_transactions_questions,
  ...dj_urls_questions,
  ...dj_views_questions,
  ...dj_cbv_questions,
  ...py_async_questions,
  ...py_basics_questions,
  ...py_cli_questions,
  ...py_collections_questions,
  ...py_comprehensions_questions,
  ...py_generators_questions,
  ...py_threading_questions,
  ...py_futures_questions,
  ...py_context_managers_questions,
  ...py_daily_patterns_questions,
  ...py_data_structures_questions,
  ...py_dataclasses_questions,
  ...py_datetime_paths_questions,
  ...py_decorators_questions,
  ...py_error_handling_questions,
  ...py_file_io_questions,
  ...py_functions_questions,
  ...py_functools_questions,
  ...py_http_questions,
  ...py_itertools_questions,
  ...py_logging_questions,
  ...py_magic_methods_questions,
  ...py_modern_questions,
  ...py_modules_questions,
  ...py_oop_questions,
  ...py_oop_advanced_questions,
  ...py_metaclasses_questions,
  ...py_packaging_questions,
  ...py_pydantic_questions,
  ...py_regex_questions,
  ...py_security_questions,
  ...py_serialization_questions,
  ...py_shell_os_questions,
  ...py_testing_basics_questions,
  ...py_fixtures_questions,
  ...py_mocking_questions,
  ...py_type_hints_questions,
]);
