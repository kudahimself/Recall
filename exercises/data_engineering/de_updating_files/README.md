# Plan the compaction

Topic: Updating Files: Copy-on-Write, Merge-on-Read & Cleanup (Data Engineering, Warehouses, Lakes & Table Formats).
Time: about 20 minutes.

## Task

A table format never edits a data file: every change writes new files and commits a version that swaps them in.
You look after an orders table that takes small updates all day, and you have to decide how it is updated, when it is compacted, and what cleanup may delete.
Fill in the three functions in `compaction_plan.py`:

- `update_cost(files, changes)` prices one update both ways: rows written, and files a scan then reads.
- `plan_compaction(files, target_mb)` picks the small files and the files with delete files, and packs them into rewrites of about the target size.
- `files_to_clean(versions, now, retention_hours)` lists the files that no version inside the retention still needs.

Plain Python: the file list and the version history are lists of dicts, as a table format's metadata would give them.

## Examples

```python
update_cost(LESSON_FILES, {"f1": 2, "f3": 5})
# {"cow": {"rows_written": 2000, "files_per_scan": 4},
#  "mor": {"rows_written": 14, "files_per_scan": 7}}
plan_compaction([f("a", 30), f("b", 40), f("c", 120), f("d", 50), f("e", 20), f("f", 10)], 128)
# [["a", "b", "d"], ["e", "f"]]: c is big enough already
files_to_clean(HISTORY, now=400, retention_hours=168)
# ["f1", "f3"]: removed at hour 100; the files version 3 removed at hour 400 stay for now
```

Watch for the lesson's pitfall: a delete or a compaction only adds a version, so the old files stay on storage until cleanup.
And setting the retention near zero deletes files that a running job or yesterday's version still reads, which is why `files_to_clean` refuses a retention under `MIN_RETENTION_HOURS`.

## Run the tests

```bash
cd exercises/data_engineering/de_updating_files
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
