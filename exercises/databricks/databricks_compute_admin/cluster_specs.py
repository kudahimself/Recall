"""Cluster specs as plain dicts, plus a tiny policy checker: fill in the TODOs."""


def job_cluster(spark_version, node_type_id, min_workers, max_workers):
    """The `new_cluster` spec for one scheduled job run.

    Job compute is created for the run and shut down when it ends, so it carries no idle timeout.
    Keys: spark_version, node_type_id, autoscale (min_workers, max_workers) and runtime_engine.
    Use the Photon engine.
    """
    # TODO: build and return the dict the Jobs API documents
    raise NotImplementedError


def all_purpose_cluster(cluster_name, spark_version, node_type_id, max_workers, idle_minutes=30):
    """The spec of a shared interactive cluster.

    Keys: cluster_name, spark_version, node_type_id, autoscale (one worker minimum),
    autotermination_minutes, and data_security_mode set to the API name of Standard access mode.
    """
    # TODO: build and return the dict the Clusters API documents
    raise NotImplementedError


def check_policy(spec, policy):
    """Return the sorted list of spec fields that break the policy (an empty list when it complies).

    The policy may hold:
    - allowed_spark_versions: the spec's spark_version must be one of these;
    - max_workers: the largest worker count allowed (a spec with `autoscale` is judged by its
      max_workers, a fixed-size spec by its `num_workers`);
    - max_autotermination_minutes: the spec must set autotermination_minutes, and not above this.
    Report fields as "spark_version", "autoscale.max_workers" (or "num_workers") and
    "autotermination_minutes".
    """
    # TODO: compare each rule that is present in the policy
    raise NotImplementedError


def pick_compute(scheduled, sql_only):
    """Say which compute a workload belongs on: "sql_warehouse", "job_compute" or "all_purpose".

    SQL-only work goes to a warehouse, other scheduled work to its own job compute,
    and everything else is interactive.
    """
    # TODO: decide in that order
    raise NotImplementedError


def local_master(spec):
    """The local Spark master that gives one machine the same worker count as the spec.

    Use the spec's largest worker count (autoscale max_workers, else num_workers), as `local[N]`.
    """
    # TODO: build the master string
    raise NotImplementedError
