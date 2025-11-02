-- ============================================================
-- HOTFIX: Supprimer les policies récursives
-- ============================================================
-- URGENT: Les policies notaires créent une récursion infinie
-- Ce script les supprime pour restaurer l'accès
-- ============================================================

-- Supprimer la policy problématique pour notaires
DROP POLICY IF EXISTS "Notaires voient leurs dossiers assignés" ON purchase_cases;
DROP POLICY IF EXISTS "Notaires peuvent mettre à jour leurs dossiers" ON purchase_cases;
DROP POLICY IF EXISTS "Notaires voient leurs assignations" ON notaire_case_assignments;
DROP POLICY IF EXISTS "Notaires mettent à jour leurs assignations" ON notaire_case_assignments;
DROP POLICY IF EXISTS "Notaires ajoutent timeline à leurs dossiers" ON purchase_case_timeline;
DROP POLICY IF EXISTS "Notaires voient documents de leurs dossiers" ON purchase_case_documents;
DROP POLICY IF EXISTS "Notaires voient messages de leurs dossiers" ON purchase_case_messages;
DROP POLICY IF EXISTS "Notaires envoient messages dans leurs dossiers" ON purchase_case_messages;

-- Recréer la policy notaire SANS vérification du rôle (évite la récursion)
-- Les notaires voient les dossiers où ils sont assignés directement

CREATE POLICY "Notaires voient dossiers assignés"
ON purchase_cases FOR SELECT
TO authenticated
USING (
  -- Option 1: Assigné directement (ancien système)
  notaire_id = auth.uid()
  OR
  -- Option 2: A une assignation active (nouveau système)
  EXISTS (
    SELECT 1 FROM notaire_case_assignments
    WHERE notaire_case_assignments.case_id = purchase_cases.id
    AND notaire_case_assignments.notaire_id = auth.uid()
    AND notaire_case_assignments.notaire_status IN ('pending', 'accepted')
  )
);

CREATE POLICY "Notaires modifient dossiers assignés"
ON purchase_cases FOR UPDATE
TO authenticated
USING (
  notaire_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM notaire_case_assignments
    WHERE notaire_case_assignments.case_id = purchase_cases.id
    AND notaire_case_assignments.notaire_id = auth.uid()
    AND notaire_case_assignments.notaire_status = 'accepted'
  )
);

-- Policy pour notaire_case_assignments
CREATE POLICY "Voir assignations pertinentes"
ON notaire_case_assignments FOR SELECT
TO authenticated
USING (
  notaire_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = notaire_case_assignments.case_id
    AND (purchase_cases.buyer_id = auth.uid() OR purchase_cases.seller_id = auth.uid())
  )
);

CREATE POLICY "Notaires modifient leurs assignations"
ON notaire_case_assignments FOR UPDATE
TO authenticated
USING (notaire_id = auth.uid());

-- Policy pour timeline
CREATE POLICY "Notaires ajoutent timeline"
ON purchase_case_timeline FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
    AND (
      purchase_cases.notaire_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM notaire_case_assignments
        WHERE notaire_case_assignments.case_id = purchase_cases.id
        AND notaire_case_assignments.notaire_id = auth.uid()
        AND notaire_case_assignments.notaire_status = 'accepted'
      )
    )
  )
);

-- Policy pour documents
CREATE POLICY "Notaires voient documents"
ON purchase_case_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_documents.case_id
    AND (
      purchase_cases.notaire_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM notaire_case_assignments
        WHERE notaire_case_assignments.case_id = purchase_cases.id
        AND notaire_case_assignments.notaire_id = auth.uid()
        AND notaire_case_assignments.notaire_status IN ('pending', 'accepted')
      )
    )
  )
);

-- Policy pour messages
CREATE POLICY "Notaires voient messages"
ON purchase_case_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_messages.case_id
    AND (
      purchase_cases.notaire_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM notaire_case_assignments
        WHERE notaire_case_assignments.case_id = purchase_cases.id
        AND notaire_case_assignments.notaire_id = auth.uid()
        AND notaire_case_assignments.notaire_status IN ('pending', 'accepted')
      )
    )
  )
);

CREATE POLICY "Notaires envoient messages"
ON purchase_case_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_messages.case_id
    AND (
      purchase_cases.notaire_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM notaire_case_assignments
        WHERE notaire_case_assignments.case_id = purchase_cases.id
        AND notaire_case_assignments.notaire_id = auth.uid()
        AND notaire_case_assignments.notaire_status = 'accepted'
      )
    )
  )
);

-- Vérifier les policies
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename IN ('purchase_cases', 'notaire_case_assignments', 'purchase_case_timeline', 'purchase_case_documents', 'purchase_case_messages')
ORDER BY tablename, policyname;

-- Fin du hotfix
