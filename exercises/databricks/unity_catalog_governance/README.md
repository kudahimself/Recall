# One table, a view per group

Topic: Unity Catalog Governance (credentials, locations, row filters, column masks) (Databricks, Data Governance).
Time: about 25 minutes.

## Task

Unity Catalog reaches cloud storage through an external location, and one table can show each group its own rows and values through a row filter and a column mask.
You write the statements in `member_policies.py` for a library's `lib.people.members` table, whose stored rows are `(1, leeds, ann@mail.com)`, `(2, york, bo@post.net)` and `(3, leeds, cy@post.net)`:

- `external_location_sql(name, url, credential)` pairs a cloud storage path with a storage credential, and rejects anything that is not a cloud storage URL.
- `location_grant_sql(location, privileges, principal)` grants privileges on the location, and rejects ones that belong to tables.
- `row_filter_function_sql(function, column, see_all_group, value)` writes a `RETURNS BOOLEAN` function: managers see every row, everyone else only the Leeds ones.
- `mask_function_sql(function, column, see_all_group)` writes a `RETURNS STRING` function: managers see the email, everyone else `***@` and its domain.
- `set_row_filter_sql(table, function, column)` and `set_mask_sql(table, column, function)` bind the functions to the table.
- `find_keys(source)` finds the lines of a notebook that hold a cloud storage key.

## Examples

```python
external_location_sql("loans_raw", "s3://lib-raw/loans", "lib_cred")
# "CREATE EXTERNAL LOCATION loans_raw URL 's3://lib-raw/loans' WITH (STORAGE CREDENTIAL lib_cred)"
location_grant_sql("loans_raw", ["READ FILES"], "loaders")
# "GRANT READ FILES ON EXTERNAL LOCATION loans_raw TO `loaders`"
set_row_filter_sql("lib.people.members", "lib.people.leeds_only", "branch")
# "ALTER TABLE lib.people.members SET ROW FILTER lib.people.leeds_only ON (branch)"
# someone outside managers then sees members 1 and 3, as ***@mail.com and ***@post.net
```

The tests run your two functions' `RETURN` expressions on local Spark, on the three members.
Local Spark has no account groups, so they swap `is_account_group_member('managers')` for `true` or `false`, as if the user were or were not a manager, which is why the body must test the group with exactly that call.

Watch for the lesson's pitfall: a storage account key, SAS token or AWS access key typed into a notebook can be read by everyone who can open the notebook or its history, and reads made with it skip Unity Catalog's grants and audit log.
`find_keys` finds those lines, so you can replace them with a read through an external location or a volume.

## What differs on Databricks

On Databricks an admin creates the storage credential (around an IAM role, an Azure managed identity or a Google service account) and runs the statements you wrote, and Unity Catalog then applies the filter and the mask to every query of the table, whoever runs it.
`is_account_group_member` and `current_user()` there describe the user running the query, and every grant and query lands in `system.access.audit`.
Open-source Spark has no external locations, row filters or masks, so the location, grant and binding statements are only checked as text, and nothing here fakes those features.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/unity_catalog_governance
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
