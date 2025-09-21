-- ======================================================================
-- CRÉATION DES PROFILS POUR LES COMPTES RESTANTS
-- Script à exécuter APRÈS la création des comptes
-- ======================================================================

-- Créer les profils pour tous les nouveaux comptes
INSERT INTO public.profiles (
    id, email, full_name, role, phone, organization, created_at, updated_at
) 
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'role',
    u.raw_user_meta_data->>'phone',
    u.raw_user_meta_data->>'organization',
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email IN (
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
)
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- Vérification des profils créés
SELECT 
    '✅ PROFILS CRÉÉS AVEC SUCCÈS' as section,
    p.email,
    p.full_name,
    p.role,
    p.organization,
    '✅ PROFIL OK' as statut
FROM public.profiles p
WHERE p.email IN (
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
)
ORDER BY p.role, p.email;

-- Résumé des profils créés par rôle
SELECT 
    '📊 RÉSUMÉ PAR RÔLE' as section,
    p.role,
    COUNT(*) as nombre_profils,
    STRING_AGG(p.full_name, ', ' ORDER BY p.full_name) as utilisateurs
FROM public.profiles p
WHERE p.email IN (
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
)
GROUP BY p.role
ORDER BY p.role;

-- Vérification finale du système complet
SELECT 
    '🎯 SYSTÈME COMPLET' as section,
    COUNT(DISTINCT p.role) as roles_total,
    COUNT(*) as comptes_total,
    '✅ SYSTÈME OPÉRATIONNEL' as statut
FROM public.profiles p;