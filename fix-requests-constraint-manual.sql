-- MANUAL FIX: Apply requests.status CHECK constraint with 'accepted' value
ALTER TABLE requests 
DROP CONSTRAINT IF EXISTS requests_status_check;

ALTER TABLE requests
ADD CONSTRAINT requests_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'completed', 'on_hold', 'negotiation'));

-- Test query to verify the constraint works
SELECT tablename FROM pg_tables WHERE tablename = 'requests';
