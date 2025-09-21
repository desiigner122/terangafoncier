-- ======================================================================
-- DIAGNOSTIC SIMPLE : TABLES LIÉES ET IDs
-- Version simplifiée pour éviter les erreurs de colonnes
-- ======================================================================

-- 1. Vérifier combien d'entrées existent dans chaque table
SELECT '📊 COMPTAGE GLOBAL' as section, 'auth.users' as table_name, COUNT(*) as total FROM auth.users;
SELECT '📊 COMPTAGE GLOBAL' as section, 'public.users' as table_name, COUNT(*) as total FROM public.users;
SELECT '📊 COMPTAGE GLOBAL' as section, 'public.profiles' as table_name, COUNT(*) as total FROM public.profiles;

-- 2. Comptes problématiques dans auth.users
SELECT 
    '❌ AUTH.USERS PROBLÉMATIQUES' as section,
    email,
    id,
    created_at::date as created_date
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- 3. Comptes problématiques dans public.users
SELECT 
    '❌ PUBLIC.USERS PROBLÉMATIQUES' as section,
    email,
    id,
    created_at::date as created_date
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- 4. Comptes fonctionnels dans auth.users  
SELECT 
    '✅ AUTH.USERS FONCTIONNELS' as section,
    email,
    id,
    created_at::date as created_date
FROM auth.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY email;

-- 5. Comptes fonctionnels dans public.users
SELECT 
    '✅ PUBLIC.USERS FONCTIONNELS' as section,
    email,
    id,
    created_at::date as created_date
FROM public.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY email;

-- 6. DIAGNOSTIC CRITIQUE: ID MATCHING
SELECT 
    '🔍 MATCHING IDs PROBLÉMATIQUES' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_id,
    CASE 
        WHEN pu.id IS NULL THEN '❌ MANQUANT DANS PUBLIC.USERS'
        WHEN au.id = pu.id THEN '✅ IDs CORRESPONDENT' 
        ELSE '❌ IDs DIFFÉRENTS'
    END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- 7. COMPARAISON AVEC FONCTIONNELS
SELECT 
    '🔍 MATCHING IDs FONCTIONNELS' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_id,
    CASE 
        WHEN pu.id IS NULL THEN '❌ MANQUANT DANS PUBLIC.USERS'
        WHEN au.id = pu.id THEN '✅ IDs CORRESPONDENT' 
        ELSE '❌ IDs DIFFÉRENTS'
    END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY au.email;