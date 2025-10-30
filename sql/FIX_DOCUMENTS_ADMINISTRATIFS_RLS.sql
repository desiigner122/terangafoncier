-- Fix RLS policies pour documents_administratifs
-- Erreur: "new row violates row-level security policy for table documents_administratifs"

-- 1. Vérifier les policies existantes
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'documents_administratifs';

-- 2. Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON documents_administratifs;

-- 3. Créer des policies permissives pour les utilisateurs authentifiés

-- SELECT: Tout utilisateur authentifié peut voir ses documents ou ceux des cases où il participe
CREATE POLICY "authenticated_can_select_documents"
ON documents_administratifs FOR SELECT TO authenticated
USING (
  uploaded_by = auth.uid()
  OR user_id = auth.uid()
  OR purchase_request_id IN (
    SELECT case_id FROM purchase_case_participants 
    WHERE user_id = auth.uid()
  )
);

-- INSERT: Tout utilisateur authentifié peut créer des documents
CREATE POLICY "authenticated_can_insert_documents"
ON documents_administratifs FOR INSERT TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  OR user_id = auth.uid()
);

-- UPDATE: Peut modifier ses propres documents
CREATE POLICY "authenticated_can_update_documents"
ON documents_administratifs FOR UPDATE TO authenticated
USING (
  uploaded_by = auth.uid()
  OR user_id = auth.uid()
);

-- DELETE: Peut supprimer ses propres documents
CREATE POLICY "authenticated_can_delete_documents"
ON documents_administratifs FOR DELETE TO authenticated
USING (
  uploaded_by = auth.uid()
  OR user_id = auth.uid()
);

-- 4. Activer RLS
ALTER TABLE documents_administratifs ENABLE ROW LEVEL SECURITY;

-- 5. Vérifier les nouvelles policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'documents_administratifs'
ORDER BY cmd;
