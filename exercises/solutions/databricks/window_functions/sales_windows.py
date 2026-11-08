"""Reference solution for sales_windows.py: look only after your own tests pass."""


def busiest_day_sql() -> str:
    return """SELECT branch, day FROM (
                SELECT branch, day,
                       row_number() OVER (PARTITION BY branch ORDER BY copies DESC, day) AS rn
                FROM sales
              ) WHERE rn = 1"""


def copies_rank_sql() -> str:
    return """SELECT branch, day, copies,
                     rank() OVER (PARTITION BY branch ORDER BY copies DESC) AS rnk
              FROM sales"""


def change_from_previous_day_sql() -> str:
    return """SELECT branch, day,
                     copies - lag(copies) OVER (PARTITION BY branch ORDER BY day) AS change
              FROM sales"""


def running_total_sql() -> str:
    return """SELECT branch, day,
                     sum(copies) OVER (PARTITION BY branch ORDER BY day) AS running
              FROM sales"""


def before_a_drop_sql() -> str:
    return """SELECT branch, day FROM (
                SELECT branch, day, copies,
                       lead(copies) OVER (PARTITION BY branch ORDER BY day) AS next_copies
                FROM sales
              ) WHERE copies > next_copies"""
