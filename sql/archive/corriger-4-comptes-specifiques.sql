-- ======================================================================
-- CORRECTION SPÉCIFIQUE DES COMPTES PROBLÉMATIQUES
-- Script pour corriger les 4 comptes identifiés
-- ======================================================================

-- COMPTES À CORRIGER:
-- ahmadou.ba@teranga-foncier.sn (particulier)
-- domaine.seck@teranga-foncier.sn (vendeur)
-- financement.boa@teranga-foncier.sn (banque)
-- etude.diouf@teranga-foncier.sn (notaire)

-- 1. SUPPRESSION DES COMPTES PROBLÉMATIQUES
DELETE FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- Vérification de la suppression
SELECT 
    '🗑️ COMPTES SUPPRIMÉS' as section,
    COUNT(*) || ' comptes supprimés' as resultat
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 2. RÉCUPÉRATION DE LA STRUCTURE D'UN COMPTE FONCTIONNEL
SELECT 
    '🔍 STRUCTURE COMPTE FONCTIONNEL' as section,
    instance_id,
    aud,
    role,
    email_confirmed_at IS NOT NULL as email_confirmed,
    LENGTH(encrypted_password) as password_length,
    'Modèle pour recréer les comptes' as note
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- 3. RECRÉATION DES COMPTES AVEC LA BONNE STRUCTURE
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
) VALUES 
-- Ahmadou Ba (particulier)
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ahmadou.ba@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    '+221 77 123 45 02',
    FALSE,
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb
),
-- Domaine Seck (vendeur)
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'domaine.seck@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    '+221 77 123 45 04',
    FALSE,
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb
),
-- BOA Sénégal (banque)
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'financement.boa@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    '+221 33 123 45 07',
    FALSE,
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb
),
-- Étude Diouf (notaire)
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'etude.diouf@teranga-foncier.sn',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    '+221 33 123 45 09',
    FALSE,
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb
);

-- 4. VÉRIFICATION DES COMPTES RECRÉÉS
SELECT 
    '✅ COMPTES RECRÉÉS' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN encrypted_password IS NOT NULL THEN '✅ MOT DE PASSE OK'
        ELSE '❌ PAS DE MOT DE PASSE'
    END as status_password,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email,
    '✅ RECRÉÉ' as statut
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY raw_user_meta_data->>'role', email;

-- 5. TEST RAPIDE DE VALIDATION
SELECT 
    '🧪 VALIDATION STRUCTURE' as section,
    COUNT(*) || '/4 comptes recréés' as comptes_crees,
    COUNT(CASE WHEN encrypted_password IS NOT NULL THEN 1 END) || '/4 avec mot de passe' as avec_password,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) || '/4 emails confirmés' as emails_confirmes,
    CASE 
        WHEN COUNT(*) = 4 AND 
             COUNT(CASE WHEN encrypted_password IS NOT NULL THEN 1 END) = 4 AND
             COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) = 4
        THEN '🎉 TOUS LES COMPTES SONT PRÊTS!'
        ELSE '⚠️ VÉRIFIEZ LES RÉSULTATS'
    END as statut_final
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 6. INSTRUCTIONS FINALES
SELECT 
    '🎯 ÉTAPES SUIVANTES' as section,
    'Testez maintenant la connexion:' as instruction,
    'node test-connexions-supabase.js' as commande,
    'Les 4 comptes devraient maintenant fonctionner' as resultat_attendu,
    'password123' as mot_de_passe
FROM auth.users LIMIT 1;