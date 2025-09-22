-- DIAGNOSTIC COMPLET DES CONTRAINTES FK
-- Ce script identifie toutes les tables qui référencent auth.users ou public.users

-- 1. Lister toutes les contraintes FK qui pointent vers les tables users
SELECT 
  'FK vers public.users' AS type,
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'users'
  AND ccu.table_schema IN ('public', 'auth')
UNION ALL
SELECT 
  'FK vers auth.users' AS type,
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'users'
  AND ccu.table_schema = 'auth'
ORDER BY table_schema, table_name;

-- 2. Compter les enregistrements dans les tables identifiées
SELECT 'Comptage des enregistrements' AS section, '' AS table_name, NULL AS count
UNION ALL
SELECT '', 'parcels', COUNT(*)::text FROM public.parcels
UNION ALL
SELECT '', 'audit_logs', COUNT(*)::text FROM public.audit_logs
UNION ALL
SELECT '', 'requests', COUNT(*)::text FROM public.requests
UNION ALL
SELECT '', 'favorites', COUNT(*)::text FROM public.favorites
UNION ALL
SELECT '', 'profiles', COUNT(*)::text FROM public.profiles
UNION ALL
SELECT '', 'users', COUNT(*)::text FROM public.users
UNION ALL
SELECT '', 'auth.users', COUNT(*)::text FROM auth.users
UNION ALL
SELECT '', 'auth.identities', COUNT(*)::text FROM auth.identities;

-- 3. Vérifier quelles autres tables pourraient exister
SELECT 
  'Tables publiques existantes' AS section,
  table_name,
  ''::text AS count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;