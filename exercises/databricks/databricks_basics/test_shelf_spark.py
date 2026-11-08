import pytest

import shelf_spark

ROWS = [(1, "Dune", 1965), (2, "Emma", 1815), (3, "Ubik", 1969), (4, "Neuromancer", 1984), (5, "Persuasion", 1817)]


@pytest.fixture()
def books(spark):
    return spark.createDataFrame(ROWS, ["book_id", "title", "year"])


def test_books_df_has_the_three_columns_and_every_row(spark):
    df = shelf_spark.books_df(spark, ROWS)
    assert df.columns == ["book_id", "title", "year"]
    assert sorted(tuple(r) for r in df.collect()) == sorted(ROWS)


def test_modern_titles_are_a_sorted_python_list(books):
    assert shelf_spark.modern_titles(books) == ["Dune", "Neuromancer", "Ubik"]


def test_modern_titles_is_empty_when_nothing_matches(spark):
    old = spark.createDataFrame([(1, "Emma", 1815)], ["book_id", "title", "year"])
    assert shelf_spark.modern_titles(old) == []


def test_books_per_decade_counts_in_spark(books):
    assert shelf_spark.books_per_decade(books) == {1960: 2, 1810: 2, 1980: 1}


def test_save_as_table_returns_the_delta_format_and_the_table_reads_back(spark, books):
    assert shelf_spark.save_as_table(spark, books, "shelf_books") == "delta"
    assert spark.table("shelf_books").count() == 5
    # saving again replaces the table instead of appending
    shelf_spark.save_as_table(spark, books.limit(2), "shelf_books")
    assert spark.table("shelf_books").count() == 2


def test_row_count_is_a_plain_int(books):
    n = shelf_spark.row_count(books)
    assert n == 5
    assert isinstance(n, int)
