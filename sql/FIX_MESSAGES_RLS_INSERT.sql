-- Fix RLS policy pour permettre l'insertion de messages
-- Erreur actuelle: "new row violates row-level security policy for table purchase_case_messages"

-- 1. Vérifier les policies existantes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purchase_case_messages';

-- 2. Supprimer les anciennes policies d'insertion si elles existent
DROP POLICY IF EXISTS "allow_insert_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON purchase_case_messages;

-- 3. Créer une policy pour permettre l'insertion (l'utilisateur ne peut insérer que ses propres messages)
CREATE POLICY "allow_insert_own_messages"
ON purchase_case_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sent_by = auth.uid()
  AND
  -- Vérifier que l'utilisateur est participant du case
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

-- 4. S'assurer que la policy SELECT existe aussi
DROP POLICY IF EXISTS "allow_select_messages" ON purchase_case_messages;

CREATE POLICY "allow_select_messages"
ON purchase_case_messages
FOR SELECT
TO authenticated
USING (
  -- L'utilisateur peut voir les messages des cases où il est participant
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
  OR
  -- Ou si c'est le buyer ou seller du case
  EXISTS (
    SELECT 1
    FROM purchase_cases pc
    WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
  )
);

-- 5. Policy UPDATE (pour marquer comme lu)
DROP POLICY IF EXISTS "allow_update_messages" ON purchase_case_messages;

CREATE POLICY "allow_update_messages"
ON purchase_case_messages
FOR UPDATE
TO authenticated
USING (
  -- Peut update les messages des cases où il est participant
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Ne peut pas changer le sent_by
  sent_by = (SELECT sent_by FROM purchase_case_messages WHERE id = purchase_case_messages.id)
);

-- 6. Vérifier que RLS est activé
ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- 7. Vérifier les nouvelles policies
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING clause exists'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK clause exists'
    ELSE 'No WITH CHECK clause'
  END as with_check_status
FROM pg_policies
WHERE tablename = 'purchase_case_messages'
ORDER BY cmd;

-- 8. Test: Insérer un message test (à exécuter après connexion comme notaire)
-- INSERT INTO purchase_case_messages (case_id, sent_by, message, message_type)
-- VALUES (
--   '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf',
--   auth.uid(),
--   'Test message depuis le notaire',
--   'text'
-- );
