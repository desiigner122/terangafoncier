-- ============================================
-- SIMPLE FIX: Just drop message_count column
-- ============================================
-- The table exists and works, we just need to remove the problematic column

-- 1. Identify all dependencies on message_count
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name = 'conversation_messages';

-- 2. Drop message_count column if it exists (ignore if it doesn't)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'conversation_messages' 
        AND column_name = 'message_count'
    ) THEN
        ALTER TABLE public.conversation_messages DROP COLUMN message_count;
        RAISE NOTICE 'Column message_count dropped successfully';
    ELSE
        RAISE NOTICE 'Column message_count does not exist, nothing to drop';
    END IF;
END $$;

-- 3. Verify final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversation_messages'
ORDER BY ordinal_position;

-- 4. Refresh schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Cleanup complete!' as status;
