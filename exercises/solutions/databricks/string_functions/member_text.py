"""Reference solution for member_text.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def add_first_tidy(members):
    return members.withColumn("first_tidy", F.lower(F.trim("first")))


def add_full_name(members):
    return members.withColumn("full_name", F.concat_ws(" ", F.trim("first"), "middle", "last"))


def add_email_domain(members):
    return members.withColumn("domain", F.lower(F.regexp_extract("email", "@(.+)$", 1)))


def add_card_number(members):
    return members.withColumn("card_no", F.regexp_extract("card", "([0-9]+)", 1).cast("int"))


def mask_card(members):
    return members.withColumn("card_masked", F.regexp_replace("card", "[0-9]", "#"))
