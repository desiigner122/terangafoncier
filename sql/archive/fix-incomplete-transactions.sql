-- ==========================================
-- CORRECTION DES TRANSACTIONS INCOMPLETES
-- ==========================================
-- Ce script corrige les transactions existantes qui manquent:
-- - transaction_type
-- - buyer_id
-- - seller_id
-- - parcel_id
-- en récupérant ces informations depuis les tables requests et parcels

-- Étape 1: Identifier les transactions à corriger
SELECT 
  t.id,
  t.user_id,
  t.request_id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  r.parcel_id as request_parcel_id,
  r.user_id as request_user_id,
  p.seller_id as parcel_seller_id
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
LEFT JOIN parcels p ON r.parcel_id = p.id
WHERE 
  t.transaction_type IS NULL 
  OR t.buyer_id IS NULL 
  OR t.seller_id IS NULL 
  OR t.parcel_id IS NULL;

-- Étape 2: Appliquer la correction
-- UPDATE transactions SET
--   transaction_type = COALESCE(transaction_type, 'purchase'),
--   buyer_id = COALESCE(buyer_id, r.user_id),
--   seller_id = COALESCE(seller_id, p.seller_id),
--   parcel_id = COALESCE(parcel_id, r.parcel_id)
-- FROM requests r
-- JOIN parcels p ON r.parcel_id = p.id
-- WHERE 
--   transactions.request_id = r.id
--   AND (
--     transactions.transaction_type IS NULL 
--     OR transactions.buyer_id IS NULL 
--     OR transactions.seller_id IS NULL 
--     OR transactions.parcel_id IS NULL
--   );

-- Étape 3: Vérifier que toutes les transactions sont complètes
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) as with_type,
  COUNT(CASE WHEN buyer_id IS NOT NULL THEN 1 END) as with_buyer,
  COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as with_seller,
  COUNT(CASE WHEN parcel_id IS NOT NULL THEN 1 END) as with_parcel,
  COUNT(CASE 
    WHEN transaction_type IS NOT NULL 
    AND buyer_id IS NOT NULL 
    AND seller_id IS NOT NULL 
    AND parcel_id IS NOT NULL 
    THEN 1 
  END) as complete_transactions
FROM transactions;

-- Étape 4: Vérifier les transactions d'Heritage (vendeur)
SELECT 
  t.id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  t.description,
  t.created_at,
  p.title as parcel_title,
  p.location as parcel_location
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

-- Étape 5: Afficher les transactions qui apparaîtront maintenant dans le dashboard vendeur
SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.description,
  t.created_at,
  p.title as parcel_title,
  p.seller_id,
  pr.email as seller_email,
  pr.full_name as seller_name
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
INNER JOIN profiles pr ON p.seller_id = pr.id
WHERE t.transaction_type IN ('purchase', 'request', 'offer')
  AND p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
