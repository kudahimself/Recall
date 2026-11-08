"""Reference solution for fines_math.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def fines_summary(fines):
    return fines.groupBy("branch").agg(
        F.sum("amount").alias("total"),
        F.round(F.avg("amount"), 2).alias("avg_fine"),
        F.count("*").alias("n"),
    )


def add_whole_pounds(fines):
    return fines.withColumn("pounds", F.ceil("amount"))


def add_capped(fines, cap):
    return fines.withColumn("charged", F.least(F.col("amount"), F.lit(float(cap))))


def row_stats(fines):
    row = fines.agg(
        F.count("*").alias("rows"), F.count("amount").alias("filled"), F.avg("amount").alias("mean")
    ).first()
    return {"rows": row["rows"], "filled": row["filled"], "mean": row["mean"]}


def largest_fine(fines):
    return fines.agg(F.max("amount")).first()[0]
