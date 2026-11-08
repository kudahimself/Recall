# Members from the change log

Topic: Change Data Capture (Data Engineering, Moving Data).
Time: about 25 minutes.

## Task

A CDC connector reads the members database's write-ahead log and lands every committed insert, update and delete in `change_log`.
The warehouse copy, `dim_member`, has to end each run equal to the source as of the last event applied.
Fill in the two functions in `member_changes.py`:

- `apply_changes(con)` applies the events past the position kept in `cdc_state`, newest per member by `lsn`, and moves the position in the same transaction.
- `start_feed(con, position)` starts a new feed from a full snapshot and the log position noted before the snapshot began.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
Parameters are written `?` and passed as a list, and DuckDB has `ROW_NUMBER() OVER (...)` as in the lesson.

## Examples

With the lesson's tables (Oslo, Bergen, Tromso, position 200) and events 201 to 205:

```python
apply_changes(con)   # 4 members touched: 2 moved to Molde, 3 deleted, 4 and 5 inserted
apply_changes(con)   # 0: nothing past 205
# the connector restarts and re-sends 201 and 202, then sends 206 (member 1 to Tromso)
apply_changes(con)   # 1: only 206 is new
```

Watch for the lesson's pitfall: ordering events by when they arrived instead of by their log position.
A connector restart re-sends old events after newer ones, so the `arrival` column is there to tempt you; the older value must not win.
Events are applied, not appended: each member ends as one row, or none after a delete.

## Run the tests

```bash
cd exercises/data_engineering/de_change_data_capture
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
