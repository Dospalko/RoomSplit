-- First, create a default user if one doesn't exist
INSERT OR IGNORE INTO User (id, email, name, password, createdAt) 
VALUES (1, 'admin@roomsplit.com', 'Default Admin', 'temp_password', datetime('now'));

-- Update all rooms with NULL userId to use the default user
UPDATE Room SET userId = 1 WHERE userId IS NULL;

-- Now make the column required
-- This will be handled by the actual migration file
