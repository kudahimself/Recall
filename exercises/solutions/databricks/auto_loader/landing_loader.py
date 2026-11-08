"""Reference solution for landing_loader.py: look only after your own tests pass."""


def auto_loader_options(file_format, schema_location, schema_hints=None):
    options = {"cloudFiles.format": file_format, "cloudFiles.schemaLocation": schema_location}
    if schema_hints:
        options["cloudFiles.schemaHints"] = schema_hints
    if file_format == "csv":
        options["header"] = "true"
    return options


def source_problems(reader_format, options, path):
    problems = []
    if reader_format != "cloudFiles":
        problems.append("format")
    for key in ("cloudFiles.format", "cloudFiles.schemaLocation"):
        if key not in options:
            problems.append(key)
    if path.startswith(("/mnt/", "dbfs:/mnt/")):
        problems.append("path")
    return sorted(problems)


def evolve_schema(columns, incoming, mode="addNewColumns"):
    new = [c for c in incoming if c not in columns]
    if not new:
        return list(columns), False
    if mode == "addNewColumns":
        return list(columns) + new, True
    return list(columns), mode == "failOnNewColumns"


def load_new_files(spark, landing, schema, target, checkpoint):
    (spark.readStream.format("json").schema(schema).load(landing)
        .select("*", "_metadata.file_name")
        .writeStream.option("checkpointLocation", checkpoint)
        .trigger(availableNow=True)
        .toTable(target)
        .awaitTermination())
