# Holdings changes in Delta

Topic: Delta Operations (MERGE, CLONE) (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

The library keeps a `holdings` Delta table of `(isbn, copies)`.
You write five helpers in `holdings_delta.py` that change it with Delta SQL, each run through `spark.sql`:

- `apply_delivery(spark, table, delivery)` upserts a delivery DataFrame: copies are added to ISBNs already held, and new ISBNs are inserted.
- `write_off(spark, table, isbn, lost)` subtracts lost copies from one ISBN with an `UPDATE`.
- `drop_empty(spark, table)` removes the rows with no copies left with a `DELETE`.
- `mirror_catalogue(spark, table, catalogue)` makes the table match a catalogue DataFrame in one `MERGE`: update, insert, and delete the ISBNs the catalogue lacks.
- `make_copy(spark, table, copy_name)` makes a shallow clone of the table: metadata only, reading the source's data files.

## Examples

```python
# holdings: A1 has 2 copies, B2 has 5, C3 has 1
apply_delivery(spark, "holdings", delivery)   # delivery: A1 x3, D4 x4  ->  A1 5, B2 5, C3 1, D4 4
write_off(spark, "holdings", "B2", 2)         # B2 now has 3
drop_empty(spark, "holdings")                 # rows at 0 copies disappear
make_copy(spark, "holdings", "holdings_dev")  # a shallow clone to experiment on
```

Watch for the lesson's pitfall: `MERGE` only touches the rows a clause names, so a target row the source lacks stays unless you add `WHEN NOT MATCHED BY SOURCE THEN DELETE`.

## What differs on Databricks

The same SQL runs on Databricks against Unity Catalog tables such as `main.library.holdings`, where `UPDATE`, `DELETE`, `MERGE` and `CLONE` need the matching privileges on the table.
Here the tables live in a throwaway local warehouse and are named without a catalog.
Open-source Delta supports `SHALLOW CLONE` but not `DEEP CLONE`, which is a Databricks feature that copies the data files too, so you practise the shallow clone only.
Databricks also runs MERGE on Photon and can use deletion vectors to make UPDATE and DELETE cheaper, which changes speed but not the results you test here.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/delta_operations
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
