import pytest

import tag_lists

BOOKS = [
    (1, "Dune", ["scifi", "classic"]),
    (2, "Emma", ["romance", "classic", "satire"]),
    (3, "Blank", []),
    (4, "Ubik", ["scifi"]),
]


@pytest.fixture()
def books(spark):
    return spark.createDataFrame(BOOKS, "book_id int, title string, tags array<string>")


def column(df, field):
    return {r["title"]: r[field] for r in df.collect()}


def test_add_tag_count_counts_array_elements_including_empty(books):
    assert column(tag_lists.add_tag_count(books), "n_tags") == {"Dune": 2, "Emma": 3, "Blank": 0, "Ubik": 1}


def test_add_sorted_tags_sorts_each_row(books):
    got = column(tag_lists.add_sorted_tags(books), "tags_sorted")
    assert got["Emma"] == ["classic", "romance", "satire"]
    assert got["Dune"] == ["classic", "scifi"]


def test_titles_with_tag_is_a_sorted_python_list(books):
    assert tag_lists.titles_with_tag(books, "scifi") == ["Dune", "Ubik"]


def test_titles_with_tag_is_empty_for_an_unused_tag(books):
    assert tag_lists.titles_with_tag(books, "poetry") == []


def test_tag_rows_has_one_row_per_tag_and_drops_empty_books(books):
    out = tag_lists.tag_rows(books)
    assert out.columns == ["title", "tag"]
    rows = sorted(tuple(r) for r in out.collect())
    assert len(rows) == 6
    assert ("Dune", "scifi") in rows
    assert all(title != "Blank" for title, _ in rows)


def test_tag_rows_keep_all_keeps_the_empty_book_with_a_null_tag(books):
    out = tag_lists.tag_rows_keep_all(books)
    assert out.columns == ["title", "tag"]
    rows = [tuple(r) for r in out.collect()]
    assert len(rows) == 7
    assert ("Blank", None) in rows


def test_add_copies_map_builds_a_map_from_branch_to_count(spark):
    stock = spark.createDataFrame([("Dune", 2, 0), ("Emma", 1, 3)], ["title", "leeds", "york"])
    out = tag_lists.add_copies_map(stock)
    assert dict(out.dtypes)["copies"].startswith("map<")
    assert {r["title"]: dict(r["copies"]) for r in out.collect()} == {
        "Dune": {"leeds": 2, "york": 0}, "Emma": {"leeds": 1, "york": 3}}
