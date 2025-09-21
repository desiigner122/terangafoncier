-- ======================================================================
-- FIX FINAL - Ajouter email_verified:true dans raw_user_meta_data
-- pour tous les comptes qui échouent
-- ======================================================================

-- 1) D'abord, identifier tous les comptes sans email_verified
SELECT 
  id, 
  email, 
  raw_user_meta_data,
  (raw_user_meta_data->>'email_verified') AS current_email_verified
FROM auth.users 
WHERE (raw_user_meta_data->>'email_verified') IS NULL
   OR (raw_user_meta_data->>'email_verified') != 'true'
ORDER BY email;

-- 2) Mettre à jour TOUS les comptes pour ajouter email_verified:true
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"email_verified": true}'::jsonb
WHERE (raw_user_meta_data->>'email_verified') IS NULL
   OR (raw_user_meta_data->>'email_verified') != 'true';

-- 3) Vérifier que tous les comptes ont maintenant email_verified:true
SELECT 
  id, 
  email, 
  (raw_user_meta_data->>'email_verified') AS email_verified_status
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
ORDER BY email;