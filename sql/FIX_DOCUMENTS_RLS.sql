-- Fix RLS policies pour purchase_case_documents
-- Permettre aux participants de voir, ajouter, et gérer les documents

-- 1. Vérifier les policies existantes
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'purchase_case_documents';

-- 2. Supprimer les anciennes policies
DROP POLICY IF EXISTS "allow_select_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_insert_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_update_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_delete_documents" ON purchase_case_documents;

-- 3. Policy SELECT - Voir les documents
CREATE POLICY "allow_select_documents"
ON purchase_case_documents
FOR SELECT
TO authenticated
USING (
  -- Participant du case
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
  OR
  -- Buyer ou Seller du case
  EXISTS (
    SELECT 1
    FROM purchase_cases pc
    WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
  )
);

-- 4. Policy INSERT - Ajouter des documents
CREATE POLICY "allow_insert_documents"
ON purchase_case_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND
  -- Vérifier que l'utilisateur est participant du case
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- 5. Policy UPDATE - Modifier statut des documents (validation)
CREATE POLICY "allow_update_documents"
ON purchase_case_documents
FOR UPDATE
TO authenticated
USING (
  -- Participant du case (notaire peut valider)
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Ne peut pas changer l'uploader
  uploaded_by = (SELECT uploaded_by FROM purchase_case_documents WHERE id = purchase_case_documents.id)
);

-- 6. Policy DELETE - Supprimer ses propres documents
CREATE POLICY "allow_delete_documents"
ON purchase_case_documents
FOR DELETE
TO authenticated
USING (
  -- Peut supprimer ses propres documents
  uploaded_by = auth.uid()
  OR
  -- Ou le notaire peut supprimer
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    JOIN profiles p ON p.id = pcp.user_id
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
      AND pcp.role = 'notary'
  )
);

-- 7. Activer RLS
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- 8. Vérifier les policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'purchase_case_documents'
ORDER BY cmd;
