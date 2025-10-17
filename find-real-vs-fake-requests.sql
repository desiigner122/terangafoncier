-- 🎯 IDENTIFIER LA VRAIE DEMANDE (celle avec message)
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- LA VRAIE DEMANDE (avec message)
-- ========================================
SELECT 
  '✅ VRAIE DEMANDE' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  r.user_id as buyer_id,
  buyer.email as acheteur_email,
  buyer.first_name,
  buyer.last_name
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  AND r.message IS NOT NULL
ORDER BY r.created_at DESC;

-- ========================================
-- LES 5 FAUSSES DEMANDES (sans message)
-- ========================================
SELECT 
  '⚠️ FAUSSES DEMANDES (à supprimer)' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.user_id as buyer_id
FROM requests r
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  AND r.message IS NULL
ORDER BY r.created_at DESC;
