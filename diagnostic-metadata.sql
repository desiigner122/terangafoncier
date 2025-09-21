-- ======================================================================
-- DIAGNOSTIC CIBLÉ: COMPARER LES MÉTADONNÉES DES COMPTES QUI MARCHENT VS ÉCHOUENT
-- ======================================================================

-- 1) Métadonnées des comptes qui ÉCHOUENT
SELECT 'FAILED ACCOUNTS METADATA' AS section, 
  email, 
  raw_user_meta_data,
  email_confirmed_at IS NOT NULL AS email_confirmed
FROM auth.users 
WHERE email IN (
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
);

-- 2) Compter les comptes avec/sans métadonnées
SELECT 'METADATA STATUS' AS section,
  CASE 
    WHEN raw_user_meta_data IS NULL OR raw_user_meta_data = '{}' THEN 'EMPTY_METADATA'
    WHEN raw_user_meta_data->>'full_name' IS NULL THEN 'NO_FULL_NAME'
    WHEN raw_user_meta_data->>'role' IS NULL THEN 'NO_ROLE'
    ELSE 'COMPLETE_METADATA'
  END AS metadata_status,
  COUNT(*) AS total
FROM auth.users 
WHERE email LIKE '%teranga%' OR email LIKE '%terangafoncier%'
GROUP BY metadata_status;