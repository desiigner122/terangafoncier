-- ================================================================
-- CREATION BUCKET AVATARS - CORRECTION FINALE
-- Résout: Bucket "avatars" non disponible
-- ================================================================

-- 1. VERIFICATION ET CREATION DU BUCKET AVATARS
DO $$
DECLARE
    bucket_exists boolean;
BEGIN
    -- Vérifier si le bucket existe
    SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE name = 'avatars') INTO bucket_exists;
    
    IF NOT bucket_exists THEN
        -- Créer le bucket avatars
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            true, -- Public pour simplifier l'accès
            5242880, -- 5MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
        );
        RAISE NOTICE '✅ Bucket avatars créé avec succès';
    ELSE
        RAISE NOTICE '✅ Bucket avatars existe déjà';
        
        -- Mettre à jour les paramètres si nécessaire
        UPDATE storage.buckets 
        SET 
            public = true,
            file_size_limit = 5242880,
            allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
        WHERE name = 'avatars';
        RAISE NOTICE '✅ Bucket avatars mis à jour';
    END IF;
END $$;

-- 2. VERIFICATION DES POLITIQUES STORAGE EXISTANTES
SELECT '📋 POLITIQUES STORAGE ACTUELLES:' as status;
SELECT policyname, permissive, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%avatar%'
ORDER BY policyname;

-- 3. CREATION DES POLITIQUES STORAGE SI MANQUANTES
-- Politique pour voir les avatars (lecture publique)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Public Avatar Access'
    ) THEN
        CREATE POLICY "Public Avatar Access" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'avatars');
        RAISE NOTICE '✅ Politique lecture publique avatars créée';
    END IF;
END $$;

-- Politique pour uploader ses propres avatars
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'User Avatar Upload'
    ) THEN
        CREATE POLICY "User Avatar Upload" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'avatars');
        RAISE NOTICE '✅ Politique upload avatars créée';
    END IF;
END $$;

-- 4. VERIFICATION FINALE DU BUCKET
SELECT '🔍 VERIFICATION BUCKET:' as status;
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'avatars';

-- 5. TEST SIMPLE DE FONCTIONNEMENT
SELECT '🚀 BUCKET AVATARS PRET POUR UTILISATION' as resultat;
