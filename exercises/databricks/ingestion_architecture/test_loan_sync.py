import itertools
from datetime import date

import pytest

from loan_sync import apply_change_log, choose_layout, create_clustered, pick_trigger, recluster, snapshot_changes, sync_method

_ids = itertools.count()
LOANS = "loan_id INT, branch STRING, due DATE"
CHANGES = "seq INT, op STRING, loan_id INT, branch STRING, due DATE"


def d(day):
    return date(2026, 3, day)


def detail(spark, table):
    return spark.sql(f"DESCRIBE DETAIL {table}").first()


def loans_table(spark, keys=("branch",), rows=()):
    table = f"ing_loans_{next(_ids)}"
    create_clustered(spark, table, list(keys))
    if rows:
        spark.createDataFrame(list(rows), LOANS).write.mode("append").saveAsTable(table)
    return table


@pytest.mark.parametrize(
    "freshness, push, trigger",
    [(5, True, {"processingTime": "5 seconds"}), (5, False, {"availableNow": True}),
     (3600, True, {"availableNow": True}), (60, True, {"availableNow": True})],
)
def test_pick_trigger_streams_only_a_push_source_with_a_target_of_seconds(freshness, push, trigger):
    assert pick_trigger(freshness, push) == trigger


@pytest.mark.parametrize(
    "gb, column, values, clause",
    [(50, "event_time", 8760, "CLUSTER BY (event_time)"),
     (5000, "country", 40, "PARTITIONED BY (country)"),
     (5000, "customer_id", 2_000_000, "CLUSTER BY (customer_id)"),
     (1200, "event_day", 3650, "CLUSTER BY (event_day)"),
     (900, "country", 40, "CLUSTER BY (country)")],
)
def test_choose_layout_partitions_only_a_big_table_on_few_values(gb, column, values, clause):
    assert choose_layout(gb, column, values) == clause


def test_a_clustered_table_has_keys_and_no_partitions(spark):
    info = detail(spark, loans_table(spark, keys=("branch",)))
    assert info.clusteringColumns == ["branch"]
    assert info.partitionColumns == []


def test_recluster_changes_the_keys_without_a_rewrite(spark):
    table = loans_table(spark, rows=[(1, "leeds", d(10)), (2, "york", d(12))])
    files = set(spark.table(table).inputFiles())
    recluster(spark, table, ["branch", "due"])
    assert detail(spark, table).clusteringColumns == ["branch", "due"]
    assert set(spark.table(table).inputFiles()) == files


def test_apply_change_log_uses_each_loans_latest_change(spark):
    # The lesson's change log: loan 3 changed twice, so only its later due date counts.
    table = loans_table(spark, rows=[(1, "leeds", d(10)), (2, "york", d(12))])
    changes = spark.createDataFrame(
        [(1, "U", 2, "hull", d(12)), (2, "I", 3, "leeds", d(15)), (3, "D", 1, None, None), (4, "U", 3, "leeds", d(20))],
        CHANGES,
    )
    apply_change_log(spark, table, changes)
    assert sorted(tuple(r) for r in spark.table(table).collect()) == [(2, "hull", d(12)), (3, "leeds", d(20))]


def test_apply_change_log_skips_a_delete_of_a_loan_it_never_had(spark):
    table = loans_table(spark, rows=[(1, "leeds", d(10))])
    changes = spark.createDataFrame([(1, "I", 9, "york", d(11)), (2, "D", 9, None, None)], CHANGES)
    apply_change_log(spark, table, changes)
    assert [tuple(r) for r in spark.table(table).collect()] == [(1, "leeds", d(10))]


def test_snapshot_changes_finds_inserts_updates_and_deletes(spark):
    old = spark.createDataFrame([(1, "leeds", d(10)), (2, "york", d(12)), (4, "hull", None), (5, "york", d(5))], LOANS)
    new = spark.createDataFrame([(2, "hull", d(12)), (3, "leeds", d(15)), (4, "hull", None), (5, "york", None)], LOANS)
    changes = snapshot_changes(old, new)
    assert changes.columns == ["op", "loan_id", "branch", "due"]
    assert [tuple(r) for r in changes.collect()] == [
        ("D", 1, "leeds", d(10)), ("U", 2, "hull", d(12)), ("I", 3, "leeds", d(15)), ("U", 5, "york", None)]


@pytest.mark.parametrize(
    "has_log, rows, method",
    [(True, 50, "change log"), (True, 10**9, "change log"), (False, 2_000, "full reload"),
     (False, 100_000, "full reload"), (False, 10**8, "snapshot diff")],
)
def test_sync_method_prefers_the_change_log(has_log, rows, method):
    assert sync_method(has_log, rows) == method
