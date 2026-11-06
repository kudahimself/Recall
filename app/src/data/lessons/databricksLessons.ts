/**
 * Databricks lessons, one per topic, in course order.
 *
 * Section 1, Lakehouse Platform: every topic.
 * Section 2, ELT with Spark SQL & Python: every topic.
 *
 * Prose keeps one sentence per source line (`lines`). Most worked examples
 * here are Databricks notebook cells: they need a workspace to run, so they
 * set `runs: false`, say in their first-line comment what they assume, and
 * their output was checked against current Databricks (Unity Catalog, Delta
 * Lake 3+); the section 2 cells were also run on Spark 4.0 with ANSI mode on
 * and off. SQL in a cell runs through `spark.sql`, as it would in a Python
 * notebook. A plain SQL example (joins, aggregations, subqueries, set
 * operations) uses only SQL that Spark and the checker's engine agree on, so
 * check-lessons.js runs it.
 */
import { CodeLanguage, Topic, TopicLesson } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const databricksLessons: TopicLesson[] = [
  // ===== Section 1, Lakehouse Platform =====
  {
    id: 'databricks_basics/1',
    topicKeys: [Topic.DATABRICKS_BASICS],
    step: 1,
    title: 'Databricks Fundamentals',
    idea: [
      lines(
        "Databricks is a managed data platform built on Apache Spark, the engine that splits one job across many machines.",
        "You work in a workspace, where notebooks, SQL queries, jobs and Git folders live, while the data itself stays in your cloud object storage.",
      ),
      lines(
        "Code runs on compute: a cluster has one driver, which runs your notebook code and plans each job, and workers, which run the job's tasks in parallel.",
        "A notebook attached to compute already has `spark`, the session that reads tables and runs SQL, so there is nothing to set up.",
        "An action such as `count()` or `collect()` runs the job and brings its result back to the driver.",
      ),
      lines(
        "Tables are stored with Delta Lake, open Parquet files plus a transaction log that adds ACID commits and time travel, and Unity Catalog governs who may use them.",
        "Auto Loader picks up new files as they land in storage, each file exactly once.",
        "DBFS, the Databricks File System, is the legacy way to reach files; Unity Catalog tables and volumes replace it.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# A notebook attached to compute: spark is ready to use
df = spark.table("catalog.schema.table")          # read a Unity Catalog table
df = spark.sql("SELECT col FROM catalog.schema.table WHERE ...")
df.filter("col > 0").count()                      # an action: the cluster runs a job
df.write.mode("overwrite").saveAsTable("catalog.schema.new_table")   # a Delta table
spark.readStream.format("cloudFiles")             # Auto Loader: new files only`,
    },
    pitfall: lines(
      "Plain Python in a cell runs on the driver alone, and only Spark work, DataFrames and SQL, is spread over the workers.",
      "Looping in Python over `collect()` pulls every row onto one machine, so keep the work in Spark and collect only small results.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create tables in main.library
books = spark.createDataFrame(
    [(1, "Dune", 1965), (2, "Emma", 1815), (3, "Ubik", 1969)],
    ["book_id", "title", "year"],
)
print(books.count())
books.write.mode("overwrite").saveAsTable("main.library.books")
modern = spark.table("main.library.books").filter("year > 1900")
print(sorted(r.title for r in modern.collect()))
print(spark.sql("DESCRIBE DETAIL main.library.books").first()["format"])`,
      steps: [
        "Lines 2-5: `spark` is the notebook's own session, and `createDataFrame` turns three Python tuples into a DataFrame with named columns.",
        "Line 6: `count()` is an action, so the cluster runs a job and the driver prints 3.",
        "Line 7: `saveAsTable` writes the rows as the managed table `main.library.books`, registered in Unity Catalog.",
        "Lines 8-9: reading and filtering the table is Spark work on the workers, and `collect()` brings the two matching rows back to the driver.",
        "Line 10: `DESCRIBE DETAIL` shows the table's format, `delta`, the default for every table you create on Databricks.",
      ],
      output: `3
['Dune', 'Ubik']
delta`,
    },
    exercises: [
      'db-basic-1',
      'db-basic-2',
      'dbx-basics-predict-1',
      'db-basic-4',
      'db-basic-5',
    ],
  },
  {
    id: 'databricks_compute_admin/1',
    topicKeys: [Topic.DATABRICKS_COMPUTE_ADMIN],
    step: 1,
    title: 'Compute & Cluster Administration',
    idea: [
      lines(
        "An all-purpose cluster is for interactive work: many notebooks share it, and it stops itself after its auto-termination idle time.",
        "Job compute is created for one job run and shut down when the run ends, and it costs less per hour.",
        "A SQL warehouse runs SQL for queries and dashboards, best as serverless, which starts in seconds, and serverless compute can also run notebooks and jobs with no cluster to manage.",
      ),
      lines(
        "A cluster is a driver plus workers, and autoscaling keeps the worker count between a minimum and a maximum.",
        "The Databricks Runtime version fixes the Spark and library versions; pick an LTS release for production.",
        "Photon is a faster engine for SQL and DataFrame work, but Python UDFs and RDD code still run on plain Spark.",
      ),
      lines(
        "The access mode decides who may share a cluster: Standard (formerly Shared) lets many users share it with Unity Catalog permissions and isolation between them, and Dedicated (formerly Single user) serves one user or group.",
        "A cluster policy fixes or caps settings, such as the runtime or the maximum workers, for everyone who creates compute under it.",
        "An init script runs on every node as it starts; keep it in a Unity Catalog volume or as a workspace file, not in DBFS.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# A cluster spec, as the Clusters API or a job's new_cluster takes it
{
    "spark_version": "15.4.x-scala2.12",                 # an LTS runtime
    "node_type_id": "<vm size>",                         # driver and workers
    "autoscale": {"min_workers": 1, "max_workers": 8},
    "autotermination_minutes": 30,                       # all-purpose clusters
    "data_security_mode": "USER_ISOLATION",              # Standard access mode
    "runtime_engine": "PHOTON",
    "init_scripts": [{"volumes": {"destination": "/Volumes/cat/sch/vol/init.sh"}}],
    "policy_id": "<policy>",                             # its rules win over the spec
}`,
    },
    pitfall: lines(
      "Scheduled jobs can run on an all-purpose cluster, but they then pay the interactive price and keep the cluster up between runs.",
      "Give each production job its own job compute, or serverless, and keep all-purpose clusters for interactive work.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Azure; the SDK signs in as you, and you may create clusters
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.compute import AutoScale, DataSecurityMode

w = WorkspaceClient()
c = w.clusters.create_and_wait(
    cluster_name="library-etl",
    spark_version="15.4.x-scala2.12",
    node_type_id="Standard_D4ds_v5",
    autoscale=AutoScale(min_workers=1, max_workers=4),
    autotermination_minutes=30,
    data_security_mode=DataSecurityMode.USER_ISOLATION,
)
print(c.state.value, c.autoscale.max_workers, c.autotermination_minutes)
print(c.data_security_mode.value)`,
      steps: [
        "Lines 2-5: inside a notebook, `WorkspaceClient()` picks up the notebook's own credentials, so nothing needs configuring.",
        "Lines 8-9: `15.4.x-scala2.12` is an LTS runtime, and the node type is the VM size of the driver and of every worker.",
        "Line 10: autoscaling adds workers, up to 4, under load and removes them again when they are idle.",
        "Line 11: after 30 idle minutes the cluster stops itself, so nobody pays for it overnight.",
        "Line 12: `USER_ISOLATION` is the API name of Standard access mode, so several users can share the cluster under Unity Catalog permissions.",
        "Lines 14-15: `create_and_wait` returns once the cluster is up, so its state is `RUNNING`.",
      ],
      output: `RUNNING 4 30
USER_ISOLATION`,
    },
    exercises: [
      'dbx-compute-admin-8',
      'dbx-compute-admin-2',
      'dbx-compute-admin-17',
      'dbx-compute-admin-32',
      'dbx-compute-admin-35',
    ],
  },
  {
    id: 'databricks_platform/1',
    topicKeys: [Topic.DATABRICKS_PLATFORM],
    step: 1,
    title: 'Databricks Platform Essentials',
    idea: [
      lines(
        "Unity Catalog names every table with three parts, `catalog.schema.table`, and governs them all in one place, with access control, an audit log and lineage.",
        "`CREATE CATALOG` and `CREATE SCHEMA` make the containers, and `GRANT privilege ON object TO principal` gives access.",
      ),
      lines(
        "A session has a current catalog and schema, set by `USE CATALOG` and `USE SCHEMA`, and a name with fewer than three parts is resolved against them.",
        "`SHOW TABLES IN schema` lists a schema's tables, `DESCRIBE EXTENDED t` shows a table's columns and then its location, owner and properties, and `DESCRIBE DETAIL t` gives a Delta table's format, size and file count.",
      ),
      lines(
        "`CREATE OR REPLACE TEMP VIEW v AS SELECT ...` saves a query, not data, for the current session only.",
        "Git folders (formerly Repos) clone a Git repository into the workspace, so you can branch, commit, pull and push notebooks and code from the UI.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE CATALOG IF NOT EXISTS cat;
CREATE SCHEMA IF NOT EXISTS cat.sch;
USE CATALOG cat;                 -- also resets the current schema to default
USE SCHEMA sch;                  -- now sch.t and t both mean cat.sch.t
SELECT * FROM cat.sch.t;         -- the full name works in any session
SHOW TABLES IN cat.sch;
DESCRIBE EXTENDED cat.sch.t;     -- columns, then location, owner, properties
DESCRIBE DETAIL cat.sch.t;       -- format, numFiles, sizeInBytes
CREATE OR REPLACE TEMP VIEW v AS SELECT * FROM cat.sch.t WHERE col = 'x';
GRANT SELECT ON SCHEMA cat.sch TO \`group\`;`,
    },
    pitfall: lines(
      "`USE CATALOG` also resets the current schema to `default`, so a `USE SCHEMA` run before it no longer applies.",
      "In jobs and shared notebooks, name tables in full, `catalog.schema.table`, rather than relying on what the session chose last.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create schemas in catalog main
spark.sql("CREATE SCHEMA IF NOT EXISTS main.library")
spark.sql("CREATE OR REPLACE TABLE main.library.loans (loan_id INT, title STRING)")
spark.sql("INSERT INTO main.library.loans VALUES (1, 'Dune'), (2, 'Emma'), (3, 'Dune')")
spark.sql("USE CATALOG main")
spark.sql("USE SCHEMA library")
print(tuple(spark.sql("SELECT current_catalog() AS c, current_schema() AS s").first()))
print(spark.table("loans").count())
spark.sql("CREATE OR REPLACE TEMP VIEW dune_loans AS SELECT * FROM loans WHERE title = 'Dune'")
print(spark.table("dune_loans").count())`,
      steps: [
        "Lines 2-4: every statement uses the full three-part name, so it works whatever the session's current catalog is.",
        "Lines 5-6: `USE CATALOG` and then `USE SCHEMA` make `main.library` current; in the other order, `USE CATALOG` would reset the schema to `default`.",
        "Line 7: `current_catalog()` and `current_schema()` confirm where short names now resolve.",
        "Line 8: the one-part name `loans` resolves to `main.library.loans`, which holds 3 rows.",
        "Lines 9-10: the temp view stores the query, not its rows, and it lasts only as long as this session.",
      ],
      output: `('main', 'library')
3
2`,
    },
    exercises: [
      'platform-repos-1',
      'catalog-1',
      'platform-predict-1',
      'platform-sql-1',
    ],
  },
  {
    id: 'databricks_storage_repos/1',
    topicKeys: [Topic.DATABRICKS_STORAGE_REPOS],
    step: 1,
    title: 'Storage Architecture, DBFS & Git Repos',
    idea: [
      lines(
        "All table and file data lives in cloud object storage, addressed by a URI: `abfss://container@account.dfs.core.windows.net/path` on Azure, `s3://bucket/path` on AWS and `gs://bucket/path` on Google Cloud.",
        "Unity Catalog decides who may reach it: a storage credential holds the cloud identity, and an external location ties that credential to a path you can grant on.",
      ),
      lines(
        "A volume gives governed files a plain path, `/Volumes/catalog/schema/volume/file`, which Spark, `dbutils.fs` and Python's `open` can all read.",
        "Access is granted in SQL, as in `GRANT READ VOLUME ON VOLUME cat.sch.vol TO group`.",
        "`dbutils.fs.ls`, `mkdirs`, `put`, `cp`, `mv` and `rm` manage the files, while the driver's local disk, `file:/tmp`, is wiped when the cluster stops.",
      ),
      lines(
        "DBFS, with its root `dbfs:/` and its mounts under `/mnt`, is the legacy layer, and Unity Catalog volumes and tables replace it.",
        "A Git folder (formerly Repos) clones a repository into the workspace, signs in with a personal access token or the Databricks GitHub App, and puts the repository root on `sys.path`, so a notebook can `import` the repository's `.py` modules.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `uri = "abfss://container@account.dfs.core.windows.net/dir/file"   # raw cloud storage
vol = "/Volumes/catalog/schema/volume"            # governed file path
dbutils.fs.ls(vol)                                # FileInfo list; folders end in "/"
dbutils.fs.mkdirs(f"{vol}/dir")
dbutils.fs.put(f"{vol}/dir/f.txt", "text", overwrite=True)
dbutils.fs.cp(src, dst); dbutils.fs.mv(src, dst); dbutils.fs.rm(d, recurse=True)
spark.read.option("header", "true").csv(f"{vol}/dir/f.csv")
from helpers.utils import fn                      # a module in the same Git folder
# SQL: GRANT READ VOLUME ON VOLUME catalog.schema.volume TO \`group\`
# legacy, avoid: dbutils.fs.mount(...), "/mnt/...", "dbfs:/..."`,
    },
    pitfall: lines(
      "A mount looks like a shortcut, but it shares one storage credential with everyone who can run code in the workspace, and Unity Catalog cannot limit it per user.",
      "For new work, reach files through a volume path, `/Volumes/...`, granted with `READ VOLUME`, and tables by their three-part name.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; main.library.landing is an empty volume you may write to
base = "/Volumes/main/library/landing"
dbutils.fs.mkdirs(f"{base}/archive")
dbutils.fs.put(f"{base}/loans.csv", "loan_id,title\\n1,Dune\\n2,Emma\\n", overwrite=True)
print(sorted(f.name for f in dbutils.fs.ls(base)))
dbutils.fs.mv(f"{base}/loans.csv", f"{base}/archive/loans.csv")
loans = spark.read.option("header", "true").csv(f"{base}/archive/loans.csv")
print(loans.count())
with open(f"{base}/archive/loans.csv") as fh:
    print(fh.readline().strip())`,
      steps: [
        "Line 2: a volume path names the catalog, the schema and the volume, and Unity Catalog checks your volume grants on every access.",
        "Lines 3-4: `mkdirs` creates a folder, and `put` writes a small text file, replacing it if it exists.",
        "Line 5: `dbutils.fs.ls` returns FileInfo objects, and a folder's name ends with a slash.",
        "Line 6: `mv` moves the file into `archive/`, a usual last step once a landed file is loaded.",
        "Lines 7-10: Spark and plain Python `open` read the same path, since a volume also appears as a local path on the cluster.",
      ],
      output: `['archive/', 'loans.csv']
2
loan_id,title`,
    },
    exercises: [
      'dbx-storage-repos-1',
      'dbx-storage-repos-16',
      'dbx-storage-repos-10',
      'dbx-storage-repos-7',
      'dbx-storage-repos-4',
    ],
  },
  {
    id: 'unity_catalog_basics/1',
    topicKeys: [Topic.UNITY_CATALOG_BASICS],
    step: 1,
    title: 'Unity Catalog Foundations & Volumes (3-tier namespaces, volumes, managed/external tables)',
    idea: [
      lines(
        "Unity Catalog is one metastore for every workspace attached to it, and it names objects in three tiers: a catalog holds schemas, and a schema holds tables, views, volumes and functions.",
        "The legacy Hive metastore had two tiers, `schema.table`, one per workspace, and its tables appear under the `hive_metastore` catalog until they are migrated.",
      ),
      lines(
        "A managed table is created without `LOCATION`: Unity Catalog picks where its Delta files go and owns them, so `DROP TABLE` deletes the data too (`UNDROP` can bring it back for 7 days).",
        "An external table has a `LOCATION` inside an external location, and `DROP TABLE` only removes it from the catalog, leaving its files.",
        "Prefer managed tables, which also get predictive optimization.",
      ),
      lines(
        "A volume holds files that are not tables, such as CSV, JSON or images, under `/Volumes/catalog/schema/volume/`.",
        "A managed volume lives in Unity Catalog's storage and an external volume over a path of yours, and both replace DBFS mounts.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `CREATE CATALOG IF NOT EXISTS cat;
CREATE SCHEMA IF NOT EXISTS cat.sch;
CREATE TABLE cat.sch.t (id INT, col STRING);       -- managed: Delta, UC owns the files
CREATE TABLE cat.sch.ext (id INT)
  LOCATION 'abfss://container@account.dfs.core.windows.net/path';   -- external
CREATE VOLUME IF NOT EXISTS cat.sch.files;         -- managed volume
-- its files: /Volumes/cat/sch/files/name.csv
DROP TABLE cat.sch.t;      -- managed: the data goes too (UNDROP within 7 days)
DROP TABLE cat.sch.ext;    -- external: the files stay at the path`,
    },
    pitfall: lines(
      "Dropping a managed table deletes its data, while dropping an external table keeps it, and the only difference is whether the table was created with `LOCATION`.",
      "Before dropping a table you did not create, check the `Type` row of `DESCRIBE EXTENDED`, which reads `MANAGED` or `EXTERNAL`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create schemas in catalog main
spark.sql("CREATE SCHEMA IF NOT EXISTS main.library")
spark.sql("CREATE VOLUME IF NOT EXISTS main.library.inbox")
csv = "/Volumes/main/library/inbox/members.csv"
dbutils.fs.put(csv, "member_id,city\\n1,Leeds\\n2,York\\n", overwrite=True)
spark.sql(f"""CREATE OR REPLACE TABLE main.library.members AS
    SELECT member_id, city FROM read_files('{csv}', format => 'csv', header => true)""")
info = spark.sql("DESCRIBE TABLE EXTENDED main.library.members")
print(info.filter("col_name = 'Type'").first()["data_type"])
spark.sql("USE CATALOG main")
print(spark.read.table("library.members").count())`,
      steps: [
        "Lines 2-3: the schema and the volume are created by their full names, `main.library` and `main.library.inbox`.",
        "Lines 4-5: a volume is a folder of governed files, so a CSV can be written to its `/Volumes/...` path.",
        "Lines 6-7: the table is created from the file with `read_files` and without `LOCATION`, so it is a managed Delta table.",
        "Lines 8-9: `DESCRIBE TABLE EXTENDED` lists the columns and then facts about the table, and its `Type` row reads `MANAGED`.",
        "Lines 10-11: after `USE CATALOG main`, the two-part name `library.members` is enough to find the table's 2 rows.",
      ],
      output: `MANAGED
2`,
    },
    exercises: [
      'uc-basics-1',
      'uc-basics-5',
      'uc-basics-predict-1',
      'uc-basics-8',
      'uc-basics-6',
    ],
  },
  {
    id: 'databricks_notebooks_security/1',
    topicKeys: [Topic.DATABRICKS_NOTEBOOKS_SECURITY, Topic.DATABRICKS_UTILITIES],
    step: 1,
    title: 'Notebook Mechanics, Secrets & Security',
    idea: [
      lines(
        "A notebook has a default language, and a magic command on a cell's first line switches that one cell: `%sql`, `%python`, `%md` for text, `%sh` for a shell on the driver, `%pip install` for libraries and `%run ./other` to run another notebook in this one's scope.",
        "Variables do not cross languages, so a Python variable is not visible in a `%sql` cell.",
      ),
      lines(
        "`dbutils` is the notebook's toolbox: `dbutils.fs` for files, `dbutils.widgets` for parameters, `dbutils.secrets` for secrets and `dbutils.notebook` to run another notebook or exit with a value.",
        "A widget is an input at the top of the notebook, and a job passes its parameters into the widgets of the same name.",
        "`dbutils.widgets.get` always returns a string, so convert numbers yourself.",
      ),
      lines(
        "Secrets live in a secret scope, backed by Databricks or by Azure Key Vault, and the scope's permissions decide who may read them.",
        "`dbutils.secrets.get(scope, key)` reads one at run time, and Databricks prints `[REDACTED]` wherever its value would appear in cell output.",
        "Workspace-wide security, such as IP access lists that limit where users can sign in from, is set by admins.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# %sql / %md / %sh / %pip install pkg / %run ./other   (first line of a cell)
dbutils.widgets.text("w", "default")                  # a text box
dbutils.widgets.dropdown("w", "a", ["a", "b"])        # pick one choice
value = dbutils.widgets.get("w")                      # always a str
dbutils.widgets.remove("w")
secret = dbutils.secrets.get(scope="scope", key="key")   # printed as [REDACTED]
dbutils.secrets.listScopes(); dbutils.secrets.list("scope")
result = dbutils.notebook.run("./child", 60, {"arg": "x"})   # timeout in seconds
dbutils.notebook.exit("value")                        # what the caller gets back`,
    },
    pitfall: lines(
      "A password or token typed into a notebook or a widget is visible to everyone who can read the notebook or its revision history.",
      "Keep it in a secret scope and read it with `dbutils.secrets.get`, which keeps it out of the code and shows `[REDACTED]` if it is printed.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; secret scope "library" holds one key, "api_token"
dbutils.widgets.dropdown("branch", "leeds", ["leeds", "york"])
dbutils.widgets.text("days", "14")
branch = dbutils.widgets.get("branch")
days = int(dbutils.widgets.get("days"))
token = dbutils.secrets.get(scope="library", key="api_token")
print(branch, days + 7)
print(token)
print(len(token) > 0)
print([s.key for s in dbutils.secrets.list("library")])`,
      steps: [
        "Lines 2-3: each widget appears above the notebook with its default, and a job run can pass a different value under the same name.",
        "Lines 4-5: `get` returns text, so `days` is converted with `int` before any arithmetic.",
        "Line 6: the token comes from the secret scope at run time and is never written in the notebook.",
        "Lines 7-9: printing the secret shows `[REDACTED]`, yet the real value is there, as its length shows.",
        "Line 10: `dbutils.secrets.list` gives the keys of a scope, never their values.",
      ],
      output: `leeds 21
[REDACTED]
True
['api_token']`,
    },
    exercises: [
      'dbutils-1',
      'dbx-notebooks-sec-predict-1',
      'dbx-notebooks-sec-1',
      'dbx-notebooks-sec-6',
      'dbx-notebooks-sec-8',
    ],
  },
  {
    id: 'delta_lake_basics/1',
    topicKeys: [Topic.DELTA_LAKE_BASICS],
    step: 1,
    title: 'Delta Lake Fundamentals',
    idea: [
      lines(
        "A Delta table is a folder of Parquet data files plus a transaction log, `_delta_log`, of numbered commits.",
        "Each commit records which files were added and which were removed, and a reader takes exactly the files of the latest commit, so a write is all or nothing: ACID transactions on plain object storage.",
      ),
      lines(
        "On Databricks every table is Delta unless you say otherwise.",
        "In Python, `df.write.mode(\"append\")` adds rows and `mode(\"overwrite\")` replaces the table's contents in one commit, by name with `saveAsTable`, and `spark.table` reads the table back.",
        "A table kept at a path uses `format(\"delta\")` with `save(path)` and `load(path)`, and under Unity Catalog that path must lie in an external location.",
      ),
      lines(
        "Delta enforces the table's schema: a write whose columns do not match fails and commits nothing, unless `option(\"mergeSchema\", \"true\")` allows the new columns.",
        "Every commit is a version, which `DESCRIBE HISTORY` lists and time travel can read.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `df.write.mode("overwrite").saveAsTable("cat.sch.t")    # create or replace: one commit
df.write.mode("append").saveAsTable("cat.sch.t")       # add rows: one commit
spark.table("cat.sch.t")                               # the latest version
df.write.format("delta").mode("append").save(path)     # a table at a path
spark.read.format("delta").load(path)
df.write.mode("append").option("mergeSchema", "true").saveAsTable("cat.sch.t")   # allow new columns
spark.sql("DESCRIBE HISTORY cat.sch.t")                 # one row per version`,
    },
    pitfall: lines(
      "`mode(\"overwrite\")` replaces every row of the table, not only the rows you are writing again.",
      "Use `append` to add rows, and `MERGE`, `UPDATE` or `DELETE` to change some of them.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create tables in main.library
t = "main.library.loans"
first = spark.createDataFrame([(1, "Dune"), (2, "Emma")], ["loan_id", "title"])
first.write.mode("overwrite").saveAsTable(t)
spark.createDataFrame([(3, "Ubik")], ["loan_id", "title"]).write.mode("append").saveAsTable(t)
print(spark.table(t).count())
extra = spark.createDataFrame([(4, "Kim", 2)], ["loan_id", "title", "copies"])
try:
    extra.write.mode("append").saveAsTable(t)
except Exception as e:
    print(type(e).__name__)
print([r.version for r in spark.sql(f"DESCRIBE HISTORY {t}").collect()])
print(spark.table(t).columns)`,
      steps: [
        "Lines 2-4: `saveAsTable` with `overwrite` creates the Delta table as version 0.",
        "Lines 5-6: `append` adds one row as version 1, so the table holds 3 rows.",
        "Lines 7-11: the new DataFrame has an extra `copies` column, so Delta refuses the write with an `AnalysisException`.",
        "Line 12: `DESCRIBE HISTORY` lists the versions newest first, and the failed write left no version behind.",
        "Line 13: the schema is unchanged, since only `mergeSchema` would have added the column.",
      ],
      output: `3
AnalysisException
[1, 0]
['loan_id', 'title']`,
    },
    exercises: [
      'delta-basics-mcq-1',
      'delta-basics-predict-1',
      'delta-1',
      'delta-2',
    ],
  },
  {
    id: 'delta_operations/1',
    topicKeys: [Topic.DELTA_OPERATIONS],
    step: 1,
    title: 'Delta Operations (MERGE, CLONE)',
    idea: [
      lines(
        "Delta tables take SQL changes: `UPDATE t SET col = v WHERE ...` and `DELETE FROM t WHERE ...` each change the matching rows in one commit.",
        "The replaced files are only marked removed, so earlier versions stay readable until VACUUM.",
      ),
      lines(
        "`MERGE INTO target USING source ON key` is the upsert: `WHEN MATCHED THEN UPDATE` (or `DELETE`) acts on rows found in both, and `WHEN NOT MATCHED THEN INSERT` adds the source rows the target lacks.",
        "`UPDATE SET *` and `INSERT *` copy every column by name, and `WHEN NOT MATCHED BY SOURCE` acts on target rows that the source lacks.",
      ),
      lines(
        "`CREATE TABLE copy SHALLOW CLONE src` copies only the metadata and reads the source's files, which is quick for tests, while `DEEP CLONE` copies the files too, for an independent copy.",
        "A `CHECK` constraint or `NOT NULL` is enforced on every write, while primary and foreign keys are informational only.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `UPDATE t SET col = value WHERE cond;
DELETE FROM t WHERE cond;
MERGE INTO target AS t
USING source AS s
ON t.key = s.key
WHEN MATCHED THEN UPDATE SET *             -- or SET t.col = s.col, ...
WHEN NOT MATCHED THEN INSERT *             -- source rows new to the target
WHEN NOT MATCHED BY SOURCE THEN DELETE;    -- optional: target rows the source lacks
CREATE TABLE t_dev SHALLOW CLONE t;        -- metadata only, reads t's files
CREATE TABLE t_copy DEEP CLONE t;          -- copies the files too
ALTER TABLE t ADD CONSTRAINT name CHECK (col > 0);`,
    },
    pitfall: lines(
      "MERGE only touches the target rows a clause names, so a target row with no match in the source stays as it is.",
      "Making the target mirror the source takes `WHEN NOT MATCHED BY SOURCE THEN DELETE`, and a source with two rows for one key must be deduplicated first.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create tables in main.library
spark.sql("CREATE OR REPLACE TABLE main.library.holdings (isbn STRING, copies INT)")
spark.sql("INSERT INTO main.library.holdings VALUES ('A1', 2), ('B2', 5), ('C3', 1)")
spark.sql("CREATE OR REPLACE TABLE main.library.delivery (isbn STRING, copies INT)")
spark.sql("INSERT INTO main.library.delivery VALUES ('A1', 3), ('D4', 4)")
spark.sql("""MERGE INTO main.library.holdings h USING main.library.delivery d
ON h.isbn = d.isbn
WHEN MATCHED THEN UPDATE SET h.copies = h.copies + d.copies
WHEN NOT MATCHED THEN INSERT (isbn, copies) VALUES (d.isbn, d.copies)""")
spark.sql("DELETE FROM main.library.holdings WHERE copies < 2")
print([tuple(r) for r in spark.table("main.library.holdings").orderBy("isbn").collect()])
spark.sql("CREATE OR REPLACE TABLE main.library.holdings_dev SHALLOW CLONE main.library.holdings")
print(spark.table("main.library.holdings_dev").count())`,
      steps: [
        "Lines 2-5: the target `holdings` holds three titles, and `delivery` holds the new copies, one row per ISBN.",
        "Lines 6-9: A1 is in both tables, so its copies become 2 + 3, while D4 is new and is inserted.",
        "Line 10: B2 and C3 had no delivery, so MERGE left them alone, and the DELETE then removes C3, the only title with fewer than 2 copies.",
        "Line 11: each statement was its own commit, and the table now holds A1, B2 and D4.",
        "Lines 12-13: the shallow clone copies only metadata and reads the files of `holdings`, so it starts with the same 3 rows.",
      ],
      output: `[('A1', 5), ('B2', 5), ('D4', 4)]
3`,
    },
    exercises: [
      'delta-clone-1',
      'delta-merge-1',
      'delta-ops-predict-1',
      'delta-4',
      'delta-5',
    ],
  },
  {
    id: 'delta_time_travel/1',
    topicKeys: [Topic.DELTA_TIME_TRAVEL],
    step: 1,
    title: 'Delta Time Travel',
    idea: [
      lines(
        "Every commit to a Delta table is a version, numbered from 0, and `DESCRIBE HISTORY t` lists them newest first with their timestamp, user, operation and metrics.",
        "Old versions stay readable because a commit only marks the files it replaces as removed.",
      ),
      lines(
        "`SELECT ... FROM t VERSION AS OF 5` (or `t@v5`) reads version 5, and `TIMESTAMP AS OF '2026-01-15'` reads the version that was current at that time.",
        "In Python, `spark.read.option(\"versionAsOf\", 5).table(\"t\")` does the same, as does `timestampAsOf`.",
      ),
      lines(
        "`RESTORE TABLE t TO VERSION AS OF 5` puts the table back as it was by committing a new version with that state, so the history keeps everything after version 5.",
        "Time travel only reaches back as far as the files exist: VACUUM deletes removed files older than the retention period, 7 days by default.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `DESCRIBE HISTORY t;                                -- version, timestamp, operation, ...
SELECT * FROM t VERSION AS OF 5;                   -- or t@v5
SELECT * FROM t TIMESTAMP AS OF '2026-01-15T10:00:00';
RESTORE TABLE t TO VERSION AS OF 5;                -- a new version holding v5's rows
RESTORE TABLE t TO TIMESTAMP AS OF '2026-01-15T10:00:00';
-- Python: spark.read.option("versionAsOf", 5).table("cat.sch.t")`,
    },
    pitfall: lines(
      "`RESTORE` neither deletes the later versions nor turns the version number back: restoring a table at version 7 to version 5 creates version 8.",
      "So a restore can itself be undone, and `DESCRIBE HISTORY` still shows the change that went wrong.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; you may create tables in main.library
t = "main.library.shelves"
spark.sql(f"CREATE OR REPLACE TABLE {t} (shelf STRING, books INT)")
spark.sql(f"INSERT INTO {t} VALUES ('A', 40), ('B', 25)")
spark.sql(f"UPDATE {t} SET books = 0")
total = lambda query: spark.sql(query).first()[0]
print(total(f"SELECT SUM(books) FROM {t}"), total(f"SELECT SUM(books) FROM {t} VERSION AS OF 1"))
print([r.version for r in spark.sql(f"DESCRIBE HISTORY {t}").collect()])
spark.sql(f"RESTORE TABLE {t} TO VERSION AS OF 1")
print(total(f"SELECT SUM(books) FROM {t}"))
print(spark.sql(f"DESCRIBE HISTORY {t}").first().version)`,
      steps: [
        "Lines 3-5: the CREATE, the INSERT and the UPDATE commit versions 0, 1 and 2.",
        "Line 7: the table now sums to 0, while `VERSION AS OF 1` still reads the 65 books from before the UPDATE.",
        "Line 8: `DESCRIBE HISTORY` lists the versions newest first.",
        "Line 9: `RESTORE` brings back the rows of version 1 by committing them as a new version.",
        "Lines 10-11: the sum is 65 again, and the latest version is 3, not 1, so the UPDATE stays in the history.",
      ],
      output: `0 65
[2, 1, 0]
65
3`,
    },
    exercises: [
      'delta-tt-mcq-1',
      'delta-tt-predict-1',
      'restore-3',
      'delta-7',
    ],
  },
  {
    id: 'delta_optimization/1',
    topicKeys: [Topic.DELTA_OPTIMIZATION],
    step: 1,
    title: 'Delta Optimization (OPTIMIZE, VACUUM, ZORDER)',
    idea: [
      lines(
        "Many small writes leave a table with many small files, and every query pays to open each one.",
        "`OPTIMIZE t` compacts small files into larger ones, of about 1 GB, and commits that as a new version without changing a single row.",
      ),
      lines(
        "`OPTIMIZE t ZORDER BY (col)` also sorts the data so that rows with close values of `col` share files.",
        "Delta keeps each file's minimum and maximum per column, so a filter on `col` can then skip most files.",
        "Z-order on one to a few high-cardinality columns that queries filter on, never on a partition column.",
        "For new tables Databricks recommends liquid clustering, `CLUSTER BY (col)`, which replaces partitioning and Z-ordering and is kept up by a plain `OPTIMIZE`.",
      ),
      lines(
        "`VACUUM t` deletes the data files that the current version no longer uses and that were removed more than the retention period ago, 7 days by default (`RETAIN 168 HOURS`).",
        "That frees storage, but time travel can no longer reach the versions that needed those files.",
        "On Unity Catalog managed tables, predictive optimization can run OPTIMIZE and VACUUM for you.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `OPTIMIZE t;                             -- compact small files
OPTIMIZE t ZORDER BY (col1, col2);      -- compact and co-locate by these columns
CREATE TABLE t2 (col INT) CLUSTER BY (col);   -- liquid clustering, for new tables
VACUUM t;                               -- delete unused files older than 7 days
VACUUM t RETAIN 168 HOURS;              -- the same, with the retention in hours
DESCRIBE DETAIL t;                      -- numFiles, sizeInBytes`,
    },
    pitfall: lines(
      "OPTIMIZE frees no storage: the small files it replaced stay behind, marked removed, so time travel can still read them.",
      "Only `VACUUM` deletes them, once they are older than the retention period, and a retention shorter than your time travel needs breaks those reads.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook on Unity Catalog; each INSERT below writes one small file
t = "main.library.visits"
spark.sql(f"CREATE OR REPLACE TABLE {t} (member_id INT, branch STRING)")
for m in [3, 1, 2]:
    spark.sql(f"INSERT INTO {t} VALUES ({m}, 'Leeds')")
files = lambda: spark.sql(f"DESCRIBE DETAIL {t}").first().numFiles
print(files())
spark.sql(f"OPTIMIZE {t} ZORDER BY (member_id)")
print(files(), spark.table(t).count())
spark.sql(f"VACUUM {t}")
print(spark.read.option("versionAsOf", 3).table(t).count())`,
      steps: [
        "Lines 3-5: the CREATE is version 0, and each INSERT commits one small file, so versions 1 to 3 leave 3 files.",
        "Lines 6-7: `DESCRIBE DETAIL` reports `numFiles` for the current version.",
        "Line 8: OPTIMIZE rewrites the 3 files as one, sorted by `member_id`, and commits it as version 4.",
        "Line 9: there is 1 file now, and still 3 rows.",
        "Lines 10-11: VACUUM keeps files removed less than 7 days ago, so version 3, which needs the 3 small files, can still be read.",
      ],
      output: `3
1 3
3`,
    },
    exercises: [
      'delta-optimize-1',
      'delta-optimize-4',
      'delta-optimize-predict-1',
      'delta-optimize-2',
      'delta-9',
    ],
  },
  // ===== Section 2, ELT with Spark SQL & Python =====
  {
    id: 'pyspark_basics/1',
    topicKeys: [Topic.PYSPARK_BASICS, Topic.PYSPARK_DATAFRAMES],
    step: 1,
    title: 'DataFrame Basics (select, filter, withColumn)',
    idea: [
      lines(
        "A DataFrame is a table of rows with named, typed columns, spread over the cluster in partitions.",
        "In a notebook you get one from `spark.table(\"cat.sch.t\")`, from `spark.read` on files such as CSV, JSON or Parquet, or from `spark.createDataFrame(rows, columns)`, and `printSchema()` shows its columns and types.",
      ),
      lines(
        "`select` keeps the columns you list, `filter` (or `where`) keeps the rows whose condition is true, and `withColumn(\"c\", expr)` adds a column, or replaces the one already named `c`.",
        "Column expressions come from `pyspark.sql.functions`, such as `col`, `lit` and `when(...).otherwise(...)`, while `selectExpr` takes SQL strings instead, one per output column, like `\"price * qty AS total\"`.",
        "`col(\"c\").cast(\"double\")` changes a column's type.",
      ),
      lines(
        "`df.write` saves a DataFrame with a mode: `errorifexists` (the default), `append`, `overwrite` or `ignore`.",
        "`saveAsTable(\"cat.sch.t\")` writes it as a Delta table in Unity Catalog.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql.functions import col, when
df = spark.table("cat.sch.t")              # or spark.read.csv(path, header=True)
df.printSchema()                           # column names and types
df2 = (df.select("a", "b")                 # keep these columns
         .filter(col("a") > 0)             # keep these rows; where() is the same
         .withColumn("c", col("b") * 2)    # add a column, or replace one named c
         .withColumn("band", when(col("a") > 9, "high").otherwise("low")))
df.selectExpr("a", "b * 2 AS c")           # SQL strings, one per output column
df2.show(5)                                # an action: print 5 rows
df2.write.mode("append").saveAsTable("cat.sch.t2")`,
    },
    pitfall: lines(
      "A DataFrame never changes, so `df.withColumn(...)` on a line of its own does nothing: the new column is in the DataFrame it returns, which is thrown away.",
      "Assign the result, `df = df.withColumn(...)`, or chain the calls into one expression.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import col, when
books = spark.createDataFrame(
    [("Dune", "9.99", 3), ("Emma", "4.50", 0), ("Ubik", "7.25", 5)],
    ["title", "price", "stock"],
)
books.withColumn("price", col("price").cast("double"))
print(books.dtypes[1])
books = books.withColumn("price", col("price").cast("double"))
shelf = (books.filter(col("stock") > 0)
              .withColumn("value", col("price") * col("stock"))
              .withColumn("tier", when(col("price") >= 8, "premium").otherwise("standard"))
              .select("title", "value", "tier"))
for r in shelf.orderBy("title").collect():
    print(r.title, round(r.value, 2), r.tier)`,
      steps: [
        "Lines 3-6: `createDataFrame` builds three rows with named columns, and the prices arrive as strings.",
        "Lines 7-8: the cast on line 7 returns a new DataFrame that nobody keeps, so `price` is still a string.",
        "Line 9: assigning the result back to `books` makes the cast stick.",
        "Lines 10-13: `filter` drops Emma, who has no stock, and each `withColumn` adds one column, `tier` through `when` and `otherwise`.",
        "Lines 14-15: `select` kept only three columns, and `collect` brings the two rows back to print.",
      ],
      output: `('price', 'string')
Dune 29.97 premium
Ubik 36.25 standard`,
    },
    exercises: [
      'ps-basic-1',
      'ps-df-1',
      'io-6',
      'ps-selectexpr-4',
      'ps-df-4',
    ],
  },
  {
    id: 'pyspark_transformations/1',
    topicKeys: [Topic.PYSPARK_TRANSFORMATIONS, Topic.PYSPARK_ACTIONS],
    step: 1,
    title: 'Transformations & Actions (groupBy, orderBy, dropDuplicates, repartition, collect)',
    idea: [
      lines(
        "A transformation, such as `select`, `filter`, `groupBy`, `orderBy`, `join` or `dropDuplicates`, returns a new DataFrame and only adds a step to the plan: nothing runs yet.",
        "An action, such as `count`, `show`, `collect`, `first`, `take(n)` or a write, runs the whole plan as a job and returns a result.",
      ),
      lines(
        "Narrow transformations (`select`, `filter`, `withColumn`) work on each partition alone, while wide ones (`groupBy`, `orderBy`, `distinct`, `join`, `repartition`) shuffle rows between machines, which is the costly part.",
        "`groupBy(\"k\").agg(...)` gives one row per key, `distinct()` drops rows equal in every column, and `dropDuplicates([\"k\"])` keeps one row per key.",
      ),
      lines(
        "`repartition(n)` shuffles into n partitions, more or fewer, while `coalesce(n)` only merges partitions without a shuffle, so it can only lower the count.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql.functions import col, count, sum as sum_
out = (df.filter(col("x") > 0)                # narrow: no data moves
         .dropDuplicates(["k", "x"])          # wide: one row per (k, x)
         .groupBy("k")                        # wide: shuffle by key
         .agg(count("*").alias("n"), sum_("x").alias("total"))
         .orderBy(col("total").desc()))       # wide: a global sort
out.count(); out.show(5); out.first(); out.take(3)   # actions: each runs a job
rows = out.collect()                          # every row to the driver: small results only
df.repartition(8); df.coalesce(2)             # shuffle into 8 / merge down to 2
a.unionByName(b)                              # stack, matching columns by name`,
    },
    pitfall: lines(
      "`dropDuplicates([\"k\"])` keeps one row per key, but Spark does not say which one, and it can differ between runs.",
      "To keep a chosen row, such as the newest, keep `row_number() == 1` over a window ordered by that column.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import col, count, sum as sum_
loans = spark.createDataFrame(
    [("leeds", "Dune", 2), ("leeds", "Dune", 2), ("york", "Emma", 1),
     ("leeds", "Ubik", 4), ("york", "Kim", 3)],
    ["branch", "title", "days"],
)
by_branch = (loans.distinct()
                  .groupBy("branch")
                  .agg(count("*").alias("loans"), sum_("days").alias("days"))
                  .orderBy(col("days").desc()))
print(loans.count(), loans.distinct().count())
for r in by_branch.collect():
    print(r.branch, r.loans, r.days)
print(by_branch.first().branch)`,
      steps: [
        "Lines 3-7: the Leeds loan of Dune appears twice, identical in every column.",
        "Lines 8-11: `distinct`, `groupBy`, `agg` and `orderBy` only build a plan, and no job has run yet.",
        "Line 12: each `count` is an action, so two jobs run: 5 rows, and 4 once the duplicate is gone.",
        "Lines 13-14: `collect` runs the plan and returns one row per branch, sorted by total days, Leeds with 2 + 4 = 6 first.",
        "Line 15: `first` is another action, so the plan runs again and returns only the top row.",
      ],
      output: `5 4
leeds 2 6
york 2 4
leeds`,
    },
    exercises: [
      'action-1',
      'ps-trans-narrow-1',
      'ps-trans-dedup-1',
      'ps-trans-dedup-2',
      'grouping-5',
    ],
  },
  {
    id: 'string_functions/1',
    topicKeys: [Topic.STRING_FUNCTIONS],
    step: 1,
    title: 'String Functions (upper, lower, concat, trim, regexp)',
    idea: [
      lines(
        "String functions come from `pyspark.sql.functions` and work on a whole column, row by row: `upper`, `lower`, `trim` (with `ltrim` and `rtrim`), `length`, and `substring(col, pos, len)`, whose positions start at 1.",
        "`split(col, pattern)` turns a string into an array of its parts.",
      ),
      lines(
        "`concat(a, b, ...)` joins columns and literals, with `lit(\" \")` for a fixed piece of text, and `concat_ws(sep, a, b, ...)` joins them with a separator between each.",
      ),
      lines(
        "`regexp_replace(col, pattern, replacement)` rewrites every match of a regular expression, and `regexp_extract(col, pattern, group)` returns one capture group, or an empty string when nothing matches.",
        "In SQL, `LIKE 'ab%'` matches text that starts with `ab`, and `LIKE '%ab%'` text that contains it anywhere.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql import functions as F
df.select(
    F.lower(F.trim("s")),                   # "  Ab " -> "ab"
    F.length("s"), F.substring("s", 1, 3),  # positions start at 1
    F.concat("a", F.lit(" "), "b"),         # null when any input is null
    F.concat_ws("-", "a", "b", "c"),        # skips null inputs
    F.split("csv", ","),                    # an array<string>
    F.regexp_replace("s", "[0-9]", "#"),    # every match
    F.regexp_extract("s", "@(.+)$", 1),     # capture group 1, "" when no match
)`,
    },
    pitfall: lines(
      "`concat` returns null for the whole row when any input is null, so one missing middle name blanks a full name.",
      "Use `concat_ws`, which skips nulls, or wrap each part that can be null in `coalesce(col, lit(\"\"))`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import concat, concat_ws, lit, lower, trim, regexp_extract, regexp_replace, substring
members = spark.createDataFrame(
    [("  Ada ", None, "ADA@Library.org", "LIB-0042"), ("Kim", "J", "kim@uni.ac.uk", "LIB-7")],
    ["first", "middle", "email", "card"],
)
out = members.select(
    trim("first").alias("first"),
    concat(trim("first"), lit(" "), "middle").alias("joined"),
    concat_ws(" ", trim("first"), "middle").alias("label"),
    regexp_extract(lower("email"), "@(.+)$", 1).alias("domain"),
    regexp_replace(substring("card", 5, 4), "^0+", "").alias("number"),
)
for r in out.orderBy("first").collect():
    print(r.first, r.joined, r.label, r.domain, r.number, sep=" | ")`,
      steps: [
        "Line 8: `trim` strips the spaces around \"  Ada \".",
        "Lines 9-10: Ada has no middle name, so `concat` gives null (printed as None), while `concat_ws` skips the null and gives \"Ada\".",
        "Line 11: `lower` runs first, then the capture group `(.+)` takes everything after the @.",
        "Line 12: `substring` starts at position 5, the first character after \"LIB-\", and `regexp_replace` strips the leading zeros.",
        "Lines 14-15: Kim has every part, so both joins give \"Kim J\".",
      ],
      output: `Ada | None | Ada | library.org | 42
Kim | Kim J | Kim J | uni.ac.uk | 7`,
    },
    exercises: [
      'string-mcq-1',
      'sql-predict-7',
      'string-4',
    ],
  },
  {
    id: 'datetime_functions/1',
    topicKeys: [Topic.DATETIME_FUNCTIONS],
    step: 1,
    title: 'Date & Time Functions (date_format, datediff, to_date)',
    idea: [
      lines(
        "Spark has a DateType, a calendar day, and a TimestampType, a day and a time, and `current_date()` and `current_timestamp()` give today and now.",
        "`to_date(col, \"dd/MM/yyyy\")` and `to_timestamp(col, \"yyyy-MM-dd HH:mm:ss\")` parse strings, and ISO text such as `2026-03-15` needs no pattern at all.",
      ),
      lines(
        "`year`, `month`, `dayofmonth` and `hour` take out one part as a number.",
        "`date_add(d, n)` and `date_sub(d, n)` move a date by days, `add_months(d, n)` by months, and `datediff(end, start)` counts the days from start to end.",
        "`date_format(d, pattern)` turns a date into text.",
      ),
      lines(
        "Pattern letters are case-sensitive: `yyyy` is the year, `MM` the month, `dd` the day of the month, `HH` the hour from 0 to 23, `mm` the minute, and `EEE` the short day name.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql import functions as F
df.select(
    F.to_date("s", "dd/MM/yyyy"),                # string -> date
    F.to_timestamp("s", "yyyy-MM-dd HH:mm:ss"),  # string -> timestamp
    F.year("d"), F.month("d"), F.dayofmonth("d"),
    F.date_add("d", 30), F.date_sub("d", 7), F.add_months("d", 1),
    F.datediff("end_d", "start_d"),              # end minus start, in days
    F.date_format("d", "dd MMM yyyy"),           # date -> string
    F.current_date(),
)`,
    },
    pitfall: lines(
      "`mm` is minutes and `MM` is the month, so `date_format(d, \"yyyy-mm-dd\")` prints `2026-00-15` for 15 March, with no error to warn you.",
      "Check the case of every pattern letter, `MM` for months and `dd` for days.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import date_add, date_format, datediff, month, to_date
loans = spark.createDataFrame(
    [("Dune", "28/01/2026", "2026-02-03"), ("Emma", "15/02/2026", "2026-02-20")],
    ["title", "out_str", "back_str"],
)
dated = loans.select(
    "title",
    to_date("out_str", "dd/MM/yyyy").alias("out_d"),
    to_date("back_str").alias("back_d"),
)
report = dated.select(
    "title",
    datediff("back_d", "out_d").alias("days"),
    date_format(date_add("out_d", 21), "EEE dd MMM").alias("due"),
    month("out_d").alias("m"),
)
for r in report.orderBy("title").collect():
    print(r.title, r.days, r.due, r.m)`,
      steps: [
        "Lines 9-10: the loan dates are day first, so `to_date` needs `dd/MM/yyyy`, while the ISO return dates need no pattern.",
        "Line 14: `datediff` takes the later date first; 28 January to 3 February is 6 days, across the month end.",
        "Line 15: `date_add` moves each loan 21 days on, and `EEE dd MMM` prints the day name, the day and the short month.",
        "Line 16: `month` gives the loan month as a number, 1 for January.",
      ],
      output: `Dune 6 Wed 18 Feb 1
Emma 5 Sun 08 Mar 2`,
    },
    exercises: [
      'datetime-mcq-1',
      'datetime-predict-1',
      'datetime-3',
    ],
  },
  {
    id: 'collection_functions/1',
    topicKeys: [Topic.COLLECTION_FUNCTIONS],
    step: 1,
    title: 'Collection Functions (arrays, maps, explode)',
    idea: [
      lines(
        "An array column holds a list of values of one type in each row, a map column holds key-value pairs, and a struct holds fixed named fields.",
        "`array(a, b)` builds an array from columns, `create_map(k1, v1, k2, v2)` builds a map from keys and values in turn, and `split` and `collect_list` also return arrays.",
      ),
      lines(
        "`size(col)` counts an array's elements or a map's entries, `array_contains(col, v)` tests whether an array holds a value, `array_sort` sorts each row's array, and `flatten` turns an array of arrays into one array.",
        "`col(\"m\")[\"key\"]` reads a map, and a missing key gives null, not an error.",
      ),
      lines(
        "`explode(col)` turns each element into a row of its own, repeating the row's other columns, and on a map it gives two columns, `key` and `value`.",
        "`explode_outer` does the same but keeps a row whose array is empty or null, with a null in place of the element.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql import functions as F
df.select(
    F.array("a", "b", "c").alias("arr"),      # one array per row
    F.create_map("k1", "v1", "k2", "v2"),     # key, value, key, value
    F.size("arr"), F.array_sort("arr"),
    F.flatten("nested"),                      # [[1, 2], [3]] -> [1, 2, 3]
    F.col("m")["key"],                        # null when the key is missing
)
df.filter(F.array_contains("arr", "x"))       # rows whose array holds "x"
df.select("id", F.explode("arr").alias("item"))   # one row per element
df.select("id", F.explode_outer("arr"))       # also keeps empty and null arrays`,
    },
    pitfall: lines(
      "`explode` makes no rows at all from an empty or null array, so those parent rows silently disappear from everything after it.",
      "Use `explode_outer` when every parent row must survive.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import array_contains, array_sort, col, explode, size
shelves = spark.createDataFrame(
    [("A", ["Ubik", "Dune"], {"floor": "1"}), ("B", [], {"floor": "2", "wing": "east"}), ("C", ["Emma"], {})],
    "shelf string, titles array<string>, info map<string,string>",
)
summary = shelves.select(
    "shelf",
    size("titles").alias("n"),
    array_sort("titles").alias("sorted"),
    col("info")["wing"].alias("wing"),
)
for r in summary.orderBy("shelf").collect():
    print(r.shelf, r.n, r.sorted, r.wing)
print(shelves.filter(array_contains("titles", "Dune")).count())
one_per_title = shelves.select("shelf", explode("titles").alias("title"))
print(one_per_title.count(), sorted({r.shelf for r in one_per_title.collect()}))`,
      steps: [
        "Lines 9-11: `size` counts the titles, `array_sort` sorts each row's array, and only shelf B's map has a `wing` key, so the others give None.",
        "Line 15: `array_contains` keeps the one shelf whose array holds Dune.",
        "Lines 16-17: `explode` makes one row per title, 3 in all, and shelf B, with an empty array, is gone from the result.",
      ],
      output: `A 2 ['Dune', 'Ubik'] None
B 0 [] east
C 1 ['Emma'] None
1
3 ['A', 'C']`,
    },
    exercises: [
      'collection-6',
      'ps-maplib-1',
      'collection-3',
      'collection-predict-1',
      'collection-1',
    ],
  },
  {
    id: 'math_functions/1',
    topicKeys: [Topic.MATH_FUNCTIONS],
    step: 1,
    title: 'Math & Aggregate Functions (sum, avg, round)',
    idea: [
      lines(
        "Math functions work on each row: `round(col, 2)` rounds a half up, `bround` rounds a half to the even neighbour, `ceil` and `floor` go up and down, and `abs`, `sqrt`, `pow(x, y)` and `exp` do what their names say.",
        "`greatest(a, b)` and `least(a, b)` compare columns across one row, and `sqrt` of a negative number gives NaN, not null.",
      ),
      lines(
        "Aggregate functions, `sum`, `avg`, `min`, `max`, `count` and `countDistinct`, turn many rows into one, so they run inside `groupBy(...).agg(...)`, a bare `df.agg(...)` or a window, never inside `withColumn`.",
        "They skip nulls: `avg` divides by the number of values that are not null, and `count(\"col\")` counts those values while `count(\"*\")` counts rows.",
      ),
      lines(
        "These names are also Python built-ins, `sum`, `min`, `max`, `abs` and `round`, so import the module, `from pyspark.sql import functions as F`, and call `F.sum` and `F.round`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql import functions as F
df.select(
    F.round("x", 2), F.bround("x", 0),        # half up / half to even
    F.ceil("x"), F.floor("x"), F.abs("x"),
    F.pow("x", 2), F.sqrt("x"),               # sqrt of a negative is NaN
    F.greatest("a", "b"),                     # the larger value on each row
)
df.groupBy("k").agg(
    F.sum("x").alias("total"), F.avg("x").alias("mean"),   # nulls skipped
    F.count("*").alias("all_rows"), F.count("x").alias("filled"),
)`,
    },
    pitfall: lines(
      "`from pyspark.sql.functions import sum, round` replaces Python's own `sum` and `round` for the rest of the notebook, so later plain Python code gets a Column back or fails far from the import.",
      "Import the module as `F` and call `F.sum`, or import under another name, as in `sum as sum_`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
import pyspark.sql.functions as F
fines = spark.createDataFrame(
    [("leeds", 2.25, 3), ("leeds", 1.5, None), ("york", 4.0, 1), ("york", None, 2)],
    "branch string, fine double, days int",
)
per_branch = fines.groupBy("branch").agg(
    F.round(F.sum("fine"), 1).alias("total"),
    F.avg("days").alias("avg_days"),
    F.count("*").alias("rows"),
    F.count("fine").alias("fined"),
)
for r in per_branch.orderBy("branch").collect():
    print(r.branch, r.total, r.avg_days, r.rows, r.fined)
print(round(2.5), fines.select(F.round(F.lit(2.5))).first()[0])`,
      steps: [
        "Line 8: Leeds' fines sum to 3.75, and `F.round` to one place rounds the half up, to 3.8.",
        "Line 9: `avg` skips the null, so Leeds averages 3 days over one value, not 1.5 over two rows.",
        "Lines 10-11: `count(\"*\")` counts both York rows, while `count(\"fine\")` counts only the one with a fine.",
        "Line 15: `F.round` left Python's `round` alone, which rounds a half to even and gives 2, while Spark gives 3.0.",
      ],
      output: `leeds 3.8 3.0 2 2
york 4.0 1.5 2 1
2 3.0`,
    },
    exercises: [
      'math-1',
      'math-2',
      'math-3',
      'math-predict-1',
      'ps-agglib-6',
    ],
  },
  {
    id: 'null_handling/1',
    topicKeys: [Topic.NULL_HANDLING],
    step: 1,
    title: 'Null Handling (coalesce, isNull, fillna)',
    idea: [
      lines(
        "A null is a missing value, and any comparison with it, `==`, `!=` or `>`, gives null rather than true or false.",
        "`filter` keeps only the rows whose condition is true, so a null drops the row.",
        "Test for it with `isNull()` and `isNotNull()`, or `IS NULL` in SQL, since `== None` never matches.",
      ),
      lines(
        "Arithmetic with a null gives null, so `5 + null` is null.",
        "`coalesce(a, b, c)` returns its first argument that is not null, the usual way to supply a default.",
        "`eqNullSafe`, `<=>` in SQL, treats two nulls as equal, for joins on keys that can be null.",
      ),
      lines(
        "`fillna(0)` fills nulls in the numeric columns only, and `fillna({\"qty\": 0, \"notes\": \"none\"})` gives each column its own value.",
        "`na.drop()` removes every row that has any null; `how=\"all\"`, `subset=[...]` and `thresh=n` narrow it.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql.functions import coalesce, col, lit
df.filter(col("c").isNull())                       # never col("c") == None
df.filter((col("c") != "x") | col("c").isNull())   # keep the nulls on purpose
df.withColumn("contact", coalesce("email", "phone", lit("none")))
df.fillna({"qty": 0, "notes": "unknown"})          # per column; fillna(0) skips strings
df.na.drop(how="all", subset=["a", "b"])           # drop only when both are null
a.join(b, a.k.eqNullSafe(b.k))                     # null keys match each other`,
    },
    pitfall: lines(
      "`filter(col(\"phone\") != \"555\")` also drops every row whose phone is null, because null != \"555\" is null, not true.",
      "Add `| col(\"phone\").isNull()` when those rows should stay.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql.functions import coalesce, col, lit
members = spark.createDataFrame(
    [(1, "07700 1", None, 2), (2, None, "0113 555", None), (3, None, None, 1)],
    "id int, mobile string, landline string, fines int",
)
print(members.filter(col("mobile") != "07700 1").count())
print(members.filter(col("mobile").isNull()).count())
filled = members.fillna({"fines": 0}).withColumn(
    "reach", coalesce("mobile", "landline", lit("post"))
)
for r in filled.orderBy("id").collect():
    print(r.id, r.reach, r.fines + 1)`,
      steps: [
        "Line 7: members 2 and 3 have no mobile, so `!=` gives null for them, and the count is 0, not 2.",
        "Line 8: `isNull` finds exactly those two rows.",
        "Line 9: `fillna` with a dict fills only `fines`, so member 2's fine becomes 0.",
        "Line 10: `coalesce` takes the mobile, else the landline, else the literal \"post\".",
        "Line 13: every fine is filled now, so `fines + 1` is never null.",
      ],
      output: `0
2
1 07700 1 3
2 0113 555 1
3 post 2`,
    },
    exercises: [
      'null-2',
      'null-4',
      'sql-predict-1',
      'null-3',
      'null-1',
    ],
  },
  {
    id: 'sql_joins/1',
    topicKeys: [Topic.SQL_JOINS],
    step: 1,
    title: 'SQL Joins (inner, left, right, cross, self)',
    idea: [
      lines(
        "A join pairs the rows of two tables whose keys match.",
        "`INNER JOIN` keeps only the pairs, `LEFT JOIN` keeps every left row and fills the right columns with NULL where nothing matches, `RIGHT JOIN` does the same for the right table, and `FULL OUTER JOIN` keeps both sides.",
        "A left row with three matches becomes three rows, so a join can grow the row count.",
      ),
      lines(
        "`CROSS JOIN` pairs every row with every row, and a self join reads one table twice under two aliases, such as an employee and their manager.",
        "Spark adds `LEFT SEMI JOIN`, the left rows that have a match, like `EXISTS`, and `LEFT ANTI JOIN`, the left rows that have none, and both return only the left table's columns.",
      ),
      lines(
        "In PySpark, `a.join(b, \"k\", \"left\")` joins on a column both share and keeps one copy of it, and `a.join(b, a.k == b.id, \"left_anti\")` joins on an expression.",
        "The type is one of `inner`, `left`, `right`, `full`, `cross`, `left_semi` and `left_anti`.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT a.col, b.col
FROM a
LEFT JOIN b ON a.k = b.k;              -- every a row; b columns NULL when no match
-- INNER JOIN: pairs only   RIGHT / FULL OUTER JOIN: keep b / both sides
SELECT * FROM a LEFT SEMI JOIN b ON a.k = b.k;   -- a rows with a match
SELECT * FROM a LEFT ANTI JOIN b ON a.k = b.k;   -- a rows with no match
SELECT e.emp_name, m.emp_name AS boss
FROM emp e LEFT JOIN emp m ON e.boss_id = m.id;  -- a self join
-- PySpark: a.join(b, "k", "left")   a.join(b, a.k == b.id, "left_anti")`,
    },
    pitfall: lines(
      "A condition on the right table in `WHERE`, such as `WHERE b.col <> 'x'`, removes the rows a LEFT JOIN kept, since their `b.col` is NULL, and the join turns into an inner join.",
      "Put that condition in the `ON` clause to keep every left row.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'members',
          columns: ['member_id', 'member_name'],
          rows: [
            [1, 'Ada'],
            [2, 'Ben'],
            [3, 'Cy'],
          ],
        },
        {
          name: 'loans',
          columns: ['loan_id', 'member_id', 'title'],
          rows: [
            [10, 1, 'Dune'],
            [11, 1, 'Emma'],
            [12, 2, 'Dune'],
          ],
        },
      ],
      code: `SELECT m.member_name, l.title
FROM members m
LEFT JOIN loans l ON l.member_id = m.member_id AND l.title <> 'Dune'
ORDER BY m.member_name;

SELECT m.member_name, l.title
FROM members m
LEFT JOIN loans l ON l.member_id = m.member_id
WHERE l.title <> 'Dune'
ORDER BY m.member_name;`,
      steps: [
        "Lines 1-4: the `ON` condition leaves out the Dune loans, so Ben, whose only loan was Dune, and Cy, who has none, stay with a NULL title.",
        "Line 9: here `WHERE` tests the title after the join, and it is not true for Cy's NULL or Ben's Dune, so only Ada is left.",
      ],
      output: `member_name | title
Ada | Emma
Ben | NULL
Cy | NULL

member_name | title
Ada | Emma`,
    },
    exercises: [
      'sql-misc-mcq-5',
      'sql-predict-3',
      'sql-predict-4',
      'semijoin-1',
      'sql-join-6',
    ],
  },
  {
    id: 'sql_aggregations/1',
    topicKeys: [Topic.SQL_AGGREGATIONS],
    step: 1,
    title: 'SQL Aggregations & GROUP BY',
    idea: [
      lines(
        "`GROUP BY` collapses the rows that share the grouping columns into one row each, and aggregates such as `COUNT`, `SUM`, `AVG`, `MIN` and `MAX` sum up each group.",
        "With no `GROUP BY`, an aggregate query returns exactly one row.",
        "Every selected column must be grouped or inside an aggregate, and Databricks also accepts `GROUP BY ALL`, which groups by every column that is not aggregated.",
      ),
      lines(
        "`WHERE` filters rows before grouping and cannot use an aggregate, while `HAVING` filters groups after it, as in `HAVING COUNT(*) > 10`.",
        "`COUNT(*)` counts rows, `COUNT(col)` counts the values that are not NULL, and the other aggregates skip NULLs too.",
      ),
      lines(
        "`GROUP BY ROLLUP (a, b)` adds a subtotal for each `a` and a grand total, `CUBE (a, b)` adds every combination, and `GROUPING SETS ((a, b), (a))` lists exactly the groupings you want.",
        "In a subtotal row, the columns rolled up show NULL.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT k, COUNT(*) AS n, COUNT(col) AS filled, SUM(x) AS total
FROM t
WHERE x > 0                -- rows, before grouping
GROUP BY k                 -- or GROUP BY ALL on Databricks
HAVING COUNT(*) > 1        -- groups, after grouping
ORDER BY total DESC;
SELECT a, b, SUM(x) FROM t GROUP BY ROLLUP (a, b);    -- (a, b), (a), ()
SELECT a, b, SUM(x) FROM t GROUP BY CUBE (a, b);      -- every combination
SELECT a, b, SUM(x) FROM t GROUP BY GROUPING SETS ((a, b), (a));`,
    },
    pitfall: lines(
      "An aggregate in `WHERE`, such as `WHERE COUNT(*) > 1`, is an error, because `WHERE` runs on single rows before any group exists.",
      "Filter on an aggregate with `HAVING`, and keep `WHERE` for conditions on single rows.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'loans',
          columns: ['branch', 'title', 'fine'],
          rows: [
            ['leeds', 'Dune', 2],
            ['leeds', 'Emma', null],
            ['leeds', 'Atlas', 5],
            ['york', 'Ubik', 3],
            ['hull', 'Kim', 1],
            ['hull', 'Poems', 4],
          ],
        },
      ],
      code: `SELECT branch, COUNT(*) AS loans, COUNT(fine) AS fined, SUM(fine) AS fines
FROM loans
WHERE title <> 'Atlas'
GROUP BY branch
HAVING COUNT(*) > 1
ORDER BY branch;`,
      steps: [
        "Line 3: `WHERE` removes the Atlas row before any group is formed.",
        "Line 4: the remaining rows form three groups: Leeds with 2 rows, York with 1 and Hull with 2.",
        "Line 5: `HAVING` then drops York, whose group has only one row.",
        "Line 1: Leeds has 2 loans but only 1 fine, since `COUNT(fine)` and `SUM` skip the NULL.",
      ],
      output: `branch | loans | fined | fines
hull | 2 | 2 | 5
leeds | 2 | 1 | 2`,
    },
    exercises: [
      'sql-predict-2',
      'sql-misc-mcq-2',
      'sql-misc-mcq-3',
      'sql-predict-5',
      'sql-6',
    ],
  },
  {
    id: 'sql_subqueries/1',
    topicKeys: [Topic.SQL_SUBQUERIES],
    step: 1,
    title: 'Subqueries & CTEs (correlated, EXISTS, WITH)',
    idea: [
      lines(
        "A subquery is a query inside another.",
        "A scalar subquery returns one value, as in `WHERE pages > (SELECT AVG(pages) FROM books)`, and `IN (SELECT ...)` tests a value against the list a subquery returns.",
        "A subquery in `FROM` is a derived table, and it takes an alias.",
      ),
      lines(
        "A correlated subquery refers to the outer row, as in `(SELECT AVG(x) FROM t i WHERE i.k = o.k)`, so its answer changes from row to row.",
        "`EXISTS (SELECT 1 FROM u WHERE u.k = t.k)` is true when at least one row matches, and `NOT EXISTS` when none does.",
      ),
      lines(
        "`WITH name AS (SELECT ...)` names a subquery up front, a common table expression or CTE, which the main query and any later CTE can read by name.",
        "It lets a long query read from top to bottom, and it is neither stored nor faster than the same subquery written inline.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `WITH k_avg AS (                          -- a CTE: a named subquery
  SELECT k, AVG(x) AS avg_x FROM t GROUP BY k
), big AS (                              -- a later CTE can read an earlier one
  SELECT k FROM k_avg WHERE avg_x > 100
)
SELECT * FROM t
WHERE x > (SELECT AVG(x) FROM t)                     -- scalar subquery
  AND k IN (SELECT k FROM big)                       -- a list of values
  AND EXISTS (SELECT 1 FROM u WHERE u.id = t.id);    -- correlated
-- NOT EXISTS (SELECT 1 FROM u WHERE u.id = t.id): no matching row`,
    },
    pitfall: lines(
      "`NOT IN (SELECT col ...)` returns no rows at all once the subquery returns a single NULL, because `x <> NULL` is never true.",
      "Use `NOT EXISTS`, or filter `WHERE col IS NOT NULL` inside the subquery.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'books',
          columns: ['book_id', 'title', 'genre', 'pages'],
          rows: [
            [1, 'Dune', 'scifi', 400],
            [2, 'Ubik', 'scifi', 200],
            [3, 'Emma', 'classic', 300],
            [4, 'Kim', 'classic', 500],
          ],
        },
        {
          name: 'loans',
          columns: ['loan_id', 'book_id'],
          rows: [
            [10, 1],
            [12, 3],
            [13, null],
          ],
        },
      ],
      code: `WITH genre_avg AS (
  SELECT genre, AVG(pages) AS avg_pages FROM books GROUP BY genre
)
SELECT b.title, b.pages
FROM books b JOIN genre_avg g ON g.genre = b.genre
WHERE b.pages > g.avg_pages
ORDER BY b.title;
SELECT (SELECT COUNT(*) FROM books WHERE book_id NOT IN (SELECT book_id FROM loans)) AS not_in,
  (SELECT COUNT(*) FROM books b
   WHERE NOT EXISTS (SELECT 1 FROM loans l WHERE l.book_id = b.book_id)) AS not_exists;`,
      steps: [
        "Lines 1-7: the CTE holds each genre's average, scifi 300 and classic 400, and the main query reads it like a table.",
        "Line 8: loan 13 has a NULL `book_id`, so `NOT IN` is never true for any book and counts 0.",
        "Lines 9-10: the correlated `NOT EXISTS` counts the 2 books never borrowed.",
      ],
      output: `title | pages
Dune | 400
Kim | 500

not_in | not_exists
0 | 2`,
    },
    exercises: [
      'cte-3',
      'sql-predict-11',
      'cte-1',
      'subq-1',
    ],
  },
  {
    id: 'window_functions/1',
    topicKeys: [Topic.WINDOW_FUNCTIONS, Topic.SQL_WINDOW_FUNCTIONS],
    step: 1,
    title: 'Window Functions (row_number, rank, lag, lead)',
    idea: [
      lines(
        "A window function computes a value for each row from a set of related rows, its window, and unlike `groupBy` it keeps every row.",
        "In PySpark the window is `Window.partitionBy(\"k\").orderBy(\"x\")`, in SQL `OVER (PARTITION BY k ORDER BY x)`, and the calculation starts again for each key.",
      ),
      lines(
        "`row_number()` numbers the rows 1, 2, 3, `rank()` gives ties the same number and then skips (1, 1, 3), and `dense_rank()` does not skip (1, 1, 2).",
        "`lag(col, 1)` reads the previous row's value and `lead(col, 1)` the next row's, and both give null at the edge of the partition.",
      ),
      lines(
        "An aggregate such as `sum` or `max` with `.over(w)` adds its result to every row of the window.",
        "With an `orderBy`, its frame runs from the first row to the current row, and `rowsBetween(start, end)` sets the frame in rows, such as the 6 rows before and the current one for a moving average.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pyspark.sql import Window
from pyspark.sql import functions as F
w = Window.partitionBy("k").orderBy(F.col("x").desc())
df.select("*",
    F.row_number().over(w),                    # 1, 2, 3
    F.rank().over(w), F.dense_rank().over(w),  # ties: 1, 1, 3 / 1, 1, 2
    F.lag("x", 1).over(w),                     # previous row; null on the first
    F.sum("x").over(Window.partitionBy("k").orderBy("t")
                   .rowsBetween(Window.unboundedPreceding, Window.currentRow)),
)
# SQL: AVG(x) OVER (PARTITION BY k ORDER BY t ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`,
    },
    pitfall: lines(
      "A running total with only an `orderBy` uses a RANGE frame, so rows that tie on the ordering column share one total instead of adding up one by one.",
      "Set the frame yourself, `.rowsBetween(Window.unboundedPreceding, Window.currentRow)` or `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, whenever ties are possible.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
from pyspark.sql import Window
from pyspark.sql.functions import col, dense_rank, lag, rank, sum as sum_
loans = spark.createDataFrame(
    [("leeds", 1, 5), ("leeds", 2, 5), ("leeds", 3, 2), ("york", 1, 4), ("york", 2, 6)],
    ["branch", "week", "loans"],
)
by_loans = Window.partitionBy("branch").orderBy(col("loans").desc())
by_week = Window.partitionBy("branch").orderBy("week")
out = loans.select("branch", "week", "loans",
    rank().over(by_loans).alias("rk"), dense_rank().over(by_loans).alias("dr"),
    (col("loans") - lag("loans").over(by_week)).alias("change"),
    sum_("loans").over(by_week.rowsBetween(Window.unboundedPreceding, Window.currentRow)).alias("so_far"))
for r in out.orderBy("branch", "week").collect():
    print(r.branch, r.week, r.loans, r.rk, r.dr, r.change, r.so_far)`,
      steps: [
        "Lines 8-9: both windows restart for each branch; one orders by loans, busiest first, the other by week.",
        "Line 11: Leeds weeks 1 and 2 tie on 5 loans, so both rank 1, and week 3 gets `rank` 3 but `dense_rank` 2.",
        "Line 12: `lag` reads the week before, so the first week of each branch has no change, None, and Leeds week 3 is 2 - 5 = -3.",
        "Line 13: the ROWS frame adds the weeks up one at a time, 5, 10, 12, even though weeks 1 and 2 tie on loans.",
        "Lines 14-15: every input row is still there, five rows, each with its window values.",
      ],
      output: `leeds 1 5 1 1 None 5
leeds 2 5 1 1 0 10
leeds 3 2 3 2 -3 12
york 1 4 2 2 None 4
york 2 6 1 1 2 10`,
    },
    exercises: [
      'window-4',
      'window-adv-4',
      'winfn-5',
      'window-predict-1',
      'window-1',
    ],
  },
  {
    id: 'sql_set_operations/1',
    topicKeys: [Topic.SQL_SET_OPERATIONS],
    step: 1,
    title: 'Set Operations (UNION, INTERSECT, EXCEPT)',
    idea: [
      lines(
        "A set operation stacks the results of two queries with the same number of columns and compatible types, matching the columns by position, not by name.",
        "`UNION ALL` keeps every row of both, and `UNION` also removes duplicate rows from the whole result.",
      ),
      lines(
        "`INTERSECT` returns the distinct rows found in both results, and `EXCEPT` the distinct rows of the first that are not in the second, so the order of the two queries matters.",
        "Spark also has `INTERSECT ALL` and `EXCEPT ALL`, which keep duplicates, and `MINUS`, another name for `EXCEPT`.",
      ),
      lines(
        "In PySpark, `a.union(b)` is UNION ALL by position, `unionByName(b)` matches the columns by name, and `intersect`, `subtract` (EXCEPT) and `exceptAll` cover the rest.",
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `SELECT k, col FROM a
UNION ALL                  -- every row of both
SELECT k, col FROM b;
-- UNION         : also drops duplicate rows from the whole result
-- INTERSECT     : distinct rows found in both
-- EXCEPT        : distinct rows of a that are not in b (MINUS is the same)
-- INTERSECT ALL / EXCEPT ALL : keep duplicates
-- PySpark: a.union(b).distinct()   a.unionByName(b)   a.intersect(b)   a.subtract(b)`,
    },
    pitfall: lines(
      "`DataFrame.union()` keeps duplicates, as `UNION ALL` does, so a SQL `UNION` ported to PySpark as `a.union(b)` returns extra rows.",
      "Add `.distinct()` after it, `a.union(b).distinct()`.",
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'spring_list',
          columns: ['title'],
          rows: [['Dune'], ['Emma'], ['Dune']],
        },
        {
          name: 'summer_list',
          columns: ['title'],
          rows: [['Emma'], ['Ubik']],
        },
      ],
      code: `SELECT title FROM spring_list
UNION ALL
SELECT title FROM summer_list
ORDER BY title;

SELECT title FROM spring_list
EXCEPT
SELECT title FROM summer_list;`,
      steps: [
        "Lines 1-4: `UNION ALL` keeps all five rows, both Dunes and both Emmas, and the `ORDER BY` sorts the combined result.",
        "Line 2: `UNION` there would remove every duplicate, the two Dunes from the spring list included, and return Dune, Emma and Ubik.",
        "Lines 6-8: `EXCEPT` keeps the spring titles that are not on the summer list, Dune, once, and `INTERSECT` would give Emma.",
      ],
      output: `title
Dune
Dune
Emma
Emma
Ubik

title
Dune`,
    },
    exercises: [
      'setop-mcq-1',
      'sql-predict-12',
      'setop-1',
    ],
  },
  {
    id: 'spark_sql/1',
    topicKeys: [Topic.SPARK_SQL],
    step: 1,
    title: 'Spark SQL Constructs (temp views, PIVOT, CASE, CAST)',
    idea: [
      lines(
        "`df.createOrReplaceTempView(\"v\")` gives a DataFrame a name that `spark.sql(\"SELECT ... FROM v\")` can query, and the result is a DataFrame again.",
        "A temp view lives only in the current Spark session and stores no data, and `CREATE OR REPLACE TEMP VIEW v AS SELECT ...` makes one in SQL.",
      ),
      lines(
        "`CASE WHEN cond THEN a WHEN cond2 THEN b ELSE c END` returns the value of the first true branch, and a row that matches none gets the `ELSE` value.",
        "`CAST(col AS INT)`, or `col::int`, changes a type; text that is not a number either fails the cast or becomes NULL, depending on ANSI mode, while `try_cast` always returns NULL.",
      ),
      lines(
        "`PIVOT (SUM(x) FOR col IN ('a', 'b'))` turns the listed values of `col` into columns and groups by every other column of its input, so select only the columns you need first.",
        "`stack(n, 'a', a, 'b', b) AS (label, value)`, or `UNPIVOT`, turns columns back into rows.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `df.createOrReplaceTempView("v")                    # this session only
spark.sql("""SELECT * FROM (
  SELECT k, cat, try_cast(amount AS INT) AS amount FROM v   -- NULL, never an error
) PIVOT (SUM(amount) FOR cat IN ('a', 'b'))""")    # one column per listed value
spark.sql("""SELECT k,
  CASE WHEN x > 100 THEN 'high'                    -- the first true branch wins
       WHEN x > 10  THEN 'mid'
       ELSE 'low' END AS band
FROM v""")`,
    },
    pitfall: lines(
      "`CASE` stops at the first true `WHEN`, so a broad condition placed first, such as `x > 10` before `x > 100`, hides every branch after it.",
      "Order the branches from the narrowest condition to the broadest.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# Databricks notebook; spark is the notebook's session, no tables needed
spark.createDataFrame(
    [("leeds", "Q1", "12"), ("leeds", "Q2", "7"), ("york", "Q1", "30"), ("york", "Q2", "n/a")],
    ["branch", "quarter", "loans_txt"],
).createOrReplaceTempView("loans_v")
spark.sql("""CREATE OR REPLACE TEMP VIEW loans_clean AS
SELECT branch, quarter, try_cast(loans_txt AS INT) AS loans FROM loans_v""")
bands = spark.sql("""SELECT CASE WHEN loans >= 20 THEN 'busy'
  WHEN loans >= 10 THEN 'steady' ELSE 'quiet' END AS band
FROM loans_clean ORDER BY branch, quarter""")
print([r.band for r in bands.collect()])
wide = spark.sql("""SELECT * FROM (SELECT branch, quarter, loans FROM loans_clean)
PIVOT (SUM(loans) FOR quarter IN ('Q1', 'Q2'))""")
for r in wide.orderBy("branch").collect():
    print(r.branch, r.Q1, r.Q2)`,
      steps: [
        "Lines 2-5: the DataFrame becomes the temp view `loans_v`, which the SQL below can read by name.",
        "Lines 6-7: `try_cast` turns the text into numbers, and \"n/a\" becomes NULL instead of failing.",
        "Lines 8-11: the branches are tried in order, narrowest first, so 30 is busy, 12 steady and 7 quiet, and the NULL matches no `WHEN` and falls to `ELSE`.",
        "Lines 12-13: `PIVOT` makes a Q1 and a Q2 column, one row per branch, the only column left over.",
        "Lines 14-15: York's Q2 sum is NULL, printed as None, because its only value was NULL.",
      ],
      output: `['steady', 'quiet', 'busy', 'quiet']
leeds 12 7
york 30 None`,
    },
    exercises: [
      'ps-pivot-intro-2',
      'sql-misc-mcq-7',
      'sql-predict-13',
      'casewhen-2',
    ],
  },
];
