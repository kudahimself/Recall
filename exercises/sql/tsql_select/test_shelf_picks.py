from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, parse, run

SQL = Path(__file__).with_name("shelf_picks.sql")


@pytest.fixture
def books(con):
    con.execute("CREATE TABLE dbo.Book (BookId INTEGER, Title VARCHAR, Genre VARCHAR, Pages INTEGER, Published INTEGER)")
    con.execute("""
        INSERT INTO dbo.Book VALUES
          (1, 'Dune', 'SciFi', 412, 1965), (2, 'Emma', 'Classic', 474, 1815),
          (3, 'Ubik', 'SciFi', 202, 1969), (4, 'Hyperion', 'SciFi', 482, 1989),
          (5, 'Beloved', 'Classic', 324, 1987), (6, 'Neuromancer', 'SciFi', 271, 1984),
          (7, 'Rebecca', 'Mystery', 428, 1938), (8, 'Gone Girl', 'Mystery', 419, 2012),
          (9, 'Klara and the Sun', 'SciFi', 303, 2021), (10, 'The Road', 'Classic', 287, 2006),
          (11, 'Circe', 'Fantasy', 393, 2018), (12, 'Piranesi', 'Fantasy', 245, 2020)
    """)
    return con


def select_of(name):
    [statement] = parse(block(SQL, name))
    return statement


def test_longest_scifi_takes_the_top_three_by_pages(books):
    result = run(books, block(SQL, "longest_scifi"))
    assert_rows(result, ["Title", "Pages"], [("Hyperion", 482), ("Dune", 412), ("Klara and the Sun", 303)], ordered=True)


def test_longest_scifi_uses_top_with_an_order_by(books):
    query = select_of("longest_scifi")
    assert isinstance(query.args.get("limit"), exp.Limit), "Keep the rows with TOP (3) right after SELECT"
    assert query.args.get("order") is not None, "TOP without ORDER BY returns some three rows, not the three longest"


def test_longest_scifi_follows_the_data(books):
    books.execute("INSERT INTO dbo.Book VALUES (13, 'Solaris', 'SciFi', 500, 1961)")
    result = run(books, block(SQL, "longest_scifi"))
    assert_rows(result, ["Title", "Pages"], [("Solaris", 500), ("Hyperion", 482), ("Dune", 412)], ordered=True)


def test_genres_lists_each_genre_once(books):
    result = run(books, block(SQL, "genres"))
    assert_rows(result, ["Genre"], [("Classic",), ("Fantasy",), ("Mystery",), ("SciFi",)], ordered=True)


def test_second_page_skips_the_first_four(books):
    result = run(books, block(SQL, "second_page"))
    assert_rows(result, ["Title"], [("Gone Girl",), ("Hyperion",), ("Klara and the Sun",), ("Neuromancer",)], ordered=True)
    query = select_of("second_page")
    assert query.args.get("offset") is not None and isinstance(query.args.get("limit"), exp.Fetch), (
        "Page with OFFSET 4 ROWS FETCH NEXT 4 ROWS ONLY after the ORDER BY"
    )


def test_recent_short_filters_on_both_conditions(books):
    result = run(books, block(SQL, "recent_short"))
    assert_rows(
        result,
        ["Title", "Published"],
        [("Klara and the Sun", 2021), ("Piranesi", 2020), ("Circe", 2018), ("The Road", 2006)],
        ordered=True,
    )
