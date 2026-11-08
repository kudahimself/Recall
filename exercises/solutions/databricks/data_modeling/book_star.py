"""Reference solution for book_star.py: look only after your own tests pass."""
from pyspark.sql import functions as F
from pyspark.sql import Window


def build_dim_book(books):
    return books.select(
        F.row_number().over(Window.orderBy("book_code")).cast("bigint").alias("book_sk"),
        "book_code", "title", "genre",
    )


def build_fact_sale(lines, dim_book):
    return (
        lines.join(dim_book.select("book_code", "book_sk"), "book_code")
        .select("receipt_id", "book_sk", "qty", (F.col("qty") * F.col("price")).alias("amount"))
    )


def _by_genre(fact_sale, dim_book):
    return (
        fact_sale.join(dim_book, "book_sk")
        .groupBy("genre")
        .agg(F.sum("qty").alias("copies"), F.sum("amount").alias("revenue"))
    )


def sales_by_genre(fact_sale, dim_book):
    rows = _by_genre(fact_sale, dim_book).orderBy("genre").collect()
    return [(r["genre"], r["copies"], r["revenue"]) for r in rows]


def average_price_by_genre(fact_sale, dim_book):
    rows = _by_genre(fact_sale, dim_book).collect()
    return {r["genre"]: round(r["revenue"] / r["copies"], 2) for r in rows}


def build_fact_receipt(lines, receipts):
    per_receipt = lines.groupBy("receipt_id").agg(
        F.sum("qty").alias("books"),
        F.sum(F.col("qty") * F.col("price")).alias("items_amount"),
    )
    return (
        receipts.join(per_receipt, "receipt_id", "left")
        .select(
            "receipt_id",
            F.coalesce("books", F.lit(0)).cast("bigint").alias("books"),
            F.coalesce("items_amount", F.lit(0)).cast("bigint").alias("items_amount"),
            "shipping",
        )
    )
