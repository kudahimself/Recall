"""Plan the compaction: reference solution."""

MIN_RETENTION_HOURS = 168


def update_cost(files, changes):
    """What an update costs under copy-on-write and under merge-on-read."""
    touched = [f for f in files if changes.get(f["file"], 0) > 0]
    changed = sum(changes.get(f["file"], 0) for f in files)
    return {
        "cow": {"rows_written": sum(f["rows"] for f in touched), "files_per_scan": len(files)},
        "mor": {
            "rows_written": 2 * changed,
            "files_per_scan": len(files) + len(touched) + (1 if touched else 0),
        },
    }


def needs_compaction(f, target_mb):
    """True for a file under half the target size, or one with delete files to fold in."""
    return f["size_mb"] < target_mb / 2 or f["delete_files"] > 0


def plan_compaction(files, target_mb):
    """Group the files that need compaction into rewrites of at most target_mb each."""
    groups, current, size = [], [], 0
    for f in files:
        if not needs_compaction(f, target_mb):
            continue
        if current and size + f["size_mb"] > target_mb:
            groups.append(current)
            current, size = [], 0
        current.append(f)
        size += f["size_mb"]
    if current:
        groups.append(current)
    worth_it = [g for g in groups if len(g) > 1 or g[0]["delete_files"] > 0]
    return [[f["file"] for f in g] for g in worth_it]


def files_to_clean(versions, now, retention_hours):
    """The files cleanup may delete: out of the latest version and removed longer ago than the retention."""
    if retention_hours < MIN_RETENTION_HOURS:
        raise ValueError(f"retention of {retention_hours} hours is under {MIN_RETENTION_HOURS}")
    cutoff = now - retention_hours
    removed_at = {}
    for before, after in zip(versions, versions[1:]):
        for name in set(before["files"]) - set(after["files"]):
            removed_at[name] = after["committed_at"]
        for name in after["files"]:
            removed_at.pop(name, None)
    return sorted(name for name, at in removed_at.items() if at < cutoff)
