"""Reference solution for loan_sync.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def pick_trigger(freshness_seconds, push_source):
    if push_source and freshness_seconds < 60:
        return {"processingTime": f"{freshness_seconds} seconds"}
    return {"availableNow": True}


def choose_layout(table_gb, column, distinct_values):
    if table_gb > 1000 and table_gb / distinct_values >= 1:
        return f"PARTITIONED BY ({column})"
    return f"CLUSTER BY ({column})"


def create_clustered(spark, table, keys):
    spark.sql(f"CREATE TABLE {table} (loan_id INT, branch STRING, due DATE) CLUSTER BY ({', '.join(keys)})")


def recluster(spark, table, keys):
    spark.sql(f"ALTER TABLE {table} CLUSTER BY ({', '.join(keys)})")


def apply_change_log(spark, table, changes):
    changes.createOrReplaceTempView("loan_changes")
    spark.sql(f"""
        MERGE INTO {table} t USING (
            SELECT * FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY loan_id ORDER BY seq DESC) AS rn
                FROM loan_changes
            ) WHERE rn = 1
        ) c
        ON t.loan_id = c.loan_id
        WHEN MATCHED AND c.op = 'D' THEN DELETE
        WHEN MATCHED THEN UPDATE SET branch = c.branch, due = c.due
        WHEN NOT MATCHED AND c.op <> 'D' THEN INSERT (loan_id, branch, due) VALUES (c.loan_id, c.branch, c.due)
    """)


def snapshot_changes(old, new):
    o, n = old.alias("o"), new.alias("n")
    joined = o.join(n, F.col("o.loan_id") == F.col("n.loan_id"), "full_outer")
    op = (
        F.when(F.col("o.loan_id").isNull(), "I")
        .when(F.col("n.loan_id").isNull(), "D")
        .when(~(F.col("o.branch").eqNullSafe(F.col("n.branch")) & F.col("o.due").eqNullSafe(F.col("n.due"))), "U")
    )
    side = lambda c: F.when(F.col("n.loan_id").isNull(), F.col(f"o.{c}")).otherwise(F.col(f"n.{c}"))  # noqa: E731
    return (
        joined.select(op.alias("op"), side("loan_id").alias("loan_id"), side("branch").alias("branch"), side("due").alias("due"))
        .where(F.col("op").isNotNull())
        .orderBy("loan_id")
    )


def sync_method(has_change_log, rows, small_rows=100_000):
    if has_change_log:
        return "change log"
    return "full reload" if rows <= small_rows else "snapshot diff"
