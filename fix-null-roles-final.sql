-- ======================================================================
-- FIX FINAL DÉFINITIF - Corriger les rôles NULL dans public.users
-- ======================================================================

-- 1) Vérifier les comptes avec role = NULL
SELECT 
  pu.id, 
  pu.email, 
  pu.role as current_role_public_users,
  (au.raw_user_meta_data->>'role') as role_from_auth_metadata
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.role IS NULL
ORDER BY pu.email;

-- 2) METTRE À JOUR tous les rôles NULL avec les valeurs de auth.users metadata
UPDATE public.users 
SET role = (
  SELECT (au.raw_user_meta_data->>'role')
  FROM auth.users au 
  WHERE au.id = public.users.id
)
WHERE role IS NULL;

-- 3) Vérifier que tous les rôles ont été mis à jour
SELECT 
  email, 
  role,
  CASE WHEN role IS NULL THEN 'STILL_NULL' ELSE 'FIXED' END as fix_status
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
  'heritage.fall@teranga-foncier.sn',
  'urban.developers@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn',
  'credit.agricole@teranga-foncier.sn',
  'etude.diouf@teranga-foncier.sn',
  'chambre.notaires@teranga-foncier.sn',
  'foncier.expert@teranga-foncier.sn',
  'teranga.immobilier@teranga-foncier.sn'
)
ORDER BY email;

-- 4) Vérifier les statistiques finales des rôles
SELECT 
  COALESCE(role, 'NULL') as role_value, 
  count(*) as count
FROM public.users
GROUP BY role
ORDER BY role;