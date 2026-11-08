from job_specs import job_problems, notebook_task, repair_run, run_states, scheduled_job


def nightly(extract_retries=0):
    """extract, then report and archive side by side, then notify after report."""
    return scheduled_job(
        "nightly_loans",
        [
            notebook_task("extract", "./extract.py", max_retries=extract_retries),
            notebook_task("report", "./report.py", depends_on=["extract"]),
            notebook_task("archive", "./archive.py", depends_on=["extract"]),
            notebook_task("notify", "./notify.py", depends_on=["report"]),
        ],
        "0 0 2 * * ?",
    )


def test_a_task_names_its_notebook_and_upstream_tasks():
    assert notebook_task("report", "./report.py", depends_on=["extract", "clean"], max_retries=2) == {
        "task_key": "report",
        "notebook_task": {"notebook_path": "./report.py"},
        "depends_on": [{"task_key": "extract"}, {"task_key": "clean"}],
        "max_retries": 2,
    }


def test_a_first_task_has_no_upstream_and_no_retries():
    task = notebook_task("extract", "./extract.py")
    assert task["depends_on"] == []
    assert task["max_retries"] == 0


def test_a_job_holds_its_schedule_parameters_and_tasks():
    tasks = [notebook_task("extract", "./extract.py")]
    job = scheduled_job("nightly", tasks, "0 0 2 * * ?", "Europe/London", {"env": "prod", "run_date": "2026-11-06"})
    assert job == {
        "name": "nightly",
        "schedule": {"quartz_cron_expression": "0 0 2 * * ?", "timezone_id": "Europe/London"},
        "parameters": [{"name": "env", "default": "prod"}, {"name": "run_date", "default": "2026-11-06"}],
        "tasks": tasks,
    }


def test_a_job_defaults_to_utc_and_no_parameters():
    job = scheduled_job("nightly", [], "0 0 2 * * ?")
    assert job["schedule"]["timezone_id"] == "UTC"
    assert job["parameters"] == []


def test_a_sound_job_has_no_problems():
    assert job_problems(nightly()) == []


def test_duplicate_keys_and_unknown_dependencies_are_named():
    job = scheduled_job("j", [
        notebook_task("extract", "./a.py"),
        notebook_task("extract", "./b.py"),
        notebook_task("report", "./r.py", depends_on=["extract", "clean"]),
    ], "0 0 2 * * ?")
    assert job_problems(job) == ["duplicate task_key: extract", "unknown dependency: report -> clean"]


def test_a_loop_of_dependencies_is_a_cycle():
    job = scheduled_job("j", [
        notebook_task("a", "./a.py", depends_on=["c"]),
        notebook_task("b", "./b.py", depends_on=["a"]),
        notebook_task("c", "./c.py", depends_on=["b"]),
    ], "0 0 2 * * ?")
    assert job_problems(job) == ["cycle"]


def test_a_clean_run_succeeds_everywhere():
    assert run_states(nightly(), {}) == {t: "SUCCESS" for t in ["extract", "report", "archive", "notify"]}


def test_a_failure_skips_what_depends_on_it_and_other_branches_run_on():
    assert run_states(nightly(), {"report": 1}) == {
        "extract": "SUCCESS",
        "report": "FAILED",
        "archive": "SUCCESS",
        "notify": "UPSTREAM_FAILED",
    }


def test_retries_can_save_a_flaky_task():
    assert run_states(nightly(extract_retries=2), {"extract": 2})["notify"] == "SUCCESS"
    states = run_states(nightly(extract_retries=2), {"extract": 3})
    assert states["extract"] == "FAILED"
    assert states["report"] == states["archive"] == states["notify"] == "UPSTREAM_FAILED"


def test_a_repair_run_reruns_only_failed_and_skipped_tasks():
    states = run_states(nightly(), {"report": 1})
    assert repair_run(states) == ["notify", "report"]
    assert repair_run(run_states(nightly(), {})) == []
