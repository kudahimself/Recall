"""Reference solution for member_versions.py: look only after your own tests pass."""


def create_dim_member(spark, table):
    spark.sql(f"""
        CREATE TABLE {table} (
            member_sk BIGINT, member_id STRING, branch STRING,
            valid_from DATE, valid_to DATE, is_current BOOLEAN
        )
    """)


def apply_type2(spark, table, staging, load_day):
    staging.createOrReplaceTempView("stg_member")
    spark.sql(f"""
        MERGE INTO {table} d USING stg_member s
        ON d.member_id = s.member_id AND d.is_current AND d.branch <> s.branch
        WHEN MATCHED THEN UPDATE SET valid_to = DATE'{load_day}', is_current = false
    """)
    spark.sql(f"""
        INSERT INTO {table}
        SELECT
            (SELECT COALESCE(MAX(member_sk), 0) FROM {table})
                + ROW_NUMBER() OVER (ORDER BY s.member_id),
            s.member_id, s.branch, DATE'{load_day}', NULL, true
        FROM stg_member s
        LEFT JOIN {table} d ON d.member_id = s.member_id AND d.is_current
        WHERE d.member_id IS NULL
    """)


def member_sk_on(spark, table, member_id, day):
    row = spark.sql(f"""
        SELECT member_sk FROM {table}
        WHERE member_id = '{member_id}' AND valid_from <= DATE'{day}'
          AND (valid_to IS NULL OR DATE'{day}' < valid_to)
    """).first()
    return None if row is None else row["member_sk"]


def loans_by_branch(spark, loans, table):
    rows = (
        loans.join(spark.table(table), "member_sk")
        .groupBy("branch").count().orderBy("branch").collect()
    )
    return [(r["branch"], r["count"]) for r in rows]


def fix_emails(spark, table, staging):
    staging.createOrReplaceTempView("stg_email")
    spark.sql(f"""
        MERGE INTO {table} t USING stg_email s ON t.member_id = s.member_id
        WHEN MATCHED THEN UPDATE SET t.email = s.email
        WHEN NOT MATCHED THEN INSERT (member_id, email) VALUES (s.member_id, s.email)
    """)
