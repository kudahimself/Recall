"""Members from the change log: apply log-based CDC events to a warehouse table.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  dim_member(member_id INTEGER, city VARCHAR)       the warehouse copy of the members table
  change_log(lsn BIGINT, op VARCHAR, member_id INTEGER, city VARCHAR, arrival INTEGER)
      every event the connector has delivered: op is 'I', 'U' or 'D' (city is NULL on a delete),
      lsn is the change's position in the source's write-ahead log,
      arrival is the order the events reached the warehouse in
  cdc_state(applied_lsn BIGINT)                     one row: the last log position applied
  source_snapshot(member_id INTEGER, city VARCHAR)  a full copy of the source, for start_feed

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_member_changes.py pass.
Run them from this folder with: pytest
"""


def apply_changes(con):
    """Apply the change_log events past cdc_state.applied_lsn to dim_member; return how many members they touch.

    For each member, the event with the highest lsn is its current state:
    'I' and 'U' leave one row with that city, 'D' leaves no row.
    Members with no new events are left alone.
    Move applied_lsn to the highest lsn applied, in the same transaction as the rows;
    a run with no new events changes nothing and returns 0.
    """
    # TODO
    raise NotImplementedError


def start_feed(con, position):
    """Start a new feed: replace dim_member with source_snapshot and record position as applied.

    position is the log position noted before the snapshot began, so the next apply_changes
    picks up every event after it. One transaction.
    """
    # TODO
    raise NotImplementedError
