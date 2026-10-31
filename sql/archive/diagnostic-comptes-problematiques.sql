-- ======================================================================
-- DIAGNOSTIC DES COMPTES - PROBLÈMES POTENTIELS
-- Script pour identifier les comptes qui pourraient avoir des problèmes
-- ======================================================================

-- 1. Vérification des mots de passe (encrypted_password)
SELECT 
    '🔐 VÉRIFICATION MOTS DE PASSE' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ AUCUN MOT DE PASSE'
        WHEN LENGTH(encrypted_password) < 10 THEN '⚠️  MOT DE PASSE SUSPECT'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
ORDER BY raw_user_meta_data->>'role', email;

-- 2. Vérification des colonnes critiques
SELECT 
    '⚠️  COLONNES CRITIQUES' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    CASE WHEN id IS NULL THEN '❌ PAS D''ID' ELSE '✅ ID OK' END as id_status,
    CASE WHEN aud IS NULL THEN '❌ PAS D''AUD' ELSE '✅ AUD OK' END as aud_status,
    CASE WHEN role IS NULL THEN '❌ PAS DE ROLE AUTH' ELSE '✅ ROLE AUTH OK' END as auth_role_status,
    CASE WHEN instance_id IS NULL THEN '❌ PAS D''INSTANCE_ID' ELSE '✅ INSTANCE_ID OK' END as instance_status
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
  AND (id IS NULL OR aud IS NULL OR role IS NULL OR instance_id IS NULL)
ORDER BY email;

-- 3. Comptes avec des problèmes potentiels
SELECT 
    '🚨 COMPTES PROBLÉMATIQUES' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as user_role,
    CASE 
        WHEN encrypted_password IS NULL THEN 'AUCUN MOT DE PASSE'
        WHEN email_confirmed_at IS NULL THEN 'EMAIL NON CONFIRMÉ'
        WHEN id IS NULL THEN 'ID MANQUANT'
        WHEN aud IS NULL THEN 'AUD MANQUANT'
        WHEN role IS NULL THEN 'ROLE AUTH MANQUANT'
        WHEN instance_id IS NULL THEN 'INSTANCE_ID MANQUANT'
        ELSE 'AUTRE PROBLÈME'
    END as probleme
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
  AND (
    encrypted_password IS NULL 
    OR email_confirmed_at IS NULL 
    OR id IS NULL 
    OR aud IS NULL 
    OR role IS NULL 
    OR instance_id IS NULL
  )
ORDER BY email;

-- 4. Comptes créés récemment sans mot de passe
SELECT 
    '🔍 COMPTES RÉCENTS SUSPECTS' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    created_at::date as date_creation,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ PAS DE MOT DE PASSE'
        WHEN LENGTH(encrypted_password) < 10 THEN '⚠️  MOT DE PASSE FAIBLE'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (encrypted_password IS NULL OR LENGTH(encrypted_password) < 10)
ORDER BY created_at DESC;

-- 5. Résumé des problèmes
SELECT 
    '📊 RÉSUMÉ DES PROBLÈMES' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND encrypted_password IS NULL) as comptes_sans_password,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND email_confirmed_at IS NULL) as comptes_email_non_confirme,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND (id IS NULL OR aud IS NULL OR role IS NULL)) as comptes_colonnes_manquantes,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com' AND encrypted_password IS NOT NULL AND email_confirmed_at IS NOT NULL) as comptes_ok
FROM auth.users LIMIT 1;

-- 6. Instructions de correction
SELECT 
    '🔧 INSTRUCTIONS DE CORRECTION' as section,
    'Si des comptes n''ont pas de mot de passe:' as etape_1,
    'UPDATE auth.users SET encrypted_password = crypt(''password123'', gen_salt(''bf'')) WHERE email = ''email-problematique'';' as commande_1,
    'Si des emails ne sont pas confirmés:' as etape_2,
    'UPDATE auth.users SET email_confirmed_at = NOW(), confirmed_at = NOW() WHERE email = ''email-problematique'';' as commande_2
FROM auth.users LIMIT 1;