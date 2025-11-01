-- Vérifier la structure de purchase_case_documents
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_documents'
ORDER BY ordinal_position;

-- Vérifier la structure de purchase_case_messages
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;
