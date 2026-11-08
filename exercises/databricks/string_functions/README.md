# Member text

Topic: String Functions (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

String functions from `pyspark.sql.functions` work on a whole column, row by row.
In `member_text.py` you tidy a members table with columns `member_id`, `first`, `middle`, `last`, `email` and `card`, where `middle` is sometimes null.
Each helper returns the DataFrame with one new column:

- `add_first_tidy(members)` adds `first_tidy`, the first name trimmed and lower-cased.
- `add_full_name(members)` adds `full_name`, the trimmed first name, middle name and last name joined by single spaces, even when `middle` is null.
- `add_email_domain(members)` adds `domain`, the lower-cased text after the `@`.
- `add_card_number(members)` adds `card_no`, the digits of a card such as `"LIB-0042"` as an integer.
- `mask_card(members)` adds `card_masked`, where every digit becomes `#`.

## Examples

```python
# row: (1, "  Ada ", None, "Lovelace", "ADA@Library.org", "LIB-0042")
add_first_tidy(members)     # first_tidy "ada"
add_full_name(members)      # full_name "Ada Lovelace"
add_email_domain(members)   # domain "library.org"
add_card_number(members)    # card_no 42
mask_card(members)          # card_masked "LIB-####"
```

Watch for the lesson's pitfall: `concat` returns null for the whole row when any input is null, so choose the join that skips nulls.

## What differs on Databricks

Nothing about these functions: the same `pyspark.sql.functions` run on a cluster, and a notebook would normally read the members from a table instead of building them in memory.
On Databricks you can also write the same logic in SQL cells with `lower`, `trim`, `concat_ws` and `regexp_extract`.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/string_functions
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
