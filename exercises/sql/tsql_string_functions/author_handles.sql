-- Author handles: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Author (AuthorId INT, Handle NVARCHAR(60), PenName NVARCHAR(40) NULL, Code NVARCHAR(20))
-- README.md lists the rows the tests put in it.

-- query: handle_parts
-- Each author's handle split at the '@': AuthorId, UserName (before it), Domain (after it).
-- TODO


-- query: labels
-- AuthorId, Label: the pen name, a space and the handle in angle brackets, as in 'Bo <bo@press.org>'.
-- An author with no pen name still gets a label: ' <cyd.ng@ink.io>'.
-- TODO


-- query: clean_codes
-- AuthorId, CleanCode (the code without its spaces or its dash, in capitals), CodeLength (its length).
-- TODO


-- query: first_names
-- AuthorId, FirstName: the pen name up to its first space, or all of it when it has no space.
-- An author with no pen name gets NULL.
-- TODO
