import glob
import os

import duckdb
import pytest

from pruned_sales import choose_layout, files_read, groups_to_read, write_layout

DAYS = [f"2026-11-0{d}" for d in range(1, 7)]


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("""
        CREATE TABLE sales AS
        SELECT i AS sale_id,
               DATE '2026-11-01' + CAST(i % 6 AS INTEGER) AS sale_day,
               i * 7919 % 1000 AS store_id,
               i % 17 AS amount
        FROM range(60000) AS t(i)
    """)
    yield con
    con.close()


@pytest.fixture
def layouts(con, tmp_path):
    """The same rows twice: one file in arrival order, and a folder per day sorted by store_id."""
    arrival = str(tmp_path / "arrival.parquet")
    con.execute(f"COPY sales TO '{arrival}' (FORMAT parquet, ROW_GROUP_SIZE 2048)")
    sorted_dir = tmp_path / "by_day"
    con.execute(f"""
        COPY (SELECT * FROM sales ORDER BY sale_day, store_id)
        TO '{sorted_dir}' (FORMAT parquet, PARTITION_BY (sale_day), ROW_GROUP_SIZE 2048)
    """)
    return arrival, str(sorted_dir / "*" / "*.parquet")


def test_write_layout_makes_a_folder_per_day(con, tmp_path):
    folder = tmp_path / "sales"
    write_layout(con, str(folder))
    assert sorted(os.listdir(folder)) == [f"sale_day={d}" for d in DAYS]
    total = con.execute(f"SELECT COUNT(*) FROM read_parquet('{folder}/*/*.parquet')").fetchone()[0]
    assert total == 60000


def test_write_layout_sorts_each_file_by_store_and_keeps_groups_small(con, tmp_path):
    folder = tmp_path / "sales"
    write_layout(con, str(folder))
    for f in glob.glob(str(folder / "*" / "*.parquet")):
        stores = [r[0] for r in con.execute(
            f"SELECT store_id FROM read_parquet('{f}', file_row_number = true) ORDER BY file_row_number"
        ).fetchall()]
        assert stores == sorted(stores), f"{f} is not sorted by store_id"
    groups = con.execute(f"""
        SELECT COUNT(*), MAX(row_group_num_rows)
        FROM parquet_metadata('{folder}/*/*.parquet') WHERE path_in_schema = 'store_id'
    """).fetchone()
    assert groups[0] >= 24 and groups[1] <= 2048


def test_in_arrival_order_no_row_group_can_be_skipped(con, layouts):
    arrival, _ = layouts
    groups = groups_to_read(con, arrival, "store_id", 7)
    assert len(groups) == 30
    assert groups == sorted(groups)


def test_sorted_by_store_only_one_group_per_file_can_hold_it(con, layouts):
    _, by_day = layouts
    files = sorted(glob.glob(by_day))
    assert groups_to_read(con, by_day, "store_id", 7) == [(f, 0) for f in files]
    assert len(groups_to_read(con, by_day, "store_id", 990)) == 6
    assert groups_to_read(con, by_day, "store_id", 5000) == []


def test_files_read_proves_partition_pruning(con, layouts):
    _, by_day = layouts
    scan = f"SELECT SUM(amount) FROM read_parquet('{by_day}', hive_partitioning = true)"
    assert files_read(con, f"{scan} WHERE sale_day = DATE '2026-11-03'") == 1
    assert files_read(con, f"{scan} WHERE sale_day >= DATE '2026-11-05'") == 2
    assert files_read(con, f"{scan} WHERE store_id = 7") == 6


def test_files_read_on_a_single_file(con, layouts):
    arrival, _ = layouts
    assert files_read(con, f"SELECT COUNT(*) FROM '{arrival}' WHERE sale_day = DATE '2026-11-03'") == 1


def test_choose_layout_partitions_by_few_values_and_sorts_by_many():
    profile = {
        "sale_day": {"distinct": 730, "filtered": 0.9},
        "user_id": {"distinct": 2_000_000, "filtered": 0.6},
        "store_id": {"distinct": 5000, "filtered": 0.4},
        "amount": {"distinct": 10000, "filtered": 0.0},
    }
    assert choose_layout(profile) == ("sale_day", "user_id")


def test_choose_layout_never_partitions_by_a_column_with_millions_of_values():
    profile = {
        "user_id": {"distinct": 2_000_000, "filtered": 0.95},
        "region": {"distinct": 12, "filtered": 0.5},
    }
    assert choose_layout(profile) == ("region", "user_id")
    assert choose_layout({"user_id": {"distinct": 2_000_000, "filtered": 0.95}}) == (None, "user_id")
    assert choose_layout({"notes": {"distinct": 50, "filtered": 0.0}}) == (None, None)


def test_choose_layout_breaks_ties_by_name():
    profile = {
        "country": {"distinct": 200, "filtered": 0.5},
        "channel": {"distinct": 5, "filtered": 0.5},
    }
    assert choose_layout(profile) == ("channel", "country")
    assert choose_layout(profile, max_partition_values=3) == (None, "channel")
