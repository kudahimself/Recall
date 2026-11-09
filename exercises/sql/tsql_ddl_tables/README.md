# Rooms and shelves

Topic: Creating & Altering Tables (SQL for Data Engineering, DDL & Constraints).
Time: about 20 minutes.

## Task

The library is adding a table of its rooms, and the table changes as the plans do.
Write the T-SQL for each `-- step:` line of `room_tables.sql`:

- `create_room`: create `dbo.Room` with `RoomId` (`INT`), `RoomName` (Unicode text up to 40 characters) and `Floor` (`INT`).
- `add_capacity`: add a `Capacity` column (`INT`) to `dbo.Room` that may be NULL.
- `widen_name`: let `RoomName` hold up to 100 characters.
- `drop_floor`: remove the `Floor` column.
- `big_rooms`: create and fill a temp table `#BigRoom` (`RoomId, RoomName`) of the rooms with a capacity of 30 or more, in one statement.
- `drop_old_shelf`: remove the old table `dbo.OldShelf`, rows and all.

## What the tests start from

Each test starts from an empty database, sets up the table its step needs and runs only that step:

- `create_room` starts with nothing.
- `add_capacity` and `widen_name` start with `dbo.Room (RoomId, RoomName, Floor)` holding rooms 1, Reading room, 0 and 2, Archive, -1.
- `drop_floor` and `big_rooms` start with `dbo.Room (RoomId, RoomName, Floor, Capacity)` holding 1, Reading room, 0, 40; 2, Archive, -1, NULL; 3, Study, 1, 30 and 4, Map room, 1, 12.
- `drop_old_shelf` starts with a `dbo.OldShelf` holding two rows.

## Examples

```
after add_capacity   columns RoomId, RoomName, Floor, Capacity; both rooms hold NULL in Capacity
#BigRoom             (1, Reading room), (3, Study)
```

Watch for the lesson's pitfall: in T-SQL, `ADD` takes no `COLUMN` keyword, while `ALTER COLUMN` and `DROP COLUMN` do, and `MODIFY` is not T-SQL at all.
DuckDB, which runs the tests, does not keep a text column's length, so the tests read `NVARCHAR(40)` and `NVARCHAR(100)` from your T-SQL instead.

## Run the tests

```bash
cd exercises/sql/tsql_ddl_tables
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the steps.
When they all pass, tick the exercise done in Recall under Progress, Topics.
