# Names and schemas

Topic: Databricks Platform Essentials (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

Unity Catalog names a table with three parts, and a session has a current catalog and schema that fill in the parts you leave out.
You write six helpers in `workspace_names.py` that practise those rules in plain Python and on a local Spark session:

- `qualify(ref, catalog, schema)` turns a one, two or three-part reference into the full `catalog.schema.table` name.
- `apply_use(current, statement)` returns the new `(catalog, schema)` after `USE CATALOG x` or `USE SCHEMA y`.
- `grant_sql(privilege, kind, target, principal)` builds a `GRANT ... ON ... TO` statement with the principal in backticks.
- `create_loans(spark, schema, rows)` creates a schema, saves the rows as `schema.loans` and returns the format `DESCRIBE DETAIL` reports.
- `list_tables(spark, schema)` returns the sorted permanent table names in a schema with `SHOW TABLES`.
- `save_query(spark, view, query)` saves a query as a temporary view and returns its row count.

## Examples

```python
qualify("loans", "main", "library")                     # "main.library.loans"
apply_use(("main", "library"), "USE CATALOG other")     # ("other", "default")
grant_sql("SELECT", "SCHEMA", "cat.sch", "readers")     # "GRANT SELECT ON SCHEMA cat.sch TO `readers`"
```

Watch for the lesson's pitfall: `USE CATALOG` also resets the current schema to `default`, so a `USE SCHEMA` run before it no longer applies.
Name tables in full when a job or a shared notebook depends on them.

## What differs on Databricks

On Databricks the catalog is a real level: `CREATE CATALOG` makes one, `GRANT` is executed and audited by Unity Catalog, and `USE CATALOG` changes where short names resolve.
Local Spark has no catalog level beyond its single built-in one, so here the grant is only text you build and the names are practised in `qualify` and `apply_use`.
Schemas, tables, `DESCRIBE DETAIL`, `SHOW TABLES` and temporary views behave the same, and the tables go to a throwaway warehouse folder.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_platform
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
