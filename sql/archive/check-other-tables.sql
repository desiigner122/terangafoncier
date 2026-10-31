-- 🔍 CHERCHER VOS VRAIES DEMANDES DANS LES AUTRES TABLES
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. TABLE OFFERS (offres d'achat?)
-- ========================================
-- Structure
SELECT 
  '🔧 STRUCTURE TABLE OFFERS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'offers'
ORDER BY ordinal_position;

-- Données
SELECT 
  '💰 CONTENU TABLE OFFERS' as info,
  *
FROM offers
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 2. TABLE PAYMENTS (paiements?)
-- ========================================
-- Structure
SELECT 
  '🔧 STRUCTURE TABLE PAYMENTS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Données
SELECT 
  '💳 CONTENU TABLE PAYMENTS' as info,
  *
FROM payments
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 3. TABLE PAYMENT_METHODS (méthodes de paiement?)
-- ========================================
-- Structure
SELECT 
  '🔧 STRUCTURE TABLE PAYMENT_METHODS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payment_methods'
ORDER BY ordinal_position;

-- Données
SELECT 
  '💼 CONTENU TABLE PAYMENT_METHODS' as info,
  *
FROM payment_methods
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- 4. CHERCHER VOS DEMANDES DANS OFFERS
-- ========================================
SELECT 
  '🎯 VOS OFFRES (si la table a parcel_id ou property_id)' as info,
  o.*
FROM offers o
WHERE (
  o.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  OR o.property_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
)
ORDER BY o.created_at DESC;

-- ========================================
-- 5. CHERCHER VOS DEMANDES PAR ACHETEUR
-- ========================================
SELECT 
  '👤 VOS OFFRES PAR ACHETEUR' as info,
  o.*
FROM offers o
WHERE o.buyer_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
   OR o.user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
ORDER BY o.created_at DESC;

-- ========================================
-- 6. TOUTES LES OFFRES RÉCENTES
-- ========================================
SELECT 
  '📅 TOUTES LES OFFRES RÉCENTES' as info,
  o.*,
  buyer.email as acheteur_email
FROM offers o
LEFT JOIN profiles buyer ON (buyer.id = o.buyer_id OR buyer.id = o.user_id)
WHERE o.created_at >= '2025-10-14'::date
ORDER BY o.created_at DESC;
