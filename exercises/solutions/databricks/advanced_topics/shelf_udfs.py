"""Reference solution: Python, pandas and SQL user-defined functions, and when to skip them."""
import pandas as pd
from pyspark.sql import Window
from pyspark.sql import functions as F
from pyspark.sql.types import DoubleType, StringType


@F.udf(StringType())
def shelf(title):
    """A Python UDF: the first two letters of a title in capitals, and None for a NULL title."""
    return None if title is None else title[:2].upper()


def shelf_builtin(column):
    """The same shelf code as a Column built from functions in pyspark.sql.functions, with no UDF."""
    return F.upper(F.substring(column, 1, 2))


@F.pandas_udf(DoubleType())
def late_fee(days: pd.Series) -> pd.Series:
    """A pandas UDF: half a pound for each day past 14, never below 0, for a whole batch at once."""
    return (days - 14).clip(lower=0) * 0.5


def register_shelf(spark):
    """Make `shelf` callable from SQL as `shelf_sql(title)` in this session."""
    spark.udf.register("shelf_sql", shelf)


def create_days_late(spark):
    """Create the SQL function `days_late(days INT) RETURNS INT`: days past 14, never below 0."""
    spark.sql(
        "CREATE OR REPLACE TEMPORARY FUNCTION days_late(days INT) RETURNS INT "
        "RETURN GREATEST(days - 14, 0)"
    )


def fee_share(df):
    """Add a `share` column: each row's `fee` divided by the largest `fee` of the whole DataFrame."""
    return df.withColumn("share", F.col("fee") / F.max("fee").over(Window.partitionBy()))
