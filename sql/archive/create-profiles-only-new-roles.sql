-- ======================================================================
-- CRÉATION MANUELLE SIMPLIFIÉE DES COMPTES - NOUVEAUX RÔLES
-- Version corrigée pour Supabase (sans insertion directe dans auth.users)
-- ======================================================================

-- IMPORTANT: Ce script ne peut pas créer directement dans auth.users
-- Les comptes doivent être créés manuellement via l'interface Supabase
-- Ce script créé seulement les profils correspondants

DO $$
DECLARE
    user_id UUID;
    profile_exists BOOLEAN;
    role_column_exists BOOLEAN;
BEGIN
    RAISE NOTICE '🚀 === CRÉATION DES PROFILS POUR LES NOUVEAUX RÔLES ===';
    RAISE NOTICE '⚠️  PRÉREQUIS: Les comptes utilisateurs doivent être créés manuellement dans Supabase Auth';
    
    -- Vérifier si la colonne role existe dans profiles
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) INTO role_column_exists;
    
    RAISE NOTICE 'Colonne role existe dans profiles: %', role_column_exists;
    
    -- ===============================
    -- PROFILS MAIRIES
    -- ===============================
    RAISE NOTICE '🏛️ Création des profils MAIRIES...';
    
    -- Profil Mairie de Dakar
    SELECT id INTO user_id FROM auth.users WHERE email = 'mairie.dakar@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'mairie.dakar@teranga-foncier.sn',
                'Mairie de Dakar',
                '+221 33 823 55 00',
                'Dakar',
                'mairie',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'mairie',
                email = 'mairie.dakar@teranga-foncier.sn',
                full_name = 'Mairie de Dakar', 
                phone = '+221 33 823 55 00', 
                city = 'Dakar',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'mairie.dakar@teranga-foncier.sn',
                'Mairie de Dakar',
                '+221 33 823 55 00',
                'Dakar',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'mairie.dakar@teranga-foncier.sn',
                full_name = 'Mairie de Dakar', 
                phone = '+221 33 823 55 00', 
                city = 'Dakar',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: Mairie de Dakar';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: mairie.dakar@teranga-foncier.sn';
    END IF;
    
    -- Profil Commune de Thiès
    SELECT id INTO user_id FROM auth.users WHERE email = 'mairie.thies@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'mairie.thies@teranga-foncier.sn',
                'Mairie de Thiès',
                '+221 33 951 10 25',
                'Thiès',
                'mairie',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'mairie',
                email = 'mairie.thies@teranga-foncier.sn',
                full_name = 'Mairie de Thiès', 
                phone = '+221 33 951 10 25', 
                city = 'Thiès',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'mairie.thies@teranga-foncier.sn',
                'Mairie de Thiès',
                '+221 33 951 10 25',
                'Thiès',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'mairie.thies@teranga-foncier.sn',
                full_name = 'Mairie de Thiès', 
                phone = '+221 33 951 10 25', 
                city = 'Thiès',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: Mairie de Thiès';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: mairie.thies@teranga-foncier.sn';
    END IF;
    
    -- ===============================
    -- PROFILS INVESTISSEURS
    -- ===============================
    RAISE NOTICE '💰 Création des profils INVESTISSEURS...';
    
    -- Profil Investisseur Fonds Souverain
    SELECT id INTO user_id FROM auth.users WHERE email = 'fonds.souverain@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'fonds.souverain@teranga-foncier.sn',
                'Fonds Souverain d''Investissement du Sénégal',
                '+221 33 889 20 00',
                'Dakar',
                'investisseur',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'investisseur',
                email = 'fonds.souverain@teranga-foncier.sn',
                full_name = 'Fonds Souverain d''Investissement du Sénégal', 
                phone = '+221 33 889 20 00', 
                city = 'Dakar',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'fonds.souverain@teranga-foncier.sn',
                'Fonds Souverain d''Investissement du Sénégal',
                '+221 33 889 20 00',
                'Dakar',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'fonds.souverain@teranga-foncier.sn',
                full_name = 'Fonds Souverain d''Investissement du Sénégal', 
                phone = '+221 33 889 20 00', 
                city = 'Dakar',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: Fonds Souverain d''Investissement du Sénégal';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: fonds.souverain@teranga-foncier.sn';
    END IF;
    
    -- Profil Investisseur Atlantique Capital
    SELECT id INTO user_id FROM auth.users WHERE email = 'atlantique.capital@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'atlantique.capital@teranga-foncier.sn',
                'Atlantique Capital Partners',
                '+221 33 842 15 00',
                'Dakar',
                'investisseur',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'investisseur',
                email = 'atlantique.capital@teranga-foncier.sn',
                full_name = 'Atlantique Capital Partners', 
                phone = '+221 33 842 15 00', 
                city = 'Dakar',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'atlantique.capital@teranga-foncier.sn',
                'Atlantique Capital Partners',
                '+221 33 842 15 00',
                'Dakar',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'atlantique.capital@teranga-foncier.sn',
                full_name = 'Atlantique Capital Partners', 
                phone = '+221 33 842 15 00', 
                city = 'Dakar',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: Atlantique Capital Partners';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: atlantique.capital@teranga-foncier.sn';
    END IF;
    
    -- ===============================
    -- PROFILS GÉOMÈTRES
    -- ===============================
    RAISE NOTICE '📐 Création des profils GÉOMÈTRES...';
    
    -- Profil Cabinet Géomètre Ndiaye
    SELECT id INTO user_id FROM auth.users WHERE email = 'cabinet.ndiaye@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'cabinet.ndiaye@teranga-foncier.sn',
                'Cabinet Géomètre Ndiaye & Associés',
                '+221 77 987 65 43',
                'Dakar',
                'geometre',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'geometre',
                email = 'cabinet.ndiaye@teranga-foncier.sn',
                full_name = 'Cabinet Géomètre Ndiaye & Associés', 
                phone = '+221 77 987 65 43', 
                city = 'Dakar',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'cabinet.ndiaye@teranga-foncier.sn',
                'Cabinet Géomètre Ndiaye & Associés',
                '+221 77 987 65 43',
                'Dakar',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'cabinet.ndiaye@teranga-foncier.sn',
                full_name = 'Cabinet Géomètre Ndiaye & Associés', 
                phone = '+221 77 987 65 43', 
                city = 'Dakar',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: Cabinet Géomètre Ndiaye & Associés';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: cabinet.ndiaye@teranga-foncier.sn';
    END IF;
    
    -- Profil GeoWest Africa
    SELECT id INTO user_id FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn';
    IF user_id IS NOT NULL THEN
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, full_name, phone, city, role, created_at, updated_at)
            VALUES (
                user_id,
                'geowest.africa@teranga-foncier.sn',
                'GeoWest Africa SARL',
                '+221 78 456 12 34',
                'Dakar',
                'geometre',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET 
                role = 'geometre',
                email = 'geowest.africa@teranga-foncier.sn',
                full_name = 'GeoWest Africa SARL', 
                phone = '+221 78 456 12 34', 
                city = 'Dakar',
                updated_at = NOW();
        ELSE
            INSERT INTO public.profiles (id, email, full_name, phone, city, created_at, updated_at)
            VALUES (
                user_id,
                'geowest.africa@teranga-foncier.sn',
                'GeoWest Africa SARL',
                '+221 78 456 12 34',
                'Dakar',
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                email = 'geowest.africa@teranga-foncier.sn',
                full_name = 'GeoWest Africa SARL', 
                phone = '+221 78 456 12 34', 
                city = 'Dakar',
                updated_at = NOW();
        END IF;
        RAISE NOTICE '✅ Profil créé pour: GeoWest Africa SARL';
    ELSE
        RAISE NOTICE '❌ Compte utilisateur non trouvé pour: geowest.africa@teranga-foncier.sn';
    END IF;
    
    RAISE NOTICE '✅ === CRÉATION DES PROFILS TERMINÉE ===';
    
END $$;

-- ======================================================================
-- VÉRIFICATION DES PROFILS CRÉÉS
-- ======================================================================

SELECT '=== VÉRIFICATION DES NOUVEAUX PROFILS ===' as status;

-- Vérifier les profils créés pour les nouveaux rôles
SELECT 
    u.email,
    p.full_name,
    COALESCE(p.role, u.raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    p.city,
    p.phone,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profil créé'
        ELSE '❌ Profil manquant'
    END as status_profil
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
    'mairie.dakar@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'geowest.africa@teranga-foncier.sn'
)
ORDER BY u.email;

-- Statistiques par rôle
SELECT 
    '=== STATISTIQUES NOUVEAUX RÔLES ===' as category,
    '' as details

UNION ALL

SELECT 
    'Rôle: ' || COALESCE(p.role, u.raw_user_meta_data->>'role', 'NON DÉFINI') as category,
    'Comptes: ' || COUNT(*)::text as details
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
    'mairie.dakar@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'geowest.africa@teranga-foncier.sn'
)
GROUP BY COALESCE(p.role, u.raw_user_meta_data->>'role', 'NON DÉFINI')
ORDER BY category;

SELECT '📋 === INSTRUCTIONS IMPORTANTES ===' as instructions;
SELECT 'Les comptes utilisateurs doivent être créés manuellement dans Supabase Authentication' as note1;
SELECT 'Ce script ne fait que créer les profils correspondants dans la table profiles' as note2;
SELECT 'Utilisez le GUIDE-CREATION-MANUELLE-COMPTES.md pour créer les comptes' as note3;