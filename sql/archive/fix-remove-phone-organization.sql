-- ======================================================================
-- FIX DÉFINITIF - Supprimer phone et organization des métadonnées
-- pour tous les comptes qui échouent
-- ======================================================================

-- 1) Identifier tous les comptes avec phone et organization
SELECT 
  email, 
  (raw_user_meta_data->>'phone') AS has_phone,
  (raw_user_meta_data->>'organization') AS has_organization
FROM auth.users 
WHERE (raw_user_meta_data->>'phone') IS NOT NULL 
   OR (raw_user_meta_data->>'organization') IS NOT NULL
ORDER BY email;

-- 2) SUPPRIMER phone et organization de TOUS les comptes
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data - 'phone' - 'organization'
WHERE (raw_user_meta_data->>'phone') IS NOT NULL 
   OR (raw_user_meta_data->>'organization') IS NOT NULL;

-- 3) Vérifier que phone et organization ont été supprimés
SELECT 
  email, 
  raw_user_meta_data,
  (raw_user_meta_data->>'phone') AS phone_check,
  (raw_user_meta_data->>'organization') AS organization_check
FROM auth.users 
WHERE email IN (
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'family.diallo@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn',
  'urban.developers@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn'
)
ORDER BY email;