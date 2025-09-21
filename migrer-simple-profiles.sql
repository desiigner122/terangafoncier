-- ======================================================================
-- MIGRATION SIMPLE : DE public.users VERS public.profiles
-- Version adaptative qui s'ajuste à la structure réelle
-- ======================================================================

-- ÉTAPE 1: DÉCOUVRIR LA STRUCTURE EXACTE DE public.profiles
SELECT 
    '📋 STRUCTURE RÉELLE public.profiles' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ÉTAPE 2: VOIR LA STRUCTURE D'UN COMPTE FONCTIONNEL
SELECT 
    '✅ EXEMPLE FONCTIONNEL' as section,
    *
FROM public.profiles 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- ÉTAPE 3: COMPTES À MIGRER
SELECT 
    '🚚 COMPTES À MIGRER' as section,
    pu.email,
    'Dans public.users' as localisation,
    'Sera migré vers public.profiles' as action
FROM public.users pu
WHERE pu.email NOT IN (SELECT COALESCE(email, '') FROM public.profiles)
ORDER BY pu.email;

-- ÉTAPE 4: MIGRATION BASIQUE (colonnes de base uniquement)
INSERT INTO public.profiles (id, email, created_at)
SELECT 
    pu.id,
    pu.email,
    pu.created_at
FROM public.users pu
WHERE pu.email NOT IN (SELECT COALESCE(email, '') FROM public.profiles)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- ÉTAPE 5: METTRE À JOUR AVEC LES MÉTADONNÉES DE auth.users (si les colonnes existent)
-- Mise à jour conditionnelle basée sur les colonnes disponibles
UPDATE public.profiles 
SET 
    full_name = COALESCE(au.raw_user_meta_data->>'full_name', full_name),
    updated_at = NOW()
FROM auth.users au
WHERE public.profiles.id = au.id
AND au.raw_user_meta_data->>'full_name' IS NOT NULL;

-- Mise à jour du rôle si la colonne existe
UPDATE public.profiles 
SET role = au.raw_user_meta_data->>'role'
FROM auth.users au
WHERE public.profiles.id = au.id
AND au.raw_user_meta_data->>'role' IS NOT NULL
AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'role' 
    AND table_schema = 'public'
);

-- Mise à jour du téléphone si la colonne existe  
UPDATE public.profiles 
SET phone = au.raw_user_meta_data->>'phone'
FROM auth.users au
WHERE public.profiles.id = au.id
AND au.raw_user_meta_data->>'phone' IS NOT NULL
AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'phone' 
    AND table_schema = 'public'
);

-- ÉTAPE 6: NETTOYER public.users  
DELETE FROM public.users 
WHERE email IN (SELECT email FROM public.profiles WHERE email IS NOT NULL);

-- ÉTAPE 7: VÉRIFICATION FINALE
SELECT 
    '✅ MIGRATION TERMINÉE' as section,
    COUNT(*) || ' comptes dans public.profiles' as total
FROM public.profiles;

-- ÉTAPE 8: CORRESPONDANCE PARFAITE
SELECT 
    '🔗 VÉRIFICATION IDs' as section,
    au.email,
    au.id as auth_id,
    pp.id as profile_id,
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

-- TEST FINAL
SELECT 
    '🧪 MAINTENANT TESTEZ' as action,
    'node test-connexions-supabase.js' as commande,
    '20/20 connexions attendues!' as resultat;