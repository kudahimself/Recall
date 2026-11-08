"""Reference solution for daily_counts.py: look only after your own tests pass."""
from datetime import date, timedelta


def append_new(spark, target, staging):
    staging.createOrReplaceTempView("stg_loans")
    spark.sql(f"""
        MERGE INTO {target} t USING stg_loans s ON t.loan_id = s.loan_id
        WHEN NOT MATCHED THEN INSERT *
    """)


def rebuild_day(spark, raw, summary, day):
    spark.sql(f"""
        INSERT INTO {summary} REPLACE WHERE loan_day = DATE'{day}'
        SELECT loan_day, branch, COUNT(*) AS loans
        FROM {raw} WHERE loan_day = DATE'{day}'
        GROUP BY loan_day, branch
    """)


def backfill(spark, raw, summary, first_day, last_day):
    day, last = date.fromisoformat(first_day), date.fromisoformat(last_day)
    done = []
    while day <= last:
        rebuild_day(spark, raw, summary, day.isoformat())
        done.append(day.isoformat())
        day += timedelta(days=1)
    return done


def rebuild_trailing(spark, raw, summary, run_day, days=3):
    first = date.fromisoformat(run_day) - timedelta(days=days - 1)
    return backfill(spark, raw, summary, first.isoformat(), run_day)


def add_count_check(spark, summary):
    spark.sql(f"ALTER TABLE {summary} ADD CONSTRAINT loans_positive CHECK (loans >= 1)")


def contract_problems(df, contract):
    actual = {f.name: f.dataType.simpleString() for f in df.schema}
    problems = []
    for col, expected in contract.items():
        if col not in actual:
            problems.append(f"missing: {col}")
        elif actual[col] != expected:
            problems.append(f"type: {col} is {actual[col]}, not {expected}")
    problems += [f"extra: {col}" for col in df.columns if col not in contract]
    return problems
