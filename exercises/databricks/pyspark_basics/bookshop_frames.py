"""Bookshop frames: select, filter and withColumn on a small price list.

Fill in the functions.
Remember that a DataFrame never changes: every helper returns a new one.
"""


def books_df(spark, rows):
    """A DataFrame with the columns title, price and pages, from a list of tuples.

    The price arrives as text, for example ("Dune", "12.50", 412).
    """
    # TODO: use spark.createDataFrame with the three column names
    raise NotImplementedError


def parse_prices(books):
    """The same DataFrame with `price` turned from text into a double.

    The columns keep their names and their order.
    """
    # TODO: replace the price column with a cast version of itself
    raise NotImplementedError


def cheap_books(books, limit):
    """Only the columns title and price, for books whose price is below `limit`.

    `price` is already a double here.
    """
    # TODO: pick the columns and keep the matching rows
    raise NotImplementedError


def add_length_band(books):
    """Add a column `band`: "long" for books of 300 pages or more, "short" otherwise.

    Every original column stays.
    """
    # TODO: build a conditional column expression with when(...).otherwise(...)
    raise NotImplementedError


def add_price_with_vat(books):
    """Add a column `price_inc_vat`: the price plus 20 percent VAT.

    `price` is already a double here.
    """
    # TODO: add a column computed from price
    raise NotImplementedError
