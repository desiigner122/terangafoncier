-- Voir tous les profils avec leurs rôles
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC;
