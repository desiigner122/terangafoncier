-- ======================================================================
-- MIGRATION SEULEMENT : SANS SUPPRESSION (évite les triggers)
-- On migre vers public.profiles mais on garde public.users intact
-- ======================================================================

-- ÉTAPE 1: MIGRATION SIMPLE VERS public.profiles
INSERT INTO public.profiles (id, email, full_name, role, phone, created_at)
SELECT 
    pu.id,
    pu.email,
    au.raw_user_meta_data->>'full_name',
    CASE 
        WHEN au.raw_user_meta_data->>'role' = 'particular' THEN 'particulier'
        WHEN au.raw_user_meta_data->>'role' = 'particulier' THEN 'particulier'
        WHEN au.raw_user_meta_data->>'role' = 'vendeur' THEN 'vendeur'
        WHEN au.raw_user_meta_data->>'role' = 'promoteur' THEN 'promoteur'
        WHEN au.raw_user_meta_data->>'role' = 'banque' THEN 'banque'
        WHEN au.raw_user_meta_data->>'role' = 'notaire' THEN 'notaire'
        WHEN au.raw_user_meta_data->>'role' = 'agent_foncier' THEN 'agent_foncier'
        WHEN au.raw_user_meta_data->>'role' = 'geometre' THEN 'geometre'
        WHEN au.raw_user_meta_data->>'role' = 'investisseur' THEN 'investisseur'
        WHEN au.raw_user_meta_data->>'role' = 'mairie' THEN 'mairie'
        WHEN au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
        ELSE 'particulier'
    END,
    au.raw_user_meta_data->>'phone',
    pu.created_at
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE NOT EXISTS (SELECT 1 FROM public.profiles pp WHERE pp.email = pu.email)
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

-- ÉTAPE 2: VÉRIFICATION - LES 4 COMPTES SONT-ILS MAINTENANT DANS public.profiles ?
SELECT 
    '✅ COMPTES DANS public.profiles' as section,
    email,
    full_name,
    role,
    phone,
    '🎯 MIGRÉ' as status
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 3: VÉRIFICATION DES IDs (CRITIQUE POUR LE FONCTIONNEMENT)
SELECT 
    '🔗 IDs CORRESPONDENT-ILS ?' as section,
    au.email,
    au.id as auth_id,
    pp.id as profile_id,
    CASE WHEN au.id = pp.id THEN '✅ PARFAIT' ELSE '❌ ERREUR' END as match_status
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- ÉTAPE 4: COMPTER LES COMPTES DANS CHAQUE TABLE
SELECT 
    '📊 RÉPARTITION FINALE' as section,
    'auth.users' as table_name,
    COUNT(*) as total
FROM auth.users

UNION ALL

SELECT 
    '📊 RÉPARTITION FINALE' as section,
    'public.profiles' as table_name,
    COUNT(*) as total
FROM public.profiles

UNION ALL

SELECT 
    '📊 RÉPARTITION FINALE' as section,
    'public.users' as table_name,
    COUNT(*) as total
FROM public.users;

-- ÉTAPE 5: TOUS LES COMPTES TERANGA DANS public.profiles ?
SELECT 
    '🎯 TOUS LES COMPTES TERANGA' as section,
    COUNT(*) || ' comptes @teranga-foncier.sn dans public.profiles' as resultat
FROM public.profiles 
WHERE email LIKE '%@teranga-foncier.sn';

-- TEST FINAL
SELECT 
    '🚀 MIGRATION TERMINÉE - TESTEZ !' as message,
    'node test-connexions-supabase.js' as commande,
    'Attendu: 19-20/20 connexions réussies' as objectif;