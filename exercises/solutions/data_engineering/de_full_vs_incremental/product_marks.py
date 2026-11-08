"""Products past the mark: reference solution."""


def load_incremental(con, crash_before_mark=None):
    """Upsert the source rows changed since the mark into dim_product, then move the mark; return the rows read."""
    con.execute("BEGIN TRANSACTION")
    try:
        mark = con.execute("SELECT last_loaded FROM load_state WHERE tbl = 'products'").fetchone()[0]
        changed = con.execute(
            "SELECT product_id, price, updated_at FROM src_products WHERE updated_at > ?", [mark]
        ).fetchall()
        if changed:
            con.execute(
                "DELETE FROM dim_product WHERE product_id IN (SELECT product_id FROM src_products WHERE updated_at > ?)",
                [mark],
            )
            con.execute(
                "INSERT INTO dim_product SELECT product_id, price FROM src_products WHERE updated_at > ?",
                [mark],
            )
        if crash_before_mark is not None:
            crash_before_mark()
        if changed:
            new_mark = max(row[2] for row in changed)
            con.execute("UPDATE load_state SET last_loaded = ? WHERE tbl = 'products'", [new_mark])
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return len(changed)


def load_full(con):
    """Replace dim_product with every source row, in one transaction; return the rows loaded."""
    con.execute("BEGIN TRANSACTION")
    try:
        con.execute("DELETE FROM dim_product")
        con.execute("INSERT INTO dim_product SELECT product_id, price FROM src_products")
        con.execute(
            "UPDATE load_state SET last_loaded = (SELECT MAX(updated_at) FROM src_products) WHERE tbl = 'products'"
        )
        loaded = con.execute("SELECT COUNT(*) FROM dim_product").fetchone()[0]
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return loaded


def missed_deletes(con):
    """The product ids dim_product still holds that the source no longer has, in order."""
    rows = con.execute(
        """
        SELECT product_id FROM dim_product
        WHERE product_id NOT IN (SELECT product_id FROM src_products)
        ORDER BY product_id
        """
    ).fetchall()
    return [r[0] for r in rows]
