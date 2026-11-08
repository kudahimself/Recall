"""Loan pipeline: transformations that only plan, and actions that run.

Fill in the functions.
The first three return a DataFrame and should not run a job; the last two are actions that return plain Python values.
"""


def branch_stats(loans):
    """One row per branch with the columns branch, loans (rows) and total_days (sum of days).

    Sorted by total_days, biggest first.
    """
    # TODO: group by branch, aggregate, then sort the result
    raise NotImplementedError


def unique_pairs(loans):
    """The distinct (branch, title) pairs, as a DataFrame with just those two columns."""
    # TODO: keep the two columns and drop the repeated rows
    raise NotImplementedError


def repartitioned(loans, n):
    """The same rows spread over exactly `n` partitions."""
    # TODO: choose the transformation that can both raise and lower the partition count
    raise NotImplementedError


def top_titles(loans, n):
    """The `n` most borrowed titles as a Python list of strings, most borrowed first.

    Break ties by title, A to Z.
    Bring back only n rows to the driver.
    """
    # TODO: count loans per title, sort, then use the action that fetches just n rows
    raise NotImplementedError


def longest_loan(loans):
    """The largest `days` value, as a plain Python int."""
    # TODO: aggregate to a single row, then use an action that returns it
    raise NotImplementedError
