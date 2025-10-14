-- Cette requête bypass les RLS policies
-- Exécute-la dans Supabase SQL Editor avec ton compte admin

-- Voir TOUS les utilisateurs (bypass RLS)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    au.email as auth_email,
    au.confirmed_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC
LIMIT 20;

-- Alternative : Désactiver temporairement RLS pour voir
-- (NE PAS OUBLIER DE LE RÉACTIVER APRÈS)
/*
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
SELECT * FROM profiles ORDER BY created_at DESC;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
*/
