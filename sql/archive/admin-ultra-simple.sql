-- SCRIPT ADMIN ULTRA-SIMPLE
-- Version qui utilise seulement les colonnes essentielles

-- 1. Supprimer complètement l'ancien admin
DELETE FROM public.profiles WHERE email = 'admin@terangafoncier.sn';
DELETE FROM auth.users WHERE email = 'admin@terangafoncier.sn';

-- 2. Créer le nouveau compte (laisser les triggers faire le reste)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@terangafoncier.sn',
    crypt('AdminPassword123!', gen_salt('bf')),
    NOW(),
    '{"role": "admin", "user_type": "admin", "full_name": "Administrateur Système"}',
    NOW(),
    NOW()
);

-- 3. Mettre à jour le profil avec seulement les colonnes qui existent probablement
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@terangafoncier.sn';

-- 4. Vérification
SELECT 
    'SUCCESS' as status,
    email,
    raw_user_meta_data->>'role' as role_metadata
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';