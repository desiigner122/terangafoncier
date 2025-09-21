-- ======================================================================
-- CORRECTION AUTOMATIQUE DES COMPTES PROBLÉMATIQUES
-- Script pour corriger tous les problèmes identifiés
-- ======================================================================

-- 1. CORRECTION DES MOTS DE PASSE MANQUANTS
UPDATE auth.users
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email NOT LIKE '%@test.com'
  AND (encrypted_password IS NULL OR LENGTH(encrypted_password) < 10);

-- Vérification de la correction des mots de passe
SELECT 
    '✅ MOTS DE PASSE CORRIGÉS' as section,
    COUNT(*) || ' comptes avec mot de passe corrigé' as resultat
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
  AND encrypted_password IS NOT NULL
  AND LENGTH(encrypted_password) >= 10;

-- 2. CORRECTION DES EMAILS NON CONFIRMÉS (SANS confirmed_at)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email NOT LIKE '%@test.com'
  AND email_confirmed_at IS NULL;

-- Vérification de la correction des emails
SELECT 
    '✅ EMAILS CONFIRMÉS' as section,
    COUNT(*) || ' emails confirmés' as resultat
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
  AND email_confirmed_at IS NOT NULL;

-- 3. VÉRIFICATION FINALE DE TOUS LES COMPTES
SELECT 
    '🔍 ÉTAT FINAL DES COMPTES' as section,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom,
    u.raw_user_meta_data->>'role' as role,
    CASE 
        WHEN u.encrypted_password IS NULL THEN '❌ PAS DE MOT DE PASSE'
        WHEN LENGTH(u.encrypted_password) < 10 THEN '⚠️ MOT DE PASSE SUSPECT'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com'
ORDER BY u.raw_user_meta_data->>'role', u.email;

-- 4. RÉSUMÉ FINAL
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com') as total_comptes,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND encrypted_password IS NOT NULL AND LENGTH(encrypted_password) >= 10) as comptes_avec_password,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND email_confirmed_at IS NOT NULL) as comptes_email_confirme,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND encrypted_password IS NOT NULL AND email_confirmed_at IS NOT NULL AND LENGTH(encrypted_password) >= 10) as comptes_totalement_ok,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND encrypted_password IS NOT NULL AND email_confirmed_at IS NOT NULL AND LENGTH(encrypted_password) >= 10) = (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com')
        THEN '🎉 TOUS LES COMPTES SONT CORRIGÉS!'
        ELSE '⚠️ IL RESTE DES COMPTES À CORRIGER'
    END as statut_general
FROM auth.users LIMIT 1;

-- 5. INSTRUCTIONS POUR TESTER
SELECT 
    '🧪 PROCHAINES ÉTAPES' as section,
    'Lancez maintenant le test de connexion:' as instruction_1,
    'node test-connexions-supabase.js' as commande_test,
    'Tous les comptes devraient maintenant fonctionner avec:' as instruction_2,
    'Mot de passe: password123' as info_connexion
FROM auth.users LIMIT 1;