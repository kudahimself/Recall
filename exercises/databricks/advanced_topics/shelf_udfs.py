"""Python, pandas and SQL user-defined functions, and when to skip them: fill in the TODOs.

The tests import this module before Spark starts, so give each UDF its return type as a
type object, such as StringType() or DoubleType() from pyspark.sql.types: a type string
such as "string" needs a running Spark session to read it.
"""
import pandas as pd


def shelf(title):
    """A Python UDF: the first two letters of a title in capitals, and None for a NULL title.

    The tests call it on a column, like a built-in: df.select(shelf("title")).
    """
    # TODO: make this a Python UDF that returns a string, and handle a NULL title
    raise NotImplementedError


def shelf_builtin(column):
    """The same shelf code as a Column built from functions in pyspark.sql.functions, with no UDF.

    `column` is a column name such as "title".
    """
    # TODO
    raise NotImplementedError


def late_fee(days: pd.Series) -> pd.Series:
    """A pandas UDF: half a pound for each day past 14, never below 0, for a whole batch at once.

    It returns a double for each row, and the tests call it on a column: late_fee("days").
    """
    # TODO: make this a pandas UDF from a Series of days to a Series of fees
    raise NotImplementedError


def register_shelf(spark):
    """Make `shelf` callable from SQL as `shelf_sql(title)` in this session."""
    # TODO
    raise NotImplementedError


def create_days_late(spark):
    """Create the SQL function `days_late(days INT) RETURNS INT`: days past 14, never below 0.

    Make it a temporary function, so it lasts only for this Spark session.
    """
    # TODO: CREATE OR REPLACE TEMPORARY FUNCTION ... RETURNS INT RETURN ...
    raise NotImplementedError


def fee_share(df):
    """Add a `share` column: each row's `fee` divided by the largest `fee` of the whole DataFrame.

    The largest fee must be the largest of every row, not of one batch.
    """
    # TODO
    raise NotImplementedError
