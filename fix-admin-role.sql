-- CORRIGER LE PROBLÈME DE RÔLE DUPLIQUÉ "adminadmin"
-- Ce script corrige les métadonnées de l'utilisateur admin

UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
    'role', 'admin',
    'user_type', 'admin',
    'full_name', 'Administrateur Système'
)
WHERE email = 'admin@terangafoncier.sn';

-- Vérification
SELECT 
    email,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'user_type' as user_type,
    raw_user_meta_data->>'full_name' as full_name
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';