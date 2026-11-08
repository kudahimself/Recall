import pytest

from compaction_plan import files_to_clean, plan_compaction, update_cost

LESSON_FILES = [{"file": f, "rows": 1000, "size_mb": 128, "delete_files": 0} for f in ("f1", "f2", "f3", "f4")]


def f(name, size_mb, delete_files=0):
    return {"file": name, "rows": size_mb * 10, "size_mb": size_mb, "delete_files": delete_files}


def test_update_cost_matches_the_lesson():
    assert update_cost(LESSON_FILES, {"f1": 2, "f3": 5}) == {
        "cow": {"rows_written": 2000, "files_per_scan": 4},
        "mor": {"rows_written": 14, "files_per_scan": 7},
    }


def test_update_cost_of_an_update_that_changes_nothing():
    assert update_cost(LESSON_FILES, {}) == {
        "cow": {"rows_written": 0, "files_per_scan": 4},
        "mor": {"rows_written": 0, "files_per_scan": 4},
    }


def test_one_row_in_every_file_makes_copy_on_write_rewrite_the_table():
    cost = update_cost(LESSON_FILES, {"f1": 1, "f2": 1, "f3": 1, "f4": 1, "f9": 0})
    assert cost["cow"]["rows_written"] == 4000
    assert cost["mor"] == {"rows_written": 8, "files_per_scan": 9}


def test_plan_compaction_packs_small_files_up_to_the_target():
    files = [f("a", 30), f("b", 40), f("c", 120), f("d", 50), f("e", 20), f("f", 10)]
    assert plan_compaction(files, 128) == [["a", "b", "d"], ["e", "f"]]


def test_plan_compaction_folds_in_delete_files_even_for_big_files():
    files = [f("a", 120, delete_files=2), f("b", 125), f("c", 20), f("d", 30)]
    assert plan_compaction(files, 128) == [["a"], ["c", "d"]]


def test_a_lone_small_file_is_not_worth_a_rewrite():
    files = [f("a", 128), f("b", 20), f("c", 128)]
    assert plan_compaction(files, 128) == []
    assert plan_compaction([f("a", 20, delete_files=1)], 128) == [["a"]]


def test_a_group_never_goes_over_the_target():
    files = [f(f"s{i}", 40) for i in range(7)]
    groups = plan_compaction(files, 128)
    assert groups == [["s0", "s1", "s2"], ["s3", "s4", "s5"]]


HISTORY = [
    {"version": 0, "committed_at": 0, "files": ["f1", "f2", "f3", "f4"]},
    {"version": 1, "committed_at": 10, "files": ["f1", "f2", "f3", "f4", "f5"]},
    {"version": 2, "committed_at": 100, "files": ["f2", "f4", "f5", "f1b", "f3b"]},   # copy-on-write update
    {"version": 3, "committed_at": 400, "files": ["f1b", "f3b", "c1"]},               # compaction
]


def test_cleanup_deletes_only_files_removed_before_the_retention():
    # At hour 400 with 168 hours kept, version 2 (hour 100) is past it but version 3 is not.
    assert files_to_clean(HISTORY, now=400, retention_hours=168) == ["f1", "f3"]
    assert files_to_clean(HISTORY, now=600, retention_hours=168) == ["f1", "f2", "f3", "f4", "f5"]


def test_cleanup_never_deletes_a_file_the_latest_version_holds():
    cleaned = files_to_clean(HISTORY, now=10_000, retention_hours=168)
    assert not set(cleaned) & set(HISTORY[-1]["files"])


def test_a_longer_retention_keeps_more_history():
    assert files_to_clean(HISTORY, now=400, retention_hours=500) == []


def test_cleanup_refuses_a_retention_near_zero():
    with pytest.raises(ValueError):
        files_to_clean(HISTORY, now=400, retention_hours=0)
    with pytest.raises(ValueError):
        files_to_clean(HISTORY, now=400, retention_hours=24)


def test_a_file_added_back_is_not_deleted():
    history = [
        {"version": 0, "committed_at": 0, "files": ["a", "b"]},
        {"version": 1, "committed_at": 5, "files": ["a"]},
        {"version": 2, "committed_at": 9, "files": ["a", "b"]},
    ]
    assert files_to_clean(history, now=1000, retention_hours=168) == []
