"""Reference solution for visit_files.py: look only after your own tests pass."""

CHECK = "spark.databricks.delta.retentionDurationCheck.enabled"


def file_count(spark, table):
    return int(spark.sql(f"DESCRIBE DETAIL {table}").first()["numFiles"])


def compact(spark, table):
    spark.sql(f"OPTIMIZE {table}")


def compact_by(spark, table, column):
    spark.sql(f"OPTIMIZE {table} ZORDER BY ({column})")


def vacuum_default(spark, table):
    spark.sql(f"VACUUM {table}")


def vacuum_now(spark, table):
    spark.conf.set(CHECK, "false")
    try:
        spark.sql(f"VACUUM {table} RETAIN 0 HOURS")
    finally:
        spark.conf.set(CHECK, "true")
