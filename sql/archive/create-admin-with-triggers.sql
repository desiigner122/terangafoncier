-- CRÉATION ADMIN AVEC GESTION DES TRIGGERS
-- Ce script recrée l'admin en tenant compte des triggers automatiques

-- 1. Générer un nouvel ID pour éviter les conflits
DO $$
DECLARE
    new_admin_id UUID := gen_random_uuid();
BEGIN
    -- Créer l'utilisateur dans auth.users
    -- Le trigger handle_new_user() va automatiquement créer l'entrée dans public.profiles
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
        new_admin_id,
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
    
    -- Attendre que le trigger s'exécute puis mettre à jour le profil
    -- avec les bonnes informations admin (colonnes de base seulement)
    UPDATE public.profiles 
    SET 
        role = 'admin',
        full_name = 'Administrateur Système'
    WHERE id = new_admin_id;
    
    -- Si la table public.users existe aussi, la mettre à jour
    UPDATE public.users 
    SET 
        role = 'admin',
        full_name = 'Administrateur Système'
    WHERE id = new_admin_id;
    
    RAISE NOTICE 'Compte admin créé avec l''ID: %', new_admin_id;
END $$;

-- 2. Vérification finale
SELECT 
    'COMPTE ADMIN CRÉÉ' as status,
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.role as profile_role,
    u.email_confirmed_at,
    u.id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@terangafoncier.sn';