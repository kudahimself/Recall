import datetime

import duckdb
import pytest

from product_marks import load_full, load_incremental, missed_deletes


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("CREATE TABLE src_products (product_id INTEGER, price INTEGER, updated_at TIMESTAMP)")
    con.execute("CREATE TABLE dim_product (product_id INTEGER, price INTEGER)")
    con.execute("CREATE TABLE load_state (tbl VARCHAR, last_loaded TIMESTAMP)")
    con.execute("""
        INSERT INTO src_products VALUES
          (1, 12, '2026-10-20 10:00'), (2, 30, '2026-11-01 09:30'), (3, 8, '2026-11-01 11:15')
    """)
    con.execute("INSERT INTO dim_product VALUES (1, 12), (2, 25)")
    con.execute("INSERT INTO load_state VALUES ('products', '2026-11-01 08:00')")
    yield con
    con.close()


def dim(con):
    return con.execute("SELECT product_id, price FROM dim_product ORDER BY product_id, price").fetchall()


def mark(con):
    return con.execute("SELECT last_loaded FROM load_state WHERE tbl = 'products'").fetchone()[0]


def test_incremental_reads_only_rows_past_the_mark(con):
    assert load_incremental(con) == 2
    assert dim(con) == [(1, 12), (2, 30), (3, 8)]


def test_changed_rows_replace_their_old_versions(con):
    load_incremental(con)
    ids = [r[0] for r in dim(con)]
    assert ids == sorted(set(ids))


def test_the_mark_is_the_newest_change_read_not_the_clock(con):
    load_incremental(con)
    assert mark(con) == datetime.datetime(2026, 11, 1, 11, 15)


def test_a_run_with_nothing_new_keeps_the_mark(con):
    load_incremental(con)
    assert load_incremental(con) == 0
    assert mark(con) == datetime.datetime(2026, 11, 1, 11, 15)
    assert dim(con) == [(1, 12), (2, 30), (3, 8)]


def test_a_row_that_commits_after_the_run_is_still_found(con):
    load_incremental(con)
    # Product 4 changed at 11:20 on 2026-11-01 but its transaction committed after the run.
    # A mark set to the time the job ran would skip it for good.
    con.execute("INSERT INTO src_products VALUES (4, 19, '2026-11-01 11:20')")
    assert load_incremental(con) == 1
    assert dim(con) == [(1, 12), (2, 30), (3, 8), (4, 19)]
    assert mark(con) == datetime.datetime(2026, 11, 1, 11, 20)


def test_a_crash_before_the_mark_moves_leaves_rows_and_mark_as_they_were(con):
    def crash():
        raise RuntimeError("lost the connection")

    with pytest.raises(RuntimeError):
        load_incremental(con, crash_before_mark=crash)
    assert dim(con) == [(1, 12), (2, 25)]
    assert mark(con) == datetime.datetime(2026, 11, 1, 8, 0)
    assert load_incremental(con) == 2
    assert dim(con) == [(1, 12), (2, 30), (3, 8)]


def test_incremental_runs_never_see_a_delete_but_a_full_reload_does(con):
    load_incremental(con)
    con.execute("DELETE FROM src_products WHERE product_id = 1")
    load_incremental(con)
    assert missed_deletes(con) == [1]
    assert load_full(con) == 2
    assert dim(con) == [(2, 30), (3, 8)]
    assert missed_deletes(con) == []


def test_full_reload_sets_the_mark_for_the_next_incremental_run(con):
    load_full(con)
    assert dim(con) == [(1, 12), (2, 30), (3, 8)]
    assert mark(con) == datetime.datetime(2026, 11, 1, 11, 15)
    assert load_incremental(con) == 0
