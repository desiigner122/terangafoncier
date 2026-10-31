-- ======================================================================
-- CRÉATION COMPLÈTE DES COMPTES POUR TOUS LES RÔLES
-- Script mis à jour avec les 9 rôles de la plateforme (Admin exclu)
-- ======================================================================

DO $$
DECLARE
    user_record RECORD;
    new_user_id UUID;
    profile_exists BOOLEAN;
    role_column_exists BOOLEAN;
BEGIN
    RAISE NOTICE '🚀 === CRÉATION COMPLÈTE DES COMPTES MULTI-RÔLES ===';
    RAISE NOTICE '📋 Rôles inclus: Particulier, Vendeur, Promoteur, Banque, Notaire, Agent Foncier, Mairie, Investisseur, Géomètre';
    
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
        '{"role": "particulier", "full_name": "Amadou Diop", "phone": "+221 77 123 45 67", "location": "Dakar", "budget": "50M-100M"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'amadou.diop@email.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, location)
        VALUES (new_user_id, 'amadou.diop@email.com', 'particulier', 'Amadou Diop', '+221 77 123 45 67', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'particulier', full_name = 'Amadou Diop', phone = '+221 77 123 45 67', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, location)
        VALUES (new_user_id, 'amadou.diop@email.com', 'Amadou Diop', '+221 77 123 45 67', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Amadou Diop', phone = '+221 77 123 45 67', location = 'Dakar';
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
        '{"role": "particulier", "full_name": "Fatou Sall", "phone": "+221 77 234 56 78", "location": "Thiès", "budget": "30M-70M"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'fatou.sall@email.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, location)
        VALUES (new_user_id, 'fatou.sall@email.com', 'particulier', 'Fatou Sall', '+221 77 234 56 78', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'particulier', full_name = 'Fatou Sall', phone = '+221 77 234 56 78', location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, location)
        VALUES (new_user_id, 'fatou.sall@email.com', 'Fatou Sall', '+221 77 234 56 78', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Fatou Sall', phone = '+221 77 234 56 78', location = 'Thiès';
    END IF;
    
    -- ===============================
    -- 2. COMPTES VENDEURS
    -- ===============================
    RAISE NOTICE '🏠 Création des comptes VENDEURS...';
    
    -- Vendeur 1: Ibrahima Ba (Ba Immobilier)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'ibrahima.ba@terangafoncier.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "vendeur", "full_name": "Ibrahima Ba", "phone": "+221 77 345 67 89", "company": "Ba Immobilier", "location": "Dakar", "license": "AG-2020-DKR-045"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'ibrahima.ba@terangafoncier.sn', 'vendeur', 'Ibrahima Ba', '+221 77 345 67 89', 'Ba Immobilier', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'vendeur', full_name = 'Ibrahima Ba', phone = '+221 77 345 67 89', company = 'Ba Immobilier', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'ibrahima.ba@terangafoncier.sn', 'Ibrahima Ba', '+221 77 345 67 89', 'Ba Immobilier', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Ibrahima Ba', phone = '+221 77 345 67 89', company = 'Ba Immobilier', location = 'Dakar';
    END IF;
    
    -- Vendeur 2: Mariama Sy (Sy Properties)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'mariama.sy@terangafoncier.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "vendeur", "full_name": "Mariama Sy", "phone": "+221 77 456 78 90", "company": "Sy Properties", "location": "Saint-Louis", "license": "AG-2019-STL-023"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'mariama.sy@terangafoncier.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'mariama.sy@terangafoncier.sn', 'vendeur', 'Mariama Sy', '+221 77 456 78 90', 'Sy Properties', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'vendeur', full_name = 'Mariama Sy', phone = '+221 77 456 78 90', company = 'Sy Properties', location = 'Saint-Louis';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'mariama.sy@terangafoncier.sn', 'Mariama Sy', '+221 77 456 78 90', 'Sy Properties', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Mariama Sy', phone = '+221 77 456 78 90', company = 'Sy Properties', location = 'Saint-Louis';
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
        '{"role": "promoteur", "full_name": "Cheikh Tall", "phone": "+221 77 567 89 01", "company": "Groupe Tall", "location": "Dakar", "projects_count": 15}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'cheikh.tall@groupetall.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'cheikh.tall@groupetall.sn', 'promoteur', 'Cheikh Tall', '+221 77 567 89 01', 'Groupe Tall', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'promoteur', full_name = 'Cheikh Tall', phone = '+221 77 567 89 01', company = 'Groupe Tall', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'cheikh.tall@groupetall.sn', 'Cheikh Tall', '+221 77 567 89 01', 'Groupe Tall', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Cheikh Tall', phone = '+221 77 567 89 01', company = 'Groupe Tall', location = 'Dakar';
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
        '{"role": "promoteur", "full_name": "Aissatou Ndiaye", "phone": "+221 77 678 90 12", "company": "Ndiaye Construction", "location": "Mbour", "projects_count": 8}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'aissatou.ndiaye@ndiayeconstruct.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'aissatou.ndiaye@ndiayeconstruct.sn', 'promoteur', 'Aissatou Ndiaye', '+221 77 678 90 12', 'Ndiaye Construction', 'Mbour')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'promoteur', full_name = 'Aissatou Ndiaye', phone = '+221 77 678 90 12', company = 'Ndiaye Construction', location = 'Mbour';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'aissatou.ndiaye@ndiayeconstruct.sn', 'Aissatou Ndiaye', '+221 77 678 90 12', 'Ndiaye Construction', 'Mbour')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Aissatou Ndiaye', phone = '+221 77 678 90 12', company = 'Ndiaye Construction', location = 'Mbour';
    END IF;
    
    -- ===============================
    -- 4. COMPTES BANQUES
    -- ===============================
    RAISE NOTICE '🏦 Création des comptes BANQUES...';
    
    -- Banque 1: CBAO
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
            role = 'banque', full_name = 'Moussa Diallo', phone = '+221 33 839 92 00', company = 'CBAO', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'credit.immobilier@cbao.sn', 'Moussa Diallo', '+221 33 839 92 00', 'CBAO', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Moussa Diallo', phone = '+221 33 839 92 00', company = 'CBAO', location = 'Dakar';
    END IF;
    
    -- Banque 2: Ecobank
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
            role = 'banque', full_name = 'Khady Fall', phone = '+221 33 869 74 00', company = 'Ecobank', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'habitat@ecobank.sn', 'Khady Fall', '+221 33 869 74 00', 'Ecobank', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Khady Fall', phone = '+221 33 869 74 00', company = 'Ecobank', location = 'Dakar';
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
            role = 'notaire', full_name = 'Me Pape Seck', phone = '+221 33 821 45 67', company = 'Étude Me Seck', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'pape.seck@notaire.sn', 'Me Pape Seck', '+221 33 821 45 67', 'Étude Me Seck', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Me Pape Seck', phone = '+221 33 821 45 67', company = 'Étude Me Seck', location = 'Dakar';
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
            role = 'notaire', full_name = 'Me Aminata Touré', phone = '+221 33 876 54 32', company = 'Étude Me Touré', location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'aminata.toure@notaire.sn', 'Me Aminata Touré', '+221 33 876 54 32', 'Étude Me Touré', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Me Aminata Touré', phone = '+221 33 876 54 32', company = 'Étude Me Touré', location = 'Thiès';
    END IF;
    
    -- ===============================
    -- 6. COMPTES AGENTS FONCIERS
    -- ===============================
    RAISE NOTICE '🌍 Création des comptes AGENTS FONCIERS...';
    
    -- Agent Foncier 1: Oumar Kane
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
            role = 'agent_foncier', full_name = 'Oumar Kane', phone = '+221 77 111 22 33', company = 'Direction des Domaines', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'oumar.kane@domaines.gouv.sn', 'Oumar Kane', '+221 77 111 22 33', 'Direction des Domaines', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Oumar Kane', phone = '+221 77 111 22 33', company = 'Direction des Domaines', location = 'Dakar';
    END IF;
    
    -- Agent Foncier 2: Bineta Niang
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
            role = 'agent_foncier', full_name = 'Bineta Niang', phone = '+221 77 222 33 44', company = 'Direction des Domaines', location = 'Saint-Louis';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'bineta.niang@domaines.gouv.sn', 'Bineta Niang', '+221 77 222 33 44', 'Direction des Domaines', 'Saint-Louis')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Bineta Niang', phone = '+221 77 222 33 44', company = 'Direction des Domaines', location = 'Saint-Louis';
    END IF;
    
    -- ===============================
    -- 7. COMPTES MAIRIES
    -- ===============================
    RAISE NOTICE '🏛️ Création des comptes MAIRIES...';
    
    -- Mairie 1: Ville de Dakar
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'urbanisme@mairie-dakar.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "mairie", "full_name": "Seydou Guèye", "phone": "+221 33 823 05 05", "company": "Mairie de Dakar", "location": "Dakar", "department": "Service Urbanisme", "mayor": "Barthélémy Dias"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'urbanisme@mairie-dakar.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'urbanisme@mairie-dakar.sn', 'mairie', 'Seydou Guèye', '+221 33 823 05 05', 'Mairie de Dakar', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'mairie', full_name = 'Seydou Guèye', phone = '+221 33 823 05 05', company = 'Mairie de Dakar', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'urbanisme@mairie-dakar.sn', 'Seydou Guèye', '+221 33 823 05 05', 'Mairie de Dakar', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Seydou Guèye', phone = '+221 33 823 05 05', company = 'Mairie de Dakar', location = 'Dakar';
    END IF;
    
    -- Mairie 2: Commune de Thiès
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'technique@commune-thies.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "mairie", "full_name": "Awa Gueye", "phone": "+221 33 951 10 12", "company": "Commune de Thiès", "location": "Thiès", "department": "Service Technique", "mayor": "Talla Sylla"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'technique@commune-thies.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'technique@commune-thies.sn', 'mairie', 'Awa Gueye', '+221 33 951 10 12', 'Commune de Thiès', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'mairie', full_name = 'Awa Gueye', phone = '+221 33 951 10 12', company = 'Commune de Thiès', location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'technique@commune-thies.sn', 'Awa Gueye', '+221 33 951 10 12', 'Commune de Thiès', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Awa Gueye', phone = '+221 33 951 10 12', company = 'Commune de Thiès', location = 'Thiès';
    END IF;
    
    -- ===============================
    -- 8. COMPTES INVESTISSEURS
    -- ===============================
    RAISE NOTICE '💰 Création des comptes INVESTISSEURS...';
    
    -- Investisseur 1: Mamadou Lamine Diagne
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'mamadou.diagne@investor.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "investisseur", "full_name": "Mamadou Lamine Diagne", "phone": "+221 77 777 88 99", "company": "Diagne Investment Group", "location": "Dakar", "portfolio": "500M FCFA", "sectors": ["Résidentiel", "Commercial"]}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'mamadou.diagne@investor.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'mamadou.diagne@investor.com', 'investisseur', 'Mamadou Lamine Diagne', '+221 77 777 88 99', 'Diagne Investment Group', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'investisseur', full_name = 'Mamadou Lamine Diagne', phone = '+221 77 777 88 99', company = 'Diagne Investment Group', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'mamadou.diagne@investor.com', 'Mamadou Lamine Diagne', '+221 77 777 88 99', 'Diagne Investment Group', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Mamadou Lamine Diagne', phone = '+221 77 777 88 99', company = 'Diagne Investment Group', location = 'Dakar';
    END IF;
    
    -- Investisseur 2: Coumba Ndoffene Diouf (Diaspora)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'coumba.diouf@diaspora-invest.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "investisseur", "full_name": "Coumba Ndoffene Diouf", "phone": "+33 6 12 34 56 78", "company": "Diaspora Real Estate", "location": "France/Sénégal", "portfolio": "800M FCFA", "sectors": ["Résidentiel", "Tourisme"]}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'coumba.diouf@diaspora-invest.com';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'coumba.diouf@diaspora-invest.com', 'investisseur', 'Coumba Ndoffene Diouf', '+33 6 12 34 56 78', 'Diaspora Real Estate', 'France/Sénégal')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'investisseur', full_name = 'Coumba Ndoffene Diouf', phone = '+33 6 12 34 56 78', company = 'Diaspora Real Estate', location = 'France/Sénégal';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'coumba.diouf@diaspora-invest.com', 'Coumba Ndoffene Diouf', '+33 6 12 34 56 78', 'Diaspora Real Estate', 'France/Sénégal')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Coumba Ndoffene Diouf', phone = '+33 6 12 34 56 78', company = 'Diaspora Real Estate', location = 'France/Sénégal';
    END IF;
    
    -- ===============================
    -- 9. COMPTES GÉOMÈTRES
    -- ===============================
    RAISE NOTICE '📐 Création des comptes GÉOMÈTRES...';
    
    -- Géomètre 1: Alioune Badara Cissé
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'alioune.cisse@geometre.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "geometre", "full_name": "Alioune Badara Cissé", "phone": "+221 77 555 66 77", "company": "Cabinet Cissé Topographie", "location": "Dakar", "license": "GEO-2017-DKR-012", "speciality": "Topographie Foncière"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'alioune.cisse@geometre.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'alioune.cisse@geometre.sn', 'geometre', 'Alioune Badara Cissé', '+221 77 555 66 77', 'Cabinet Cissé Topographie', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'geometre', full_name = 'Alioune Badara Cissé', phone = '+221 77 555 66 77', company = 'Cabinet Cissé Topographie', location = 'Dakar';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'alioune.cisse@geometre.sn', 'Alioune Badara Cissé', '+221 77 555 66 77', 'Cabinet Cissé Topographie', 'Dakar')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Alioune Badara Cissé', phone = '+221 77 555 66 77', company = 'Cabinet Cissé Topographie', location = 'Dakar';
    END IF;
    
    -- Géomètre 2: Ndèye Fatou Mbaye
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
        gen_random_uuid(),
        'fatou.mbaye@geodesie.sn',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"role": "geometre", "full_name": "Ndèye Fatou Mbaye", "phone": "+221 77 888 99 00", "company": "Mbaye Géodésie", "location": "Thiès", "license": "GEO-2019-THS-008", "speciality": "Géodésie et Cadastre"}'::jsonb
    )
    ON CONFLICT (email) DO NOTHING;
    
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'fatou.mbaye@geodesie.sn';
    
    IF role_column_exists THEN
        INSERT INTO public.profiles (id, email, role, full_name, phone, company, location)
        VALUES (new_user_id, 'fatou.mbaye@geodesie.sn', 'geometre', 'Ndèye Fatou Mbaye', '+221 77 888 99 00', 'Mbaye Géodésie', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'geometre', full_name = 'Ndèye Fatou Mbaye', phone = '+221 77 888 99 00', company = 'Mbaye Géodésie', location = 'Thiès';
    ELSE
        INSERT INTO public.profiles (id, email, full_name, phone, company, location)
        VALUES (new_user_id, 'fatou.mbaye@geodesie.sn', 'Ndèye Fatou Mbaye', '+221 77 888 99 00', 'Mbaye Géodésie', 'Thiès')
        ON CONFLICT (id) DO UPDATE SET 
            full_name = 'Ndèye Fatou Mbaye', phone = '+221 77 888 99 00', company = 'Mbaye Géodésie', location = 'Thiès';
    END IF;
    
    RAISE NOTICE '✅ === TOUS LES COMPTES ONT ÉTÉ CRÉÉS AVEC SUCCÈS ===';
    RAISE NOTICE '📊 Total: 18 comptes créés pour 9 rôles différents';
    
END $$;

-- ======================================================================
-- VÉRIFICATION COMPLÈTE DE TOUS LES COMPTES CRÉÉS
-- ======================================================================

SELECT '=== RÉCAPITULATIF COMPLET DES COMPTES CRÉÉS ===' as status;

-- Compter par rôle (tous les 9 rôles)
SELECT 
    COALESCE(u.raw_user_meta_data->>'role', 'ROLE NON DÉFINI') as role,
    COUNT(*) as nombre_comptes,
    string_agg(u.email, ', ' ORDER BY u.email) as emails
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' IN ('particulier', 'vendeur', 'promoteur', 'banque', 'notaire', 'agent_foncier', 'mairie', 'investisseur', 'geometre')
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY 
    CASE u.raw_user_meta_data->>'role'
        WHEN 'particulier' THEN 1
        WHEN 'vendeur' THEN 2
        WHEN 'promoteur' THEN 3
        WHEN 'banque' THEN 4
        WHEN 'notaire' THEN 5
        WHEN 'agent_foncier' THEN 6
        WHEN 'mairie' THEN 7
        WHEN 'investisseur' THEN 8
        WHEN 'geometre' THEN 9
    END;

-- ======================================================================
-- INFORMATIONS DE CONNEXION COMPLÈTES
-- ======================================================================

SELECT '=== GUIDE COMPLET DES IDENTIFIANTS ===' as status;

SELECT 'TOUS LES MOTS DE PASSE: password123' as information;
    
SELECT 
    '=== COMPTES PAR CATÉGORIE ===' as category,
    'PARTICULIERS:' as details
UNION ALL SELECT '', 'amadou.diop@email.com (Dakar)'
UNION ALL SELECT '', 'fatou.sall@email.com (Thiès)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'VENDEURS:'
UNION ALL SELECT '', 'ibrahima.ba@terangafoncier.sn (Ba Immobilier)'
UNION ALL SELECT '', 'mariama.sy@terangafoncier.sn (Sy Properties)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'PROMOTEURS:'
UNION ALL SELECT '', 'cheikh.tall@groupetall.sn (Groupe Tall)'
UNION ALL SELECT '', 'aissatou.ndiaye@ndiayeconstruct.sn (Ndiaye Construction)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'BANQUES:'
UNION ALL SELECT '', 'credit.immobilier@cbao.sn (CBAO)'
UNION ALL SELECT '', 'habitat@ecobank.sn (Ecobank)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'NOTAIRES:'
UNION ALL SELECT '', 'pape.seck@notaire.sn (Étude Me Seck)'
UNION ALL SELECT '', 'aminata.toure@notaire.sn (Étude Me Touré)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'AGENTS FONCIERS:'
UNION ALL SELECT '', 'oumar.kane@domaines.gouv.sn (Dakar-Plateau)'
UNION ALL SELECT '', 'bineta.niang@domaines.gouv.sn (Saint-Louis-Nord)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'MAIRIES:'
UNION ALL SELECT '', 'urbanisme@mairie-dakar.sn (Mairie de Dakar)'
UNION ALL SELECT '', 'technique@commune-thies.sn (Commune de Thiès)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'INVESTISSEURS:'
UNION ALL SELECT '', 'mamadou.diagne@investor.com (Diagne Investment Group)'
UNION ALL SELECT '', 'coumba.diouf@diaspora-invest.com (Diaspora Real Estate)'
UNION ALL SELECT '', ''
UNION ALL SELECT '', 'GÉOMÈTRES:'
UNION ALL SELECT '', 'alioune.cisse@geometre.sn (Cabinet Cissé Topographie)'
UNION ALL SELECT '', 'fatou.mbaye@geodesie.sn (Mbaye Géodésie)';

SELECT '✨ === 18 COMPTES CRÉÉS POUR 9 RÔLES DIFFÉRENTS ===' as final_status;