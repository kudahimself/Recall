"""Reference solution for title_changes.py: look only after your own tests pass."""


def create_tracked(spark, table):
    spark.sql(f"""
        CREATE TABLE {table} (isbn STRING, shelf STRING)
        TBLPROPERTIES (delta.enableChangeDataFeed = true)
    """)


def start_tracking(spark, table):
    spark.sql(f"ALTER TABLE {table} SET TBLPROPERTIES (delta.enableChangeDataFeed = true)")


def _changes(table, start, end=None):
    upto = "" if end is None else f", {int(end)}"
    return f"""
        SELECT * FROM table_changes('{table}', {int(start)}{upto})
        WHERE _change_type != 'update_preimage'
    """


def changes_since(spark, table, start, end=None):
    rows = spark.sql(f"""
        SELECT _commit_version, isbn, shelf, _change_type
        FROM ({_changes(table, start, end)})
        ORDER BY _commit_version, isbn
    """).collect()
    return [tuple(r) for r in rows]


def change_counts(spark, table, start):
    counts = {"insert": 0, "update": 0, "delete": 0}
    for r in spark.sql(f"SELECT _change_type, COUNT(*) AS n FROM ({_changes(table, start)}) GROUP BY _change_type").collect():
        counts["update" if r["_change_type"] == "update_postimage" else r["_change_type"]] = r["n"]
    return counts


def apply_changes(spark, table, target, start):
    spark.sql(f"""
        MERGE INTO {target} AS t
        USING (
            SELECT isbn, shelf, _change_type FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY isbn ORDER BY _commit_version DESC) AS rn
                FROM ({_changes(table, start)})
            ) WHERE rn = 1
        ) AS c
        ON t.isbn = c.isbn
        WHEN MATCHED AND c._change_type = 'delete' THEN DELETE
        WHEN MATCHED THEN UPDATE SET t.shelf = c.shelf
        WHEN NOT MATCHED AND c._change_type != 'delete' THEN INSERT (isbn, shelf) VALUES (c.isbn, c.shelf)
    """)
