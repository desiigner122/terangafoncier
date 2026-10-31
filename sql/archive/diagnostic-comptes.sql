-- DIAGNOSTIC COMPLET DES COMPTES SUPABASE
-- Ce script vérifie l'état réel des tables auth.users et public.profiles

-- 1. VÉRIFIER SI DES UTILISATEURS EXISTENT DANS AUTH.USERS
SELECT 
    '=== VÉRIFICATION AUTH.USERS ===' as info,
    COUNT(*) as total_users
FROM auth.users;

-- 2. LISTER TOUS LES UTILISATEURS DANS AUTH.USERS (SI EXISTANTS)
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data->>'role' as role_metadata,
    encrypted_password IS NOT NULL as has_password
FROM auth.users
ORDER BY created_at DESC;

-- 3. VÉRIFIER SI DES PROFILS EXISTENT DANS PUBLIC.PROFILES  
SELECT 
    '=== VÉRIFICATION PROFILES ===' as info,
    COUNT(*) as total_profiles
FROM public.profiles;

-- 4. LISTER TOUS LES PROFILS (SI EXISTANTS)
SELECT 
    id,
    email,
    role,
    full_name,
    created_at,
    is_active
FROM public.profiles
ORDER BY created_at DESC;

-- 5. VÉRIFICATION DES TABLES VIDES
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = 0 AND (SELECT COUNT(*) FROM public.profiles) = 0 
        THEN '❌ AUCUN COMPTE TROUVÉ - Les scripts de création n''ont pas fonctionné'
        WHEN (SELECT COUNT(*) FROM auth.users) = 0 
        THEN '❌ PAS D''UTILISATEURS AUTH - Problème création auth.users'
        WHEN (SELECT COUNT(*) FROM public.profiles) = 0
        THEN '❌ PAS DE PROFILS - Problème création public.profiles'
        ELSE '✅ COMPTES DÉTECTÉS'
    END as diagnostic;

-- 6. VÉRIFIER LA STRUCTURE DE LA TABLE PROFILES (COLONNES DISPONIBLES)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 7. VÉRIFIER LES POLITIQUES RLS SUR LA TABLE PROFILES
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- INSTRUCTIONS DE DIAGNOSTIC:
-- 1. Exécutez ce script dans l'éditeur SQL de Supabase avec privilèges service_role
-- 2. Si "AUCUN COMPTE TROUVÉ", les scripts reset + create n'ont pas fonctionné
-- 3. Si "PAS D'UTILISATEURS AUTH", problème dans create-standard-accounts.sql  
-- 4. Si "PAS DE PROFILS", problème de structure ou permissions sur table profiles
-- 5. Vérifiez aussi la structure de la table et les politiques RLS