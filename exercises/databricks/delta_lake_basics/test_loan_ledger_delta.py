import pytest

from loan_ledger_delta import (
    add_loans,
    append_checked,
    append_evolving,
    commit_versions,
    create_loans,
    read_loans,
)

FIRST = [(1, "Dune"), (2, "Emma")]
EXTRA = [(3, "Ubik")]
WITH_COPIES = [(4, "Kim", 2)]


def pairs(frame):
    return sorted((r["loan_id"], r["title"]) for r in frame.collect())


@pytest.fixture(scope="module")
def ledger(spark, tmp_path_factory):
    """A table with two commits: create (version 0) and append (version 1)."""
    path = str(tmp_path_factory.mktemp("ledger") / "loans")
    create_loans(spark, path, FIRST)
    add_loans(spark, path, EXTRA)
    return path


def test_create_writes_a_transaction_log(ledger):
    from pathlib import Path

    assert (Path(ledger) / "_delta_log").is_dir()


def test_append_keeps_old_rows_and_adds_new_ones(spark, ledger):
    assert pairs(read_loans(spark, ledger)) == sorted(FIRST + EXTRA)


def test_create_overwrites_whatever_was_there(spark, tmp_path):
    path = str(tmp_path / "loans")
    create_loans(spark, path, FIRST)
    create_loans(spark, path, EXTRA)
    assert pairs(read_loans(spark, path)) == EXTRA


def test_each_write_is_one_commit(spark, ledger):
    assert commit_versions(spark, ledger) == [0, 1]


def test_mismatched_schema_is_refused(spark, ledger):
    assert append_checked(spark, ledger, WITH_COPIES) is True


def test_refused_write_commits_nothing(spark, ledger):
    append_checked(spark, ledger, WITH_COPIES)
    assert commit_versions(spark, ledger) == [0, 1]
    assert read_loans(spark, ledger).columns == ["loan_id", "title"]
    assert read_loans(spark, ledger).count() == 3


def test_merge_schema_adds_the_new_column(spark, tmp_path):
    path = str(tmp_path / "loans")
    create_loans(spark, path, FIRST)
    append_evolving(spark, path, WITH_COPIES)
    table = read_loans(spark, path)
    assert table.columns == ["loan_id", "title", "copies"]
    assert {r["loan_id"]: r["copies"] for r in table.collect()} == {1: None, 2: None, 4: 2}
