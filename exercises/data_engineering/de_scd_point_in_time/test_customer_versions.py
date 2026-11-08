from datetime import date

import duckdb
import pytest

from customer_versions import apply_snapshot, revenue_by_city, stamp_sales, version_on

OPEN = date(9999, 12, 31)


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("""
        CREATE TABLE dim_customer (customer_key INTEGER, customer_id VARCHAR, city VARCHAR, email VARCHAR,
                                   valid_from DATE, valid_to DATE)
    """)
    con.execute("CREATE TABLE source_customers (customer_id VARCHAR, city VARCHAR, email VARCHAR)")
    con.execute("""
        CREATE TABLE fact_sales (sale_id INTEGER, customer_id VARCHAR, sale_date DATE, amount INTEGER,
                                 customer_key INTEGER)
    """)
    con.execute("""
        INSERT INTO dim_customer VALUES
          (1, 'C-07', 'Leeds', 'c7@old.example', '2025-01-01', '2026-06-01'),
          (2, 'C-07', 'York', 'c7@old.example', '2026-06-01', '9999-12-31'),
          (3, 'C-09', 'Leeds', 'c9@example.org', '2025-03-01', '9999-12-31')
    """)
    con.execute("""
        INSERT INTO source_customers VALUES
          ('C-07', 'York', 'c7@new.example'),
          ('C-09', 'York', 'c9@example.org'),
          ('C-11', 'Hull', 'c11@example.org')
    """)
    con.execute("""
        INSERT INTO fact_sales VALUES
          (1, 'C-07', '2026-03-10', 40, NULL),
          (2, 'C-07', '2026-06-01', 25, NULL),
          (3, 'C-07', '2026-09-15', 30, NULL),
          (4, 'C-09', '2026-07-02', 50, NULL)
    """)
    yield con
    con.close()


def dim(con):
    return con.execute("SELECT * FROM dim_customer ORDER BY customer_key").fetchall()


def keys(con):
    return con.execute("SELECT sale_id, customer_key FROM fact_sales ORDER BY sale_id").fetchall()


def test_apply_snapshot_closes_changed_rows_and_adds_versions(con):
    assert apply_snapshot(con, "2026-10-01") == 2
    assert dim(con) == [
        (1, "C-07", "Leeds", "c7@new.example", date(2025, 1, 1), date(2026, 6, 1)),
        (2, "C-07", "York", "c7@new.example", date(2026, 6, 1), OPEN),
        (3, "C-09", "Leeds", "c9@example.org", date(2025, 3, 1), date(2026, 10, 1)),
        (4, "C-09", "York", "c9@example.org", date(2026, 10, 1), OPEN),
        (5, "C-11", "Hull", "c11@example.org", date(2026, 10, 1), OPEN),
    ]


def test_applying_the_same_snapshot_again_adds_nothing(con):
    apply_snapshot(con, "2026-10-01")
    once = dim(con)
    assert apply_snapshot(con, "2026-10-01") == 0
    assert dim(con) == once


def test_a_later_snapshot_adds_a_third_version(con):
    apply_snapshot(con, "2026-10-01")
    con.execute("UPDATE source_customers SET city = 'Leeds' WHERE customer_id = 'C-07'")
    assert apply_snapshot(con, "2026-11-01") == 1
    rows = [r for r in dim(con) if r[1] == "C-07"]
    assert [(r[0], r[2], r[4], r[5]) for r in rows] == [
        (1, "Leeds", date(2025, 1, 1), date(2026, 6, 1)),
        (2, "York", date(2026, 6, 1), date(2026, 11, 1)),
        (6, "Leeds", date(2026, 11, 1), OPEN),
    ]


def test_version_on_uses_half_open_intervals(con):
    assert version_on(con, "C-07", "2026-05-31") == 1
    assert version_on(con, "C-07", "2026-06-01") == 2
    assert version_on(con, "C-07", "2030-01-01") == 2
    assert version_on(con, "C-07", "2024-12-31") is None
    assert version_on(con, "C-99", "2026-06-01") is None


def test_stamp_sales_picks_the_version_valid_on_each_sale_date(con):
    assert stamp_sales(con) == 4
    # Sale 1 happened in Leeds: the current row would put it in York.
    assert keys(con) == [(1, 1), (2, 2), (3, 2), (4, 3)]
    assert stamp_sales(con) == 0


def test_a_late_sale_gets_the_version_of_its_own_day(con):
    stamp_sales(con)
    apply_snapshot(con, "2026-10-01")
    con.execute("""
        INSERT INTO fact_sales VALUES
          (5, 'C-09', '2026-09-20', 15, NULL),
          (6, 'C-09', '2026-10-05', 20, NULL),
          (7, 'C-99', '2026-10-05', 10, NULL)
    """)
    assert stamp_sales(con) == 2
    assert keys(con)[4:] == [(5, 3), (6, 4), (7, None)]


def test_revenue_by_city_reports_each_sale_where_it_happened(con):
    stamp_sales(con)
    assert revenue_by_city(con) == [("Leeds", 90), ("York", 55)]
