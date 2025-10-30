-- Script complet pour fixer toutes les RLS policies du notaire
-- À exécuter dans Supabase SQL Editor

-- ============================================
-- 1. PURCHASE_CASE_MESSAGES - Policies
-- ============================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "allow_insert_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_insert_own_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_select_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_update_messages" ON purchase_case_messages;

-- SELECT: Voir les messages
CREATE POLICY "participants_can_select_messages"
ON purchase_case_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- INSERT: Envoyer des messages
CREATE POLICY "participants_can_insert_messages"
ON purchase_case_messages FOR INSERT TO authenticated
WITH CHECK (
  sent_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- UPDATE: Marquer comme lu
CREATE POLICY "participants_can_update_messages"
ON purchase_case_messages FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. PURCHASE_CASE_DOCUMENTS - Policies
-- ============================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "allow_select_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_insert_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_update_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_delete_documents" ON purchase_case_documents;

-- SELECT: Voir les documents
CREATE POLICY "participants_can_select_documents"
ON purchase_case_documents FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- INSERT: Ajouter des documents
CREATE POLICY "participants_can_insert_documents"
ON purchase_case_documents FOR INSERT TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- UPDATE: Modifier/valider documents
CREATE POLICY "participants_can_update_documents"
ON purchase_case_documents FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- DELETE: Supprimer documents
CREATE POLICY "participants_can_delete_documents"
ON purchase_case_documents FOR DELETE TO authenticated
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
      AND pcp.role = 'notary'
  )
);

ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. PURCHASE_CASES - Update Policy
-- ============================================

-- Permettre au notaire de modifier le statut
DROP POLICY IF EXISTS "participants_can_update_cases" ON purchase_cases;

CREATE POLICY "participants_can_update_cases"
ON purchase_cases FOR UPDATE TO authenticated
USING (
  buyer_id = auth.uid()
  OR seller_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id
      AND pcp.user_id = auth.uid()
  )
)
WITH CHECK (
  buyer_id = auth.uid()
  OR seller_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id
      AND pcp.user_id = auth.uid()
  )
);

-- ============================================
-- 4. VÉRIFICATION - Afficher toutes les policies
-- ============================================

SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents', 'purchase_cases')
ORDER BY tablename, cmd;

-- ============================================
-- 5. TEST - Vérifier qu'un notaire peut agir
-- ============================================

-- Test 1: Vérifier les participants
SELECT 
  pc.case_number,
  pc.status,
  pcp.role,
  p.email
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pcp.case_id = pc.id
JOIN profiles p ON p.id = pcp.user_id
WHERE p.email = 'etude.diouf@teranga-foncier.sn';

-- Test 2: Compter les messages par case
SELECT 
  pc.case_number,
  COUNT(pcm.id) as message_count
FROM purchase_cases pc
LEFT JOIN purchase_case_messages pcm ON pcm.case_id = pc.id
GROUP BY pc.id, pc.case_number;

-- Test 3: Compter les documents par case
SELECT 
  pc.case_number,
  COUNT(pcd.id) as document_count
FROM purchase_cases pc
LEFT JOIN purchase_case_documents pcd ON pcd.case_id = pc.id
GROUP BY pc.id, pc.case_number;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ 3 policies pour purchase_case_messages (SELECT, INSERT, UPDATE)
-- ✅ 4 policies pour purchase_case_documents (SELECT, INSERT, UPDATE, DELETE)
-- ✅ 1 policy UPDATE pour purchase_cases
-- ✅ Notaire peut envoyer des messages
-- ✅ Notaire peut ajouter/valider/supprimer des documents
-- ✅ Notaire peut changer le statut des dossiers
