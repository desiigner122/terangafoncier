-- ======================================================================
-- VÉRIFICATION RAPIDE DES 6 NOUVEAUX COMPTES
-- Contrôle spécifique des comptes créés automatiquement
-- ======================================================================

-- Vérification des 6 comptes spécifiques
SELECT 
    '🎯 VÉRIFICATION DES 6 NOUVEAUX COMPTES' as verification,
    CASE 
        WHEN email = 'mairie.dakar@teranga-foncier.sn' THEN '1. Mairie de Dakar'
        WHEN email = 'mairie.thies@teranga-foncier.sn' THEN '2. Mairie de Thiès'
        WHEN email = 'fonds.souverain@teranga-foncier.sn' THEN '3. Fonds Souverain'
        WHEN email = 'atlantique.capital@teranga-foncier.sn' THEN '4. Atlantique Capital'
        WHEN email = 'cabinet.ndiaye@teranga-foncier.sn' THEN '5. Cabinet Ndiaye'
        WHEN email = 'geowest.africa@teranga-foncier.sn' THEN '6. GeoWest Africa'
    END as compte,
    email,
    raw_user_meta_data->>'full_name' as nom_reel,
    raw_user_meta_data->>'role' as role,
    '✅ TROUVÉ' as status
FROM auth.users 
WHERE email IN (
    'mairie.dakar@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'geowest.africa@teranga-foncier.sn'
)
ORDER BY email;

-- Compter les résultats
SELECT 
    '📊 RÉSUMÉ' as titre,
    COUNT(*) || '/6 comptes trouvés' as resultat,
    CASE 
        WHEN COUNT(*) = 6 THEN '✅ TOUS LES COMPTES CRÉÉS'
        ELSE '❌ COMPTES MANQUANTS: ' || (6 - COUNT(*))
    END as status
FROM auth.users 
WHERE email IN (
    'mairie.dakar@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'geowest.africa@teranga-foncier.sn'
);