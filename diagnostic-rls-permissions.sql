-- ======================================================================
-- DIAGNOSTIC RLS : VÉRIFIER LES POLITIQUES DE SÉCURITÉ
-- L'erreur "Database error querying schema" peut venir des permissions RLS
-- ======================================================================

-- REQUÊTE 1: VÉRIFIER SI RLS EST ACTIVÉ SUR LES TABLES IMPORTANTES
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_active,
    CASE WHEN rowsecurity THEN '🔒 RLS ACTIVÉ' ELSE '🔓 RLS DÉSACTIVÉ' END as statut_rls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'profiles', 'user_profiles', 'requests')
ORDER BY tablename;

-- REQUÊTE 2: VOIR TOUTES LES POLITIQUES RLS SUR public.profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- REQUÊTE 3: VOIR TOUTES LES POLITIQUES RLS SUR public.users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- REQUÊTE 4: PERMISSIONS SUR LES TABLES
SELECT 
    table_schema,
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'profiles')
AND grantee IN ('authenticated', 'anon', 'public')
ORDER BY table_name, privilege_type;

-- REQUÊTE 5: TESTER UNE REQUÊTE SIMPLE SUR public.profiles
SELECT 
    'TEST LECTURE profiles' as test,
    COUNT(*) as nb_comptes_lisibles
FROM public.profiles;

-- REQUÊTE 6: TESTER UNE REQUÊTE SIMPLE SUR public.users  
SELECT 
    'TEST LECTURE users' as test,
    COUNT(*) as nb_comptes_lisibles
FROM public.users;