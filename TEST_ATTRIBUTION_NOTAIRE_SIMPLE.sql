-- ============================================================
-- ATTRIBUTION RAPIDE - Mode Manuel
-- ============================================================
-- Utilisez ce script si vous connaissez déjà les IDs
-- ============================================================

-- ==================================================
-- 🔍 ÉTAPE 1: TROUVER VOS IDs
-- ==================================================

-- 1.1 Trouver votre dossier
SELECT 
  id as case_id,
  case_number,
  status,
  purchase_price,
  created_at,
  notaire_id -- NULL = pas encore de notaire
FROM purchase_cases
WHERE status NOT IN ('completed', 'cancelled')
ORDER BY created_at DESC
LIMIT 10;

-- 1.2 Trouver un notaire disponible
SELECT 
  p.id as notaire_id,
  p.full_name as nom_notaire,
  np.office_name as office,
  np.office_region as region,
  np.current_cases_count as dossiers_actifs,
  np.rating as note
FROM profiles p
JOIN notaire_profiles np ON p.id = np.id
WHERE p.role = 'notaire'
  AND np.is_available = true
ORDER BY np.rating DESC;

-- ==================================================
-- ⚡ ÉTAPE 2: ATTRIBUTION RAPIDE (COPIER/COLLER)
-- ==================================================

-- REMPLACER LES VALEURS CI-DESSOUS:
DO $$
DECLARE
  -- 🎯 REMPLACER CES UUIDs PAR VOS VALEURS
  v_case_id UUID := '00000000-0000-0000-0000-000000000000'; -- ⬅️ ID du dossier
  v_notaire_id UUID := '00000000-0000-0000-0000-000000000000'; -- ⬅️ ID du notaire
  v_buyer_id UUID := '00000000-0000-0000-0000-000000000000'; -- ⬅️ ID acheteur
  v_seller_id UUID := '00000000-0000-0000-0000-000000000000'; -- ⬅️ ID vendeur
  
  -- Variables internes
  v_assignment_id UUID;
  v_case_number VARCHAR;
  v_notaire_name VARCHAR;
BEGIN
  -- Vérifications
  SELECT case_number INTO v_case_number FROM purchase_cases WHERE id = v_case_id;
  SELECT full_name INTO v_notaire_name FROM profiles WHERE id = v_notaire_id;
  
  IF v_case_number IS NULL THEN
    RAISE EXCEPTION 'Dossier introuvable. Vérifiez v_case_id';
  END IF;
  
  IF v_notaire_name IS NULL THEN
    RAISE EXCEPTION 'Notaire introuvable. Vérifiez v_notaire_id';
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🚀 ATTRIBUTION EN COURS...';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'Dossier: %', v_case_number;
  RAISE NOTICE 'Notaire: %', v_notaire_name;
  RAISE NOTICE '';
  
  -- 1. Créer assignment
  INSERT INTO notaire_case_assignments (
    case_id, notaire_id, proposed_by, proposed_by_role,
    status, buyer_approved, seller_approved,
    notaire_status, notaire_responded_at,
    assignment_score, quoted_fee, expires_at
  ) VALUES (
    v_case_id, v_notaire_id, v_buyer_id, 'buyer',
    'notaire_accepted', true, true,
    'accepted', NOW(),
    90, 100000, NOW() + INTERVAL '24 hours'
  )
  RETURNING id INTO v_assignment_id;
  
  -- 2. Mettre à jour le dossier
  UPDATE purchase_cases
  SET 
    notaire_id = v_notaire_id,
    notaire_assigned_at = NOW(),
    notaire_accepted_at = NOW(),
    notaire_fees = 100000,
    buyer_approved_notaire = true,
    seller_approved_notaire = true,
    status = 'notary_assigned'
  WHERE id = v_case_id;
  
  -- 3. Incrémenter compteur notaire
  UPDATE notaire_profiles
  SET current_cases_count = current_cases_count + 1
  WHERE id = v_notaire_id;
  
  RAISE NOTICE '✅ Attribution terminée!';
  RAISE NOTICE 'Assignment ID: %', v_assignment_id;
  RAISE NOTICE '';
END $$;

-- ==================================================
-- 📊 ÉTAPE 3: VÉRIFICATION
-- ==================================================

-- Afficher le résultat
SELECT 
  pc.case_number as dossier,
  pc.status,
  p.full_name as notaire,
  np.office_name as office,
  pc.notaire_fees as honoraires,
  pc.notaire_assigned_at as date_attribution
FROM purchase_cases pc
JOIN profiles p ON pc.notaire_id = p.id
JOIN notaire_profiles np ON p.id = np.id
WHERE pc.notaire_id IS NOT NULL
ORDER BY pc.notaire_assigned_at DESC
LIMIT 5;
