-- ======================================================================
-- DIAGNOSTIC URGENT : LA MIGRATION A-T-ELLE FONCTIONNÉ ?
-- Vérifier si les comptes sont bien dans public.profiles maintenant
-- ======================================================================

-- VÉRIFICATION 1: Les 4 comptes sont-ils dans public.profiles ?
SELECT 
    '🔍 COMPTES DANS public.profiles' as section,
    COUNT(*) as nb_comptes_trouves,
    string_agg(email, ', ') as emails_trouves
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- VÉRIFICATION 2: Sont-ils encore dans public.users ?
SELECT 
    '❌ COMPTES ENCORE DANS public.users' as section,
    COUNT(*) as nb_comptes_trouves,
    string_agg(email, ', ') as emails_trouves
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- VÉRIFICATION 3: Détail de chaque compte
SELECT 
    '📋 DÉTAIL COMPTES' as section,
    au.email,
    CASE WHEN pp.email IS NOT NULL THEN '✅ Dans public.profiles' ELSE '❌ PAS dans public.profiles' END as status_profiles,
    CASE WHEN pu.email IS NOT NULL THEN '⚠️ Encore dans public.users' ELSE '✅ Plus dans public.users' END as status_users,
    CASE WHEN au.id = pp.id THEN '✅ IDs matchent' ELSE '❌ IDs différents' END as id_match
FROM auth.users au
LEFT JOIN public.profiles pp ON au.email = pp.email
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- VÉRIFICATION 4: Compter tous les comptes par table
SELECT '📊 TOTAL auth.users' as section, COUNT(*) as total FROM auth.users;
SELECT '📊 TOTAL public.profiles' as section, COUNT(*) as total FROM public.profiles;  
SELECT '📊 TOTAL public.users' as section, COUNT(*) as total FROM public.users;

-- VÉRIFICATION 5: Structure des comptes qui marchent vs qui ne marchent pas
SELECT 
    '✅ COMPTE QUI MARCHE (geowest)' as section,
    'public.profiles' as table_source,
    email, id, full_name, role, phone
FROM public.profiles 
WHERE email = 'geowest.africa@teranga-foncier.sn';

-- DIAGNOSTIC FINAL
SELECT 
    '🎯 DIAGNOSTIC' as section,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'ahmadou.ba@teranga-foncier.sn') 
        THEN '✅ Migration réussie - problème ailleurs'
        ELSE '❌ Migration échouée - comptes pas dans public.profiles'
    END as resultat,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'ahmadou.ba@teranga-foncier.sn') 
        THEN 'Il faut chercher un autre problème'
        ELSE 'Il faut refaire la migration correctement'
    END as action_requise;