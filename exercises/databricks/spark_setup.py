"""The local Spark session every Databricks exercise's tests share.

Each exercise folder holds a conftest.py that imports the `spark` fixture from here, so
its tests run on your own laptop with no Databricks workspace, cluster or cloud storage:

- Spark runs in local mode (`local[2]`), small and quick to start;
- Delta Lake is switched on the way open-source Spark does it (the Delta SQL extension
  and catalog) and is the default table format, as on Databricks, so MERGE, time travel
  and OPTIMIZE all work;
- tables you save go to a temporary warehouse folder that is deleted when the run ends.

The session starts once per pytest run, which takes 10 to 20 seconds.
The very first run also downloads the Delta jars (a few MB) from Maven Central;
after that everything works offline.
Needs Java 17 or newer on the PATH (or JAVA_HOME) and the packages in requirements.txt.
"""
import shutil
import tempfile
from pathlib import Path

import pytest

_session = None
_warehouse = None


def _builder():
    from pyspark.sql import SparkSession

    global _warehouse
    _warehouse = tempfile.mkdtemp(prefix="recall-spark-")
    builder = (
        SparkSession.builder.master("local[2]")
        .appName("recall-exercises")
        .config("spark.driver.host", "127.0.0.1")
        .config("spark.driver.bindAddress", "127.0.0.1")
        .config("spark.ui.enabled", "false")
        .config("spark.ui.showConsoleProgress", "false")
        .config("spark.sql.shuffle.partitions", "2")
        .config("spark.default.parallelism", "2")
        .config("spark.sql.session.timeZone", "UTC")
        .config("spark.driver.extraJavaOptions", "-Duser.timezone=UTC")
        .config("spark.sql.warehouse.dir", str(Path(_warehouse) / "warehouse"))
        .config("spark.databricks.delta.snapshotPartitions", "2")
        .config("spark.databricks.delta.retentionDurationCheck.enabled", "true")
        .config("spark.sql.sources.default", "delta")
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    )
    from delta import configure_spark_with_delta_pip

    return configure_spark_with_delta_pip(builder)


def get_spark():
    """The shared SparkSession, started on first use."""
    global _session
    if _session is None:
        try:
            _session = _builder().getOrCreate()
        except Exception as error:  # pragma: no cover - environment problems
            pytest.fail(
                "Could not start local Spark. Check that Java 17 or newer is installed "
                "(run `java -version`) and that `pip install -r exercises/requirements.txt` has run.\n"
                f"{type(error).__name__}: {error}",
                pytrace=False,
            )
        _session.sparkContext.setLogLevel("ERROR")
    return _session


def stop_spark():
    global _session
    if _session is not None:
        _session.stop()
        _session = None
    if _warehouse:
        shutil.rmtree(_warehouse, ignore_errors=True)


@pytest.fixture(scope="session")
def spark():
    """A local SparkSession (Delta enabled) for the whole test run."""
    session = get_spark()
    yield session
    stop_spark()
