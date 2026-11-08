"""Totals at the right grain: reference solution."""


def key_is_unique(con, table, columns):
    """True when no two rows of table share the same values in columns."""
    cols = ", ".join(columns)
    total, distinct = con.execute(
        f"SELECT COUNT(*), (SELECT COUNT(*) FROM (SELECT DISTINCT {cols} FROM {table})) FROM {table}"
    ).fetchone()
    return total == distinct


def join_row_counts(con):
    """(rows in orders, rows after joining orders to order_lines on order_id)."""
    return con.execute(
        """
        SELECT (SELECT COUNT(*) FROM orders),
               (SELECT COUNT(*) FROM orders o JOIN order_lines l ON l.order_id = o.order_id)
        """
    ).fetchone()


def customer_totals(con):
    """Per customer: (customer_id, orders, shipping, goods), by customer_id."""
    return con.execute(
        """
        WITH line_totals AS (
          SELECT order_id, SUM(amount) AS goods
          FROM order_lines
          GROUP BY order_id
        )
        SELECT o.customer_id,
               COUNT(*) AS orders,
               SUM(o.shipping) AS shipping,
               COALESCE(SUM(t.goods), 0) AS goods
        FROM orders o
        LEFT JOIN line_totals t ON t.order_id = o.order_id
        GROUP BY o.customer_id
        ORDER BY o.customer_id
        """
    ).fetchall()


def monthly_conversion(con):
    """Per month of daily_traffic: (month, visits, orders, conversion), conversion = orders / visits."""
    return con.execute(
        """
        SELECT strftime(day, '%Y-%m') AS month,
               SUM(visits) AS visits,
               SUM(orders) AS orders,
               ROUND(SUM(orders) / SUM(visits), 4) AS conversion
        FROM daily_traffic
        GROUP BY month
        ORDER BY month
        """
    ).fetchall()


def monthly_buyers(con):
    """Per month of orders: (month, buyers), the customers who ordered that month, each once."""
    return con.execute(
        """
        SELECT strftime(order_date, '%Y-%m') AS month, COUNT(DISTINCT customer_id) AS buyers
        FROM orders
        GROUP BY month
        ORDER BY month
        """
    ).fetchall()
