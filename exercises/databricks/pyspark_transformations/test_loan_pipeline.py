import pytest

import loan_pipeline

# (loan_id, branch, title, days)
LOANS = [
    (1, "leeds", "Dune", 14), (2, "leeds", "Dune", 7), (3, "york", "Emma", 21),
    (4, "leeds", "Ubik", 3), (5, "york", "Dune", 10), (6, "york", "Dune", 10),
]


@pytest.fixture()
def loans(spark):
    return spark.createDataFrame(LOANS, ["loan_id", "branch", "title", "days"])


def test_branch_stats_counts_and_sums_per_branch_biggest_total_first(loans):
    out = loan_pipeline.branch_stats(loans)
    assert out.columns == ["branch", "loans", "total_days"]
    assert [tuple(r) for r in out.collect()] == [("york", 3, 41), ("leeds", 3, 24)]


def test_unique_pairs_has_two_columns_and_no_repeats(loans):
    out = loan_pipeline.unique_pairs(loans)
    assert out.columns == ["branch", "title"]
    assert sorted(tuple(r) for r in out.collect()) == [
        ("leeds", "Dune"), ("leeds", "Ubik"), ("york", "Dune"), ("york", "Emma")]


def test_repartitioned_can_raise_the_partition_count(loans):
    assert loan_pipeline.repartitioned(loans, 4).rdd.getNumPartitions() == 4


def test_repartitioned_can_lower_the_partition_count_and_keeps_every_row(loans):
    out = loan_pipeline.repartitioned(loans, 1)
    assert out.rdd.getNumPartitions() == 1
    assert out.count() == len(LOANS)


def test_top_titles_is_a_python_list_most_borrowed_first(loans):
    assert loan_pipeline.top_titles(loans, 2) == ["Dune", "Emma"]


def test_top_titles_never_returns_more_than_n(loans):
    assert loan_pipeline.top_titles(loans, 1) == ["Dune"]


def test_longest_loan_is_a_plain_int(loans):
    n = loan_pipeline.longest_loan(loans)
    assert n == 21
    assert isinstance(n, int)
