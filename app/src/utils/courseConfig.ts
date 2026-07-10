import { Course, Topic } from '../types';

/** Map every topic to its course. */
const WEB_DEV_TOPICS = new Set<string>([
  Topic.HTML_BASICS, Topic.HTML_FORMS, Topic.HTML_SEMANTIC,
  Topic.CSS_BASICS, Topic.CSS_LAYOUT, Topic.CSS_RESPONSIVE,
  Topic.TAILWIND, Topic.HTML_CSS_PROJECT,
  Topic.JS_VARIABLES_TYPES, Topic.JS_FUNCTIONS, Topic.JS_ARRAYS, Topic.JS_OBJECTS,
  Topic.JS_ASYNC, Topic.JS_ES6_PLUS, Topic.JS_DOM, Topic.JS_PROJECT,
  Topic.TS_BASIC_TYPES, Topic.TS_INTERFACES, Topic.TS_GENERICS,
  Topic.TS_ADVANCED_TYPES, Topic.TS_UTILITY_TYPES, Topic.TS_PROJECT,
  Topic.REACT_COMPONENTS, Topic.REACT_STATE, Topic.REACT_EFFECTS,
  Topic.REACT_HOOKS, Topic.REACT_CONTEXT, Topic.REACT_FORMS,
  Topic.REACT_PATTERNS, Topic.REACT_PROJECT,
  Topic.NEXT_ROUTING, Topic.NEXT_SERVER_COMPONENTS, Topic.NEXT_DATA_FETCHING,
  Topic.NEXT_API_ROUTES, Topic.NEXT_MIDDLEWARE, Topic.NEXT_OPTIMIZATION,
  Topic.NEXT_AUTH, Topic.NEXT_DEPLOYMENT,
  Topic.NEXT_PRISMA, Topic.NEXT_FORMS_VALIDATION, Topic.NEXT_TESTING,
  Topic.NEXT_TANSTACK, Topic.NEXT_URL_STATE, Topic.NEXT_ERROR_HANDLING,
  Topic.NEXT_AUTH_DEEP, Topic.ACCESSIBILITY, Topic.NEXT_SHADCN,
  Topic.PATTERNS_CREATIONAL, Topic.PATTERNS_STRUCTURAL, Topic.PATTERNS_BEHAVIORAL,
  Topic.PATTERNS_ARCHITECTURAL, Topic.API_DESIGN, Topic.DB_DESIGN,
]);

const BACKEND_TOPICS = new Set<string>([
  Topic.PY_BASICS, Topic.PY_DATA_STRUCTURES, Topic.PY_FUNCTIONS,
  Topic.PY_OOP, Topic.PY_OOP_ADVANCED, Topic.PY_METACLASSES, Topic.PY_MODULES, Topic.PY_FILE_IO,
  Topic.PY_ERROR_HANDLING, Topic.PY_DECORATORS,
  Topic.PY_ASYNC, Topic.PY_TYPE_HINTS, Topic.PY_COMPREHENSIONS,
  Topic.PY_GENERATORS,
  Topic.PY_COLLECTIONS, Topic.PY_ITERTOOLS, Topic.PY_REGEX,
  Topic.PY_CONTEXT_MANAGERS, Topic.PY_MAGIC_METHODS, Topic.PY_DATACLASSES,
  Topic.PY_TESTING_BASICS, Topic.PY_FIXTURES, Topic.PY_MOCKING,
  Topic.PY_HTTP, Topic.PY_FUNCTOOLS, Topic.PY_LOGGING,
  Topic.PY_DATETIME_PATHS, Topic.PY_SERIALIZATION, Topic.PY_PYDANTIC,
  Topic.PY_THREADING, Topic.PY_FUTURES, Topic.PY_SECURITY, Topic.PY_SHELL_OS,
  Topic.PY_CLI, Topic.PY_PACKAGING,
  Topic.DJ_SETUP, Topic.DJ_MODELS, Topic.DJ_ORM, Topic.DJ_VIEWS, Topic.DJ_CBV, Topic.DJ_TEMPLATES,
  Topic.DJ_URLS, Topic.DJ_FORMS, Topic.DJ_AUTH,
  Topic.DJ_REST,
  Topic.DJ_ORM_MASTERY, Topic.DJ_MODELS_MASTERY, Topic.DJ_VIEWS_MASTERY, Topic.DJ_FORMS_MASTERY,
  Topic.DJ_AUTH_MASTERY, Topic.DJ_REST_MASTERY,
  Topic.DJ_ADMIN, Topic.DJ_CACHING, Topic.DJ_TRANSACTIONS,
  Topic.DJ_DEPLOYMENT, Topic.DJ_MANAGEMENT, Topic.DJ_SIGNALS_MW,
  Topic.PY_DAILY_PATTERNS, Topic.DJ_CELERY, Topic.DJ_PAGINATION_GENERICS,
  Topic.DJ_API_DOCS, Topic.DJ_FACTORY_BOY, Topic.DJ_CICD,
  Topic.DJ_REDIS, Topic.DJ_CUSTOM_MANAGERS, Topic.DJ_NGINX,
  Topic.DJ_POSTGRES, Topic.DJ_SERVICE_LAYER, Topic.DJ_FILE_UPLOADS,
  Topic.DJ_SETTINGS, Topic.DJ_CHANNELS, Topic.DJ_MONITORING,
  Topic.PY_MODERN,
]);

const DATA_ENG_TOPICS = new Set<string>([
  // Foundations — rebuilt as small beginner-first topics
  Topic.DE_WHAT_IS, Topic.DE_BATCH_VS_STREAMING, Topic.DE_OLTP_VS_OLAP,
  Topic.DE_ROWS_VS_COLUMNS, Topic.DE_WHAT_IS_A_FILE_FORMAT, Topic.DE_PARQUET_BASICS,
  Topic.DE_OBJECT_STORAGE, Topic.DE_DATA_LAKE_WAREHOUSE,
  Topic.DE_WHAT_IS_ETL, Topic.DE_ETL_VS_ELT, Topic.DE_LAKEHOUSE,
  Topic.DE_TABLE_FORMATS_INTRO, Topic.DE_ICEBERG_DELTA_HUDI, Topic.DE_TRANSFORMATION_TOOLS,
  // Modeling Concepts
  Topic.DE_WHY_MODEL, Topic.DE_TABLES_FACTS_DIMS, Topic.DE_STAR_SCHEMA,
  Topic.DE_KEYS_GRAIN, Topic.DE_SCD, Topic.DE_DATA_MESH,
  // Streaming
  Topic.DE_WHAT_IS_A_STREAM, Topic.DE_EVENT_VS_PROCESSING_TIME, Topic.DE_WINDOWS,
  Topic.DE_KAFKA_BASICS, Topic.DE_CDC, Topic.DE_STREAMING_GUARANTEES, Topic.DE_STREAMING_SQL,
  // Distributed Systems & Storage
  Topic.DE_WHY_DISTRIBUTE, Topic.DE_PARTITIONING, Topic.DE_REPLICATION,
  Topic.DE_LSM_VS_BTREE, Topic.DE_COMPACTION_BLOOM,
  // Operations, Quality & Modern DE
  Topic.DE_WHAT_IS_ORCHESTRATION, Topic.DE_AIRFLOW_DAGSTER, Topic.DE_RETRIES_IDEMPOTENCY,
  Topic.DE_DATA_QUALITY_BASICS, Topic.DE_OBSERVABILITY_LINEAGE, Topic.DE_GOVERNANCE,
  Topic.DE_FOR_AI,
]);

const SQL_TOPICS = new Set<string>([
  // Pillar 1 — Querying Foundations
  Topic.TSQL_SELECT, Topic.TSQL_FILTERING, Topic.TSQL_JOINS, Topic.TSQL_AGGREGATION,
  Topic.TSQL_SUBQUERIES_CTE, Topic.TSQL_SET_OPS,
  // Pillar 2 — DDL & Constraints
  Topic.TSQL_DDL_TABLES, Topic.TSQL_TYPES, Topic.TSQL_CONSTRAINTS, Topic.TSQL_VIEWS,
  // Pillar 3 — Analytical & Window SQL
  Topic.TSQL_WINDOWS, Topic.TSQL_WINDOW_FRAMES, Topic.TSQL_LAG_LEAD,
  Topic.TSQL_GROUPING_SETS, Topic.TSQL_PIVOT,
  // Pillar 4 — Transactions & Procedural T-SQL
  Topic.TSQL_TRANSACTIONS, Topic.TSQL_ISOLATION, Topic.TSQL_PROCEDURES,
  Topic.TSQL_CONTROL_FLOW, Topic.TSQL_ERROR_HANDLING,
  // Pillar 5 — Data Modeling in SQL
  Topic.TSQL_FACTS_DIMS, Topic.TSQL_SURROGATE_KEYS, Topic.TSQL_STAR_SCHEMA,
  Topic.TSQL_SCD, Topic.TSQL_NORMALIZATION,
  // Pillar 6 — ELT & Transformation Patterns
  Topic.TSQL_INSERT, Topic.TSQL_MERGE, Topic.TSQL_DEDUP, Topic.TSQL_ETL_PROC,
  Topic.TSQL_INCREMENTAL, Topic.TSQL_QUALITY,
  // Pillar 7 — Performance & Optimization
  Topic.TSQL_INDEXES, Topic.TSQL_EXECUTION_PLANS, Topic.TSQL_PARTITIONING,
  Topic.TSQL_COLUMNSTORE, Topic.TSQL_ANTIPATTERNS,
  // Pillar 8 — Cloud Warehouse SQL
  Topic.TSQL_MPP_MODEL, Topic.TSQL_SYNAPSE_FABRIC, Topic.TSQL_OTHER_WAREHOUSES,
]);

export function getCourseForTopic(topic: Topic | string): Course {
  if (WEB_DEV_TOPICS.has(topic)) return Course.WEB_DEV;
  if (BACKEND_TOPICS.has(topic)) return Course.BACKEND;
  if (DATA_ENG_TOPICS.has(topic)) return Course.DATA_ENGINEERING;
  if (SQL_TOPICS.has(topic)) return Course.SQL;
  return Course.DATABRICKS;
}

/** Exam sections for each course (used by ProgressTracker) */
export const DATABRICKS_SECTIONS: Record<string, { weight: string; topics: Record<string, string[]> }> = {
  'Lakehouse Platform': {
    weight: '24%',
    topics: {
      'Workspace, Clusters & Repos': ['databricks_basics', 'databricks_platform'],
      'Delta Lake Fundamentals': ['delta_lake_basics'],
      'Delta Operations (MERGE, CLONE)': ['delta_operations'],
      'Delta Time Travel': ['delta_time_travel'],
      'Delta Optimization (OPTIMIZE, VACUUM, ZORDER)': ['delta_optimization'],
      'Databricks Utilities (dbutils)': ['databricks_utilities'],
    },
  },
  'ELT with Spark SQL & Python': {
    weight: '29%',
    topics: {
      'DataFrame Basics (select, filter, withColumn)': ['pyspark_basics', 'pyspark_dataframes'],
      'Transformations (map, flatMap, groupBy)': ['pyspark_transformations', 'pyspark_actions'],
      'String Functions (upper, lower, concat, trim, regexp)': ['string_functions'],
      'Date & Time Functions (date_format, datediff, to_date)': ['datetime_functions'],
      'Collection Functions (arrays, maps, explode)': ['collection_functions'],
      'Math & Aggregate Functions (sum, avg, round)': ['math_functions'],
      'Null Handling (coalesce, isNull, fillna)': ['null_handling'],
      'SQL Joins (inner, left, right, cross, self)': ['sql_joins'],
      'SQL Aggregations & GROUP BY': ['sql_aggregations', 'sql_subqueries'],
      'Window Functions (row_number, rank, lag, lead)': ['window_functions', 'sql_window_functions'],
      'Spark SQL & Set Operations': ['spark_sql', 'sql_set_operations'],
    },
  },
  'Incremental Data Processing': {
    weight: '22%',
    topics: {
      'Structured Streaming (readStream, writeStream, triggers)': ['structured_streaming'],
      'Auto Loader (cloudFiles, schema evolution)': ['auto_loader'],
      'Medallion Architecture (bronze/silver/gold)': ['medallion_architecture'],
      'Change Data Capture (CDF, table_changes)': ['change_data_capture'],
    },
  },
  'Production Pipelines': {
    weight: '16%',
    topics: {
      'Delta Live Tables (DLT, expectations)': ['delta_live_tables'],
      'Workflows & Job Orchestration': ['databricks_workflows'],
    },
  },
  'Optimization & Advanced': {
    weight: '9%',
    topics: {
      'Spark Optimization (caching, broadcast, partitioning)': ['spark_optimization'],
      'Advanced Concepts': ['advanced_topics'],
    },
  },
  'Data Governance': {
    weight: '9%',
    topics: {
      'Unity Catalog (namespaces, managed/external)': ['data_governance'],
      'Access Controls (GRANT, REVOKE, permissions)': ['data_governance'],
    },
  },
  'Data Modeling & Warehousing Design': {
    weight: 'Beyond cert',
    topics: {
      'Dimensional Modeling (star schema, fact/dim, grain, surrogate keys)': ['data_modeling'],
      'Slowly Changing Dimensions (SCD Type 1 / 2 / 3, MERGE patterns)': ['scd_patterns'],
      'Pipeline Design (idempotency, late arrivals, backfill, contracts)': ['pipeline_design'],
    },
  },
};

export const WEBDEV_SECTIONS: Record<string, { weight: string; topics: Record<string, string[]> }> = {
  'HTML, CSS & Tailwind': {
    weight: 'Step 1',
    topics: {
      'HTML Basics (elements, attributes, structure)': ['html_basics'],
      'HTML Forms (inputs, validation, accessibility)': ['html_forms'],
      'Semantic HTML (header, nav, main, article)': ['html_semantic'],
      'CSS Basics (selectors, box model, colors)': ['css_basics'],
      'CSS Layout (flexbox, grid, positioning)': ['css_layout'],
      'Responsive Design (media queries, mobile-first)': ['css_responsive'],
      'Tailwind CSS (utility classes, responsive)': ['tailwind'],
      'HTML/CSS Project': ['html_css_project'],
    },
  },
  'JavaScript Fundamentals': {
    weight: 'Step 2',
    topics: {
      'Variables, Types & Destructuring': ['js_variables_types'],
      'Functions (arrow, closures, higher-order)': ['js_functions'],
      'Arrays (map, filter, reduce, find)': ['js_arrays'],
      'Objects & Spread': ['js_objects'],
      'Async/Await & Promises': ['js_async'],
      'ES6+ Features': ['js_es6_plus'],
      'DOM Manipulation': ['js_dom'],
      'JS Project': ['js_project'],
    },
  },
  'React': {
    weight: 'Step 3',
    topics: {
      'Components & JSX': ['react_components'],
      'State (useState)': ['react_state'],
      'Effects (useEffect, cleanup)': ['react_effects'],
      'Hooks (useRef, useMemo, custom hooks)': ['react_hooks'],
      'Context (createContext, useContext)': ['react_context'],
      'Forms & Events': ['react_forms'],
      'Patterns & Best Practices': ['react_patterns'],
      'React Project': ['react_project'],
    },
  },
  'TypeScript': {
    weight: 'Step 4',
    topics: {
      'Basic Types & Functions': ['ts_basic_types'],
      'Interfaces & Type Aliases': ['ts_interfaces'],
      'Generics': ['ts_generics'],
      'Advanced Types (unions, guards, narrowing)': ['ts_advanced_types'],
      'Utility Types (Partial, Pick, Omit, Record)': ['ts_utility_types'],
      'TS Project': ['ts_project'],
    },
  },
  'Next.js': {
    weight: 'Step 5',
    topics: {
      'App Router & Routing': ['next_routing'],
      'Server & Client Components': ['next_server_components'],
      'Data Fetching & Caching': ['next_data_fetching'],
      'API Routes & Server Actions': ['next_api_routes'],
      'Middleware & Auth': ['next_middleware', 'next_auth'],
      'Optimization & Deployment': ['next_optimization', 'next_deployment'],
    },
  },
  'Prisma & Database': {
    weight: 'Step 6',
    topics: {
      'Prisma Schema & Migrations': ['next_prisma'],
    },
  },
  'Forms & Validation (RHF + Zod)': {
    weight: 'Step 7',
    topics: {
      'React Hook Form + Zod Validation': ['next_forms_validation'],
    },
  },
  'Testing': {
    weight: 'Step 8',
    topics: {
      'Jest, React Testing Library & Playwright': ['next_testing'],
    },
  },
  'Advanced Next.js Patterns': {
    weight: 'Step 9',
    topics: {
      'TanStack Query (Server State)': ['next_tanstack'],
      'URL State & Search Patterns': ['next_url_state'],
      'Error Handling & Auth Depth': ['next_error_handling', 'next_auth_deep'],
    },
  },
  'Accessibility': {
    weight: 'Step 10',
    topics: {
      'WCAG, ARIA & Keyboard Navigation': ['accessibility'],
    },
  },
  'UI Libraries & Advanced Styling': {
    weight: 'Step 11',
    topics: {
      'shadcn/ui, Radix & Advanced Tailwind': ['next_shadcn'],
    },
  },
  'Design Patterns & Architecture': {
    weight: 'Step 12',
    topics: {
      'Creational Patterns (Factory, Singleton, Builder)': ['patterns_creational'],
      'Structural Patterns (Adapter, Decorator, Facade)': ['patterns_structural'],
      'Behavioral Patterns (Observer, Strategy, Command)': ['patterns_behavioral'],
      'Architectural Patterns (MVC, MVVM, Clean Architecture)': ['patterns_architectural'],
      'API Design (REST, status codes, pagination)': ['api_design'],
      'Database Design (normalization, indexes, relations)': ['db_design'],
    },
  },
};

export const BACKEND_SECTIONS: Record<string, { weight: string; topics: Record<string, string[]> }> = {
  'Python Fundamentals': {
    weight: 'Step 1',
    topics: {
      'Variables, Types & Strings': ['py_basics'],
      'Data Structures (list, dict, set, tuple)': ['py_data_structures'],
      'Functions & Scope': ['py_functions'],
      'OOP Basics (classes, inheritance, methods)': ['py_oop'],
      'Modules & Packages': ['py_modules'],
      'File I/O': ['py_file_io'],
      'Error Handling (try/except)': ['py_error_handling'],
      'Decorators': ['py_decorators'],
    },
  },
  'Python Advanced': {
    weight: 'Step 2',
    topics: {
      // Core depth — modern-Python building blocks the rest of the section assumes
      'Type Hints & Dataclasses': ['py_type_hints', 'py_dataclasses'],
      'Comprehensions': ['py_comprehensions'],
      'Generators (yield, coroutines)': ['py_generators'],
      'Collections & Itertools': ['py_collections', 'py_itertools'],
      'functools Deep Dive': ['py_functools'],
      'Context Managers': ['py_context_managers'],
      'Magic Methods': ['py_magic_methods'],
      'Advanced OOP & ABCs': ['py_oop_advanced'],
      'Metaclasses & Introspection': ['py_metaclasses'],
      // Stdlib utilities — everyday tools
      'Regex': ['py_regex'],
      'Logging (Python stdlib)': ['py_logging'],
      'Dates, Times & Paths': ['py_datetime_paths'],
      'JSON & Serialization': ['py_serialization'],
      'Testing Basics (pytest)': ['py_testing_basics'],
      'Pytest Fixtures': ['py_fixtures'],
      'Mocking & Patching': ['py_mocking'],
      // I/O & validation — talking to the outside world
      'Pydantic Data Validation': ['py_pydantic'],
      'HTTP Clients (requests, httpx)': ['py_http'],
      'Security Primitives (hashing, tokens, HMAC)': ['py_security'],
      // Concurrency — last because it's the hardest; threading first to build the model
      'Threading & Synchronization': ['py_threading'],
      'Parallelism (futures, multiprocessing)': ['py_futures'],
      'Async/Await': ['py_async'],
      // OS & distribution
      'Shell & OS Interop (subprocess, shutil, tempfile)': ['py_shell_os'],
      'CLI Tools & Config (argparse, click, dotenv)': ['py_cli'],
      'Packaging & Environments (venv, pyproject, uv)': ['py_packaging'],
    },
  },
  'Django': {
    weight: 'Step 3',
    topics: {
      'Setup & Project Structure': ['dj_setup'],
      'Models & Migrations': ['dj_models'],
      'ORM (QuerySets, filtering, relations)': ['dj_orm'],
      'Views & Request/Response (FBV)': ['dj_views'],
      'Class-Based & Generic Views': ['dj_cbv'],
      'Templates & Template Tags': ['dj_templates'],
      'URLs & Routing': ['dj_urls'],
      'Forms & Validation': ['dj_forms'],
      'Authentication & Permissions': ['dj_auth'],
      'Django REST Framework': ['dj_rest'],
    },
  },
  'Django Advanced & Deployment': {
    weight: 'Step 4',
    topics: {
      'ORM Mastery (deep revisit)': ['dj_orm_mastery'],
      'Models Mastery (deep revisit)': ['dj_models_mastery'],
      'Views Mastery (deep revisit)': ['dj_views_mastery'],
      'Forms Mastery (deep revisit)': ['dj_forms_mastery'],
      'Auth Mastery (deep revisit)': ['dj_auth_mastery'],
      'DRF Mastery (deep revisit)': ['dj_rest_mastery'],
      'Admin Customization': ['dj_admin'],
      'Caching & Transactions': ['dj_caching', 'dj_transactions'],
      'Signals & Middleware': ['dj_signals_mw'],
      'Management Commands & Deployment': ['dj_management', 'dj_deployment'],
    },
  },
  'DRF Production Patterns': {
    weight: 'Step 5',
    topics: {
      'Pagination & Generic Views': ['dj_pagination_generics'],
      'API Documentation (drf-spectacular)': ['dj_api_docs'],
      'Custom Managers & Service Layer': ['dj_custom_managers', 'dj_service_layer'],
    },
  },
  'Celery & Background Tasks': {
    weight: 'Step 6',
    topics: {
      'Celery Tasks & Scheduling': ['dj_celery'],
      'Redis (Caching, Queues, Sessions)': ['dj_redis'],
    },
  },
  'Testing & CI/CD': {
    weight: 'Step 7',
    topics: {
      'Factory Boy & Advanced Testing': ['dj_factory_boy'],
      'CI/CD with GitHub Actions': ['dj_cicd'],
    },
  },
  'Production Infrastructure': {
    weight: 'Step 8',
    topics: {
      'Nginx & Reverse Proxy': ['dj_nginx'],
      'Django Settings & Environment': ['dj_settings'],
      'File Uploads & Storage': ['dj_file_uploads'],
      'PostgreSQL Features': ['dj_postgres'],
    },
  },
  'Python Mastery & Advanced': {
    weight: 'Step 9',
    topics: {
      'Daily Python Patterns': ['py_daily_patterns'],
      'Modern Python (3.10+)': ['py_modern'],
    },
  },
  'Real-time & Monitoring': {
    weight: 'Step 10',
    topics: {
      'WebSockets (Django Channels)': ['dj_channels'],
      'Monitoring & Observability': ['dj_monitoring'],
    },
  },
};

/**
 * Learning path orders.
 * Each section unlocks after 70% coverage of the previous section.
 */
export const WEBDEV_PATH_ORDER = [
  'HTML, CSS & Tailwind',
  'JavaScript Fundamentals',
  'React',
  'TypeScript',
  'Next.js',
  'Prisma & Database',
  'Forms & Validation (RHF + Zod)',
  'Testing',
  'Advanced Next.js Patterns',
  'Accessibility',
  'UI Libraries & Advanced Styling',
  'Design Patterns & Architecture',
];

export const BACKEND_PATH_ORDER = [
  'Python Fundamentals',
  'Python Advanced',
  'Django',
  'Django Advanced & Deployment',
  'DRF Production Patterns',
  'Celery & Background Tasks',
  'Testing & CI/CD',
  'Production Infrastructure',
  'Python Mastery & Advanced',
  'Real-time & Monitoring',
];

export const DATABRICKS_PATH_ORDER = [
  'Lakehouse Platform',
  'ELT with Spark SQL & Python',
  'Incremental Data Processing',
  'Production Pipelines',
  'Optimization & Advanced',
  'Data Governance',
  'Data Modeling & Warehousing Design',
];

/**
 * Data Engineering Concepts course — tool-agnostic, MCQ-only.
 * Built as many small topics, each ramping from a TRUE beginner intro (plain
 * "what does this term mean" vocabulary) up through applied "when to use what"
 * choices to mastery-level tradeoffs (distributed-systems internals, streaming
 * exactly-once semantics, open-table-format guts). The selector serves
 * beginner-first within a topic and gates harder tiers behind beginner mastery.
 */
export const DATA_ENG_SECTIONS: Record<string, { weight: string; topics: Record<string, string[]> }> = {
  'Foundations': {
    weight: 'Step 1',
    topics: {
      'What Is Data Engineering?': ['de_what_is'],
      'Batch vs Streaming': ['de_batch_vs_streaming'],
      'OLTP vs OLAP': ['de_oltp_vs_olap'],
      'Row vs Columnar Storage': ['de_rows_vs_columns'],
      'What Is a File Format?': ['de_what_is_a_file_format'],
      'Parquet Basics': ['de_parquet_basics'],
      'Object Storage Basics': ['de_object_storage'],
      'Data Lake vs Data Warehouse': ['de_data_lake_warehouse'],
    },
  },
  'Architecture & Open Table Formats': {
    weight: 'Step 2',
    topics: {
      'What Is ETL/ELT?': ['de_what_is_etl'],
      'ETL vs ELT': ['de_etl_vs_elt'],
      'What Is a Lakehouse?': ['de_lakehouse'],
      'Why Put Tables on Files?': ['de_table_formats_intro'],
      'Iceberg, Delta & Hudi': ['de_iceberg_delta_hudi'],
      'Transformation Tools (dbt / SQLMesh)': ['de_transformation_tools'],
    },
  },
  'Modeling Concepts': {
    weight: 'Step 3',
    topics: {
      'Why Model Data?': ['de_why_model'],
      'Facts & Dimensions': ['de_tables_facts_dims'],
      'Star Schema': ['de_star_schema'],
      'Keys & Grain': ['de_keys_grain'],
      'Slowly Changing Dimensions': ['de_scd'],
      'Data Mesh': ['de_data_mesh'],
    },
  },
  'Streaming': {
    weight: 'Step 4',
    topics: {
      'What Is a Stream?': ['de_what_is_a_stream'],
      'Event Time vs Processing Time': ['de_event_vs_processing_time'],
      'Windows & Watermarks': ['de_windows'],
      'Kafka Basics': ['de_kafka_basics'],
      'Change Data Capture (CDC)': ['de_cdc'],
      'Delivery Guarantees': ['de_streaming_guarantees'],
      'Streaming SQL': ['de_streaming_sql'],
    },
  },
  'Distributed Systems & Storage': {
    weight: 'Step 5',
    topics: {
      'Why Distribute?': ['de_why_distribute'],
      'Partitioning & Sharding': ['de_partitioning'],
      'Replication & Consistency': ['de_replication'],
      'LSM Trees vs B-Trees': ['de_lsm_vs_btree'],
      'Compaction & Bloom Filters': ['de_compaction_bloom'],
    },
  },
  'Operations, Quality & Modern DE': {
    weight: 'Step 6',
    topics: {
      'What Is Orchestration?': ['de_what_is_orchestration'],
      'Airflow, Dagster & Prefect': ['de_airflow_dagster'],
      'Retries, Sensors & Idempotency': ['de_retries_idempotency'],
      'Data Quality Basics': ['de_data_quality_basics'],
      'Observability & Lineage': ['de_observability_lineage'],
      'Governance': ['de_governance'],
      'Data Engineering for AI': ['de_for_ai'],
    },
  },
};

export const DATA_ENG_PATH_ORDER = [
  'Foundations',
  'Architecture & Open Table Formats',
  'Modeling Concepts',
  'Streaming',
  'Distributed Systems & Storage',
  'Operations, Quality & Modern DE',
];

/**
 * SQL for Data Engineering course — T-SQL (SQL Server / Synapse / Fabric).
 * Coding course, all five question types; primitive-first pillars (DDL pilot
 * shipped first, then Querying, then the rest in path order). Sections are added
 * as each pillar is authored — only sections with questions are registered so the
 * unlock/coverage math never sees an empty section. See SQL_FOR_DE_COURSE_SPEC.md.
 */
export const SQL_SECTIONS: Record<string, { weight: string; topics: Record<string, string[]> }> = {
  'Querying Foundations': {
    weight: 'Step 1',
    topics: {
      'SELECT, WHERE, ORDER BY, TOP': ['tsql_select'],
      'Filtering, NULLs & CASE': ['tsql_filtering'],
      'Joins': ['tsql_joins'],
      'Aggregation & GROUP BY': ['tsql_aggregation'],
      'Subqueries & CTEs': ['tsql_subqueries_cte'],
      'Set Operations': ['tsql_set_ops'],
    },
  },
  'DDL & Constraints': {
    weight: 'Step 2',
    topics: {
      'Creating & Altering Tables': ['tsql_ddl_tables'],
      'Data Types': ['tsql_types'],
      'Constraints (PK, FK, CHECK)': ['tsql_constraints'],
      'Views & Computed Columns': ['tsql_views'],
    },
  },
  'Analytical & Window SQL': {
    weight: 'Step 3',
    topics: {
      'Window Functions (ROW_NUMBER, RANK)': ['tsql_windows'],
      'Window Frames & Running Totals': ['tsql_window_frames'],
      'LAG / LEAD & Period-over-Period': ['tsql_lag_lead'],
      'GROUPING SETS, ROLLUP, CUBE': ['tsql_grouping_sets'],
      'PIVOT & Conditional Aggregation': ['tsql_pivot'],
    },
  },
  'Transactions & Procedural T-SQL': {
    weight: 'Step 4',
    topics: {
      'Transactions (BEGIN TRAN, COMMIT, ROLLBACK)': ['tsql_transactions'],
      'Isolation Levels & Locking': ['tsql_isolation'],
      'Stored Procedures': ['tsql_procedures'],
      'Control Flow & Functions': ['tsql_control_flow'],
      'Error Handling (TRY…CATCH)': ['tsql_error_handling'],
    },
  },
  'Data Modeling in SQL': {
    weight: 'Step 5',
    topics: {
      'Facts & Dimensions': ['tsql_facts_dims'],
      'Surrogate Keys': ['tsql_surrogate_keys'],
      'Star Schema': ['tsql_star_schema'],
      'Slowly Changing Dimensions': ['tsql_scd'],
      'Normalization Tradeoffs': ['tsql_normalization'],
    },
  },
  'ELT & Transformation Patterns': {
    weight: 'Step 6',
    topics: {
      'INSERT & OUTPUT': ['tsql_insert'],
      'MERGE (Upsert)': ['tsql_merge'],
      'Deduplication': ['tsql_dedup'],
      'Staging → Target Load Procedures': ['tsql_etl_proc'],
      'Incremental Loads': ['tsql_incremental'],
      'Data Quality Checks': ['tsql_quality'],
    },
  },
  'Performance & Optimization': {
    weight: 'Step 7',
    topics: {
      'Indexes (Clustered, Covering)': ['tsql_indexes'],
      'Execution Plans': ['tsql_execution_plans'],
      'Partitioning': ['tsql_partitioning'],
      'Columnstore': ['tsql_columnstore'],
      'Query Anti-patterns': ['tsql_antipatterns'],
    },
  },
  'Cloud Warehouse SQL': {
    weight: 'Step 8',
    topics: {
      'MPP & Cost Models': ['tsql_mpp_model'],
      'Synapse / Fabric (Distribution, CTAS)': ['tsql_synapse_fabric'],
      'Snowflake & BigQuery': ['tsql_other_warehouses'],
    },
  },
};

export const SQL_PATH_ORDER = [
  'Querying Foundations',
  'DDL & Constraints',
  'Analytical & Window SQL',
  'Transactions & Procedural T-SQL',
  'Data Modeling in SQL',
  'ELT & Transformation Patterns',
  'Performance & Optimization',
  'Cloud Warehouse SQL',
];

/** All topic keys for a given section name */
export function getTopicKeysForSection(sectionName: string): string[] {
  const sections = { ...DATABRICKS_SECTIONS, ...WEBDEV_SECTIONS, ...BACKEND_SECTIONS, ...DATA_ENG_SECTIONS, ...SQL_SECTIONS };
  const section = sections[sectionName];
  if (!section) return [];
  return Object.values(section.topics).flat();
}

/**
 * Units (display name + its topic keys) for a section, in declared order.
 * Used for topic-level gating within a section.
 */
export function getSectionUnits(sectionName: string): Array<[string, string[]]> {
  const sections = { ...DATABRICKS_SECTIONS, ...WEBDEV_SECTIONS, ...BACKEND_SECTIONS, ...DATA_ENG_SECTIONS, ...SQL_SECTIONS };
  const section = sections[sectionName];
  if (!section) return [];
  return Object.entries(section.topics);
}

/**
 * Per-course selection policy. Centralises the small set of knobs that the
 * next-question selector needs to know about a course, so the selector itself
 * stays generic — no `if (course === DATA_ENGINEERING)` branches buried in
 * bucketing/scoring code.
 *
 * Building a policy is cheap (no allocations besides the object) so it's fine
 * to recompute per render in App.
 */
export interface SelectionPolicy {
  course: Course;
  /** Topic order array used to sort the available pool. */
  topicOrder: string[];
  /** True when the course has tagged concepts and the concept-aware path
   *  should be tried before falling back to legacy. False for courses where
   *  concept tags don't exist yet (e.g. Data Engineering) — saves a pointless
   *  bucketing pass that always returns null. */
  useConceptSRS: boolean;
}

export function getSelectionPolicy(course: Course): SelectionPolicy {
  return {
    course,
    topicOrder: getTopicOrder(course),
    // Backend, Web Dev, and Databricks have concept tags rolled out. Data
    // Engineering is MCQ-only and untagged today; the SQL course is not yet
    // concept-tagged. Concept-aware would no-op for both, so skip it.
    useConceptSRS: course !== Course.DATA_ENGINEERING && course !== Course.SQL,
  };
}

/**
 * Get the progressive topic order for a course.
 * Returns a flat array of topic keys in the order they should be learned.
 * Used to sort questions so newQuestions[0] is always the right next step.
 */
export function getTopicOrder(course: Course): string[] {
  const pathOrder = course === Course.WEB_DEV ? WEBDEV_PATH_ORDER
    : course === Course.BACKEND ? BACKEND_PATH_ORDER
    : course === Course.DATABRICKS ? DATABRICKS_PATH_ORDER
    : course === Course.DATA_ENGINEERING ? DATA_ENG_PATH_ORDER
    : course === Course.SQL ? SQL_PATH_ORDER
    : null;
  if (!pathOrder) return [];

  const sections = course === Course.WEB_DEV ? WEBDEV_SECTIONS
    : course === Course.BACKEND ? BACKEND_SECTIONS
    : course === Course.DATA_ENGINEERING ? DATA_ENG_SECTIONS
    : course === Course.SQL ? SQL_SECTIONS
    : DATABRICKS_SECTIONS;

  const order: string[] = [];
  for (const sectionName of pathOrder) {
    const section = sections[sectionName];
    if (!section) continue;
    for (const topicKeys of Object.values(section.topics)) {
      for (const key of topicKeys) {
        if (!order.includes(key)) {
          order.push(key);
        }
      }
    }
  }
  return order;
}
