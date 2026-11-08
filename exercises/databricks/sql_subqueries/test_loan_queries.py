import pytest

import loan_queries as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def run(spark):
    books = [
        ("Dune", 600, "scifi"),
        ("Emma", 500, "classic"),
        ("Ulysses", 900, "classic"),
        ("Neuromancer", 400, "scifi"),
        ("Persuasion", 250, "classic"),
        ("Solaris", 200, "scifi"),
    ]
    loans = [("Dune", "Ana"), ("Dune", "Ben"), ("Emma", "Ana"), ("Solaris", "Cy")]
    spark.createDataFrame(books, "title string, pages int, genre string").createOrReplaceTempView("books")
    spark.createDataFrame(loans, "title string, member string").createOrReplaceTempView("loans")
    return spark.sql


def test_longer_than_the_overall_average(run):
    assert rows(run(q.longer_than_average_sql())) == [("Dune",), ("Emma",), ("Ulysses",)]


def test_longer_than_genre_average_compares_each_book_to_its_own_genre(run):
    assert rows(run(q.longer_than_genre_average_sql())) == [("Dune",), ("Ulysses",)]


def test_borrowed_titles_are_listed_once_each(run):
    assert rows(run(q.borrowed_titles_sql())) == [("Dune",), ("Emma",), ("Solaris",)]


def test_never_borrowed_titles(run):
    assert rows(run(q.never_borrowed_sql())) == [("Neuromancer",), ("Persuasion",), ("Ulysses",)]


def test_borrowed_and_never_borrowed_cover_every_book(run):
    both = rows(run(q.borrowed_titles_sql())) + rows(run(q.never_borrowed_sql()))
    assert len(both) == 6


def test_popular_titles_count_loans(run):
    assert rows(run(q.popular_titles_sql())) == [("Dune", 2)]


def test_popular_titles_is_written_as_a_cte():
    assert "WITH" in q.popular_titles_sql().upper().split()
