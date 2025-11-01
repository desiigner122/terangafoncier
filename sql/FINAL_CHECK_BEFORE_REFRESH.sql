-- VÉRIFICATION FINALE ET REFRESH BROWSER
-- Après avoir exécuté ce script, faire un hard refresh (Ctrl+Shift+R)

-- ========================================
-- 1. CONFIRMER L'ÉTAT FINAL DES POLICIES
-- ========================================

SELECT 
  '🔒 RLS Status' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('purchase_cases', 'purchase_case_participants');

-- ========================================
-- 2. LISTER LES POLICIES ACTIVES
-- ========================================

SELECT 
  '📋 Active Policies' as check_type,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('purchase_cases', 'purchase_case_participants')
ORDER BY tablename, policyname;

-- ========================================
-- 3. VÉRIFIER L'ACCÈS AVEC LA MÊME REQUÊTE QUE LE FRONTEND
-- ========================================

-- Simulation exacte de NotaireSupabaseService.getAssignedCases()

-- Étape 1: purchase_case_participants query
SELECT 
  '🔍 Step 1: Participants' as check_type,
  case_id,
  user_id,
  role,
  status
FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND role = 'notary';

-- Étape 2: purchase_cases query avec les case_ids trouvés
SELECT 
  '🔍 Step 2: Cases Details' as check_type,
  pc.id,
  pc.case_number,
  pc.status,
  pc.buyer_id,
  pc.seller_id,
  pc.parcelle_id,
  pc.created_at,
  pc.updated_at
FROM purchase_cases pc
WHERE pc.id IN (
  SELECT case_id 
  FROM purchase_case_participants 
  WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' 
    AND role = 'notary'
);

-- Étape 3: Vérifier les relations (profiles pour buyer/seller)
SELECT 
  '🔍 Step 3: Buyer/Seller Profiles' as check_type,
  pc.case_number,
  buyer.id as buyer_id,
  buyer.full_name as buyer_name,
  buyer.email as buyer_email,
  seller.id as seller_id,
  seller.full_name as seller_name,
  seller.email as seller_email
FROM purchase_cases pc
LEFT JOIN profiles buyer ON buyer.id = pc.buyer_id
LEFT JOIN profiles seller ON seller.id = pc.seller_id
WHERE pc.id IN (
  SELECT case_id 
  FROM purchase_case_participants 
  WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' 
    AND role = 'notary'
);

-- Étape 4: Vérifier les parcelles
SELECT 
  '🔍 Step 4: Parcels' as check_type,
  pc.case_number,
  p.id as parcel_id,
  p.title as parcel_title,
  p.location as parcel_location,
  p.surface as parcel_surface
FROM purchase_cases pc
LEFT JOIN parcels p ON p.id = pc.parcelle_id
WHERE pc.id IN (
  SELECT case_id 
  FROM purchase_case_participants 
  WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' 
    AND role = 'notary'
);

-- ========================================
-- 4. COMMANDES POST-VÉRIFICATION
-- ========================================

-- Tout devrait maintenant fonctionner !
-- 
-- ✅ PROCHAINES ÉTAPES :
-- 1. Exécuter ce script complet
-- 2. Vérifier que toutes les requêtes retournent 2 lignes
-- 3. Ouvrir l'application : http://localhost:5173/notaire/cases
-- 4. Hard refresh : Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
-- 5. Ouvrir la console (F12) et chercher les logs :
--    - 🔍 getAssignedCases for notaireId: 6b222cf1...
--    - 📋 Found participations: 2 [...]
--    - ✅ Loaded cases: 2
--    - ✅ Transformed cases: 2
-- 
-- Si les logs montrent 2 cases mais rien ne s'affiche :
-- - Vérifier filteredCases dans React DevTools
-- - Vérifier si statusFilter ou searchTerm ne filtrent pas les résultats
-- 
-- Si les logs montrent "📋 Found participations: 0" :
-- - L'ID utilisateur en session n'est pas le bon
-- - Exécuter : SELECT auth.uid(); dans l'app pour voir l'ID réel

SELECT 
  '✅ Vérification terminée' as status,
  'Maintenant, refresh l''application !' as next_step;
