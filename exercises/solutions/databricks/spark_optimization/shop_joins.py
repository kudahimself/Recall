"""Reference solution: broadcast joins, caching, partition counts and partition pruning."""
import contextlib
import io

from pyspark.sql import functions as F


def plan_text(df):
    """Return what `df.explain()` prints, as a string (already written for you)."""
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        df.explain()
    return out.getvalue()


def join_shops(sales, shops):
    """Join every sale to its shop on `shop_id`, sending the small `shops` table to every executor."""
    return sales.join(F.broadcast(shops), "shop_id")


def join_strategy(df):
    """Return "broadcast" or "sort-merge": the join strategy in the physical plan of `df`."""
    plan = plan_text(df)
    if "BroadcastHashJoin" in plan:
        return "broadcast"
    if "SortMergeJoin" in plan:
        return "sort-merge"
    raise ValueError("the plan holds neither a broadcast nor a sort-merge join")


def cache_for_reuse(df):
    """Cache `df` so the next actions reuse it, fill the cache, and return `df`."""
    df.cache()
    df.count()
    return df


def release(df):
    """Free the cached rows of `df` once no action needs them."""
    df.unpersist()


def resize(df, n):
    """Return `df` in `n` partitions, shuffling only when it has to.

    Fewer partitions than now: merge them without a shuffle. More: shuffle into `n`.
    The same number: return `df` as it is. Raise ValueError when `n` is below 1.
    """
    if n < 1:
        raise ValueError("a DataFrame needs at least one partition")
    current = df.rdd.getNumPartitions()
    if n < current:
        return df.coalesce(n)
    if n > current:
        return df.repartition(n)
    return df


def spread_by(df, n, column):
    """Return `df` shuffled into `n` partitions so that all rows with the same `column` value share one."""
    return df.repartition(n, column)


def write_by_day(df, table, column):
    """Save `df` as the Delta table `table`, one directory per value of `column`, replacing any old table."""
    df.write.mode("overwrite").partitionBy(column).saveAsTable(table)


def read_day(spark, table, column, value):
    """Return the rows of `table` whose `column` equals `value`, reading only that value's directory."""
    return spark.table(table).where(F.col(column) == value)
