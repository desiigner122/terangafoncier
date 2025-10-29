-- Fix Storage RLS policies for 'documents' bucket
-- Run in Supabase SQL editor with service_role or migration context

-- 1) Ensure RLS is enabled on storage.objects (Supabase default is enabled)
--    (No change required if already enabled)

-- 2) Allow authenticated users to INSERT into 'documents' bucket
create policy if not exists "authenticated can insert documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and auth.role() = 'authenticated'
  );

-- 3) Allow authenticated users to SELECT metadata (optional if bucket is public)
create policy if not exists "authenticated can read documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and auth.role() = 'authenticated'
  );

-- 4) (Optional, if you want users to list their own folder only) Example path-based restrictions
--    Replace `req_headers ->> 'x-client-info-user-id'` with a custom header you set,
--    or switch to a more advanced policy joining to your app tables.
-- NOTE: Simpler approach is to keep bucket 'documents' public for reads and rely on public URLs.

-- 5) If the bucket is private and you need read access via signed URLs only,
--    keep SELECT policy as above and generate signed URLs in the app instead of public URLs.
--    (In the app, use storage.from('documents').createSignedUrl(path, expiresInSeconds)).
