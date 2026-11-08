"""Prove the pruning: lay a table out in Parquet, then show how much of it a query can skip.

The tests open an in-memory DuckDB database with this table and pass you its connection:
  sales(sale_id BIGINT, sale_day DATE, store_id BIGINT, amount BIGINT)   60,000 rows over 6 days,
      in arrival order: each stretch of rows mixes every day and every store
They also write Parquet files of it to a temporary folder for the functions that read files.

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_pruned_sales.py pass.
Run them from this folder with: pytest
"""


def write_layout(con, folder):
    """Write the sales table to Parquet under folder: a folder per sale_day, sorted by store_id inside.

    Use folders named the Hive way (sale_day=2026-11-01), so a filter on sale_day can skip them
    from their names, and row groups of 2,048 rows, so each file has several groups whose
    store_id statistics are narrow.
    """
    # TODO
    raise NotImplementedError


def groups_to_read(con, files, column, value):
    """The (file_name, row_group_id) pairs whose footer statistics say they may hold column = value.

    files is a path or a glob such as "/tmp/x/*/*.parquet"; column is a whole-number column.
    A row group can be skipped when value is below its min or above its max for that column.
    Return the pairs that cannot be skipped, sorted.
    DuckDB reads the footers with parquet_metadata(files): a row per row group and column, with
    file_name, row_group_id, path_in_schema (the column), and stats_min and stats_max as text.
    """
    # TODO
    raise NotImplementedError


def files_read(con, sql):
    """How many Parquet files DuckDB reads to run sql, from its EXPLAIN ANALYZE profile.

    Run "EXPLAIN ANALYZE " + sql: the profile is the text in the second column of the row it returns,
    and each Parquet scan in it says "Total Files Read: N".
    """
    # TODO
    raise NotImplementedError


def choose_layout(profile, max_partition_values=1000):
    """(partition column, sort column) for a table, from how its columns are filtered.

    profile maps each column to {"distinct": number of distinct values,
    "filtered": the share of queries that filter on it, 0 to 1}.
    Partition by the most filtered column with at most max_partition_values distinct values;
    sort by the most filtered of the other filtered columns. Ties go to the name that sorts first.
    A column no query filters is never chosen, and either part is None when nothing fits.
    """
    # TODO
    raise NotImplementedError
