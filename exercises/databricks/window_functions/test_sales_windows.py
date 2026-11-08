import pytest

import sales_windows as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def run(spark):
    data = [
        ("North", "2024-01-01", 5),
        ("North", "2024-01-02", 9),
        ("North", "2024-01-03", 9),
        ("North", "2024-01-04", 2),
        ("South", "2024-01-01", 7),
        ("South", "2024-01-02", 3),
        ("South", "2024-01-03", 8),
    ]
    spark.createDataFrame(data, "branch string, day string, copies int").createOrReplaceTempView("sales")
    return spark.sql


def test_busiest_day_is_one_row_per_branch_with_earlier_day_on_a_tie(run):
    assert rows(run(q.busiest_day_sql())) == [("North", "2024-01-02"), ("South", "2024-01-03")]


def test_rank_gives_ties_the_same_rank_and_skips_the_next(run):
    result = rows(run(q.copies_rank_sql()))
    north = {r[1]: r[3] for r in result if r[0] == "North"}
    assert north == {"2024-01-01": 3, "2024-01-02": 1, "2024-01-03": 1, "2024-01-04": 4}


def test_rank_restarts_inside_each_branch(run):
    result = rows(run(q.copies_rank_sql()))
    south = {r[1]: r[3] for r in result if r[0] == "South"}
    assert south == {"2024-01-03": 1, "2024-01-01": 2, "2024-01-02": 3}


def test_change_from_previous_day_keeps_every_row(run):
    result = rows(run(q.change_from_previous_day_sql()))
    assert len(result) == 7
    assert result == sorted(
        [
            ("North", "2024-01-01", None),
            ("North", "2024-01-02", 4),
            ("North", "2024-01-03", 0),
            ("North", "2024-01-04", -7),
            ("South", "2024-01-01", None),
            ("South", "2024-01-02", -4),
            ("South", "2024-01-03", 5),
        ],
        key=repr,
    )


def test_running_total_adds_up_inside_each_branch(run):
    result = {(r[0], r[1]): r[2] for r in rows(run(q.running_total_sql()))}
    assert result[("North", "2024-01-04")] == 25
    assert result[("North", "2024-01-02")] == 14
    assert result[("South", "2024-01-03")] == 18


def test_running_total_starts_again_for_the_second_branch(run):
    result = {(r[0], r[1]): r[2] for r in rows(run(q.running_total_sql()))}
    assert result[("South", "2024-01-01")] == 7


def test_before_a_drop_compares_with_the_next_day(run):
    assert rows(run(q.before_a_drop_sql())) == [("North", "2024-01-03"), ("South", "2024-01-01")]
