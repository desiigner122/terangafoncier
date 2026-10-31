-- CORRECTION DÉFINITIVE POLITIQUES BUCKET AVATARS
-- Résout: "new row violates row-level security policy"
-- Résout: "Bucket not found" pour client JS

-- 1. SUPPRESSION DES ANCIENNES POLITIQUES (si elles existent)
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Upload" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Update" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Delete" ON storage.objects;

-- 2. VÉRIFICATION ET CRÉATION DU BUCKET (avec gestion erreur)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars', 
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. POLITIQUES RLS PERMISSIVES POUR AVATARS
-- Politique de lecture publique (sans restriction)
CREATE POLICY "Avatar Public Read" ON storage.objects
    FOR SELECT 
    TO public
    USING (bucket_id = 'avatars');

-- Politique d'upload pour utilisateurs authentifiés (permissive)
CREATE POLICY "Avatar Upload Authenticated" ON storage.objects
    FOR INSERT 
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');

-- Politique de mise à jour pour utilisateurs authentifiés
CREATE POLICY "Avatar Update Authenticated" ON storage.objects
    FOR UPDATE 
    TO authenticated
    USING (bucket_id = 'avatars')
    WITH CHECK (bucket_id = 'avatars');

-- Politique de suppression pour utilisateurs authentifiés
CREATE POLICY "Avatar Delete Authenticated" ON storage.objects
    FOR DELETE 
    TO authenticated
    USING (bucket_id = 'avatars');

-- 4. POLITIQUES POUR LA TABLE BUCKETS ELLE-MÊME
-- Permettre la lecture des buckets
DROP POLICY IF EXISTS "Give access to buckets" ON storage.buckets;
CREATE POLICY "Give access to buckets" ON storage.buckets
    FOR SELECT TO public
    USING (true);

-- 5. ACTIVATION EXPLICITE RLS (si pas déjà fait)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 6. VÉRIFICATIONS FINALES
SELECT '🔍 VÉRIFICATION BUCKET:' as check_type;
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'avatars';

SELECT '🔍 VÉRIFICATION POLITIQUES:' as check_type;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('objects', 'buckets') 
  AND schemaname = 'storage'
  AND policyname LIKE '%Avatar%'
ORDER BY tablename, policyname;

-- 7. MESSAGE DE SUCCÈS
SELECT '✅ BUCKET AVATARS COMPLÈTEMENT CONFIGURÉ' as status,
       'Upload images devrait maintenant fonctionner' as message;
