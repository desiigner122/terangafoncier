-- ========================================
-- 🔍 RECHERCHE SIMPLE: Votre nouvelle demande
-- ========================================

-- Requête 1: Les 10 dernières transactions TOUTES CONFONDUES
SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.created_at,
  buyer.email as acheteur,
  p.title as parcelle
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN parcels p ON t.parcel_id = p.id
ORDER BY t.created_at DESC
LIMIT 10;

-- Requête 2: Transactions pour les parcelles de Heritage
SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.created_at,
  t.seller_id,
  buyer.email as acheteur,
  p.title as parcelle
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

-- Requête 3: Compter par type
SELECT 
  transaction_type,
  COUNT(*) as nombre
FROM transactions
GROUP BY transaction_type;
