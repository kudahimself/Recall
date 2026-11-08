"""Sales that arrive late: reference solution."""

NEWEST_STAGED = """
    SELECT sale_id, sale_date, amount, version
    FROM (
      SELECT sale_id, sale_date, amount, version,
             ROW_NUMBER() OVER (PARTITION BY sale_id ORDER BY version DESC) AS rn
      FROM stg_sales
    ) AS ranked
    WHERE rn = 1
"""

# The newest staged version of each sale that is newer than the version fact_sales holds.
TO_WRITE = f"""
    SELECT s.*
    FROM ({NEWEST_STAGED}) AS s
    WHERE NOT EXISTS (
      SELECT 1 FROM fact_sales f WHERE f.sale_id = s.sale_id AND f.version >= s.version
    )
"""


def newest_staged(con):
    """One row per staged sale, its newest version: (sale_id, sale_date, amount, version), by sale_id."""
    return con.execute(f"{NEWEST_STAGED} ORDER BY sale_id").fetchall()


def touched_days(con):
    """The days this batch changes, in order: the new versions' sale dates and the dates they replace."""
    rows = con.execute(
        f"""
        SELECT sale_date FROM ({TO_WRITE}) AS w
        UNION
        SELECT f.sale_date FROM fact_sales f WHERE f.sale_id IN (SELECT sale_id FROM ({TO_WRITE}) AS w2)
        ORDER BY sale_date
        """
    ).fetchall()
    return [r[0] for r in rows]


def load_batch(con):
    """Write the batch's new versions into fact_sales and rebuild daily_revenue for every touched day."""
    con.execute("BEGIN TRANSACTION")
    try:
        days = touched_days(con)
        if days:
            con.execute(f"CREATE OR REPLACE TEMP TABLE to_write AS {TO_WRITE}")
            con.execute("DELETE FROM fact_sales WHERE sale_id IN (SELECT sale_id FROM to_write)")
            con.execute("INSERT INTO fact_sales SELECT sale_id, sale_date, amount, version FROM to_write")
            con.execute("DROP TABLE to_write")
            placeholders = ", ".join("?" for _ in days)
            con.execute(f"DELETE FROM daily_revenue WHERE sale_date IN ({placeholders})", days)
            con.execute(
                f"""
                INSERT INTO daily_revenue
                SELECT sale_date, COUNT(*), SUM(amount)
                FROM fact_sales
                WHERE sale_date IN ({placeholders})
                GROUP BY sale_date
                """,
                days,
            )
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return days
