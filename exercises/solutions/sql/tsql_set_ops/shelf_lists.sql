-- Shelf and wishlist: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Shelf    (Title NVARCHAR(60), Branch NVARCHAR(20))   one row per copy on a shelf
-- dbo.Wishlist (Title NVARCHAR(60), MemberName NVARCHAR(40))   one row per wish
-- dbo.Donation (Donor NVARCHAR(40), Title NVARCHAR(60))   one row per donated book: Title comes second
-- README.md lists the rows the tests put in them.

-- query: copies_and_wishes
-- The title of every shelf copy and of every wish, duplicates kept: Title.
SELECT Title FROM dbo.Shelf
UNION ALL
SELECT Title FROM dbo.Wishlist;

-- query: all_titles
-- Every title the library has, wants or was given, once each, A to Z: Title.
SELECT Title FROM dbo.Shelf
UNION
SELECT Title FROM dbo.Wishlist
UNION
SELECT Title FROM dbo.Donation
ORDER BY Title;

-- query: held_and_wanted
-- The titles that are on a shelf and on the wishlist: Title.
SELECT Title FROM dbo.Shelf
INTERSECT
SELECT Title FROM dbo.Wishlist;

-- query: nobody_wants
-- The titles on a shelf that nobody wishes for: Title.
SELECT Title FROM dbo.Shelf
EXCEPT
SELECT Title FROM dbo.Wishlist;

-- query: where_from
-- Every shelf copy and every donation, duplicates kept: Title, Source ('shelf' or 'donation').
SELECT Title, 'shelf' AS Source FROM dbo.Shelf
UNION ALL
SELECT Title, 'donation' FROM dbo.Donation;
