# Volume paths

Topic: Storage Architecture, DBFS & Git Repos (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

Data on Databricks is addressed by a path or a URI, and knowing which layer a path belongs to is half of working with storage.
You write six helpers in `volume_paths.py`, using plain Python for the path rules and local Spark for the files:

- `classify_path(path)` says whether a path is a `"volume"`, a legacy `"dbfs"` path (`dbfs:/`, `/dbfs/`, `/mnt/`), a `"cloud"` URI (`abfss://`, `s3://`, `gs://`) or `"local"`.
- `volume_path(catalog, schema, volume, *parts)` builds a `/Volumes/...` path.
- `parse_volume_path(path)` splits a volume path into catalog, schema, volume and the relative rest, and rejects anything else.
- `ls_names(folder)` lists a local folder's entries sorted, with a trailing slash on folders, like `dbutils.fs.ls`.
- `count_csv_rows(spark, path)` reads a CSV file or folder with a header and returns its row count.
- `import_from_repo(repo_root, module, attribute)` imports a module from a repository root the way a Git folder does.

## Examples

```python
classify_path("/mnt/landing/loans.csv")                      # "dbfs"
volume_path("main", "library", "landing", "loans.csv")      # "/Volumes/main/library/landing/loans.csv"
parse_volume_path("/Volumes/main/library/landing/a/b.csv")   # ("main", "library", "landing", "a/b.csv")
ls_names(folder)                                             # ["archive/", "loans.csv"]
```

Watch for the lesson's pitfall: a mount shares one storage credential with everyone in the workspace, so new work uses `/Volumes/...` paths and `classify_path` is how you spot the legacy ones.

## What differs on Databricks

A volume path such as `/Volumes/main/library/landing` is checked by Unity Catalog against `READ VOLUME` and `WRITE VOLUME` grants, and `dbutils.fs`, Spark and Python's `open` all accept it.
Here there is no volume and no `dbutils`, so the files are ordinary folders under pytest's `tmp_path`, `os` stands in for `dbutils.fs.ls`, and the Spark reader works on the local path.
A Git folder clones a repository into the workspace and adds its root to `sys.path`; `import_from_repo` does the same for a local directory.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_storage_repos
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
