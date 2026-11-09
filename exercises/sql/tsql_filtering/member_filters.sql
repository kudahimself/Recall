-- Members to chase: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40), City NVARCHAR(40) NULL, Fines INT)
-- README.md lists the rows the tests put in it.

-- query: outside_oslo
-- The members who do not live in Oslo, the ones with no city included: MemberName.
-- TODO


-- query: no_city
-- The members with no city: MemberName.
-- TODO


-- query: owing_in_two_cities
-- Members in Bergen or Leeds with fines from 5 to 20, both ends included: MemberName, Fines.
-- Use IN and BETWEEN.
-- TODO


-- query: a_names
-- Members whose name starts with A: MemberName. Use LIKE.
-- TODO


-- query: standing
-- Every member: MemberName, Town (the city, or 'unknown'), Standing:
-- 'blocked' for fines of 30 or more, 'owes' for any other fine above 0, 'clear' otherwise.
-- TODO
