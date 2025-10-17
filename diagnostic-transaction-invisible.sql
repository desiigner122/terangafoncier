-- ========================================
-- 🔍 DIAGNOSTIC: Pourquoi la demande n'apparaît pas
-- ========================================

-- 1. Vérifier TOUTES les transactions de Heritage (vendeur)
SELECT 
  '=== TRANSACTIONS POUR HERITAGE (VENDEUR) ===' as section;

SELECT 
  t.id,
  t.parcel_id,
  t.buyer_id,
  t.seller_id,
  t.transaction_type,
  t.status,
  t.amount,
  t.payment_method,
  t.created_at,
  p.title as parcel_title,
  p.name as parcel_name
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- Heritage Fall (vendeur)
ORDER BY t.created_at DESC;

-- 2. Vérifier les transactions où Heritage est ACHETEUR
SELECT 
  '=== TRANSACTIONS POUR HERITAGE (ACHETEUR) ===' as section;

SELECT 
  t.id,
  t.parcel_id,
  t.buyer_id,
  t.seller_id,
  t.transaction_type,
  t.status,
  t.amount,
  t.payment_method,
  t.created_at,
  t.description,
  p.title as parcel_title,
  seller.email as vendeur_email
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles seller ON t.seller_id = seller.id
WHERE t.buyer_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- Heritage Fall (acheteur)
ORDER BY t.created_at DESC;

-- 3. Les 10 dernières transactions créées (tous utilisateurs)
SELECT 
  '=== LES 10 DERNIÈRES TRANSACTIONS ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.created_at,
  buyer.email as acheteur,
  seller.email as vendeur,
  p.title as parcelle
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN profiles seller ON t.seller_id = seller.id
LEFT JOIN parcels p ON t.parcel_id = p.id
ORDER BY t.created_at DESC
LIMIT 10;

-- 4. Statistiques par transaction_type
SELECT 
  '=== STATISTIQUES PAR TYPE ===' as section;

SELECT 
  transaction_type,
  status,
  COUNT(*) as count
FROM transactions
GROUP BY transaction_type, status
ORDER BY transaction_type, status;

-- 5. Vérifier les parcelles de Heritage
SELECT 
  '=== PARCELLES DE HERITAGE ===' as section;

SELECT 
  id,
  title,
  name,
  price,
  status,
  created_at
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC;

-- 6. Vérifier si la nouvelle transaction a bien le bon seller_id
SELECT 
  '=== VÉRIFICATION SELLER_ID ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.seller_id,
  p.seller_id as parcelle_seller_id,
  CASE 
    WHEN t.seller_id IS NULL THEN '❌ seller_id NULL'
    WHEN t.seller_id != p.seller_id THEN '⚠️ Mismatch seller_id'
    ELSE '✅ OK'
  END as verification
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.created_at > NOW() - INTERVAL '1 hour'  -- Créées dans la dernière heure
ORDER BY t.created_at DESC;

-- 7. Requête exacte utilisée par VendeurPurchaseRequests.jsx
SELECT 
  '=== REQUÊTE EXACTE DU DASHBOARD VENDEUR ===' as section;

-- Simuler la requête du dashboard
WITH seller_parcels AS (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
SELECT 
  t.*,
  p.title as parcel_title,
  buyer.email as buyer_email
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
WHERE t.parcel_id IN (SELECT id FROM seller_parcels)
  AND t.transaction_type IN ('purchase', 'request', 'offer')
ORDER BY t.created_at DESC;

-- 8. SOLUTION: Si la transaction n'apparaît pas, corriger le seller_id
SELECT 
  '=== COMMANDE POUR CORRIGER SI NÉCESSAIRE ===' as section;

-- Décommentez et exécutez cette commande si nécessaire:
/*
UPDATE transactions t
SET seller_id = p.seller_id
FROM parcels p
WHERE t.parcel_id = p.id
  AND t.seller_id IS NULL;
*/

-- 9. Vérifier les buyer_info
SELECT 
  '=== VÉRIFICATION BUYER_INFO ===' as section;

SELECT 
  id,
  transaction_type,
  buyer_id,
  buyer_info,
  created_at
FROM transactions
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
