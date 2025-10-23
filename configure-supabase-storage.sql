-- 📦 CONFIGURATION SUPABASE STORAGE - DASHBOARD PARTICULIER
-- Script SQL pour créer et configurer les buckets de stockage

-- ========================================
-- 1. CRÉER LES BUCKETS STORAGE
-- ========================================

-- Bucket pour documents administratifs des particuliers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents-administratifs',
    'documents-administratifs',
    false, -- Privé, nécessite authentification
    52428800, -- 50 MB max par fichier
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

-- Bucket pour avatars utilisateurs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true, -- Public
    5242880, -- 5 MB max
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

-- Bucket pour pièces jointes messages
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'message-attachments',
    'message-attachments',
    false, -- Privé
    20971520, -- 20 MB max
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 20971520;

-- ========================================
-- 2. POLICIES RLS POUR STORAGE
-- ========================================

-- ===== BUCKET: documents-administratifs =====

-- Policy 1: Les utilisateurs peuvent uploader leurs propres documents
CREATE POLICY "users_upload_own_documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents-administratifs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Les utilisateurs peuvent voir leurs propres documents
CREATE POLICY "users_view_own_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents-administratifs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Les utilisateurs peuvent mettre à jour leurs propres documents
CREATE POLICY "users_update_own_documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents-administratifs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'documents-administratifs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Les utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "users_delete_own_documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents-administratifs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Admin a accès complet aux documents
CREATE POLICY "admin_full_access_documents_storage"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'documents-administratifs' 
    AND EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'agent_foncier', 'Admin', 'Agent Foncier')
    )
);

-- ===== BUCKET: avatars =====

-- Policy 1: Tout le monde peut voir les avatars (public)
CREATE POLICY "public_view_avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 2: Les utilisateurs peuvent uploader leur propre avatar
CREATE POLICY "users_upload_own_avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Les utilisateurs peuvent mettre à jour leur propre avatar
CREATE POLICY "users_update_own_avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Les utilisateurs peuvent supprimer leur propre avatar
CREATE POLICY "users_delete_own_avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ===== BUCKET: message-attachments =====

-- Policy 1: Les utilisateurs peuvent uploader des pièces jointes
CREATE POLICY "users_upload_attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'message-attachments' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Les utilisateurs peuvent voir leurs propres pièces jointes
CREATE POLICY "users_view_own_attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-attachments' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Les utilisateurs peuvent supprimer leurs propres pièces jointes
CREATE POLICY "users_delete_own_attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'message-attachments' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ========================================
-- 3. FONCTIONS UTILITAIRES STORAGE
-- ========================================

-- Fonction pour obtenir l'URL publique d'un avatar
CREATE OR REPLACE FUNCTION get_public_avatar_url(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    avatar_path TEXT;
BEGIN
    SELECT name INTO avatar_path
    FROM storage.objects
    WHERE bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = user_id::text
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF avatar_path IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN 'https://your-project.supabase.co/storage/v1/object/public/avatars/' || avatar_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciens fichiers (> 90 jours)
CREATE OR REPLACE FUNCTION cleanup_old_storage_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Supprimer les fichiers de plus de 90 jours dans message-attachments
    DELETE FROM storage.objects
    WHERE bucket_id = 'message-attachments'
    AND created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 4. VÉRIFICATION FINALE
-- ========================================

DO $$
DECLARE
    bucket_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Compter les buckets
    SELECT COUNT(*) INTO bucket_count 
    FROM storage.buckets 
    WHERE id IN ('documents-administratifs', 'avatars', 'message-attachments');
    
    -- Compter les policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects';
    
    -- Afficher les résultats
    RAISE NOTICE '✅ Configuration Storage terminée !';
    RAISE NOTICE '📦 Buckets créés : %', bucket_count;
    RAISE NOTICE '🔐 Policies RLS actives : %', policy_count;
    RAISE NOTICE '';
    RAISE NOTICE '📁 Buckets disponibles :';
    RAISE NOTICE '  - documents-administratifs (privé, 50 MB max)';
    RAISE NOTICE '  - avatars (public, 5 MB max)';
    RAISE NOTICE '  - message-attachments (privé, 20 MB max)';
END
$$;

-- Afficher les détails des buckets
SELECT 
    id as bucket_id,
    name,
    CASE WHEN public THEN 'Public' ELSE 'Privé' END as visibility,
    file_size_limit / 1048576 || ' MB' as max_size,
    array_length(allowed_mime_types, 1) as allowed_types_count,
    created_at
FROM storage.buckets
WHERE id IN ('documents-administratifs', 'avatars', 'message-attachments')
ORDER BY created_at DESC;
