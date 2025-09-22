-- DIAGNOSTIC DES CONTRAINTES DE CLÉS ÉTRANGÈRES
-- Ce script identifie toutes les tables qui référencent auth.users ou public.users
-- pour s'assurer que nous les supprimons dans le bon ordre

-- 1. Contraintes FK qui pointent vers auth.users
SELECT 
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_schema AS referenced_table_schema,
  ccu.table_name AS referenced_table_name,
  ccu.column_name AS referenced_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name IN ('users')
  AND ccu.table_schema IN ('auth', 'public')
ORDER BY tc.table_schema, tc.table_name;

-- 2. Compter les enregistrements dans chaque table qui référence les utilisateurs
SELECT 'audit_logs' AS table_name, COUNT(*) AS record_count FROM public.audit_logs
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'users', COUNT(*) FROM public.users
UNION ALL
SELECT 'auth.users', COUNT(*) FROM auth.users
UNION ALL
SELECT 'auth.identities', COUNT(*) FROM auth.identities
ORDER BY table_name;