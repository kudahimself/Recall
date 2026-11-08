import itertools

import pytest

from loan_layers import add_to_bronze, build_gold, build_quarantine, build_silver

_ids = itertools.count()

DAY1 = [("L1", "leeds", "2", "1"), ("L2", "york", "5", "1"), ("L3", "york", "n/a", "1"), (None, "york", "4", "1")]
# Batch 10 corrects L1's fee, and must win over batch 1 even though "10" < "2" as text.
DAY2 = [("L1", "leeds", "3", "10")]


@pytest.fixture(scope="module")
def layers(spark):
    """Load both days into Bronze, build every layer once and return the table names."""
    n = next(_ids)
    names = {layer: f"medallion_{layer}_{n}" for layer in ("bronze", "silver", "quarantine", "gold")}
    add_to_bronze(spark, DAY1, "day1.csv", names["bronze"])
    add_to_bronze(spark, DAY2, "day2.csv", names["bronze"])
    build_silver(spark, names["bronze"], names["silver"])
    build_quarantine(spark, names["bronze"], names["quarantine"])
    build_gold(spark, names["silver"], names["gold"])
    return names


def rows(spark, table, *columns):
    """The table's rows as tuples of `columns`, sorted with NULLs (None) first."""
    got = [tuple(r[c] for c in columns) for r in spark.table(table).collect()]
    return sorted(got, key=lambda row: [(v is not None, v if v is not None else "") for v in row])


def test_bronze_keeps_every_record_with_its_source_file(spark, layers):
    got = rows(spark, layers["bronze"], "loan_id", "fee", "source_file")
    assert len(got) == 5
    assert ("L1", "2", "day1.csv") in got and ("L1", "3", "day2.csv") in got
    assert (None, "4", "day1.csv") in got


def test_silver_keeps_the_latest_batch_of_each_loan_with_typed_fees(spark, layers):
    assert rows(spark, layers["silver"], "loan_id", "branch", "fee") == [
        ("L1", "leeds", 3),
        ("L2", "york", 5),
        ("L3", "york", None),
    ]
    assert dict(spark.table(layers["silver"]).dtypes)["fee"] == "int"


def test_quarantine_holds_the_records_silver_left_out(spark, layers):
    assert rows(spark, layers["quarantine"], "branch", "fee", "source_file") == [("york", "4", "day1.csv")]


def test_gold_reads_silver_so_replays_are_not_counted_twice(spark, layers):
    assert rows(spark, layers["gold"], "branch", "loans", "fees") == [("leeds", 1, 3), ("york", 2, 5)]


def test_rebuilding_silver_gives_the_same_rows(spark, layers):
    build_silver(spark, layers["bronze"], layers["silver"])
    assert spark.table(layers["silver"]).count() == 3
