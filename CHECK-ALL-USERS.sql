-- Voir TOUS les profils existants
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- Si tu veux changer un utilisateur en vendeur, décommente et remplace l'ID :
/*
UPDATE profiles
SET role = 'vendeur'
WHERE id = 'USER_ID_TO_CHANGE';  -- Remplace par l'ID de l'utilisateur
*/

-- Ou créer un nouveau profil vendeur (si l'utilisateur existe dans auth.users) :
/*
INSERT INTO profiles (id, email, full_name, role)
VALUES (
    'USER_ID_FROM_AUTH_USERS',  -- L'ID doit exister dans auth.users
    'vendeur@example.com',
    'Nom du Vendeur',
    'vendeur'
);
*/
