-- ======================================================================
-- MIGRATION ULTRA-SIMPLE : CORRECTION ROLES ET MIGRATION
-- Version sans complexité, directe et efficace
-- ======================================================================

-- ÉTAPE 1: VOIR LES RÔLES EXISTANTS DANS public.profiles (qui marchent)
SELECT 
    '✅ RÔLES QUI MARCHENT' as section,
    role,
    COUNT(*) as nb_comptes
FROM public.profiles
WHERE role IS NOT NULL
GROUP BY role
ORDER BY role;

-- ÉTAPE 2: MIGRATION SIMPLE AVEC MAPPING CORRECT DES RÔLES
INSERT INTO public.profiles (id, email, full_name, role, phone, created_at, updated_at)
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
    pu.created_at,
    NOW()
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE NOT EXISTS (SELECT 1 FROM public.profiles pp WHERE pp.email = pu.email)
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- ÉTAPE 3: SUPPRIMER public.users (maintenant inutiles)
DELETE FROM public.users;

-- ÉTAPE 4: VÉRIFICATION - COMPTES MIGRÉS
SELECT 
    '✅ COMPTES MIGRÉS' as section,
    email,
    full_name,
    role
FROM public.profiles 
WHERE email LIKE '%teranga-foncier.sn'
AND email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 5: COMPTER TOTAL
SELECT 
    '📊 TOTAL FINAL' as section,
    COUNT(*) || ' comptes dans public.profiles' as total
FROM public.profiles;

-- ÉTAPE 6: VERIFICATION IDS
SELECT 
    '🔗 VÉRIFICATION IDs' as section,
    au.email,
    CASE WHEN au.id = pp.id THEN '✅ OK' ELSE '❌ PROBLÈME' END as status
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- TEST MAINTENANT
SELECT 
    '🚀 READY TO TEST' as action,
    'node test-connexions-supabase.js' as commande;