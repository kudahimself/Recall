import pytest

from pipeline_rules import ExpectationFailed, check_rows, constraint_sql, pick_dataset, update_order

EVENTS = [("L1", "leeds", 2), ("L2", "york", -1), (None, "york", 4), ("L3", "leeds", 3)]
HAS_ID = ("has_loan_id", "loan_id IS NOT NULL", "drop")
FEE_OK = ("fee_not_negative", "fee >= 0", "warn")


@pytest.fixture
def events(spark):
    return spark.createDataFrame(EVENTS, "loan_id STRING, branch STRING, fee INT")


def test_constraint_with_no_clause_only_warns():
    assert constraint_sql("pos_v", "v > 0") == "CONSTRAINT pos_v EXPECT (v > 0)"


def test_constraint_clauses_for_drop_and_fail():
    assert constraint_sql("has_k", "k IS NOT NULL", "drop") == "CONSTRAINT has_k EXPECT (k IS NOT NULL) ON VIOLATION DROP ROW"
    assert constraint_sql("has_k", "k IS NOT NULL", "fail") == "CONSTRAINT has_k EXPECT (k IS NOT NULL) ON VIOLATION FAIL UPDATE"


def test_constraint_rejects_an_unknown_action():
    with pytest.raises(ValueError):
        constraint_sql("has_k", "k IS NOT NULL", "skip")


@pytest.mark.parametrize(
    "append_only, aggregates, expected",
    [
        (True, False, "STREAMING TABLE"),
        (True, True, "MATERIALIZED VIEW"),
        (False, False, "MATERIALIZED VIEW"),
    ],
)
def test_pick_dataset(append_only, aggregates, expected):
    assert pick_dataset(append_only, aggregates) == expected


def test_drop_removes_rows_and_warn_only_counts_them(events):
    kept, failures = check_rows(events, [HAS_ID, FEE_OK])
    assert failures == {"has_loan_id": 1, "fee_not_negative": 1}
    assert sorted(r["loan_id"] for r in kept.collect()) == ["L1", "L2", "L3"]


def test_an_expectation_with_no_failures_reports_zero(events):
    kept, failures = check_rows(events, [("has_branch", "branch IS NOT NULL", "drop")])
    assert failures == {"has_branch": 0}
    assert kept.count() == 4


def test_fail_stops_on_one_bad_row(events):
    with pytest.raises(ExpectationFailed, match="fee_not_negative"):
        check_rows(events, [HAS_ID, ("fee_not_negative", "fee >= 0", "fail")])


def test_fail_lets_good_rows_through(events):
    kept, failures = check_rows(events, [HAS_ID, ("fee_known", "fee IS NOT NULL", "fail")])
    assert failures["fee_known"] == 0
    assert kept.count() == 3


PIPELINE = {
    "gold_fees": "SELECT branch, SUM(fee) AS fees FROM silver_loans GROUP BY branch",
    "silver_loans": "SELECT * FROM STREAM(bronze_loans) JOIN branches_ref USING (branch)",
    "bronze_loans": "SELECT * FROM STREAM read_files('/Volumes/main/library/landing/loans')",
    "branches_ref": "SELECT * FROM main.library.branches",
}


def test_update_order_follows_the_references():
    assert update_order(PIPELINE) == ["branches_ref", "bronze_loans", "silver_loans", "gold_fees"]


def test_a_name_inside_another_word_is_not_a_reference():
    datasets = {"loans": "SELECT * FROM raw_src", "daily": "SELECT * FROM loans_daily_src"}
    assert update_order(datasets) == ["daily", "loans"]


def test_a_cycle_cannot_be_ordered():
    with pytest.raises(ValueError):
        update_order({"a": "SELECT * FROM b", "b": "SELECT * FROM a"})
