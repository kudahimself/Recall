# SQL for Data Engineering exercises

The SQL course teaches T-SQL, the SQL of SQL Server, Azure Synapse and Microsoft Fabric.
These exercises are T-SQL too, and they run on your own laptop with no SQL Server to install.
`tsql_runner.py` reads your T-SQL with sqlglot's T-SQL dialect and runs it on DuckDB, an in-process database each test opens in memory.
Every exercise folder's `conftest.py` hands the tests a fresh database, so a test never sees another test's tables.
Leave both alone.

## Setup (once)

Do the setup in `exercises/README.md`: `pip install -r exercises/requirements.txt` installs `duckdb` and `sqlglot` with the rest.
Nothing else is needed, and everything works offline.

## Doing an exercise

Each folder holds a `.sql` file split into blocks, and each block starts with a line such as `-- query: longest_scifi` or `-- step: add_capacity`.
Write your T-SQL under each of those lines and keep the lines themselves as they are: the tests find your SQL by them.
A `query` block is one `SELECT`; a `step` block is a script, one statement or several, and a line holding only `GO` ends a batch, as in SQL Server Management Studio.
End each statement with `;`.
SQL Server lets you leave it out, but the tests need it to tell where one statement stops.

```bash
cd exercises/sql/tsql_select
pytest
```

The tests create the tables a block needs, fill them with the rows in the folder's `README.md`, run your block and compare what comes back.
Rows can come back in any order unless the task asks for one, so any correct query passes.
When the task names the columns, the names count too (but not their case), so give computed columns the alias the task asks for.

## What differs from SQL Server

The tests stop on SQL that DuckDB or PostgreSQL accept and SQL Server does not, and say what T-SQL writes instead: `LIMIT`, `||`, `ILIKE`, `::` casts, `TRUE` and `FALSE`, `ADD COLUMN`, `MODIFY`, `CREATE OR REPLACE`, and functions such as `STRFTIME`, `DATE_DIFF` or `LENGTH`.
`tsql_runner.py` then changes a few things so your T-SQL behaves on DuckDB as it would on SQL Server:

- text compares without case, as under SQL Server's default collation, so `'scifi' = 'SciFi'` and `LIKE 'a%'` matches `Ana`;
- `+` joins text, and a NULL part makes the whole value NULL;
- `LEN` ignores trailing spaces;
- dividing an integer by an integer gives an integer (7 / 2 is 3), and `AVG` of an `INT` column is an `INT`;
- a `BIT` column holds 1, 0 or NULL;
- `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, `DEFAULT` and `FOREIGN KEY` refuse bad rows as they do on SQL Server.

Some T-SQL cannot run on DuckDB, so the tests read it from your T-SQL instead of running it:

- DuckDB keeps no length for text, so `NVARCHAR(40)` and `NVARCHAR(100)` both store as plain text, and it has no `DATETIME2`;
- DuckDB cannot cascade a delete, so it checks a foreign key on every insert, and a test reads `ON DELETE CASCADE` from your T-SQL;
- DuckDB works every computed column out on read, so a test reads `PERSISTED` from your T-SQL;
- `GETDATE()` changes every day, so an exercise about today fixes the day with `CAST('2026-03-15' AS DATE)`.

When your T-SQL fails on DuckDB, the error shows it next to the DuckDB SQL it became, so you can see whether the T-SQL or the translation is at fault.
Your SQL still runs on SQL Server as it is.
