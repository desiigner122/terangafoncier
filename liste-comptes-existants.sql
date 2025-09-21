-- ======================================================================
-- LISTE DES COMPTES EXISTANTS
-- Script simple pour voir tous les comptes actuellement dans le système
-- ======================================================================

-- 1. Liste simple de tous les comptes existants
SELECT 
    '📋 COMPTES EXISTANTS' as section,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom_complet,
    u.raw_user_meta_data->>'role' as role,
    u.raw_user_meta_data->>'phone' as telephone,
    u.created_at::date as date_creation,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅'
        ELSE '❌'
    END as confirme
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com'
ORDER BY u.created_at DESC;

-- 2. Comptage par rôle
SELECT 
    '📊 COMPTAGE PAR RÔLE' as section,
    COALESCE(raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    COUNT(*) as nombre
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
GROUP BY raw_user_meta_data->>'role'
ORDER BY COUNT(*) DESC;

-- 3. Total des comptes
SELECT 
    '🔢 TOTAL COMPTES' as section,
    COUNT(*) as nombre_total_comptes
FROM auth.users 
WHERE email NOT LIKE '%@test.com';

-- 4. Comptes créés aujourd'hui
SELECT 
    '📅 COMPTES CRÉÉS AUJOURD''HUI' as section,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom,
    u.raw_user_meta_data->>'role' as role,
    u.created_at::time as heure_creation
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com'
  AND u.created_at::date = CURRENT_DATE
ORDER BY u.created_at DESC;

-- 5. Comptes récents (7 derniers jours)
SELECT 
    '🆕 COMPTES RÉCENTS (7 JOURS)' as section,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom,
    u.raw_user_meta_data->>'role' as role,
    u.created_at::date as date_creation
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com'
  AND u.created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY u.created_at DESC;