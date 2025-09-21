-- ======================================================================
-- CRÉATION MINIMALISTE DES PROFILS
-- Version ultra-simple avec colonnes de base seulement
-- ======================================================================

-- Créer les profils avec les colonnes essentielles uniquement
INSERT INTO public.profiles (
    id, email, full_name, role
) 
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'role'
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
    '✅ PROFILS CRÉÉS (VERSION MINIMALE)' as section,
    p.email,
    p.full_name,
    p.role,
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

-- Résumé final
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    COUNT(*) || ' profils créés' as resultat,
    CASE 
        WHEN COUNT(*) = 12 THEN '✅ TOUS LES PROFILS CRÉÉS'
        ELSE '❌ PROFILS MANQUANTS: ' || (12 - COUNT(*))
    END as status
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
);