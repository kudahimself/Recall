from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("author_handles.sql")


@pytest.fixture
def authors(con):
    con.execute("CREATE TABLE dbo.Author (AuthorId INTEGER, Handle VARCHAR, PenName VARCHAR, Code VARCHAR)")
    con.execute("""
        INSERT INTO dbo.Author VALUES
          (1, 'ana.lima@ink.io', 'Ana Lima', '  ab-104 '), (2, 'bo@press.org', 'Bo', 'cd-7'),
          (3, 'cyd.ng@ink.io', NULL, ' EF-0042'), (4, 'dee.west@quill.co.uk', 'Dee West', 'gh-31  ')
    """)
    return con


def test_handle_parts_split_at_the_at_sign(authors):
    result = run(authors, block(SQL, "handle_parts"))
    assert_rows(
        result,
        ["AuthorId", "UserName", "Domain"],
        [(1, "ana.lima", "ink.io"), (2, "bo", "press.org"), (3, "cyd.ng", "ink.io"), (4, "dee.west", "quill.co.uk")],
    )


def test_labels_survive_a_missing_pen_name(authors):
    # With + instead, Cyd's label would be NULL.
    result = run(authors, block(SQL, "labels"))
    assert_rows(
        result,
        ["AuthorId", "Label"],
        [
            (1, "Ana Lima <ana.lima@ink.io>"), (2, "Bo <bo@press.org>"),
            (3, " <cyd.ng@ink.io>"), (4, "Dee West <dee.west@quill.co.uk>"),
        ],
    )


def test_clean_codes_trim_drop_the_dash_and_capitalise(authors):
    result = run(authors, block(SQL, "clean_codes"))
    assert_rows(
        result,
        ["AuthorId", "CleanCode", "CodeLength"],
        [(1, "AB104", 5), (2, "CD7", 3), (3, "EF0042", 6), (4, "GH31", 4)],
    )


def test_clean_codes_follow_the_data(authors):
    authors.execute("INSERT INTO dbo.Author VALUES (5, 'eve@ink.io', 'Eve', ' ij-9 ')")
    result = run(authors, block(SQL, "clean_codes"))
    assert (5, "IJ9", 3) in [tuple(row) for row in result.rows]


def test_first_names_stop_at_the_first_space(authors):
    authors.execute("INSERT INTO dbo.Author VALUES (5, 'max@ink.io', 'Max von Holt', 'kl-1')")
    result = run(authors, block(SQL, "first_names"))
    assert_rows(result, ["AuthorId", "FirstName"], [(1, "Ana"), (2, "Bo"), (3, None), (4, "Dee"), (5, "Max")])
