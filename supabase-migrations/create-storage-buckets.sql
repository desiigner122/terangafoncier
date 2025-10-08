-- =============================================
-- CRÉATION DES BUCKETS SUPABASE STORAGE
-- Pour stocker les photos et documents des terrains
-- =============================================

-- 1. Créer le bucket pour les photos de propriétés
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true, -- Public pour affichage direct
  5242880, -- 5MB max par fichier
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer le bucket pour les documents légaux (privé)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-documents',
  'property-documents',
  false, -- Privé, accès contrôlé
  10485760, -- 10MB max par fichier
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =============================================

-- PROPERTY-PHOTOS BUCKET
-- =============================================

-- Politique 1: Tout le monde peut voir les photos (bucket public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');

-- Politique 2: Seuls les vendeurs authentifiés peuvent uploader
CREATE POLICY "Vendors can upload property photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique 3: Les vendeurs peuvent mettre à jour leurs propres photos
CREATE POLICY "Vendors can update their property photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique 4: Les vendeurs peuvent supprimer leurs propres photos
CREATE POLICY "Vendors can delete their property photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- PROPERTY-DOCUMENTS BUCKET (Privé)
-- =============================================

-- Politique 1: Seul le propriétaire peut voir ses documents
CREATE POLICY "Owners can view their documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique 2: Seuls les vendeurs peuvent uploader des documents
CREATE POLICY "Vendors can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique 3: Les vendeurs peuvent mettre à jour leurs documents
CREATE POLICY "Vendors can update their documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique 4: Les vendeurs peuvent supprimer leurs documents
CREATE POLICY "Vendors can delete their documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- VÉRIFICATION
-- =============================================

-- Vérifier que les buckets sont créés
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id IN ('property-photos', 'property-documents');

-- Vérifier les politiques
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
