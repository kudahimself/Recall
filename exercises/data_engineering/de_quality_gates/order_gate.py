"""Hold the bad batch: test tonight's orders in staging and publish them only when they pass.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  staging_orders(order_id INTEGER, customer_id INTEGER, status VARCHAR, amount INTEGER)
      tonight's batch, written where no dashboard reads it
  dim_customers(customer_id INTEGER, segment VARCHAR)   the customers an order must point at
  fact_orders(order_id INTEGER, customer_id INTEGER, status VARCHAR, amount INTEGER)
      the published table the dashboards read

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_order_gate.py pass.
Run them from this folder with: pytest
"""

ACCEPTED_STATUSES = ("paid", "refunded", "cancelled")


def blocking_failures(con):
    """For each blocking test, how many staging_orders rows break it: a dict of all four tests.

    "order_id unique"       rows whose order_id appears more than once in the batch
    "customer_id not null"  rows with no customer_id
    "status accepted"       rows whose status is not one of ACCEPTED_STATUSES (NULL included)
    "customer exists"       rows whose customer_id is set but missing from dim_customers
    """
    # TODO
    raise NotImplementedError


def row_count_warning(con, normal_rows, tolerance):
    """A warning when the batch's row count is far from normal, else None.

    Far means further from normal_rows than tolerance * normal_rows (tolerance is a fraction).
    The warning reads "row count <n>, expected about <normal_rows>".
    """
    # TODO
    raise NotImplementedError


def run_gate(con, normal_rows, tolerance=0.5):
    """Write, audit, publish: test the staged batch and publish it only if no blocking test fails.

    Return {"decision": "hold" or "publish", "failures": {test: rows} for the tests that failed,
    "warnings": a list holding the row count warning, if any}.
    On "hold", change nothing: readers keep yesterday's data and the batch stays in staging.
    On "publish", move the batch into fact_orders and empty staging_orders, in one transaction.
    A warning never holds the batch.
    """
    # TODO
    raise NotImplementedError
