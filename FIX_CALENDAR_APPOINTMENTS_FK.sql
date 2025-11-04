-- Fix calendar_appointments FK constraint to point to correct table
-- The constraint currently references 'purchase_requests' but the table is named 'requests'

-- 1. Drop the incorrect FK constraint
ALTER TABLE calendar_appointments 
DROP CONSTRAINT IF EXISTS fk_calendar_appointments_purchase_request;

-- 2. Add correct FK pointing to 'requests' table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'requests') THEN
    ALTER TABLE calendar_appointments 
    ADD CONSTRAINT fk_calendar_appointments_request 
    FOREIGN KEY (purchase_request_id) REFERENCES requests(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'FK constraint added: calendar_appointments.purchase_request_id -> requests.id';
  ELSE
    -- If 'requests' table doesn't exist, just make the column nullable
    ALTER TABLE calendar_appointments 
    ALTER COLUMN purchase_request_id DROP NOT NULL;
    
    RAISE NOTICE 'FK constraint skipped - requests table not found. Column made nullable.';
  END IF;
END $$;

-- 3. Verify the fix
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'calendar_appointments'
  AND tc.constraint_type = 'FOREIGN KEY';
