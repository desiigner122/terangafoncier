-- ======================================================================
-- DIAGNOSTIC ULTRA-POUSSÉ : ANALYSER TOUTES LES TABLES LIÉES
-- Identifier la vraie différence entre comptes fonctionnels et défaillants
-- ======================================================================

-- 1. LISTER TOUTES LES TABLES DE LA BASE
SELECT 
    '🗂️ TOUTES LES TABLES' as section,
    schemaname,
    tablename,
    'SELECT COUNT(*) FROM ' || schemaname || '.' || tablename as count_query
FROM pg_tables 
WHERE schemaname IN ('auth', 'public')
ORDER BY schemaname, tablename;

-- 2. ANALYSER TOUTES LES RELATIONS POSSIBLES AVEC auth.users
SELECT 
    '🔗 RELATIONS auth.users' as section,
    t.table_schema,
    t.table_name,
    c.column_name,
    c.data_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE c.column_name LIKE '%user%' 
   OR c.column_name LIKE '%id%'
   OR c.column_name = 'email'
   OR c.data_type = 'uuid'
ORDER BY t.table_schema, t.table_name, c.column_name;

-- 3. VÉRIFICATION SPÉCIFIQUE : public.profiles
SELECT 
    '📋 STRUCTURE public.profiles' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. COMPTER LES ENTRÉES DANS public.profiles
SELECT 
    '📋 COMPTES DANS public.profiles' as section,
    'Problématiques' as type,
    COUNT(*) as total
FROM public.profiles
WHERE id IN (
    SELECT id FROM auth.users WHERE email IN (
        'ahmadou.ba@teranga-foncier.sn',
        'domaine.seck@teranga-foncier.sn',
        'financement.boa@teranga-foncier.sn',
        'etude.diouf@teranga-foncier.sn'
    )
);

SELECT 
    '📋 COMPTES DANS public.profiles' as section,
    'Fonctionnels' as type,
    COUNT(*) as total
FROM public.profiles
WHERE id IN (
    SELECT id FROM auth.users WHERE email IN (
        'geowest.africa@teranga-foncier.sn',
        'cabinet.ndiaye@teranga-foncier.sn'
    )
);

-- 5. COMPARAISON DÉTAILLÉE public.profiles
SELECT 
    '❌ PROFILES PROBLÉMATIQUES' as section,
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.phone,
    p.created_at::date as created_date
FROM public.profiles p
WHERE p.id IN (
    SELECT id FROM auth.users WHERE email IN (
        'ahmadou.ba@teranga-foncier.sn',
        'domaine.seck@teranga-foncier.sn',
        'financement.boa@teranga-foncier.sn',
        'etude.diouf@teranga-foncier.sn'
    )
)
ORDER BY p.email;

SELECT 
    '✅ PROFILES FONCTIONNELS' as section,
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.phone,
    p.created_at::date as created_date
FROM public.profiles p
WHERE p.id IN (
    SELECT id FROM auth.users WHERE email IN (
        'geowest.africa@teranga-foncier.sn',
        'cabinet.ndiaye@teranga-foncier.sn'
    )
)
ORDER BY p.email;

-- 6. RECHERCHER LES TABLES AVEC LES IDs DES COMPTES PROBLÉMATIQUES
SELECT 
    '🕵️ RECHERCHE DANS TOUTES LES TABLES' as section,
    'Recherche des IDs des comptes problématiques dans toute la base' as description;

-- Obtenir les IDs des comptes problématiques
SELECT 
    '🆔 IDs DES COMPTES PROBLÉMATIQUES' as section,
    email,
    id
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- Obtenir les IDs des comptes fonctionnels
SELECT 
    '🆔 IDs DES COMPTES FONCTIONNELS' as section,
    email,
    id
FROM auth.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn'
)
ORDER BY email;

-- 7. DIAGNOSTIC FINAL : PERMISSIONS ET POLICIES RLS
SELECT 
    '🔒 ROW LEVEL SECURITY' as section,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN 'RLS ACTIVÉ' ELSE 'RLS DÉSACTIVÉ' END as rls_status
FROM pg_tables 
WHERE schemaname IN ('auth', 'public')
ORDER BY schemaname, tablename;