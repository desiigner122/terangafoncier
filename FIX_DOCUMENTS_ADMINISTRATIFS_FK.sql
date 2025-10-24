-- Fix documents_administratifs FK constraint to point to correct table
-- Same issue as calendar_appointments - references 'purchase_requests' instead of 'requests'

-- 1. Drop the incorrect FK constraint
ALTER TABLE documents_administratifs 
DROP CONSTRAINT IF EXISTS fk_documents_administratifs_purchase_request;

-- 2. Add correct FK pointing to 'requests' table (if it exists and constraint doesn't exist)
DO $$ 
BEGIN
  -- Check if the constraint already exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_documents_administratifs_request'
    AND table_name = 'documents_administratifs'
  ) THEN
    RAISE NOTICE 'FK constraint fk_documents_administratifs_request already exists - skipping creation';
  ELSIF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'requests') THEN
    ALTER TABLE documents_administratifs 
    ADD CONSTRAINT fk_documents_administratifs_request 
    FOREIGN KEY (purchase_request_id) REFERENCES requests(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'FK constraint added: documents_administratifs.purchase_request_id -> requests.id';
  ELSE
    -- If 'requests' table doesn't exist, just make the column nullable
    ALTER TABLE documents_administratifs 
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
WHERE tc.table_name = 'documents_administratifs'
  AND tc.constraint_type = 'FOREIGN KEY';
