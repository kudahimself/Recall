"""Reference solution for workspace_names.py: look only after your own tests pass."""


def qualify(ref, catalog, schema):
    parts = ref.split(".")
    if len(parts) > 3:
        raise ValueError(f"too many parts in {ref!r}")
    return ".".join([catalog, schema][: 3 - len(parts)] + parts)


def apply_use(current, statement):
    words = statement.split()
    if len(words) == 3 and [w.upper() for w in words[:2]] == ["USE", "CATALOG"]:
        return (words[2], "default")
    if len(words) == 3 and [w.upper() for w in words[:2]] == ["USE", "SCHEMA"]:
        return (current[0], words[2])
    raise ValueError(f"not a USE statement: {statement!r}")


def grant_sql(privilege, kind, target, principal):
    return f"GRANT {privilege} ON {kind} {target} TO `{principal}`"


def create_loans(spark, schema, rows):
    spark.sql(f"CREATE SCHEMA IF NOT EXISTS {schema}")
    spark.createDataFrame(rows, ["loan_id", "title"]).write.mode("overwrite").saveAsTable(f"{schema}.loans")
    return spark.sql(f"DESCRIBE DETAIL {schema}.loans").first()["format"]


def list_tables(spark, schema):
    rows = spark.sql(f"SHOW TABLES IN {schema}").collect()
    return sorted(r["tableName"] for r in rows if not r["isTemporary"])


def save_query(spark, view, query):
    spark.sql(f"CREATE OR REPLACE TEMP VIEW {view} AS {query}")
    return spark.table(view).count()
