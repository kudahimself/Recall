"""Reference solution for tag_lists.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def add_tag_count(books):
    return books.withColumn("n_tags", F.size("tags"))


def add_sorted_tags(books):
    return books.withColumn("tags_sorted", F.array_sort("tags"))


def titles_with_tag(books, tag):
    rows = books.filter(F.array_contains("tags", tag)).select("title").collect()
    return sorted(r["title"] for r in rows)


def tag_rows(books):
    return books.select("title", F.explode("tags").alias("tag"))


def tag_rows_keep_all(books):
    return books.select("title", F.explode_outer("tags").alias("tag"))


def add_copies_map(stock):
    return stock.withColumn("copies", F.create_map(F.lit("leeds"), "leeds", F.lit("york"), "york"))
