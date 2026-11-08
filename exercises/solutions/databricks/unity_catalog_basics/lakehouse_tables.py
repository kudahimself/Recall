"""Reference solution for lakehouse_tables.py: look only after your own tests pass."""
import os
from urllib.parse import urlparse


def split_name(full_name):
    parts = full_name.split(".")
    if len(parts) != 3 or not all(parts):
        raise ValueError(f"expected catalog.schema.table, got {full_name!r}")
    return tuple(parts)


def create_managed(spark, table):
    spark.sql(f"CREATE TABLE {table} (member_id INT, city STRING) USING DELTA")


def create_external(spark, table, location):
    spark.sql(f"CREATE TABLE {table} (member_id INT, city STRING) USING DELTA LOCATION '{location}'")


def _detail(spark, table, row):
    rows = spark.sql(f"DESCRIBE TABLE EXTENDED {table}").filter(f"col_name = '{row}'").collect()
    return rows[0]["data_type"]


def table_kind(spark, table):
    return _detail(spark, table, "Type")


def table_location(spark, table):
    return urlparse(_detail(spark, table, "Location")).path


def drop_removes_files(spark, table):
    location = table_location(spark, table)
    spark.sql(f"DROP TABLE {table}")
    return not os.path.exists(location)
