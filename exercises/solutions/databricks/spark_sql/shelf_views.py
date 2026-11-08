"""Reference solution for shelf_views.py: look only after your own tests pass."""


def register_sales(sales):
    sales.createOrReplaceTempView("raw_sales")


def clean_sales_sql() -> str:
    return "SELECT book, branch, try_cast(copies AS INT) AS copies FROM raw_sales"


def stock_band_sql() -> str:
    return """SELECT book,
                     CASE WHEN copies > 100 THEN 'high'
                          WHEN copies >= 20 THEN 'mid'
                          ELSE 'low' END AS band
              FROM stock"""


def copies_by_branch_sql() -> str:
    return """SELECT * FROM (SELECT book, branch, copies FROM branch_stock)
              PIVOT (SUM(copies) FOR branch IN ('North', 'South'))"""


def define_low_stock_view(spark):
    spark.sql("CREATE OR REPLACE TEMP VIEW low_stock AS SELECT * FROM stock WHERE copies < 10")
