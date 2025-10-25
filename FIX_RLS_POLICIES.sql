-- ============================================================
-- FIX RLS POLICIES FOR STORAGE AND MESSAGING
-- Execute in Supabase SQL Editor with service_role
-- ============================================================

-- ==================================================
-- 1. FIX STORAGE RLS POLICIES (Via Supabase Dashboard)
-- ==================================================

-- NOTE: Storage.objects is managed by Supabase and cannot be modified via SQL
-- 
-- TO FIX STORAGE UPLOAD ERRORS:
-- 1. Go to Supabase Dashboard → Storage → Buckets
-- 2. Click on "documents" bucket
-- 3. Go to Policies tab
-- 4. Make sure you have this policy:
--    - Authenticated users can INSERT objects in documents bucket
--    - Path: documents/* (or just documents/)
--
-- ALTERNATIVE: Use service_role bucket with unrestricted access
-- Contact Supabase support if needed to modify storage policies

-- ==================================================
-- 2. FIX RLS POLICIES FOR purchase_case_messages
-- ==================================================

-- Enable RLS on purchase_case_messages
ALTER TABLE public.purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their cases" ON public.purchase_case_messages;
DROP POLICY IF EXISTS "Users can insert messages in their cases" ON public.purchase_case_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.purchase_case_messages;

-- Policy: Users can SELECT messages from cases they're involved in
CREATE POLICY "Users can view messages in their cases"
ON public.purchase_case_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

-- Policy: Users can INSERT messages if they're part of the case
CREATE POLICY "Users can insert messages in their cases"
ON public.purchase_case_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

-- Policy: Users can UPDATE their own messages
CREATE POLICY "Users can update their own messages"
ON public.purchase_case_messages FOR UPDATE
USING (
  sender_id = auth.uid()
  OR auth.role() = 'service_role'
)
WITH CHECK (
  sender_id = auth.uid()
  OR auth.role() = 'service_role'
);

-- ==================================================
-- 3. FIX RLS POLICIES FOR purchase_case_documents
-- ==================================================

-- Enable RLS if not already
ALTER TABLE public.purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view documents in their cases" ON public.purchase_case_documents;
DROP POLICY IF EXISTS "Users can insert documents in their cases" ON public.purchase_case_documents;

-- Policy: Users can SELECT documents from cases they're involved in
CREATE POLICY "Users can view documents in their cases"
ON public.purchase_case_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

-- Policy: Users can INSERT documents if they're part of the case
CREATE POLICY "Users can insert documents in their cases"
ON public.purchase_case_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

-- ==================================================
-- 4. VERIFY POLICIES
-- ==================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('objects', 'purchase_case_messages', 'purchase_case_documents')
ORDER BY tablename, policyname;
