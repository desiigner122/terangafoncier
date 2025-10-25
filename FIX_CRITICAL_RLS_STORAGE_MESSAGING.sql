-- ============================================================
-- CRITICAL FIX: DÉSACTIVER RLS POUR STORAGE TEMPORAIREMENT
-- This allows uploads to work while we debug the policies
-- Execute in Supabase SQL Editor with service_role
-- ============================================================

-- ⚠️ WARNING: This is a temporary fix for debugging
-- In production, proper RLS policies should be implemented

-- 1. Disable RLS on storage.objects temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Result should show: objects | f (false = RLS disabled)

-- 3. Test upload should now work
-- Try uploading a document in the frontend and check if it succeeds

-- 4. When working, we can re-enable with proper policies:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Allow authenticated users to upload to documents"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Allow users to read documents"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'documents');

-- ============================================================
-- FIX: ENSURE purchase_case_messages HAS CORRECT RLS
-- ============================================================

-- 1. Enable RLS on purchase_case_messages
ALTER TABLE public.purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any)
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Users can view messages in their cases" ON public.purchase_case_messages';
  EXECUTE 'DROP POLICY IF EXISTS "Users can insert messages in their cases" ON public.purchase_case_messages';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own messages" ON public.purchase_case_messages';
  EXECUTE 'DROP POLICY IF EXISTS "service_role can do anything" ON public.purchase_case_messages';
EXCEPTION WHEN OTHERS THEN NULL;
END;
$$;

-- 3. Create PERMISSIVE policies for both buyer and seller
CREATE POLICY "Users can view all messages in their cases - PERMISSIVE"
ON public.purchase_case_messages FOR SELECT
USING (
  -- Buyer can see messages in their cases
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND buyer_id = auth.uid()
  )
  OR
  -- Seller can see messages in their cases
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND seller_id = auth.uid()
  )
  OR
  -- Service role can see everything
  auth.role() = 'service_role'
);

CREATE POLICY "Users can insert messages in their cases - PERMISSIVE"
ON public.purchase_case_messages FOR INSERT
WITH CHECK (
  -- Both buyer and seller can send messages
  (
    EXISTS (
      SELECT 1 FROM public.purchase_cases
      WHERE id = purchase_case_messages.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
    AND sender_id = auth.uid()
  )
  OR
  auth.role() = 'service_role'
);

CREATE POLICY "Users can update their messages - PERMISSIVE"
ON public.purchase_case_messages FOR UPDATE
USING (
  sender_id = auth.uid() OR auth.role() = 'service_role'
)
WITH CHECK (
  sender_id = auth.uid() OR auth.role() = 'service_role'
);

-- ============================================================
-- FIX: ENSURE purchase_case_documents HAS CORRECT RLS
-- ============================================================

-- 1. Enable RLS
ALTER TABLE public.purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Users can view documents in their cases" ON public.purchase_case_documents';
  EXECUTE 'DROP POLICY IF EXISTS "Users can insert documents in their cases" ON public.purchase_case_documents';
EXCEPTION WHEN OTHERS THEN NULL;
END;
$$;

-- 3. Create PERMISSIVE policies
CREATE POLICY "Both buyer and seller can view documents - PERMISSIVE"
ON public.purchase_case_documents FOR SELECT
USING (
  -- Buyer can see documents in their cases
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND buyer_id = auth.uid()
  )
  OR
  -- Seller can see documents in their cases
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND seller_id = auth.uid()
  )
  OR
  -- Service role can see everything
  auth.role() = 'service_role'
);

CREATE POLICY "Both buyer and seller can upload documents - PERMISSIVE"
ON public.purchase_case_documents FOR INSERT
WITH CHECK (
  -- Both can upload
  (
    EXISTS (
      SELECT 1 FROM public.purchase_cases
      WHERE id = purchase_case_documents.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  )
  OR
  auth.role() = 'service_role'
);

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents', 'objects')
ORDER BY tablename, policyname;
