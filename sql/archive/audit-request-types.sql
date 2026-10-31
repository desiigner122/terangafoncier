-- 🔍 AUDIT COMPLET DES TYPES DE DEMANDES
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. TOUS LES TYPES DE DEMANDES EXISTANTS
-- ========================================
SELECT 
  '📊 TYPES DE DEMANDES' as info,
  request_type,
  COUNT(*) as nombre,
  COUNT(DISTINCT user_id) as acheteurs_uniques,
  MIN(created_at) as premiere,
  MAX(created_at) as derniere
FROM requests
GROUP BY request_type
ORDER BY nombre DESC;

-- ========================================
-- 2. DEMANDES PAR TYPE POUR VOTRE PARCELLE
-- ========================================
SELECT 
  '🏠 DEMANDES POUR VOTRE PARCELLE' as info,
  r.id,
  r.request_type,
  r.created_at,
  r.offered_price,
  r.status,
  r.message,
  buyer.email as acheteur
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;

-- ========================================
-- 3. RECHERCHE DEMANDES AVEC TYPES SPÉCIFIQUES
-- ========================================
SELECT 
  '💰 DEMANDES PAIEMENT UNIQUE' as type,
  r.id,
  r.created_at,
  r.offered_price,
  buyer.email as acheteur,
  r.message
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.request_type ILIKE '%unique%' 
   OR r.request_type ILIKE '%one%time%'
   OR r.request_type ILIKE '%cash%'
ORDER BY r.created_at DESC;

SELECT 
  '📅 DEMANDES PAIEMENT ÉCHELONNÉ' as type,
  r.id,
  r.created_at,
  r.offered_price,
  buyer.email as acheteur,
  r.message
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.request_type ILIKE '%echelon%'
   OR r.request_type ILIKE '%installment%'
   OR r.request_type ILIKE '%payment_plan%'
ORDER BY r.created_at DESC;

SELECT 
  '🏦 DEMANDES FINANCEMENT BANCAIRE' as type,
  r.id,
  r.created_at,
  r.offered_price,
  buyer.email as acheteur,
  r.message
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.request_type ILIKE '%banc%'
   OR r.request_type ILIKE '%bank%'
   OR r.request_type ILIKE '%financ%'
ORDER BY r.created_at DESC;

-- ========================================
-- 4. TOUTES LES VALEURS UNIQUES DE request_type
-- ========================================
SELECT 
  '🔧 VALEURS request_type' as info,
  request_type,
  COUNT(*) as occurrences
FROM requests
GROUP BY request_type
ORDER BY occurrences DESC;

-- ========================================
-- 5. DEMANDES DEPUIS HIER (14 oct)
-- ========================================
SELECT 
  '📅 DEMANDES RÉCENTES (depuis 14 oct)' as info,
  r.id,
  r.created_at,
  r.request_type,
  r.offered_price,
  r.status,
  r.message,
  buyer.email as acheteur,
  buyer.first_name,
  buyer.last_name
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.created_at >= '2025-10-14'::date
ORDER BY r.created_at DESC;

-- ========================================
-- 6. CHERCHER DANS D'AUTRES TABLES POSSIBLES
-- ========================================
-- Peut-être que les vraies demandes sont dans une autre table?
SELECT 
  '📋 TABLES AVEC "PAYMENT" OU "FINANCING"' as info,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (
    table_name ILIKE '%payment%'
    OR table_name ILIKE '%financing%'
    OR table_name ILIKE '%transaction%'
    OR table_name ILIKE '%offer%'
  )
ORDER BY table_name;
