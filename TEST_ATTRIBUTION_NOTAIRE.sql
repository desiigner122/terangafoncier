-- ============================================================
-- SCRIPT DE TEST - Attribution Notaire à un Dossier Existant
-- ============================================================
-- Ce script attribue automatiquement un notaire disponible
-- à un dossier d'achat en cours pour faire des tests
-- ============================================================

-- ==================================================
-- ÉTAPE 1: VÉRIFIER LES DONNÉES EXISTANTES
-- ==================================================

-- 1.1 Lister les dossiers en cours (sans notaire)
SELECT 
  id,
  case_number,
  buyer_id,
  seller_id,
  parcelle_id,
  purchase_price,
  status,
  created_at
FROM purchase_cases
WHERE notaire_id IS NULL
  AND status NOT IN ('completed', 'cancelled', 'rejected')
ORDER BY created_at DESC
LIMIT 5;

-- 1.2 Lister les notaires disponibles
SELECT 
  p.id,
  p.full_name,
  p.email,
  np.office_name,
  np.office_region,
  np.is_available,
  np.current_cases_count,
  np.max_concurrent_cases,
  np.rating
FROM profiles p
JOIN notaire_profiles np ON p.id = np.id
WHERE p.role = 'notaire'
  AND np.is_available = true
  AND np.is_accepting_cases = true
ORDER BY np.rating DESC, np.current_cases_count ASC
LIMIT 5;

-- ==================================================
-- ÉTAPE 2: CRÉER UN NOTAIRE DE TEST (SI AUCUN N'EXISTE)
-- ==================================================

-- 2.1 Créer le profil utilisateur notaire
DO $$
DECLARE
  v_notaire_id UUID;
  v_notaire_email VARCHAR := 'notaire.test@terangafoncier.com';
  v_existing_notaire UUID;
BEGIN
  -- Vérifier si le notaire existe déjà
  SELECT id INTO v_existing_notaire 
  FROM profiles 
  WHERE email = v_notaire_email;
  
  IF v_existing_notaire IS NULL THEN
    -- Créer le notaire
    INSERT INTO profiles (
      id,
      email,
      full_name,
      role,
      phone,
      status,
      created_at
    ) VALUES (
      uuid_generate_v4(),
      v_notaire_email,
      'Maître Amadou Diop',
      'notaire',
      '+221 77 123 45 67',
      'active',
      NOW()
    )
    RETURNING id INTO v_notaire_id;
    
    -- Créer le profil notaire
    INSERT INTO notaire_profiles (
      id,
      office_name,
      office_address,
      office_region,
      office_commune,
      office_latitude,
      office_longitude,
      office_phone,
      office_email,
      specializations,
      languages,
      is_available,
      is_accepting_cases,
      max_concurrent_cases,
      current_cases_count,
      base_fee_min,
      base_fee_max,
      percentage_fee,
      fee_structure,
      fee_description,
      rating,
      reviews_count,
      total_cases_completed,
      experience_years,
      bio,
      is_verified,
      verified_at
    ) VALUES (
      v_notaire_id,
      'Étude Notariale Maître Diop',
      'Avenue Léopold Sédar Senghor, Dakar',
      'Dakar',
      'Plateau',
      14.6928, -- Latitude Dakar
      -17.4467, -- Longitude Dakar
      '+221 33 821 45 67',
      v_notaire_email,
      ARRAY['terrain', 'immobilier', 'succession', 'entreprise'],
      ARRAY['français', 'wolof'],
      true,
      true,
      15,
      0,
      50000,
      200000,
      2.50,
      'percentage',
      'Honoraires: 2,5% du prix de vente (min 50 000 FCFA, max 200 000 FCFA)',
      4.8,
      12,
      45,
      15,
      'Notaire inscrit au Barreau de Dakar depuis 2010. Spécialisé dans les transactions foncières et immobilières. Expert en droit OHADA.',
      true,
      NOW()
    );
    
    RAISE NOTICE '✅ Notaire de test créé: % (ID: %)', 'Maître Amadou Diop', v_notaire_id;
  ELSE
    RAISE NOTICE 'ℹ️ Notaire de test existe déjà (ID: %)', v_existing_notaire;
    v_notaire_id := v_existing_notaire;
  END IF;
  
  -- Stocker l'ID pour utilisation ultérieure
  CREATE TEMP TABLE IF NOT EXISTS temp_notaire_id (id UUID);
  DELETE FROM temp_notaire_id;
  INSERT INTO temp_notaire_id VALUES (v_notaire_id);
END $$;

-- ==================================================
-- ÉTAPE 3: ATTRIBUTION AUTOMATIQUE
-- ==================================================

-- 3.1 Sélectionner le premier dossier sans notaire
DO $$
DECLARE
  v_case_id UUID;
  v_case_number VARCHAR;
  v_notaire_id UUID;
  v_assignment_id UUID;
  v_buyer_id UUID;
  v_seller_id UUID;
BEGIN
  -- Récupérer l'ID du notaire de test
  SELECT id INTO v_notaire_id FROM temp_notaire_id LIMIT 1;
  
  -- Récupérer le premier dossier en cours sans notaire
  SELECT id, case_number, buyer_id, seller_id
  INTO v_case_id, v_case_number, v_buyer_id, v_seller_id
  FROM purchase_cases
  WHERE notaire_id IS NULL
    AND status NOT IN ('completed', 'cancelled', 'rejected')
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_case_id IS NULL THEN
    RAISE NOTICE '❌ Aucun dossier en cours trouvé sans notaire assigné';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '📋 Dossier trouvé: % (ID: %)', v_case_number, v_case_id;
    RAISE NOTICE '👤 Acheteur ID: %', v_buyer_id;
    RAISE NOTICE '👤 Vendeur ID: %', v_seller_id;
    RAISE NOTICE '';
    
    -- ÉTAPE 1: Créer l'assignment (proposition)
    INSERT INTO notaire_case_assignments (
      case_id,
      notaire_id,
      proposed_by,
      proposed_by_role,
      status,
      buyer_approved,
      seller_approved,
      assignment_score,
      distance_km,
      assignment_reason,
      quoted_fee,
      expires_at
    ) VALUES (
      v_case_id,
      v_notaire_id,
      v_buyer_id, -- Proposé par l'acheteur (pour le test)
      'buyer',
      'pending',
      false,
      false,
      95, -- Score de test
      5.2, -- Distance de test (5.2 km)
      'Attribution automatique pour tests - Notaire le mieux noté',
      NULL, -- Le notaire donnera son devis
      NOW() + INTERVAL '24 hours'
    )
    RETURNING id INTO v_assignment_id;
    
    RAISE NOTICE '✅ Assignment créé (ID: %)', v_assignment_id;
    RAISE NOTICE '';
    
    -- ÉTAPE 2: Acheteur approuve automatiquement
    UPDATE notaire_case_assignments
    SET 
      buyer_approved = true,
      buyer_approved_at = NOW(),
      status = 'buyer_approved'
    WHERE id = v_assignment_id;
    
    RAISE NOTICE '✅ Acheteur a approuvé le notaire';
    
    -- ÉTAPE 3: Vendeur approuve automatiquement
    UPDATE notaire_case_assignments
    SET 
      seller_approved = true,
      seller_approved_at = NOW(),
      status = 'both_approved' -- Le trigger va mettre à jour automatiquement
    WHERE id = v_assignment_id;
    
    RAISE NOTICE '✅ Vendeur a approuvé le notaire';
    RAISE NOTICE '';
    RAISE NOTICE '⏳ Status: both_approved - En attente réponse notaire (24h)';
    RAISE NOTICE '';
    
    -- ÉTAPE 4: Notaire accepte automatiquement (pour test)
    UPDATE notaire_case_assignments
    SET 
      notaire_status = 'accepted',
      status = 'notaire_accepted',
      notaire_responded_at = NOW(),
      quoted_fee = 125000, -- Devis: 125 000 FCFA (2.5% du prix)
      notaire_notes = 'Devis accepté. Prise en charge immédiate du dossier.'
    WHERE id = v_assignment_id;
    
    RAISE NOTICE '✅ Notaire a ACCEPTÉ le dossier';
    RAISE NOTICE '💰 Devis: 125 000 FCFA';
    RAISE NOTICE '';
    
    -- ÉTAPE 5: Assigner le notaire au dossier
    UPDATE purchase_cases
    SET 
      notaire_id = v_notaire_id,
      notaire_assigned_at = NOW(),
      notaire_accepted_at = NOW(),
      notaire_fees = 125000,
      notaire_selection_method = 'auto',
      buyer_approved_notaire = true,
      seller_approved_notaire = true,
      buyer_approved_at = NOW(),
      seller_approved_at = NOW(),
      status = 'notary_assigned',
      assignment_metadata = jsonb_build_object(
        'assignment_id', v_assignment_id,
        'score', 95,
        'distance_km', 5.2,
        'method', 'auto_test',
        'assigned_at', NOW()
      )
    WHERE id = v_case_id;
    
    RAISE NOTICE '✅ Notaire assigné au dossier';
    RAISE NOTICE '📊 Status dossier: notary_assigned';
    RAISE NOTICE '';
    
    -- ÉTAPE 6: Incrémenter le compteur du notaire
    UPDATE notaire_profiles
    SET 
      current_cases_count = current_cases_count + 1,
      updated_at = NOW()
    WHERE id = v_notaire_id;
    
    RAISE NOTICE '✅ Compteur notaire incrémenté';
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '🎉 ATTRIBUTION COMPLÉTÉE AVEC SUCCÈS !';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Résumé:';
    RAISE NOTICE '  • Dossier: %', v_case_number;
    RAISE NOTICE '  • Notaire: Maître Amadou Diop';
    RAISE NOTICE '  • Office: Étude Notariale Maître Diop';
    RAISE NOTICE '  • Status: notary_assigned';
    RAISE NOTICE '  • Honoraires: 125 000 FCFA';
    RAISE NOTICE '';
    
    -- Stocker les IDs pour vérification
    CREATE TEMP TABLE IF NOT EXISTS temp_test_data (
      case_id UUID,
      case_number VARCHAR,
      notaire_id UUID,
      assignment_id UUID
    );
    DELETE FROM temp_test_data;
    INSERT INTO temp_test_data VALUES (v_case_id, v_case_number, v_notaire_id, v_assignment_id);
  END IF;
END $$;

-- ==================================================
-- ÉTAPE 4: VÉRIFICATION
-- ==================================================

-- 4.1 Vérifier le dossier
SELECT 
  'DOSSIER' as type,
  id,
  case_number,
  status,
  notaire_id,
  notaire_fees,
  buyer_approved_notaire,
  seller_approved_notaire,
  notaire_assigned_at
FROM purchase_cases
WHERE id = (SELECT case_id FROM temp_test_data LIMIT 1);

-- 4.2 Vérifier l'assignment
SELECT 
  'ASSIGNMENT' as type,
  id,
  status,
  notaire_status,
  buyer_approved,
  seller_approved,
  notaire_responded_at,
  quoted_fee,
  assignment_score,
  distance_km
FROM notaire_case_assignments
WHERE id = (SELECT assignment_id FROM temp_test_data LIMIT 1);

-- 4.3 Vérifier le profil notaire
SELECT 
  'NOTAIRE' as type,
  np.office_name,
  np.current_cases_count,
  np.max_concurrent_cases,
  np.rating,
  np.reviews_count,
  p.full_name,
  p.email
FROM notaire_profiles np
JOIN profiles p ON np.id = p.id
WHERE np.id = (SELECT notaire_id FROM temp_test_data LIMIT 1);

-- ==================================================
-- ÉTAPE 5: INFORMATIONS POUR L'APPLICATION
-- ==================================================

DO $$
DECLARE
  v_case_id UUID;
  v_notaire_id UUID;
BEGIN
  SELECT case_id, notaire_id INTO v_case_id, v_notaire_id 
  FROM temp_test_data LIMIT 1;
  
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📝 INFORMATIONS POUR L''APPLICATION';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 URLs à tester:';
  RAISE NOTICE '';
  RAISE NOTICE '1️⃣ Dashboard Notaire:';
  RAISE NOTICE '   /notaire/cases';
  RAISE NOTICE '   → Le dossier devrait apparaître dans la liste';
  RAISE NOTICE '';
  RAISE NOTICE '2️⃣ Dashboard Acheteur:';
  RAISE NOTICE '   /buyer/purchase-requests';
  RAISE NOTICE '   → Status: "Notaire assigné"';
  RAISE NOTICE '';
  RAISE NOTICE '3️⃣ Dashboard Vendeur:';
  RAISE NOTICE '   /seller/sales';
  RAISE NOTICE '   → Status: "Notaire assigné"';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Tests à effectuer:';
  RAISE NOTICE '';
  RAISE NOTICE '✓ Vérifier que le notaire voit le dossier';
  RAISE NOTICE '✓ Vérifier les informations acheteur/vendeur';
  RAISE NOTICE '✓ Vérifier les honoraires affichés (125 000 FCFA)';
  RAISE NOTICE '✓ Tester la communication tripartite';
  RAISE NOTICE '✓ Tester l''upload de documents';
  RAISE NOTICE '';
  RAISE NOTICE '📊 IDs à utiliser dans le code:';
  RAISE NOTICE '   case_id: %', v_case_id;
  RAISE NOTICE '   notaire_id: %', v_notaire_id;
  RAISE NOTICE '';
END $$;

-- Nettoyer les tables temporaires
DROP TABLE IF EXISTS temp_notaire_id;
DROP TABLE IF EXISTS temp_test_data;

-- ==================================================
-- FIN DU SCRIPT
-- ==================================================

-- Résumé final
SELECT 
  '✅ ATTRIBUTION TERMINÉE' as status,
  COUNT(*) as dossiers_avec_notaire
FROM purchase_cases
WHERE notaire_id IS NOT NULL;

SELECT 
  '📊 STATISTIQUES NOTAIRES' as info,
  COUNT(*) as total_notaires,
  COUNT(*) FILTER (WHERE is_available = true) as disponibles,
  SUM(current_cases_count) as dossiers_en_cours
FROM notaire_profiles;
