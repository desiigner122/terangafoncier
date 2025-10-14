-- Vérifier la contrainte sur le rôle
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
  AND conname = 'profiles_role_check';
