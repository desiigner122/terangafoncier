-- VÉRIFICATION DE L'ÉTAT DU COMPTE ADMIN
-- Ce script vérifie l'état actuel du compte admin

-- Vérifier si l'utilisateur admin existe dans auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data,
    raw_user_meta_data->>'role' as role_from_metadata,
    raw_user_meta_data->>'user_type' as user_type_from_metadata
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';

-- Vérifier le profil dans public.profiles
SELECT 
    id,
    email,
    role,
    user_type,
    verification_status,
    banned,
    full_name,
    created_at
FROM public.profiles 
WHERE email = 'admin@terangafoncier.sn';

-- Compter le nombre total d'utilisateurs pour contexte
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;