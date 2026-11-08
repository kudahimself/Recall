import datetime

import duckdb
import pytest

from order_day_load import load_day, merge_updates


@pytest.fixture
def con():
    con = duckdb.connect()
    for table in ("staging_orders", "fact_orders", "order_updates"):
        con.execute(f"CREATE TABLE {table} (order_id INTEGER, order_date DATE, amount INTEGER)")
    con.execute("""
        INSERT INTO fact_orders VALUES
          (98, '2026-10-31', 50), (99, '2026-10-31', 20)
    """)
    con.execute("""
        INSERT INTO staging_orders VALUES
          (101, '2026-11-01', 40), (102, '2026-11-01', 25), (103, '2026-11-01', 35),
          (97, '2026-10-31', 15),
          (95, '2026-10-30', 10), (96, '2026-10-30', 12)
    """)
    yield con
    con.close()


def fact(con):
    return con.execute("SELECT order_id, CAST(order_date AS VARCHAR), amount FROM fact_orders ORDER BY order_id").fetchall()


def day(con, d):
    return con.execute(
        "SELECT order_id, amount FROM fact_orders WHERE order_date = ? ORDER BY order_id", [d]
    ).fetchall()


def test_the_first_run_loads_the_day_and_counts_its_rows(con):
    assert load_day(con, "2026-11-01") == 3
    assert day(con, "2026-11-01") == [(101, 40), (102, 25), (103, 35)]


def test_a_second_run_leaves_the_table_identical(con):
    load_day(con, "2026-11-01")
    once = fact(con)
    assert load_day(con, "2026-11-01") == 3
    assert fact(con) == once
    load_day(con, "2026-11-01")
    assert fact(con) == once


def test_other_days_are_untouched_even_with_a_late_row_in_staging(con):
    load_day(con, "2026-11-01")
    # The late order 97 for 2026-10-31 sits in staging, but this run is for 2026-11-01.
    assert day(con, "2026-10-31") == [(98, 50), (99, 20)]
    assert day(con, "2026-10-30") == []


def test_a_backfill_lands_in_its_own_day_whatever_today_is(con):
    assert load_day(con, datetime.date(2026, 10, 30)) == 2
    assert day(con, "2026-10-30") == [(95, 10), (96, 12)]
    assert day(con, "2026-11-01") == []
    assert day(con, "2026-10-31") == [(98, 50), (99, 20)]


def test_a_day_with_nothing_staged_ends_up_empty(con):
    con.execute("INSERT INTO fact_orders VALUES (90, '2026-11-02', 99)")
    assert load_day(con, "2026-11-02") == 0
    assert day(con, "2026-11-02") == []
    assert day(con, "2026-10-31") == [(98, 50), (99, 20)]


def test_the_rerun_picks_up_a_corrected_staging_day(con):
    load_day(con, "2026-11-01")
    con.execute("UPDATE staging_orders SET amount = 45 WHERE order_id = 101")
    con.execute("DELETE FROM staging_orders WHERE order_id = 103")
    assert load_day(con, "2026-11-01") == 2
    assert day(con, "2026-11-01") == [(101, 45), (102, 25)]


def test_a_crash_after_the_delete_leaves_the_day_as_it_was(con):
    load_day(con, "2026-11-01")
    before = fact(con)
    con.execute("UPDATE staging_orders SET amount = 0")

    def crash():
        raise RuntimeError("worker lost")

    with pytest.raises(RuntimeError, match="worker lost"):
        load_day(con, "2026-11-01", crash_after_delete=crash)
    assert fact(con) == before
    # The connection is usable again: the next run commits as normal.
    assert load_day(con, "2026-11-01") == 3
    assert day(con, "2026-11-01") == [(101, 0), (102, 0), (103, 0)]


def test_merge_updates_changes_and_adds_by_key(con):
    load_day(con, "2026-11-01")
    con.execute("INSERT INTO order_updates VALUES (102, '2026-11-01', 30), (104, '2026-11-02', 60)")
    assert merge_updates(con) == 2
    assert fact(con) == [
        (98, "2026-10-31", 50), (99, "2026-10-31", 20),
        (101, "2026-11-01", 40), (102, "2026-11-01", 30), (103, "2026-11-01", 35),
        (104, "2026-11-02", 60),
    ]


def test_merge_updates_twice_is_the_same_as_once(con):
    con.execute("INSERT INTO order_updates VALUES (98, '2026-10-31', 55), (105, '2026-11-03', 70)")
    merge_updates(con)
    once = fact(con)
    merge_updates(con)
    assert fact(con) == once
    assert len(once) == 3
