"""Reference solution for job_specs.py: look only after your own tests pass."""
from collections import Counter


def notebook_task(task_key, notebook_path, depends_on=(), max_retries=0):
    return {
        "task_key": task_key,
        "notebook_task": {"notebook_path": notebook_path},
        "depends_on": [{"task_key": key} for key in depends_on],
        "max_retries": max_retries,
    }


def scheduled_job(name, tasks, cron, timezone="UTC", parameters=None):
    return {
        "name": name,
        "schedule": {"quartz_cron_expression": cron, "timezone_id": timezone},
        "parameters": [{"name": k, "default": v} for k, v in (parameters or {}).items()],
        "tasks": list(tasks),
    }


def _upstream(task):
    return [d["task_key"] for d in task.get("depends_on", [])]


def _order(tasks):
    """The task keys with each after its upstream tasks, or None when they loop."""
    needs = {t["task_key"]: set(_upstream(t)) for t in tasks}
    needs = {k: {u for u in ups if u in needs} for k, ups in needs.items()}
    order = []
    while len(order) < len(needs):
        ready = [k for k in needs if k not in order and needs[k] <= set(order)]
        if not ready:
            return None
        order.extend(ready)
    return order


def job_problems(job):
    tasks = job["tasks"]
    keys = [t["task_key"] for t in tasks]
    problems = [f"duplicate task_key: {k}" for k, n in Counter(keys).items() if n > 1]
    known = set(keys)
    problems += [f"unknown dependency: {t['task_key']} -> {u}" for t in tasks for u in _upstream(t) if u not in known]
    if _order(tasks) is None:
        problems.append("cycle")
    return sorted(problems)


def run_states(job, failures):
    tasks = {t["task_key"]: t for t in job["tasks"]}
    states = {}
    for key in _order(job["tasks"]):
        task = tasks[key]
        if any(states[u] != "SUCCESS" for u in _upstream(task)):
            states[key] = "UPSTREAM_FAILED"
        elif failures.get(key, 0) > task.get("max_retries", 0):
            states[key] = "FAILED"
        else:
            states[key] = "SUCCESS"
    return states


def repair_run(states):
    return sorted(k for k, s in states.items() if s in ("FAILED", "UPSTREAM_FAILED"))
