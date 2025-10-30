-- TEST FINAL DES POLICIES RLS
-- Exécuter après DIAGNOSTIC_COMPLET_NOTAIRE.sql

-- ========================================
-- TEST 1: Vérifier que les policies sont actives
-- ========================================

SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  LEFT(qual, 150) as policy_definition
FROM pg_policies
WHERE tablename IN ('purchase_cases', 'purchase_case_participants')
ORDER BY tablename, policyname;

-- ========================================
-- TEST 2: Simuler l'accès en tant que notaire
-- ========================================

-- 2.1 Test purchase_case_participants (devrait retourner 2 lignes)
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee"}';

SELECT 
  case_id,
  user_id,
  role,
  status
FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND role = 'notary';

RESET role;

-- 2.2 Test purchase_cases via participants (devrait retourner 2 lignes)
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee"}';

SELECT 
  id,
  case_number,
  status,
  buyer_id,
  seller_id
FROM purchase_cases
WHERE id IN (
  SELECT case_id 
  FROM purchase_case_participants 
  WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
    AND role = 'notary'
);

RESET role;

-- ========================================
-- TEST 3: Vérifier la requête exacte du frontend
-- ========================================

-- Cette requête simule exactement ce que fait NotaireSupabaseService.getAssignedCases()
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee"}';

-- Étape 1: Get participations
SELECT 
  case_id,
  status,
  role
FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND role = 'notary';

RESET role;

-- ========================================
-- TEST 4: Si les tests ci-dessus échouent, créer des policies plus permissives
-- ========================================

-- Supprimer et recréer avec une approche différente
DROP POLICY IF EXISTS "participants_select_own" ON purchase_case_participants;
DROP POLICY IF EXISTS "cases_select_by_participant" ON purchase_cases;

-- Policy ultra-simple pour purchase_case_participants
CREATE POLICY "allow_select_participants"
ON purchase_case_participants
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'notaire'
);

-- Policy ultra-simple pour purchase_cases
CREATE POLICY "allow_select_cases"
ON purchase_cases
FOR SELECT
TO authenticated
USING (
  buyer_id = auth.uid()
  OR
  seller_id = auth.uid()
  OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'notaire')
  OR
  id IN (
    SELECT case_id 
    FROM purchase_case_participants 
    WHERE user_id = auth.uid()
  )
);

-- Vérifier les nouvelles policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('purchase_cases', 'purchase_case_participants')
ORDER BY tablename, policyname;

-- ========================================
-- TEST 5: Dernier test après recreation
-- ========================================

-- Test en tant que notaire
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee"}';

SELECT 
  pc.id,
  pc.case_number,
  pc.status,
  pcp.role,
  pcp.status as participant_status
FROM purchase_cases pc
INNER JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

RESET role;

-- ========================================
-- SOLUTION ALTERNATIVE: Désactiver RLS temporairement
-- ========================================

-- Si rien ne fonctionne, désactiver RLS pour déboguer
-- ALTER TABLE purchase_case_participants DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchase_cases DISABLE ROW LEVEL SECURITY;

-- Puis tester dans l'application
-- Une fois que ça marche, réactiver et ajuster les policies

-- Pour réactiver:
-- ALTER TABLE purchase_case_participants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;
