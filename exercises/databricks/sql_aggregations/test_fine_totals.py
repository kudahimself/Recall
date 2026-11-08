import pytest

import fine_totals as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def run(spark):
    data = [
        ("Ana", "North", 200, None),
        ("Ana", "South", 150, "2024-01-05"),
        ("Ben", "North", 500, None),
        ("Ben", "North", 100, None),
        ("Cy", "South", 300, "2024-02-01"),
        ("Dee", "North", 50, None),
    ]
    spark.createDataFrame(data, "member string, branch string, cents int, waived_on string").createOrReplaceTempView(
        "fines"
    )
    return spark.sql


def test_total_per_member(run):
    assert rows(run(q.total_per_member_sql())) == [("Ana", 350), ("Ben", 600), ("Cy", 300), ("Dee", 50)]


def test_big_debtors_filters_groups_with_having(run):
    assert rows(run(q.big_debtors_sql())) == [("Ana", 350), ("Ben", 600)]


def test_big_debtors_excludes_a_total_of_exactly_300(run):
    assert "Cy" not in [r[0] for r in rows(run(q.big_debtors_sql()))]


def test_branch_summary_counts_rows_and_non_null_values_differently(run):
    assert rows(run(q.branch_summary_sql())) == [("North", 4, 0, 500), ("South", 2, 2, 300)]


def test_repeat_unpaid_filters_rows_then_groups(run):
    assert rows(run(q.repeat_unpaid_sql())) == [("Ben", 2)]


def test_rollup_has_one_row_per_branch(run):
    result = dict(rows(run(q.branch_rollup_sql())))
    assert result["North"] == 850
    assert result["South"] == 450


def test_rollup_adds_a_grand_total_row_with_null_branch(run):
    result = dict(rows(run(q.branch_rollup_sql())))
    assert result[None] == 1300
    assert len(result) == 3
