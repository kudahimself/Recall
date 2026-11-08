"""Reference solution for gold_runs.py: look only after your own tests pass."""
import json
from datetime import date, timedelta

from pyspark.sql import functions as F

RUN_IFS = ("ALL_SUCCESS", "NONE_FAILED", "AT_LEAST_ONE_SUCCESS", "ALL_DONE")
FAILED = {"FAILED", "UPSTREAM_FAILED"}


def should_run(run_if, upstream):
    if run_if not in RUN_IFS:
        raise ValueError(f"unknown run_if: {run_if}")
    if not upstream or run_if == "ALL_DONE":
        return True
    if run_if == "ALL_SUCCESS":
        return all(s == "SUCCESS" for s in upstream)
    if run_if == "NONE_FAILED":
        return not FAILED & set(upstream) and "SUCCESS" in upstream
    return "SUCCESS" in upstream


def run_states(tasks, outcomes):
    by_key = {t["task_key"]: t for t in tasks}
    for t in tasks:
        for up in t.get("depends_on", []):
            if up not in by_key:
                raise ValueError(f"{t['task_key']} depends on unknown task {up}")
    states = {}
    while len(states) < len(by_key):
        ready = [k for k, t in by_key.items() if k not in states and all(u in states for u in t.get("depends_on", []))]
        if not ready:
            raise ValueError("the tasks depend on each other in a loop")
        for key in ready:
            upstream = [states[u] for u in by_key[key].get("depends_on", [])]
            if should_run(by_key[key].get("run_if", "ALL_SUCCESS"), upstream):
                states[key] = outcomes.get(key, "SUCCESS")
            else:
                states[key] = "UPSTREAM_FAILED" if FAILED & set(upstream) else "SKIPPED"
    return states


def on_table_update(table_names):
    return {"table_update": {"table_names": list(table_names)}}


def backfill_task(task_key, inner_task, first_day, last_day, concurrency=4):
    day, last = date.fromisoformat(first_day), date.fromisoformat(last_day)
    if last < day:
        raise ValueError("last_day is before first_day")
    if not 1 <= concurrency <= 100:
        raise ValueError("concurrency must be 1 to 100")
    days = []
    while day <= last:
        days.append(day.isoformat())
        day += timedelta(days=1)
    return {
        "task_key": task_key,
        "for_each_task": {"inputs": json.dumps(days), "concurrency": concurrency, "task": inner_task},
    }


def split_quarantine(df, rules):
    passes = {name: F.coalesce(F.expr(cond), F.lit(False)) for name, cond in rules.items()}
    all_pass = F.lit(True)
    for ok in passes.values():
        all_pass = all_pass & ok
    failed = F.filter(F.array(*[F.when(~ok, F.lit(name)) for name, ok in passes.items()]), lambda n: n.isNotNull())
    silver = df.where(all_pass)
    quarantine = df.where(~all_pass).withColumn("failed_rules", failed)
    return silver, quarantine
