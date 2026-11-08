import itertools

import pytest

from title_changes import apply_changes, change_counts, changes_since, create_tracked, start_tracking

_ids = itertools.count()


def build(spark):
    """A tracked titles table: version 1 inserts three titles, 2 moves B2, 3 deletes C3."""
    table = f"cdf_titles_{next(_ids)}"
    create_tracked(spark, table)
    spark.sql(f"INSERT INTO {table} VALUES ('A1', 'main'), ('B2', 'main'), ('C3', 'main')")
    spark.sql(f"UPDATE {table} SET shelf = 'annex' WHERE isbn = 'B2'")
    spark.sql(f"DELETE FROM {table} WHERE isbn = 'C3'")
    return table


@pytest.fixture(scope="module")
def titles(spark):
    return build(spark)


def shelves(spark, table):
    return {r["isbn"]: r["shelf"] for r in spark.table(table).collect()}


def test_the_table_is_created_with_the_feed_on(spark, titles):
    props = {r["key"]: r["value"] for r in spark.sql(f"SHOW TBLPROPERTIES {titles}").collect()}
    assert props.get("delta.enableChangeDataFeed") == "true"
    assert [c.name for c in spark.table(titles).schema] == ["isbn", "shelf"]


def test_changes_show_each_update_once_with_its_new_shelf(spark, titles):
    assert changes_since(spark, titles, 2) == [
        (2, "B2", "annex", "update_postimage"),
        (3, "C3", "main", "delete"),
    ]


def test_an_end_version_stops_the_range(spark, titles):
    assert changes_since(spark, titles, 1, 1) == [
        (1, "A1", "main", "insert"),
        (1, "B2", "main", "insert"),
        (1, "C3", "main", "insert"),
    ]


def test_counts_count_an_update_once(spark, titles):
    assert change_counts(spark, titles, 1) == {"insert": 3, "update": 1, "delete": 1}
    assert change_counts(spark, titles, 3) == {"insert": 0, "update": 0, "delete": 1}


def test_tracking_switched_on_later_records_the_commits_after_it(spark):
    table = f"cdf_late_{next(_ids)}"
    spark.sql(f"CREATE TABLE {table} (isbn STRING, shelf STRING)")
    spark.sql(f"INSERT INTO {table} VALUES ('A1', 'main')")
    start_tracking(spark, table)  # version 2
    spark.sql(f"UPDATE {table} SET shelf = 'annex'")
    assert changes_since(spark, table, 3) == [(3, "A1", "annex", "update_postimage")]


def test_apply_changes_brings_a_copy_up_to_date(spark):
    table = build(spark)
    target = f"cdf_target_{next(_ids)}"
    spark.sql(f"CREATE TABLE {target} AS SELECT * FROM {table} VERSION AS OF 1")
    apply_changes(spark, table, target, 2)
    assert shelves(spark, target) == {"A1": "main", "B2": "annex"}


def test_apply_changes_uses_the_latest_change_of_each_isbn(spark):
    table = build(spark)
    spark.sql(f"INSERT INTO {table} VALUES ('D4', 'main')")             # version 4
    spark.sql(f"UPDATE {table} SET shelf = 'stack' WHERE isbn = 'D4'")  # version 5
    spark.sql(f"UPDATE {table} SET shelf = 'main' WHERE isbn = 'B2'")   # version 6
    target = f"cdf_target_{next(_ids)}"
    spark.sql(f"CREATE TABLE {target} AS SELECT * FROM {table} VERSION AS OF 1")
    apply_changes(spark, table, target, 2)
    assert shelves(spark, target) == shelves(spark, table) == {"A1": "main", "B2": "main", "D4": "stack"}
