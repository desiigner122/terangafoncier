-- ======================================================================
-- DIAGNOSTIC RAPIDE: COMPTES ORPHELINS vs VALIDES
-- Pour identifier le problème avant migration
-- ======================================================================

-- 1. COMPTES DANS public.users ET LEUR STATUT dans auth.users
SELECT 
    'DIAGNOSTIC COMPTES' as section,
    pu.email,
    pu.id as public_users_id,
    au.id as auth_users_id,
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ VALIDE (peut être migré)'
        ELSE '❌ ORPHELIN (causera erreur FK)'
    END as status
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
ORDER BY (au.id IS NOT NULL) DESC, pu.email;

-- 2. COMPTAGE RAPIDE
SELECT 
    'STATISTIQUES' as section,
    COUNT(*) as total_public_users,
    COUNT(au.id) as comptes_valides,
    COUNT(*) - COUNT(au.id) as comptes_orphelins
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id;

-- 3. COMPTES DÉJÀ DANS public.profiles
SELECT 
    'DÉJÀ DANS PROFILES' as section,
    COUNT(*) || ' comptes' as total_profiles
FROM public.profiles;

SELECT 
    'DÉJÀ DANS PROFILES' as section,
    email,
    full_name,
    role
FROM public.profiles
ORDER BY email;

-- 4. VÉRIFIER SI LES COMPTES DÉFAILLANTS SONT DANS auth.users
SELECT 
    'COMPTES DÉFAILLANTS vs auth.users' as section,
    emails.email,
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ EXISTE dans auth.users'
        ELSE '❌ MANQUE dans auth.users'
    END as status_auth,
    CASE 
        WHEN pp.id IS NOT NULL THEN '✅ EXISTE dans public.profiles'
        ELSE '❌ MANQUE dans public.profiles'  
    END as status_profiles
FROM (
    VALUES 
    ('ahmadou.ba@teranga-foncier.sn'),
    ('domaine.seck@teranga-foncier.sn'),
    ('financement.boa@teranga-foncier.sn'),
    ('etude.diouf@teranga-foncier.sn'),
    ('family.diallo@teranga-foncier.sn'),
    ('heritage.fall@teranga-foncier.sn'),
    ('urban.developers@teranga-foncier.sn'),
    ('sahel.construction@teranga-foncier.sn'),
    ('credit.agricole@teranga-foncier.sn'),
    ('chambre.notaires@teranga-foncier.sn'),
    ('foncier.expert@teranga-foncier.sn'),
    ('teranga.immobilier@teranga-foncier.sn'),
    ('test.admin@terangafoncier.sn')
) AS emails(email)
LEFT JOIN auth.users au ON emails.email = au.email
LEFT JOIN public.profiles pp ON emails.email = pp.email
ORDER BY emails.email;

-- 5. SOLUTION RECOMMANDÉE
SELECT 
    '💡 SOLUTION' as section,
    'Si beaucoup de comptes sont orphelins, il faut d''abord les recréer dans auth.users' as conseil,
    'Puis faire la migration vers public.profiles' as etape_suivante;