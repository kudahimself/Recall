"""Reference solution for due_dates.py: look only after your own tests pass."""
from pyspark.sql import functions as F


def parse_borrowed(loans):
    return loans.withColumn("borrowed", F.to_date("borrowed_text", "dd/MM/yyyy"))


def add_due_date(loans):
    return loans.withColumn("due", F.date_add("borrowed", 21))


def add_days_out(loans):
    return loans.withColumn("days_out", F.datediff("returned", "borrowed"))


def add_month_label(loans):
    return loans.withColumn("month_label", F.date_format("borrowed", "yyyy-MM"))


def count_in_month(loans, year, month):
    return loans.filter((F.year("borrowed") == year) & (F.month("borrowed") == month)).count()
