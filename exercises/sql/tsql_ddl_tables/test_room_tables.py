from pathlib import Path

import pytest
from sqlglot import exp

from tsql_runner import assert_rows, block, declared_columns, parse, run, type_name

SQL = Path(__file__).with_name("room_tables.sql")


def columns(con, table):
    """[(column, DuckDB type)] of a table in the dbo schema, in order."""
    return con.execute(
        "SELECT column_name, data_type FROM duckdb_columns() WHERE schema_name = 'dbo' AND table_name = ? ORDER BY column_index",
        [table],
    ).fetchall()


@pytest.fixture
def rooms(con):
    con.execute("CREATE TABLE dbo.Room (RoomId INTEGER, RoomName VARCHAR, Floor INTEGER)")
    con.execute("INSERT INTO dbo.Room VALUES (1, 'Reading room', 0), (2, 'Archive', -1)")
    return con


@pytest.fixture
def rooms_with_capacity(con):
    con.execute("CREATE TABLE dbo.Room (RoomId INTEGER, RoomName VARCHAR, Floor INTEGER, Capacity INTEGER)")
    con.execute("INSERT INTO dbo.Room VALUES (1, 'Reading room', 0, 40), (2, 'Archive', -1, NULL), (3, 'Study', 1, 30), (4, 'Map room', 1, 12)")
    return con


def test_create_room_makes_an_empty_table_in_dbo(con):
    run(con, block(SQL, "create_room"))
    assert columns(con, "Room") == [("RoomId", "INTEGER"), ("RoomName", "VARCHAR"), ("Floor", "INTEGER")]
    assert con.execute("SELECT COUNT(*) FROM dbo.Room").fetchone() == (0,)


def test_create_room_declares_unicode_text_of_40(con):
    declared = declared_columns(block(SQL, "create_room"), "Room")
    assert type_name(declared["roomname"].args["kind"]) == "NVARCHAR(40)", "RoomName is Unicode text up to 40 characters: NVARCHAR(40)"


def test_add_capacity_adds_a_null_column_to_existing_rows(rooms):
    run(rooms, block(SQL, "add_capacity"))
    assert columns(rooms, "Room")[-1] == ("Capacity", "INTEGER")
    assert_rows(run(rooms, "SELECT RoomId, Capacity FROM dbo.Room;"), ["RoomId", "Capacity"], [(1, None), (2, None)])


def test_widen_name_alters_the_column_type_and_keeps_the_rows(rooms):
    sql = block(SQL, "widen_name")
    run(rooms, sql)
    actions = [a for s in parse(sql) if isinstance(s, exp.Alter) for a in s.args.get("actions") or []]
    widened = [a for a in actions if isinstance(a, exp.AlterColumn) and a.name.lower() == "roomname"]
    assert widened, "Change the type with ALTER TABLE dbo.Room ALTER COLUMN RoomName ..."
    assert type_name(widened[0].args["dtype"]) == "NVARCHAR(100)", "Up to 100 Unicode characters is NVARCHAR(100)"
    assert_rows(run(rooms, "SELECT RoomId, RoomName FROM dbo.Room;"), ["RoomId", "RoomName"], [(1, "Reading room"), (2, "Archive")])


def test_drop_floor_removes_only_that_column(rooms_with_capacity):
    run(rooms_with_capacity, block(SQL, "drop_floor"))
    assert [c for c, _ in columns(rooms_with_capacity, "Room")] == ["RoomId", "RoomName", "Capacity"]
    assert rooms_with_capacity.execute("SELECT COUNT(*) FROM dbo.Room").fetchone() == (4,)


def test_big_rooms_creates_and_fills_a_temp_table(rooms_with_capacity):
    sql = block(SQL, "big_rooms")
    assert any(isinstance(s, exp.Select) and s.args.get("into") for s in parse(sql)), "Create and fill it in one go: SELECT ... INTO #BigRoom FROM ..."
    run(rooms_with_capacity, sql)
    result = run(rooms_with_capacity, "SELECT RoomId, RoomName FROM #BigRoom;")
    assert_rows(result, ["RoomId", "RoomName"], [(1, "Reading room"), (3, "Study")])


def test_drop_old_shelf_removes_the_table(con):
    con.execute("CREATE TABLE dbo.OldShelf (ShelfId INTEGER, Label VARCHAR)")
    con.execute("INSERT INTO dbo.OldShelf VALUES (1, 'A'), (2, 'B')")
    con.execute("CREATE TABLE dbo.Shelf (ShelfId INTEGER)")
    run(con, block(SQL, "drop_old_shelf"))
    tables = [t for (t,) in con.execute("SELECT table_name FROM duckdb_tables() WHERE schema_name = 'dbo'").fetchall()]
    assert tables == ["Shelf"], "DROP TABLE removes the table itself; DELETE would only empty it"
