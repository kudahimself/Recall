import itertools

from holdings_delta import apply_delivery, drop_empty, make_copy, mirror_catalogue, write_off

_ids = itertools.count()
START = [("A1", 2), ("B2", 5), ("C3", 1)]


def new_table(spark, rows=START):
    """Save `rows` as a fresh Delta table with a unique name, and return the name."""
    table = f"holdings_{next(_ids)}"
    spark.createDataFrame(rows, ["isbn", "copies"]).write.saveAsTable(table)
    return table


def held(spark, table):
    return {r["isbn"]: r["copies"] for r in spark.table(table).collect()}


def test_delivery_adds_copies_to_a_held_isbn(spark):
    table = new_table(spark)
    apply_delivery(spark, table, spark.createDataFrame([("A1", 3)], ["isbn", "copies"]))
    assert held(spark, table)["A1"] == 5


def test_delivery_inserts_a_new_isbn_and_leaves_the_others(spark):
    table = new_table(spark)
    apply_delivery(spark, table, spark.createDataFrame([("A1", 3), ("D4", 4)], ["isbn", "copies"]))
    assert held(spark, table) == {"A1": 5, "B2": 5, "C3": 1, "D4": 4}


def test_write_off_changes_only_the_named_isbn(spark):
    table = new_table(spark)
    write_off(spark, table, "B2", 2)
    assert held(spark, table) == {"A1": 2, "B2": 3, "C3": 1}


def test_drop_empty_removes_rows_with_no_copies(spark):
    table = new_table(spark, [("A1", 0), ("B2", 5), ("C3", -1)])
    drop_empty(spark, table)
    assert held(spark, table) == {"B2": 5}


def test_mirror_updates_inserts_and_deletes_in_one_statement(spark):
    table = new_table(spark)
    catalogue = spark.createDataFrame([("A1", 9), ("D4", 4)], ["isbn", "copies"])
    mirror_catalogue(spark, table, catalogue)
    assert held(spark, table) == {"A1": 9, "D4": 4}
    history = spark.sql(f"DESCRIBE HISTORY {table}").collect()
    assert history[0]["operation"] == "MERGE"
    assert history[0]["version"] == 1


def test_clone_starts_with_the_same_rows(spark):
    table = new_table(spark)
    make_copy(spark, table, f"{table}_copy")
    assert held(spark, f"{table}_copy") == dict(START)


def test_clone_is_recorded_as_a_clone_commit(spark):
    table = new_table(spark)
    make_copy(spark, table, f"{table}_copy")
    first = spark.sql(f"DESCRIBE HISTORY {table}_copy").first()
    assert first["operation"] == "CLONE"
    assert first["version"] == 0


def test_changing_a_clone_leaves_the_source_alone(spark):
    table = new_table(spark)
    copy_name = f"{table}_dev"
    make_copy(spark, table, copy_name)
    write_off(spark, copy_name, "B2", 5)
    drop_empty(spark, copy_name)
    assert held(spark, copy_name) == {"A1": 2, "C3": 1}
    assert held(spark, table) == dict(START)
