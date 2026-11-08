"""Reference solution for cluster_specs.py: look only after your own tests pass."""


def job_cluster(spark_version, node_type_id, min_workers, max_workers):
    return {
        "spark_version": spark_version,
        "node_type_id": node_type_id,
        "autoscale": {"min_workers": min_workers, "max_workers": max_workers},
        "runtime_engine": "PHOTON",
    }


def all_purpose_cluster(cluster_name, spark_version, node_type_id, max_workers, idle_minutes=30):
    return {
        "cluster_name": cluster_name,
        "spark_version": spark_version,
        "node_type_id": node_type_id,
        "autoscale": {"min_workers": 1, "max_workers": max_workers},
        "autotermination_minutes": idle_minutes,
        "data_security_mode": "USER_ISOLATION",
    }


def _workers(spec):
    if "autoscale" in spec:
        return "autoscale.max_workers", spec["autoscale"]["max_workers"]
    return "num_workers", spec.get("num_workers", 0)


def check_policy(spec, policy):
    broken = []
    if "allowed_spark_versions" in policy and spec.get("spark_version") not in policy["allowed_spark_versions"]:
        broken.append("spark_version")
    if "max_workers" in policy:
        field, count = _workers(spec)
        if count > policy["max_workers"]:
            broken.append(field)
    if "max_autotermination_minutes" in policy:
        idle = spec.get("autotermination_minutes")
        if idle is None or idle > policy["max_autotermination_minutes"]:
            broken.append("autotermination_minutes")
    return sorted(broken)


def pick_compute(scheduled, sql_only):
    if sql_only:
        return "sql_warehouse"
    return "job_compute" if scheduled else "all_purpose"


def local_master(spec):
    return f"local[{_workers(spec)[1]}]"
