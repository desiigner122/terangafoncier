-- ======================================================================
-- DIAGNOSTIC AVANCÉ : IDs et CORRESPONDANCES
-- Les comptes existent partout mais échouent encore - pourquoi ?
-- ======================================================================

-- REQUÊTE 1: CORRESPONDANCE DES IDs - LE PROBLÈME EST LÀ ?
SELECT 
    'CORRESPONDANCE IDs' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_users_id,
    pp.id as profiles_id,
    CASE 
        WHEN au.id = pu.id AND pu.id = pp.id THEN '✅ PARFAIT'
        WHEN au.id = pp.id THEN '⚠️ auth=profiles mais ≠ public.users'
        WHEN au.id = pu.id THEN '⚠️ auth=public.users mais ≠ profiles'
        ELSE '❌ IDs DIFFÉRENTS'
    END as correspondance
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- REQUÊTE 2: COMPARER AVEC LES COMPTES QUI FONCTIONNENT
SELECT 
    'COMPTES QUI FONCTIONNENT' as section,
    au.email,
    au.id as auth_id,
    pp.id as profiles_id,
    CASE WHEN au.id = pp.id THEN '✅ PARFAIT' ELSE '❌ PROBLÈME' END as correspondance,
    pp.role,
    pp.full_name
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email AND au.id = pp.id
WHERE au.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
)
ORDER BY au.email;

-- REQUÊTE 3: DÉTAIL COMPLET DES 4 COMPTES PROBLÉMATIQUES
SELECT 
    'DÉTAIL COMPLET - PROBLÉMATIQUES' as section,
    au.email,
    au.id as auth_id,
    pp.id as profiles_id,
    pp.full_name,
    pp.role,
    pp.phone,
    au.email_confirmed_at IS NOT NULL as email_confirme,
    au.created_at::date as auth_created,
    pp.created_at::date as profile_created
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- REQUÊTE 4: VÉRIFIER LES CONTRAINTES ET RÔLES
SELECT 
    'VÉRIFICATION RÔLES' as section,
    email,
    role,
    CASE 
        WHEN role IN ('particulier', 'vendeur', 'promoteur', 'banque', 'notaire', 'agent_foncier', 'geometre', 'investisseur', 'mairie', 'admin') 
        THEN '✅ RÔLE VALIDE'
        ELSE '❌ RÔLE INVALIDE'
    END as role_status
FROM public.profiles
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- REQUÊTE 5: MÉTADONNÉES DANS auth.users
SELECT 
    'MÉTADONNÉES auth.users' as section,
    email,
    raw_user_meta_data->>'full_name' as meta_name,
    raw_user_meta_data->>'role' as meta_role,
    raw_user_meta_data->>'phone' as meta_phone
FROM auth.users
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- REQUÊTE 6: Y A-T-IL DES DOUBLONS ?
SELECT 
    'DOUBLONS POSSIBLES' as section,
    email,
    COUNT(*) as nb_occurrences
FROM public.profiles
WHERE email LIKE '%@teranga%'
GROUP BY email
HAVING COUNT(*) > 1;