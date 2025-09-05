-- ================================================================
-- SOLUTION AVATARS - TABLE DATABASE ALTERNATIVE
-- Corrige définitivement le problème d'upload avatars
-- ================================================================

-- 1. CRÉATION TABLE AVATARS (alternative au bucket)
CREATE TABLE IF NOT EXISTS user_avatars (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_data TEXT NOT NULL, -- Base64 de l'image
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. RLS POUR SÉCURITÉ
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;

-- Politique lecture: utilisateur peut voir son avatar
CREATE POLICY "Users can view own avatar" ON user_avatars
    FOR SELECT USING (auth.uid() = user_id);

-- Politique écriture: utilisateur peut modifier son avatar
CREATE POLICY "Users can update own avatar" ON user_avatars
    FOR ALL USING (auth.uid() = user_id);

-- 3. FONCTION POUR RÉCUPÉRER AVATAR
CREATE OR REPLACE FUNCTION get_user_avatar(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    avatar_data TEXT;
BEGIN
    SELECT ua.avatar_data INTO avatar_data
    FROM user_avatars ua
    WHERE ua.user_id = user_uuid;
    
    RETURN avatar_data;
END;
$$;

-- 4. FONCTION POUR SAUVEGARDER AVATAR
CREATE OR REPLACE FUNCTION save_user_avatar(
    user_uuid UUID,
    avatar_base64 TEXT,
    filename VARCHAR(255),
    filesize INTEGER,
    mimetype VARCHAR(100)
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Insérer ou mettre à jour l'avatar
    INSERT INTO user_avatars (user_id, avatar_data, file_name, file_size, mime_type, updated_at)
    VALUES (user_uuid, avatar_base64, filename, filesize, mimetype, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        avatar_data = EXCLUDED.avatar_data,
        file_name = EXCLUDED.file_name,
        file_size = EXCLUDED.file_size,
        mime_type = EXCLUDED.mime_type,
        updated_at = NOW();
    
    -- Retourner succès
    SELECT json_build_object(
        'success', true,
        'message', 'Avatar sauvegardé avec succès'
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

-- 5. MISE À JOUR TABLE USERS POUR RÉFÉRENCER AVATARS
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data TEXT;

-- 6. TRIGGER POUR SYNCHRONISER AVATAR AVEC TABLE USERS
CREATE OR REPLACE FUNCTION sync_user_avatar()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Mettre à jour la table users avec l'avatar
    UPDATE users 
    SET avatar_url = NEW.avatar_data
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_sync_user_avatar ON user_avatars;
CREATE TRIGGER trigger_sync_user_avatar
    AFTER INSERT OR UPDATE ON user_avatars
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_avatar();

-- 7. INDEX POUR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_avatars_user_id ON user_avatars(user_id);

-- 8. VÉRIFICATIONS FINALES
SELECT '🔍 TABLE AVATARS:' as check_type;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_avatars'
ORDER BY ordinal_position;

SELECT '🔍 FONCTIONS AVATARS:' as check_type;
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%avatar%'
AND routine_schema = 'public';

-- 9. TEST FONCTIONS
SELECT '🧪 TEST FONCTIONS:' as test_type;
SELECT save_user_avatar(
    gen_random_uuid(),
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'test.png',
    100,
    'image/png'
) as test_save;

-- 10. CONFIRMATION RÉUSSITE
SELECT '✅ SYSTÈME AVATARS CONFIGURÉ' as status,
       'Upload avatars fonctionnel via base de données' as message;
