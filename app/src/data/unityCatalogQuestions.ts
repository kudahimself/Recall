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
    requires: [/CREATE\s+CATALOG/i],
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
-- OR
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
    id: 'uc-basics-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    requires: [/CREATE\s+VOLUME/i],
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
-- OR
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
    requires: [/main\.sales\.orders/i],
    question: 'Write a SQL statement that creates the Delta table "orders" in catalog "main", schema "sales", using its full three-part name, with the columns "order_id" (INT) and "amount" (DOUBLE).',
    starterCode: `-- Define table in 3-tier namespace\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE TABLE main.sales.orders (order_id INT, amount DOUBLE) USING DELTA',
        description: 'Should create 3-tier Delta table',
      },
    ],
    solution: `CREATE TABLE main.sales.orders (\n  order_id INT,\n  amount DOUBLE\n)\nUSING DELTA
-- OR
CREATE TABLE IF NOT EXISTS main.sales.orders (\n  order_id INT,\n  amount DOUBLE\n)
-- OR
CREATE TABLE main.sales.orders (\n  order_id INT,\n  amount DOUBLE\n)
-- OR
CREATE TABLE main.sales.orders (order_id INT, amount DOUBLE)`,
    explanation: 'The three-part name main.sales.orders registers the table in catalog main and schema sales whatever the session\'s current catalog is. With no LOCATION it is a managed table, and on Databricks every table is Delta unless you say otherwise, so `USING DELTA` is optional.',
    tieredHints: {
      apiSignature: 'CREATE TABLE [IF NOT EXISTS] catalog.schema.table (col_name data_type, ...) USING DELTA',
      skeleton: `CREATE TABLE ____.sales.orders (\n  order_id INT,\n  amount ____\n)\n____ DELTA`,
    },
    hints: ['Name the table as catalog.schema.table.'],
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
    solution: `volume_path = "/Volumes/main/landing/raw_files/events.csv"\nraw_df = (spark.read\n  .option("header", "true")\n  .csv(volume_path))`,
    explanation: 'A file in a Unity Catalog volume has the path `/Volumes/<catalog>/<schema>/<volume>/<file>`, here catalog main, schema landing and volume raw_files, and Spark reads it like any other path, with your READ VOLUME grant checked on every access. The `dbfs:/mnt/...` line is a legacy DBFS mount, which Unity Catalog volumes replace.',
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
      'USE CATALOG gold;',
    ],
    solution: `USE CATALOG analytics;\nUSE SCHEMA gold;\nSELECT * FROM kpi_daily;`,
    explanation: 'USE CATALOG analytics makes analytics the current catalog and resets the current schema to default, so it must come before USE SCHEMA gold; in the other order the schema would be lost. After both, the one-part name kpi_daily resolves to analytics.gold.kpi_daily. gold is a schema, not a catalog, so USE CATALOG gold fails.',
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
      { id: 'b', text: 'Keep the mounts, and switch the clusters to Standard access mode so Unity Catalog applies table grants to the /mnt paths.', isCorrect: false },
      { id: 'c', text: 'Store the storage account key in a secret scope and set it in each cluster\'s Spark config to reach the storage directly.', isCorrect: false },
      { id: 'd', text: 'Copy the mounted files into the DBFS root, which every cluster can read without any credentials of its own.', isCorrect: false },
    ],
    explanation: 'A storage credential holds the cloud identity, an external location ties it to a storage path, and an external volume over that path gives the files a governed `/Volumes/...` path, granted per user or group with READ VOLUME and WRITE VOLUME (tables over the path become external tables). Unity Catalog cannot govern a mount, whatever the access mode, and a key in the Spark config or files in the DBFS root are still reachable by everyone who can run code on that compute.',
    hints: ['Look for the modern architecture combining Storage Credentials and Volumes.'],
    tags: ['architecture', 'migration', 'volumes'],
    concepts: ['dbx-dbfs-mounts-vs-volumes', 'ucat-architecture'],
  },

  {
    id: 'uc-basics-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_BASICS,
    language: CodeLanguage.SQL,
    question: 'Both tables are in Unity Catalog, and the `abfss://` path lies inside an external location you hold `CREATE EXTERNAL TABLE` and `READ FILES` on. The statements run in order. What does the last query return? The answer is one number.',
    code: `CREATE TABLE main.shop.app_orders (id INT);
CREATE TABLE main.shop.lake_orders (id INT)
  LOCATION 'abfss://lake@acme.dfs.core.windows.net/orders';
INSERT INTO main.shop.app_orders VALUES (1), (2), (3);
INSERT INTO main.shop.lake_orders VALUES (1), (2);
DROP TABLE main.shop.app_orders;
DROP TABLE main.shop.lake_orders;
SELECT COUNT(*) FROM delta.\`abfss://lake@acme.dfs.core.windows.net/orders\`;`,
    expectedOutput: `2`,
    explanation: '`app_orders` has no `LOCATION`, so it is a managed table: Unity Catalog owns its files, and `DROP TABLE` removes them as well (`UNDROP` can bring it back for 7 days, then the files are deleted within 30 days). `lake_orders` has a `LOCATION`, so it is an external table: `DROP TABLE` only removes it from the catalog, and its Delta files stay at the path. Reading the path directly still finds its 2 rows, and `CREATE TABLE ... LOCATION` on the same path registers them again.',
    hints: ['Which of the two tables did you give a LOCATION?', 'Dropping an external table forgets the table, not its files.'],
    tags: ['unity-catalog', 'managed-table', 'external-table', 'drop', 'predict'],
    concepts: ['ucat-managed-vs-external'],
  },


  // =========================================================================
  // TOPIC 2: UNITY_CATALOG_GOVERNANCE (Unity Catalog Governance & Security)
  // =========================================================================

  {
    id: 'uc-gov-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: `How does privilege inheritance work in Unity Catalog's three-level namespace?`,
    options: [
      { id: 'a', text: 'A privilege granted on a catalog or schema applies to every object in it, including objects created later', isCorrect: true },
      { id: 'b', text: 'Privileges count only where they are granted, so each table needs its own grant whatever its parents hold', isCorrect: false },
      { id: 'c', text: 'A privilege granted on a table flows upward, giving the same access to its schema and to its catalog', isCorrect: false },
      { id: 'd', text: 'Inheritance applies, but a REVOKE on one table removes what a schema-level grant gives on that table', isCorrect: false },
    ],
    explanation: 'Privileges flow down from catalog to schema to table (and to views, volumes and functions): SELECT granted on a schema reads every table in it, tables created later included. They never flow upward. Unity Catalog has no DENY, so a REVOKE on one table removes only a grant made on that table and cannot take away what the schema grant gives; to keep a group out of one table, grant at a narrower level instead.',
    hints: ['Which direction do privileges flow: from parent to child, or child to parent?'],
    tags: ['governance', 'inheritance', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'uc-gov-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    requires: [/ALTER\s+TABLE\s+main\.gold\.metrics\s+SET\s+ROW\s+FILTER\s+main\.gold\.region_filter\s+ON\s*\(\s*region\s*\)/i],
    question: `Function "main.gold.region_filter(region STRING) RETURNS BOOLEAN" already exists. Bind it as a row filter on table "main.gold.metrics", passing the table's "region" column, so every query of the table keeps only the rows for which it returns true.`,
    starterCode: `-- Bind the row filter to the table
`,
    testCases: [
      { input: 'main.gold.metrics', expectedOutput: 'ALTER TABLE main.gold.metrics SET ROW FILTER main.gold.region_filter ON (region)', description: 'Should bind region_filter as the row filter on region' },
    ],
    solution: 'ALTER TABLE main.gold.metrics SET ROW FILTER main.gold.region_filter ON (region)',
    explanation: `ALTER TABLE ... SET ROW FILTER function ON (columns) binds the function to the table: from then on Unity Catalog calls it with each row's region inside every query of the table, and keeps the row only when it returns true. Nobody has to query a view or add a WHERE. ALTER TABLE main.gold.metrics DROP ROW FILTER removes it.`,
    tieredHints: {
      apiSignature: 'ALTER TABLE table SET ROW FILTER function ON (column)',
      skeleton: 'ALTER TABLE ____ SET ____ ____ main.gold.region_filter ON (____)',
    },
    hints: ['The statement starts with ALTER TABLE', 'SET ROW FILTER function ON (column)'],
    tags: ['security', 'row-filter', 'sql'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    requires: [/GRANT\s+USE\s+CATALOG\s+ON\s+CATALOG\s+main\s+TO\s+`?data_engineers`?/i, /GRANT\s+USE\s+SCHEMA\s+ON\s+SCHEMA\s+main\.gold\s+TO\s+`?data_engineers`?/i],
    question: 'Group "data_engineers" holds SELECT on table "main.gold.metrics", but its queries of the table fail with a permission error. Write the two GRANT statements that give it the usage privileges it is missing: one on catalog "main" and one on schema "main.gold".',
    starterCode: `-- Grant the missing usage privileges
`,
    testCases: [
      { input: 'main.gold.metrics', expectedOutput: 'GRANT USE CATALOG ON CATALOG main TO data_engineers; GRANT USE SCHEMA ON SCHEMA main.gold TO data_engineers', description: 'Should grant USE CATALOG and USE SCHEMA' },
    ],
    solution: `GRANT USE CATALOG ON CATALOG main TO data_engineers;
GRANT USE SCHEMA ON SCHEMA main.gold TO data_engineers;
-- OR
GRANT USE SCHEMA ON SCHEMA main.gold TO data_engineers;
GRANT USE CATALOG ON CATALOG main TO data_engineers;
-- OR
GRANT USE CATALOG ON CATALOG main TO \`data_engineers\`;
GRANT USE SCHEMA ON SCHEMA main.gold TO \`data_engineers\`;`,
    explanation: 'Reading a table takes three privileges at once: USE CATALOG on its catalog, USE SCHEMA on its schema and SELECT on the table or a parent. The group has only the last, so both usage privileges must be granted. The older Hive metastore table ACLs used one USAGE privilege for this; Unity Catalog has no USAGE and rejects it.',
    tieredHints: {
      apiSignature: 'GRANT USE CATALOG ON CATALOG name TO principal; GRANT USE SCHEMA ON SCHEMA catalog.schema TO principal',
      skeleton: 'GRANT ____ ____ ON CATALOG ____ TO ____;\nGRANT ____ ____ ON SCHEMA ____ TO ____;',
    },
    hints: ['One GRANT on the catalog, one on the schema', 'The usage privileges are USE CATALOG and USE SCHEMA'],
    tags: ['sql', 'grant', 'schema'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'uc-gov-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    requires: [/GRANT\s+READ\s+VOLUME\s+ON\s+VOLUME\s+main\.raw\.landing\s+TO\s+`?ingestion_service`?/i],
    question: 'Write the statement that lets group "ingestion_service" read the files in volume "main.raw.landing".',
    starterCode: `-- Grant volume read permission\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'GRANT READ VOLUME ON VOLUME main.raw.landing TO ingestion_service',
        description: 'Should grant READ VOLUME on volume to ingestion_service',
      },
    ],
    solution: `GRANT READ VOLUME ON VOLUME main.raw.landing TO ingestion_service
-- OR
GRANT READ VOLUME ON VOLUME main.raw.landing TO \`ingestion_service\``,
    explanation: 'READ VOLUME lets a principal read the files and folders stored in a volume, under /Volumes/main/raw/landing/; WRITE VOLUME adds writing. The object kind VOLUME must be named, because a name with no kind is read as a table. As with tables, the group also needs USE CATALOG on main and USE SCHEMA on main.raw.',
    tieredHints: {
      apiSignature: 'GRANT privilege ON VOLUME catalog.schema.volume TO principal',
      skeleton: '____ ____ VOLUME ON ____ main.raw.landing TO ____',
    },
    hints: ['GRANT privilege ON VOLUME name TO principal', 'The read privilege on a volume is two words'],
    tags: ['sql', 'grant', 'volumes'],
    concepts: ['ucat-grants', 'ucat-volumes'],
  },

  {
    id: 'uc-gov-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'What do a storage credential and an external location do in Unity Catalog?',
    options: [
      { id: 'a', text: 'A credential is an access key that users paste into notebooks; a location mounts its path under /mnt for them', isCorrect: false },
      { id: 'b', text: 'A credential decides who may read which tables; a location decides in which cloud region clusters may start', isCorrect: false },
      { id: 'c', text: 'A credential wraps a cloud identity, like an IAM role; a location pairs it with one path that grants govern', isCorrect: true },
      { id: 'd', text: `A credential holds each user's own cloud login; a location copies the path's files into managed storage`, isCorrect: false },
    ],
    explanation: `An admin creates a storage credential around a cloud identity (an IAM role, an Azure managed identity or a Google service account) and an external location that pairs one credential with one storage path. Privileges on the location, such as READ FILES, CREATE EXTERNAL TABLE and CREATE EXTERNAL VOLUME, decide who may use the path, so no user ever handles a cloud key, and every access goes through Unity Catalog's grants and audit log. Locations replace DBFS mounts, and the files stay where they are.`,
    hints: ['One object holds the cloud identity; the other ties it to a path.'],
    tags: ['governance', 'credentials', 'external-locations'],
    concepts: ['ucat-storage-credentials'],
  },

  {
    id: 'uc-gov-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    requires: [/GRANT\s+CREATE\s+EXTERNAL\s+TABLE\s+ON\s+EXTERNAL\s+LOCATION\s+`?s3_sales_data`?\s+TO\s+`?de_team`?/i],
    question: 'Let group "de_team" create external tables on the storage path of external location "s3_sales_data". Write the GRANT on the location.',
    starterCode: `-- Grant privilege on external location\n`,
    testCases: [
      { input: 's3_sales_data', expectedOutput: 'GRANT CREATE EXTERNAL TABLE ON EXTERNAL LOCATION s3_sales_data TO de_team', description: 'Should grant CREATE EXTERNAL TABLE on the location' },
    ],
    solution: `GRANT CREATE EXTERNAL TABLE ON EXTERNAL LOCATION s3_sales_data TO de_team
-- OR
GRANT CREATE EXTERNAL TABLE ON EXTERNAL LOCATION s3_sales_data TO \`de_team\`
-- OR
GRANT CREATE EXTERNAL TABLE ON EXTERNAL LOCATION \`s3_sales_data\` TO \`de_team\`
-- OR
GRANT CREATE EXTERNAL TABLE ON EXTERNAL LOCATION \`s3_sales_data\` TO de_team`,
    explanation: `CREATE EXTERNAL TABLE on an external location lets a principal create tables whose files sit under that location's path. CREATE TABLE is a privilege on a schema, not on a location, so the group also needs CREATE TABLE and USE SCHEMA on the schema that will hold the table, and USE CATALOG on its catalog. READ FILES and WRITE FILES on the location are for reading and writing the files directly.`,
    tieredHints: {
      apiSignature: 'GRANT privilege ON EXTERNAL LOCATION location_name TO principal',
      skeleton: 'GRANT ____ ____ TABLE ON EXTERNAL LOCATION ____ TO ____',
    },
    hints: ['GRANT privilege ON EXTERNAL LOCATION name TO principal', 'The privilege names the kind of table it creates'],
    tags: ['sql', 'grant', 'external-locations'],
    concepts: ['ucat-grants', 'ucat-storage-credentials'],
  },

  {
    id: 'uc-gov-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'How does Unity Catalog give each group only its own rows of a table?',
    options: [
      { id: 'a', text: 'A separate filtered copy of the table is kept for each group and refreshed by a scheduled job', isCorrect: false },
      { id: 'b', text: 'A function returning BOOLEAN is bound with SET ROW FILTER and runs for whoever queries the table', isCorrect: true },
      { id: 'c', text: 'GRANT SELECT takes a WHERE clause, and the condition is stored with the privilege for each group', isCorrect: false },
      { id: 'd', text: `The table is partitioned by group, and cloud storage permissions keep each group's files apart`, isCorrect: false },
    ],
    explanation: 'A row filter is a SQL function that returns BOOLEAN, bound with ALTER TABLE t SET ROW FILTER f ON (col). Unity Catalog runs it inside every query of the table and keeps only the rows for which it returns true, and functions such as is_account_group_member() and current_user() inside it describe whoever runs the query. There is one table and no copies, GRANT has no WHERE clause, and storage permissions cannot filter rows.',
    hints: ['Look for a function that runs at query time for the current user.'],
    tags: ['security', 'row-filter', 'udf'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Arrange the lines to create a mask function that shows "ssn" in full to group hr_admins and as ***-**-**** to everyone else, then bind it to column "ssn" of table "main.hr.employees". Two lines are not needed.',
    correctOrder: ['CREATE FUNCTION main.hr.ssn_mask(ssn STRING)', 'RETURNS STRING', `RETURN IF(is_account_group_member('hr_admins'), ssn, '***-**-****');`, 'ALTER TABLE main.hr.employees', 'ALTER COLUMN ssn', 'SET MASK main.hr.ssn_mask;'],
    distractorLines: ['RETURNS BOOLEAN', 'SET ROW FILTER main.hr.ssn_mask ON (ssn);'],
    solution: `CREATE FUNCTION main.hr.ssn_mask(ssn STRING)
RETURNS STRING
RETURN IF(is_account_group_member('hr_admins'), ssn, '***-**-****');
ALTER TABLE main.hr.employees
ALTER COLUMN ssn
SET MASK main.hr.ssn_mask;`,
    explanation: `The function must exist before it is bound, so CREATE FUNCTION comes first. A column mask takes the column's value and returns a value of the same type, so it RETURNS STRING (RETURNS BOOLEAN is the shape of a row filter). ALTER TABLE ... ALTER COLUMN ssn SET MASK binds it to that column, and every query then sees what the function returns: the real value for hr_admins and ***-**-**** for everyone else. SET ROW FILTER would bind it as a row filter on the table instead.`,
    hints: ['Which must exist first, the function or the binding?', 'A mask returns the same type as the column it masks.'],
    tags: ['security', 'column-mask', 'sql'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Table corp.hr.staff (region STRING, pay INT) holds the rows shown. Its owner runs the first four statements. Then a member of the group analysts, who is not in hr_admins and holds USE CATALOG, USE SCHEMA and SELECT on the table, runs the last query. What does it return? The answer is one row of two numbers.',
    tables: [
      { name: 'corp.hr.staff', columns: ['region', 'pay'], rows: [
        ['EU', 100],
        ['EU', 200],
        ['US', 300],
      ] },
    ],
    code: `CREATE FUNCTION corp.hr.eu_only(region STRING) RETURNS BOOLEAN
  RETURN is_account_group_member('hr_admins') OR region = 'EU';
CREATE FUNCTION corp.hr.hide_pay(pay INT) RETURNS INT
  RETURN CASE WHEN is_account_group_member('hr_admins') THEN pay END;
ALTER TABLE corp.hr.staff SET ROW FILTER corp.hr.eu_only ON (region);
ALTER TABLE corp.hr.staff ALTER COLUMN pay SET MASK corp.hr.hide_pay;
SELECT COUNT(*), COUNT(pay) FROM corp.hr.staff;`,
    expectedOutput: `2, 0`,
    explanation: 'Unity Catalog runs the row filter and the column mask inside every query of the table, so the analyst never sees the stored values. The row filter keeps a row only when its function returns true: the analyst is not in hr_admins, so only the two EU rows remain, and COUNT(*) is 2. The column mask replaces each pay value with what its function returns, and for someone outside hr_admins the CASE has no ELSE, so it returns NULL. COUNT(pay) counts non-NULL values, so it is 0. A member of hr_admins running the same query gets 3, 3.',
    hints: ['Which rows does eu_only keep for someone outside hr_admins?', 'What does a CASE with no matching WHEN and no ELSE return, and what does COUNT(col) skip?'],
    tags: ['security', 'row-filter', 'column-mask', 'unity-catalog', 'predict'],
    concepts: ['ucat-row-column-security'],
  },

  {
    id: 'uc-gov-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'Where can an admin query Unity Catalog audit events, such as grants changed and tables read?',
    options: [
      { id: 'a', text: `In each table's history, shown by DESCRIBE HISTORY`, isCorrect: false },
      { id: 'b', text: 'In information_schema.table_privileges of a catalog', isCorrect: false },
      { id: 'c', text: 'In SHOW GRANTS output, which keeps past grants too', isCorrect: false },
      { id: 'd', text: 'In the system table system.access.audit, with SQL', isCorrect: true },
    ],
    explanation: `system.access.audit is a system table that records account events, Unity Catalog's among them: who granted or revoked what, who read which table, when and from where. An admin queries it with ordinary SQL once the system schema is enabled. DESCRIBE HISTORY shows the writes to one Delta table, not reads or grants; information_schema.table_privileges and SHOW GRANTS show only the grants that hold now.`,
    hints: ['Look for a system table that records events over time, not current state.'],
    tags: ['audit', 'system-tables', 'governance'],
    concepts: ['ucat-system-tables'],
  },

  {
    id: 'uc-gov-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.UNITY_CATALOG_GOVERNANCE,
    question: 'A developer pastes an AWS access key into a notebook to read files from S3 directly. What is wrong with this?',
    options: [
      { id: 'a', text: 'Nothing, as long as the notebook stays in the private folder of the developer, where Databricks redacts the key', isCorrect: false },
      { id: 'b', text: `Anyone who can open the notebook can read the key, and reads made with it skip Unity Catalog's grants and audit`, isCorrect: true },
      { id: 'c', text: 'Unity Catalog still applies its grants to those reads, so the only thing lost is the entries in the audit log', isCorrect: false },
      { id: 'd', text: 'Only that the key will expire one day; reading through an external location needs the same key in the code', isCorrect: false },
    ],
    explanation: 'A key typed into a notebook can be read by everyone who can open the notebook, its revision history or a Git copy of it, and reads made with it go straight to S3, so Unity Catalog neither checks its grants nor writes them to the audit log. Databricks redacts only values read through dbutils.secrets, not text in the source. Ask an admin for an external location on the path, or a volume over it, and a grant on that: the credential then stays with Unity Catalog and no one handles the key.',
    hints: ['Who can see the notebook, and what does a direct read skip?'],
    tags: ['anti-pattern', 'security', 'credentials'],
    concepts: ['ucat-storage-credentials', 'dbx-platform-security'],
  },
];
