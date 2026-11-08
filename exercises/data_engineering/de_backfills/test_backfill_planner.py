from backfill_planner import backfill_days, schedule, tables_to_rebuild

DEPS = {
    "orders_clean": ["orders_raw"],
    "daily_sales": ["orders_clean"],
    "customer_ltv": ["orders_clean"],
    "exec_dashboard": ["daily_sales", "customer_ltv"],
    "stock_levels": ["stock_raw"],
}

DAYS = ["2026-11-01", "2026-11-02", "2026-11-03"]


def test_backfill_days_covers_the_range_inclusive():
    assert backfill_days("2026-11-01", "2026-11-03", "2026-01-01") == (DAYS, [])
    assert backfill_days("2026-11-02", "2026-11-02", "2026-01-01") == (["2026-11-02"], [])


def test_backfill_days_cannot_reach_before_the_raw_retention():
    assert backfill_days("2026-10-30", "2026-11-02", "2026-11-01") == (
        ["2026-11-01", "2026-11-02"],
        ["2026-10-30", "2026-10-31"],
    )
    assert backfill_days("2026-10-01", "2026-10-02", "2026-11-01") == ([], ["2026-10-01", "2026-10-02"])


def test_backfill_days_crosses_month_ends():
    days, _ = backfill_days("2026-02-27", "2026-03-01", "2026-01-01")
    assert days == ["2026-02-27", "2026-02-28", "2026-03-01"]


def test_tables_to_rebuild_are_the_fixed_table_and_its_downstream_upstream_first():
    assert tables_to_rebuild(DEPS, "orders_clean") == [
        "orders_clean", "customer_ltv", "daily_sales", "exec_dashboard",
    ]
    assert tables_to_rebuild(DEPS, "daily_sales") == ["daily_sales", "exec_dashboard"]
    assert tables_to_rebuild(DEPS, "stock_levels") == ["stock_levels"]


def test_a_table_waits_for_every_rebuilt_table_it_reads():
    deps = {"b": ["a"], "c": ["a", "b"], "d": ["c"]}
    assert tables_to_rebuild(deps, "a") == ["a", "b", "c", "d"]
    deps = {"z_wide": ["a"], "m_mid": ["a"], "out": ["z_wide", "m_mid"]}
    assert tables_to_rebuild(deps, "a") == ["a", "m_mid", "z_wide", "out"]


def test_independent_days_run_together_downstream_after_upstream():
    assert schedule(DEPS, "orders_clean", DAYS) == [
        [("orders_clean", d) for d in DAYS],
        sorted([("customer_ltv", d) for d in DAYS] + [("daily_sales", d) for d in DAYS]),
        [("exec_dashboard", d) for d in DAYS],
    ]


def test_a_table_that_reads_the_day_before_runs_in_date_order():
    deps = {"daily_sales": ["orders_clean"], "running_balance": ["daily_sales"]}
    assert schedule(deps, "daily_sales", DAYS, reads_previous_day={"running_balance"}) == [
        [("daily_sales", d) for d in DAYS],
        [("running_balance", "2026-11-01")],
        [("running_balance", "2026-11-02")],
        [("running_balance", "2026-11-03")],
    ]


def test_a_sequential_table_holds_back_only_what_reads_it():
    deps = {"balance": ["ledger"], "report": ["balance"], "audit": ["ledger"]}
    waves = schedule(deps, "ledger", ["2026-11-01", "2026-11-02"], reads_previous_day={"balance"})
    assert waves == [
        [("ledger", "2026-11-01"), ("ledger", "2026-11-02")],
        [("audit", "2026-11-01"), ("audit", "2026-11-02"), ("balance", "2026-11-01")],
        [("balance", "2026-11-02"), ("report", "2026-11-01")],
        [("report", "2026-11-02")],
    ]


def test_every_job_is_scheduled_once():
    waves = schedule(DEPS, "orders_clean", DAYS, reads_previous_day={"customer_ltv"})
    jobs = [job for wave in waves for job in wave]
    assert len(jobs) == len(set(jobs)) == 4 * len(DAYS)
