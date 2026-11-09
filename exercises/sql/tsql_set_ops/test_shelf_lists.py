from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("shelf_lists.sql")


@pytest.fixture
def lists(con):
    con.execute("CREATE TABLE dbo.Shelf (Title VARCHAR, Branch VARCHAR)")
    con.execute("CREATE TABLE dbo.Wishlist (Title VARCHAR, MemberName VARCHAR)")
    con.execute("CREATE TABLE dbo.Donation (Donor VARCHAR, Title VARCHAR)")
    con.execute("""
        INSERT INTO dbo.Shelf VALUES
          ('Dune', 'North'), ('Emma', 'North'), ('Ubik', 'South'), ('Dune', 'South'), ('Circe', 'South')
    """)
    con.execute("INSERT INTO dbo.Wishlist VALUES ('Ubik', 'Ana'), ('Hyperion', 'Ben'), ('Circe', 'Ana'), ('Hyperion', 'Cleo')")
    con.execute("INSERT INTO dbo.Donation VALUES ('Dev', 'Piranesi'), ('Eve', 'Dune')")
    return con


def titles(*names):
    return [(n,) for n in names]


def test_copies_and_wishes_keeps_every_row(lists):
    result = run(lists, block(SQL, "copies_and_wishes"))
    assert_rows(result, ["Title"], titles("Dune", "Emma", "Ubik", "Dune", "Circe", "Ubik", "Hyperion", "Circe", "Hyperion"))


def test_all_titles_lists_each_title_once_in_order(lists):
    result = run(lists, block(SQL, "all_titles"))
    assert_rows(result, ["Title"], titles("Circe", "Dune", "Emma", "Hyperion", "Piranesi", "Ubik"), ordered=True)


def test_held_and_wanted_keeps_titles_on_both_lists(lists):
    result = run(lists, block(SQL, "held_and_wanted"))
    assert_rows(result, ["Title"], titles("Circe", "Ubik"))


def test_nobody_wants_removes_wished_titles_and_duplicates(lists):
    result = run(lists, block(SQL, "nobody_wants"))
    assert_rows(result, ["Title"], titles("Dune", "Emma"))


def test_where_from_lines_up_the_columns_by_position(lists):
    # SELECT * FROM dbo.Donation would put Dev and Eve under Title.
    result = run(lists, block(SQL, "where_from"))
    assert_rows(
        result,
        ["Title", "Source"],
        [
            ("Dune", "shelf"), ("Emma", "shelf"), ("Ubik", "shelf"), ("Dune", "shelf"), ("Circe", "shelf"),
            ("Piranesi", "donation"), ("Dune", "donation"),
        ],
    )
