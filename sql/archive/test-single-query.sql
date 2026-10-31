-- ======================================================================
-- TEST DIRECT - Vérifier .single() pour tous les comptes
-- ======================================================================

-- Tester la requête exacte du AuthContext pour les comptes qui échouent
SELECT 
  au.email,
  au.id,
  pu.id IS NOT NULL AS exists_in_public_users,
  (SELECT COUNT(*) FROM public.users WHERE id = au.id) AS count_in_public_users,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.users WHERE id = au.id) = 1 THEN 'SINGLE_MATCH'
    WHEN (SELECT COUNT(*) FROM public.users WHERE id = au.id) = 0 THEN 'NO_MATCH'
    ELSE 'MULTIPLE_MATCH'
  END AS single_query_result
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'family.diallo@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn',
  'test.admin@terangafoncier.sn'
)
ORDER BY single_query_result, au.email;