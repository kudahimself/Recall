# Gap filling

Topic: Null Handling (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

A null is a missing value: comparing it gives null, arithmetic with it gives null, and `filter` drops any row whose condition is null.
In `gap_filling.py` you deal with gaps in a members table with `member_id`, `phone`, `email` and `visits`, any of which can be null:

- `without_phone(members)` returns the sorted ids of members whose phone is missing.
- `phone_differs(members, phone)` returns the sorted ids of members whose phone is not that number, and that includes members with no phone.
- `add_contact(members)` adds `contact`, the email, else the phone, else `"none"`.
- `fill_defaults(members)` returns the table with a missing `visits` set to `0` and a missing `phone` set to `"unknown"`, leaving `email` null where it is.
- `add_next_visits(members)` adds `visits_next`, visits plus one, with a missing visits counted as `0`.
- `drop_unreachable(members)` returns the sorted ids of members who have a phone or an email.

## Examples

```python
# member 2 has no phone, member 4's phone is "555"
without_phone(members)             # [2, ...]
phone_differs(members, "555")      # includes member 2, whose phone is null
add_contact(members)               # contact "none" when email and phone are both null
```

Watch for the lesson's pitfall: `filter(col("phone") != "555")` also drops every null phone, because null != "555" is null, not true.

## What differs on Databricks

Nothing about the null rules: Spark treats missing values the same way on a cluster, and in a notebook the same checks are `IS NULL`, `coalesce` and `<=>` in SQL.
Only the data source changes, usually a Delta table instead of tuples built in the test.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/null_handling
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
