-- ============================================
-- DIAGNOSTIC: Check conversation_messages columns
-- ============================================

-- Show all columns in conversation_messages table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'conversation_messages'
ORDER BY ordinal_position;

-- Show constraints on the table
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND table_name = 'conversation_messages';

-- Show indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'conversation_messages';
