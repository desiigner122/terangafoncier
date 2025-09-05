-- ================================================================
-- SOLUTION BUCKET AVATARS - VERSION PERMISSIONS LIMITÉES
-- Résout: "42501: must be owner of table objects"
-- ================================================================

-- IMPORTANT: Ce script fonctionne même sans permissions propriétaire
-- Il utilise uniquement les permissions disponibles pour votre rôle

-- 1. CRÉATION DU BUCKET (SIMPLE)
-- Utilise INSERT basique sans DROP POLICY
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars', 
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- 2. VÉRIFICATION BUCKET CRÉÉ
SELECT '🔍 BUCKET CRÉÉ:' as status;
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'avatars';

-- 3. CONFIRMATION RÉUSSITE
SELECT '✅ BUCKET AVATARS CRÉÉ AVEC SUCCÈS' as result,
       'Testez maintenant l''upload dans votre application' as next_step;
