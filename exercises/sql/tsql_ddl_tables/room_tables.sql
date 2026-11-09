-- Rooms and shelves: write the T-SQL for each `-- step:` line.
-- Keep the `-- step:` lines as they are, and end each statement with ;
-- The tests run each step on its own, on the tables README.md describes for it.

-- step: create_room
-- Create dbo.Room with RoomId (INT), RoomName (Unicode text up to 40 characters) and Floor (INT).
-- TODO


-- step: add_capacity
-- Add a Capacity column (INT) to dbo.Room that may be NULL.
-- TODO


-- step: widen_name
-- Let RoomName hold up to 100 characters.
-- TODO


-- step: drop_floor
-- Remove the Floor column from dbo.Room.
-- TODO


-- step: big_rooms
-- Create and fill a temp table #BigRoom (RoomId, RoomName) of the rooms with a Capacity of 30 or more,
-- in one statement.
-- TODO


-- step: drop_old_shelf
-- Remove the table dbo.OldShelf, rows and all.
-- TODO
