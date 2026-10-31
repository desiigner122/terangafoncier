-- TEST SIMPLE DE CRÉATION D'UN SEUL COMPTE
-- Ce script teste la création d'un compte unique pour identifier les erreurs

-- Test 1: Créer un seul utilisateur admin
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    temp_password TEXT := 'TempPass2024!';
BEGIN
    RAISE NOTICE '🧪 Test création compte admin...';
    
    -- Tester auth.users
    BEGIN
        INSERT INTO auth.users (
            id,
            instance_id,
            email, 
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            "role",
            aud
        ) VALUES (
            test_user_id,
            '00000000-0000-0000-0000-000000000000',
            'test.admin@terangafoncier.sn',
            crypt(temp_password, gen_salt('bf')),
            NOW(),
            NOW(), 
            NOW(),
            encode(gen_random_bytes(32), 'hex'),
            '{"provider":"email","providers":["email"]}',
            '{"role":"Admin","full_name":"Test Admin"}',
            true,
            'authenticated',
            'authenticated'
        );
        RAISE NOTICE '✅ Utilisateur auth.users créé avec succès';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur auth.users: %', SQLERRM;
    END;
    
    -- Tester public.profiles  
    BEGIN
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
            test_user_id,
            'test.admin@terangafoncier.sn',
            'Test Admin',
            'Admin',
            '+221 77 000 9999',
            NOW(),
            NOW(),
            true
        );
        RAISE NOTICE '✅ Profil public.profiles créé avec succès';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur profiles: %', SQLERRM;
    END;
    
    -- Tester auth.identities
    BEGIN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            test_user_id,
            jsonb_build_object('sub', test_user_id::text, 'email', 'test.admin@terangafoncier.sn'),
            'email',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Identité auth.identities créée avec succès';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur identities: %', SQLERRM;
    END;
    
    RAISE NOTICE '🎯 Test terminé - Vérifiez les messages ci-dessus';
END $$;

-- Vérifier le résultat
SELECT 
    '=== RÉSULTAT TEST ===' as info,
    (SELECT COUNT(*) FROM auth.users WHERE email = 'test.admin@terangafoncier.sn') as users_count,
    (SELECT COUNT(*) FROM public.profiles WHERE email = 'test.admin@terangafoncier.sn') as profiles_count,
    (SELECT COUNT(*) FROM auth.identities WHERE identity_data->>'email' = 'test.admin@terangafoncier.sn') as identities_count;

-- Afficher les détails si créé
SELECT 
    'DÉTAILS' as section,
    u.email as user_email,
    p.email as profile_email,
    u.encrypted_password IS NOT NULL as has_password,
    p.is_active as profile_active
FROM auth.users u
FULL OUTER JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test.admin@terangafoncier.sn' OR p.email = 'test.admin@terangafoncier.sn';