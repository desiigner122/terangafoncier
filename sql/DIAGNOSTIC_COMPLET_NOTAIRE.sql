-- DIAGNOSTIC COMPLET - Notaire Dashboard
-- Exécuter chaque section et partager TOUS les résultats

-- ========================================
-- SECTION 1: Vérifier les données de base
-- ========================================

-- 1.1 Le profil notaire existe-t-il ?
SELECT 
  id, 
  email, 
  role, 
  full_name,
  created_at
FROM profiles 
WHERE id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';

-- 1.2 Combien de purchase_cases existent ?
SELECT 
  COUNT(*) as total_cases,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_cases,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_cases
FROM purchase_cases;

-- 1.3 Les 2 case_ids spécifiques existent-ils ?
SELECT 
  id,
  case_number,
  status,
  buyer_id,
  seller_id,
  created_at
FROM purchase_cases
WHERE id IN (
  'ded322f2-ca48-4acd-9af2-35297732ca0f',
  '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf'
);

-- 1.4 Les participations du notaire existent-elles ?
SELECT 
  case_id,
  user_id,
  role,
  status,
  joined_at
FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND role = 'notary';

-- ========================================
-- SECTION 2: Vérifier les policies RLS
-- ========================================

-- 2.1 RLS est-il activé ?
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('purchase_cases', 'purchase_case_participants');

-- 2.2 Policies sur purchase_case_participants
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'purchase_case_participants'
ORDER BY policyname;

-- 2.3 Policies sur purchase_cases
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'purchase_cases'
ORDER BY policyname;

-- ========================================
-- SECTION 3: Tests d'accès SANS RLS (en tant qu'admin)
-- ========================================

-- 3.1 Désactiver temporairement RLS pour tester
ALTER TABLE purchase_case_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_cases DISABLE ROW LEVEL SECURITY;

-- 3.2 Test: Peut-on voir les participations ?
SELECT 
  pcp.case_id,
  pcp.user_id,
  pcp.role,
  pcp.status,
  pc.case_number,
  pc.status as case_status
FROM purchase_case_participants pcp
LEFT JOIN purchase_cases pc ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

-- 3.3 Test: Les foreign keys sont-ils valides ?
SELECT 
  pcp.case_id,
  pc.id as case_exists,
  CASE WHEN pc.id IS NULL THEN '❌ Case manquant' ELSE '✅ Case existe' END as validation
FROM purchase_case_participants pcp
LEFT JOIN purchase_cases pc ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

-- 3.4 Réactiver RLS
ALTER TABLE purchase_case_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;

-- ========================================
-- SECTION 4: Nettoyer et recréer les policies
-- ========================================

-- 4.1 Supprimer TOUTES les policies existantes
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on purchase_case_participants
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'purchase_case_participants'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON purchase_case_participants', pol.policyname);
    END LOOP;
    
    -- Drop all policies on purchase_cases
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'purchase_cases'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON purchase_cases', pol.policyname);
    END LOOP;
END $$;

-- 4.2 Créer policy simple pour purchase_case_participants
CREATE POLICY "participants_select_own"
ON purchase_case_participants
FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4.3 Créer policy simple pour purchase_cases (SANS sous-requête récursive)
CREATE POLICY "cases_select_by_participant"
ON purchase_cases
FOR SELECT
USING (
  buyer_id = auth.uid()
  OR
  seller_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id
      AND pcp.user_id = auth.uid()
  )
);

-- ========================================
-- SECTION 5: Vérifications finales
-- ========================================

-- 5.1 Lister les nouvelles policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('purchase_cases', 'purchase_case_participants')
ORDER BY tablename, policyname;

-- 5.2 Test final avec auth.uid() simulé
-- NOTE: Cette requête doit être exécutée en tant que notaire via l'application
-- Pour tester ici, remplacer auth.uid() par l'ID réel
SELECT 
  pc.id,
  pc.case_number,
  pc.status,
  pc.buyer_id,
  pc.seller_id,
  pcp.role,
  pcp.status as participant_status
FROM purchase_cases pc
INNER JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

-- 5.3 Vérifier que les buyer_id et seller_id existent dans profiles
SELECT 
  pc.id as case_id,
  pc.case_number,
  pc.buyer_id,
  buyer.full_name as buyer_name,
  pc.seller_id,
  seller.full_name as seller_name,
  CASE 
    WHEN buyer.id IS NULL THEN '❌ Buyer manquant'
    WHEN seller.id IS NULL THEN '❌ Seller manquant'
    ELSE '✅ OK'
  END as validation
FROM purchase_cases pc
LEFT JOIN profiles buyer ON buyer.id = pc.buyer_id
LEFT JOIN profiles seller ON seller.id = pc.seller_id
WHERE pc.id IN (
  SELECT case_id 
  FROM purchase_case_participants 
  WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
);
