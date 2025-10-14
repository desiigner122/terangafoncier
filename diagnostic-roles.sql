-- ============================================
-- DIAGNOSTIC: Vérifier les rôles valides
-- ============================================

-- 1. Voir la contrainte sur le rôle
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname LIKE '%role%';

-- 2. Voir tous les rôles existants dans la base
SELECT DISTINCT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- 3. Voir la structure de la colonne role
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'role';
