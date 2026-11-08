from datetime import date

import duckdb
import pytest

from late_sales import load_batch, newest_staged, touched_days

NOV1, NOV2, NOV3 = date(2026, 11, 1), date(2026, 11, 2), date(2026, 11, 3)


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("CREATE TABLE stg_sales (sale_id INTEGER, sale_date DATE, amount INTEGER, version INTEGER, ingested_on DATE)")
    con.execute("CREATE TABLE fact_sales (sale_id INTEGER, sale_date DATE, amount INTEGER, version INTEGER)")
    con.execute("CREATE TABLE daily_revenue (sale_date DATE, sales INTEGER, revenue INTEGER)")
    # Loaded on earlier nights.
    con.execute("INSERT INTO fact_sales VALUES (1, '2026-11-01', 12, 1), (2, '2026-11-01', 30, 1), (5, '2026-11-02', 20, 1)")
    con.execute("""
        INSERT INTO daily_revenue VALUES
          ('2026-10-31', 4, 70), ('2026-11-01', 2, 42), ('2026-11-02', 1, 20)
    """)
    # Tonight's batch: the lesson's staged rows.
    con.execute("""
        INSERT INTO stg_sales VALUES
          (1, '2026-11-01', 12, 1, '2026-11-02'),
          (2, '2026-11-01', 30, 1, '2026-11-02'),
          (2, '2026-11-01', 25, 2, '2026-11-02'),
          (3, '2026-11-02', 8, 1, '2026-11-03'),
          (3, '2026-11-02', 8, 1, '2026-11-03'),
          (4, '2026-11-01', 50, 1, '2026-11-03')
    """)
    yield con
    con.close()


def fact(con):
    return con.execute("SELECT sale_id, sale_date, amount, version FROM fact_sales ORDER BY sale_id").fetchall()


def revenue(con):
    return con.execute("SELECT sale_date, sales, revenue FROM daily_revenue ORDER BY sale_date").fetchall()


def restage(con, *rows):
    con.execute("DELETE FROM stg_sales")
    for row in rows:
        con.execute("INSERT INTO stg_sales VALUES (?, ?, ?, ?, '2026-11-04')", list(row))


def test_newest_staged_keeps_one_row_per_sale_by_version(con):
    assert newest_staged(con) == [
        (1, NOV1, 12, 1),
        (2, NOV1, 25, 2),
        (3, NOV2, 8, 1),
        (4, NOV1, 50, 1),
    ]


def test_newest_staged_ignores_arrival_order(con):
    restage(con, (7, "2026-11-03", 40, 3), (7, "2026-11-03", 35, 1), (7, "2026-11-03", 38, 2))
    assert newest_staged(con) == [(7, NOV3, 40, 3)]


def test_touched_days_are_event_dates_of_new_versions(con):
    # Sale 1 is the version fact_sales already holds, so it changes nothing.
    assert touched_days(con) == [NOV1, NOV2]


def test_load_batch_dedups_and_files_late_rows_under_their_event_date(con):
    assert load_batch(con) == [NOV1, NOV2]
    assert fact(con) == [
        (1, NOV1, 12, 1),
        (2, NOV1, 25, 2),
        (3, NOV2, 8, 1),
        (4, NOV1, 50, 1),
        (5, NOV2, 20, 1),
    ]
    assert revenue(con) == [
        (date(2026, 10, 31), 4, 70),
        (NOV1, 3, 87),
        (NOV2, 2, 28),
    ]


def test_loading_the_same_batch_again_changes_nothing(con):
    load_batch(con)
    once = (fact(con), revenue(con))
    assert load_batch(con) == []
    assert (fact(con), revenue(con)) == once


def test_an_older_copy_never_overwrites_a_newer_version(con):
    load_batch(con)
    restage(con, (2, "2026-11-01", 30, 1))
    assert touched_days(con) == []
    assert load_batch(con) == []
    assert (2, NOV1, 25, 2) in fact(con)


def test_a_correction_that_moves_a_sale_rebuilds_both_days(con):
    restage(con, (5, "2026-11-03", 20, 2))
    assert touched_days(con) == [NOV2, NOV3]
    assert load_batch(con) == [NOV2, NOV3]
    # 2026-11-02 had only sale 5, so its row goes; 2026-11-01 was not touched.
    assert revenue(con) == [
        (date(2026, 10, 31), 4, 70),
        (NOV1, 2, 42),
        (NOV3, 1, 20),
    ]
