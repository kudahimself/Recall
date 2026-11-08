"""Members from the change log: reference solution."""


def apply_changes(con):
    """Apply the change_log events past cdc_state.applied_lsn to dim_member; return how many members they touch."""
    con.execute("BEGIN TRANSACTION")
    try:
        position = con.execute("SELECT applied_lsn FROM cdc_state").fetchone()[0]
        touched = con.execute(
            "SELECT COUNT(DISTINCT member_id) FROM change_log WHERE lsn > ?", [position]
        ).fetchone()[0]
        if touched:
            con.execute(
                "DELETE FROM dim_member WHERE member_id IN (SELECT member_id FROM change_log WHERE lsn > ?)",
                [position],
            )
            con.execute(
                """
                INSERT INTO dim_member (member_id, city)
                SELECT member_id, city
                FROM (
                  SELECT member_id, op, city,
                         ROW_NUMBER() OVER (PARTITION BY member_id ORDER BY lsn DESC) AS rn
                  FROM change_log
                  WHERE lsn > ?
                ) AS latest
                WHERE rn = 1 AND op <> 'D'
                """,
                [position],
            )
            con.execute("UPDATE cdc_state SET applied_lsn = (SELECT MAX(lsn) FROM change_log)")
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
    return touched


def start_feed(con, position):
    """Start a new feed: replace dim_member with source_snapshot and record position as applied."""
    con.execute("BEGIN TRANSACTION")
    try:
        con.execute("DELETE FROM dim_member")
        con.execute("INSERT INTO dim_member (member_id, city) SELECT member_id, city FROM source_snapshot")
        con.execute("UPDATE cdc_state SET applied_lsn = ?", [position])
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise
