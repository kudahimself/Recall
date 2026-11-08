"""Starter: a job's settings as plain dicts, the Jobs API's shape, and how a run of it goes. Fill in each TODO."""


def notebook_task(task_key, notebook_path, depends_on=(), max_retries=0):
    """Return one task of a job.

    Keys: task_key, notebook_task (holding notebook_path), depends_on (a list of
    {"task_key": ...}, one per upstream task, empty when there is none) and max_retries.
    """
    # TODO: build the dict
    raise NotImplementedError


def scheduled_job(name, tasks, cron, timezone="UTC", parameters=None):
    """Return a job's settings: its name, a schedule, its job parameters and its tasks.

    The schedule holds quartz_cron_expression and timezone_id. `parameters` maps each job
    parameter's name to its default, and the job lists them as {"name": ..., "default": ...}
    in that order (an empty list when there are none).
    """
    # TODO: build the dict
    raise NotImplementedError


def job_problems(job):
    """Return the sorted list of problems with a job's tasks (an empty list when there is none).

    - "duplicate task_key: <key>" for a task_key used more than once;
    - "unknown dependency: <task> -> <key>" for a depends_on naming a task the job lacks;
    - "cycle" once, when the tasks depend on each other in a loop.
    """
    # TODO: check the keys, then the dependencies, then look for a loop
    raise NotImplementedError


def run_states(job, failures):
    """Return how each task of a run ends, as {task_key: state}.

    `failures` maps a task_key to how many attempts of it fail in a row before one succeeds
    (tasks not in it succeed first time). A task that is started gets 1 + max_retries attempts:
    it is "SUCCESS" if one of them succeeds and "FAILED" if all fail.
    A task is started only when every task it depends on is "SUCCESS"; otherwise it is
    "UPSTREAM_FAILED" and never runs. The job has no problems from job_problems.
    """
    # TODO: walk the tasks so each comes after its upstream tasks
    raise NotImplementedError


def repair_run(states):
    """Return the sorted task keys a repair run reruns: the failed and the skipped ones."""
    # TODO: pick them from the states
    raise NotImplementedError
