-- ======================================================================
-- DIAGNOSTIC CONTRAINTES ET MIGRATION SÉCURISÉE
-- Découvrir les contraintes avant migration
-- ======================================================================

-- ÉTAPE 1: ANALYSER LES CONTRAINTES SUR public.profiles
SELECT 
    '🔒 CONTRAINTES public.profiles' as section,
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'profiles' 
AND tc.table_schema = 'public'
AND tc.constraint_type = 'CHECK';

-- ÉTAPE 2: VOIR LES RÔLES AUTORISÉS DANS LES COMPTES FONCTIONNELS
SELECT 
    '✅ RÔLES FONCTIONNELS AUTORISÉS' as section,
    role,
    COUNT(*) as nb_comptes
FROM public.profiles
GROUP BY role
ORDER BY role;

-- ÉTAPE 3: VOIR LES RÔLES DANS LES COMPTES À MIGRER
SELECT 
    '❌ RÔLES À MIGRER' as section,
    au.raw_user_meta_data->>'role' as role_source,
    COUNT(*) as nb_comptes
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.email NOT IN (SELECT COALESCE(email, '') FROM public.profiles)
GROUP BY au.raw_user_meta_data->>'role'
ORDER BY au.raw_user_meta_data->>'role';

-- ÉTAPE 4: MAPPING DES RÔLES (corriger les valeurs incorrectes)
SELECT 
    '🔄 MAPPING RÔLES' as section,
    au.email,
    au.raw_user_meta_data->>'role' as role_original,
    CASE 
        WHEN au.raw_user_meta_data->>'role' = 'particular' THEN 'particulier'
        WHEN au.raw_user_meta_data->>'role' = 'promoteur' THEN 'promoteur'
        WHEN au.raw_user_meta_data->>'role' = 'vendeur' THEN 'vendeur'
        WHEN au.raw_user_meta_data->>'role' = 'banque' THEN 'banque'
        WHEN au.raw_user_meta_data->>'role' = 'notaire' THEN 'notaire'
        WHEN au.raw_user_meta_data->>'role' = 'agent_foncier' THEN 'agent_foncier'
        WHEN au.raw_user_meta_data->>'role' = 'geometre' THEN 'geometre'
        WHEN au.raw_user_meta_data->>'role' = 'investisseur' THEN 'investisseur'
        WHEN au.raw_user_meta_data->>'role' = 'mairie' THEN 'mairie'
        WHEN au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
        ELSE au.raw_user_meta_data->>'role'
    END as role_corrige
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.email NOT IN (SELECT COALESCE(email, '') FROM public.profiles)
ORDER BY au.email;

-- ÉTAPE 5: MIGRATION AVEC CORRECTION DES RÔLES
INSERT INTO public.profiles (id, email, full_name, role, phone, created_at, updated_at)
SELECT 
    pu.id,
    pu.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    CASE 
        WHEN au.raw_user_meta_data->>'role' = 'particular' THEN 'particulier'
        WHEN au.raw_user_meta_data->>'role' = 'promoteur' THEN 'promoteur'  
        WHEN au.raw_user_meta_data->>'role' = 'vendeur' THEN 'vendeur'
        WHEN au.raw_user_meta_data->>'role' = 'banque' THEN 'banque'
        WHEN au.raw_user_meta_data->>'role' = 'notaire' THEN 'notaire'
        WHEN au.raw_user_meta_data->>'role' = 'agent_foncier' THEN 'agent_foncier'
        WHEN au.raw_user_meta_data->>'role' = 'geometre' THEN 'geometre'
        WHEN au.raw_user_meta_data->>'role' = 'investisseur' THEN 'investisseur'
        WHEN au.raw_user_meta_data->>'role' = 'mairie' THEN 'mairie'
        WHEN au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
        ELSE 'particulier' -- Valeur par défaut sécurisée
    END as role,
    au.raw_user_meta_data->>'phone' as phone,
    pu.created_at,
    NOW() as updated_at
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
WHERE pu.email NOT IN (SELECT COALESCE(email, '') FROM public.profiles)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = EXCLUDED.updated_at;

-- ÉTAPE 6: NETTOYER public.users
DELETE FROM public.users 
WHERE email IN (SELECT email FROM public.profiles WHERE email IS NOT NULL);

-- ÉTAPE 7: VÉRIFICATION FINALE
SELECT 
    '✅ MIGRATION AVEC CORRECTION RÔLES' as section,
    email,
    full_name,
    role,
    phone,
    '✅ MIGRÉ' as status
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'family.diallo@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 8: COMPTER TOUS LES PROFILS
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    'Total profiles: ' || COUNT(*) as total,
    'Public.users restants: ' || (SELECT COUNT(*) FROM public.users) as users_restants
FROM public.profiles;

-- TEST FINAL
SELECT 
    '🧪 PRÊT POUR TEST' as action,
    'node test-connexions-supabase.js' as commande,
    'Tous les comptes devraient maintenant être dans public.profiles!' as resultat;