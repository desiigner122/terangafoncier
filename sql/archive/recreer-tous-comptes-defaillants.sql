-- ======================================================================
-- SOLUTION RADICALE : RECRÉER TOUS LES COMPTES DÉFAILLANTS
-- Utiliser exactement la même méthode que les 6 comptes qui marchent
-- ======================================================================

-- TOUS LES COMPTES DÉFAILLANTS (14 comptes)
-- 'admin@terangafoncier.sn' -> mot de passe incorrect (à traiter séparément)
-- Les 13 autres avec "Database error querying schema"

-- ÉTAPE 1: SUPPRIMER TOUS LES COMPTES DÉFAILLANTS
DELETE FROM public.profiles WHERE email IN (
    'test.admin@terangafoncier.sn',
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn', 
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
);

DELETE FROM public.users WHERE email IN (
    'test.admin@terangafoncier.sn',
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
);

DELETE FROM auth.users WHERE email IN (
    'test.admin@terangafoncier.sn',
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
);

-- ÉTAPE 2: RECRÉER AVEC LA MÉTHODE QUI MARCHE (copier depuis geowest.africa)

-- Admin Test
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'test.admin@terangafoncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 000 00 01', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Admin Test","role":"admin","phone":"+221 77 000 00 01","organization":"Teranga Foncier"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Family Diallo (particulier)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'family.diallo@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 01', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Famille Diallo","role":"particulier","phone":"+221 77 123 45 01","organization":"Famille"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Ahmadou Ba (particulier)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'ahmadou.ba@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 02', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Heritage Fall (vendeur)  
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'heritage.fall@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 03', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Héritage Fall","role":"vendeur","phone":"+221 77 123 45 03","organization":"Héritage Familial Fall"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Domaine Seck (vendeur)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'domaine.seck@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 04', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Urban Developers (promoteur)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'urban.developers@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 05', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Urban Developers","role":"promoteur","phone":"+221 33 123 45 05","organization":"Urban Developers Sarl"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Sahel Construction (promoteur)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'sahel.construction@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 06', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Sahel Construction","role":"promoteur","phone":"+221 33 123 45 06","organization":"Sahel Construction SA"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- BOA Sénégal (banque)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'financement.boa@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 07', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Crédit Agricole (banque)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'credit.agricole@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 08', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Crédit Agricole du Sénégal","role":"banque","phone":"+221 33 123 45 08","organization":"Crédit Agricole Sénégal"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Étude Diouf (notaire)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'etude.diouf@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 09', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Chambre des Notaires (notaire)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'chambre.notaires@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 10', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Chambre des Notaires","role":"notaire","phone":"+221 33 123 45 10","organization":"Chambre des Notaires du Sénégal"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Expert Foncier (agent_foncier)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'foncier.expert@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 11', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Expert Foncier Conseil","role":"agent_foncier","phone":"+221 33 123 45 11","organization":"Cabinet Foncier Expert"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- Teranga Immobilier (agent_foncier)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'teranga.immobilier@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 12', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Teranga Immobilier","role":"agent_foncier","phone":"+221 33 123 45 12","organization":"Agence Teranga Immobilier"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- VÉRIFICATION FINALE
SELECT '✅ COMPTES RECRÉÉS AVEC MÉTHODE FONCTIONNELLE' as section, COUNT(*) || ' comptes recréés' as resultat FROM auth.users WHERE email IN ('test.admin@terangafoncier.sn','family.diallo@teranga-foncier.sn','ahmadou.ba@teranga-foncier.sn','heritage.fall@teranga-foncier.sn','domaine.seck@teranga-foncier.sn','urban.developers@teranga-foncier.sn','sahel.construction@teranga-foncier.sn','financement.boa@teranga-foncier.sn','credit.agricole@teranga-foncier.sn','etude.diouf@teranga-foncier.sn','chambre.notaires@teranga-foncier.sn','foncier.expert@teranga-foncier.sn','teranga.immobilier@teranga-foncier.sn');

SELECT '🧪 TEST FINAL' as action, 'node test-connexions-supabase.js' as commande, 'Objectif: 19/20 connexions (95%) - seul admin@terangafoncier reste à corriger' as resultat;