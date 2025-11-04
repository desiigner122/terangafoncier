-- Script COMPLET pour corriger tous les problèmes RLS et constraints

-- ============================================
-- 1. FIX: Status Check Constraint
-- ============================================

ALTER TABLE purchase_cases 
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

ALTER TABLE purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status IN (
  'initiated',
  'buyer_verification',
  'seller_notification',
  'document_collection',
  'title_verification',
  'contract_preparation',
  'preliminary_agreement',
  'deposit_pending',
  'contract_validation',
  'appointment_scheduling',
  'signing_process',
  'final_payment',
  'signature',
  'payment_processing',
  'transfer_initiated',
  'registration',
  'completed',
  'cancelled',
  'suspended'
));

-- ============================================
-- 2. FIX: documents_administratifs FOREIGN KEY & RLS
-- ============================================

-- FIX 1: Foreign Key Constraint
-- Erreur: "violates foreign key constraint fk_documents_administratifs_request"
-- La table "requests" n'existe pas, il faut pointer vers "purchase_cases"

ALTER TABLE documents_administratifs 
DROP CONSTRAINT IF EXISTS fk_documents_administratifs_request;

ALTER TABLE documents_administratifs 
DROP CONSTRAINT IF EXISTS fk_documents_administratifs_purchase_case;

ALTER TABLE documents_administratifs 
ADD CONSTRAINT fk_documents_administratifs_purchase_case
FOREIGN KEY (purchase_request_id) 
REFERENCES purchase_cases(id) 
ON DELETE CASCADE;

-- FIX 2: RLS Policies

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON documents_administratifs;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON documents_administratifs;
DROP POLICY IF EXISTS "authenticated_can_select_documents" ON documents_administratifs;
DROP POLICY IF EXISTS "authenticated_can_insert_documents" ON documents_administratifs;
DROP POLICY IF EXISTS "authenticated_can_update_documents" ON documents_administratifs;
DROP POLICY IF EXISTS "authenticated_can_delete_documents" ON documents_administratifs;

CREATE POLICY "authenticated_can_select_documents"
ON documents_administratifs FOR SELECT TO authenticated
USING (true);  -- Permissif pour l'instant

CREATE POLICY "authenticated_can_insert_documents"
ON documents_administratifs FOR INSERT TO authenticated
WITH CHECK (true);  -- Permissif pour l'instant

CREATE POLICY "authenticated_can_update_documents"
ON documents_administratifs FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "authenticated_can_delete_documents"
ON documents_administratifs FOR DELETE TO authenticated
USING (true);

ALTER TABLE documents_administratifs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. FIX: purchase_case_messages RLS (re-apply)
-- ============================================

DROP POLICY IF EXISTS "allow_insert_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_insert_own_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_select_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "allow_update_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "participants_can_select_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "participants_can_insert_messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "participants_can_update_messages" ON purchase_case_messages;

CREATE POLICY "participants_can_select_messages"
ON purchase_case_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_messages.case_id
      AND pcp.user_id = auth.uid()
  )
);

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
-- 4. FIX: purchase_case_documents RLS (re-apply)
-- ============================================

DROP POLICY IF EXISTS "allow_select_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_insert_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_update_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "allow_delete_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_select_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_insert_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_update_documents" ON purchase_case_documents;
DROP POLICY IF EXISTS "participants_can_delete_documents" ON purchase_case_documents;

CREATE POLICY "participants_can_select_documents"
ON purchase_case_documents FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
  )
);

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

CREATE POLICY "participants_can_update_documents"
ON purchase_case_documents FOR UPDATE TO authenticated
USING (
  EXISTS (
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
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_case_documents.case_id
      AND pcp.user_id = auth.uid()
      AND pcp.role = 'notary'
  )
);

ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. FIX: purchase_cases UPDATE policy
-- ============================================

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
-- 6. VERIFICATION COMPLETE
-- ============================================

-- Vérifier la contrainte status
SELECT 
  'Status Constraint' as check_type,
  conname,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'purchase_cases'::regclass
  AND conname = 'purchase_cases_status_check';

-- Vérifier toutes les policies
SELECT 
  'RLS Policies' as check_type,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN (
  'purchase_case_messages',
  'purchase_case_documents', 
  'purchase_cases',
  'documents_administratifs'
)
ORDER BY tablename, cmd;

-- Compter les policies par table
SELECT 
  'Policy Count' as check_type,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN (
  'purchase_case_messages',
  'purchase_case_documents', 
  'purchase_cases',
  'documents_administratifs'
)
GROUP BY tablename
ORDER BY tablename;
