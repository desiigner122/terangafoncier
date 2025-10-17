-- 🎯 TROUVER LA DEMANDE MANQUANTE
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- LA DEMANDE ID: 94f23fd0-f972-4b8a-95d7-c664a8b27fc7
-- ========================================
SELECT 
  '✅ DEMANDE MANQUANTE' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  LENGTH(COALESCE(r.message, '')) as message_length,
  r.user_id as buyer_id,
  buyer.email as acheteur_email,
  buyer.first_name,
  buyer.last_name
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.id = '94f23fd0-f972-4b8a-95d7-c664a8b27fc7';

-- ========================================
-- TOUTES LES 6 DEMANDES (sans filtre)
-- ========================================
SELECT 
  '📋 LES 6 DEMANDES' as type,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  CASE 
    WHEN r.message IS NULL THEN 'NULL'
    WHEN r.message = '' THEN 'VIDE'
    ELSE SUBSTRING(r.message, 1, 50)
  END as message_preview,
  r.user_id as buyer_id
FROM requests r
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;
