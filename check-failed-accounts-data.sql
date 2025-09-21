-- ======================================================================
-- VÉRIFICATION RAPIDE: QUI A DES DONNÉES DANS LES TABLES PUBLIQUES
-- ======================================================================

-- Vérifier spécifiquement les 14 comptes qui échouent
SELECT 'FAILED ACCOUNTS DATA CHECK' AS section,
  au.email,
  CASE WHEN pu.id IS NOT NULL THEN 'YES' ELSE 'NO' END AS in_public_users,
  CASE WHEN pp.id IS NOT NULL THEN 'YES' ELSE 'NO' END AS in_public_profiles
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
LEFT JOIN public.profiles pp ON pp.id = au.id
WHERE au.email IN (
  'test.admin@terangafoncier.sn',
  'family.diallo@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'urban.developers@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn',
  'credit.agricole@teranga-foncier.sn',
  'etude.diouf@teranga-foncier.sn',
  'chambre.notaires@teranga-foncier.sn',
  'foncier.expert@teranga-foncier.sn',
  'teranga.immobilier@teranga-foncier.sn'
)
ORDER BY au.email;