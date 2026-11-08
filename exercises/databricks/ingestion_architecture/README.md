# Loans in step with the source

Topic: Ingestion & Partitioning Architecture (batch vs streaming, formats, Liquid Clustering, CDC) (Databricks, Lakehouse Architecture & Engineering Practice).
Time: about 25 minutes.

## Task

A library copies its loans from the branch system into the lakehouse, and three design choices decide how: how often it ingests, how the table is laid out, and how the copy stays in step with the source.
You make each choice in `loan_sync.py`, and run the layout and the sync on local Delta tables:

- `pick_trigger(freshness_seconds, push_source)` returns the stream's trigger: a continuous stream only for a push source with a target of seconds, incremental batch otherwise.
- `choose_layout(table_gb, column, distinct_values)` returns `CLUSTER BY` or `PARTITIONED BY` for a column, by the lesson's rule for when partitions pay.
- `create_clustered(spark, table, keys)` creates the loans table with Liquid Clustering, and `recluster(spark, table, keys)` changes its keys in place.
- `apply_change_log(spark, table, changes)` applies the source's change log, the latest change of each loan only, in one `MERGE`.
- `snapshot_changes(old, new)` works out the changes from two snapshots when the source keeps no log.
- `sync_method(has_change_log, rows)` picks change log, snapshot diff or full reload.

## Examples

```python
pick_trigger(5, True)                        # {"processingTime": "5 seconds"}
pick_trigger(3600, True)                     # {"availableNow": True}: hourly is a scheduled batch
choose_layout(50, "event_time", 8760)        # "CLUSTER BY (event_time)"
choose_layout(5000, "country", 40)           # "PARTITIONED BY (country)": 5 TB, 125 GB a partition
# loans 1 leeds 03-10, 2 york 03-12; change log by seq: 2 U hull, 3 I leeds 03-15, 1 D, 3 U leeds 03-20
apply_change_log(spark, "loans", changes)    # loans 2 hull 03-12, 3 leeds 03-20
sync_method(False, 10**8)                    # "snapshot diff"
```

Watch for the lesson's pitfall: partitioning a small table by `year/month/day/hour` makes thousands of directories of tiny files.
Partition only a table over about 1 TB on a column with few values, at least 1 GB each, and cluster everything else; `choose_layout` encodes that rule.
In the change log, loan 3 changed twice: applying both rows would insert it twice, so keep each loan's highest `seq` first.

## What differs on Databricks

Liquid Clustering, `MERGE` and `DESCRIBE DETAIL` are open-source Delta Lake too, so the table and sync code run on Databricks unchanged.
On Databricks the files would land in a Unity Catalog volume and Auto Loader (`format("cloudFiles")`) would load them, with the `trigger` that `pick_trigger` returns; no stream runs in this exercise.
A Lakeflow pipeline can also apply a change log with `AUTO CDC`, which picks the latest change by a `SEQUENCE BY` column the way `apply_change_log` does by `seq`.
Databricks can also choose clustering keys itself (`CLUSTER BY AUTO`), which open-source Delta does not do.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/ingestion_architecture
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
