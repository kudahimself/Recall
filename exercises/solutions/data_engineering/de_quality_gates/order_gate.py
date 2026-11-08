"""Hold the bad batch: reference solution."""

ACCEPTED_STATUSES = ("paid", "refunded", "cancelled")


def blocking_failures(con):
    """For each blocking test, how many staging_orders rows break it."""
    statuses = ", ".join(f"'{s}'" for s in ACCEPTED_STATUSES)
    rows = con.execute(
        f"""
        SELECT 'order_id unique', COUNT(*) FROM staging_orders
        WHERE order_id IN (SELECT order_id FROM staging_orders GROUP BY order_id HAVING COUNT(*) > 1)
        UNION ALL
        SELECT 'customer_id not null', COUNT(*) FROM staging_orders WHERE customer_id IS NULL
        UNION ALL
        SELECT 'status accepted', COUNT(*) FROM staging_orders
        WHERE status IS NULL OR status NOT IN ({statuses})
        UNION ALL
        SELECT 'customer exists', COUNT(*) FROM staging_orders s
        WHERE s.customer_id IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM dim_customers d WHERE d.customer_id = s.customer_id)
        """
    ).fetchall()
    return dict(rows)


def row_count_warning(con, normal_rows, tolerance):
    """A warning when the batch's row count is further than tolerance from normal_rows, else None."""
    n = con.execute("SELECT COUNT(*) FROM staging_orders").fetchone()[0]
    if abs(n - normal_rows) > tolerance * normal_rows:
        return f"row count {n}, expected about {normal_rows}"
    return None


def run_gate(con, normal_rows, tolerance=0.5):
    """Write, audit, publish: test the staged batch and publish it only if no blocking test fails."""
    failures = {name: n for name, n in blocking_failures(con).items() if n}
    warning = row_count_warning(con, normal_rows, tolerance)
    warnings = [warning] if warning else []
    if failures:
        return {"decision": "hold", "failures": failures, "warnings": warnings}
    con.execute("BEGIN TRANSACTION")
    try:
        con.execute("INSERT INTO fact_orders SELECT order_id, customer_id, status, amount FROM staging_orders")
        con.execute("DELETE FROM staging_orders")
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return {"decision": "publish", "failures": {}, "warnings": warnings}
