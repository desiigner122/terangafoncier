-- ============================================================
-- Phase 4: RLS Policies pour Notaires
-- ============================================================
-- Ce fichier contient les policies RLS pour que les notaires
-- puissent voir leurs dossiers assignés
-- ============================================================

-- 1. Policy SELECT pour notaires sur purchase_cases
-- Les notaires doivent voir les dossiers où:
-- - Ils sont assignés via notaire_id (ancien système)
-- - Ils ont une assignation active dans notaire_case_assignments

DROP POLICY IF EXISTS "Notaires voient leurs dossiers assignés" ON purchase_cases;

CREATE POLICY "Notaires voient leurs dossiers assignés"
ON purchase_cases FOR SELECT
TO authenticated
USING (
  -- Vérifie si l'utilisateur a le rôle notaire
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'notaire'
  )
  AND (
    -- Option 1: Assigné directement (ancien système)
    notaire_id = auth.uid()
    OR
    -- Option 2: A une assignation active (nouveau système)
    EXISTS (
      SELECT 1 FROM notaire_case_assignments
      WHERE notaire_case_assignments.case_id = purchase_cases.id
      AND notaire_case_assignments.notaire_id = auth.uid()
      AND notaire_case_assignments.notaire_status IN ('pending', 'accepted')
      AND notaire_case_assignments.status NOT IN ('declined', 'cancelled')
    )
  )
);

-- 2. Policy UPDATE pour notaires sur purchase_cases
-- Les notaires peuvent mettre à jour certains champs de leurs dossiers

DROP POLICY IF EXISTS "Notaires peuvent mettre à jour leurs dossiers" ON purchase_cases;

CREATE POLICY "Notaires peuvent mettre à jour leurs dossiers"
ON purchase_cases FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'notaire'
  )
  AND (
    notaire_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM notaire_case_assignments
      WHERE notaire_case_assignments.case_id = purchase_cases.id
      AND notaire_case_assignments.notaire_id = auth.uid()
      AND notaire_case_assignments.notaire_status = 'accepted'
    )
  )
)
WITH CHECK (
  -- Le notaire ne peut pas changer l'acheteur, le vendeur, ou se désassigner
  buyer_id = (SELECT buyer_id FROM purchase_cases WHERE id = purchase_cases.id)
  AND seller_id = (SELECT seller_id FROM purchase_cases WHERE id = purchase_cases.id)
);

-- 3. Policy pour notaire_case_assignments (SELECT)
-- Les notaires voient leurs propres assignations

DROP POLICY IF EXISTS "Notaires voient leurs assignations" ON notaire_case_assignments;

CREATE POLICY "Notaires voient leurs assignations"
ON notaire_case_assignments FOR SELECT
TO authenticated
USING (
  notaire_id = auth.uid()
  OR
  -- Les acheteurs et vendeurs voient les assignations de leurs dossiers
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = notaire_case_assignments.case_id
    AND (purchase_cases.buyer_id = auth.uid() OR purchase_cases.seller_id = auth.uid())
  )
);

-- 4. Policy pour notaire_case_assignments (UPDATE)
-- Les notaires peuvent mettre à jour leurs propres assignations

DROP POLICY IF EXISTS "Notaires mettent à jour leurs assignations" ON notaire_case_assignments;

CREATE POLICY "Notaires mettent à jour leurs assignations"
ON notaire_case_assignments FOR UPDATE
TO authenticated
USING (
  notaire_id = auth.uid()
)
WITH CHECK (
  -- Le notaire ne peut pas changer le notaire_id ou le case_id
  notaire_id = (SELECT notaire_id FROM notaire_case_assignments WHERE id = notaire_case_assignments.id)
  AND case_id = (SELECT case_id FROM notaire_case_assignments WHERE id = notaire_case_assignments.id)
);

-- 5. Policy pour purchase_case_timeline (INSERT)
-- Les notaires peuvent ajouter des événements timeline à leurs dossiers

DROP POLICY IF EXISTS "Notaires ajoutent timeline à leurs dossiers" ON purchase_case_timeline;

CREATE POLICY "Notaires ajoutent timeline à leurs dossiers"
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

-- 6. Policy pour purchase_case_documents (SELECT)
-- Les notaires voient les documents de leurs dossiers

DROP POLICY IF EXISTS "Notaires voient documents de leurs dossiers" ON purchase_case_documents;

CREATE POLICY "Notaires voient documents de leurs dossiers"
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

-- 7. Policy pour purchase_case_messages (SELECT/INSERT)
-- Les notaires peuvent voir et envoyer des messages dans leurs dossiers

DROP POLICY IF EXISTS "Notaires voient messages de leurs dossiers" ON purchase_case_messages;

CREATE POLICY "Notaires voient messages de leurs dossiers"
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

DROP POLICY IF EXISTS "Notaires envoient messages dans leurs dossiers" ON purchase_case_messages;

CREATE POLICY "Notaires envoient messages dans leurs dossiers"
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

-- ============================================================
-- Vérifications
-- ============================================================

-- Vérifier les policies créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN (
  'purchase_cases',
  'notaire_case_assignments',
  'purchase_case_timeline',
  'purchase_case_documents',
  'purchase_case_messages'
)
AND policyname LIKE '%otaire%'
ORDER BY tablename, policyname;

-- Fin du script
