-- ========================================
-- 🔧 CORRECTION: Remplir seller_id manquant
-- ========================================

-- Ce script corrige les transactions qui n'ont pas de seller_id
-- en le copiant depuis la parcelle associée

BEGIN;

-- 1. Afficher ce qui va être corrigé
SELECT 
  '=== TRANSACTIONS À CORRIGER ===' as info;

SELECT 
  t.id,
  t.transaction_type,
  t.parcel_id,
  t.seller_id as seller_id_actuel,
  p.seller_id as seller_id_correct,
  p.title as parcelle
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE t.seller_id IS NULL
   OR t.seller_id != p.seller_id;

-- 2. Effectuer la correction
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE transactions t
  SET seller_id = p.seller_id,
      updated_at = NOW()
  FROM parcels p
  WHERE t.parcel_id = p.id
    AND (t.seller_id IS NULL OR t.seller_id != p.seller_id);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE '✅ % transaction(s) corrigée(s)', updated_count;
END $$;

-- 3. Afficher le résultat
SELECT 
  '=== RÉSULTAT DE LA CORRECTION ===' as info;

-- 4. Vérifier les transactions de Heritage après correction
SELECT 
  '=== TRANSACTIONS DE HERITAGE APRÈS CORRECTION ===' as info;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.seller_id,
  p.title as parcelle,
  t.created_at
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

COMMIT;

-- 5. Message final
DO $$
BEGIN
  RAISE NOTICE '✅ Correction terminée !';
  RAISE NOTICE '🔄 Rafraîchissez votre application (F5)';
  RAISE NOTICE '📊 Les demandes devraient maintenant apparaître';
END $$;
