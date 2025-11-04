-- FIX SIMPLE: Ajouter notary_id aux policies RLS
-- Au lieu de forcer le notaire à être dans purchase_case_participants,
-- on vérifie directement la colonne notary_id de purchase_cases

-- ============================================
-- 1. FIX: purchase_cases UPDATE policy (inclure notary_id)
-- ============================================

DROP POLICY IF EXISTS "participants_can_update_cases" ON purchase_cases;

CREATE POLICY "participants_can_update_cases"
ON purchase_cases FOR UPDATE TO authenticated
USING (
  buyer_id = auth.uid()
  OR seller_id = auth.uid()
  OR notaire_id = auth.uid()  -- ✅ AJOUT: Le notaire peut modifier
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id
      AND pcp.user_id = auth.uid()
  )
)
WITH CHECK (
  buyer_id = auth.uid()
  OR seller_id = auth.uid()
  OR notaire_id = auth.uid()  -- ✅ AJOUT: Le notaire peut modifier
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id
      AND pcp.user_id = auth.uid()
  )
);

-- ============================================
-- 2. FIX: purchase_case_messages (inclure notary_id)
-- ============================================

DROP POLICY IF EXISTS "participants_can_select_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "participants_can_insert_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "participants_can_update_messages" ON purchase_case_messages;

CREATE POLICY "participants_can_select_messages"
ON purchase_case_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

CREATE POLICY "participants_can_insert_messages"
ON purchase_case_messages FOR INSERT TO authenticated
WITH CHECK (
  sent_by = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM purchase_case_participants pcp
      WHERE pcp.case_id = purchase_case_messages.case_id
        AND pcp.user_id = auth.uid()
    )
  )
);

CREATE POLICY "participants_can_update_messages"
ON purchase_case_messages FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- ============================================
-- 3. FIX: purchase_case_documents (inclure notary_id)
-- ============================================

DROP POLICY IF EXISTS "participants_can_select_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_insert_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_update_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_delete_documents" ON purchase_case_documents;

CREATE POLICY "participants_can_select_documents"
ON purchase_case_documents FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

CREATE POLICY "participants_can_insert_documents"
ON purchase_case_documents FOR INSERT TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM purchase_case_participants pcp
      WHERE pcp.case_id = purchase_case_documents.case_id
        AND pcp.user_id = auth.uid()
    )
  )
);

CREATE POLICY "participants_can_update_documents"
ON purchase_case_documents FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid() OR pc.notaire_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

CREATE POLICY "participants_can_delete_documents"
ON purchase_case_documents FOR DELETE TO authenticated
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_documents.case_id
      AND pc.notaire_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
      AND pcp.role = 'notary'
  )
);

-- ============================================
-- 4. VERIFICATION
-- ============================================

-- Vérifier les policies mises à jour
SELECT 
  'Updated RLS Policies' as check_type,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN (
  'purchase_case_messages',
  'purchase_case_documents', 
  'purchase_cases'
)
ORDER BY tablename, cmd;
