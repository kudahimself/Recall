"""Prove the pruning: reference solution."""
import re


def write_layout(con, folder):
    """Write the sales table to Parquet under folder: a folder per sale_day, sorted by store_id inside."""
    con.execute(
        f"""
        COPY (SELECT * FROM sales ORDER BY sale_day, store_id)
        TO '{folder}' (FORMAT parquet, PARTITION_BY (sale_day), ROW_GROUP_SIZE 2048)
        """
    )


def groups_to_read(con, files, column, value):
    """The (file_name, row_group_id) pairs whose footer statistics say they may hold column = value."""
    return con.execute(
        """
        SELECT file_name, row_group_id
        FROM parquet_metadata(?)
        WHERE path_in_schema = ?
          AND CAST(stats_min AS BIGINT) <= ?
          AND CAST(stats_max AS BIGINT) >= ?
        ORDER BY file_name, row_group_id
        """,
        [files, column, value, value],
    ).fetchall()


def files_read(con, sql):
    """How many Parquet files DuckDB reads to run sql, from its EXPLAIN ANALYZE profile."""
    plan = "\n".join(row[1] for row in con.execute(f"EXPLAIN ANALYZE {sql}").fetchall())
    return sum(int(n) for n in re.findall(r"Total Files Read: (\d+)", plan))


def choose_layout(profile, max_partition_values=1000):
    """(partition column, sort column) for a table, from how its columns are filtered."""
    filtered = sorted(
        (c for c, p in profile.items() if p["filtered"] > 0),
        key=lambda c: (-profile[c]["filtered"], c),
    )
    partition = next((c for c in filtered if profile[c]["distinct"] <= max_partition_values), None)
    sort = next((c for c in filtered if c != partition), None)
    return partition, sort
