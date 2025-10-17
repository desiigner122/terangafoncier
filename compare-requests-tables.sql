-- 🔍 DIAGNOSTIC COMPLET : Comparer requests vs purchase_requests
-- Exécuter dans Supabase SQL Editor pour identifier la bonne table

-- ========================================
-- 1. Table REQUESTS (utilisée actuellement)
-- ========================================
SELECT 
  '📋 TABLE: requests' as source,
  id,
  parcel_id,
  user_id as buyer_id,
  offered_price as offer_amount,
  status,
  request_type,
  created_at,
  message
FROM requests
WHERE parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY created_at DESC;

-- ========================================
-- 2. Table PURCHASE_REQUESTS (peut-être la vraie?)
-- ========================================
-- D'abord voir toutes les colonnes disponibles
SELECT 
  '� PURCHASE_REQUESTS STRUCTURE' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_requests'
ORDER BY ordinal_position;

-- Ensuite voir les données (sans filtrer par parcel_id qui n'existe peut-être pas)
SELECT 
  '📋 TABLE: purchase_requests (TOUTES)' as source,
  *
FROM purchase_requests
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 3. COMPARAISON GLOBALE par parcelle
-- ========================================
SELECT 
  '📊 TOUTES LES PARCELLES' as info,
  p.id as parcel_id,
  p.title as parcel_title,
  p.seller_id,
  prof.email as seller_email,
  (SELECT COUNT(*) FROM requests WHERE parcel_id = p.id) as requests_count
FROM parcels p
LEFT JOIN profiles prof ON prof.id = p.seller_id
ORDER BY p.created_at DESC
LIMIT 10;

-- ========================================
-- 4. STRUCTURE des deux tables
-- ========================================
SELECT 
  '🔧 REQUESTS COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;

-- ========================================
-- 5. VÉRIFIER vos vraies demandes ailleurs
-- ========================================
-- Peut-être que vos demandes sont dans une autre parcelle?
SELECT 
  '🔍 VOS VRAIES DEMANDES?' as info,
  r.id,
  r.parcel_id,
  p.title as parcel_title,
  p.seller_id,
  prof.email as seller_email,
  r.status,
  r.created_at
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles prof ON prof.id = p.seller_id
WHERE prof.email LIKE '%heritage%' OR prof.email LIKE '%fall%'
ORDER BY r.created_at DESC
LIMIT 20;
