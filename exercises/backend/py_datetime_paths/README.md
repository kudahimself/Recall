# Due dates and report files

Topic: Dates, Times & Paths (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Work out when loans are due, and where the loan reports live.
Fill in the functions in `dues.py`:

- `due_at(lent_at, days=14)` returns the datetime `days` days after `lent_at`.
- `days_overdue(due, now)` returns how many whole days `now` is past `due`, or 0 when the loan is not late.
- `as_utc(dt)` makes a datetime aware in UTC: a naive one gets `timezone.utc` attached, and an aware one is converted to UTC.
- `format_due(dt)` shows a datetime as `"31 Jan 2025"`, and `parse_day(text)` reads `"2025-03-01"` back into a datetime.
- `report_path(folder, year)` builds `<folder>/reports/loans-<year>.csv` as a `Path`.
- `report_years(folder)` lists the years of the `loans-*.csv` files in a folder, sorted, ignoring other files.
- `json_twin(path)` gives the same path with a `.json` extension.

## Examples

```python
from datetime import datetime, timezone
lent = datetime(2025, 1, 17, 9, 30, tzinfo=timezone.utc)
due = due_at(lent)                     # 2025-01-31 09:30 UTC
days_overdue(due, datetime(2025, 2, 3, 10, 0, tzinfo=timezone.utc))   # 3
as_utc(datetime(2025, 1, 31, 9, 30))   # datetime(2025, 1, 31, 9, 30, tzinfo=timezone.utc)
format_due(due)                        # "31 Jan 2025"
parse_day("2025-03-01")                # datetime(2025, 3, 1, 0, 0)
report_path("data", 2025)              # Path("data/reports/loans-2025.csv")
json_twin(Path("data/loans-2025.csv")) # Path("data/loans-2025.json")
```

Watch for the lesson's pitfall: a naive and an aware datetime cannot be compared or subtracted, and Python raises `TypeError` rather than guess.
Make both aware with `as_utc` before you mix them.

## Run the tests

```bash
cd exercises/backend/py_datetime_paths
pytest
```

The tests make their files in a temporary folder, so they never touch your own files.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
