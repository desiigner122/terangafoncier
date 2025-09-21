-- ======================================================================
-- SYNCHRONISATION FORCÉE : CRÉER LES ENTRÉES MANQUANTES DANS public.users
-- Résoudre définitivement le problème "Database error querying schema"
-- ======================================================================

-- ÉTAPE 1: VÉRIFIER LES COMPTES MANQUANTS DANS public.users
SELECT 
    '🚨 COMPTES MANQUANTS DANS public.users' as section,
    au.email,
    au.id as auth_id,
    CASE WHEN pu.id IS NULL THEN '❌ MANQUANT' ELSE '✅ PRÉSENT' END as status_public_users
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND pu.id IS NULL;

-- ÉTAPE 2: DÉCOUVRIR LA STRUCTURE EXACTE DE public.users
SELECT 
    '📋 STRUCTURE public.users' as section,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- ÉTAPE 3: CRÉER LES ENTRÉES MANQUANTES DANS public.users
-- Utiliser la même structure qu'un compte fonctionnel

-- Découvrir d'abord un exemple fonctionnel
SELECT 
    '✅ MODÈLE FONCTIONNEL public.users' as section,
    *
FROM public.users 
WHERE email = 'geowest.africa@teranga-foncier.sn'
LIMIT 1;

-- ÉTAPE 4: INSERTION FORCÉE (ajuster selon la structure découverte)
-- 1. Ahmadou Ba
INSERT INTO public.users (id, email, created_at)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'ahmadou.ba@teranga-foncier.sn'
AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = au.email);

-- 2. Domaine Seck  
INSERT INTO public.users (id, email, created_at)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'domaine.seck@teranga-foncier.sn'
AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = au.email);

-- 3. BOA Sénégal
INSERT INTO public.users (id, email, created_at)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'financement.boa@teranga-foncier.sn'
AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = au.email);

-- 4. Étude Diouf
INSERT INTO public.users (id, email, created_at)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'etude.diouf@teranga-foncier.sn'
AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = au.email);

-- ÉTAPE 5: VÉRIFICATION FINALE
SELECT 
    '✅ VÉRIFICATION POST-SYNCHRONISATION' as section,
    au.email,
    au.id as auth_id,
    pu.id as public_id,
    CASE WHEN au.id = pu.id THEN '✅ SYNCHRONISÉ' ELSE '❌ PROBLÈME' END as status
FROM auth.users au
INNER JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- ÉTAPE 6: COMPTER TOUS LES COMPTES SYNCHRONISÉS
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    'Total auth.users: ' || (SELECT COUNT(*) FROM auth.users) as auth_total,
    'Total public.users: ' || (SELECT COUNT(*) FROM public.users) as public_total,
    'Comptes synchronisés: ' || (
        SELECT COUNT(*) 
        FROM auth.users au 
        INNER JOIN public.users pu ON au.id = pu.id
    ) as synchronises
FROM auth.users LIMIT 1;

-- INSTRUCTIONS FINALES
SELECT 
    '🧪 TEST MAINTENANT' as action,
    'node test-connexions-supabase.js' as commande,
    'Résultat attendu: 20/20 connexions réussies (100%)' as objectif
FROM auth.users LIMIT 1;