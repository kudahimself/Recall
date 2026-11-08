"""Customers through time: reference solution."""

OPEN_END = "9999-12-31"


def apply_snapshot(con, as_of):
    """Bring dim_customer in line with source_customers as of a date; return how many versions were added."""
    con.execute("BEGIN TRANSACTION")
    try:
        # Type 1: email is overwritten on every version of the customer.
        con.execute(
            """
            UPDATE dim_customer AS d SET email = s.email
            FROM source_customers AS s
            WHERE d.customer_id = s.customer_id AND d.email IS DISTINCT FROM s.email
            """
        )
        # Type 2: a new customer, or a city that differs from the current version, gets a new version.
        changed = con.execute(
            """
            SELECT s.customer_id, s.city, s.email
            FROM source_customers AS s
            LEFT JOIN dim_customer AS d
              ON d.customer_id = s.customer_id AND d.valid_to = CAST(? AS DATE)
            WHERE d.customer_id IS NULL OR d.city IS DISTINCT FROM s.city
            ORDER BY s.customer_id
            """,
            [OPEN_END],
        ).fetchall()
        next_key = con.execute("SELECT COALESCE(MAX(customer_key), 0) + 1 FROM dim_customer").fetchone()[0]
        for key, (customer_id, city, email) in enumerate(changed, start=next_key):
            con.execute(
                "UPDATE dim_customer SET valid_to = ? WHERE customer_id = ? AND valid_to = CAST(? AS DATE)",
                [as_of, customer_id, OPEN_END],
            )
            con.execute(
                "INSERT INTO dim_customer VALUES (?, ?, ?, ?, ?, CAST(? AS DATE))",
                [key, customer_id, city, email, as_of, OPEN_END],
            )
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return len(changed)


def version_on(con, customer_id, day):
    """The customer_key of the version valid on day, or None when the customer had none."""
    row = con.execute(
        """
        SELECT customer_key FROM dim_customer
        WHERE customer_id = ? AND valid_from <= CAST(? AS DATE) AND CAST(? AS DATE) < valid_to
        """,
        [customer_id, day, day],
    ).fetchone()
    return row[0] if row else None


def stamp_sales(con):
    """Fill fact_sales.customer_key, where it is NULL, with the version valid on the sale's date."""
    before = con.execute("SELECT COUNT(*) FROM fact_sales WHERE customer_key IS NULL").fetchone()[0]
    con.execute(
        """
        UPDATE fact_sales AS f SET customer_key = d.customer_key
        FROM dim_customer AS d
        WHERE f.customer_key IS NULL
          AND d.customer_id = f.customer_id
          AND f.sale_date >= d.valid_from
          AND f.sale_date < d.valid_to
        """
    )
    after = con.execute("SELECT COUNT(*) FROM fact_sales WHERE customer_key IS NULL").fetchone()[0]
    return before - after


def revenue_by_city(con):
    """(city, revenue) by city, each stamped sale under the city of its version."""
    return con.execute(
        """
        SELECT d.city, SUM(f.amount) AS revenue
        FROM fact_sales AS f
        JOIN dim_customer AS d ON d.customer_key = f.customer_key
        GROUP BY d.city
        ORDER BY d.city
        """
    ).fetchall()
