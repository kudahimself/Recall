# Schema changes, checked

Topic: Schema Enforcement & Evolution (Data Engineering, Warehouses, Lakes & Table Formats).
Time: about 25 minutes.

## Task

The orders table declares its schema, and every change to it, and every batch written to it, is checked against that schema first.
Fill in the four functions in `schema_compat.py`:

- `schema_changes(old, new)` lists every difference between two schemas: added, dropped, widened, retyped, made required or nullable.
- `breaking_changes(old, new)` keeps the ones that break a reader or a writer.
- `batch_problems(declared, rows)` lists everything in a batch that does not match the declared schema.
- `admit_batch(table, declared, rows)` appends a batch only when all of it matches, and holds the whole batch otherwise.

Plain Python: a schema is a dict of column name to type and nullability, and a batch is a list of row dicts.

## Examples

```python
schema_changes(ORDERS, ORDERS | {"order_id": col("bigint")})   # [("order_id", "widened")]
breaking_changes(old, renamed)   # [("amount", "dropped"), ("amount_cents", "added required")]
batch_problems(ORDERS, [{"order_id": 5, "load_day": date(2026, 11, 3), "amount_cents": 3000}])
# ["unexpected column amount_cents", "row 1: amount is null"]
admit_batch(table, ORDERS, rows)  # ("held", [...]) and table unchanged, or ("loaded", 2)
```

Watch for the lesson's pitfall: an automatic schema merge turns a renamed field into a new column and fills the old one with NULL.
Every load succeeds and row counts look normal, while the reports that sum the old column quietly fall.
Adding a nullable column and widening a type are safe; a rename is a drop plus an add, and is done by adding the new column, moving the readers, and dropping the old one last.

## Run the tests

```bash
cd exercises/data_engineering/de_schema_evolution
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
