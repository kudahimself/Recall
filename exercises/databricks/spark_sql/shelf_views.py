"""Spark SQL constructs: temp views, CAST, CASE, PIVOT.

Some functions run Python against a view, some return SQL text that the tests run with spark.sql.
Spark 4 has ANSI mode on, so a plain CAST of bad text raises an error.
"""


def register_sales(sales):
    """Make the DataFrame `sales` queryable in SQL as a temp view called raw_sales."""
    # TODO: give the DataFrame a name that spark.sql can read
    raise NotImplementedError


def clean_sales_sql() -> str:
    """Read the raw_sales view (book, branch, copies as text): (book, branch, copies).

    copies must be an INT, and text that is not a number, like 'n/a', becomes NULL instead of failing.
    """
    # TODO: a cast that returns NULL on bad input
    raise NotImplementedError


def stock_band_sql() -> str:
    """Read the stock view (book, copies int): (book, band).

    band is 'high' for more than 100 copies, 'mid' for 20 to 100, and 'low' below 20.
    """
    # TODO: a CASE with branches checked in order
    raise NotImplementedError


def copies_by_branch_sql() -> str:
    """Read the branch_stock view (book, branch, copies): (book, North, South).

    One row per book, with the total copies in the North and South branches as columns.
    """
    # TODO: turn the values of the branch column into columns
    raise NotImplementedError


def define_low_stock_view(spark):
    """In SQL, create a temp view low_stock holding the rows of the stock view with fewer than 10 copies."""
    # TODO: run a CREATE OR REPLACE TEMP VIEW statement
    raise NotImplementedError
