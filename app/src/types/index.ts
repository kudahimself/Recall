export enum Course {
  DATABRICKS = 'databricks',
  WEB_DEV = 'web_dev',
  BACKEND = 'backend',
  DATA_ENGINEERING = 'data_engineering',
  SQL = 'sql',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  CODING = 'coding',
  PARSONS = 'parsons',
  PREDICT_OUTPUT = 'predict_output',
  CLOZE_CODE = 'cloze_code',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Topic {
  DATABRICKS_BASICS = 'databricks_basics',
  PYSPARK_BASICS = 'pyspark_basics',
  PYSPARK_DATAFRAMES = 'pyspark_dataframes',
  PYSPARK_TRANSFORMATIONS = 'pyspark_transformations',
  PYSPARK_ACTIONS = 'pyspark_actions',
  SPARK_SQL = 'spark_sql',
  SPARK_OPTIMIZATION = 'spark_optimization',
  ADVANCED_TOPICS = 'advanced_topics',

  // New function-specific topics
  STRING_FUNCTIONS = 'string_functions',
  DATETIME_FUNCTIONS = 'datetime_functions',
  COLLECTION_FUNCTIONS = 'collection_functions',
  MATH_FUNCTIONS = 'math_functions',
  WINDOW_FUNCTIONS = 'window_functions',
  NULL_HANDLING = 'null_handling',

  // Delta Lake topics
  DELTA_LAKE_BASICS = 'delta_lake_basics',
  DELTA_OPERATIONS = 'delta_operations',
  DELTA_TIME_TRAVEL = 'delta_time_travel',
  DELTA_OPTIMIZATION = 'delta_optimization',

  // Advanced SQL topics
  SQL_JOINS = 'sql_joins',
  SQL_AGGREGATIONS = 'sql_aggregations',
  SQL_SUBQUERIES = 'sql_subqueries',
  SQL_WINDOW_FUNCTIONS = 'sql_window_functions',
  SQL_SET_OPERATIONS = 'sql_set_operations',

  // Databricks platform
  DATABRICKS_PLATFORM = 'databricks_platform',
  DATABRICKS_UTILITIES = 'databricks_utilities',
  DATABRICKS_COMPUTE_ADMIN = 'databricks_compute_admin',
  DATABRICKS_STORAGE_REPOS = 'databricks_storage_repos',
  DATABRICKS_NOTEBOOKS_SECURITY = 'databricks_notebooks_security',

  // Streaming & incremental
  STRUCTURED_STREAMING = 'structured_streaming',
  AUTO_LOADER = 'auto_loader',
  MEDALLION_ARCHITECTURE = 'medallion_architecture',
  CHANGE_DATA_CAPTURE = 'change_data_capture',

  // Production pipelines
  DELTA_LIVE_TABLES = 'delta_live_tables',
  DATABRICKS_WORKFLOWS = 'databricks_workflows',

  // Governance & Unity Catalog
  UNITY_CATALOG_BASICS = 'unity_catalog_basics',
  UNITY_CATALOG_GOVERNANCE = 'unity_catalog_governance',
  DATA_GOVERNANCE = 'data_governance',

  // Data Modeling & Warehousing Design
  DATA_MODELING = 'data_modeling',
  SCD_PATTERNS = 'scd_patterns',
  PIPELINE_DESIGN = 'pipeline_design',

  // Lakehouse Architecture & Engineering Practice
  ORCHESTRATION_DESIGN = 'orchestration_design',
  GOLD_LAYER_DESIGN = 'gold_layer_design',
  INGESTION_ARCHITECTURE = 'ingestion_architecture',

  // ── Data Engineering Concepts (tool-agnostic, MCQ-only, beginner→mastery) ──
  // Foundations (small topics, each ramps from a plain beginner intro upward)
  DE_WHAT_IS = 'de_what_is',
  DE_BATCH_VS_STREAMING = 'de_batch_vs_streaming',
  DE_OLTP_VS_OLAP = 'de_oltp_vs_olap',
  DE_ROWS_VS_COLUMNS = 'de_rows_vs_columns',
  DE_WHAT_IS_A_FILE_FORMAT = 'de_what_is_a_file_format',
  DE_PARQUET_BASICS = 'de_parquet_basics',
  DE_OBJECT_STORAGE = 'de_object_storage',
  DE_DATA_LAKE_WAREHOUSE = 'de_data_lake_warehouse',
  // Architecture & Open Table Formats (small beginner-first topics)
  DE_WHAT_IS_ETL = 'de_what_is_etl',
  DE_ETL_VS_ELT = 'de_etl_vs_elt',
  DE_LAKEHOUSE = 'de_lakehouse',
  DE_TABLE_FORMATS_INTRO = 'de_table_formats_intro',
  DE_ICEBERG_DELTA_HUDI = 'de_iceberg_delta_hudi',
  DE_TRANSFORMATION_TOOLS = 'de_transformation_tools',
  // Modeling Concepts (small beginner-first topics)
  DE_WHY_MODEL = 'de_why_model',
  DE_TABLES_FACTS_DIMS = 'de_tables_facts_dims',
  DE_STAR_SCHEMA = 'de_star_schema',
  DE_KEYS_GRAIN = 'de_keys_grain',
  DE_SCD = 'de_scd',
  DE_DATA_MESH = 'de_data_mesh',
  // Streaming (small beginner-first topics)
  DE_WHAT_IS_A_STREAM = 'de_what_is_a_stream',
  DE_EVENT_VS_PROCESSING_TIME = 'de_event_vs_processing_time',
  DE_WINDOWS = 'de_windows',
  DE_KAFKA_BASICS = 'de_kafka_basics',
  DE_CDC = 'de_cdc',
  DE_STREAMING_GUARANTEES = 'de_streaming_guarantees',
  DE_STREAMING_SQL = 'de_streaming_sql',
  // Distributed Systems & Storage (small beginner-first topics)
  DE_WHY_DISTRIBUTE = 'de_why_distribute',
  DE_PARTITIONING = 'de_partitioning',
  DE_REPLICATION = 'de_replication',
  DE_LSM_VS_BTREE = 'de_lsm_vs_btree',
  DE_COMPACTION_BLOOM = 'de_compaction_bloom',
  // Operations, Quality & Modern DE (small beginner-first topics)
  DE_WHAT_IS_ORCHESTRATION = 'de_what_is_orchestration',
  DE_AIRFLOW_DAGSTER = 'de_airflow_dagster',
  DE_RETRIES_IDEMPOTENCY = 'de_retries_idempotency',
  DE_DATA_QUALITY_BASICS = 'de_data_quality_basics',
  DE_OBSERVABILITY_LINEAGE = 'de_observability_lineage',
  DE_GOVERNANCE = 'de_governance',
  DE_FOR_AI = 'de_for_ai',

  // ── Web Development ──
  // HTML & CSS
  HTML_BASICS = 'html_basics',
  HTML_FORMS = 'html_forms',
  HTML_SEMANTIC = 'html_semantic',
  CSS_BASICS = 'css_basics',
  CSS_LAYOUT = 'css_layout',
  CSS_RESPONSIVE = 'css_responsive',
  TAILWIND = 'tailwind',
  HTML_CSS_PROJECT = 'html_css_project',

  // JavaScript
  JS_VARIABLES_TYPES = 'js_variables_types',
  JS_FUNCTIONS = 'js_functions',
  JS_ARRAYS = 'js_arrays',
  JS_OBJECTS = 'js_objects',
  JS_ASYNC = 'js_async',
  JS_ES6_PLUS = 'js_es6_plus',
  JS_DOM = 'js_dom',
  JS_PROJECT = 'js_project',

  // TypeScript
  TS_BASIC_TYPES = 'ts_basic_types',
  TS_INTERFACES = 'ts_interfaces',
  TS_GENERICS = 'ts_generics',
  TS_ADVANCED_TYPES = 'ts_advanced_types',
  TS_UTILITY_TYPES = 'ts_utility_types',
  TS_PROJECT = 'ts_project',

  // React
  REACT_COMPONENTS = 'react_components',
  REACT_STATE = 'react_state',
  REACT_EFFECTS = 'react_effects',
  REACT_HOOKS = 'react_hooks',
  REACT_CONTEXT = 'react_context',
  REACT_FORMS = 'react_forms',
  REACT_PATTERNS = 'react_patterns',
  REACT_PROJECT = 'react_project',

  // Next.js
  NEXT_ROUTING = 'next_routing',
  NEXT_SERVER_COMPONENTS = 'next_server_components',
  NEXT_DATA_FETCHING = 'next_data_fetching',
  NEXT_API_ROUTES = 'next_api_routes',
  NEXT_MIDDLEWARE = 'next_middleware',
  NEXT_OPTIMIZATION = 'next_optimization',
  NEXT_AUTH = 'next_auth',
  NEXT_DEPLOYMENT = 'next_deployment',

  // Next.js Advanced
  NEXT_PRISMA = 'next_prisma',
  NEXT_FORMS_VALIDATION = 'next_forms_validation',
  NEXT_TESTING = 'next_testing',
  NEXT_TANSTACK = 'next_tanstack',
  NEXT_URL_STATE = 'next_url_state',
  NEXT_ERROR_HANDLING = 'next_error_handling',
  NEXT_AUTH_DEEP = 'next_auth_deep',
  ACCESSIBILITY = 'accessibility',
  NEXT_SHADCN = 'next_shadcn',

  // Design Patterns
  PATTERNS_CREATIONAL = 'patterns_creational',
  PATTERNS_STRUCTURAL = 'patterns_structural',
  PATTERNS_BEHAVIORAL = 'patterns_behavioral',
  PATTERNS_ARCHITECTURAL = 'patterns_architectural',
  API_DESIGN = 'api_design',
  DB_DESIGN = 'db_design',

  // ── Backend Development ──
  // Python
  PY_BASICS = 'py_basics',
  PY_DATA_STRUCTURES = 'py_data_structures',
  PY_FUNCTIONS = 'py_functions',
  PY_OOP = 'py_oop',
  PY_OOP_ADVANCED = 'py_oop_advanced',
  PY_METACLASSES = 'py_metaclasses',
  PY_MODULES = 'py_modules',
  PY_FILE_IO = 'py_file_io',
  PY_ERROR_HANDLING = 'py_error_handling',
  PY_DECORATORS = 'py_decorators',

  // Python Advanced
  PY_ASYNC = 'py_async',
  PY_TYPE_HINTS = 'py_type_hints',
  PY_COMPREHENSIONS = 'py_comprehensions',
  PY_GENERATORS = 'py_generators',
  PY_COLLECTIONS = 'py_collections',
  PY_ITERTOOLS = 'py_itertools',
  PY_REGEX = 'py_regex',
  PY_CONTEXT_MANAGERS = 'py_context_managers',
  PY_MAGIC_METHODS = 'py_magic_methods',
  PY_DATACLASSES = 'py_dataclasses',
  PY_TESTING_BASICS = 'py_testing_basics',
  PY_FIXTURES = 'py_fixtures',
  PY_MOCKING = 'py_mocking',
  // Python Advanced Tier 1 additions
  PY_HTTP = 'py_http',
  PY_FUNCTOOLS = 'py_functools',
  PY_LOGGING = 'py_logging',
  PY_DATETIME_PATHS = 'py_datetime_paths',
  PY_SERIALIZATION = 'py_serialization',
  PY_PYDANTIC = 'py_pydantic',
  // Python Advanced Tier 2 additions
  PY_THREADING = 'py_threading',
  PY_FUTURES = 'py_futures',
  PY_SECURITY = 'py_security',
  PY_SHELL_OS = 'py_shell_os',
  PY_CLI = 'py_cli',
  PY_PACKAGING = 'py_packaging',

  // Django
  DJ_SETUP = 'dj_setup',
  DJ_MODELS = 'dj_models',
  DJ_VIEWS = 'dj_views',
  DJ_CBV = 'dj_cbv',
  DJ_TEMPLATES = 'dj_templates',
  DJ_URLS = 'dj_urls',
  DJ_FORMS = 'dj_forms',
  DJ_ORM = 'dj_orm',
  DJ_ORM_MASTERY = 'dj_orm_mastery',
  DJ_MODELS_MASTERY = 'dj_models_mastery',
  DJ_VIEWS_MASTERY = 'dj_views_mastery',
  DJ_FORMS_MASTERY = 'dj_forms_mastery',
  DJ_AUTH_MASTERY = 'dj_auth_mastery',
  DJ_REST_MASTERY = 'dj_rest_mastery',
  DJ_AUTH = 'dj_auth',
  DJ_REST = 'dj_rest',

  // Django Advanced
  DJ_ADMIN = 'dj_admin',
  DJ_CACHING = 'dj_caching',
  DJ_TRANSACTIONS = 'dj_transactions',
  DJ_DEPLOYMENT = 'dj_deployment',
  DJ_MANAGEMENT = 'dj_management',
  DJ_SIGNALS_MW = 'dj_signals_mw',

  // Backend Advanced
  PY_DAILY_PATTERNS = 'py_daily_patterns',
  DJ_CELERY = 'dj_celery',
  DJ_PAGINATION_GENERICS = 'dj_pagination_generics',
  DJ_API_DOCS = 'dj_api_docs',
  DJ_FACTORY_BOY = 'dj_factory_boy',
  DJ_CICD = 'dj_cicd',
  DJ_REDIS = 'dj_redis',
  DJ_CUSTOM_MANAGERS = 'dj_custom_managers',
  DJ_NGINX = 'dj_nginx',
  DJ_POSTGRES = 'dj_postgres',
  DJ_SERVICE_LAYER = 'dj_service_layer',
  DJ_FILE_UPLOADS = 'dj_file_uploads',
  DJ_SETTINGS = 'dj_settings',
  DJ_CHANNELS = 'dj_channels',
  DJ_MONITORING = 'dj_monitoring',
  PY_MODERN = 'py_modern',

  // ── SQL for Data Engineering (T-SQL) ──
  // tsql_* namespace, distinct from the legacy Databricks SQL_* advanced topics.
  // Pillar 1 — Querying Foundations
  TSQL_SELECT = 'tsql_select',
  TSQL_FILTERING = 'tsql_filtering',
  TSQL_STRING_FUNCTIONS = 'tsql_string_functions',
  TSQL_DATE_FUNCTIONS = 'tsql_date_functions',
  TSQL_JOINS = 'tsql_joins',
  TSQL_AGGREGATION = 'tsql_aggregation',
  TSQL_SUBQUERIES_CTE = 'tsql_subqueries_cte',
  TSQL_SET_OPS = 'tsql_set_ops',
  TSQL_DML = 'tsql_dml',
  // Pillar 2 — DDL & Constraints
  TSQL_DDL_TABLES = 'tsql_ddl_tables',
  TSQL_TYPES = 'tsql_types',
  TSQL_CONSTRAINTS = 'tsql_constraints',
  TSQL_VIEWS = 'tsql_views',
  // Pillar 3 — Analytical & Window SQL
  TSQL_WINDOWS = 'tsql_windows',
  TSQL_WINDOW_FRAMES = 'tsql_window_frames',
  TSQL_LAG_LEAD = 'tsql_lag_lead',
  TSQL_GROUPING_SETS = 'tsql_grouping_sets',
  TSQL_PIVOT = 'tsql_pivot',
  // Pillar 4 — Transactions & Procedural T-SQL
  TSQL_TRANSACTIONS = 'tsql_transactions',
  TSQL_ISOLATION = 'tsql_isolation',
  TSQL_PROCEDURES = 'tsql_procedures',
  TSQL_CONTROL_FLOW = 'tsql_control_flow',
  TSQL_ERROR_HANDLING = 'tsql_error_handling',
  // Pillar 5 — Data Modeling in SQL
  TSQL_FACTS_DIMS = 'tsql_facts_dims',
  TSQL_SURROGATE_KEYS = 'tsql_surrogate_keys',
  TSQL_STAR_SCHEMA = 'tsql_star_schema',
  TSQL_SCD = 'tsql_scd',
  TSQL_NORMALIZATION = 'tsql_normalization',
  // Pillar 6 — ELT & Transformation Patterns
  TSQL_INSERT = 'tsql_insert',
  TSQL_MERGE = 'tsql_merge',
  TSQL_DEDUP = 'tsql_dedup',
  TSQL_ETL_PROC = 'tsql_etl_proc',
  TSQL_INCREMENTAL = 'tsql_incremental',
  TSQL_QUALITY = 'tsql_quality',
  // Pillar 7 — Performance & Optimization
  TSQL_INDEXES = 'tsql_indexes',
  TSQL_EXECUTION_PLANS = 'tsql_execution_plans',
  TSQL_PARTITIONING = 'tsql_partitioning',
  TSQL_COLUMNSTORE = 'tsql_columnstore',
  TSQL_ANTIPATTERNS = 'tsql_antipatterns',
  // Pillar 8 — Cloud Warehouse SQL
  TSQL_MPP_MODEL = 'tsql_mpp_model',
  TSQL_SYNAPSE_FABRIC = 'tsql_synapse_fabric',
  TSQL_OTHER_WAREHOUSES = 'tsql_other_warehouses',
}

export enum CodeLanguage {
  PYTHON = 'python',
  SQL = 'sql',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  JSX = 'jsx',
  HTML = 'html',
  CSS = 'css',
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  // Optional: tags this distractor as encoding a documented student misconception.
  // Used for telemetry (we record selections of tagged distractors and surface
  // top hits in ProgressTracker). Only meaningful on incorrect options.
  // Tag values must come from the registry in src/data/misconceptions.ts.
  misconceptionTag?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface TieredHints {
  /** Tier 1: the central API's call surface, e.g. "re.sub(pattern, repl, string) -> str". One line, no prose. */
  apiSignature: string;
  /** Tier 2: solution skeleton with load-bearing tokens replaced by ____ (cloze-style). */
  skeleton: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: Topic;
  course?: Course;
  question: string;
  explanation: string;
  hints?: string[];
  tags?: string[];
  /**
   * Concept ids the question exercises, drawn from the per-course concept
   * registry (e.g. `BACKEND_CONCEPTS` in `utils/conceptRegistry.ts`).
   * Optional during migration — questions without concept tags fall back to
   * legacy card-level scheduling. See CONCEPT_LAYER_SPEC.md.
   */
  concepts?: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: MultipleChoiceOption[];
}

export interface CodingQuestion extends BaseQuestion {
  type: QuestionType.CODING;
  language: CodeLanguage;
  starterCode: string;
  testCases: TestCase[];
  solution: string;
  // Optional static keyword or pattern assertions run against learner submission prior to execution.
  requires?: (string | RegExp)[];
  requiredKeywords?: string[];
  // Markup the learner's CSS renders against in the live preview pane (CSS questions).
  // HTML questions preview their own code and don't need this field.
  previewHtml?: string;
  // Computed-style grading targets: for each selector, the CSS properties to compare
  // between the user's render and the solution's render.
  previewChecks?: { selector: string; properties: string[] }[];
  // Optional two-tier hint scaffold (Tier 1 signature, Tier 2 skeleton), revealed
  // only after a failed attempt and graded with fading partial credit. Absent =
  // classic one-shot behavior with no hint button.
  tieredHints?: TieredHints;
}

export interface ParsonsQuestion extends BaseQuestion {
  type: QuestionType.PARSONS;
  language: CodeLanguage;
  // Lines in their canonical correct order. The user must reproduce this exact sequence.
  correctOrder: string[];
  // Optional decoy lines that look plausible but don't belong in the solution.
  distractorLines?: string[];
  // The assembled correct answer, shown after submission for reference.
  solution: string;
  // Markup the arranged CSS renders against in the live preview (CSS questions).
  // HTML questions preview their arranged lines directly.
  previewHtml?: string;
}

export interface PredictOutputQuestion extends BaseQuestion {
  type: QuestionType.PREDICT_OUTPUT;
  language: CodeLanguage;
  // The code snippet the user reads and mentally traces.
  code: string;
  // The exact output they should produce. Compared after trimming each line's
  // trailing whitespace and collapsing trailing blank lines.
  expectedOutput: string;
  // Optional alternate-but-equivalent outputs (e.g. dict ordering edge cases).
  acceptableOutputs?: string[];
}

export interface ClozeCodeQuestion extends BaseQuestion {
  type: QuestionType.CLOZE_CODE;
  language: CodeLanguage;
  // Code template with `___` markers (3 underscores) where the user fills in.
  // Each `___` becomes one inline input.
  template: string;
  // The expected values for each blank, in order of appearance in the template.
  blanks: string[];
  // Optional per-blank acceptable alternates (e.g. equivalent syntax). Index matches blanks[].
  blankAlternates?: string[][];
  // The fully-assembled correct code, shown after submission.
  solution: string;
  // Markup the filled-in CSS renders against in the live preview (CSS questions).
  // HTML questions preview their filled-in template directly.
  previewHtml?: string;
}

export type Question =
  | MultipleChoiceQuestion
  | CodingQuestion
  | ParsonsQuestion
  | PredictOutputQuestion
  | ClozeCodeQuestion;

export interface QuestionAttempt {
  questionId: string;
  timestamp: number;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  // Partial credit in [0, 1] for hint-assisted coding passes. Absent on legacy
  // attempts, where credit is derived as `isCorrect ? 1 : 0`.
  credit?: number;
  // Highest hint tier revealed before the terminal outcome (0 = none, 1 = signature, 2 = skeleton).
  hintTierUsed?: 0 | 1 | 2;
}

// Extra outcome data a question component may pass to the recorder alongside the
// boolean result. Only coding questions with tiered hints populate this today.
export interface AnswerMeta {
  hintTierUsed: 0 | 1 | 2;
  attempts: number;
}

export interface UserProgress {
  questionsAttempted: Set<string>;
  correctAnswers: Set<string>;
  attemptHistory: QuestionAttempt[];
  topicScores: Map<Topic, { correct: number; total: number }>;
  difficultyScores: Map<Difficulty, { correct: number; total: number }>;
  lastAttempt: Map<string, number>;
  repetitionQueue: Map<string, number>; // questionId -> priority score
  // Sticky mastery: topic keys whose unlock bar (topic, unit, or section
  // aggregate) has ever been crossed. Granted at crossing, never revoked -
  // the single runtime source of truth for mastery (see updateMasteredTopics).
  masteredTopics: Set<string>;
}

export interface UserProfile {
  lastActiveDate: string;      // ISO date string
  totalSessions: number;
  currentStreak: number;       // consecutive days practiced
  longestStreak: number;
  totalTimeSpentMs: number;
  savedFilters: {
    topics: string[];
    difficulties: string[];
    questionTypes: string[];
  } | null;
}

export interface QuizState {
  currentQuestion: Question | null;
  questionIndex: number;
  score: number;
  totalQuestions: number;
  userAnswer: string | null;
  isAnswered: boolean;
  showExplanation: boolean;
  progress: UserProgress;
}

// One recorded selection of a misconception-tagged distractor.
// Append-only; never mutated.
export interface MisconceptionEvent {
  tag: string;
  questionId: string;
  timestamp: number;
}

// Persisted under localStorage key `recall-misconceptions`. Separate from
// UserProgress so attempt history stays focused on correctness/timing.
export interface MisconceptionStore {
  events: MisconceptionEvent[];
}
