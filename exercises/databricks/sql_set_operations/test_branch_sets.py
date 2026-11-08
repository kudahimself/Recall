import pytest

import branch_sets as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def run(spark):
    north = [("Dune",), ("Emma",), ("Emma",), ("Ulysses",)]
    south = [("Emma",), ("Persuasion",), ("Persuasion",), ("Dune",)]
    spark.createDataFrame(north, "title string").createOrReplaceTempView("north_books")
    spark.createDataFrame(south, "book_title string").createOrReplaceTempView("south_books")
    return spark.sql


def test_all_copies_keeps_duplicates(run):
    result = rows(run(q.all_copies_sql()))
    assert len(result) == 8
    assert result.count(("Emma",)) == 3


def test_distinct_titles_lists_each_title_once(run):
    assert rows(run(q.distinct_titles_sql())) == [("Dune",), ("Emma",), ("Persuasion",), ("Ulysses",)]


def test_on_both_shelves_is_the_intersection(run):
    assert rows(run(q.on_both_shelves_sql())) == [("Dune",), ("Emma",)]


def test_only_north_is_north_except_south(run):
    assert rows(run(q.only_north_sql())) == [("Ulysses",)]


def test_only_south_is_south_except_north(run):
    assert rows(run(q.only_south_sql())) == [("Persuasion",)]


def test_except_depends_on_the_order_of_the_two_queries(run):
    assert rows(run(q.only_north_sql())) != rows(run(q.only_south_sql()))


def test_extra_north_copies_subtracts_one_for_one(run):
    assert rows(run(q.extra_north_copies_sql())) == [("Emma",), ("Ulysses",)]
