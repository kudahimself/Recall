import itertools

import pytest

from shelf_history import (
    latest_version,
    operations,
    total_books_at_time,
    total_books_at_version,
    undo_to_version,
)

_ids = itertools.count()


def build(spark):
    """Make a shelves table with three commits and return its name.

    Version 0 creates it, version 1 inserts 65 books, version 2 empties every shelf.
    """
    table = f"shelves_{next(_ids)}"
    spark.sql(f"CREATE TABLE {table} (shelf STRING, books INT)")
    spark.sql(f"INSERT INTO {table} VALUES ('A', 40), ('B', 25)")
    spark.sql(f"UPDATE {table} SET books = 0")
    return table


def now_total(spark, table):
    return spark.sql(f"SELECT SUM(books) FROM {table}").first()[0]


@pytest.fixture(scope="module")
def shelves(spark):
    return build(spark)


def test_latest_version_counts_the_commits(spark, shelves):
    assert latest_version(spark, shelves) == 2


def test_operations_are_listed_oldest_first(spark, shelves):
    ops = operations(spark, shelves)
    assert len(ops) == 3
    assert ops[0] == "CREATE TABLE"
    assert ops[-1] == "UPDATE"


def test_old_version_still_has_its_rows(spark, shelves):
    assert total_books_at_version(spark, shelves, 1) == 65
    assert total_books_at_version(spark, shelves, 0) is None
    assert total_books_at_version(spark, shelves, 2) == 0


def test_timestamp_as_of_reads_the_version_current_then(spark, shelves):
    # Open-source Delta only resolves a TIMESTAMP AS OF string correctly when the session
    # timezone matches the machine's own, so this check reads and passes the moment in it.
    session_zone = spark.conf.get("spark.sql.session.timeZone")
    machine_zone = spark.sparkContext._jvm.java.util.TimeZone.getDefault().getID()
    spark.conf.set("spark.sql.session.timeZone", machine_zone)
    try:
        history = spark.sql(f"DESCRIBE HISTORY {shelves}").selectExpr(
            "version", "date_format(timestamp, 'yyyy-MM-dd HH:mm:ss.SSS') AS moment"
        )
        moment = {r["version"]: r["moment"] for r in history.collect()}[1]
        assert total_books_at_time(spark, shelves, moment) == 65
    finally:
        spark.conf.set("spark.sql.session.timeZone", session_zone)


def test_restore_brings_the_rows_back(spark):
    table = build(spark)
    undo_to_version(spark, table, 1)
    assert now_total(spark, table) == 65


def test_restore_adds_a_version_and_keeps_the_history(spark):
    table = build(spark)
    undo_to_version(spark, table, 1)
    assert latest_version(spark, table) == 3
    assert operations(spark, table)[-1] == "RESTORE"
    assert total_books_at_version(spark, table, 2) == 0
