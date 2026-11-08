"""Fine reports: each function returns the SQL text of one aggregate query.

The tests register this temp view, run your text with spark.sql and compare the rows:

    fines(member, branch, cents, waived_on)   -- waived_on is NULL while the fine is still due
"""


def total_per_member_sql() -> str:
    """Total fine per member: (member, total_cents)."""
    # TODO: group by member and add up the cents
    raise NotImplementedError


def big_debtors_sql() -> str:
    """Members whose total is over 300 cents: (member, total_cents)."""
    # TODO: filter the groups after grouping, not the rows
    raise NotImplementedError


def branch_summary_sql() -> str:
    """Per branch: (branch, n_fines, n_waived, max_cents).

    n_fines counts every fine, n_waived counts only the fines that have a waived_on date.
    """
    # TODO: two different counts in one query
    raise NotImplementedError


def repeat_unpaid_sql() -> str:
    """Members with at least 2 fines not yet waived: (member, n)."""
    # TODO: filter rows first, then filter the groups
    raise NotImplementedError


def branch_rollup_sql() -> str:
    """Total cents per branch plus a grand total row: (branch, total_cents).

    The grand total row has branch NULL.
    """
    # TODO: one grouping modifier adds the grand total
    raise NotImplementedError
