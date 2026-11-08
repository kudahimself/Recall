"""Window-function queries: each function returns the SQL text of one query.

The tests register this temp view, run your text with spark.sql and compare the rows:

    sales(branch, day, copies)   -- day is an ISO date string, one row per branch per day

Every query keeps all the rows (a window function does not collapse them).
"""


def busiest_day_sql() -> str:
    """The best-selling day of each branch: (branch, day).

    On a tie in copies, the earlier day wins, so each branch gives exactly one row.
    """
    # TODO: number the rows inside each branch, then keep number 1
    raise NotImplementedError


def copies_rank_sql() -> str:
    """Every sales row with its rank by copies, highest first, inside its branch: (branch, day, copies, rnk).

    Tied days share a rank and the next rank is skipped (1, 1, 3).
    """
    # TODO: the ranking function that leaves gaps
    raise NotImplementedError


def change_from_previous_day_sql() -> str:
    """Every row with the change in copies since the branch's previous day: (branch, day, change).

    The first day of a branch has change NULL.
    """
    # TODO: read the previous row's copies inside each branch
    raise NotImplementedError


def running_total_sql() -> str:
    """Every row with the branch's copies sold so far, today included: (branch, day, running)."""
    # TODO: an aggregate over a window ordered by day
    raise NotImplementedError


def before_a_drop_sql() -> str:
    """The days whose copies are higher than the next day's: (branch, day).

    A branch's last day has no next day, so it never qualifies.
    """
    # TODO: read the next row's copies
    raise NotImplementedError
