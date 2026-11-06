/**
 * Databricks lessons, one per topic, in course order.
 *
 * Section 1, Lakehouse Platform: every topic.
 *
 * Prose keeps one sentence per source line (`lines`). A worked example here is
 * a Databricks notebook cell: it needs a workspace with Unity Catalog to run,
 * so it sets `runs: false`, says in its first-line comment what it assumes,
 * and its output was checked by hand against current Databricks (Unity
 * Catalog, Delta Lake 3+). SQL runs through `spark.sql`, as it would in a
 * Python notebook.
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
];
