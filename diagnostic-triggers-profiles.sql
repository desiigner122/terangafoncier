-- ======================================================================
-- DIAGNOSTIC AVANCÉ : TRIGGERS ET TABLES LIÉES
-- Identifier pourquoi les comptes recréés échouent encore
-- ======================================================================

-- VÉRIFIER LES TABLES LIÉES CRÉÉES AUTOMATIQUEMENT PAR LES TRIGGERS

-- 1. Vérifier public.users (créé par trigger handle_new_user)
SELECT 
    '🔍 TABLE public.users' as section,
    'Comptes problématiques' as type,
    COUNT(*) || ' entrées trouvées' as resultat
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

SELECT 
    '🔍 TABLE public.users' as section,
    'Comptes fonctionnels' as type,
    COUNT(*) || ' entrées trouvées' as resultat
FROM public.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
);

-- 2. D'abord, découvrir la structure de public.users
SELECT 
    '📋 STRUCTURE DE public.users' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Comparer les entrées public.users (colonnes de base)
SELECT 
    '👥 STRUCTURE public.users - PROBLÉMATIQUES' as section,
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

SELECT 
    '👥 STRUCTURE public.users - FONCTIONNELS' as section,
    email,
    id,
    created_at::date as created_date
FROM public.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY email;

-- 3. Vérifier public.profiles  
SELECT 
    '📋 TABLE public.profiles' as section,
    'Comptes problématiques' as type,
    COUNT(*) || ' entrées trouvées' as resultat
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

SELECT 
    '📋 TABLE public.profiles' as section,
    'Comptes fonctionnels' as type,
    COUNT(*) || ' entrées trouvées' as resultat
FROM public.profiles 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
);

-- 4. Vérifier les triggers actifs
SELECT 
    '🔧 TRIGGERS SUR auth.users' as section,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth'
ORDER BY trigger_name;

-- 5. Diagnostic complet : ID matching entre auth.users et public.users
SELECT 
    '🔗 CORRESPONDANCE DES IDs' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_id,
    CASE WHEN au.id = pu.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as id_match,
    au.created_at::date as auth_created,
    pu.created_at::date as public_created
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn', 
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- 6. Comparaison avec comptes fonctionnels
SELECT 
    '🔗 CORRESPONDANCE DES IDs - FONCTIONNELS' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_id,
    CASE WHEN au.id = pu.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as id_match,
    au.created_at::date as auth_created,
    pu.created_at::date as public_created
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY au.email;

-- 7. RECOMMANDATION FINALE
SELECT 
    '💡 ANALYSE FINALE' as section,
    'Si les IDs ne matchent pas entre auth.users et public.users,' as probleme,
    'alors le trigger handle_new_user() ne fonctionne pas correctement' as cause,
    'Solution: Recréer les entrées public.users avec les bons IDs' as solution
LIMIT 1;