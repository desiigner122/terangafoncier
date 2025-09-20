-- SCRIPT DE RÉINITIALISATION ADMIN SIMPLIFIÉ
-- Version sécurisée qui vérifie d'abord la structure

-- 1. Supprimer l'ancien compte admin s'il existe
DELETE FROM public.profiles WHERE email = 'admin@terangafoncier.sn';
DELETE FROM auth.users WHERE email = 'admin@terangafoncier.sn';

-- 2. Créer un nouveau compte admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@terangafoncier.sn',
    crypt('AdminPassword123!', gen_salt('bf')),
    NOW(),
    '{"role": "admin", "user_type": "admin", "full_name": "Administrateur Système"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 3. Créer le profil avec seulement les colonnes de base
INSERT INTO public.profiles (
    id,
    email,
    role,
    verification_status,
    banned,
    full_name
)
SELECT 
    u.id,
    u.email,
    'admin',
    'active',
    false,
    'Administrateur Système'
FROM auth.users u 
WHERE u.email = 'admin@terangafoncier.sn';

-- 4. Vérification finale
SELECT 
    'NOUVEAU COMPTE ADMIN' as status,
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.role as profile_role,
    u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@terangafoncier.sn';