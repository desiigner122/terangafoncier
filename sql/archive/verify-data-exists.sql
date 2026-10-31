-- 🔍 VÉRIFICATION SIMPLE: EST-CE QUE LES DEMANDES EXISTENT ENCORE?

-- 1. Compter TOUTES les demandes dans la table
SELECT 
  '📊 TOTAL DEMANDES' as info,
  COUNT(*) as nombre_total
FROM requests;

-- 2. Voir TOUTES les demandes (sans filtre)
SELECT 
  '📋 TOUTES LES DEMANDES' as info,
  id,
  user_id,
  parcel_id,
  request_type,
  status,
  created_at,
  payment_method
FROM requests
ORDER BY created_at DESC;

-- 3. Vérifier si le parcel_id existe toujours
SELECT 
  '🏡 VÉRIF TERRAIN' as info,
  id,
  title,
  owner_id
FROM parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- 4. Vérifier si le user_id existe toujours
SELECT 
  '👤 VÉRIF ACHETEUR' as info,
  id,
  email,
  first_name,
  last_name
FROM profiles
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';
