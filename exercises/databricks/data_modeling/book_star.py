"""Starter: a star schema for bookshop sales, one dimension and two facts. Fill in each TODO.

Every function takes and returns Spark DataFrames (or plain Python values), so nothing here
needs a table: pyspark.sql.functions and Window are all you need.
"""
from pyspark.sql import functions as F  # noqa: F401
from pyspark.sql import Window  # noqa: F401


def build_dim_book(books):
    """Return the book dimension: book_sk, book_code, title, genre.

    `books` has one row per book (book_code, title, genre). book_sk is the surrogate key,
    1, 2, 3 ... in book_code order, and book_code stays beside it as the natural key.
    """
    # TODO: number the books in book_code order
    raise NotImplementedError


def build_fact_sale(lines, dim_book):
    """Return the sales fact, one row per book on a receipt: receipt_id, book_sk, qty, amount.

    `lines` has the source rows (receipt_id, book_code, qty, price). The fact keeps only keys
    and measures true at its grain: book_sk in place of book_code, and amount = qty * price.
    """
    # TODO: look up each line's surrogate key in the dimension
    raise NotImplementedError


def sales_by_genre(fact_sale, dim_book):
    """Return [(genre, copies, revenue), ...] in genre order, from a star join on book_sk."""
    # TODO
    raise NotImplementedError


def average_price_by_genre(fact_sale, dim_book):
    """Return {genre: average price paid per copy}, rounded to 2 places.

    An average is non-additive: work it out from its additive parts, revenue and copies,
    not by averaging the lines' prices.
    """
    # TODO
    raise NotImplementedError


def build_fact_receipt(lines, receipts):
    """Return a fact at the receipt grain: receipt_id, books, items_amount, shipping.

    `receipts` has one row per receipt (receipt_id, shipping). books is the receipt's copies
    and items_amount the sum of qty * price over its lines; shipping is the receipt's own charge.
    Every receipt in `receipts` gets one row.
    """
    # TODO: bring the lines to the receipt grain before they meet the shipping charge
    raise NotImplementedError
