"""Plan the compaction: price an update both ways, pick files to compact, and work out what cleanup may delete.

A table is a list of data files, such as
    {"file": "f1", "rows": 1000, "size_mb": 120, "delete_files": 0}
where delete_files counts the merge-on-read delete files that point at it.
Fill in each function so the tests in test_compaction_plan.py pass.
Run them from this folder with: pytest
"""

# Cleanup refuses a shorter retention: readers and jobs that started earlier may still use the files.
MIN_RETENTION_HOURS = 168


def update_cost(files, changes):
    """What an update costs under copy-on-write and under merge-on-read.

    changes maps a file name to the rows the update changes in it.
    Copy-on-write rewrites every file holding a changed row, whole, and a scan reads the files as before.
    Merge-on-read writes a delete entry and a new version per changed row; a scan reads every base file,
    one delete file per touched file, and one file of new versions.
    Return {"cow": {"rows_written": ..., "files_per_scan": ...}, "mor": {...}}.
    """
    # TODO
    raise NotImplementedError


def plan_compaction(files, target_mb):
    """Group the files that need compaction into rewrites of at most target_mb each.

    A file needs compaction when it is under half of target_mb, or when delete files point at it.
    Take those files in list order, adding each to the current group while the group stays
    within target_mb, and start a new group when it would not.
    A group of one file with no delete files is dropped: rewriting it alone gains nothing.
    Return a list of groups, each a list of file names.
    """
    # TODO
    raise NotImplementedError


def files_to_clean(versions, now, retention_hours):
    """The files cleanup may delete, sorted.

    versions is the table's history in commit order: {"version": n, "committed_at": hour, "files": [...]}.
    A file may be deleted when the latest version does not hold it and the version that removed it
    committed more than retention_hours before now (hours are plain numbers).
    Raise ValueError for a retention under MIN_RETENTION_HOURS.
    """
    # TODO
    raise NotImplementedError
