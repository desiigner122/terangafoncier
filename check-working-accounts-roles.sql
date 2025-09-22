-- Vérifier les rôles des 6 comptes qui fonctionnent pour la redirection
SELECT 
  auth.email,
  auth.raw_user_meta_data ->> 'role' as auth_role,
  users.role as public_role,
  profiles.role as profile_role,
  CASE 
    WHEN auth.email = 'geowest.africa@teranga-foncier.sn' THEN 'geometre'
    WHEN auth.email = 'cabinet.ndiaye@teranga-foncier.sn' THEN 'geometre'
    WHEN auth.email = 'atlantique.capital@teranga-foncier.sn' THEN 'investisseur'
    WHEN auth.email = 'fonds.souverain@teranga-foncier.sn' THEN 'investisseur'
    WHEN auth.email = 'mairie.thies@teranga-foncier.sn' THEN 'mairie'
    WHEN auth.email = 'mairie.dakar@teranga-foncier.sn' THEN 'mairie'
  END as expected_role,
  CASE 
    WHEN auth.email IN ('geowest.africa@teranga-foncier.sn', 'cabinet.ndiaye@teranga-foncier.sn') THEN '/dashboard/geometre'
    WHEN auth.email IN ('atlantique.capital@teranga-foncier.sn', 'fonds.souverain@teranga-foncier.sn') THEN '/solutions/investisseurs/apercu'
    WHEN auth.email IN ('mairie.thies@teranga-foncier.sn', 'mairie.dakar@teranga-foncier.sn') THEN '/solutions/mairies/apercu'
  END as expected_redirect
FROM auth.users auth
LEFT JOIN public.users users ON auth.id = users.id
LEFT JOIN public.profiles profiles ON auth.id = profiles.id
WHERE auth.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn', 
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn'
)
ORDER BY auth.email;