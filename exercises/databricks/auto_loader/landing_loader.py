"""Starter: Auto Loader settings, checked in plain Python, and a local file stream. Fill in each TODO."""


def auto_loader_options(file_format, schema_location, schema_hints=None):
    """Return the reader options of an Auto Loader stream as a dict of strings.

    Always set the file type (`cloudFiles.format`) and where the inferred schema is kept
    (`cloudFiles.schemaLocation`). Add `cloudFiles.schemaHints` only when hints are given,
    and for "csv" files also the CSV reader's own `header` option, set to "true".
    """
    # TODO: build the dict
    raise NotImplementedError


def source_problems(reader_format, options, path):
    """Return the sorted list of problems with an Auto Loader source (an empty list when it is right).

    Report:
    - "format" when the reader format is not Auto Loader's own;
    - "cloudFiles.format" or "cloudFiles.schemaLocation" when that option is missing;
    - "path" when the path is a legacy DBFS mount (it starts with "/mnt/" or "dbfs:/mnt/").
    """
    # TODO: check each rule
    raise NotImplementedError


def evolve_schema(columns, incoming, mode="addNewColumns"):
    """Say what a stream does when a file brings columns, `incoming`, the schema `columns` lacks.

    Return (columns after, stops), where `columns after` is a list and `stops` says whether
    the stream stops. With no new column nothing changes and the stream goes on. Otherwise:
    - "addNewColumns": the new columns are added at the end, in the order they came, and the stream stops once;
    - "rescue": the schema stays the same, the stream goes on, and the values go to `_rescued_data`;
    - "failOnNewColumns": the schema stays the same and the stream stops;
    - "none": the schema stays the same, the stream goes on, and the new columns are ignored.
    """
    # TODO: find the new columns, then decide by mode
    raise NotImplementedError


def load_new_files(spark, landing, schema, target, checkpoint):
    """Append the rows of the JSON files in the `landing` folder not loaded yet to the `target` table.

    Read the folder as a stream with the given schema, add the name of each row's source file
    as a `file_name` column, process what is waiting and wait for the run to end.
    The checkpoint keeps the list of files done, so a second call loads only new files.
    """
    # TODO: a JSON file stream (local Spark has no cloudFiles), the file name from _metadata, an availableNow write
    raise NotImplementedError
