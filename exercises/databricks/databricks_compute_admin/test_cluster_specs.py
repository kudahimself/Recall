import pytest

import cluster_specs

POLICY = {
    "allowed_spark_versions": ["15.4.x-scala2.12"],
    "max_workers": 8,
    "max_autotermination_minutes": 120,
}


def shared(**changes):
    spec = cluster_specs.all_purpose_cluster("reading-room", "15.4.x-scala2.12", "vm-small", 4, 60)
    spec.update(changes)
    return spec


def test_job_cluster_autoscales_on_photon_and_has_no_idle_timeout():
    spec = cluster_specs.job_cluster("15.4.x-scala2.12", "vm-small", 2, 6)
    assert spec == {
        "spark_version": "15.4.x-scala2.12",
        "node_type_id": "vm-small",
        "autoscale": {"min_workers": 2, "max_workers": 6},
        "runtime_engine": "PHOTON",
    }


def test_all_purpose_cluster_stops_itself_and_uses_standard_access_mode():
    spec = cluster_specs.all_purpose_cluster("reading-room", "15.4.x-scala2.12", "vm-small", 4, 45)
    assert spec["cluster_name"] == "reading-room"
    assert spec["autoscale"] == {"min_workers": 1, "max_workers": 4}
    assert spec["autotermination_minutes"] == 45
    assert spec["data_security_mode"] == "USER_ISOLATION"


def test_all_purpose_cluster_idles_out_after_30_minutes_by_default():
    spec = cluster_specs.all_purpose_cluster("c", "15.4.x-scala2.12", "vm-small", 2)
    assert spec["autotermination_minutes"] == 30


def test_compliant_spec_has_no_violations():
    assert cluster_specs.check_policy(shared(), POLICY) == []


def test_policy_names_every_broken_field_sorted():
    spec = shared(spark_version="9.1.x-scala2.12", autotermination_minutes=600)
    spec["autoscale"] = {"min_workers": 1, "max_workers": 20}
    assert cluster_specs.check_policy(spec, POLICY) == [
        "autoscale.max_workers",
        "autotermination_minutes",
        "spark_version",
    ]


def test_missing_idle_timeout_breaks_the_autotermination_rule():
    spec = shared()
    del spec["autotermination_minutes"]
    assert cluster_specs.check_policy(spec, POLICY) == ["autotermination_minutes"]


def test_fixed_size_spec_is_judged_by_num_workers():
    spec = {"spark_version": "15.4.x-scala2.12", "num_workers": 12, "autotermination_minutes": 30}
    assert cluster_specs.check_policy(spec, POLICY) == ["num_workers"]


def test_rules_absent_from_the_policy_are_not_checked():
    assert cluster_specs.check_policy(shared(spark_version="old"), {"max_workers": 8}) == []


@pytest.mark.parametrize(
    "scheduled, sql_only, expected",
    [
        (False, True, "sql_warehouse"),
        (True, True, "sql_warehouse"),
        (True, False, "job_compute"),
        (False, False, "all_purpose"),
    ],
)
def test_pick_compute_matches_the_workload(scheduled, sql_only, expected):
    assert cluster_specs.pick_compute(scheduled, sql_only) == expected


def test_local_master_uses_the_largest_worker_count():
    assert cluster_specs.local_master({"autoscale": {"min_workers": 1, "max_workers": 4}}) == "local[4]"
    assert cluster_specs.local_master({"num_workers": 3}) == "local[3]"


def test_local_master_matches_the_session_the_tests_run_on(spark):
    assert spark.sparkContext.master == cluster_specs.local_master({"num_workers": 2})
