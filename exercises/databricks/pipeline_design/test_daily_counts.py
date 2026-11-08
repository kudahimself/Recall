import itertools
from datetime import date

import pytest

from daily_counts import add_count_check, append_new, backfill, contract_problems, rebuild_day, rebuild_trailing

_ids = itertools.count()
RAW_SCHEMA = "loan_id INT, loan_day DATE, branch STRING"


def rows(spark, *values):
    return spark.createDataFrame([(i, date.fromisoformat(d), b) for i, d, b in values], RAW_SCHEMA)


def tables(spark, *raw_rows):
    """A raw loans table holding `raw_rows` and an empty summary table."""
    n = next(_ids)
    raw, summary = f"pd_raw_{n}", f"pd_summary_{n}"
    spark.sql(f"CREATE TABLE {raw} ({RAW_SCHEMA})")
    spark.sql(f"CREATE TABLE {summary} (loan_day DATE, branch STRING, loans BIGINT)")
    if raw_rows:
        rows(spark, *raw_rows).write.mode("append").saveAsTable(raw)
    return raw, summary


def summary_rows(spark, summary):
    return [(r.loan_day.isoformat(), r.branch, r.loans) for r in spark.table(summary).orderBy("loan_day", "branch").collect()]


# The lesson's loans: 1-2 leeds and 3 york on March 1, 4 leeds on March 2.
LOANS = [(1, "2026-03-01", "leeds"), (2, "2026-03-01", "leeds"), (3, "2026-03-01", "york"), (4, "2026-03-02", "leeds")]


def test_append_new_adds_nothing_twice(spark):
    raw, _ = tables(spark, *LOANS[:2])
    batch = rows(spark, LOANS[1], LOANS[2])
    append_new(spark, raw, batch)
    append_new(spark, raw, batch)  # the retry
    assert sorted(r.loan_id for r in spark.table(raw).collect()) == [1, 2, 3]


def test_rebuild_day_writes_only_its_own_day(spark):
    raw, summary = tables(spark, *LOANS)
    rebuild_day(spark, raw, summary, "2026-03-01")
    rebuild_day(spark, raw, summary, "2026-03-01")  # a retry
    assert summary_rows(spark, summary) == [("2026-03-01", "leeds", 2), ("2026-03-01", "york", 1)]


def test_a_late_row_is_counted_by_rebuilding_its_day(spark):
    raw, summary = tables(spark, *LOANS)
    rebuild_day(spark, raw, summary, "2026-03-01")
    rebuild_day(spark, raw, summary, "2026-03-02")
    append_new(spark, raw, rows(spark, (5, "2026-03-01", "york")))  # arrives late
    rebuild_day(spark, raw, summary, "2026-03-01")
    assert summary_rows(spark, summary) == [
        ("2026-03-01", "leeds", 2), ("2026-03-01", "york", 2), ("2026-03-02", "leeds", 1)]


def test_backfill_rebuilds_each_day_of_the_range(spark):
    raw, summary = tables(spark, *LOANS)
    # A stale row for March 3: its loans were removed from raw, so the backfill clears it.
    spark.sql(f"INSERT INTO {summary} VALUES (DATE'2026-03-03', 'york', 9)")
    assert backfill(spark, raw, summary, "2026-03-01", "2026-03-03") == ["2026-03-01", "2026-03-02", "2026-03-03"]
    assert summary_rows(spark, summary) == [
        ("2026-03-01", "leeds", 2), ("2026-03-01", "york", 1), ("2026-03-02", "leeds", 1)]


def test_rebuild_trailing_reaches_back_across_a_month_end(spark):
    raw, summary = tables(spark, (1, "2026-02-26", "hull"), (2, "2026-02-27", "york"), (3, "2026-03-01", "leeds"))
    assert rebuild_trailing(spark, raw, summary, "2026-03-01") == ["2026-02-27", "2026-02-28", "2026-03-01"]
    assert summary_rows(spark, summary) == [("2026-02-27", "york", 1), ("2026-03-01", "leeds", 1)]


def test_the_count_check_rejects_an_empty_row(spark):
    raw, summary = tables(spark, *LOANS)
    rebuild_day(spark, raw, summary, "2026-03-01")
    add_count_check(spark, summary)
    constraints = {r["key"]: r["value"] for r in spark.sql(f"SHOW TBLPROPERTIES {summary}").collect()}
    assert "delta.constraints.loans_positive" in constraints
    with pytest.raises(Exception, match="loans_positive"):
        spark.sql(f"INSERT INTO {summary} VALUES (DATE'2026-03-05', 'york', 0)")
    spark.sql(f"INSERT INTO {summary} VALUES (DATE'2026-03-05', 'york', 1)")


CONTRACT = {"loan_id": "int", "loan_day": "date", "branch": "string"}


def test_contract_problems_is_empty_for_a_batch_that_keeps_it(spark):
    assert contract_problems(rows(spark, LOANS[0]), CONTRACT) == []


def test_contract_problems_names_each_break(spark):
    batch = spark.createDataFrame([("1", "leeds", 2)], "loan_id STRING, branch STRING, fee INT")
    assert contract_problems(batch, CONTRACT) == [
        "type: loan_id is string, not int", "missing: loan_day", "extra: fee"]
