import json

import pytest

from gold_runs import backfill_task, on_table_update, run_states, should_run, split_quarantine


@pytest.mark.parametrize(
    "run_if, upstream, runs",
    [
        ("ALL_SUCCESS", ["SUCCESS", "SUCCESS"], True),
        ("ALL_SUCCESS", ["SUCCESS", "SKIPPED"], False),
        ("NONE_FAILED", ["SUCCESS", "SKIPPED"], True),
        ("NONE_FAILED", ["SUCCESS", "FAILED"], False),
        ("NONE_FAILED", ["SUCCESS", "UPSTREAM_FAILED"], False),
        ("NONE_FAILED", ["SKIPPED", "SKIPPED"], False),
        ("AT_LEAST_ONE_SUCCESS", ["FAILED", "SUCCESS"], True),
        ("AT_LEAST_ONE_SUCCESS", ["FAILED", "SKIPPED"], False),
        ("ALL_DONE", ["FAILED", "UPSTREAM_FAILED"], True),
        ("ALL_SUCCESS", [], True),
    ],
)
def test_should_run_follows_run_if(run_if, upstream, runs):
    assert should_run(run_if, upstream) is runs


def test_should_run_rejects_an_unknown_run_if():
    with pytest.raises(ValueError):
        should_run("ANY", ["SUCCESS"])


def gold_job(run_if=None):
    """The lesson's job: split, then tax (an If/Else may skip it), then the gold fan-in."""
    gold = {"task_key": "gold", "depends_on": ["split", "tax"]}
    if run_if:
        gold["run_if"] = run_if
    return [gold, {"task_key": "tax", "depends_on": ["split"]}, {"task_key": "split"}]


def test_the_ghost_sink_a_default_fan_in_is_skipped_with_its_branch():
    assert run_states(gold_job(), {"tax": "SKIPPED"}) == {"split": "SUCCESS", "tax": "SKIPPED", "gold": "SKIPPED"}


def test_none_failed_builds_gold_when_a_branch_was_skipped():
    assert run_states(gold_job("NONE_FAILED"), {"tax": "SKIPPED"})["gold"] == "SUCCESS"


def test_none_failed_still_stops_on_a_real_failure():
    states = run_states(gold_job("NONE_FAILED"), {"tax": "FAILED"})
    assert states == {"split": "SUCCESS", "tax": "FAILED", "gold": "UPSTREAM_FAILED"}


def test_a_failure_spreads_down_the_graph_and_all_done_still_runs():
    tasks = gold_job() + [{"task_key": "notify", "depends_on": ["gold"], "run_if": "ALL_DONE"},
                          {"task_key": "report", "depends_on": ["gold"]}]
    states = run_states(tasks, {"split": "FAILED"})
    assert states == {"split": "FAILED", "tax": "UPSTREAM_FAILED", "gold": "UPSTREAM_FAILED",
                      "notify": "SUCCESS", "report": "UPSTREAM_FAILED"}


def test_run_states_rejects_an_unknown_upstream_task():
    with pytest.raises(ValueError):
        run_states([{"task_key": "gold", "depends_on": ["silver"]}], {})


def test_the_job_starts_when_silver_commits():
    assert on_table_update(["main.shop.silver_sales"]) == {"table_update": {"table_names": ["main.shop.silver_sales"]}}


def test_backfill_task_runs_one_day_per_iteration():
    one_day = {"task_key": "one_day", "notebook_task": {"notebook_path": "/jobs/rebuild_day"}}
    task = backfill_task("days", one_day, "2026-02-27", "2026-03-02")
    assert task["task_key"] == "days"
    each = task["for_each_task"]
    assert json.loads(each["inputs"]) == ["2026-02-27", "2026-02-28", "2026-03-01", "2026-03-02"]
    assert each["concurrency"] == 4 and each["task"] == one_day
    assert backfill_task("days", one_day, "2026-03-01", "2026-03-01", concurrency=1)["for_each_task"]["concurrency"] == 1


@pytest.mark.parametrize("first, last, concurrency", [("2026-03-02", "2026-03-01", 4), ("2026-03-01", "2026-03-02", 0),
                                                       ("2026-03-01", "2026-03-02", 101)])
def test_backfill_task_rejects_a_bad_range_or_concurrency(first, last, concurrency):
    with pytest.raises(ValueError):
        backfill_task("days", {"task_key": "one_day"}, first, last, concurrency)


RULES = {"has_id": "loan_id IS NOT NULL", "fee": "fee >= 0"}


@pytest.fixture(scope="module")
def events(spark):
    # The lesson's loan events, and one more whose fee is missing.
    return spark.createDataFrame(
        [("L1", "leeds", 2), (None, "york", 4), ("L2", "york", -1), ("L3", "leeds", 3), ("L4", "hull", None), (None, "hull", -5)],
        "loan_id STRING, branch STRING, fee INT",
    )


def test_silver_keeps_the_rows_that_pass_every_rule(events):
    silver, _ = split_quarantine(events, RULES)
    assert silver.columns == ["loan_id", "branch", "fee"]
    assert sorted(tuple(r) for r in silver.collect()) == [("L1", "leeds", 2), ("L3", "leeds", 3)]


def test_quarantine_keeps_every_other_row_with_the_rules_it_broke(events):
    _, quarantine = split_quarantine(events, RULES)
    assert quarantine.columns == ["loan_id", "branch", "fee", "failed_rules"]
    rows = sorted((r.branch, r.fee or 0, r.failed_rules) for r in quarantine.collect())
    assert rows == [("hull", -5, ["has_id", "fee"]), ("hull", 0, ["fee"]), ("york", -1, ["fee"]), ("york", 4, ["has_id"])]


def test_no_row_is_lost_between_the_two(events):
    silver, quarantine = split_quarantine(events, RULES)
    assert silver.count() + quarantine.count() == events.count()
