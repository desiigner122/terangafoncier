-- ======================================================================
-- DIAGNOSTIC SIMPLE ET DIRECT
-- Requêtes séparées pour éviter les erreurs
-- ======================================================================

-- REQUÊTE 1: Combien de comptes dans chaque table ?
SELECT 'auth.users' as table_name, COUNT(*) as total FROM auth.users
UNION ALL
SELECT 'public.users' as table_name, COUNT(*) as total FROM public.users
UNION ALL  
SELECT 'public.profiles' as table_name, COUNT(*) as total FROM public.profiles;

-- REQUÊTE 2: Tous les comptes @teranga dans auth.users
SELECT 
    'DANS auth.users' as section,
    email,
    id,
    created_at::date
FROM auth.users 
WHERE email LIKE '%@teranga%'
ORDER BY email;

-- REQUÊTE 3: Tous les comptes @teranga dans public.users
SELECT 
    'DANS public.users' as section,
    email,
    id,
    created_at::date
FROM public.users 
WHERE email LIKE '%@teranga%'
ORDER BY email;

-- REQUÊTE 4: Tous les comptes @teranga dans public.profiles
SELECT 
    'DANS public.profiles' as section,
    email,
    full_name,
    role,
    id
FROM public.profiles 
WHERE email LIKE '%@teranga%'
ORDER BY email;

-- REQUÊTE 5: Les 4 comptes spécifiques - où sont-ils ?
SELECT 
    '🎯 COMPTES CIBLES' as section,
    'ahmadou.ba@teranga-foncier.sn' as email,
    CASE WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'ahmadou.ba@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_auth,
    CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = 'ahmadou.ba@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_users,
    CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = 'ahmadou.ba@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_profiles

UNION ALL

SELECT 
    '🎯 COMPTES CIBLES' as section,
    'domaine.seck@teranga-foncier.sn' as email,
    CASE WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'domaine.seck@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_auth,
    CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = 'domaine.seck@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_users,
    CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = 'domaine.seck@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_profiles

UNION ALL

SELECT 
    '🎯 COMPTES CIBLES' as section,
    'financement.boa@teranga-foncier.sn' as email,
    CASE WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'financement.boa@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_auth,
    CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = 'financement.boa@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_users,
    CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = 'financement.boa@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_profiles

UNION ALL

SELECT 
    '🎯 COMPTES CIBLES' as section,
    'etude.diouf@teranga-foncier.sn' as email,
    CASE WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'etude.diouf@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_auth,
    CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = 'etude.diouf@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_users,
    CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = 'etude.diouf@teranga-foncier.sn') THEN '✅' ELSE '❌' END as dans_profiles;