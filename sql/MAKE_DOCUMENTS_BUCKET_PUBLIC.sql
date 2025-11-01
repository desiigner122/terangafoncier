-- Make 'documents' bucket public for downloads
-- Run this in Supabase SQL editor with service_role role

-- Update bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'documents';

-- Verify the change
SELECT name, public FROM storage.buckets WHERE name = 'documents';
