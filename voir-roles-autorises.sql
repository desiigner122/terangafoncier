-- ============================================
-- VOIR LES RÔLES AUTORISÉS
-- ============================================
-- Exécutez SEULEMENT ce script pour voir la contrainte

SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND contype = 'c'  -- c = CHECK constraint
  AND conname LIKE '%role%';

-- Voir aussi tous les rôles actuellement utilisés
SELECT DISTINCT role, COUNT(*) as count
FROM profiles
WHERE role IS NOT NULL
GROUP BY role
ORDER BY count DESC;
