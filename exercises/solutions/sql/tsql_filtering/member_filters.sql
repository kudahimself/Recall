-- Members to chase: write one T-SQL query under each `-- query:` line.
-- Keep the `-- query:` lines as they are, and end each query with ;
--
-- dbo.Member (MemberId INT, MemberName NVARCHAR(40), City NVARCHAR(40) NULL, Fines INT)
-- README.md lists the rows the tests put in it.

-- query: outside_oslo
-- The members who do not live in Oslo, the ones with no city included: MemberName.
SELECT MemberName
FROM dbo.Member
WHERE City <> 'Oslo' OR City IS NULL;

-- query: no_city
-- The members with no city: MemberName.
SELECT MemberName
FROM dbo.Member
WHERE City IS NULL;

-- query: owing_in_two_cities
-- Members in Bergen or Leeds with fines from 5 to 20, both ends included: MemberName, Fines.
-- Use IN and BETWEEN.
SELECT MemberName, Fines
FROM dbo.Member
WHERE City IN ('Bergen', 'Leeds')
  AND Fines BETWEEN 5 AND 20;

-- query: a_names
-- Members whose name starts with A: MemberName. Use LIKE.
SELECT MemberName
FROM dbo.Member
WHERE MemberName LIKE 'A%';

-- query: standing
-- Every member: MemberName, Town (the city, or 'unknown'), Standing:
-- 'blocked' for fines of 30 or more, 'owes' for any other fine above 0, 'clear' otherwise.
SELECT MemberName,
       COALESCE(City, 'unknown') AS Town,
       CASE WHEN Fines >= 30 THEN 'blocked'
            WHEN Fines > 0 THEN 'owes'
            ELSE 'clear' END AS Standing
FROM dbo.Member;
