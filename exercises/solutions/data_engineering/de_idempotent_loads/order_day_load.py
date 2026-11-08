"""Orders, loaded twice: reference solution."""


def load_day(con, run_date, crash_after_delete=None):
    """Make fact_orders' rows for run_date equal staging_orders' rows for that day; return how many there are."""
    con.execute("BEGIN TRANSACTION")
    try:
        con.execute("DELETE FROM fact_orders WHERE order_date = ?", [run_date])
        if crash_after_delete is not None:
            crash_after_delete()
        con.execute(
            """
            INSERT INTO fact_orders (order_id, order_date, amount)
            SELECT order_id, order_date, amount
            FROM staging_orders
            WHERE order_date = ?
            """,
            [run_date],
        )
        written = con.execute("SELECT COUNT(*) FROM fact_orders WHERE order_date = ?", [run_date]).fetchone()[0]
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return written


def merge_updates(con):
    """Apply order_updates to fact_orders by order_id: update the orders it has, insert the others."""
    con.execute(
        """
        MERGE INTO fact_orders AS t
        USING order_updates AS s
        ON t.order_id = s.order_id
        WHEN MATCHED THEN UPDATE SET order_date = s.order_date, amount = s.amount
        WHEN NOT MATCHED THEN INSERT (order_id, order_date, amount) VALUES (s.order_id, s.order_date, s.amount)
        """
    )
    return con.execute("SELECT COUNT(*) FROM order_updates").fetchone()[0]
