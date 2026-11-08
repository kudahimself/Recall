# Grants for the library

Topic: Access Controls & Privileges (GRANT, REVOKE, permissions) (Databricks, Data Governance).
Time: about 25 minutes.

## Task

In Unity Catalog a principal (a user, a group or a service principal) holds privileges on catalogs, schemas and tables, and a privilege granted on a parent reaches everything inside it.
Grants only exist on Databricks, so in `library_grants.py` you write the statements as text and work out what a list of grants allows, in plain Python.
A grant is a tuple `(privilege, kind, name, principal)`, such as `("SELECT", "SCHEMA", "lib.loans", "library_staff")`:

- `grant_sql(privileges, kind, name, principal)` and `revoke_sql(...)` write the `GRANT ... TO` and `REVOKE ... FROM` statements, and reject an object name of the wrong shape.
- `read_access_sql(table, principal)` returns the three statements that let a group read one table.
- `can(grants, principals, action, target)` says whether someone acting as any of `principals` may `"read"` or `"write"` a table, or `"create_table"` in a schema.
- `revoke(grants, privilege, kind, name, principal)` returns the grants a `REVOKE` leaves.
- `missing_for_read(grants, principals, table)` lists what is still missing to read a table.

## Examples

```python
grant_sql(["SELECT", "MODIFY"], "TABLE", "lib.loans.fines", "library_staff")
# "GRANT SELECT, MODIFY ON TABLE lib.loans.fines TO `library_staff`"
grants = [("USE CATALOG", "CATALOG", "lib", "library_staff"),
          ("USE SCHEMA", "SCHEMA", "lib.loans", "library_staff"),
          ("SELECT", "SCHEMA", "lib.loans", "library_staff"),
          ("MODIFY", "TABLE", "lib.loans.fines", "library_staff")]
me = {"ann@library.org", "library_staff"}
can(grants, me, "read", "lib.loans.loans")      # True: SELECT on the schema reaches it
can(grants, me, "write", "lib.loans.loans")     # False: MODIFY is on fines only
can(grants, me, "create_table", "lib.loans")    # False: nobody granted CREATE TABLE
missing_for_read([("SELECT", "TABLE", "lib.loans.loans", "library_staff")], me, "lib.loans.loans")
# ["USE CATALOG", "USE SCHEMA"]
```

Watch for the lesson's pitfall: `SELECT` on a table is not enough to read it.
Without `USE CATALOG` on its catalog and `USE SCHEMA` on its schema the read fails, so `can` checks all three.
And Unity Catalog has no `DENY`: a `REVOKE` removes only the grant made at that level, so it cannot take away what a grant on the schema gives.

## What differs on Databricks

In a Unity Catalog workspace you run the statements themselves (`spark.sql("GRANT ...")` or a SQL cell), `SHOW GRANTS ON SCHEMA lib.loans` lists them, and Unity Catalog makes the check that `can` makes here on every query, failing it with a permission error.
It also knows which groups you are in, while here you pass them as `principals`.
Real Unity Catalog has more than this: owners, who may grant on what they own, `ALL PRIVILEGES`, and privileges on views, volumes and functions.
Open-source Spark has no grants at all (it rejects `GRANT` as an invalid statement), so these tests need no Spark session.

## Run the tests

Set up the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/data_governance
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
