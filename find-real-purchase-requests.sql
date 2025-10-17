-- 🔍 TROUVER TOUTES VOS VRAIES DEMANDES D'ACHAT
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. VOS PARCELLES
-- ========================================
SELECT 
  '🏠 VOS PARCELLES' as info,
  id,
  title,
  name,
  price,
  status,
  created_at
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC;

-- ========================================
-- 2. TOUTES LES DEMANDES (requests) POUR VOS PARCELLES
-- ========================================
SELECT 
  '📋 REQUESTS POUR VOS PARCELLES' as info,
  r.id,
  r.parcel_id,
  p.title as parcel_name,
  r.user_id as buyer_id,
  prof.email as buyer_email,
  prof.first_name || ' ' || prof.last_name as buyer_name,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  r.created_at,
  -- Vérifier si c'est une demande de test (créée aujourd'hui/hier)
  CASE 
    WHEN r.created_at > NOW() - INTERVAL '2 days' THEN '⚠️ TEST'
    ELSE '✅ VRAIE'
  END as is_real
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles prof ON prof.id = r.user_id
WHERE r.parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
ORDER BY r.created_at DESC;

-- ========================================
-- 3. CHERCHER DANS D'AUTRES TABLES POSSIBLES
-- ========================================
-- Transactions liées à vos parcelles
SELECT 
  '💰 TRANSACTIONS LIÉES' as info,
  t.id,
  t.request_id,
  t.amount,
  t.status,
  t.created_at
FROM transactions t
WHERE t.request_id IN (
  SELECT r.id FROM requests r
  WHERE r.parcel_id IN (
    SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  )
)
ORDER BY t.created_at DESC;

-- ========================================
-- 4. CONVERSATIONS LIÉES
-- ========================================
SELECT 
  '💬 CONVERSATIONS VENDEUR' as info,
  c.id,
  c.property_id,
  c.vendor_id,
  c.buyer_id,
  buyer.email as buyer_email,
  c.status,
  c.created_at
FROM conversations c
LEFT JOIN profiles buyer ON buyer.id = c.buyer_id
WHERE c.vendor_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY c.created_at DESC
LIMIT 20;

-- ========================================
-- 5. VÉRIFIER LES DATES DE CRÉATION
-- ========================================
SELECT 
  '📅 ANALYSE TEMPORELLE' as info,
  DATE(created_at) as date,
  COUNT(*) as demandes_count,
  string_agg(DISTINCT status, ', ') as statuts,
  string_agg(DISTINCT request_type, ', ') as types
FROM requests
WHERE parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ========================================
-- 6. TOUTES LES DEMANDES DANS LA BASE (pour comparaison)
-- ========================================
SELECT 
  '🌍 TOUTES LES DEMANDES (TOP 30)' as info,
  r.id,
  r.parcel_id,
  p.title as parcel_name,
  p.seller_id,
  seller.email as seller_email,
  r.user_id as buyer_id,
  buyer.email as buyer_email,
  r.offered_price,
  r.status,
  r.created_at
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles seller ON seller.id = p.seller_id
LEFT JOIN profiles buyer ON buyer.id = r.user_id
ORDER BY r.created_at DESC
LIMIT 30;
