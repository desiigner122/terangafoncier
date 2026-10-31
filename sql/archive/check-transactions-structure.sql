-- 🔍 STRUCTURE DE LA TABLE TRANSACTIONS

SELECT 
  '🔧 COLONNES DE TRANSACTIONS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;

-- Voir quelques transactions pour comprendre
SELECT 
  '📋 EXEMPLES DE TRANSACTIONS' as info,
  *
FROM transactions
ORDER BY created_at DESC
LIMIT 10;
