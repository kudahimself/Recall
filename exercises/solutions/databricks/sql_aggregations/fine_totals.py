"""Reference solution for fine_totals.py: look only after your own tests pass."""


def total_per_member_sql() -> str:
    return "SELECT member, SUM(cents) AS total_cents FROM fines GROUP BY member"


def big_debtors_sql() -> str:
    return """SELECT member, SUM(cents) AS total_cents
              FROM fines GROUP BY member HAVING SUM(cents) > 300"""


def branch_summary_sql() -> str:
    return """SELECT branch, COUNT(*) AS n_fines, COUNT(waived_on) AS n_waived, MAX(cents) AS max_cents
              FROM fines GROUP BY branch"""


def repeat_unpaid_sql() -> str:
    return """SELECT member, COUNT(*) AS n
              FROM fines WHERE waived_on IS NULL
              GROUP BY member HAVING COUNT(*) >= 2"""


def branch_rollup_sql() -> str:
    return "SELECT branch, SUM(cents) AS total_cents FROM fines GROUP BY ROLLUP (branch)"
