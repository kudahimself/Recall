# Databricks exercises

Each one runs on PySpark on your own laptop: there is no Databricks workspace, cluster or cloud storage.
`spark_setup.py` starts a small local Spark session with Delta Lake switched on, and every exercise folder's `conftest.py` hands it to the tests as the `spark` fixture.
Leave both alone.

## Setup (once)

Do the setup in `exercises/README.md`, then:

1. Install Java 17 or newer and check `java -version` prints it (Spark runs on the JVM).
   If Spark cannot find it, set `JAVA_HOME`.
2. `pip install -r exercises/requirements.txt` installs `pyspark` and `delta-spark`, pinned to versions that go together.
   Python 3.10 to 3.12 is the safe range for them.

The first test run starts Spark (10 to 20 seconds) and downloads the Delta jars once from Maven Central, so it needs the internet that one time.
After that every run is offline.

## What differs on Databricks

A Databricks notebook already has a `spark` session, Unity Catalog, `dbutils`, Auto Loader and Photon; none of those exist in open-source Spark.
Where a topic is Databricks-only, the exercise practises the same decision on something that runs here (a config you write, a path you parse, an open-source table feature) and its README says what the platform does instead.
Nothing here pretends to be a Databricks API.
