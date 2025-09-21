-- ======================================================================
-- CORRECTION FINALE : SYNCHRONISER public.profiles → public.users
-- APPROCHE DOUCE SANS TRUNCATE
-- ======================================================================

-- ÉTAPE 1: VOIR LA STRUCTURE DE public.users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- ÉTAPE 2: SYNCHRONISATION DOUCE - UPDATE OU INSERT
INSERT INTO public.users (id, email, created_at)
SELECT 
    id, 
    email, 
    created_at
FROM public.profiles
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;

-- ÉTAPE 3: SUPPRIMER LES COMPTES QUI NE SONT PLUS DANS profiles
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM public.profiles);

-- ÉTAPE 4: VÉRIFICATION - COMPTER LES COMPTES DANS public.users
SELECT 
    'public.users SYNCHRONISÉ' as section,
    COUNT(*) as total_comptes
FROM public.users;

-- ÉTAPE 5: VÉRIFIER LES 4 COMPTES CRITIQUES DANS public.users
SELECT 
    '4 COMPTES CRITIQUES DANS users' as section,
    email,
    id
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 6: TOUS LES COMPTES @TERANGA DANS public.users
SELECT 
    'COMPTES TERANGA DANS users' as section,
    COUNT(*) as comptes_teranga
FROM public.users 
WHERE email LIKE '%@teranga%';

-- ÉTAPE 7: VÉRIFIER QUE auth.users + public.users + public.profiles CORRESPONDENT
SELECT 
    'CORRESPONDANCE FINALE' as section,
    au.email,
    au.id as auth_id,
    pu.id as users_id,
    pp.id as profiles_id,
    CASE 
        WHEN au.id = pu.id AND pu.id = pp.id THEN '✅ PARFAIT'
        ELSE '❌ PROBLÈME'
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