-- Shelf picks: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Book (BookId INT, Title NVARCHAR(60), Genre NVARCHAR(20), Pages INT, Published INT)
-- README.md lists the rows the tests put in it.

-- query: longest_scifi
-- The three longest SciFi books, longest first: Title, Pages. Use TOP.
SELECT TOP (3) Title, Pages
FROM dbo.Book
WHERE Genre = 'SciFi'
ORDER BY Pages DESC;

-- query: genres
-- Every genre once, A to Z: Genre.
SELECT DISTINCT Genre
FROM dbo.Book
ORDER BY Genre;

-- query: second_page
-- The books A to Z by Title, four to a page: the second page only (books 5 to 8). Title.
-- Use OFFSET ... FETCH.
SELECT Title
FROM dbo.Book
ORDER BY Title
OFFSET 4 ROWS FETCH NEXT 4 ROWS ONLY;

-- query: recent_short
-- Books published in 2000 or later with fewer than 400 pages, newest first: Title, Published.
SELECT Title, Published
FROM dbo.Book
WHERE Published >= 2000 AND Pages < 400
ORDER BY Published DESC;
