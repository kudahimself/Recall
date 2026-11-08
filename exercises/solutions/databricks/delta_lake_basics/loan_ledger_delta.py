"""Reference solution for loan_ledger_delta.py: look only after your own tests pass."""
from pyspark.errors import AnalysisException


def _frame(spark, rows, columns):
    return spark.createDataFrame(rows, columns)


def create_loans(spark, path, rows):
    _frame(spark, rows, ["loan_id", "title"]).write.format("delta").mode("overwrite").save(path)


def add_loans(spark, path, rows):
    _frame(spark, rows, ["loan_id", "title"]).write.format("delta").mode("append").save(path)


def read_loans(spark, path):
    return spark.read.format("delta").load(path)


def append_checked(spark, path, rows_with_copies):
    frame = _frame(spark, rows_with_copies, ["loan_id", "title", "copies"])
    try:
        frame.write.format("delta").mode("append").save(path)
    except AnalysisException:
        return True
    return False


def append_evolving(spark, path, rows_with_copies):
    frame = _frame(spark, rows_with_copies, ["loan_id", "title", "copies"])
    frame.write.format("delta").mode("append").option("mergeSchema", "true").save(path)


def commit_versions(spark, path):
    history = spark.sql(f"DESCRIBE HISTORY delta.`{path}`").collect()
    return sorted(r["version"] for r in history)
