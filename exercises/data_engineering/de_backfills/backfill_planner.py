"""Plan the backfill: which days to rerun, which tables to rebuild, and in what order.

Days are ISO date strings such as "2026-11-01".
A table's dependencies are a dict of table -> the tables it reads, for example
    {"orders_clean": ["orders_raw"], "daily_sales": ["orders_clean"]}
Fill in each function so the tests in test_backfill_planner.py pass.
Run them from this folder with: pytest
"""


def backfill_days(first_bad_day, last_day, raw_kept_from):
    """Split first_bad_day..last_day (both included) into the days raw data can rebuild and the days it cannot.

    Raw data is kept from raw_kept_from onwards; a day before it cannot be rebuilt.
    Return (days, unreachable), two lists of ISO strings in date order.
    backfill_days("2026-10-30", "2026-11-02", "2026-11-01")
        -> (["2026-11-01", "2026-11-02"], ["2026-10-30", "2026-10-31"])
    """
    # TODO
    raise NotImplementedError


def tables_to_rebuild(deps, fixed):
    """The fixed table and every table built from it, directly or not, upstream first.

    A table comes after every table it reads that is also rebuilt; among tables that are
    ready at the same time, the name that sorts first comes first.
    Tables the fixed one reads, and tables that do not depend on it, are not rebuilt.
    """
    # TODO
    raise NotImplementedError


def schedule(deps, fixed, days, reads_previous_day=()):
    """Group the backfill's (table, day) jobs into waves that run one after another.

    There is one job per table of tables_to_rebuild and per day of days (in date order).
    A job waits for the same day of every rebuilt table it reads, and a table named in
    reads_previous_day also waits for its own job of the previous day in the list.
    Each job runs in the first wave after every job it waits for, so jobs that wait for
    nothing are in wave 0.
    Return a list of waves, each a sorted list of (table, day) tuples.
    """
    # TODO
    raise NotImplementedError
