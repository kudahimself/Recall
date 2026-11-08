import pytest

import fines_math

FINES = [
    (1, "leeds", 2.0), (2, "leeds", 3.5), (3, "leeds", 1.0),
    (4, "york", 4.25), (5, "york", None),
]


@pytest.fixture()
def fines(spark):
    return spark.createDataFrame(FINES, "member_id int, branch string, amount double")


def test_fines_summary_has_the_four_columns(fines):
    assert fines_math.fines_summary(fines).columns == ["branch", "total", "avg_fine", "n"]


def test_fines_summary_sums_and_rounds_the_average_to_two_decimals(fines):
    got = {r["branch"]: r for r in fines_math.fines_summary(fines).collect()}
    assert got["leeds"]["total"] == pytest.approx(6.5)
    assert got["leeds"]["avg_fine"] == 2.17


def test_fines_summary_average_skips_nulls_but_n_counts_every_row(fines):
    got = {r["branch"]: r for r in fines_math.fines_summary(fines).collect()}
    assert got["york"]["avg_fine"] == 4.25
    assert got["york"]["n"] == 2


def test_add_whole_pounds_rounds_up(fines):
    got = {r["member_id"]: r["pounds"] for r in fines_math.add_whole_pounds(fines).collect()}
    assert got[1] == 2
    assert got[2] == 4
    assert got[4] == 5


def test_add_capped_limits_each_amount(fines):
    got = {r["member_id"]: r["charged"] for r in fines_math.add_capped(fines, 3.0).collect()}
    assert got[1] == 2.0
    assert got[2] == 3.0
    assert got[4] == 3.0


def test_row_stats_counts_rows_filled_and_the_mean_of_filled(fines):
    got = fines_math.row_stats(fines)
    assert got["rows"] == 5
    assert got["filled"] == 4
    assert got["mean"] == pytest.approx(2.6875)


def test_row_stats_gives_plain_python_numbers(fines):
    got = fines_math.row_stats(fines)
    assert isinstance(got["rows"], int)
    assert isinstance(got["mean"], float)


def test_largest_fine_is_a_plain_float(fines):
    top = fines_math.largest_fine(fines)
    assert top == 4.25
    assert isinstance(top, float)
