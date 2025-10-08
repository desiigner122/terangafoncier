-- =============================================
-- POLITIQUES RLS SIMPLIFIÉES POUR STORAGE
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- 1. SUPPRIMER LES ANCIENNES POLITIQUES (si elles existent)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload property photos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their property photos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their property photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their documents" ON storage.objects;

-- =============================================
-- BUCKET: property-photos (Public)
-- =============================================

-- SELECT : Tout le monde peut voir les photos
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');

-- INSERT : Utilisateurs authentifiés peuvent uploader
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-photos');

-- UPDATE : Utilisateurs authentifiés peuvent modifier
CREATE POLICY "Authenticated users can update photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-photos');

-- DELETE : Utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Authenticated users can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-photos');

-- =============================================
-- BUCKET: property-documents (Privé)
-- =============================================

-- SELECT : Utilisateurs authentifiés peuvent voir leurs documents
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'property-documents');

-- INSERT : Utilisateurs authentifiés peuvent uploader
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-documents');

-- UPDATE : Utilisateurs authentifiés peuvent modifier
CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-documents');

-- DELETE : Utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-documents');

-- =============================================
-- VÉRIFICATION
-- =============================================

-- Lister toutes les politiques Storage
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
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
