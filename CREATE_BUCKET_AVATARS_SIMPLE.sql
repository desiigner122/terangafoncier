-- ================================================================
-- CRÉATION BUCKET AVATARS - VERSION SIMPLIFIÉE
-- À exécuter dans Supabase SQL Editor
-- ================================================================

-- 1. CRÉATION DU BUCKET (simple et efficace)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars', 
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- 2. VÉRIFICATION CRÉATION
SELECT 
    '✅ BUCKET CRÉÉ' as status,
    id, 
    name, 
    public, 
    file_size_limit,
    array_length(allowed_mime_types, 1) as mime_types_count
FROM storage.buckets 
WHERE id = 'avatars';

-- 3. FONCTION HELPER POUR LE CLIENT JS
CREATE OR REPLACE FUNCTION create_avatars_bucket()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Insérer le bucket s'il n'existe pas
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'avatars',
        'avatars', 
        true,
        5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Retourner le résultat
    SELECT json_build_object(
        'success', true,
        'bucket_id', 'avatars',
        'message', 'Bucket avatars ready'
    ) INTO result;
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    SELECT json_build_object(
        'success', false,
        'error', SQLERRM
    ) INTO result;
    
    RETURN result;
END;
$$;

-- 4. TEST DE LA FONCTION
SELECT create_avatars_bucket();

-- 5. CONFIRMATION FINALE
SELECT 
    '🎉 SETUP TERMINÉ' as status,
    'Bucket avatars prêt pour l''application' as message;
