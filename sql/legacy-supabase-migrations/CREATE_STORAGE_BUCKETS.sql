-- =====================================================
-- CRÉATION DES BUCKETS SUPABASE STORAGE
-- Dashboard Vendeur - Upload Images et Documents
-- Date: 6 Octobre 2025
-- =====================================================

-- =====================================================
-- 1. BUCKET: parcel-images
-- Stockage des photos/images des terrains
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parcel-images',
  'parcel-images',
  true, -- Public pour affichage direct
  10485760, -- 10 MB limite par fichier
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif'
  ];

-- =====================================================
-- 2. BUCKET: parcel-documents
-- Stockage des documents légaux (titres, actes, etc.)
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parcel-documents',
  'parcel-documents',
  false, -- Privé pour documents sensibles
  20971520, -- 20 MB limite par fichier
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

-- =====================================================
-- 3. BUCKET: profile-avatars
-- Photos de profil utilisateurs
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-avatars',
  'profile-avatars',
  true, -- Public
  5242880, -- 5 MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

-- =====================================================
-- 4. BUCKET: transaction-receipts
-- Reçus et justificatifs de paiement
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transaction-receipts',
  'transaction-receipts',
  false, -- Privé
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

-- =====================================================
-- 5. BUCKET: verification-documents
-- Documents de vérification KYC/Anti-fraude
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false, -- Privé
  15728640, -- 15 MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

-- =====================================================
-- 6. RLS POLICIES - parcel-images (PUBLIC)
-- =====================================================

-- Tout le monde peut voir les images publiques
CREATE POLICY "Images terrains publiques"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'parcel-images');

-- Seul le propriétaire peut uploader
CREATE POLICY "Upload images terrains"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'parcel-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut modifier
CREATE POLICY "Update images terrains"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'parcel-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut supprimer
CREATE POLICY "Delete images terrains"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'parcel-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 7. RLS POLICIES - parcel-documents (PRIVÉ)
-- =====================================================

-- Seul le propriétaire ou l'acheteur peut voir
CREATE POLICY "View documents terrains"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'parcel-documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.buyer_id = auth.uid() AND
            t.status IN ('completed', 'pending')
    )
  )
);

-- Seul le propriétaire peut uploader
CREATE POLICY "Upload documents terrains"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'parcel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut modifier
CREATE POLICY "Update documents terrains"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'parcel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut supprimer
CREATE POLICY "Delete documents terrains"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'parcel-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 8. RLS POLICIES - profile-avatars (PUBLIC)
-- =====================================================

-- Tout le monde peut voir les avatars
CREATE POLICY "Avatars publics"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-avatars');

-- Seul le propriétaire peut uploader
CREATE POLICY "Upload avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut modifier
CREATE POLICY "Update avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seul le propriétaire peut supprimer
CREATE POLICY "Delete avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 9. RLS POLICIES - transaction-receipts (PRIVÉ)
-- =====================================================

-- Seul le propriétaire de la transaction peut voir
CREATE POLICY "View reçus transactions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'transaction-receipts' AND
  EXISTS (
    SELECT 1 FROM transactions t
    WHERE (t.buyer_id = auth.uid() OR t.seller_id = auth.uid()) AND
          t.id::text = (storage.foldername(name))[1]
  )
);

-- Seul l'acheteur peut uploader son reçu
CREATE POLICY "Upload reçu transaction"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'transaction-receipts' AND
  EXISTS (
    SELECT 1 FROM transactions t
    WHERE t.buyer_id = auth.uid() AND
          t.id::text = (storage.foldername(name))[1]
  )
);

-- =====================================================
-- 10. RLS POLICIES - verification-documents (PRIVÉ)
-- =====================================================

-- Seul le propriétaire ou les admins peuvent voir
CREATE POLICY "View documents vérification"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
);

-- Seul le propriétaire peut uploader
CREATE POLICY "Upload documents vérification"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 11. VÉRIFICATION
-- =====================================================

-- Vérifier les buckets créés
SELECT 
  id,
  name,
  public,
  file_size_limit / 1048576 AS "max_size_mb",
  array_length(allowed_mime_types, 1) AS "mime_types_count",
  created_at
FROM storage.buckets
ORDER BY created_at DESC;

-- Vérifier les policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- 12. NOTES D'UTILISATION
-- =====================================================

/*
STRUCTURE DES CHEMINS:

1. Images terrains:
   parcel-images/{user_id}/{timestamp}_{filename}
   Exemple: parcel-images/123e4567-e89b-12d3-a456-426614174000/1696598400000_terrain_facade.jpg

2. Documents terrains:
   parcel-documents/{user_id}/{timestamp}_{filename}
   Exemple: parcel-documents/123e4567-e89b-12d3-a456-426614174000/1696598400000_titre_foncier.pdf

3. Avatars:
   profile-avatars/{user_id}/avatar.jpg
   Exemple: profile-avatars/123e4567-e89b-12d3-a456-426614174000/avatar.jpg

4. Reçus transactions:
   transaction-receipts/{transaction_id}/{timestamp}_receipt.pdf
   Exemple: transaction-receipts/trans_123/1696598400000_receipt.pdf

5. Documents vérification:
   verification-documents/{user_id}/{doc_type}_{timestamp}.pdf
   Exemple: verification-documents/123e4567/cni_front_1696598400000.pdf

LIMITES DE TAILLE:
- Images terrains: 10 MB
- Documents terrains: 20 MB
- Avatars: 5 MB
- Reçus: 10 MB
- Vérification: 15 MB

FORMATS ACCEPTÉS:
- Images: JPEG, PNG, WebP, GIF, HEIC
- Documents: PDF, Word, Excel
- Reçus: PDF, JPEG, PNG
- Vérification: PDF, JPEG, PNG
*/

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
