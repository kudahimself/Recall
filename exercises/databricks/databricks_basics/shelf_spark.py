"""Shelf stock on Spark: the first things a notebook does with `spark`.

Fill in the functions.
Each one gets the `spark` session (or a DataFrame) the way a Databricks notebook has it.
"""


def books_df(spark, rows):
    """A DataFrame of books with the columns book_id, title and year, from a list of tuples.

    Example row: (1, "Dune", 1965).
    """
    # TODO: use spark.createDataFrame with the three column names
    raise NotImplementedError


def modern_titles(books):
    """The titles of books published after 1900, sorted A to Z, as a plain Python list of strings.

    Do the filtering in Spark and bring back only the matching rows.
    """
    # TODO: filter the DataFrame, then collect the small result and sort it
    raise NotImplementedError


def books_per_decade(books):
    """How many books each decade has, as a dict such as {1960: 2, 1810: 1}.

    A decade is the year with its last digit cut off: 1965 -> 1960.
    Count in Spark with a groupBy; only the few result rows should reach Python.
    """
    # TODO: add a decade column, group by it, count, then collect the counts into a dict
    raise NotImplementedError


def save_as_table(spark, books, table):
    """Save the books as a table called `table`, replacing it if it exists, and return the table's format.

    The format is what DESCRIBE DETAIL reports, which is "delta" for a table made this way.
    """
    # TODO: write with mode("overwrite").saveAsTable, then read DESCRIBE DETAIL's format
    raise NotImplementedError


def row_count(books):
    """The number of rows, as an int."""
    # TODO: use the action that runs a job and returns the count to the driver
    raise NotImplementedError
