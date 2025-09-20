-- ATTRIBUER LE RÔLE ADMIN À UN UTILISATEUR EXISTANT
-- Ce script met à jour un utilisateur pour lui donner les privilèges administrateur

-- MÉTHODE 1: Si vous connaissez l'email de l'utilisateur
-- Remplacez 'admin@terangafoncier.sn' par l'email du compte que vous venez de créer

DO $$
DECLARE
    user_email TEXT := 'admin@terangafoncier.sn'; -- ⚠️ MODIFIEZ CET EMAIL
    user_uuid UUID;
BEGIN
    -- Récupérer l'UUID de l'utilisateur
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE '❌ Utilisateur non trouvé avec email: %', user_email;
        RETURN;
    END IF;
    
    RAISE NOTICE '🔍 Utilisateur trouvé: % (ID: %)', user_email, user_uuid;
    
    -- Mettre à jour les métadonnées dans auth.users
    UPDATE auth.users 
    SET 
        raw_user_meta_data = jsonb_build_object(
            'role', 'Admin',
            'user_type', 'Admin',
            'full_name', 'Administrateur Système'
        ),
        is_super_admin = true,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RAISE NOTICE '✅ Métadonnées auth.users mises à jour';
    
    -- Créer ou mettre à jour le profil dans public.profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        phone,
        created_at,
        updated_at,
        is_active
    ) VALUES (
        user_uuid,
        user_email,
        'Administrateur Système',
        'Admin',
        '+221 77 000 0001',
        NOW(),
        NOW(),
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'Admin',
        full_name = 'Administrateur Système',
        phone = '+221 77 000 0001',
        updated_at = NOW(),
        is_active = true;
    
    RAISE NOTICE '✅ Profil admin créé/mis à jour dans public.profiles';
    
    RAISE NOTICE '🎉 Utilisateur % est maintenant ADMINISTRATEUR!', user_email;
    
END $$;

-- MÉTHODE 2: Mise à jour manuelle si vous préférez
-- Décommentez et modifiez les lignes ci-dessous avec les bonnes valeurs

/*
-- Mise à jour directe des métadonnées (remplacez l'UUID)
UPDATE auth.users 
SET 
    raw_user_meta_data = '{"role":"Admin","user_type":"Admin","full_name":"Administrateur Système"}',
    is_super_admin = true,
    updated_at = NOW()
WHERE email = 'admin@terangafoncier.sn'; -- Remplacez par le bon email

-- Créer le profil admin (remplacez l'email)
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    phone,
    created_at,
    updated_at,
    is_active
) 
SELECT 
    id,
    'admin@terangafoncier.sn', -- Remplacez par le bon email
    'Administrateur Système',
    'Admin',
    '+221 77 000 0001',
    NOW(),
    NOW(),
    true
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn' -- Remplacez par le bon email
ON CONFLICT (id) DO UPDATE SET
    role = 'Admin',
    full_name = 'Administrateur Système',
    updated_at = NOW();
*/

-- VÉRIFICATION: Afficher l'utilisateur admin créé
SELECT 
    '=== VÉRIFICATION ADMIN ===' as info,
    u.email,
    u.raw_user_meta_data->>'role' as role_metadata,
    u.is_super_admin,
    p.role as profile_role,
    p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_user_meta_data->>'role' = 'Admin' 
   OR p.role = 'Admin';

-- INSTRUCTIONS:
-- 1. Modifiez la variable 'user_email' avec l'email du compte que vous avez créé
-- 2. Exécutez le script
-- 3. Vérifiez que le message "🎉 Utilisateur XXX est maintenant ADMINISTRATEUR!" s'affiche
-- 4. Testez la connexion avec ce compte