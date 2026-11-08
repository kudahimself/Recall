import duckdb
import pytest

from member_changes import apply_changes, start_feed


@pytest.fixture
def con():
    con = duckdb.connect()
    con.execute("CREATE TABLE dim_member (member_id INTEGER, city VARCHAR)")
    con.execute("CREATE TABLE change_log (lsn BIGINT, op VARCHAR, member_id INTEGER, city VARCHAR, arrival INTEGER)")
    con.execute("CREATE TABLE cdc_state (applied_lsn BIGINT)")
    con.execute("CREATE TABLE source_snapshot (member_id INTEGER, city VARCHAR)")
    con.execute("INSERT INTO dim_member VALUES (1, 'Oslo'), (2, 'Bergen'), (3, 'Tromso')")
    con.execute("INSERT INTO cdc_state VALUES (200)")
    yield con
    con.close()


def log(con, *events):
    start = con.execute("SELECT COALESCE(MAX(arrival), 0) FROM change_log").fetchone()[0]
    for i, (lsn, op, member_id, city) in enumerate(events, start=start + 1):
        con.execute("INSERT INTO change_log VALUES (?, ?, ?, ?, ?)", [lsn, op, member_id, city, i])


def members(con):
    return con.execute("SELECT member_id, city FROM dim_member ORDER BY member_id, city").fetchall()


def applied(con):
    return con.execute("SELECT applied_lsn FROM cdc_state").fetchone()[0]


LESSON_BATCH = [
    (201, "U", 2, "Stavanger"),
    (202, "I", 4, "Bodo"),
    (203, "U", 2, "Molde"),
    (204, "D", 3, None),
    (205, "I", 5, "Alta"),
]


def test_the_newest_event_per_member_wins_and_a_delete_removes(con):
    log(con, *LESSON_BATCH)
    assert apply_changes(con) == 4
    assert members(con) == [(1, "Oslo"), (2, "Molde"), (4, "Bodo"), (5, "Alta")]
    assert applied(con) == 205


def test_log_position_beats_arrival_order(con):
    # The connector restarted and delivered lsn 201 after lsn 203.
    log(con, (203, "U", 2, "Molde"), (201, "U", 2, "Stavanger"))
    apply_changes(con)
    assert members(con) == [(1, "Oslo"), (2, "Molde"), (3, "Tromso")]


def test_applying_again_changes_nothing(con):
    log(con, *LESSON_BATCH)
    apply_changes(con)
    assert apply_changes(con) == 0
    assert members(con) == [(1, "Oslo"), (2, "Molde"), (4, "Bodo"), (5, "Alta")]
    assert applied(con) == 205


def test_resent_old_events_are_skipped_and_new_ones_applied(con):
    log(con, *LESSON_BATCH)
    apply_changes(con)
    log(con, (201, "U", 2, "Stavanger"), (202, "I", 4, "Bodo"), (206, "U", 1, "Tromso"))
    assert apply_changes(con) == 1
    assert members(con) == [(1, "Tromso"), (2, "Molde"), (4, "Bodo"), (5, "Alta")]
    assert applied(con) == 206


def test_a_member_deleted_then_inserted_again_is_back(con):
    log(con, (210, "D", 3, None), (211, "I", 3, "Narvik"))
    apply_changes(con)
    assert members(con) == [(1, "Oslo"), (2, "Bergen"), (3, "Narvik")]


def test_a_feed_starts_from_a_snapshot_and_its_noted_position(con):
    con.execute("INSERT INTO source_snapshot VALUES (1, 'Oslo'), (2, 'Molde'), (6, 'Hamar')")
    # The position was noted at 205; events up to it are already in the snapshot.
    log(con, *LESSON_BATCH, (206, "U", 6, "Lillehammer"))
    start_feed(con, 205)
    assert members(con) == [(1, "Oslo"), (2, "Molde"), (6, "Hamar")]
    assert applied(con) == 205
    assert apply_changes(con) == 1
    assert members(con) == [(1, "Oslo"), (2, "Molde"), (6, "Lillehammer")]
