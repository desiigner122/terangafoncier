-- RÉINITIALISER LE MOT DE PASSE ADMIN
-- Ce script recrée le compte admin avec un nouveau mot de passe

-- 1. Supprimer l'ancien compte admin s'il existe
DELETE FROM auth.users WHERE email = 'admin@terangafoncier.sn';
DELETE FROM public.profiles WHERE email = 'admin@terangafoncier.sn';

-- 2. Créer un nouveau compte admin
-- IMPORTANT: Remplacez 'NOUVEAU_MOT_DE_PASSE' par le mot de passe souhaité
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

-- 3. Créer le profil correspondant
INSERT INTO public.profiles (
    id,
    email,
    role,
    verification_status,
    banned,
    full_name,
    created_at,
    updated_at
)
SELECT 
    u.id,
    u.email,
    'admin',
    'active',
    false,
    'Administrateur Système',
    NOW(),
    NOW()
FROM auth.users u 
WHERE u.email = 'admin@terangafoncier.sn';

-- 4. Vérification finale
SELECT 
    'COMPTE ADMIN RECRÉÉ' as status,
    email,
    raw_user_meta_data->>'role' as role,
    email_confirmed_at
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';