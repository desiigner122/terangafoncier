-- ======================================================================
-- DIAGNOSTIC APPROFONDI: POURQUOI "Database error querying schema" PERSISTE
-- Vérifier quels utilisateurs ont des données dans public.users et public.profiles
-- ======================================================================

-- 1) Vérifier les 6 comptes qui MARCHENT
SELECT 
  'SUCCESSFUL ACCOUNTS' AS section,
  email,
  CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_users,
  CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_profiles
FROM (VALUES 
  ('geowest.africa@teranga-foncier.sn'),
  ('cabinet.ndiaye@teranga-foncier.sn'),
  ('atlantique.capital@teranga-foncier.sn'),
  ('fonds.souverain@teranga-foncier.sn'),
  ('mairie.thies@teranga-foncier.sn'),
  ('mairie.dakar@teranga-foncier.sn')
) AS vals(email);

-- 1b) Vérifier les comptes qui ÉCHOUENT
SELECT 
  'FAILED ACCOUNTS' AS section,
  email,
  CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_users,
  CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_profiles
FROM (VALUES 
  ('test.admin@terangafoncier.sn'),
  ('family.diallo@teranga-foncier.sn'),
  ('ahmadou.ba@teranga-foncier.sn'),
  ('heritage.fall@teranga-foncier.sn'),
  ('domaine.seck@teranga-foncier.sn'),
  ('urban.developers@teranga-foncier.sn'),
  ('sahel.construction@teranga-foncier.sn'),
  ('financement.boa@teranga-foncier.sn'),
  ('credit.agricole@teranga-foncier.sn'),
  ('etude.diouf@teranga-foncier.sn'),
  ('chambre.notaires@teranga-foncier.sn'),
  ('foncier.expert@teranga-foncier.sn'),
  ('teranga.immobilier@teranga-foncier.sn')
) AS vals(email);

-- 2) Vérifier si tous les comptes auth ont des enregistrements dans public.users et public.profiles
SELECT 
  'DATA COMPLETENESS' AS section,
  au.email,
  CASE WHEN pu.id IS NOT NULL THEN 'YES' ELSE 'NO' END AS in_public_users,
  CASE WHEN pp.id IS NOT NULL THEN 'YES' ELSE 'NO' END AS in_public_profiles,
  CASE WHEN au.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKS' ELSE 'FAILS' END AS test_result
FROM auth.users au
LEFT JOIN public.users pu ON pu.email = au.email
LEFT JOIN public.profiles pp ON pp.email = au.email
WHERE au.email LIKE '%teranga%' OR au.email LIKE '%terangafoncier%'
ORDER BY test_result, au.email;

-- 3) Vérifier les policies RLS actives
SELECT 
  'CURRENT RLS POLICIES' AS section,
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('users', 'profiles')
ORDER BY tablename, policyname;