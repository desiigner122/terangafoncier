-- 🔍 TROUVER LA 6ÈME DEMANDE (celle avec message vide '')
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- TOUTES LES 6 DEMANDES AVEC LEUR MESSAGE
-- ========================================
SELECT 
  '📋 TOUTES LES DEMANDES (message exact)' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  CASE 
    WHEN r.message IS NULL THEN '❌ NULL'
    WHEN r.message = '' THEN '⚠️ VIDE'
    ELSE '✅ AVEC CONTENU'
  END as message_status,
  LENGTH(COALESCE(r.message, '')) as message_length,
  r.user_id as buyer_id,
  buyer.email as acheteur_email
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;

-- ========================================
-- LA 6ÈME DEMANDE (message vide ou avec contenu)
-- ========================================
SELECT 
  '✅ 6ÈME DEMANDE' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  r.user_id as buyer_id,
  buyer.email as acheteur_email
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  AND (r.message IS NOT NULL OR r.message != '')
ORDER BY r.created_at DESC;
