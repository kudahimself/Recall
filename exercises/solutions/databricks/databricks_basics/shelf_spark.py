"""Reference solution for shelf_spark.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def books_df(spark, rows):
    return spark.createDataFrame(rows, ["book_id", "title", "year"])


def modern_titles(books):
    rows = books.filter(F.col("year") > 1900).select("title").collect()
    return sorted(r["title"] for r in rows)


def books_per_decade(books):
    counts = (
        books.withColumn("decade", (F.col("year") / 10).cast("int") * 10)
        .groupBy("decade")
        .count()
        .collect()
    )
    return {r["decade"]: r["count"] for r in counts}


def save_as_table(spark, books, table):
    books.write.mode("overwrite").saveAsTable(table)
    return spark.sql(f"DESCRIBE DETAIL {table}").first()["format"]


def row_count(books):
    return books.count()
