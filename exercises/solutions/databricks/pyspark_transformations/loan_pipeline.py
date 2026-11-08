"""Reference solution for loan_pipeline.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def branch_stats(loans):
    return (
        loans.groupBy("branch")
        .agg(F.count("*").alias("loans"), F.sum("days").alias("total_days"))
        .orderBy(F.col("total_days").desc())
    )


def unique_pairs(loans):
    return loans.select("branch", "title").dropDuplicates()


def repartitioned(loans, n):
    return loans.repartition(n)


def top_titles(loans, n):
    rows = (
        loans.groupBy("title").count()
        .orderBy(F.col("count").desc(), "title")
        .take(n)
    )
    return [r["title"] for r in rows]


def longest_loan(loans):
    return loans.agg(F.max("days")).first()[0]
