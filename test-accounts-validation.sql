-- ======================================================================
-- TEST ET VALIDATION DES COMPTES CRÉÉS
-- Script de vérification rapide
-- ======================================================================

-- Vérifier la structure de la table profiles
SELECT 
    '=== STRUCTURE TABLE PROFILES ===' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Vérifier les utilisateurs existants par rôle
SELECT 
    '=== COMPTES PAR RÔLE ===' as status;

SELECT 
    COALESCE(u.raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    COUNT(*) as nombre_comptes
FROM auth.users u
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY COUNT(*) DESC;

-- Vérifier si les emails existent déjà
SELECT 
    '=== VÉRIFICATION DES EMAILS À CRÉER ===' as status;

WITH emails_to_create AS (
    SELECT email FROM (VALUES 
        ('amadou.diop@email.com'),
        ('fatou.sall@email.com'),
        ('ibrahima.ba@terangafoncier.sn'),
        ('mariama.sy@terangafoncier.sn'),
        ('cheikh.tall@groupetall.sn'),
        ('aissatou.ndiaye@ndiayeconstruct.sn'),
        ('credit.immobilier@cbao.sn'),
        ('habitat@ecobank.sn'),
        ('pape.seck@notaire.sn'),
        ('aminata.toure@notaire.sn'),
        ('oumar.kane@domaines.gouv.sn'),
        ('bineta.niang@domaines.gouv.sn')
    ) AS t(email)
)
SELECT 
    e.email,
    CASE 
        WHEN u.email IS NOT NULL THEN '✅ EXISTE DÉJÀ'
        ELSE '🆕 À CRÉER'
    END as status
FROM emails_to_create e
LEFT JOIN auth.users u ON e.email = u.email
ORDER BY e.email;

-- Diagnostic général
SELECT 
    '=== DIAGNOSTIC GÉNÉRAL ===' as status;

SELECT 
    'Utilisateurs dans auth.users' as table_name,
    COUNT(*) as total_records
FROM auth.users
UNION ALL
SELECT 
    'Profils dans public.profiles' as table_name,
    COUNT(*) as total_records
FROM public.profiles
UNION ALL
SELECT 
    'Profils orphelins (sans utilisateur)' as table_name,
    COUNT(*) as total_records
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL
UNION ALL
SELECT 
    'Utilisateurs sans profil' as table_name,
    COUNT(*) as total_records
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;