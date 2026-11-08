"""Reference solution for checkout_stream.py: look only after your own tests pass."""


def pick_output_mode(aggregates, only_changed=False):
    if not aggregates:
        return "append"
    return "update" if only_changed else "complete"


def copy_new_checkouts(spark, source, target, checkpoint):
    (spark.readStream.table(source)
        .writeStream.outputMode("append")
        .option("checkpointLocation", checkpoint)
        .trigger(availableNow=True)
        .toTable(target)
        .awaitTermination())


def refresh_branch_counts(spark, source, target, checkpoint):
    (spark.readStream.table(source)
        .groupBy("branch").count()
        .writeStream.outputMode("complete")
        .option("checkpointLocation", checkpoint)
        .trigger(availableNow=True)
        .toTable(target)
        .awaitTermination())


def unique_events(events):
    return events.withWatermark("ts", "10 minutes").dropDuplicates(["event_id", "ts"])
