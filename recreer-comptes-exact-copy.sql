-- ======================================================================
-- SUPPRESSION ET RECRÉATION DES 4 COMPTES PROBLÉMATIQUES
-- Basé sur la structure exacte des comptes fonctionnels
-- ======================================================================

-- ÉTAPE 1: ANALYSE DE LA STRUCTURE D'UN COMPTE FONCTIONNEL
SELECT 
    '🔍 MODÈLE DE RÉFÉRENCE' as section,
    'Analyse du compte fonctionnel pour copier sa structure' as description;

-- Récupérer la structure exacte d'un compte qui marche
SELECT 
    '📋 STRUCTURE MODÈLE' as section,
    email,
    instance_id,
    aud,
    role,
    encrypted_password IS NOT NULL as has_password,
    LENGTH(encrypted_password) as password_length,
    email_confirmed_at IS NOT NULL as email_confirmed,
    confirmation_sent_at IS NOT NULL as has_confirmation_sent,
    raw_app_meta_data,
    raw_user_meta_data->>'role' as user_role,
    phone,
    is_super_admin,
    created_at::date as created_date
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- ÉTAPE 2: SUPPRESSION COMPLÈTE ET SÉCURISÉE DES 4 COMPTES PROBLÉMATIQUES
-- Transaction pour éviter les conflits de triggers

BEGIN;

-- Supprimer toutes les tables liées pour éviter les conflits de contraintes
-- 1. public.profiles
DELETE FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 2. public.users (créé par trigger automatique)
DELETE FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 3. Finalement, supprimer de auth.users
DELETE FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

COMMIT;

-- Vérifier la suppression complète
SELECT 
    '🗑️ SUPPRESSION VÉRIFIÉE' as section,
    'auth.users: ' || COUNT(*) || ' restants (doit être 0)' as auth_users
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

SELECT 
    '🗑️ SUPPRESSION VÉRIFIÉE' as section,
    'public.users: ' || COUNT(*) || ' restants (doit être 0)' as public_users
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- PAUSE : Attendre 2 secondes pour que les triggers se calment
SELECT pg_sleep(2);

-- ÉTAPE 3: RECRÉATION SÉCURISÉE AVEC TRANSACTION
-- ÉTAPE 3: RECRÉATION SÉCURISÉE AVEC TRANSACTION

BEGIN;

-- Utiliser la même méthode que les comptes qui marchent
-- ⚠️ IMPORTANT: Remplacer ces VALUES par la structure exacte d'un compte fonctionnel
-- après avoir analysé les résultats du diagnostic-approfondi.sql

-- Ahmadou Ba (particulier)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    phone,
    is_super_admin,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) 
SELECT 
    instance_id, -- Copie de la structure fonctionnelle
    gen_random_uuid(), -- Nouveau ID
    aud, -- Copie de la structure fonctionnelle
    role, -- Copie de la structure fonctionnelle
    'ahmadou.ba@teranga-foncier.sn', -- Email spécifique
    crypt('password123', gen_salt('bf')), -- Nouveau mot de passe
    NOW(), -- Email confirmé
    confirmation_sent_at, -- Copie de la structure fonctionnelle
    '', -- Token vide
    recovery_sent_at, -- Copie de la structure fonctionnelle
    recovery_token, -- Copie de la structure fonctionnelle
    '+221 77 123 45 02', -- Téléphone spécifique
    is_super_admin, -- Copie de la structure fonctionnelle
    NOW(), -- Date de création
    NOW(), -- Date de mise à jour
    raw_app_meta_data, -- Copie de la structure fonctionnelle
    '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb -- Métadonnées spécifiques
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- Domaine Seck (vendeur)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token,
    phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) 
SELECT 
    instance_id, gen_random_uuid(), aud, role,
    'domaine.seck@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')), NOW(),
    confirmation_sent_at, '', recovery_sent_at, recovery_token,
    '+221 77 123 45 04', is_super_admin, NOW(), NOW(), raw_app_meta_data,
    '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- BOA Sénégal (banque)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token,
    phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) 
SELECT 
    instance_id, gen_random_uuid(), aud, role,
    'financement.boa@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')), NOW(),
    confirmation_sent_at, '', recovery_sent_at, recovery_token,
    '+221 33 123 45 07', is_super_admin, NOW(), NOW(), raw_app_meta_data,
    '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- Étude Diouf (notaire)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token,
    phone, is_super_admin, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) 
SELECT 
    instance_id, gen_random_uuid(), aud, role,
    'etude.diouf@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')), NOW(),
    confirmation_sent_at, '', recovery_sent_at, recovery_token,
    '+221 33 123 45 09', is_super_admin, NOW(), NOW(), raw_app_meta_data,
    '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

COMMIT;

-- ÉTAPE 4: VÉRIFICATION DE LA RECRÉATION
SELECT 
    '✅ COMPTES RECRÉÉS' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE WHEN encrypted_password IS NOT NULL THEN '✅' ELSE '❌' END as password,
    CASE WHEN email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as email_confirmed,
    aud,
    role as auth_role,
    instance_id,
    '✅ RECRÉÉ' as statut
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY raw_user_meta_data->>'role', email;

-- ÉTAPE 5: COMPARAISON AVEC LE MODÈLE
SELECT 
    '🔍 COMPARAISON POST-RECRÉATION' as section,
    'Nouveau' as type,
    email,
    instance_id,
    aud,
    role,
    raw_app_meta_data->'provider' as provider
FROM auth.users 
WHERE email = 'ahmadou.ba@teranga-foncier.sn'

UNION ALL

SELECT 
    '🔍 COMPARAISON POST-RECRÉATION' as section,
    'Modèle' as type,
    email,
    instance_id,
    aud,
    role,
    raw_app_meta_data->'provider' as provider
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
ORDER BY type DESC;

-- INSTRUCTIONS FINALES
SELECT 
    '🧪 TEST FINAL' as section,
    'Lancez maintenant: node test-connexions-supabase.js' as commande,
    'Les 4 comptes devraient maintenant avoir la MÊME structure que ceux qui marchent' as resultat_attendu
FROM auth.users LIMIT 1;