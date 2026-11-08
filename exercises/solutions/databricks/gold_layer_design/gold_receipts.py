"""Reference solution for gold_receipts.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def _real(spark, receipts):
    return spark.table(receipts).where(~F.col("is_test"))


def daily_sales(spark, receipts, lines):
    per_receipt = spark.table(lines).groupBy("receipt_id").agg(F.count("*").alias("books"))
    return (
        _real(spark, receipts)
        .join(per_receipt, "receipt_id", "left")
        .groupBy("sale_day")
        .agg(F.sum("total").alias("revenue"), F.sum(F.coalesce("books", F.lit(0))).alias("books"))
        .orderBy("sale_day")
    )


def sales_obt(spark, receipts, lines, books):
    return (
        spark.table(lines)
        .join(_real(spark, receipts).select("receipt_id", "sale_day"), "receipt_id")
        .join(spark.table(books), "isbn")
        .select("receipt_id", "sale_day", "isbn", "title", "genre", "price")
    )


def weekly_sales(spark, gold):
    return (
        spark.table(gold)
        .groupBy(F.date_trunc("week", "sale_day").cast("date").alias("week_start"))
        .agg(F.sum("revenue").alias("revenue"), F.sum("books").alias("books"))
        .orderBy("week_start")
    )


def replay_from(spark, receipts, lines, gold, day):
    daily_sales(spark, receipts, lines).where(F.col("sale_day") >= F.lit(day).cast("date")) \
        .createOrReplaceTempView("replayed_days")
    spark.sql(f"""
        INSERT INTO {gold} REPLACE WHERE sale_day >= DATE'{day}'
        SELECT * FROM replayed_days
    """)


def publish(spark, view, table, receipts):
    want = _real(spark, receipts).agg(F.sum("total")).first()[0]
    got = spark.table(table).agg(F.sum("revenue")).first()[0]
    if got != want:
        return False
    spark.sql(f"CREATE OR REPLACE VIEW {view} AS SELECT * FROM {table}")
    return True
