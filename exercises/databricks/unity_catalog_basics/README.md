# Managed and external tables

Topic: Unity Catalog Foundations & Volumes (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

The one difference between a managed and an external table is whether it was created with `LOCATION`, and it decides what `DROP TABLE` does to the data.
You write six helpers in `lakehouse_tables.py` and check the difference on real local Delta tables:

- `split_name(full_name)` splits `catalog.schema.table` into a tuple and rejects any other shape.
- `create_managed(spark, table)` creates a Delta table with `member_id` and `city` columns and no location.
- `create_external(spark, table, location)` creates the same table with its files at a location you choose.
- `table_kind(spark, table)` returns `"MANAGED"` or `"EXTERNAL"` from `DESCRIBE TABLE EXTENDED`.
- `table_location(spark, table)` returns the folder holding the table's files as a plain local path.
- `drop_removes_files(spark, table)` drops a table and says whether its data folder is gone.

## Examples

```python
split_name("main.library.members")              # ("main", "library", "members")
create_managed(spark, "members")
table_kind(spark, "members")                    # "MANAGED"
drop_removes_files(spark, "members")            # True
```

Watch for the lesson's pitfall: dropping a managed table deletes its data and dropping an external one keeps it, so check the `Type` row before dropping a table you did not create.

## What differs on Databricks

Unity Catalog adds the top level: tables are `catalog.schema.table`, volumes hold governed files under `/Volumes/catalog/schema/volume/`, and an external table's `LOCATION` must sit inside an external location you may use.
Local Spark has no catalog level, so the tables here have one-part names and `split_name` only practises reading the three-part form.
Managed tables on Databricks also have `UNDROP` for 7 days, which a local drop does not.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/unity_catalog_basics
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
