from pathlib import Path

import pytest

from tsql_runner import assert_rows, block, run

SQL = Path(__file__).with_name("member_filters.sql")


@pytest.fixture
def members(con):
    con.execute("CREATE TABLE dbo.Member (MemberId INTEGER, MemberName VARCHAR, City VARCHAR, Fines INTEGER)")
    con.execute("""
        INSERT INTO dbo.Member VALUES
          (1, 'Ana', 'Oslo', 0), (2, 'Ben', NULL, 12), (3, 'Cleo', 'Bergen', 30), (4, 'Dev', NULL, 0),
          (5, 'Amir', 'Leeds', 8), (6, 'Bea', 'Bergen', 20), (7, 'Alex', 'York', 45), (8, 'Cy', 'Oslo', 5)
    """)
    return con


def names(*members):
    return [(m,) for m in members]


def test_outside_oslo_keeps_the_members_with_no_city(members):
    # City <> 'Oslo' alone gives only Cleo, Amir, Bea and Alex: for Ben and Dev it is unknown.
    result = run(members, block(SQL, "outside_oslo"))
    assert_rows(result, ["MemberName"], names("Ben", "Cleo", "Dev", "Amir", "Bea", "Alex"))


def test_no_city_tests_with_is_null(members):
    # City = NULL is never true, so it would return no one.
    result = run(members, block(SQL, "no_city"))
    assert_rows(result, ["MemberName"], names("Ben", "Dev"))


def test_owing_in_two_cities_includes_both_ends(members):
    result = run(members, block(SQL, "owing_in_two_cities"))
    assert_rows(result, ["MemberName", "Fines"], [("Amir", 8), ("Bea", 20)])


def test_owing_in_two_cities_includes_the_lower_end(members):
    members.execute("INSERT INTO dbo.Member VALUES (9, 'Dag', 'Leeds', 5), (10, 'Eli', 'Bergen', 21)")
    result = run(members, block(SQL, "owing_in_two_cities"))
    assert_rows(result, ["MemberName", "Fines"], [("Amir", 8), ("Bea", 20), ("Dag", 5)])


def test_a_names_matches_the_first_letter(members):
    members.execute("INSERT INTO dbo.Member VALUES (9, 'Maja', 'Oslo', 0)")
    result = run(members, block(SQL, "a_names"))
    assert_rows(result, ["MemberName"], names("Ana", "Amir", "Alex"))


def test_standing_gives_every_member_a_town_and_a_standing(members):
    result = run(members, block(SQL, "standing"))
    assert_rows(
        result,
        ["MemberName", "Town", "Standing"],
        [
            ("Ana", "Oslo", "clear"), ("Ben", "unknown", "owes"), ("Cleo", "Bergen", "blocked"),
            ("Dev", "unknown", "clear"), ("Amir", "Leeds", "owes"), ("Bea", "Bergen", "owes"),
            ("Alex", "York", "blocked"), ("Cy", "Oslo", "owes"),
        ],
    )
