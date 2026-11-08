"""Reference solution for volume_paths.py: look only after your own tests pass."""
import importlib
import os
import sys


def classify_path(path):
    if path.startswith("/Volumes/"):
        return "volume"
    if path.startswith(("dbfs:/", "/dbfs/", "/mnt/")):
        return "dbfs"
    if path.startswith(("abfss://", "s3://", "gs://")):
        return "cloud"
    return "local"


def volume_path(catalog, schema, volume, *parts):
    return "/".join(["/Volumes", catalog, schema, volume, *[p.strip("/") for p in parts]]).rstrip("/")


def parse_volume_path(path):
    if not path.startswith("/Volumes/"):
        raise ValueError(f"not a volume path: {path!r}")
    parts = path[len("/Volumes/"):].split("/", 3)
    if len(parts) < 3 or not all(parts[:3]):
        raise ValueError(f"needs catalog, schema and volume: {path!r}")
    return parts[0], parts[1], parts[2], parts[3] if len(parts) == 4 else ""


def ls_names(folder):
    return sorted(e.name + ("/" if e.is_dir() else "") for e in os.scandir(folder))


def count_csv_rows(spark, path):
    return spark.read.option("header", "true").csv(str(path)).count()


def import_from_repo(repo_root, module, attribute):
    sys.path.insert(0, str(repo_root))
    importlib.invalidate_caches()
    return getattr(importlib.import_module(module), attribute)
