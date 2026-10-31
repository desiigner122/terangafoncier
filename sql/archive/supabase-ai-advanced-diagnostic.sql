-- ======================================================================
-- DIAGNOSTIC AVANCÉ RECOMMANDÉ PAR L'IA SUPABASE
-- Version corrigée - Comparer comptes qui marchent vs qui échouent
-- ======================================================================

-- A) Détails auth.users pour les comptes qui MARCHENT
SELECT 
  'WORKING' AS cohort, 
  u.id, 
  u.email, 
  u.email_confirmed_at, 
  pg_typeof(u.id) AS id_type, 
  length(u.id::text) AS id_len, 
  u.raw_user_meta_data IS NOT NULL AS has_metadata,
  jsonb_typeof(u.raw_user_meta_data) AS metadata_type
FROM auth.users u
WHERE u.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn'
)
ORDER BY u.email;

-- B) Détails auth.users pour les comptes qui ÉCHOUENT
SELECT 
  'FAILING' AS cohort, 
  u.id, 
  u.email, 
  u.email_confirmed_at, 
  pg_typeof(u.id) AS id_type, 
  length(u.id::text) AS id_len, 
  u.raw_user_meta_data IS NOT NULL AS has_metadata,
  jsonb_typeof(u.raw_user_meta_data) AS metadata_type
FROM auth.users u
WHERE u.email IN (
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
)
ORDER BY u.email;

-- C) Vérifier existence dans public.profiles et public.users
SELECT 
  u.id, 
  u.email,
  CASE WHEN u.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKING' ELSE 'FAILING' END AS cohort,
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id) AS in_profiles,
  EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = u.id) AS in_public_users
FROM auth.users u
WHERE u.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
)
ORDER BY cohort, u.email;

-- D) Détails des enregistrements public.users pour comparaison
SELECT 
  pu.id,
  pu.email,
  CASE WHEN pu.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKING' ELSE 'FAILING' END AS cohort,
  pu.role,
  pu.commune,
  pu.phone,
  pu.created_at,
  pg_typeof(pu.id) AS id_type
FROM public.users pu
WHERE pu.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
)
ORDER BY cohort, pu.email;

-- E) Lister toutes les politiques RLS sur public.users et public.profiles
SELECT 
  'RLS_POLICIES' AS section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('profiles', 'users')
ORDER BY tablename, policyname;

-- F) Vérifier si RLS est activé
SELECT 
  'RLS_STATUS' AS section,
  n.nspname AS schema, 
  c.relname AS table_name, 
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relname IN ('profiles', 'users');

-- G) Lister tous les triggers sur les tables concernées
SELECT 
  'TRIGGERS' AS section,
  n.nspname AS schema, 
  c.relname AS table_name, 
  t.tgname AS trigger_name, 
  pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE (n.nspname = 'public' AND c.relname IN ('profiles', 'users'))
   OR (n.nspname = 'auth' AND c.relname = 'users')
ORDER BY schema, table_name, trigger_name;

-- H) Lister toutes les contraintes
SELECT 
  'CONSTRAINTS' AS section,
  n.nspname AS schema, 
  c.relname AS table_name, 
  con.conname AS constraint_name, 
  pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relname IN ('profiles', 'users')
  ORDER BY schema, c.relname, constraint_name;

-- I) Vérifier les permissions de rôle sur les tables
SELECT 
  'TABLE_PRIVILEGES' AS section,
  grantee, 
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'users') 
  AND grantee IN ('authenticated', 'anon', 'postgres')
ORDER BY table_name, grantee, privilege_type;

-- J) Examiner raw_user_meta_data pour les comptes qui échouent
SELECT 
  'METADATA_ANALYSIS' AS section,
  u.id, 
  u.email, 
  u.raw_user_meta_data,
  jsonb_typeof(u.raw_user_meta_data) AS meta_type,
  CASE 
    WHEN jsonb_typeof(u.raw_user_meta_data) = 'array' THEN jsonb_array_length(u.raw_user_meta_data)
    ELSE NULL 
  END AS meta_length_if_array,
  CASE 
    WHEN jsonb_typeof(u.raw_user_meta_data) = 'object' THEN (
      SELECT string_agg(key, ', ' ORDER BY key) 
      FROM jsonb_object_keys(u.raw_user_meta_data) key
    )
    ELSE NULL 
  END AS meta_keys
FROM auth.users u
WHERE u.email IN (
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
) 
AND u.raw_user_meta_data IS NOT NULL;

-- K) Comparer les clés metadata entre comptes qui marchent et échouent
SELECT 
  'METADATA_COMPARISON' AS section,
  CASE WHEN u.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKING' ELSE 'FAILING' END AS cohort,
  u.email,
  u.raw_user_meta_data
FROM auth.users u
WHERE u.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
)
AND u.raw_user_meta_data IS NOT NULL
ORDER BY cohort, u.email;