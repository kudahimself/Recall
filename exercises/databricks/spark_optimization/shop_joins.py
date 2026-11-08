"""Broadcast joins, caching, partition counts and partition pruning: fill in the TODOs."""
import contextlib
import io


def plan_text(df):
    """Return what `df.explain()` prints, as a string (already written for you)."""
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        df.explain()
    return out.getvalue()


def join_shops(sales, shops):
    """Join every sale to its shop on `shop_id`, sending the small `shops` table to every executor."""
    # TODO: ask for a broadcast join, so the sales are not shuffled
    raise NotImplementedError


def join_strategy(df):
    """Return "broadcast" or "sort-merge": the join strategy in the physical plan of `df`.

    Raise ValueError when the plan holds neither.
    """
    # TODO: look for the join's name in plan_text(df)
    raise NotImplementedError


def cache_for_reuse(df):
    """Cache `df` so the next actions reuse it, fill the cache, and return `df`."""
    # TODO: mark it for caching, then run an action that computes every partition
    raise NotImplementedError


def release(df):
    """Free the cached rows of `df` once no action needs them."""
    # TODO
    raise NotImplementedError


def resize(df, n):
    """Return `df` in `n` partitions, shuffling only when it has to.

    Fewer partitions than now: merge them without a shuffle. More: shuffle into `n`.
    The same number: return `df` as it is. Raise ValueError when `n` is below 1.
    """
    # TODO: compare n with df.rdd.getNumPartitions() and pick the operation
    raise NotImplementedError


def spread_by(df, n, column):
    """Return `df` shuffled into `n` partitions so that all rows with the same `column` value share one."""
    # TODO
    raise NotImplementedError


def write_by_day(df, table, column):
    """Save `df` as the Delta table `table`, one directory per value of `column`, replacing any old table."""
    # TODO: overwrite the table, partitioned by the column
    raise NotImplementedError


def read_day(spark, table, column, value):
    """Return the rows of `table` whose `column` equals `value`, reading only that value's directory."""
    # TODO: a filter on the partition column is enough for Spark to skip the other directories
    raise NotImplementedError
