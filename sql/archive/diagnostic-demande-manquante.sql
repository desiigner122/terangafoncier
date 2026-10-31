-- ========================================
-- 🔍 DIAGNOSTIC: Demande invisible côté vendeur
-- ========================================

-- Le problème: La demande existe côté acheteur mais pas côté vendeur

-- 1. Toutes les transactions récentes (dernières 24h)
SELECT 
  '=== TOUTES LES TRANSACTIONS RÉCENTES ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.parcel_id,
  t.buyer_id,
  t.seller_id,
  t.created_at,
  buyer.email as acheteur,
  seller.email as vendeur,
  p.title as parcelle
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN profiles seller ON t.seller_id = seller.id
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.created_at > NOW() - INTERVAL '24 hours'
ORDER BY t.created_at DESC;

-- 2. Parcelles de Heritage Fall
SELECT 
  '=== PARCELLES DE HERITAGE ===' as section;

SELECT 
  id,
  title,
  name,
  seller_id,
  status
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 3. Transactions pour les parcelles de Heritage
SELECT 
  '=== TRANSACTIONS POUR LES PARCELLES DE HERITAGE ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.parcel_id,
  t.buyer_id,
  t.seller_id,
  p.title as parcelle_titre,
  buyer.email as acheteur_email
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

-- 4. Vérifier si seller_id est NULL dans les transactions
SELECT 
  '=== TRANSACTIONS AVEC SELLER_ID NULL ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.parcel_id,
  t.seller_id,
  p.seller_id as seller_id_parcelle,
  CASE 
    WHEN t.seller_id IS NULL THEN '❌ PROBLÈME: seller_id NULL'
    WHEN t.seller_id != p.seller_id THEN '❌ PROBLÈME: seller_id incorrect'
    ELSE '✅ OK'
  END as diagnostic
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 5. Vérifier les types de transactions acceptés
SELECT 
  '=== TYPES DE TRANSACTIONS ===' as section;

SELECT 
  transaction_type,
  COUNT(*) as nombre,
  array_agg(DISTINCT status) as statuts
FROM transactions
WHERE parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
GROUP BY transaction_type;

-- 6. SOLUTION: Mettre à jour seller_id si NULL
SELECT 
  '=== CORRECTION AUTOMATIQUE ===' as section;

UPDATE transactions t
SET seller_id = p.seller_id,
    updated_at = NOW()
FROM parcels p
WHERE t.parcel_id = p.id
  AND p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  AND (t.seller_id IS NULL OR t.seller_id != p.seller_id)
RETURNING 
  t.id,
  t.transaction_type,
  t.seller_id as nouveau_seller_id,
  'Corrigé ✅' as statut;

-- 7. Vérification finale
SELECT 
  '=== VÉRIFICATION FINALE ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.seller_id,
  p.seller_id as seller_id_parcelle,
  CASE 
    WHEN t.seller_id = p.seller_id THEN '✅ OK - Devrait apparaître côté vendeur'
    ELSE '❌ Toujours un problème'
  END as resultat
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
