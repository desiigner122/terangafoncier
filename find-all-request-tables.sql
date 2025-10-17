-- 🔍 TROUVER TOUTES LES TABLES DE DEMANDES
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. LISTER TOUTES LES TABLES CONTENANT "request"
-- ========================================
SELECT 
  '📋 TABLES AVEC "REQUEST"' as info,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%request%'
ORDER BY table_name;

-- ========================================
-- 2. STRUCTURE DE LA TABLE requests
-- ========================================
SELECT 
  '🔧 TABLE: requests - STRUCTURE' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;

-- ========================================
-- 3. CONTENU DE LA TABLE requests
-- ========================================
SELECT 
  '📊 TABLE: requests - DONNÉES' as info,
  id,
  user_id as buyer_id,
  parcel_id,
  offered_price,
  status,
  request_type,
  created_at
FROM requests
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 4. STRUCTURE DE LA TABLE purchase_requests (SI ELLE EXISTE)
-- ========================================
SELECT 
  '🔧 TABLE: purchase_requests - STRUCTURE' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'purchase_requests'
ORDER BY ordinal_position;

-- ========================================
-- 5. CONTENU DE LA TABLE purchase_requests (SI ELLE EXISTE)
-- ========================================
SELECT 
  '📊 TABLE: purchase_requests - DONNÉES' as info,
  *
FROM purchase_requests
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 6. VÉRIFIER LES PARCELLES ET LEURS DEMANDES
-- ========================================
SELECT 
  '🏠 PARCELLES + REQUESTS COUNT' as info,
  p.id as parcel_id,
  p.title,
  p.seller_id,
  prof.email as seller_email,
  (SELECT COUNT(*) FROM requests r WHERE r.parcel_id = p.id) as requests_count
FROM parcels p
LEFT JOIN profiles prof ON prof.id = p.seller_id
ORDER BY p.created_at DESC
LIMIT 10;
