"""Starter: stream a `checkouts` Delta table into other tables, a batch at a time. Fill in each TODO.

Every query here reads a Delta table with `spark.readStream`, writes a Delta table with
`writeStream ... .toTable(...)`, processes only what is waiting (`availableNow`) and
waits for that to finish before returning, so the next line sees the result.
"""


def pick_output_mode(aggregates, only_changed=False):
    """Return the output mode a query needs: "append", "update" or "complete".

    A query with no aggregation only ever adds new result rows.
    An aggregation's earlier results can change: write only the changed rows when
    `only_changed` is True, and otherwise rewrite the whole result each batch.
    """
    # TODO: decide from the two flags
    raise NotImplementedError


def copy_new_checkouts(spark, source, target, checkpoint):
    """Append every checkout in `source` (branch, isbn) that has not been copied yet to `target`.

    Run once over the rows waiting, wait for the run to end, and keep the query's progress in
    the `checkpoint` folder, so a second call copies only the rows inserted since the first.
    """
    # TODO: readStream the table, writeStream in append mode with the checkpoint and an availableNow trigger
    raise NotImplementedError


def refresh_branch_counts(spark, source, target, checkpoint):
    """Keep `target` holding one row per branch of `source` with its checkout `count`.

    Each call processes only the new checkouts, adds them to the stored counts and
    rewrites the result table.
    """
    # TODO: a groupBy count on the stream, written in the output mode an aggregation needs
    raise NotImplementedError


def unique_events(events):
    """Drop repeated deliveries from a streaming DataFrame of returns (event_id, isbn, ts).

    The same event can arrive twice with the same event_id and ts.
    Keep one of each, and let Spark forget events more than 10 minutes older than the
    newest `ts` it has seen, so the state it keeps for this does not grow forever.
    """
    # TODO: a watermark on ts, then drop duplicates on the event's identifying columns
    raise NotImplementedError
