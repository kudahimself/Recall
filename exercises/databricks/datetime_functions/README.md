# Due dates

Topic: Date & Time Functions (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

Spark keeps a calendar day as a `date` column and gives you functions to parse, shift, subtract and format it.
In `due_dates.py` you work out due dates for a table of library loans:

- `parse_borrowed(loans)` adds `borrowed`, a real date, parsed from the day/month/year text in `borrowed_text`, such as `"05/03/2026"`.
- `add_due_date(loans)` adds `due`, 21 days after `borrowed`.
- `add_days_out(loans)` adds `days_out`, the days from `borrowed` to `returned`.
- `add_month_label(loans)` adds `month_label`, the borrowed date as text like `"2026-03"`.
- `count_in_month(loans, year, month)` returns how many loans were borrowed in that month, as an `int`.

## Examples

```python
# borrowed_text "05/03/2026" is 5 March, not 3 May
parse_borrowed(loans)        # borrowed 2026-03-05
add_due_date(loans)          # due 2026-03-26
add_month_label(loans)       # month_label "2026-03"
```

Watch for the lesson's pitfall: pattern letters are case-sensitive, `MM` is the month and `mm` is the minute, with no error to warn you.

## What differs on Databricks

The functions are the same, with `current_date()` giving the cluster's today.
The tests here fix the dates and the local session runs in UTC, as most Databricks clusters do, so the results do not depend on the day you run them.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/datetime_functions
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
