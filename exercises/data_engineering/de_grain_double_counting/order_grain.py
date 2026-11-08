"""Totals at the right grain: state each table's grain, then add up only what belongs to it.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  orders(order_id INTEGER, customer_id VARCHAR, order_date DATE, shipping INTEGER)   one row per order
  order_lines(order_id INTEGER, line_no INTEGER, amount INTEGER)                     one row per order line
  daily_traffic(day DATE, visits INTEGER, orders INTEGER, conversion DOUBLE)         one row per day;
      conversion is that day's orders / visits
  daily_buyers(day DATE, buyers INTEGER)   one row per day: how many distinct customers ordered that day

Run SQL with con.execute(sql) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_order_grain.py pass.
Run them from this folder with: pytest
"""


def key_is_unique(con, table, columns):
    """True when no two rows of table share the same values in columns (a list of column names).

    key_is_unique(con, "order_lines", ["order_id", "line_no"]) -> True
    key_is_unique(con, "order_lines", ["order_id"]) -> False
    """
    # TODO
    raise NotImplementedError


def join_row_counts(con):
    """(rows in orders, rows after joining orders to order_lines on order_id): the check before you sum."""
    # TODO
    raise NotImplementedError


def customer_totals(con):
    """Per customer: (customer_id, orders, shipping, goods), by customer_id.

    orders counts the customer's orders, shipping adds up each order's fee once,
    and goods adds up the amounts of their order lines.
    An order with no lines still counts, with 0 goods.
    """
    # TODO
    raise NotImplementedError


def monthly_conversion(con):
    """Per month of daily_traffic: (month, visits, orders, conversion), by month.

    month is "YYYY-MM"; conversion is the month's orders / the month's visits, rounded to 4 places.
    """
    # TODO
    raise NotImplementedError


def monthly_buyers(con):
    """Per month of orders: (month, buyers), by month: the customers who ordered that month, each once."""
    # TODO
    raise NotImplementedError
