# Cluster specs and policies

Topic: Compute & Cluster Administration (Databricks, Lakehouse Platform).
Time: about 15 minutes.

## Task

Choosing compute is mostly choosing settings, and the Clusters and Jobs APIs take those settings as a plain dict.
You write five helpers in `cluster_specs.py`, including a small policy checker, and the tests need no cluster at all:

- `job_cluster(spark_version, node_type_id, min_workers, max_workers)` returns the `new_cluster` dict for one scheduled run: autoscaling, the Photon engine and no idle timeout.
- `all_purpose_cluster(cluster_name, spark_version, node_type_id, max_workers, idle_minutes=30)` returns a shared interactive cluster that stops itself and uses Standard access mode.
- `check_policy(spec, policy)` returns the sorted list of spec fields that break a policy of allowed runtimes, a worker cap and a maximum idle time.
- `pick_compute(scheduled, sql_only)` returns `"sql_warehouse"`, `"job_compute"` or `"all_purpose"` for a workload.
- `local_master(spec)` returns the `local[N]` Spark master with the same worker count as the spec.

## Examples

```python
spec = all_purpose_cluster("reading-room", "15.4.x-scala2.12", "vm-small", 4)
spec["autotermination_minutes"]                       # 30
check_policy(spec, {"max_workers": 2})                # ["autoscale.max_workers"]
pick_compute(scheduled=True, sql_only=False)          # "job_compute"
local_master({"num_workers": 3})                      # "local[3]"
```

Watch for the lesson's pitfall: a scheduled job on an all-purpose cluster pays the interactive price and keeps the cluster up between runs, so `pick_compute` sends scheduled work to job compute.

## What differs on Databricks

You would send these dicts to the Clusters API, the Jobs API or the Databricks SDK, and a cluster policy enforces its rules in the workspace when someone creates compute, with no code of yours.
Here `check_policy` is only a stand-in that practises the same reading of a spec, since no workspace exists to create a cluster in.
Local Spark has one machine, so `local[N]` stands in for N workers, and there is no autoscaling, access mode or Photon.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_compute_admin
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
