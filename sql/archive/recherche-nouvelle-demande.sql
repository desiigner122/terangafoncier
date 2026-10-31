-- ========================================
-- 🔍 RECHERCHE DE LA NOUVELLE DEMANDE
-- ========================================

-- 1. TOUTES les transactions des dernières 2 heures
SELECT 
  '=== TRANSACTIONS DES 2 DERNIÈRES HEURES ===' as section;

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
  p.title as parcelle,
  p.seller_id as parcelle_seller_id
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.created_at > NOW() - INTERVAL '2 hours'
ORDER BY t.created_at DESC;

-- 2. Transactions du compte particulier (acheteur)
SELECT 
  '=== DERNIÈRES TRANSACTIONS DU PARTICULIER ===' as section;

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
  buyer.user_type as type_acheteur,
  p.title as parcelle,
  p.seller_id as vendeur_parcelle
FROM transactions t
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE buyer.user_type = 'Particulier'
   OR buyer.role = 'particulier'
ORDER BY t.created_at DESC
LIMIT 10;

-- 3. Toutes les demandes d achat (tous types)
SELECT 
  '=== TOUTES LES DEMANDES ACHAT ===' as section;

SELECT 
  id,
  transaction_type,
  status,
  parcel_id,
  buyer_id,
  seller_id,
  amount,
  created_at
FROM transactions
WHERE transaction_type IN ('purchase', 'request', 'offer', 'achat', 'demande')
ORDER BY created_at DESC
LIMIT 20;

-- 4. Compter les transactions par type
SELECT 
  '=== STATISTIQUES PAR TYPE ===' as section;

SELECT 
  transaction_type,
  COUNT(*) as total,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as dernieres_24h,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as derniere_heure
FROM transactions
GROUP BY transaction_type
ORDER BY total DESC;

-- 5. Vérifier les requests (table ancienne)
SELECT 
  '=== TABLE REQUESTS (si elle existe) ===' as section;

SELECT 
  id,
  user_id as buyer_id,
  parcel_id,
  status,
  created_at
FROM requests
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC;

-- 6. Chercher TOUTES les transactions liées à Heritage (même indirectement)
SELECT 
  '=== TOUTES RÉFÉRENCES À HERITAGE ===' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.parcel_id,
  t.buyer_id,
  t.seller_id,
  t.created_at,
  CASE 
    WHEN t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111' THEN '✅ seller_id = Heritage'
    WHEN p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111' THEN '✅ Parcelle de Heritage'
    ELSE '❌ Pas lié à Heritage'
  END as lien_heritage
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
   OR p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
