-- Check purchase_case_messages table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'purchase_case_messages'
ORDER BY ordinal_position;

-- Sample data
SELECT * FROM public.purchase_case_messages LIMIT 3;
