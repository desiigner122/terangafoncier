-- ======================================================================
-- VÉRIFICATION RAPIDE DES 12 NOUVEAUX COMPTES
-- Test du script corrigé
-- ======================================================================

-- Compter les comptes existants avant création
SELECT 
    '📊 AVANT CRÉATION' as section,
    COUNT(*) as comptes_actuels
FROM auth.users 
WHERE email NOT LIKE '%@test.com';

-- Vérifier si les nouveaux comptes existent déjà
SELECT 
    '⚠️  COMPTES DÉJÀ EXISTANTS' as section,
    COUNT(*) as deja_existants,
    CASE 
        WHEN COUNT(*) > 0 THEN '❌ CERTAINS COMPTES EXISTENT DÉJÀ'
        ELSE '✅ AUCUN CONFLIT'
    END as status
FROM auth.users 
WHERE email IN (
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