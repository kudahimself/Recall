# Landing files once

Topic: Auto Loader (cloudFiles, schema evolution) (Databricks, Incremental Data Processing).
Time: about 20 minutes.

## Task

Return files land in a folder each day, and a Bronze table should load each file exactly once.
Auto Loader is Databricks-only, so you write its settings and its schema decisions in plain Python, and load the files with the open-source file stream it is built on.
The four helpers go in `landing_loader.py`:

- `auto_loader_options(file_format, schema_location, schema_hints=None)` returns the `cloudFiles.*` reader options as a dict.
- `source_problems(reader_format, options, path)` names what is wrong with an Auto Loader source: the wrong format, a missing option or a legacy `/mnt` path.
- `evolve_schema(columns, incoming, mode="addNewColumns")` says what happens to the schema, and whether the stream stops, when a file brings a new column.
- `load_new_files(spark, landing, schema, target, checkpoint)` streams the new JSON files of a local folder into a table, with each row's file name.

## Examples

```python
auto_loader_options("json", chk, "copies INT")
# {"cloudFiles.format": "json", "cloudFiles.schemaLocation": chk, "cloudFiles.schemaHints": "copies INT"}
source_problems("json", opts, "/Volumes/main/library/landing")  # ["format"]
evolve_schema(["isbn"], ["isbn", "shelf"])                      # (["isbn", "shelf"], True)
```

Watch for the lesson's pitfall: `readStream.format("json")` is a plain file stream, not Auto Loader.
Auto Loader is always `.format("cloudFiles")` with the file type in `cloudFiles.format`, which is why `source_problems` reports `"format"`.

## What differs on Databricks

On Databricks you would pass the options to `spark.readStream.format("cloudFiles").options(**opts).load(path)` on a volume path, and Auto Loader would infer the schema, keep it in the schema location, evolve it and fill `_rescued_data` itself.
`evolve_schema` writes down that behaviour for the four `cloudFiles.schemaEvolutionMode` values; nothing here runs it.
Open-source Spark has no `cloudFiles` source, so `load_new_files` uses the plain JSON file stream with a schema you give: it also loads each file once through its checkpoint, but it neither infers nor evolves the schema, and a value that does not fit (`"two"` copies) becomes NULL with no rescued data column.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/auto_loader
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
