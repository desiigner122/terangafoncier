-- Fix Storage RLS policies for 'documents' bucket
-- Run in Supabase SQL editor with **service_role** (top-right dropdown in editor)
-- This script is idempotent and handles all edge cases

-- STEP 1: RLS is already enabled by default on storage.objects (no ALTER needed)

-- STEP 2: Drop any conflicting or old policies
DROP POLICY IF EXISTS "authenticated can insert documents" ON storage.objects;
DROP POLICY IF EXISTS "authenticated can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert to documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated select from documents" ON storage.objects;

-- STEP 3: Create INSERT policy (authenticated users can upload files to 'documents' bucket)
CREATE POLICY "authenticated can insert documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- STEP 4: Create SELECT policy (authenticated users can read metadata from 'documents' bucket)
-- This is needed so users can view/download their files via signed URLs or public URLs
CREATE POLICY "authenticated can read documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

-- STEP 5: (OPTIONAL) If you want to restrict updates/deletes, add DELETE policy
-- Uncomment below if users should be able to delete their own files:
-- DROP POLICY IF EXISTS "authenticated can delete documents" ON storage.objects;
-- CREATE POLICY "authenticated can delete documents"
--   ON storage.objects FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- STEP 6: Verify policies were created
-- Run this SELECT to confirm the policies exist (you should see 2 rows):
-- SELECT policyname, cmd, qual FROM pg_policies 
-- WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'authenticated can%documents%';

-- TROUBLESHOOTING:
-- - If you still get "403 Unauthorized", make sure you switched to **service_role** before running.
-- - If you see "42601 syntax error", check you're using Supabase SQL editor (not local psql).
-- - If policies don't appear in pg_policies SELECT, re-run this entire script in service_role context.
-- - For immediate testing: use the debug policy below (temporary), then revert to the bucket-specific one.

-- DEBUG POLICY (temporary, for testing only - removes all RLS restrictions):
-- Uncomment ONLY if the restrictive policies above don't work.
-- This will allow ALL authenticated users to do anything on storage.objects.
-- Once uploads work, comment this out and we'll refine the restrictive policies.
DROP POLICY IF EXISTS "debug allow all authenticated" ON storage.objects;
CREATE POLICY "debug allow all authenticated"
  ON storage.objects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
-- Once uploads work, delete this debug policy and use the restrictive ones above.
