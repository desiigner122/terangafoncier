-- ======================================================================
-- CRÉATION DES COMPTES DE TEST POUR TOUS LES RÔLES
-- Script complet pour générer les utilisateurs de démonstration
-- ======================================================================

DO $$
DECLARE
    user_record RECORD;
    new_user_id UUID;
    profile_exists BOOLEAN;
    role_column_exists BOOLEAN;
BEGIN
    RAISE NOTICE '🚀 === DÉBUT DE CRÉATION DES COMPTES MULTI-RÔLES ===';
    
    -- Vérifier si la colonne role existe dans profiles
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) INTO role_column_exists;
    
    RAISE NOTICE 'Colonne role existe dans profiles: %', role_column_exists;
    
    -- ===============================
    -- 1. COMPTES PARTICULIERS
    -- ===============================
    RAISE NOTICE '👤 Création des comptes PARTICULIERS...';
    
    -- Particulier 1: Amadou Diop (Dakar)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'amadou.diop@email.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "particulier", "full_name": "Amadou Diop", "phone": "+221 77 123 45 67", "location": "Dakar"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    -- Récupérer l'ID pour le profil
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'amadou.diop@email.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, location)
        VALUES (new_user_id, 'amadou.diop@email.com', 'particulier', 'Amadou Diop', '+221 77 123 45 67', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'particulier', 
            full_name = 'Amadou Diop',
            phone = '+221 77 123 45 67',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, location)
        VALUES (new_user_id, 'amadou.diop@email.com', 'Amadou Diop', '+221 77 123 45 67', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Amadou Diop',
            phone = '+221 77 123 45 67',
            location = 'Dakar';
    END IF;
    
    -- Particulier 2: Fatou Sall (Thiès)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'fatou.sall@email.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "particulier", "full_name": "Fatou Sall", "phone": "+221 77 234 56 78", "location": "Thiès"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'fatou.sall@email.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, location)
        VALUES (new_user_id, 'fatou.sall@email.com', 'particulier', 'Fatou Sall', '+221 77 234 56 78', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'particulier', 
            full_name = 'Fatou Sall',
            phone = '+221 77 234 56 78',
            location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, location)
        VALUES (new_user_id, 'fatou.sall@email.com', 'Fatou Sall', '+221 77 234 56 78', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Fatou Sall',
            phone = '+221 77 234 56 78',
            location = 'Thiès';
    END IF;
    
    -- ===============================
    -- 2. COMPTES VENDEURS
    -- ===============================
    RAISE NOTICE '🏠 Création des comptes VENDEURS...';
    
    -- Vendeur 1: Ibrahima Ba (Agent immobilier)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'ibrahima.ba@terangafoncier.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "vendeur", "full_name": "Ibrahima Ba", "phone": "+221 77 345 67 89", "company": "Ba Immobilier", "location": "Dakar"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'ibrahima.ba@terangafoncier.sn', 'vendeur', 'Ibrahima Ba', '+221 77 345 67 89', 'Ba Immobilier', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'vendeur', 
            full_name = 'Ibrahima Ba',
            phone = '+221 77 345 67 89',
            company = 'Ba Immobilier',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'ibrahima.ba@terangafoncier.sn', 'Ibrahima Ba', '+221 77 345 67 89', 'Ba Immobilier', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Ibrahima Ba',
            phone = '+221 77 345 67 89',
            company = 'Ba Immobilier',
            location = 'Dakar';
    END IF;
    
    -- Vendeur 2: Mariama Sy (Agence immobilière)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'mariama.sy@terangafoncier.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "vendeur", "full_name": "Mariama Sy", "phone": "+221 77 456 78 90", "company": "Sy Properties", "location": "Saint-Louis"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'mariama.sy@terangafoncier.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'mariama.sy@terangafoncier.sn', 'vendeur', 'Mariama Sy', '+221 77 456 78 90', 'Sy Properties', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'vendeur', 
            full_name = 'Mariama Sy',
            phone = '+221 77 456 78 90',
            company = 'Sy Properties',
            location = 'Saint-Louis';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'mariama.sy@terangafoncier.sn', 'Mariama Sy', '+221 77 456 78 90', 'Sy Properties', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Mariama Sy',
            phone = '+221 77 456 78 90',
            company = 'Sy Properties',
            location = 'Saint-Louis';
    END IF;
    
    -- ===============================
    -- 3. COMPTES PROMOTEURS
    -- ===============================
    RAISE NOTICE '🏗️ Création des comptes PROMOTEURS...';
    
    -- Promoteur 1: Cheikh Tall (Groupe Tall)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'cheikh.tall@groupetall.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "promoteur", "full_name": "Cheikh Tall", "phone": "+221 77 567 89 01", "company": "Groupe Tall", "location": "Dakar", "projects": 15}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'cheikh.tall@groupetall.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'cheikh.tall@groupetall.sn', 'promoteur', 'Cheikh Tall', '+221 77 567 89 01', 'Groupe Tall', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'promoteur', 
            full_name = 'Cheikh Tall',
            phone = '+221 77 567 89 01',
            company = 'Groupe Tall',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'cheikh.tall@groupetall.sn', 'Cheikh Tall', '+221 77 567 89 01', 'Groupe Tall', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Cheikh Tall',
            phone = '+221 77 567 89 01',
            company = 'Groupe Tall',
            location = 'Dakar';
    END IF;
    
    -- Promoteur 2: Aissatou Ndiaye (Ndiaye Construction)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'aissatou.ndiaye@ndiayeconstruct.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "promoteur", "full_name": "Aissatou Ndiaye", "phone": "+221 77 678 90 12", "company": "Ndiaye Construction", "location": "Mbour", "projects": 8}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'aissatou.ndiaye@ndiayeconstruct.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'aissatou.ndiaye@ndiayeconstruct.sn', 'promoteur', 'Aissatou Ndiaye', '+221 77 678 90 12', 'Ndiaye Construction', 'Mbour')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'promoteur', 
            full_name = 'Aissatou Ndiaye',
            phone = '+221 77 678 90 12',
            company = 'Ndiaye Construction',
            location = 'Mbour';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'aissatou.ndiaye@ndiayeconstruct.sn', 'Aissatou Ndiaye', '+221 77 678 90 12', 'Ndiaye Construction', 'Mbour')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Aissatou Ndiaye',
            phone = '+221 77 678 90 12',
            company = 'Ndiaye Construction',
            location = 'Mbour';
    END IF;
    
    -- ===============================
    -- 4. COMPTES BANQUES
    -- ===============================
    RAISE NOTICE '🏦 Création des comptes BANQUES...';
    
    -- Banque 1: CBAO (Commercial Bank of Africa)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'credit.immobilier@cbao.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "banque", "full_name": "Moussa Diallo", "phone": "+221 33 839 92 00", "company": "CBAO", "location": "Dakar", "department": "Crédit Immobilier"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'credit.immobilier@cbao.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'credit.immobilier@cbao.sn', 'banque', 'Moussa Diallo', '+221 33 839 92 00', 'CBAO', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'banque', 
            full_name = 'Moussa Diallo',
            phone = '+221 33 839 92 00',
            company = 'CBAO',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'credit.immobilier@cbao.sn', 'Moussa Diallo', '+221 33 839 92 00', 'CBAO', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Moussa Diallo',
            phone = '+221 33 839 92 00',
            company = 'CBAO',
            location = 'Dakar';
    END IF;
    
    -- Banque 2: Ecobank Sénégal
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'habitat@ecobank.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "banque", "full_name": "Khady Fall", "phone": "+221 33 869 74 00", "company": "Ecobank", "location": "Dakar", "department": "Crédit Habitat"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'habitat@ecobank.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'habitat@ecobank.sn', 'banque', 'Khady Fall', '+221 33 869 74 00', 'Ecobank', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'banque', 
            full_name = 'Khady Fall',
            phone = '+221 33 869 74 00',
            company = 'Ecobank',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'habitat@ecobank.sn', 'Khady Fall', '+221 33 869 74 00', 'Ecobank', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Khady Fall',
            phone = '+221 33 869 74 00',
            company = 'Ecobank',
            location = 'Dakar';
    END IF;
    
    -- ===============================
    -- 5. COMPTES NOTAIRES
    -- ===============================
    RAISE NOTICE '⚖️ Création des comptes NOTAIRES...';
    
    -- Notaire 1: Me Pape Seck
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'pape.seck@notaire.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "notaire", "full_name": "Me Pape Seck", "phone": "+221 33 821 45 67", "company": "Étude Me Seck", "location": "Dakar", "license": "NOT-2015-001"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'pape.seck@notaire.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'pape.seck@notaire.sn', 'notaire', 'Me Pape Seck', '+221 33 821 45 67', 'Étude Me Seck', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'notaire', 
            full_name = 'Me Pape Seck',
            phone = '+221 33 821 45 67',
            company = 'Étude Me Seck',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'pape.seck@notaire.sn', 'Me Pape Seck', '+221 33 821 45 67', 'Étude Me Seck', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Me Pape Seck',
            phone = '+221 33 821 45 67',
            company = 'Étude Me Seck',
            location = 'Dakar';
    END IF;
    
    -- Notaire 2: Me Aminata Touré
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'aminata.toure@notaire.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "notaire", "full_name": "Me Aminata Touré", "phone": "+221 33 876 54 32", "company": "Étude Me Touré", "location": "Thiès", "license": "NOT-2018-008"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'aminata.toure@notaire.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'aminata.toure@notaire.sn', 'notaire', 'Me Aminata Touré', '+221 33 876 54 32', 'Étude Me Touré', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'notaire', 
            full_name = 'Me Aminata Touré',
            phone = '+221 33 876 54 32',
            company = 'Étude Me Touré',
            location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'aminata.toure@notaire.sn', 'Me Aminata Touré', '+221 33 876 54 32', 'Étude Me Touré', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Me Aminata Touré',
            phone = '+221 33 876 54 32',
            company = 'Étude Me Touré',
            location = 'Thiès';
    END IF;
    
    -- ===============================
    -- 6. COMPTES AGENTS FONCIERS
    -- ===============================
    RAISE NOTICE '🌍 Création des comptes AGENTS FONCIERS...';
    
    -- Agent Foncier 1: Oumar Kane (Zone Dakar)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'oumar.kane@domaines.gouv.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "agent_foncier", "full_name": "Oumar Kane", "phone": "+221 77 111 22 33", "company": "Direction des Domaines", "location": "Dakar", "zone": "Dakar-Plateau", "certification": "AF-2020-DKR-001"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'oumar.kane@domaines.gouv.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'oumar.kane@domaines.gouv.sn', 'agent_foncier', 'Oumar Kane', '+221 77 111 22 33', 'Direction des Domaines', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'agent_foncier', 
            full_name = 'Oumar Kane',
            phone = '+221 77 111 22 33',
            company = 'Direction des Domaines',
            location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'oumar.kane@domaines.gouv.sn', 'Oumar Kane', '+221 77 111 22 33', 'Direction des Domaines', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Oumar Kane',
            phone = '+221 77 111 22 33',
            company = 'Direction des Domaines',
            location = 'Dakar';
    END IF;
    
    -- Agent Foncier 2: Bineta Niang (Zone Saint-Louis)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'bineta.niang@domaines.gouv.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "agent_foncier", "full_name": "Bineta Niang", "phone": "+221 77 222 33 44", "company": "Direction des Domaines", "location": "Saint-Louis", "zone": "Saint-Louis-Nord", "certification": "AF-2019-STL-005"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'bineta.niang@domaines.gouv.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'bineta.niang@domaines.gouv.sn', 'agent_foncier', 'Bineta Niang', '+221 77 222 33 44', 'Direction des Domaines', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'agent_foncier', 
            full_name = 'Bineta Niang',
            phone = '+221 77 222 33 44',
            company = 'Direction des Domaines',
            location = 'Saint-Louis';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'bineta.niang@domaines.gouv.sn', 'Bineta Niang', '+221 77 222 33 44', 'Direction des Domaines', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Bineta Niang',
            phone = '+221 77 222 33 44',
            company = 'Direction des Domaines',
            location = 'Saint-Louis';
    END IF;
    
    RAISE NOTICE '✅ === TOUS LES COMPTES ONT ÉTÉ CRÉÉS AVEC SUCCÈS ===';
    
END $$;

-- ======================================================================
-- VÉRIFICATION COMPLÈTE DE TOUS LES COMPTES CRÉÉS
-- ======================================================================

SELECT 
    '=== RÉCAPITULATIF DES COMPTES CRÉÉS ===' as status;

-- Compter par rôle
SELECT 
    u.raw_user_meta_data->>'role' as role,
    COUNT(*) as nombre_comptes,
    string_agg(u.email, ', ') as emails
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' IN ('particulier', 'vendeur', 'promoteur', 'banque', 'notaire', 'agent_foncier')
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY 
    CASE u.raw_user_meta_data->>'role'
        WHEN 'particulier' THEN 1
        WHEN 'vendeur' THEN 2
        WHEN 'promoteur' THEN 3
        WHEN 'banque' THEN 4
        WHEN 'notaire' THEN 5
        WHEN 'agent_foncier' THEN 6
    END;

-- Détails de tous les comptes créés
SELECT 
    '=== DÉTAILS DES COMPTES ===' as status;

SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as role_metadata,
    u.raw_user_meta_data->>'full_name' as full_name_metadata,
    u.raw_user_meta_data->>'phone' as phone,
    u.raw_user_meta_data->>'company' as company,
    u.raw_user_meta_data->>'location' as location,
    CASE 
        WHEN p.id IS NOT NULL 
        THEN '✅ PROFIL EXISTE' 
        ELSE '❌ PROFIL MANQUANT' 
    END as profile_status,
    COALESCE(p.role, 'N/A') as profile_role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.raw_user_meta_data->>'role' IN ('particulier', 'vendeur', 'promoteur', 'banque', 'notaire', 'agent_foncier')
ORDER BY 
    CASE u.raw_user_meta_data->>'role'
        WHEN 'particulier' THEN 1
        WHEN 'vendeur' THEN 2
        WHEN 'promoteur' THEN 3
        WHEN 'banque' THEN 4
        WHEN 'notaire' THEN 5
        WHEN 'agent_foncier' THEN 6
    END,
    u.email;

-- ======================================================================
-- INFORMATIONS DE CONNEXION
-- ======================================================================

SELECT 
    '=== INFORMATIONS DE CONNEXION ===' as status;

SELECT 
    'TOUS LES MOTS DE PASSE: password123' as information;
    
SELECT 
    '=== COMPTES DE TEST CRÉÉS ===' as category,
    'Email: amadou.diop@email.com | Rôle: Particulier | Location: Dakar' as compte
UNION ALL
SELECT '', 'Email: fatou.sall@email.com | Rôle: Particulier | Location: Thiès'
UNION ALL
SELECT '', 'Email: ibrahima.ba@terangafoncier.sn | Rôle: Vendeur | Company: Ba Immobilier'
UNION ALL
SELECT '', 'Email: mariama.sy@terangafoncier.sn | Rôle: Vendeur | Company: Sy Properties'
UNION ALL
SELECT '', 'Email: cheikh.tall@groupetall.sn | Rôle: Promoteur | Company: Groupe Tall'
UNION ALL
SELECT '', 'Email: aissatou.ndiaye@ndiayeconstruct.sn | Rôle: Promoteur | Company: Ndiaye Construction'
UNION ALL
SELECT '', 'Email: credit.immobilier@cbao.sn | Rôle: Banque | Company: CBAO'
UNION ALL
SELECT '', 'Email: habitat@ecobank.sn | Rôle: Banque | Company: Ecobank'
UNION ALL
SELECT '', 'Email: pape.seck@notaire.sn | Rôle: Notaire | Company: Étude Me Seck'
UNION ALL
SELECT '', 'Email: aminata.toure@notaire.sn | Rôle: Notaire | Company: Étude Me Touré'
UNION ALL
SELECT '', 'Email: oumar.kane@domaines.gouv.sn | Rôle: Agent Foncier | Zone: Dakar-Plateau'
UNION ALL
SELECT '', 'Email: bineta.niang@domaines.gouv.sn | Rôle: Agent Foncier | Zone: Saint-Louis-Nord';