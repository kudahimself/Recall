"""Reference solution for holdings_delta.py: look only after your own tests pass."""


def apply_delivery(spark, table, delivery):
    delivery.createOrReplaceTempView("delivery_view")
    spark.sql(f"""
        MERGE INTO {table} h USING delivery_view d ON h.isbn = d.isbn
        WHEN MATCHED THEN UPDATE SET h.copies = h.copies + d.copies
        WHEN NOT MATCHED THEN INSERT (isbn, copies) VALUES (d.isbn, d.copies)
    """)


def write_off(spark, table, isbn, lost):
    spark.sql(f"UPDATE {table} SET copies = copies - {int(lost)} WHERE isbn = '{isbn}'")


def drop_empty(spark, table):
    spark.sql(f"DELETE FROM {table} WHERE copies <= 0")


def mirror_catalogue(spark, table, catalogue):
    catalogue.createOrReplaceTempView("catalogue_view")
    spark.sql(f"""
        MERGE INTO {table} h USING catalogue_view c ON h.isbn = c.isbn
        WHEN MATCHED THEN UPDATE SET h.copies = c.copies
        WHEN NOT MATCHED THEN INSERT (isbn, copies) VALUES (c.isbn, c.copies)
        WHEN NOT MATCHED BY SOURCE THEN DELETE
    """)


def make_copy(spark, table, copy_name):
    spark.sql(f"CREATE TABLE {copy_name} SHALLOW CLONE {table}")
