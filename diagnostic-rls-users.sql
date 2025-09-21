-- ======================================================================
-- DIAGNOSTIC RLS SPÉCIFIQUE - Politiques sur public.users
-- ======================================================================

-- 1) Lister toutes les politiques RLS sur public.users
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- 2) Tester l'accès direct à la table pour les comptes qui échouent
SELECT 
  id, 
  email, 
  role,
  CASE WHEN email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKING' ELSE 'FAILING' END AS status
FROM public.users
WHERE email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'family.diallo@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn'
)
ORDER BY status, email;

-- 3) Vérifier si RLS bloque certains rôles spécifiques
SELECT DISTINCT role, count(*) as count
FROM public.users
GROUP BY role
ORDER BY role;