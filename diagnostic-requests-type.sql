-- ============================================
-- DIAGNOSTIC - CONTRAINTE TYPE SUR REQUESTS
-- ============================================

-- Afficher la contrainte de type actuelle
SELECT 
  '📋 CONTRAINTE TYPE ACTUELLE:' as info,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
  AND conname LIKE '%type%';

-- Afficher les types utilisés dans le code
SELECT 
  '💡 TYPES ATTENDUS PAR LE CODE:' as info,
  'one_time' as type_value,
  'Paiement comptant direct' as description
UNION ALL
SELECT '', 'installments', 'Paiement échelonné'
UNION ALL
SELECT '', 'bank_financing', 'Financement bancaire'
UNION ALL
SELECT '', 'pending', 'En attente (peut-être pour status?)';

-- Afficher les types existants dans la table (s'il y en a)
SELECT 
  '📊 TYPES EXISTANTS DANS LA TABLE:' as info,
  DISTINCT type,
  COUNT(*) as count
FROM public.requests
WHERE type IS NOT NULL
GROUP BY type;
