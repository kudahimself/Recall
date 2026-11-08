import re

import pytest
from pyspark.sql import functions as F

import shop_joins as sj

SHOPS = [(0, "leeds"), (1, "york"), (2, "leeds"), (3, "hull")]


@pytest.fixture
def sales(spark):
    return spark.range(0, 1200, numPartitions=4).select(
        (F.col("id") % 4).alias("shop_id"), (F.col("id") % 3 + 1).alias("qty")
    )


@pytest.fixture
def shops(spark):
    return spark.createDataFrame(SHOPS, "shop_id BIGINT, city STRING")


@pytest.fixture
def no_auto_broadcast(spark):
    """Switch off Spark's own choice of broadcast joins for one test, then put it back."""
    old = spark.conf.get("spark.sql.autoBroadcastJoinThreshold")
    spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")
    yield
    spark.conf.set("spark.sql.autoBroadcastJoinThreshold", old)


def cached_rdds(spark):
    """{rdd id: (cached partitions, partitions)} for every RDD Spark holds in its cache right now."""
    infos = spark.sparkContext._jsc.sc().getRDDStorageInfo()
    return {i.id(): (i.numCachedPartitions(), i.numPartitions()) for i in infos}


def test_join_shops_gives_each_sale_its_city(sales, shops):
    joined = sj.join_shops(sales, shops)
    by_city = {r.city: r.qty for r in joined.groupBy("city").agg(F.sum("qty").alias("qty")).collect()}
    assert joined.count() == 1200
    assert by_city == {"leeds": 1200, "york": 600, "hull": 600}


def test_join_shops_broadcasts_even_when_spark_would_not(sales, shops, no_auto_broadcast):
    assert "BroadcastHashJoin" in sj.plan_text(sj.join_shops(sales, shops))


def test_join_strategy_names_the_join_in_the_plan(sales, shops, no_auto_broadcast):
    assert sj.join_strategy(sales.join(shops, "shop_id")) == "sort-merge"
    assert sj.join_strategy(sales.join(F.broadcast(shops), "shop_id")) == "broadcast"


def test_spark_broadcasts_a_small_table_by_itself(sales, shops):
    assert sj.join_strategy(sales.join(shops, "shop_id")) == "broadcast"


def test_join_strategy_rejects_a_plan_with_no_join(sales):
    with pytest.raises(ValueError):
        sj.join_strategy(sales)


def test_cache_for_reuse_fills_the_cache_and_release_frees_it(spark, sales, shops):
    before = cached_rdds(spark)
    sold = sales.join(F.broadcast(shops), "shop_id")
    assert sj.cache_for_reuse(sold) is sold
    try:
        assert sold.is_cached
        added = {k: v for k, v in cached_rdds(spark).items() if k not in before}
        assert added and all(cached == total for cached, total in added.values()), (
            "cache() alone stores nothing: run an action that reads every partition"
        )
        assert "InMemoryTableScan" in sj.plan_text(sold.groupBy("city").count())
    finally:
        sj.release(sold)
    assert not sold.is_cached
    assert set(cached_rdds(spark)) <= set(before)


def test_resize_merges_without_a_shuffle_when_lowering(sales):
    fewer = sj.resize(sales, 2)
    assert fewer.rdd.getNumPartitions() == 2
    assert "Exchange" not in sj.plan_text(fewer)
    assert fewer.count() == 1200


def test_resize_shuffles_when_raising(sales):
    more = sj.resize(sales, 8)
    assert more.rdd.getNumPartitions() == 8
    assert "Exchange" in sj.plan_text(more)


def test_resize_leaves_the_same_count_alone_and_rejects_zero(sales):
    assert sj.resize(sales, 4) is sales
    with pytest.raises(ValueError):
        sj.resize(sales, 0)


def test_spread_by_keeps_each_shop_in_one_partition(sales):
    spread = sj.spread_by(sales, 3, "shop_id")
    assert spread.rdd.getNumPartitions() == 3
    rows = spread.select("shop_id", F.spark_partition_id().alias("p")).distinct().collect()
    assert sorted(r.shop_id for r in rows) == [0, 1, 2, 3]


@pytest.fixture
def visits(spark):
    rows = [(1, "2026-03-01"), (2, "2026-03-01"), (3, "2026-03-02"), (4, "2026-03-03")]
    return spark.createDataFrame(rows, "visit_id INT, visit_day STRING")


def test_write_by_day_makes_one_directory_per_day(spark, visits):
    sj.write_by_day(visits, "opt_visits", "visit_day")
    detail = spark.sql("DESCRIBE DETAIL opt_visits").first()
    assert detail.partitionColumns == ["visit_day"]
    sj.write_by_day(visits.limit(1), "opt_visits", "visit_day")
    assert spark.table("opt_visits").count() == 1


def test_read_day_reads_only_that_days_directory(spark, visits):
    sj.write_by_day(visits, "opt_visits_pruned", "visit_day")
    day = sj.read_day(spark, "opt_visits_pruned", "visit_day", "2026-03-01")
    assert sorted(r.visit_id for r in day.collect()) == [1, 2]
    filters = re.search(r"PartitionFilters: \[([^\]]*)\]", sj.plan_text(day))
    assert filters and "visit_day" in filters.group(1)
