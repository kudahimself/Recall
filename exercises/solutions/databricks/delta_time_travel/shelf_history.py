"""Reference solution for shelf_history.py: look only after your own tests pass."""


def _history(spark, table):
    return spark.sql(f"DESCRIBE HISTORY {table}").collect()


def latest_version(spark, table):
    return max(r["version"] for r in _history(spark, table))


def operations(spark, table):
    rows = sorted(_history(spark, table), key=lambda r: r["version"])
    return [r["operation"] for r in rows]


def total_books_at_version(spark, table, version):
    return spark.sql(f"SELECT SUM(books) FROM {table} VERSION AS OF {int(version)}").first()[0]


def total_books_at_time(spark, table, moment):
    return spark.sql(f"SELECT SUM(books) FROM {table} TIMESTAMP AS OF '{moment}'").first()[0]


def undo_to_version(spark, table, version):
    spark.sql(f"RESTORE TABLE {table} TO VERSION AS OF {int(version)}")
