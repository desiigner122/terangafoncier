-- ======================================================================
-- MIGRATION : DE public.users VERS public.profiles
-- Résoudre définitivement le problème en migrant tous les comptes défaillants
-- ======================================================================

-- ÉTAPE 1: ANALYSER LA STRUCTURE DE public.profiles (table qui marche)
SELECT 
    '📋 STRUCTURE public.profiles (QUI MARCHE)' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ÉTAPE 2: VOIR UN EXEMPLE DE COMPTE FONCTIONNEL DANS public.profiles
SELECT 
    '✅ MODÈLE public.profiles FONCTIONNEL' as section,
    *
FROM public.profiles 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- ÉTAPE 3: COMPTER LES COMPTES DANS CHAQUE TABLE
SELECT '📊 RÉPARTITION ACTUELLE' as section, 'public.users' as table_name, COUNT(*) as total FROM public.users;
SELECT '📊 RÉPARTITION ACTUELLE' as section, 'public.profiles' as table_name, COUNT(*) as total FROM public.profiles;

-- ÉTAPE 4: IDENTIFIER LES COMPTES À MIGRER (dans public.users mais pas dans public.profiles)
SELECT 
    '🚚 COMPTES À MIGRER' as section,
    pu.email,
    pu.id,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.raw_user_meta_data->>'role' as role,
    au.raw_user_meta_data->>'phone' as phone
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.email NOT IN (SELECT email FROM public.profiles WHERE email IS NOT NULL)
ORDER BY pu.email;

-- ÉTAPE 5: MIGRATION AUTOMATIQUE VERS public.profiles
-- Migrer tous les comptes de public.users vers public.profiles avec la bonne structure
-- (Sans la colonne organization qui n'existe pas)

INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    phone,
    created_at,
    updated_at
)
SELECT 
    pu.id,
    pu.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.raw_user_meta_data->>'role' as role,
    au.raw_user_meta_data->>'phone' as phone,
    pu.created_at,
    NOW() as updated_at
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.email NOT IN (SELECT email FROM public.profiles WHERE email IS NOT NULL)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- ÉTAPE 6: SUPPRIMER LES COMPTES DE public.users (maintenant inutiles)
DELETE FROM public.users 
WHERE email IN (
    SELECT email FROM public.profiles 
    WHERE email IS NOT NULL
);

-- ÉTAPE 7: VÉRIFICATION DE LA MIGRATION
SELECT 
    '✅ MIGRATION TERMINÉE' as section,
    'Total dans public.profiles: ' || COUNT(*) as resultat
FROM public.profiles;

-- ÉTAPE 8: VÉRIFIER LA CORRESPONDANCE auth.users <-> public.profiles
SELECT 
    '🔗 CORRESPONDANCE APRÈS MIGRATION' as section,
    au.email,
    au.id as auth_id,
    pp.id as profile_id,
    CASE WHEN au.id = pp.id THEN '✅ MATCH PARFAIT' ELSE '❌ PROBLÈME' END as status,
    pp.full_name,
    pp.role
FROM auth.users au
LEFT JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'family.diallo@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn'
)
ORDER BY au.email;

-- ÉTAPE 9: COMPTER TOUS LES COMPTES MAINTENANT DANS public.profiles
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    'auth.users: ' || (SELECT COUNT(*) FROM auth.users) as auth_total,
    'public.profiles: ' || (SELECT COUNT(*) FROM public.profiles) as profiles_total,
    'public.users restants: ' || (SELECT COUNT(*) FROM public.users) as users_restants
FROM auth.users LIMIT 1;

-- INSTRUCTIONS FINALES
SELECT 
    '🧪 TEST MAINTENANT' as action,
    'node test-connexions-supabase.js' as commande,
    'Résultat attendu: TOUS les comptes devraient maintenant fonctionner!' as objectif
FROM auth.users LIMIT 1;