-- ======================================================================
-- MIGRATION CORRECTIVE : SYNCHRONISER LES IDs
-- Corriger les IDs dans public.profiles pour qu'ils correspondent à auth.users
-- ======================================================================

-- ÉTAPE 1: DIAGNOSTIC PRÉ-CORRECTION
SELECT 
    '🔍 AVANT CORRECTION' as section,
    au.email,
    au.id as auth_id,
    pp.id as profiles_id,
    CASE WHEN au.id = pp.id THEN '✅ OK' ELSE '❌ À CORRIGER' END as statut
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- ÉTAPE 2: SUPPRESSION DES ENTRÉES INCORRECTES DANS public.profiles
DELETE FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- ÉTAPE 3: INSERTION AVEC LES BONS IDs DEPUIS auth.users
INSERT INTO public.profiles (id, email, full_name, role, phone, created_at)
SELECT 
    au.id,  -- UTILISER L'ID DE auth.users (CRITIQUE !)
    au.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.raw_user_meta_data->>'role' as role,
    au.raw_user_meta_data->>'phone' as phone,
    au.created_at
FROM auth.users au
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

-- ÉTAPE 4: VÉRIFICATION POST-CORRECTION
SELECT 
    '✅ APRÈS CORRECTION' as section,
    au.email,
    au.id as auth_id,
    pp.id as profiles_id,
    CASE WHEN au.id = pp.id THEN '✅ PARFAIT' ELSE '❌ ENCORE UN PROBLÈME' END as statut,
    pp.full_name,
    pp.role,
    pp.phone
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email AND au.id = pp.id
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- ÉTAPE 5: COMPTER TOUS LES COMPTES AVEC IDs CORRESPONDANTS
SELECT 
    '📊 RÉSULTAT FINAL' as section,
    COUNT(*) as comptes_avec_ids_corrects
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email AND au.id = pp.id
WHERE au.email LIKE '%@teranga%';

-- ÉTAPE 6: MIGRATION TERMINÉE
-- Test recommandé: node test-connexions-supabase.js
-- Attendu: 10/20 connexions minimum (4 comptes corrigés + 6 qui fonctionnaient)