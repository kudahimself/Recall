import { Question, QuestionType, Difficulty, Topic, CodeLanguage } from '../types';

export const UNITY_CATALOG_QUESTIONS: Question[] = [
  // =========================================================================
  // TOPIC 1: UNITY_CATALOG_BASICS (Unity Catalog Foundations & Volumes)
  // =========================================================================

  {
    id: 'uc-basics-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_BASICS,
    question: 'How does Unity Catalog structure data objects compared to the legacy Hive metastore?',
    options: [
      { id: 'a', text: 'Unity Catalog uses a 2-tier model (database.table) bound strictly to workspace-level DBFS mounts.', isCorrect: false },
      { id: 'b', text: 'Unity Catalog enforces single-tier object storage URIs without database or schema namespaces.', isCorrect: false },
      { id: 'c', text: 'Unity Catalog uses a 3-tier namespace (catalog.schema.table) governed centrally across workspaces.', isCorrect: true },
      { id: 'd', text: 'Unity Catalog bypasses database schemas to map raw cloud storage directories directly to cluster nodes.', isCorrect: false },
    ],
    explanation: 'Unity Catalog introduces a 3-tier namespace structure: Catalog (the top-level container), Schema/Database, and Table/View/Volume. This decouples object governance from workspace boundaries.',
    hints: ['Think about the 3-tier namespace hierarchy introduced in Unity Catalog.'],
    tags: ['unity-catalog', 'namespaces', 'architecture'],
    concepts: ['ucat-architecture'],
  },

  {
    id: 'uc-basics-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to define a new top-level catalog container named "analytics_prod" if it does not already exist.',
    starterCode: `-- Create catalog container\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE CATALOG IF NOT EXISTS analytics_prod',
        description: 'Should create catalog with IF NOT EXISTS',
      },
    ],
    solution: `CREATE CATALOG IF NOT EXISTS analytics_prod
# OR
CREATE CATALOG analytics_prod`,
    explanation: 'CREATE CATALOG creates a top-level container in Unity Catalog. Using IF NOT EXISTS prevents errors if the catalog already exists.',
    tieredHints: {
      apiSignature: 'CREATE CATALOG [IF NOT EXISTS] catalog_name',
      skeleton: '____ CATALOG ____ NOT EXISTS ____',
    },
    hints: ['Use CREATE CATALOG IF NOT EXISTS.'],
    tags: ['sql', 'ddl', 'catalog'],
    concepts: ['ucat-catalogs'],
  },

  {
    id: 'uc-basics-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_BASICS,
    question: 'Why does Databricks recommend replacing legacy DBFS mounts (/mnt) with Unity Catalog Volumes (/Volumes)?',
    options: [
      { id: 'a', text: 'DBFS mounts prohibit standard Spark SQL DataFrame reads and require custom Scala file readers.', isCorrect: false },
      { id: 'b', text: 'Unity Catalog Volumes automatically convert incoming raw CSV files into compressed Delta tables.', isCorrect: false },
      { id: 'c', text: 'DBFS mounts restrict cluster execution exclusively to legacy Single-User compute access modes.', isCorrect: false },
      { id: 'd', text: 'Volumes govern non-tabular files with fine-grained SQL permissions while mounts expose credentials workspace-wide.', isCorrect: true },
    ],
    explanation: 'Legacy DBFS mounts expose storage credentials workspace-wide to all users on a cluster. Volumes use Unity Catalog GRANT permissions (e.g. READ VOLUME) for granular access control.',
    hints: ['Focus on fine-grained access control vs broad credential exposure.'],
    tags: ['volumes', 'dbfs', 'security'],
    concepts: ['dbx-dbfs-mounts-vs-volumes'],
  },

  {
    id: 'uc-basics-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to define a managed volume named "raw_landing" inside schema "main.ingestion".',
    starterCode: `-- Define managed volume\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE VOLUME main.ingestion.raw_landing',
        description: 'Should create volume in main.ingestion schema',
      },
    ],
    solution: `CREATE VOLUME main.ingestion.raw_landing
# OR
CREATE VOLUME IF NOT EXISTS main.ingestion.raw_landing`,
    explanation: 'CREATE VOLUME creates a Unity Catalog Volume for non-tabular data files (images, JSONs, CSVs). Managed volumes store files in the schema default storage location.',
    tieredHints: {
      apiSignature: 'CREATE VOLUME [IF NOT EXISTS] catalog.schema.volume_name',
      skeleton: '____ VOLUME ____.ingestion.____',
    },
    hints: ['Use CREATE VOLUME catalog.schema.volume_name.'],
    tags: ['sql', 'volumes', 'ddl'],
    concepts: ['ucat-volumes'],
  },

  {
    id: 'uc-basics-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    question: 'What happens to underlying cloud storage files when a DROP TABLE command is executed on a Managed Table vs an External Table in Unity Catalog?',
    options: [
      { id: 'a', text: 'Managed table data files remain intact on storage, whereas External table files are permanently purged.', isCorrect: false },
      { id: 'b', text: 'Managed table data files are deleted from storage, whereas External table files remain intact on storage.', isCorrect: true },
      { id: 'c', text: 'Both Managed and External table data files are immediately and permanently removed from cloud storage.', isCorrect: false },
      { id: 'd', text: 'Neither table type removes underlying storage files; only metastore metadata entries are unregistered.', isCorrect: false },
    ],
    explanation: 'Unity Catalog manages the lifecycle of Managed Tables, so DROP TABLE deletes both metadata and underlying storage files. For External Tables, Unity Catalog drops metadata while preserving external cloud storage files.',
    hints: ['Consider storage lifecycle ownership for managed vs external tables.'],
    tags: ['managed-tables', 'external-tables', 'lifecycle'],
    concepts: ['ucat-managed-vs-external'],
  },

  {
    id: 'uc-basics-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to define a Delta table named "orders" inside 3-tier namespace catalog "main" and schema "sales" with columns "order_id" (INT) and "amount" (DOUBLE).',
    starterCode: `-- Define table in 3-tier namespace\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE TABLE main.sales.orders (order_id INT, amount DOUBLE) USING DELTA',
        description: 'Should create 3-tier Delta table',
      },
    ],
    solution: `CREATE TABLE main.sales.orders (\n  order_id INT,\n  amount DOUBLE\n)\nUSING DELTA
# OR
CREATE TABLE IF NOT EXISTS main.sales.orders (\n  order_id INT,\n  amount DOUBLE\n)`,
    explanation: 'Creating tables with 3-tier names (main.sales.orders) ensures tables are registered directly in the specified catalog and schema.',
    tieredHints: {
      apiSignature: 'CREATE TABLE [IF NOT EXISTS] catalog.schema.table (col_name data_type, ...) USING DELTA',
      skeleton: `CREATE TABLE ____.sales.orders (\n  order_id INT,\n  amount ____\n)\n____ DELTA`,
    },
    hints: ['Use catalog.schema.table notation with USING DELTA.'],
    tags: ['sql', 'ddl', 'tables'],
    concepts: ['ucat-tables'],
  },

  {
    id: 'uc-basics-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to load Unity Catalog table "prod.finance.orders" into DataFrame "df".',
    starterCode: `# Load 3-tier table\ndf = `,
    testCases: [
      {
        input: '',
        expectedOutput: 'spark.read.table("prod.finance.orders")',
        description: 'Should read 3-tier table into DataFrame',
      },
    ],
    solution: `df = spark.read.table("prod.finance.orders")
# OR
df = spark.table("prod.finance.orders")`,
    explanation: 'spark.read.table("catalog.schema.table") loads a 3-tier Unity Catalog table into a PySpark DataFrame.',
    tieredHints: {
      apiSignature: 'spark.read.table(tableName)',
      skeleton: 'df = ____.____.____("prod.finance.orders")',
    },
    hints: ['Pass "prod.finance.orders" to spark.read.table() or spark.table().'],
    tags: ['pyspark', 'table', 'read'],
    concepts: ['ps-dataframe-create', 'ucat-tables'],
  },

  {
    id: 'uc-basics-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Arrange the PySpark lines to load raw CSV data from a Unity Catalog Volume into a DataFrame.',
    correctOrder: [
      'volume_path = "/Volumes/main/landing/raw_files/events.csv"',
      'raw_df = (spark.read',
      '  .option("header", "true")',
      '  .csv(volume_path))',
    ],
    distractorLines: [
      'volume_path = "dbfs:/mnt/landing/raw_files/events.csv"',
    ],
    solution: `volume_path = "/Volumes/main/landing/raw_files/events.csv"\nraw_df = (\n  spark.read\n    .option("header", "true")\n    .csv(volume_path)\n)`,
    explanation: 'UC Volumes are mounted at POSIX paths under `/Volumes/catalog/schema/volume_name/file.ext` and accessible via standard Spark file readers.',
    hints: ['Use the /Volumes/ path prefix rather than legacy dbfs:/mnt.'],
    tags: ['pyspark', 'volumes', 'read'],
    concepts: ['ucat-volumes'],
  },

  {
    id: 'uc-basics-9',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    question: 'Arrange the SQL statements to switch the active context to catalog "analytics" and schema "gold", then query the "kpi_daily" table.',
    correctOrder: [
      'USE CATALOG analytics;',
      'USE SCHEMA gold;',
      'SELECT * FROM kpi_daily;',
    ],
    distractorLines: [
      'USE DATABASE analytics.gold;',
    ],
    solution: `USE CATALOG analytics;\nUSE SCHEMA gold;\nSELECT * FROM kpi_daily;`,
    explanation: 'USE CATALOG sets the default catalog context, and USE SCHEMA sets the active schema, allowing subsequent queries to use simple table names.',
    hints: ['Catalog context first, then schema context, then table query.'],
    tags: ['sql', 'context', 'use-catalog'],
    concepts: ['ucat-catalogs'],
  },

  {
    id: 'uc-basics-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_BASICS,
    question: 'A data engineering team is migrating legacy pipelines that use dbutils.fs.mount() to attach cloud storage. What is the recommended Unity Catalog architectural replacement?',
    options: [
      { id: 'a', text: 'Define External Locations backed by Storage Credentials, and access non-tabular files via External Volumes.', isCorrect: true },
      { id: 'b', text: 'Store cloud storage secret keys in notebook widgets and execute driver shell s3cmd commands on ephemeral local disks.', isCorrect: false },
      { id: 'c', text: 'Create temporary SQL views using raw object storage URLs while passing credentials inside dynamic session properties.', isCorrect: false },
      { id: 'd', text: 'Attach IAM roles directly to cluster worker nodes and execute unencrypted HDFS file transfers across driver memory.', isCorrect: false },
    ],
    explanation: 'Unity Catalog eliminates DBFS mounts by combining Storage Credentials (IAM authentication) and External Locations (storage paths), exposing data via External Volumes under `/Volumes/`.',
    hints: ['Look for the modern architecture combining Storage Credentials and Volumes.'],
    tags: ['architecture', 'migration', 'volumes'],
    concepts: ['dbx-dbfs-mounts-vs-volumes', 'ucat-architecture'],
  },


  // =========================================================================
  // TOPIC 2: UNITY_CATALOG_GOVERNANCE (Unity Catalog Governance & Security)
  // =========================================================================

  {
    id: 'uc-gov-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'How does privilege inheritance work across the 3-tier namespace in Unity Catalog?',
    options: [
      { id: 'a', text: 'Privileges granted on a Catalog automatically apply to all child Schemas and Tables within it.', isCorrect: true },
      { id: 'b', text: 'Privileges must be explicitly granted on every individual Table, ignoring Catalog or Schema settings.', isCorrect: false },
      { id: 'c', text: 'Privileges granted on a Table automatically propagate upward to grant access to the parent Catalog.', isCorrect: false },
      { id: 'd', text: 'Privilege inheritance is disabled by default and can only be enabled using global cluster init scripts.', isCorrect: false },
    ],
    explanation: 'Unity Catalog enforces hierarchical privilege inheritance. Granting permissions at a higher level (e.g. SELECT on a Catalog or Schema) automatically flows down to all child objects.',
    hints: ['Think top-down inheritance: Catalog -> Schema -> Table.'],
    tags: ['governance', 'inheritance', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'uc-gov-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to grant SELECT privilege on table "main.gold.metrics" to principal group "analysts".',
    starterCode: `-- Grant table access\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'GRANT SELECT ON TABLE main.gold.metrics TO analysts',
        description: 'Should grant SELECT on table to analysts group',
      },
    ],
    solution: `GRANT SELECT ON TABLE main.gold.metrics TO analysts\n# OR\nGRANT SELECT ON main.gold.metrics TO analysts`,
    explanation: 'GRANT SELECT ON TABLE object TO principal grants read access to a specific table in Unity Catalog.',
    tieredHints: {
      apiSignature: 'GRANT privilege_type ON object_type object_name TO principal',
      skeleton: '____ ____ ON TABLE ____.gold.metrics TO ____',
    },
    hints: ['Use GRANT SELECT ON TABLE object TO principal.'],
    tags: ['sql', 'grant', 'security'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'uc-gov-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to grant USAGE privilege on schema "main.gold" to principal group "data_engineers".',
    starterCode: `-- Grant schema usage\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'GRANT USAGE ON SCHEMA main.gold TO data_engineers',
        description: 'Should grant USAGE on schema to data_engineers',
      },
    ],
    solution: `GRANT USAGE ON SCHEMA main.gold TO data_engineers\n# OR\nGRANT USAGE ON main.gold TO data_engineers`,
    explanation: 'USAGE privilege on a Schema allows principals to traverse the schema to access child tables and functions.',
    tieredHints: {
      apiSignature: 'GRANT privilege_type ON SCHEMA schema_name TO principal',
      skeleton: '____ ____ ON SCHEMA ____.gold TO ____',
    },
    hints: ['Use GRANT USAGE ON SCHEMA object TO principal.'],
    tags: ['sql', 'grant', 'schema'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'uc-gov-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to grant READ VOLUME privilege on volume "main.raw.landing" to principal group "ingestion_service".',
    starterCode: `-- Grant volume read permission\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'GRANT READ VOLUME ON VOLUME main.raw.landing TO ingestion_service',
        description: 'Should grant READ VOLUME on volume to ingestion_service',
      },
    ],
    solution: `GRANT READ VOLUME ON VOLUME main.raw.landing TO ingestion_service\n# OR\nGRANT READ VOLUME ON main.raw.landing TO ingestion_service`,
    explanation: 'READ VOLUME allows principals to read files stored in a Unity Catalog Volume.',
    tieredHints: {
      apiSignature: 'GRANT privilege_type ON VOLUME volume_name TO principal',
      skeleton: '____ READ ____ ON VOLUME ____.raw.landing TO ____',
    },
    hints: ['Use GRANT READ VOLUME ON VOLUME object TO principal.'],
    tags: ['sql', 'grant', 'volumes'],
    concepts: ['ucat-grants', 'ucat-volumes'],
  },

  {
    id: 'uc-gov-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'What is the purpose of Storage Credentials and External Locations in Unity Catalog governance?',
    options: [
      { id: 'a', text: 'Storage Credentials encapsulate cloud IAM authentication, while External Locations bind those credentials to specific storage paths.', isCorrect: true },
      { id: 'b', text: 'Storage Credentials store user passwords in DBFS root, while External Locations configure worker node static IP addresses.', isCorrect: false },
      { id: 'c', text: 'Storage Credentials compress raw Parquet files, while External Locations manage cluster autoscaling worker node limits.', isCorrect: false },
      { id: 'd', text: 'Storage Credentials grant SQL table privileges, while External Locations manage workspace notebook git repository syncs.', isCorrect: false },
    ],
    explanation: 'Storage Credentials hold cloud authentication (IAM role / Service Principal). External Locations link a Storage Credential to a cloud storage URI (e.g. s3://bucket/path), allowing admins to govern external storage paths.',
    hints: ['Storage Credential = IAM auth; External Location = Credential + Storage Path.'],
    tags: ['governance', 'credentials', 'external-locations'],
    concepts: ['ucat-storage-credentials'],
  },

  {
    id: 'uc-gov-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to grant CREATE TABLE privilege on external location "s3_sales_data" to group "de_team".',
    starterCode: `-- Grant privilege on external location\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'GRANT CREATE TABLE ON EXTERNAL LOCATION s3_sales_data TO de_team',
        description: 'Should grant CREATE TABLE on external location to de_team',
      },
    ],
    solution: `GRANT CREATE TABLE ON EXTERNAL LOCATION s3_sales_data TO de_team`,
    explanation: 'GRANT CREATE TABLE ON EXTERNAL LOCATION location_name TO principal allows developers to register external tables pointing to that storage path.',
    tieredHints: {
      apiSignature: 'GRANT privilege_type ON EXTERNAL LOCATION location_name TO principal',
      skeleton: '____ CREATE ____ ON EXTERNAL LOCATION ____ TO ____',
    },
    hints: ['Use GRANT CREATE TABLE ON EXTERNAL LOCATION name TO principal.'],
    tags: ['sql', 'grant', 'external-locations'],
    concepts: ['ucat-grants', 'ucat-storage-credentials'],
  },

  {
    id: 'uc-gov-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'How does Unity Catalog implement Row-Level Security on sensitive tables?',
    options: [
      { id: 'a', text: 'By physically partitioning tables into separate directory subfolders based on user email addresses', isCorrect: false },
      { id: 'b', text: 'By binding SQL User-Defined Functions (UDFs) as ROW FILTER clauses to dynamically evaluate user identity', isCorrect: true },
      { id: 'c', text: 'By restricting cluster auto-termination parameters exclusively to single-tenant dedicated node pools', isCorrect: false },
      { id: 'd', text: 'By executing background scheduled cron jobs that automatically delete unauthorized rows every 5 minutes', isCorrect: false },
    ],
    explanation: 'Row Filters apply a SQL function returning a boolean to a table. When users query the table, Unity Catalog evaluates `is_member()` or `current_user()` to return only authorized rows.',
    hints: ['Focus on SQL UDFs evaluated dynamically during query execution.'],
    tags: ['security', 'row-filter', 'udf'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Arrange the SQL statements to apply a Column Masking UDF to mask column "ssn" in table "main.hr.employees".',
    correctOrder: [
      'ALTER TABLE main.hr.employees',
      'ALTER COLUMN ssn',
      'SET MASK ssn_mask_fn;',
    ],
    distractorLines: [
      'SET ROW FILTER ssn_mask_fn;',
    ],
    solution: `ALTER TABLE main.hr.employees\nALTER COLUMN ssn\nSET MASK ssn_mask_fn;`,
    explanation: 'SET MASK applies a SQL UDF to mask column values dynamically based on executing user roles.',
    hints: ['ALTER TABLE -> ALTER COLUMN -> SET MASK UDF.'],
    tags: ['security', 'column-mask', 'sql'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'Where can administrators query audit log events for Unity Catalog access attempts and permission modifications?',
    options: [
      { id: 'a', text: 'In system schemas such as system.access.audit using SQL queries', isCorrect: true },
      { id: 'b', text: 'Inside temporary text log files stored on DBFS root /tmp/logs path', isCorrect: false },
      { id: 'c', text: 'In Spark UI executor stderr console tab windows during cluster runs', isCorrect: false },
      { id: 'd', text: 'Inside git commit history logs saved under workspace Repos projects', isCorrect: false },
    ],
    explanation: 'Databricks provides System Tables under `system.access.audit` (and lineage tables) to let admins query audit logs using standard SQL.',
    hints: ['Look for system schemas providing structured audit query access.'],
    tags: ['audit', 'system-tables', 'governance'],
    concepts: ['ucat-system-tables'],
  },

  {
    id: 'uc-gov-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'What security anti-pattern occurs when developers hardcode AWS Access Keys or Azure Storage Account Keys in notebook source code to access object storage?',
    options: [
      { id: 'a', text: 'Credentials leak in notebook logs and git history, bypassing Unity Catalog centralized auditing and access controls.', isCorrect: true },
      { id: 'b', text: 'Spark DataFrame queries run 5x slower due to Java class loader serialization across distributed worker nodes.', isCorrect: false },
      { id: 'c', text: 'Delta Lake transaction logs stop generating vacuum checkpoints, causing uncompressed data accumulation.', isCorrect: false },
      { id: 'd', text: 'Clusters automatically downgrade from Shared access mode to Single User access mode during execution.', isCorrect: false },
    ],
    explanation: 'Hardcoding raw cloud keys bypasses Unity Catalog access logging, exposes credentials in git history/notebooks, and prevents centralized credential rotation.',
    hints: ['Consider credential exposure and bypassing centralized governance.'],
    tags: ['anti-pattern', 'security', 'credentials'],
    concepts: ['ucat-storage-credentials', 'dbx-platform-security'],
  },
];
