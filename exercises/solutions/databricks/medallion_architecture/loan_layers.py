"""Reference solution for loan_layers.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def add_to_bronze(spark, records, source_file, bronze):
    (spark.createDataFrame(records, "loan_id STRING, branch STRING, fee STRING, batch STRING")
        .withColumn("source_file", F.lit(source_file))
        .write.mode("append").saveAsTable(bronze))


def build_silver(spark, bronze, silver):
    spark.sql(f"""
        CREATE OR REPLACE TABLE {silver} AS
        SELECT loan_id, branch, try_cast(fee AS INT) AS fee
        FROM (
            SELECT *, ROW_NUMBER() OVER (
                PARTITION BY loan_id ORDER BY try_cast(batch AS INT) DESC) AS rn
            FROM {bronze}
            WHERE loan_id IS NOT NULL
        )
        WHERE rn = 1
    """)


def build_quarantine(spark, bronze, quarantine):
    spark.sql(f"CREATE OR REPLACE TABLE {quarantine} AS SELECT * FROM {bronze} WHERE loan_id IS NULL")


def build_gold(spark, silver, gold):
    spark.sql(f"""
        CREATE OR REPLACE TABLE {gold} AS
        SELECT branch, COUNT(*) AS loans, SUM(fee) AS fees
        FROM {silver}
        GROUP BY branch
    """)
