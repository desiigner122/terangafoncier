-- SIMPLE CORRECTION DES MÉTADONNÉES ADMIN
-- Ce script corrige uniquement les métadonnées sans toucher au mot de passe

UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
    'role', 'admin',
    'user_type', 'admin', 
    'full_name', 'Administrateur Système'
)
WHERE email = 'admin@terangafoncier.sn';

-- Synchroniser avec le profil
UPDATE public.profiles 
SET 
    role = 'admin',
    user_type = 'admin',
    verification_status = 'active',
    banned = false,
    full_name = 'Administrateur Système'
WHERE email = 'admin@terangafoncier.sn';

-- Vérification
SELECT 'AUTH.USERS' as table_name, email, raw_user_meta_data->>'role' as role 
FROM auth.users WHERE email = 'admin@terangafoncier.sn'
UNION ALL
SELECT 'PUBLIC.PROFILES' as table_name, email, role 
FROM public.profiles WHERE email = 'admin@terangafoncier.sn';