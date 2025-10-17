-- ========================================
-- 🔍 VÉRIFICATION DERNIÈRE TRANSACTION CRÉÉE
-- ========================================

-- 1. Les 5 dernières transactions créées
SELECT 
  id,
  parcel_id,
  buyer_id,
  seller_id,
  transaction_type,
  status,
  amount,
  payment_method,
  created_at,
  description
FROM transactions
ORDER BY created_at DESC
LIMIT 5;

-- 2. Transactions pour la parcelle de Heritage Fall
SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.payment_method,
  t.created_at,
  p.title as parcel_title,
  p.name as parcel_name,
  buyer.email as buyer_email,
  seller.email as seller_email
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
LEFT JOIN profiles seller ON t.seller_id = seller.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- Heritage Fall
ORDER BY t.created_at DESC;

-- 3. Vérifier les IDs des parcelles de Heritage
SELECT 
  id,
  title,
  name,
  price,
  location,
  seller_id,
  status,
  created_at
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC;

-- 4. Statistiques des transactions par type
SELECT 
  transaction_type,
  status,
  COUNT(*) as count
FROM transactions
WHERE parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
GROUP BY transaction_type, status;

-- 5. Vérifier si la table purchase_cases existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'purchase_cases'
) as purchase_cases_exists;

-- 6. Si elle existe, afficher les dossiers workflow créés
-- (Décommentez cette section après avoir créé la table)
/*
SELECT 
  pc.id,
  pc.case_number,
  pc.status,
  pc.phase,
  pc.created_at,
  t.id as transaction_id,
  t.transaction_type,
  t.status as transaction_status
FROM purchase_cases pc
LEFT JOIN transactions t ON pc.request_id = t.id
WHERE pc.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY pc.created_at DESC;
*/
