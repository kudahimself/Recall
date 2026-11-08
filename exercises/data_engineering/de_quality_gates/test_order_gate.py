import duckdb
import pytest

from order_gate import blocking_failures, row_count_warning, run_gate


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("CREATE TABLE staging_orders (order_id INTEGER, customer_id INTEGER, status VARCHAR, amount INTEGER)")
    con.execute("CREATE TABLE dim_customers (customer_id INTEGER, segment VARCHAR)")
    con.execute("CREATE TABLE fact_orders (order_id INTEGER, customer_id INTEGER, status VARCHAR, amount INTEGER)")
    con.execute("INSERT INTO dim_customers VALUES (11, 'retail'), (12, 'business'), (13, 'retail'), (14, 'retail')")
    con.execute("INSERT INTO fact_orders VALUES (101, 11, 'paid', 30), (102, 14, 'refunded', 10)")
    # The lesson's batch: order 203 has no customer, 204 an unexpected status, 205 an unknown customer.
    con.execute("""
        INSERT INTO staging_orders VALUES
          (201, 11, 'paid', 40), (202, 12, 'paid', 25), (203, NULL, 'paid', 30),
          (204, 13, 'shipped', 15), (205, 19, 'paid', 60), (206, 12, 'refunded', 20)
    """)
    yield con
    con.close()


def fact(con):
    return con.execute("SELECT * FROM fact_orders ORDER BY order_id").fetchall()


def staged(con):
    return con.execute("SELECT COUNT(*) FROM staging_orders").fetchone()[0]


def fix_batch(con):
    con.execute("UPDATE staging_orders SET customer_id = 13 WHERE order_id = 203")
    con.execute("UPDATE staging_orders SET status = 'paid' WHERE order_id = 204")
    con.execute("UPDATE staging_orders SET customer_id = 14 WHERE order_id = 205")


def test_blocking_failures_count_the_rows_breaking_each_rule(con):
    assert blocking_failures(con) == {
        "order_id unique": 0,
        "customer_id not null": 1,
        "status accepted": 1,
        "customer exists": 1,
    }


def test_duplicates_and_null_statuses_fail_too(con):
    con.execute("INSERT INTO staging_orders VALUES (202, 12, 'paid', 25), (207, 11, NULL, 5)")
    failures = blocking_failures(con)
    assert failures["order_id unique"] == 2
    assert failures["status accepted"] == 2
    assert failures["customer exists"] == 1


def test_row_count_warning(con):
    assert row_count_warning(con, normal_rows=6, tolerance=0.5) is None
    assert row_count_warning(con, normal_rows=10, tolerance=0.5) is None
    assert row_count_warning(con, normal_rows=100, tolerance=0.5) == "row count 6, expected about 100"
    assert row_count_warning(con, normal_rows=2, tolerance=0.5) == "row count 6, expected about 2"


def test_a_failing_batch_is_held_and_readers_keep_yesterday(con):
    result = run_gate(con, normal_rows=6)
    assert result == {
        "decision": "hold",
        "failures": {"customer_id not null": 1, "status accepted": 1, "customer exists": 1},
        "warnings": [],
    }
    assert fact(con) == [(101, 11, "paid", 30), (102, 14, "refunded", 10)]
    assert staged(con) == 6


def test_a_fixed_batch_is_published_and_staging_emptied(con):
    fix_batch(con)
    assert run_gate(con, normal_rows=6) == {"decision": "publish", "failures": {}, "warnings": []}
    assert [r[0] for r in fact(con)] == [101, 102, 201, 202, 203, 204, 205, 206]
    assert staged(con) == 0


def test_a_warning_alerts_but_does_not_hold(con):
    fix_batch(con)
    result = run_gate(con, normal_rows=100)
    assert result["decision"] == "publish"
    assert result["warnings"] == ["row count 6, expected about 100"]
    assert len(fact(con)) == 8


def test_a_held_batch_is_tested_again_once_fixed(con):
    assert run_gate(con, normal_rows=6)["decision"] == "hold"
    fix_batch(con)
    assert run_gate(con, normal_rows=6)["decision"] == "publish"
    assert len(fact(con)) == 8
