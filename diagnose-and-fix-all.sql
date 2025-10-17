-- ========================================
-- 🔍 DIAGNOSTIC COMPLET + CORRECTIONS
-- Script tout-en-un pour résoudre tous les problèmes
-- ========================================

-- ÉTAPE 1: Vérifier l'état actuel
-- ========================================

SELECT '========== ÉTAPE 1: ÉTAT ACTUEL ==========' as info;

-- 1.1. Vérifier les parcelles de Heritage
SELECT 
  '--- Parcelles de Heritage Fall ---' as section;

SELECT 
  id,
  title,
  name,
  price,
  seller_id,
  status
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 1.2. Vérifier toutes les transactions (avec et sans seller_id)
SELECT 
  '--- Toutes les transactions liées aux parcelles de Heritage ---' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.seller_id as "seller_id dans transaction",
  p.seller_id as "seller_id dans parcelle",
  CASE 
    WHEN t.seller_id IS NULL THEN '❌ MANQUANT'
    WHEN t.seller_id = p.seller_id THEN '✅ CORRECT'
    ELSE '⚠️ DIFFÉRENT'
  END as validation,
  p.title as parcelle,
  t.created_at
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

-- 1.3. Statistiques par type
SELECT 
  '--- Statistiques par type de transaction ---' as section;

SELECT 
  transaction_type,
  status,
  COUNT(*) as nombre,
  CASE 
    WHEN COUNT(CASE WHEN seller_id IS NULL THEN 1 END) > 0 
    THEN '❌ Certaines sans seller_id'
    ELSE '✅ Toutes avec seller_id'
  END as validation_seller_id
FROM transactions t
WHERE parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
GROUP BY transaction_type, status;

-- ÉTAPE 2: CORRECTIONS
-- ========================================

SELECT '========== ÉTAPE 2: CORRECTIONS ==========' as info;

-- 2.1. Corriger les seller_id manquants
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Mettre à jour les transactions sans seller_id
  UPDATE transactions t
  SET seller_id = p.seller_id,
      updated_at = NOW()
  FROM parcels p
  WHERE t.parcel_id = p.id
    AND (t.seller_id IS NULL OR t.seller_id != p.seller_id);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  IF updated_count > 0 THEN
    RAISE NOTICE '✅ % transaction(s) corrigée(s) - seller_id ajouté', updated_count;
  ELSE
    RAISE NOTICE '✅ Aucune correction nécessaire - tous les seller_id sont corrects';
  END IF;
END $$;

-- ÉTAPE 3: VÉRIFICATION POST-CORRECTION
-- ========================================

SELECT '========== ÉTAPE 3: VÉRIFICATION POST-CORRECTION ==========' as info;

-- 3.1. Afficher toutes les transactions après correction
SELECT 
  '--- Transactions après correction ---' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount,
  t.seller_id,
  t.buyer_id,
  p.title as parcelle,
  buyer.email as acheteur,
  t.created_at,
  t.description
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;

-- 3.2. Vérifier qu'aucune transaction n'a de seller_id manquant
SELECT 
  '--- Validation finale ---' as section;

SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ PARFAIT: Toutes les transactions ont un seller_id'
    ELSE '❌ PROBLÈME: ' || COUNT(*) || ' transaction(s) sans seller_id'
  END as resultat
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  AND t.seller_id IS NULL;

-- ÉTAPE 4: DIAGNOSTIC AFFICHAGE DASHBOARD
-- ========================================

SELECT '========== ÉTAPE 4: DIAGNOSTIC DASHBOARD VENDEUR ==========' as info;

-- 4.1. Simuler la requête du dashboard vendeur
SELECT 
  '--- Ce que le dashboard vendeur devrait voir ---' as section;

SELECT 
  t.id,
  t.transaction_type,
  t.status,
  t.amount as offered_price,
  t.payment_method,
  t.created_at,
  p.title as parcel_title,
  p.price as parcel_price,
  buyer.email as buyer_email,
  buyer.first_name || ' ' || buyer.last_name as buyer_name
FROM transactions t
INNER JOIN parcels p ON t.parcel_id = p.id
LEFT JOIN profiles buyer ON t.buyer_id = buyer.id
WHERE t.parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
AND t.transaction_type IN ('purchase', 'request', 'offer')
ORDER BY t.created_at DESC;

-- 4.2. Vérifier le nombre de demandes par statut
SELECT 
  '--- Nombre de demandes par statut ---' as section;

SELECT 
  status,
  COUNT(*) as nombre
FROM transactions t
WHERE t.parcel_id IN (
  SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
)
AND t.transaction_type IN ('purchase', 'request', 'offer')
GROUP BY status;

-- ÉTAPE 5: RÉSUMÉ FINAL
-- ========================================

SELECT '========== ÉTAPE 5: RÉSUMÉ FINAL ==========' as info;

DO $$
DECLARE
  total_parcelles INTEGER;
  total_transactions INTEGER;
  transactions_pending INTEGER;
  transactions_sans_seller INTEGER;
BEGIN
  -- Compter les parcelles
  SELECT COUNT(*) INTO total_parcelles
  FROM parcels
  WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';
  
  -- Compter les transactions
  SELECT COUNT(*) INTO total_transactions
  FROM transactions t
  WHERE t.parcel_id IN (
    SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  );
  
  -- Compter les transactions pending
  SELECT COUNT(*) INTO transactions_pending
  FROM transactions t
  WHERE t.parcel_id IN (
    SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  )
  AND t.status = 'pending';
  
  -- Compter les transactions sans seller_id
  SELECT COUNT(*) INTO transactions_sans_seller
  FROM transactions t
  WHERE t.parcel_id IN (
    SELECT id FROM parcels WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
  )
  AND t.seller_id IS NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 RÉSUMÉ POUR HERITAGE FALL';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🏠 Parcelles: %', total_parcelles;
  RAISE NOTICE '📋 Transactions totales: %', total_transactions;
  RAISE NOTICE '⏳ Demandes en attente: %', transactions_pending;
  RAISE NOTICE '';
  
  IF transactions_sans_seller > 0 THEN
    RAISE NOTICE '❌ Transactions sans seller_id: % (À CORRIGER!)', transactions_sans_seller;
  ELSE
    RAISE NOTICE '✅ Toutes les transactions ont un seller_id';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎯 PROCHAINES ÉTAPES';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '1. ✅ Rafraîchir votre navigateur (F5)';
  RAISE NOTICE '2. ✅ Aller sur: Dashboard Vendeur > Demandes d''achat';
  RAISE NOTICE '3. ✅ Vous devriez voir % demande(s)', total_transactions;
  RAISE NOTICE '';
  
  IF transactions_pending > 0 THEN
    RAISE NOTICE '💡 TIP: Cliquez sur l''onglet "En attente" pour voir les % demande(s) pending', transactions_pending;
  END IF;
  
  RAISE NOTICE '';
END $$;
