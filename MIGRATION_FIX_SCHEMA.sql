-- ============================================================================
-- MIGRATION: Fix Missing Columns and Foreign Keys
-- Date: October 21, 2025
-- Purpose: Fix database schema issues preventing vendor dashboard from working
-- ============================================================================

-- 1. Add missing 'phone' column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. Add missing 'body' column to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS body TEXT;

-- 3. Verify transactions table has request_id column (should already exist)
-- This query will show us the structure if there are issues
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'transactions' AND column_name = 'request_id';

-- 4. Verify purchase_cases table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
ORDER BY ordinal_position;

-- 5. Check foreign key constraints on purchase_cases
SELECT constraint_name, table_name, column_name, foreign_table_name, foreign_column_name
FROM information_schema.referential_constraints
WHERE table_name = 'purchase_cases' AND constraint_name LIKE '%request_id%';

-- 6. If needed, verify the foreign key references the correct table
-- The purchase_cases.request_id should reference transactions.request_id or requests.id
-- (depending on the schema design)
