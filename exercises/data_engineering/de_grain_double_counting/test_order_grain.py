import duckdb
import pytest

from order_grain import customer_totals, join_row_counts, key_is_unique, monthly_buyers, monthly_conversion


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("CREATE TABLE orders (order_id INTEGER, customer_id VARCHAR, order_date DATE, shipping INTEGER)")
    con.execute("CREATE TABLE order_lines (order_id INTEGER, line_no INTEGER, amount INTEGER)")
    con.execute("CREATE TABLE daily_traffic (day DATE, visits INTEGER, orders INTEGER, conversion DOUBLE)")
    con.execute("CREATE TABLE daily_buyers (day DATE, buyers INTEGER)")
    con.execute("""
        INSERT INTO orders VALUES
          (1, 'c1', '2026-10-30', 5),
          (2, 'c2', '2026-10-31', 8),
          (5, 'c1', '2026-10-31', 5),
          (3, 'c1', '2026-11-01', 4),
          (4, 'c2', '2026-11-02', 3)
    """)
    con.execute("""
        INSERT INTO order_lines VALUES
          (1, 1, 20), (1, 2, 30), (2, 1, 15), (3, 1, 10), (3, 2, 5), (3, 3, 25), (5, 1, 12)
    """)
    con.execute("""
        INSERT INTO daily_traffic VALUES
          ('2026-10-30', 100, 10, 0.1), ('2026-10-31', 900, 45, 0.05),
          ('2026-11-01', 200, 20, 0.1), ('2026-11-02', 50, 10, 0.2)
    """)
    con.execute("""
        INSERT INTO daily_buyers VALUES
          ('2026-10-30', 1), ('2026-10-31', 2), ('2026-11-01', 1), ('2026-11-02', 1)
    """)
    yield con
    con.close()


def test_key_is_unique_checks_the_stated_grain(con):
    assert key_is_unique(con, "order_lines", ["order_id", "line_no"]) is True
    assert key_is_unique(con, "order_lines", ["order_id"]) is False
    assert key_is_unique(con, "orders", ["order_id"]) is True
    assert key_is_unique(con, "orders", ["customer_id"]) is False


def test_key_is_unique_sees_a_duplicate_row(con):
    con.execute("INSERT INTO order_lines VALUES (2, 1, 15)")
    assert key_is_unique(con, "order_lines", ["order_id", "line_no"]) is False


def test_join_row_counts_shows_the_fan_out(con):
    assert join_row_counts(con) == (5, 7)


def test_customer_totals_count_each_fee_once(con):
    # Summed after the join, c1's shipping would be 5 + 5 + 4 + 4 + 4 + 5 = 27,
    # and SUM(DISTINCT shipping) would drop one of its two 5 fees and give 9.
    assert customer_totals(con) == [("c1", 3, 14, 102), ("c2", 2, 11, 15)]


def test_customer_totals_keep_an_order_with_no_lines(con):
    con.execute("INSERT INTO orders VALUES (6, 'c3', '2026-11-02', 7)")
    assert customer_totals(con)[-1] == ("c3", 1, 7, 0)


def test_monthly_conversion_recomputes_the_ratio_from_its_parts(con):
    # Averaging the daily rates would give 0.075 and 0.15.
    result = monthly_conversion(con)
    assert [row[:3] for row in result] == [("2026-10", 1000, 55), ("2026-11", 250, 30)]
    assert [row[3] for row in result] == [pytest.approx(0.055), pytest.approx(0.12)]


def test_monthly_buyers_counts_each_customer_once(con):
    # Summing daily_buyers would give 3 for October: c1 ordered on two days.
    assert monthly_buyers(con) == [("2026-10", 2), ("2026-11", 2)]
