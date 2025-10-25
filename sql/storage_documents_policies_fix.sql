-- Minimal storage RLS policies to unblock uploads to 'documents' bucket
-- Run in Supabase SQL editor with service role

DROP POLICY IF EXISTS "documents_insert_authenticated" ON storage.objects;
CREATE POLICY "documents_insert_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  -- Let the storage trigger assign the owner; require correct bucket and per-user folder path
  bucket_id = 'documents'
  AND name LIKE auth.uid() || '/%'
);

-- Allow authenticated users to select objects they own or under their folder
DROP POLICY IF EXISTS "documents_select_own_or_folder" ON storage.objects;
CREATE POLICY "documents_select_own_or_folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (
    owner = auth.uid()
    OR name LIKE auth.uid() || '/%'
  )
);

-- Allow owners to update and delete their own objects
DROP POLICY IF EXISTS "documents_update_own" ON storage.objects;
CREATE POLICY "documents_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid())
WITH CHECK (bucket_id = 'documents' AND owner = auth.uid());

DROP POLICY IF EXISTS "documents_delete_own" ON storage.objects;
CREATE POLICY "documents_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid());
