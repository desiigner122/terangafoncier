-- ======================================================================
-- SOLUTION ULTRA-SIMPLE : SUPPRESSION ET RECRÉATION DIRECTE
-- Un seul bloc, évite tous les conflits
-- ======================================================================

-- NETTOYAGE IMMÉDIAT (ignorer les erreurs si tables n'existent pas)
DELETE FROM public.profiles WHERE email IN ('ahmadou.ba@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn', 'financement.boa@teranga-foncier.sn', 'etude.diouf@teranga-foncier.sn');

DELETE FROM public.users WHERE email IN ('ahmadou.ba@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn', 'financement.boa@teranga-foncier.sn', 'etude.diouf@teranga-foncier.sn');

DELETE FROM auth.users WHERE email IN ('ahmadou.ba@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn', 'financement.boa@teranga-foncier.sn', 'etude.diouf@teranga-foncier.sn');

-- RECRÉATION IMMEDIATE BASÉE SUR UN COMPTE FONCTIONNEL

-- 1. Ahmadou Ba (particulier)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'ahmadou.ba@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 02', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- 2. Domaine Seck (vendeur)  
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'domaine.seck@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 77 123 45 04', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- 3. BOA Sénégal (banque)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'financement.boa@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 07', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- 4. Étude Diouf (notaire)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data) 
SELECT instance_id, gen_random_uuid(), aud, role, 'etude.diouf@teranga-foncier.sn', crypt('password123', gen_salt('bf')), NOW(), confirmation_sent_at, '', recovery_sent_at, recovery_token, '+221 33 123 45 09', is_super_admin, NOW(), NOW(), raw_app_meta_data, '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb 
FROM auth.users WHERE email = 'geowest.africa@teranga-foncier.sn' LIMIT 1;

-- VÉRIFICATION FINALE
SELECT '✅ RÉSULTAT FINAL' as section, email, raw_user_meta_data->>'full_name' as nom, raw_user_meta_data->>'role' as role, aud, role as auth_role FROM auth.users WHERE email IN ('ahmadou.ba@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn', 'financement.boa@teranga-foncier.sn', 'etude.diouf@teranga-foncier.sn') ORDER BY email;