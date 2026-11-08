"""Reference solution for gap_filling.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def _ids(df):
    return sorted(r["member_id"] for r in df.select("member_id").collect())


def without_phone(members):
    return _ids(members.filter(F.col("phone").isNull()))


def phone_differs(members, phone):
    return _ids(members.filter((F.col("phone") != phone) | F.col("phone").isNull()))


def add_contact(members):
    return members.withColumn("contact", F.coalesce("email", "phone", F.lit("none")))


def fill_defaults(members):
    return members.fillna({"visits": 0, "phone": "unknown"})


def add_next_visits(members):
    return members.withColumn("visits_next", F.coalesce("visits", F.lit(0)) + 1)


def drop_unreachable(members):
    return _ids(members.na.drop(how="all", subset=["phone", "email"]))
