import pytest

import loan_joins as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def run(spark):
    def make(data, cols, view):
        spark.createDataFrame(data, cols).createOrReplaceTempView(view)

    make([(1, "Dune"), (2, "Emma"), (3, "Ulysses"), (4, "Persuasion")], "book_id int, title string", "books")
    make(
        [(10, "Ana", None), (11, "Ben", 10), (12, "Cy", 10), (13, "Dee", 11)],
        "member_id int, member_name string, referred_by int",
        "members",
    )
    make(
        [(100, 1, 10), (101, 1, 11), (102, 2, 10), (103, 3, 12)],
        "loan_id int, book_id int, member_id int",
        "loans",
    )
    make([("North",), ("South",)], "branch string", "branches")
    return lambda sql: spark.sql(sql)


def test_inner_join_gives_one_row_per_loan(run):
    assert rows(run(q.loaned_titles_sql())) == [
        ("Dune", "Ana"),
        ("Dune", "Ben"),
        ("Emma", "Ana"),
        ("Ulysses", "Cy"),
    ]


def test_left_join_keeps_a_book_with_no_loan(run):
    result = rows(run(q.all_books_with_loans_sql()))
    assert ("Persuasion", None) in result


def test_left_join_repeats_a_book_once_per_loan(run):
    result = rows(run(q.all_books_with_loans_sql()))
    assert result == [("Dune", 100), ("Dune", 101), ("Emma", 102), ("Persuasion", None), ("Ulysses", 103)]


def test_never_loaned_lists_only_unmatched_books(run):
    assert rows(run(q.never_loaned_sql())) == [("Persuasion",)]


def test_never_loaned_returns_only_the_title_column(run):
    assert len(run(q.never_loaned_sql()).columns) == 1


def test_self_join_pairs_members_with_their_referrer(run):
    assert rows(run(q.referrals_sql())) == [("Ben", "Ana"), ("Cy", "Ana"), ("Dee", "Ben")]


def test_self_join_skips_members_nobody_referred(run):
    assert "Ana" not in [r[0] for r in rows(run(q.referrals_sql()))]


def test_cross_join_pairs_every_member_with_every_branch(run):
    result = rows(run(q.member_branch_pairs_sql()))
    assert len(result) == 8
    assert ("Dee", "South") in result
