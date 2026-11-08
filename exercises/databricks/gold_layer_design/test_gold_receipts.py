import itertools
from datetime import date

import pytest

from gold_receipts import daily_sales, publish, replay_from, sales_obt, weekly_sales

_ids = itertools.count()
D1, D2 = date(2026, 3, 1), date(2026, 3, 2)


@pytest.fixture(scope="module")
def silver(spark):
    """The lesson's receipts, plus a test receipt and a receipt with no lines."""
    n = next(_ids)
    names = {"receipts": f"gld_receipts_{n}", "lines": f"gld_lines_{n}", "books": f"gld_books_{n}"}
    spark.createDataFrame(
        [(1, D1, 30, False), (2, D1, 12, False), (3, D2, 9, False), (4, D2, 50, True), (5, D2, 6, False)],
        "receipt_id INT, sale_day DATE, total INT, is_test BOOLEAN",
    ).write.saveAsTable(names["receipts"])
    spark.createDataFrame(
        [(1, "B-01", 10), (1, "B-02", 10), (1, "B-03", 10), (2, "B-02", 12), (3, "B-03", 9), (4, "B-01", 50)],
        "receipt_id INT, isbn STRING, price INT",
    ).write.saveAsTable(names["lines"])
    spark.createDataFrame(
        [("B-01", "Dune", "scifi"), ("B-02", "Emma", "classic"), ("B-03", "Ubik", "scifi")],
        "isbn STRING, title STRING, genre STRING",
    ).write.saveAsTable(names["books"])
    return names


def daily(spark, silver):
    return [tuple(r) for r in daily_sales(spark, silver["receipts"], silver["lines"]).collect()]


def gold_table(spark, rows):
    name = f"gld_daily_{next(_ids)}"
    spark.createDataFrame(rows, "sale_day DATE, revenue BIGINT, books BIGINT").write.saveAsTable(name)
    return name


def test_daily_sales_counts_each_receipt_total_once(spark, silver):
    # Joined straight to its lines, receipt 1's 30 would count three times: 102 for March 1.
    assert daily(spark, silver) == [(D1, 42, 4), (D2, 15, 1)]


def test_daily_sales_keeps_a_receipt_with_no_lines(spark, silver):
    df = daily_sales(spark, silver["receipts"], silver["lines"])
    assert df.columns == ["sale_day", "revenue", "books"]
    assert df.where(f"sale_day = DATE'{D2}'").first()["revenue"] == 15


def test_the_obt_has_one_row_per_line_with_its_names(spark, silver):
    obt = sales_obt(spark, silver["receipts"], silver["lines"], silver["books"])
    assert obt.columns == ["receipt_id", "sale_day", "isbn", "title", "genre", "price"]
    rows = sorted(tuple(r) for r in obt.collect())
    assert rows == [
        (1, D1, "B-01", "Dune", "scifi", 10), (1, D1, "B-02", "Emma", "classic", 10), (1, D1, "B-03", "Ubik", "scifi", 10),
        (2, D1, "B-02", "Emma", "classic", 12), (3, D2, "B-03", "Ubik", "scifi", 9),
    ]


def test_the_weekly_rollup_sits_beside_the_daily_table(spark):
    gold = gold_table(spark, [(D1, 42, 4), (D2, 15, 1), (date(2026, 3, 4), 5, 1)])
    weeks = [tuple(r) for r in weekly_sales(spark, gold).collect()]
    # March 1, 2026 is a Sunday, so it closes the week that began on February 23.
    assert weeks == [(date(2026, 2, 23), 42, 4), (D2, 20, 2)]
    assert spark.table(gold).count() == 3


def test_replay_from_rewrites_only_the_damaged_days(spark, silver):
    # A bug wrote March 2 wrongly; March 1's row is planted so a full rebuild would show.
    gold = gold_table(spark, [(D1, 999, 9), (D2, 0, 0)])
    replay_from(spark, silver["receipts"], silver["lines"], gold, "2026-03-02")
    rows = [tuple(r) for r in spark.table(gold).orderBy("sale_day").collect()]
    assert rows == [(D1, 999, 9), (D2, 15, 1)]


def test_publish_switches_the_view_only_after_the_check(spark, silver):
    n = next(_ids)
    old = gold_table(spark, [(D1, 102, 4), (D2, 15, 1)])  # v1, with the fan-out bug
    view = f"gld_view_{n}"
    spark.sql(f"CREATE VIEW {view} AS SELECT * FROM {old}")
    broken = gold_table(spark, [(D1, 42, 4)])  # a half-built v2
    assert publish(spark, view, broken, silver["receipts"]) is False
    assert spark.table(view).agg({"revenue": "sum"}).first()[0] == 117
    fixed = gold_table(spark, daily(spark, silver))
    assert publish(spark, view, fixed, silver["receipts"]) is True
    assert spark.table(view).agg({"revenue": "sum"}).first()[0] == 57
