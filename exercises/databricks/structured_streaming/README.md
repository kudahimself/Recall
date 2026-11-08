# Checkouts on a stream

Topic: Structured Streaming (readStream, writeStream, triggers) (Databricks, Incremental Data Processing).
Time: about 20 minutes.

## Task

A `checkouts` Delta table of `(branch, isbn)` keeps growing, and other tables should follow it without rereading it.
You write four helpers in `checkout_stream.py`, and the tests run each streaming query on a local Delta table:

- `pick_output_mode(aggregates, only_changed=False)` returns `"append"`, `"update"` or `"complete"` for a query.
- `copy_new_checkouts(spark, source, target, checkpoint)` appends the rows not copied yet to `target`, so a second call copies only the new ones.
- `refresh_branch_counts(spark, source, target, checkpoint)` keeps one count per branch, adding each run's new checkouts to the stored totals.
- `unique_events(events)` drops repeated deliveries from a stream of returns, with a watermark so its state stays small.

Both writers process what is waiting and stop (`availableNow`), and wait for the run to end before returning.

## Examples

```python
pick_output_mode(aggregates=True)                     # "complete"
copy_new_checkouts(spark, "checkouts", "copies", chk)  # copies has the 2 checkouts so far
# two more checkouts arrive
copy_new_checkouts(spark, "checkouts", "copies", chk)  # copies has 4, not 6
```

Watch for the lesson's pitfall: the checkpoint is the query's memory.
Pass the same folder on every run of one query and a different folder for each query, or a run starts over and reads the whole source again.

## What differs on Databricks

On Databricks the tables would be Unity Catalog tables and the checkpoint a folder in a volume, such as `/Volumes/main/library/chk/counts`.
The streaming API is the same open-source Structured Streaming, so this code runs there unchanged.
A job usually runs such a query on a schedule with `availableNow`, or keeps it running with a `processingTime` trigger, where here each test starts and ends it.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/structured_streaming
pytest
```

The first run starts Spark and takes a little while, and each streaming query takes a few seconds more.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
