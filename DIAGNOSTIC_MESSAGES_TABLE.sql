-- DIAGNOSTIC: Vérifier la structure actuelle de la table messages
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('messages', 'purchase_case_messages')
ORDER BY table_name, ordinal_position;

-- Vérifier les contraintes
SELECT 
  constraint_name,
  table_name,
  column_name,
  is_nullable
FROM information_schema.key_column_usage
WHERE table_name IN ('messages', 'purchase_case_messages')
ORDER BY table_name;

-- Vérifier les CHECK constraints
SELECT 
  constraint_name,
  table_name,
  check_clause
FROM information_schema.check_constraints
WHERE table_name IN ('messages', 'purchase_case_messages');
