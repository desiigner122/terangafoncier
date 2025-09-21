-- ======================================================================
-- MIGRATION BASIQUE SANS TRIGGERS PROBLÉMATIQUES  
-- Version minimale qui évite les conflits de triggers
-- ======================================================================

-- ÉTAPE 1: VOIR LA STRUCTURE EXACTE DE public.profiles
SELECT 
    '📋 STRUCTURE public.profiles' as section,
    column_name
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ÉTAPE 2: MIGRATION BASIQUE (colonnes de base uniquement)
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

-- ÉTAPE 3: NETTOYER public.users
DELETE FROM public.users;

-- ÉTAPE 4: VÉRIFIER LES 4 COMPTES CIBLÉS
SELECT 
    '✅ COMPTES MIGRÉS' as section,
    email,
    full_name,
    role,
    'Migré vers public.profiles' as status
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 5: VÉRIFIER QUE LES IDs CORRESPONDENT
SELECT 
    '🔗 CORRESPONDANCE IDs' as section,
    au.email,
    CASE WHEN au.id = pp.id THEN '✅ MATCH' ELSE '❌ PROBLÈME' END as id_status
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn', 
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- ÉTAPE 6: COMPTER TOTAL FINAL
SELECT 
    '📊 MIGRATION TERMINÉE' as section,
    COUNT(*) || ' comptes total dans public.profiles' as total
FROM public.profiles;

-- PRÊT POUR TEST
SELECT 
    '🧪 TESTEZ MAINTENANT' as message,
    'node test-connexions-supabase.js' as commande;