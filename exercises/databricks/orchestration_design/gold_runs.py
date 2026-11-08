"""Starter: when each task of a gold job runs, its trigger and backfill, and silver's quality gate. Fill in each TODO.

A task is a dict like {"task_key": "gold", "depends_on": ["split", "tax"], "run_if": "NONE_FAILED"};
"depends_on" and "run_if" may be left out (no upstream tasks, and "ALL_SUCCESS").
A task ends "SUCCESS", "FAILED", "SKIPPED" or "UPSTREAM_FAILED".
"""
import json  # noqa: F401
from datetime import date, timedelta  # noqa: F401

RUN_IFS = ("ALL_SUCCESS", "NONE_FAILED", "AT_LEAST_ONE_SUCCESS", "ALL_DONE")


def should_run(run_if, upstream):
    """True when a task with this `run_if` runs, given the end states of its upstream tasks (a list).

    ALL_SUCCESS: every upstream task succeeded. NONE_FAILED: none ended FAILED or UPSTREAM_FAILED,
    and at least one succeeded. AT_LEAST_ONE_SUCCESS: one or more succeeded. ALL_DONE: always.
    A task with no upstream tasks always runs. Raise ValueError for a run_if not in RUN_IFS.
    """
    # TODO
    raise NotImplementedError


def run_states(tasks, outcomes):
    """Play one run of the job and return {task_key: end state}.

    A task that runs ends as `outcomes` says ("SUCCESS" when it is not there; "SKIPPED" means an
    If/Else condition skipped it on purpose). A task whose run_if is not met does not run: it ends
    "UPSTREAM_FAILED" when an upstream task ended FAILED or UPSTREAM_FAILED, and "SKIPPED" otherwise.
    `tasks` may come in any order. Raise ValueError when a task depends on a task_key not in the job.
    """
    # TODO: settle a task once all its upstream tasks are settled
    raise NotImplementedError


def on_table_update(table_names):
    """Return the job trigger that starts a run when any of `table_names` gets a new commit."""
    # TODO: {"table_update": {...}}
    raise NotImplementedError


def backfill_task(task_key, inner_task, first_day, last_day, concurrency=4):
    """Return a for_each_task that runs `inner_task` (a task dict) once per day from first_day to last_day.

    The days, both included, go in "inputs" as a JSON list of "YYYY-MM-DD" strings, with "concurrency"
    beside them. Raise ValueError when last_day is before first_day, or concurrency is not 1 to 100.
    """
    # TODO: {"task_key": ..., "for_each_task": {"inputs": ..., "concurrency": ..., "task": ...}}
    raise NotImplementedError


def split_quarantine(df, rules):
    """Split the DataFrame `df` by `rules`, a dict of rule name to SQL condition.

    Return (silver, quarantine): silver holds the rows every rule holds for, with df's columns;
    quarantine holds every other row, with df's columns and failed_rules, the list of the names of
    the rules it broke, in `rules` order. A rule that gives NULL for a row counts as broken, so
    every row lands in exactly one of the two.
    """
    # TODO: pyspark.sql.functions.expr turns a condition into a column
    raise NotImplementedError
