"""Reference solution for bookshop_frames.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def books_df(spark, rows):
    return spark.createDataFrame(rows, ["title", "price", "pages"])


def parse_prices(books):
    return books.withColumn("price", F.col("price").cast("double"))


def cheap_books(books, limit):
    return books.select("title", "price").filter(F.col("price") < limit)


def add_length_band(books):
    return books.withColumn("band", F.when(F.col("pages") >= 300, "long").otherwise("short"))


def add_price_with_vat(books):
    return books.withColumn("price_inc_vat", F.col("price") * 1.2)
