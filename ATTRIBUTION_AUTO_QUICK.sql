-- ============================================================
-- ⚡ ATTRIBUTION AUTO - DÉTECTION AUTOMATIQUE DES IDs
-- ============================================================
-- Ce script détecte automatiquement:
-- - Le premier dossier sans notaire
-- - Le meilleur notaire disponible
-- - Les IDs acheteur/vendeur
-- Et fait l'attribution complète
-- ============================================================

DO $$
DECLARE
  v_case_id UUID;
  v_case_number VARCHAR;
  v_buyer_id UUID;
  v_seller_id UUID;
  v_notaire_id UUID;
  v_notaire_name VARCHAR;
  v_assignment_id UUID;
  v_purchase_price DECIMAL;
  v_fee DECIMAL;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '⚡ ATTRIBUTION AUTOMATIQUE DE NOTAIRE';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  
  -- ====================================================
  -- 1. TROUVER UN DOSSIER SANS NOTAIRE
  -- ====================================================
  RAISE NOTICE '🔍 Recherche d''un dossier sans notaire...';
  
  SELECT 
    id, case_number, buyer_id, seller_id, purchase_price
  INTO 
    v_case_id, v_case_number, v_buyer_id, v_seller_id, v_purchase_price
  FROM purchase_cases
  WHERE notaire_id IS NULL
    AND status NOT IN ('completed', 'cancelled', 'rejected')
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_case_id IS NULL THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ Aucun dossier trouvé sans notaire assigné';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Options:';
    RAISE NOTICE '   1. Créer un nouveau dossier d''achat';
    RAISE NOTICE '   2. Retirer le notaire d''un dossier existant:';
    RAISE NOTICE '      UPDATE purchase_cases SET notaire_id = NULL WHERE id = ''...''';
    RAISE NOTICE '';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Dossier trouvé: %', v_case_number;
  RAISE NOTICE '   Prix: % FCFA', v_purchase_price;
  RAISE NOTICE '';
  
  -- ====================================================
  -- 2. TROUVER LE MEILLEUR NOTAIRE DISPONIBLE
  -- ====================================================
  RAISE NOTICE '🔍 Recherche du meilleur notaire...';
  
  SELECT 
    p.id, p.full_name
  INTO 
    v_notaire_id, v_notaire_name
  FROM profiles p
  JOIN notaire_profiles np ON p.id = np.id
  WHERE p.role = 'notaire'
    AND np.is_available = true
    AND np.is_accepting_cases = true
    AND np.current_cases_count < np.max_concurrent_cases
  ORDER BY 
    np.rating DESC, 
    np.current_cases_count ASC,
    np.reviews_count DESC
  LIMIT 1;
  
  IF v_notaire_id IS NULL THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ Aucun notaire disponible';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Créer un notaire de test:';
    RAISE NOTICE '   Exécutez: TEST_ATTRIBUTION_NOTAIRE.sql (partie création notaire)';
    RAISE NOTICE '';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Notaire trouvé: %', v_notaire_name;
  RAISE NOTICE '';
  
  -- ====================================================
  -- 3. CALCULER LES HONORAIRES (2.5% du prix)
  -- ====================================================
  v_fee := GREATEST(v_purchase_price * 0.025, 50000); -- Min 50k FCFA
  v_fee := LEAST(v_fee, 500000); -- Max 500k FCFA
  
  RAISE NOTICE '💰 Honoraires calculés: % FCFA', ROUND(v_fee);
  RAISE NOTICE '';
  
  -- ====================================================
  -- 4. CRÉER L''ASSIGNMENT
  -- ====================================================
  RAISE NOTICE '📝 Création de l''assignment...';
  
  INSERT INTO notaire_case_assignments (
    case_id,
    notaire_id,
    proposed_by,
    proposed_by_role,
    status,
    buyer_approved,
    seller_approved,
    buyer_approved_at,
    seller_approved_at,
    notaire_status,
    notaire_responded_at,
    assignment_score,
    distance_km,
    assignment_reason,
    quoted_fee,
    notaire_notes,
    expires_at
  ) VALUES (
    v_case_id,
    v_notaire_id,
    v_buyer_id,
    'system',
    'notaire_accepted',
    true,
    true,
    NOW(),
    NOW(),
    'accepted',
    NOW(),
    95,
    5.0,
    'Attribution automatique - Notaire le mieux noté disponible',
    v_fee,
    'Dossier accepté automatiquement pour tests. Prise en charge immédiate.',
    NOW() + INTERVAL '24 hours'
  )
  RETURNING id INTO v_assignment_id;
  
  RAISE NOTICE '✅ Assignment créé (ID: %)', v_assignment_id;
  RAISE NOTICE '';
  
  -- ====================================================
  -- 5. ASSIGNER LE NOTAIRE AU DOSSIER
  -- ====================================================
  RAISE NOTICE '🔗 Attribution du notaire au dossier...';
  
  UPDATE purchase_cases
  SET 
    notaire_id = v_notaire_id,
    notaire_assigned_at = NOW(),
    notaire_accepted_at = NOW(),
    notaire_fees = v_fee,
    notaire_selection_method = 'auto',
    buyer_approved_notaire = true,
    seller_approved_notaire = true,
    buyer_approved_at = NOW(),
    seller_approved_at = NOW(),
    status = 'notary_assigned',
    assignment_metadata = jsonb_build_object(
      'assignment_id', v_assignment_id,
      'score', 95,
      'distance_km', 5.0,
      'method', 'auto_test',
      'assigned_at', NOW(),
      'auto_assigned', true
    )
  WHERE id = v_case_id;
  
  RAISE NOTICE '✅ Notaire assigné au dossier';
  RAISE NOTICE '';
  
  -- ====================================================
  -- 6. INCRÉMENTER LE COMPTEUR DU NOTAIRE
  -- ====================================================
  RAISE NOTICE '📊 Mise à jour du compteur notaire...';
  
  UPDATE notaire_profiles
  SET 
    current_cases_count = current_cases_count + 1,
    updated_at = NOW()
  WHERE id = v_notaire_id;
  
  RAISE NOTICE '✅ Compteur incrémenté';
  RAISE NOTICE '';
  
  -- ====================================================
  -- 7. RÉSUMÉ FINAL
  -- ====================================================
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🎉 ATTRIBUTION COMPLÉTÉE AVEC SUCCÈS !';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📋 RÉSUMÉ:';
  RAISE NOTICE '';
  RAISE NOTICE '  Dossier:';
  RAISE NOTICE '    • Numéro: %', v_case_number;
  RAISE NOTICE '    • ID: %', v_case_id;
  RAISE NOTICE '    • Status: notary_assigned';
  RAISE NOTICE '    • Prix: % FCFA', v_purchase_price;
  RAISE NOTICE '';
  RAISE NOTICE '  Notaire:';
  RAISE NOTICE '    • Nom: %', v_notaire_name;
  RAISE NOTICE '    • ID: %', v_notaire_id;
  RAISE NOTICE '    • Honoraires: % FCFA', ROUND(v_fee);
  RAISE NOTICE '';
  RAISE NOTICE '  Parties:';
  RAISE NOTICE '    • Acheteur ID: %', v_buyer_id;
  RAISE NOTICE '    • Vendeur ID: %', v_seller_id;
  RAISE NOTICE '    • Approbations: ✅ Les deux parties';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 TESTS À EFFECTUER:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Dashboard Notaire (/notaire/cases)';
  RAISE NOTICE '   → Le dossier % apparaît', v_case_number;
  RAISE NOTICE '   → Honoraires: % FCFA', ROUND(v_fee);
  RAISE NOTICE '';
  RAISE NOTICE '2. Dashboard Acheteur (/buyer/purchase-requests)';
  RAISE NOTICE '   → Status: "Notaire assigné"';
  RAISE NOTICE '   → Notaire: %', v_notaire_name;
  RAISE NOTICE '';
  RAISE NOTICE '3. Dashboard Vendeur (/seller/sales)';
  RAISE NOTICE '   → Status: "Notaire assigné"';
  RAISE NOTICE '   → Notaire: %', v_notaire_name;
  RAISE NOTICE '';
  RAISE NOTICE '4. Communication tripartite';
  RAISE NOTICE '   → Test envoi message entre parties';
  RAISE NOTICE '';
  RAISE NOTICE '5. Upload documents';
  RAISE NOTICE '   → Test upload par acheteur/vendeur/notaire';
  RAISE NOTICE '';
  
END $$;

-- ====================================================
-- VÉRIFICATION VISUELLE
-- ====================================================

SELECT 
  '✅ DOSSIER AVEC NOTAIRE' as resultat,
  pc.case_number,
  pc.status,
  p.full_name as notaire,
  np.office_name as office_notarial,
  pc.notaire_fees as honoraires_fcfa,
  pc.buyer_approved_notaire as acheteur_ok,
  pc.seller_approved_notaire as vendeur_ok,
  pc.notaire_assigned_at as date_attribution
FROM purchase_cases pc
JOIN profiles p ON pc.notaire_id = p.id
JOIN notaire_profiles np ON p.id = np.id
WHERE pc.notaire_id IS NOT NULL
ORDER BY pc.notaire_assigned_at DESC
LIMIT 1;

-- Stats notaires
SELECT 
  '📊 STATS NOTAIRES' as info,
  COUNT(*) as total_notaires,
  SUM(current_cases_count) as dossiers_en_cours,
  ROUND(AVG(rating), 2) as note_moyenne
FROM notaire_profiles;
