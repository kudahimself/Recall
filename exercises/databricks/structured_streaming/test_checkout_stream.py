import datetime as dt
import itertools

import pytest

from checkout_stream import copy_new_checkouts, pick_output_mode, refresh_branch_counts, unique_events

_ids = itertools.count()


def new_source(spark, rows):
    """Save `rows` of (branch, isbn) as a fresh checkouts table and return its name."""
    table = f"stream_checkouts_{next(_ids)}"
    spark.sql(f"CREATE TABLE {table} (branch STRING, isbn STRING)")
    add(spark, table, rows)
    return table


def add(spark, table, rows):
    spark.createDataFrame(rows, "branch STRING, isbn STRING").write.mode("append").saveAsTable(table)


def counts(spark, table):
    return {r["branch"]: r["count"] for r in spark.table(table).collect()}


@pytest.mark.parametrize(
    "aggregates, only_changed, expected",
    [(False, False, "append"), (True, False, "complete"), (True, True, "update")],
)
def test_output_mode_follows_the_query(aggregates, only_changed, expected):
    assert pick_output_mode(aggregates, only_changed) == expected


def test_a_query_with_no_aggregation_appends_by_default():
    assert pick_output_mode(False) == "append"


def test_copy_reads_only_new_rows_on_the_second_run(spark, tmp_path):
    source = new_source(spark, [("leeds", "A1"), ("york", "B2")])
    target = f"stream_copies_{next(_ids)}"
    copy_new_checkouts(spark, source, target, str(tmp_path / "copy"))
    assert spark.table(target).count() == 2
    assert spark.streams.active == []

    add(spark, source, [("york", "C3")])
    copy_new_checkouts(spark, source, target, str(tmp_path / "copy"))
    rows = sorted(tuple(r) for r in spark.table(target).collect())
    assert rows == [("leeds", "A1"), ("york", "B2"), ("york", "C3")]


def test_counts_keep_their_running_totals_between_runs(spark, tmp_path):
    source = new_source(spark, [("leeds", "A1"), ("leeds", "B2"), ("york", "C3")])
    target = f"stream_counts_{next(_ids)}"
    refresh_branch_counts(spark, source, target, str(tmp_path / "counts"))
    assert counts(spark, target) == {"leeds": 2, "york": 1}

    add(spark, source, [("york", "D4"), ("hull", "E5")])
    refresh_branch_counts(spark, source, target, str(tmp_path / "counts"))
    assert counts(spark, target) == {"leeds": 2, "york": 2, "hull": 1}


def at(minute):
    return dt.datetime(2026, 11, 6, 10, minute)


def test_unique_events_drops_redeliveries_within_and_across_batches(spark, tmp_path):
    source = f"stream_returns_{next(_ids)}"
    target = f"stream_unique_returns_{next(_ids)}"
    schema = "event_id STRING, isbn STRING, ts TIMESTAMP"
    spark.sql(f"CREATE TABLE {source} ({schema})")

    def deliver(rows):
        spark.createDataFrame(rows, schema).write.mode("append").saveAsTable(source)
        (unique_events(spark.readStream.table(source))
            .writeStream.outputMode("append")
            .option("checkpointLocation", str(tmp_path / "unique"))
            .trigger(availableNow=True)
            .toTable(target)
            .awaitTermination())

    deliver([("e1", "A1", at(0)), ("e1", "A1", at(0)), ("e2", "B2", at(30))])
    assert sorted(r["event_id"] for r in spark.table(target).collect()) == ["e1", "e2"]

    # e2 comes again, e3 is new, and e4 is 25 minutes older than the newest ts already seen.
    deliver([("e2", "B2", at(30)), ("e3", "C3", at(31)), ("e4", "D4", at(5))])
    assert sorted(r["event_id"] for r in spark.table(target).collect()) == ["e1", "e2", "e3"]
