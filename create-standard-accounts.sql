-- CRÉATION DES COMPTES TYPES STANDARDISÉS POUR TERANGA FONCIER
-- Ce script crée tous les rôles utilisateur nécessaires avec des données cohérentes
-- À exécuter après reset-supabase-users.sql

-- Configuration des rôles et emails standardisés
DO $$
DECLARE
    -- Mots de passe temporaires (à changer après première connexion)
    temp_password TEXT := 'TempPass2024!';
    
    -- Définition des comptes types
    accounts JSONB := '[
        {
            "email": "admin@terangafoncier.sn",
            "role": "Admin",
            "user_type": "Admin",
            "full_name": "Administrateur Système",
            "phone": "+221 77 000 0001",
            "description": "Compte administrateur principal"
        },
        {
            "email": "particulier@terangafoncier.sn", 
            "role": "Particulier",
            "user_type": "Particulier",
            "full_name": "Client Particulier",
            "phone": "+221 77 000 0002",
            "description": "Compte acheteur particulier type"
        },
        {
            "email": "vendeur.particulier@terangafoncier.sn",
            "role": "Vendeur Particulier", 
            "user_type": "Vendeur Particulier",
            "full_name": "Vendeur Particulier",
            "phone": "+221 77 000 0003",
            "description": "Compte vendeur particulier"
        },
        {
            "email": "vendeur.pro@terangafoncier.sn",
            "role": "Vendeur Pro",
            "user_type": "Vendeur Pro", 
            "full_name": "Vendeur Professionnel",
            "phone": "+221 77 000 0004",
            "description": "Compte vendeur professionnel"
        },
        {
            "email": "notaire@terangafoncier.sn",
            "role": "Notaire",
            "user_type": "Notaire",
            "full_name": "Me. Exemple Notaire",
            "phone": "+221 77 000 0005", 
            "description": "Compte notaire type"
        },
        {
            "email": "agent.foncier@terangafoncier.sn",
            "role": "Agent Foncier",
            "user_type": "Agent Foncier",
            "full_name": "Agent Foncier Type",
            "phone": "+221 77 000 0006",
            "description": "Compte agent foncier"
        },
        {
            "email": "geometre@terangafoncier.sn", 
            "role": "Géomètre",
            "user_type": "Géomètre",
            "full_name": "Géomètre Expert",
            "phone": "+221 77 000 0007",
            "description": "Compte géomètre type"
        },
        {
            "email": "promoteur@terangafoncier.sn",
            "role": "Promoteur",
            "user_type": "Promoteur", 
            "full_name": "Promoteur Immobilier",
            "phone": "+221 77 000 0008",
            "description": "Compte promoteur immobilier"
        },
        {
            "email": "mairie@terangafoncier.sn",
            "role": "Mairie",
            "user_type": "Mairie",
            "full_name": "Mairie de Dakar",
            "phone": "+221 77 000 0009", 
            "description": "Compte mairie type"
        },
        {
            "email": "investisseur@terangafoncier.sn",
            "role": "Investisseur",
            "user_type": "Investisseur",
            "full_name": "Investisseur Type",
            "phone": "+221 77 000 0010",
            "description": "Compte investisseur"
        },
        {
            "email": "banque@terangafoncier.sn",
            "role": "Banque", 
            "user_type": "Banque",
            "full_name": "Banque Atlantique",
            "phone": "+221 77 000 0011",
            "description": "Compte institution bancaire"
        }
    ]';
    
    account JSONB;
    user_id UUID;
    
BEGIN
    RAISE NOTICE '🚀 Début de création des comptes types standardisés...';
    
    -- Boucle pour créer chaque compte
    FOR account IN SELECT * FROM jsonb_array_elements(accounts)
    LOOP
        BEGIN
            -- Générer un UUID pour l'utilisateur
            user_id := gen_random_uuid();
            
            -- Créer l'utilisateur dans auth.users
            INSERT INTO auth.users (
                id,
                instance_id,
                email, 
                encrypted_password,
                email_confirmed_at,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token,
                raw_app_meta_data,
                raw_user_meta_data,
                is_super_admin,
                "role",
                aud,
                confirmation_sent_at
            ) VALUES (
                user_id,
                '00000000-0000-0000-0000-000000000000',
                account->>'email',
                crypt(temp_password, gen_salt('bf')), -- Hash du mot de passe
                NOW(),
                NOW(), 
                NOW(),
                encode(gen_random_bytes(32), 'hex'),
                '',
                '',
                '',
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object(
                    'role', account->>'role',
                    'user_type', account->>'user_type', 
                    'full_name', account->>'full_name'
                ),
                CASE WHEN account->>'role' = 'Admin' THEN true ELSE false END,
                'authenticated',
                'authenticated',
                NOW()
            );
            
            -- Créer le profil correspondant dans public.profiles
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
                user_id,
                account->>'email',
                account->>'full_name',
                account->>'role',
                account->>'phone', 
                NOW(),
                NOW(),
                true
            );
            
            -- Créer l'identité email
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                user_id,
                jsonb_build_object(
                    'sub', user_id::text,
                    'email', account->>'email'
                ),
                'email',
                NOW(),
                NOW(),
                NOW()
            );
            
            RAISE NOTICE '✅ Compte créé: % (%) - ID: %', 
                account->>'full_name', account->>'role', user_id;
                
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Erreur création compte %: %', account->>'email', SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '🎉 Création des comptes terminée!';
END $$;

-- Vérification des comptes créés
SELECT 
    p.email,
    p.role,
    p.full_name,
    p.is_active,
    p.created_at
FROM public.profiles p
ORDER BY 
    CASE p.role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

-- Afficher un résumé
SELECT 
    'RÉSUMÉ CRÉATION COMPTES' as info,
    COUNT(*) as total_comptes,
    COUNT(CASE WHEN role = 'Admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role LIKE '%Vendeur%' THEN 1 END) as vendeurs,
    COUNT(CASE WHEN role IN ('Notaire','Agent Foncier','Géomètre') THEN 1 END) as professionnels_foncier
FROM public.profiles;

-- INFORMATIONS IMPORTANTES:
-- 1. Tous les comptes ont le mot de passe temporaire: TempPass2024!
-- 2. Les emails suivent le pattern: role@terangafoncier.sn  
-- 3. Tous les comptes sont pré-vérifiés (verification_status = 'verified')
-- 4. L'admin a les privilèges super_admin activés
-- 5. Les métadonnées auth.users correspondent aux données profiles
-- 6. Changer les mots de passe après première connexion

-- PROCHAINES ÉTAPES:
-- 1. Tester la connexion avec chaque compte
-- 2. Modifier les mots de passe temporaires  
-- 3. Personnaliser les profils selon les besoins
-- 4. Configurer les permissions spécifiques si nécessaire