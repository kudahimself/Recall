"""Orders, loaded twice: write loads that end the same however often they run.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  staging_orders(order_id INTEGER, order_date DATE, amount INTEGER)   what the extract staged
  fact_orders(order_id INTEGER, order_date DATE, amount INTEGER)      the table readers query
  order_updates(order_id INTEGER, order_date DATE, amount INTEGER)    a feed of new and changed orders

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_order_day_load.py pass.
Run them from this folder with: pytest
"""


def load_day(con, run_date, crash_after_delete=None):
    """Make fact_orders' rows for run_date equal staging_orders' rows for that day; return how many there are.

    run_date is the day the orchestrator asks for, an ISO date string such as "2026-11-01".
    Only that day of fact_orders may change, and a day with no staged orders ends up empty.
    The whole replace is one transaction: if anything fails, fact_orders is left as it was.
    crash_after_delete stands in for a crash: when it is given, call it straight after the delete,
    before the insert, and let its exception reach the caller.
    """
    # TODO
    raise NotImplementedError


def merge_updates(con):
    """Apply order_updates to fact_orders by order_id: update the orders it has, insert the others.

    Return how many rows order_updates holds.
    Applying the same updates again must leave fact_orders exactly as the first time.
    """
    # TODO
    raise NotImplementedError
