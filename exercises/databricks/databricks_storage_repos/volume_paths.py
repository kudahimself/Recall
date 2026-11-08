"""Path handling for files, volumes and Git folders: fill in the TODOs."""


def classify_path(path):
    """Say where a path points: "volume", "dbfs", "cloud" or "local".

    - "volume": starts with /Volumes/
    - "dbfs": the legacy layer, starting with dbfs:/, /dbfs/ or /mnt/
    - "cloud": a storage URI starting with abfss://, s3:// or gs://
    - "local": anything else, such as file:/tmp/x or /tmp/x
    """
    # TODO: look at how the path starts
    raise NotImplementedError


def volume_path(catalog, schema, volume, *parts):
    """Build /Volumes/<catalog>/<schema>/<volume>/<parts...>, with no trailing slash."""
    # TODO: join the pieces
    raise NotImplementedError


def parse_volume_path(path):
    """Split a volume path into (catalog, schema, volume, relative), relative being "" for the volume root.

    Raise ValueError when the path is not a volume path or is missing the catalog, schema or volume.
    """
    # TODO: strip the /Volumes/ prefix and split the rest
    raise NotImplementedError


def ls_names(folder):
    """Return the sorted entry names of a folder the way `dbutils.fs.ls` shows them: folders end with "/".

    `folder` is a local directory path (str or Path).
    """
    # TODO: list the folder and mark the sub-folders
    raise NotImplementedError


def count_csv_rows(spark, path):
    """Read a CSV file or folder with a header row using Spark and return its row count."""
    # TODO: use the Spark reader, not open()
    raise NotImplementedError


def import_from_repo(repo_root, module, attribute):
    """Import `module` from a Git folder's repository root and return its `attribute`.

    A Git folder puts the repository root on `sys.path`, so `from helpers.utils import fn` works in a notebook.
    Do the same for `repo_root`, a local directory path.
    """
    # TODO: put the root on sys.path, then import
    raise NotImplementedError
