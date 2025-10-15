-- ============================================
-- AUDIT COMPLET SCHÉMA SUPABASE
-- Date : 15 Octobre 2025
-- ============================================

-- ============================================
-- 1. LISTER TOUTES LES TABLES
-- ============================================
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 2. COLONNES TABLE messages
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'messages'
ORDER BY ordinal_position;

-- ============================================
-- 3. COLONNES TABLE conversations
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'conversations'
ORDER BY ordinal_position;

-- ============================================
-- 4. COLONNES TABLE crm_contacts
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'crm_contacts'
ORDER BY ordinal_position;

-- ============================================
-- 5. COLONNES TABLE fraud_checks
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'fraud_checks'
ORDER BY ordinal_position;

-- ============================================
-- 6. COLONNES TABLE gps_coordinates
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'gps_coordinates'
ORDER BY ordinal_position;

-- ============================================
-- 7. COLONNES TABLE property_photos
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'property_photos'
ORDER BY ordinal_position;

-- ============================================
-- 8. COLONNES TABLE blockchain_certificates
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'blockchain_certificates'
ORDER BY ordinal_position;

-- ============================================
-- 9. COLONNES TABLE parcels (DÉJÀ CORRIGÉ)
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'parcels'
ORDER BY ordinal_position;

-- ============================================
-- 10. COLONNES TABLE properties
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'properties'
ORDER BY ordinal_position;

-- ============================================
-- 11. COLONNES TABLE purchase_requests
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'purchase_requests'
ORDER BY ordinal_position;

-- ============================================
-- 12. COLONNES TABLE bank_financing_details
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'bank_financing_details'
ORDER BY ordinal_position;

-- ============================================
-- 13. VÉRIFIER SI property_views EXISTE
-- ============================================
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'property_views'
) AS property_views_existe;

-- ============================================
-- 14. VÉRIFIER SI conversations_vendeur EXISTE
-- ============================================
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'conversations_vendeur'
) AS conversations_vendeur_existe;

-- ============================================
-- 15. VÉRIFIER SI contact_requests EXISTE
-- ============================================
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'contact_requests'
) AS contact_requests_existe;

-- ============================================
-- 16. FOREIGN KEYS DE purchase_requests
-- ============================================
SELECT
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'purchase_requests';

-- ============================================
-- FIN DE L'AUDIT
-- ============================================
