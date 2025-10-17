-- ========================================
-- DIAGNOSTIC TRANSACTIONS INCOMPLÈTES
-- ========================================
-- Trouve les transactions créées sans parcel_id, buyer_id, seller_id, transaction_type
-- Et les corrige en utilisant les données de la table requests

-- ========================================
-- ÉTAPE 1: Identifier les transactions incomplètes
-- ========================================
SELECT 
    '=== TRANSACTIONS INCOMPLÈTES ===' as section,
    COUNT(*) as total_incomplete
FROM transactions 
WHERE transaction_type IS NULL 
   OR buyer_id IS NULL 
   OR parcel_id IS NULL;

-- ========================================
-- ÉTAPE 2: Voir les détails des transactions incomplètes
-- ========================================
SELECT 
    '=== DÉTAILS TRANSACTIONS INCOMPLÈTES ===' as section,
    t.id,
    t.user_id,
    t.request_id,
    t.transaction_type,
    t.buyer_id,
    t.seller_id,
    t.parcel_id,
    t.status,
    t.amount,
    t.description,
    t.created_at,
    r.parcel_id as request_parcel_id,
    r.type as request_type,
    r.user_id as request_user_id
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
WHERE t.transaction_type IS NULL 
   OR t.buyer_id IS NULL 
   OR t.parcel_id IS NULL
ORDER BY t.created_at DESC;

-- ========================================
-- ÉTAPE 3: Voir les parcelles pour récupérer seller_id
-- ========================================
SELECT 
    '=== PARCELLES ET VENDEURS ===' as section,
    t.id as transaction_id,
    r.parcel_id,
    p.title as parcelle_title,
    p.seller_id,
    seller.email as vendeur_email
FROM transactions t
JOIN requests r ON t.request_id = r.id
JOIN parcels p ON r.parcel_id = p.id
LEFT JOIN profiles seller ON p.seller_id = seller.id
WHERE t.transaction_type IS NULL 
   OR t.buyer_id IS NULL 
   OR t.parcel_id IS NULL
ORDER BY t.created_at DESC;

-- ========================================
-- ÉTAPE 4: AUTO-CORRECTION (commentée par défaut)
-- ========================================
-- Décommentez pour exécuter la correction automatique

/*
UPDATE transactions t
SET 
    transaction_type = CASE 
        WHEN r.type = 'one_time' THEN 'purchase'
        WHEN r.type = 'installments' THEN 'purchase'
        WHEN r.type = 'bank_financing' THEN 'purchase'
        ELSE 'request'
    END,
    buyer_id = r.user_id,
    parcel_id = r.parcel_id,
    seller_id = p.seller_id
FROM requests r
LEFT JOIN parcels p ON r.parcel_id = p.id
WHERE t.request_id = r.id
  AND (t.transaction_type IS NULL 
       OR t.buyer_id IS NULL 
       OR t.parcel_id IS NULL);
*/

-- ========================================
-- ÉTAPE 5: Vérification après correction
-- ========================================
-- Exécutez ceci APRÈS avoir décommenté et exécuté l'ÉTAPE 4

SELECT 
    '=== VÉRIFICATION POST-CORRECTION ===' as section,
    COUNT(*) as total_transactions,
    COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) as avec_type,
    COUNT(CASE WHEN buyer_id IS NOT NULL THEN 1 END) as avec_buyer,
    COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as avec_seller,
    COUNT(CASE WHEN parcel_id IS NOT NULL THEN 1 END) as avec_parcel
FROM transactions;

-- ========================================
-- ÉTAPE 6: Transactions pour Heritage après correction
-- ========================================
SELECT 
    '=== TRANSACTIONS HERITAGE APRÈS CORRECTION ===' as section,
    t.id,
    t.transaction_type,
    t.status,
    t.buyer_id,
    t.seller_id,
    t.parcel_id,
    t.amount,
    t.created_at,
    buyer.email as acheteur,
    p.title as parcelle
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.parcel_id IN (
    SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
ORDER BY t.created_at DESC;
