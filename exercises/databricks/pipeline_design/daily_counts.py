"""Starter: loan pipelines that are safe to run again, catch late rows and keep a contract. Fill in each TODO.

Days are strings such as "2026-03-01". The raw table is (loan_id INT, loan_day DATE, branch STRING),
and the summary table (loan_day DATE, branch STRING, loans BIGINT) holds one row per day and branch.
"""
from datetime import date, timedelta  # noqa: F401


def append_new(spark, target, staging):
    """Add the rows of the DataFrame `staging` (loan_id, loan_day, branch) to the raw table `target`.

    Insert only loan_ids the table does not hold yet, so a retried run adds nothing twice.
    """
    # TODO: a MERGE on the unique key, with only a WHEN NOT MATCHED clause
    raise NotImplementedError


def rebuild_day(spark, raw, summary, day):
    """Replace `day`'s rows of `summary` with that day's loan count per branch from `raw`.

    Leave every other day as it is, and do it in one atomic write.
    """
    # TODO: INSERT INTO ... REPLACE WHERE
    raise NotImplementedError


def backfill(spark, raw, summary, first_day, last_day):
    """Rebuild every day from `first_day` to `last_day`, both included, and return them as a list of strings."""
    # TODO: the same write for each day
    raise NotImplementedError


def rebuild_trailing(spark, raw, summary, run_day, days=3):
    """Rebuild `run_day` and the `days - 1` days before it, so rows that arrived late are counted.

    Return the days rebuilt, oldest first.
    """
    # TODO
    raise NotImplementedError


def add_count_check(spark, summary):
    """Add a CHECK constraint named loans_positive to `summary`: a summary row counts at least one loan."""
    # TODO: one ALTER TABLE
    raise NotImplementedError


def contract_problems(df, contract):
    """List how the DataFrame `df` breaks `contract`, a dict of column name to type, such as {"loan_id": "int"}.

    Types are Spark's simple names (`df.schema[col].dataType.simpleString()`). Return, in this order:
    "missing: <col>" for each contract column df lacks and "type: <col> is <actual>, not <expected>"
    for each with another type (both in contract order), then "extra: <col>" for each df column the
    contract lacks (in df order). An empty list means df keeps the contract.
    """
    # TODO
    raise NotImplementedError
