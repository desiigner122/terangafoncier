-- DIAGNOSTIC ET CORRECTION DU PROFIL ADMIN
-- Ce script identifie et corrige le problème de profil

-- 1. Vérifier si l'entrée existe dans public.profiles
SELECT 
    '=== DIAGNOSTIC PROFIL ===' as info;

SELECT 
    'Utilisateur dans auth.users:' as check_type,
    COUNT(*) as count,
    string_agg(email, ', ') as emails
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';

SELECT 
    'Utilisateur dans public.profiles:' as check_type,
    COUNT(*) as count,
    string_agg(email, ', ') as emails
FROM public.profiles 
WHERE email = 'admin@terangafoncier.sn';

-- 2. Voir la structure de la table profiles
SELECT 
    '=== STRUCTURE TABLE PROFILES ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Voir le contenu actuel du profil s'il existe
SELECT 
    '=== CONTENU PROFIL ACTUEL ===' as info;

SELECT *
FROM public.profiles 
WHERE email = 'admin@terangafoncier.sn'
LIMIT 1;