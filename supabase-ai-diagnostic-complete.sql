-- ======================================================================
-- DIAGNOSTIC COMPLET RECOMMANDÉ PAR L'IA SUPABASE
-- Exécuter toutes les requêtes dans l'ordre pour identifier la cause exacte
-- ======================================================================

-- 1) Diagnostic: auth.users pour les emails concernés
SELECT 
  'AUTH USERS DIAGNOSTIC' AS section,
  u.id, 
  u.email, 
  u.email_confirmed_at, 
  pg_typeof(u.id) AS id_type, 
  length(u.id::text) AS id_text_len, 
  raw_user_meta_data IS NOT NULL AS has_meta,
  CASE WHEN u.email IN (
    'geowest.africa@teranga-foncier.sn', 
    'cabinet.ndiaye@teranga-foncier.sn', 
    'atlantique.capital@teranga-foncier.sn', 
    'fonds.souverain@teranga-foncier.sn', 
    'mairie.thies@teranga-foncier.sn', 
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKS' ELSE 'FAILS' END AS test_result
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
ORDER BY test_result, u.email;

-- 2) Diagnostic: public.profiles pour les mêmes ids/emails
SELECT 
  'PUBLIC PROFILES DIAGNOSTIC' AS section,
  p.id, 
  pg_typeof(p.id) AS id_type, 
  length(p.id::text) AS id_text_len, 
  p.email
FROM public.profiles p
WHERE p.id IN (SELECT id FROM auth.users WHERE email IN (
  'geowest.africa@teranga-foncier.sn', 
  'cabinet.ndiaye@teranga-foncier.sn', 
  'atlantique.capital@teranga-foncier.sn', 
  'fonds.souverain@teranga-foncier.sn', 
  'mairie.thies@teranga-foncier.sn', 
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn', 
  'domaine.seck@teranga-foncier.sn'
));

-- 3) Diagnostic: public.users pour les mêmes ids
SELECT 
  'PUBLIC USERS DIAGNOSTIC' AS section,
  u.id,
  pg_typeof(u.id) AS id_type,
  length(u.id::text) AS id_text_len,
  u.email
FROM public.users u
WHERE u.id IN (SELECT id FROM auth.users WHERE email IN (
  'geowest.africa@teranga-foncier.sn', 
  'cabinet.ndiaye@teranga-foncier.sn', 
  'atlantique.capital@teranga-foncier.sn', 
  'fonds.souverain@teranga-foncier.sn', 
  'mairie.thies@teranga-foncier.sn', 
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn', 
  'domaine.seck@teranga-foncier.sn'
));

-- 4) Vérifier les IDs dupliqués à travers les tables
SELECT 
  'DUPLICATE IDS CHECK' AS section,
  id, 
  count(*) AS occurrences
FROM (
  SELECT id FROM auth.users
  UNION ALL
  SELECT id FROM public.profiles
  UNION ALL
  SELECT id FROM public.users
) t 
GROUP BY id 
HAVING count(*) <> 3;

-- 5) Vérifier RLS activé sur les tables
SELECT 
  'RLS STATUS' AS section,
  n.nspname AS schema, 
  c.relname AS table, 
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname IN ('public','auth') AND c.relname IN ('profiles','users');

-- 6) Lister toutes les policies RLS pour ces tables
SELECT 
  'RLS POLICIES' AS section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname IN ('public','auth') AND tablename IN ('profiles','users')
ORDER BY schemaname, tablename, policyname;

-- 7) Lister les triggers sur les tables concernées
SELECT 
  'TRIGGERS' AS section,
  tg.tgname AS trigger_name, 
  tg.tgrelid::regclass AS table_name, 
  pg_get_triggerdef(tg.oid) AS trigger_definition
FROM pg_trigger tg
JOIN pg_class c ON tg.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE (n.nspname = 'auth' AND c.relname = 'users') 
   OR (n.nspname='public' AND c.relname IN ('profiles','users'));

-- 8) Vérifier les contraintes sur les colonnes id
SELECT 
  'CONSTRAINTS' AS section,
  con.oid, 
  con.conname AS constraint_name, 
  pg_get_constraintdef(con.oid) AS definition, 
  n.nspname AS schema, 
  c.relname AS table
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE (n.nspname = 'public' AND c.relname IN ('profiles','users')) 
   OR (n.nspname='auth' AND c.relname='users');

-- 9) Tester le format UUID - CRITIQUE pour identifier les IDs malformés
SELECT 
  'UUID FORMAT TEST' AS section,
  id, 
  email,
  CASE WHEN id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' 
       THEN 'VALID_UUID_V4' 
       ELSE 'INVALID_UUID' 
  END AS uuid_status,
  CASE WHEN email IN (
    'geowest.africa@teranga-foncier.sn', 
    'cabinet.ndiaye@teranga-foncier.sn', 
    'atlantique.capital@teranga-foncier.sn', 
    'fonds.souverain@teranga-foncier.sn', 
    'mairie.thies@teranga-foncier.sn', 
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKS' ELSE 'FAILS' END AS test_result
FROM auth.users
WHERE email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn'
)
ORDER BY test_result, email;