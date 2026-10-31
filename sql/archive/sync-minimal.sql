-- ======================================================================
-- SYNCHRONISATION MINIMALE : SEULEMENT AJOUTER LES COMPTES MANQUANTS
-- Éviter les suppressions qui déclenchent les triggers FK
-- ======================================================================

-- ÉTAPE 1: VOIR QUELS COMPTES MANQUENT DANS public.users
SELECT 
    'COMPTES MANQUANTS DANS public.users' as section,
    pp.email,
    pp.id,
    'MANQUE dans public.users' as statut
FROM public.profiles pp
LEFT JOIN public.users pu ON pp.id = pu.id
WHERE pu.id IS NULL
ORDER BY pp.email;

-- ÉTAPE 2: AJOUTER SEULEMENT LES COMPTES MANQUANTS (SANS SUPPRIMER)
INSERT INTO public.users (id, email, created_at)
SELECT 
    pp.id, 
    pp.email, 
    pp.created_at
FROM public.profiles pp
LEFT JOIN public.users pu ON pp.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ÉTAPE 3: VÉRIFICATION - LES 4 COMPTES SONT-ILS MAINTENANT DANS public.users ?
SELECT 
    'VÉRIFICATION FINALE' as section,
    email,
    id,
    '✅ MAINTENANT DANS public.users' as statut
FROM public.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- ÉTAPE 4: COMPTER TOTAL DANS public.users
SELECT 
    'TOTAL public.users' as section,
    COUNT(*) as total_comptes
FROM public.users;

-- ÉTAPE 5: CORRESPONDANCE PARFAITE auth.users <-> public.users ?
SELECT 
    'CORRESPONDANCE auth ↔ users' as section,
    au.email,
    au.id as auth_id,
    pu.id as users_id,
    CASE WHEN au.id = pu.id THEN '✅ OK' ELSE '❌ DIFFÉRENT' END as correspondance
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
WHERE au.email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;