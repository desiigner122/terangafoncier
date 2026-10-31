-- ======================================================================
-- VÉRIFICATION SIMPLE DE TOUS LES COMPTES CRÉÉS
-- Affichage complet de tous les utilisateurs et leurs rôles
-- ======================================================================

SELECT '🔍 === VÉRIFICATION DE TOUS LES COMPTES EXISTANTS ===' as titre;

-- ======================================================================
-- SECTION 1: TOUS LES COMPTES AVEC DÉTAILS COMPLETS
-- ======================================================================

SELECT 
    '👥 === TOUS LES COMPTES UTILISATEURS ===' as section,
    '' as separator;

SELECT 
    u.email,
    u.raw_user_meta_data->>'full_name' as nom_complet,
    u.raw_user_meta_data->>'role' as role,
    u.created_at as date_creation,
    u.email_confirmed_at IS NOT NULL as email_confirme,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profil créé'
        ELSE '❌ Profil manquant'
    END as status_profil
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email NOT LIKE '%@test.com' -- Exclure les comptes de test
ORDER BY 
    CASE u.raw_user_meta_data->>'role'
        WHEN 'admin' THEN 1
        WHEN 'particulier' THEN 2
        WHEN 'vendeur' THEN 3
        WHEN 'promoteur' THEN 4
        WHEN 'banque' THEN 5
        WHEN 'notaire' THEN 6
        WHEN 'agent_foncier' THEN 7
        WHEN 'mairie' THEN 8
        WHEN 'investisseur' THEN 9
        WHEN 'geometre' THEN 10
        ELSE 11
    END,
    u.email;

-- ======================================================================
-- SECTION 2: FOCUS SUR LES NOUVEAUX COMPTES CRÉÉS AUJOURD'HUI
-- ======================================================================

SELECT 
    '🆕 === NOUVEAUX COMPTES CRÉÉS AUJOURD''HUI ===' as section,
    '' as separator;

SELECT 
    u.email,
    u.raw_user_meta_data->>'full_name' as nom_complet,
    u.raw_user_meta_data->>'role' as role,
    u.created_at as date_creation,
    EXTRACT(EPOCH FROM (NOW() - u.created_at))/60 as minutes_depuis_creation,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profil créé'
        ELSE '❌ Profil manquant'
    END as status_profil
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at >= CURRENT_DATE -- Créés aujourd'hui
  AND u.email NOT LIKE '%@test.com'
ORDER BY u.created_at DESC;

-- ======================================================================
-- SECTION 3: STATISTIQUES PAR RÔLE
-- ======================================================================

SELECT 
    '📊 === STATISTIQUES PAR RÔLE ===' as section,
    '' as separator;

SELECT 
    COALESCE(u.raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    COUNT(*) as nombre_comptes,
    COUNT(p.id) as profils_crees,
    ROUND((COUNT(p.id)::numeric / COUNT(*)) * 100, 1) as pourcentage_profils,
    MIN(u.created_at) as premier_compte,
    MAX(u.created_at) as dernier_compte
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email NOT LIKE '%@test.com'
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY 
    CASE COALESCE(u.raw_user_meta_data->>'role', 'NON DÉFINI')
        WHEN 'admin' THEN 1
        WHEN 'particulier' THEN 2
        WHEN 'vendeur' THEN 3
        WHEN 'promoteur' THEN 4
        WHEN 'banque' THEN 5
        WHEN 'notaire' THEN 6
        WHEN 'agent_foncier' THEN 7
        WHEN 'mairie' THEN 8
        WHEN 'investisseur' THEN 9
        WHEN 'geometre' THEN 10
        ELSE 11
    END;

-- ======================================================================
-- SECTION 4: VÉRIFICATION SPÉCIFIQUE DES 6 NOUVEAUX COMPTES
-- ======================================================================

SELECT 
    '🎯 === VÉRIFICATION DES 6 NOUVEAUX COMPTES ===' as section,
    '' as separator;

SELECT 
    email,
    CASE 
        WHEN email = 'mairie.dakar@teranga-foncier.sn' THEN 'Mairie de Dakar'
        WHEN email = 'mairie.thies@teranga-foncier.sn' THEN 'Mairie de Thiès'
        WHEN email = 'fonds.souverain@teranga-foncier.sn' THEN 'Fonds Souverain'
        WHEN email = 'atlantique.capital@teranga-foncier.sn' THEN 'Atlantique Capital'
        WHEN email = 'cabinet.ndiaye@teranga-foncier.sn' THEN 'Cabinet Ndiaye'
        WHEN email = 'geowest.africa@teranga-foncier.sn' THEN 'GeoWest Africa'
        ELSE 'AUTRE'
    END as compte_attendu,
    raw_user_meta_data->>'full_name' as nom_reel,
    raw_user_meta_data->>'role' as role,
    '✅ TROUVÉ' as status,
    CASE email
        WHEN 'mairie.dakar@teranga-foncier.sn' THEN 1
        WHEN 'mairie.thies@teranga-foncier.sn' THEN 2
        WHEN 'fonds.souverain@teranga-foncier.sn' THEN 3
        WHEN 'atlantique.capital@teranga-foncier.sn' THEN 4
        WHEN 'cabinet.ndiaye@teranga-foncier.sn' THEN 5
        WHEN 'geowest.africa@teranga-foncier.sn' THEN 6
        ELSE 99
    END as ordre_tri
FROM auth.users 
WHERE email IN (
    'mairie.dakar@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'geowest.africa@teranga-foncier.sn'
)

UNION ALL

-- Vérifier les comptes manquants
SELECT 
    comptes_attendus.email,
    comptes_attendus.nom as compte_attendu,
    NULL as nom_reel,
    NULL as role,
    '❌ MANQUANT' as status,
    CASE comptes_attendus.email
        WHEN 'mairie.dakar@teranga-foncier.sn' THEN 1
        WHEN 'mairie.thies@teranga-foncier.sn' THEN 2
        WHEN 'fonds.souverain@teranga-foncier.sn' THEN 3
        WHEN 'atlantique.capital@teranga-foncier.sn' THEN 4
        WHEN 'cabinet.ndiaye@teranga-foncier.sn' THEN 5
        WHEN 'geowest.africa@teranga-foncier.sn' THEN 6
        ELSE 99
    END as ordre_tri
FROM (
    VALUES 
    ('mairie.dakar@teranga-foncier.sn', 'Mairie de Dakar'),
    ('mairie.thies@teranga-foncier.sn', 'Mairie de Thiès'),
    ('fonds.souverain@teranga-foncier.sn', 'Fonds Souverain'),
    ('atlantique.capital@teranga-foncier.sn', 'Atlantique Capital'),
    ('cabinet.ndiaye@teranga-foncier.sn', 'Cabinet Ndiaye'),
    ('geowest.africa@teranga-foncier.sn', 'GeoWest Africa')
) AS comptes_attendus(email, nom)
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.email = comptes_attendus.email
)

ORDER BY ordre_tri;

-- ======================================================================
-- SECTION 5: RÉSUMÉ FINAL
-- ======================================================================

SELECT 
    '✨ === RÉSUMÉ FINAL ===' as section,
    '' as separator;

WITH stats AS (
    SELECT 
        COUNT(*) as total_comptes,
        COUNT(DISTINCT raw_user_meta_data->>'role') as roles_distincts,
        SUM(CASE WHEN raw_user_meta_data->>'role' IN ('mairie', 'investisseur', 'geometre') THEN 1 ELSE 0 END) as nouveaux_roles,
        SUM(CASE WHEN email IN ('mairie.dakar@teranga-foncier.sn', 'mairie.thies@teranga-foncier.sn', 'fonds.souverain@teranga-foncier.sn', 'atlantique.capital@teranga-foncier.sn', 'cabinet.ndiaye@teranga-foncier.sn', 'geowest.africa@teranga-foncier.sn') THEN 1 ELSE 0 END) as six_comptes_crees
    FROM auth.users 
    WHERE email NOT LIKE '%@test.com'
)
SELECT 
    'Total comptes: ' || total_comptes as info,
    'Rôles distincts: ' || roles_distincts || '/10' as roles,
    'Nouveaux rôles: ' || nouveaux_roles || ' comptes' as nouveaux,
    'Six comptes ciblés: ' || six_comptes_crees || '/6 créés' as verification,
    CASE 
        WHEN six_comptes_crees = 6 THEN '✅ MISSION ACCOMPLIE'
        ELSE '⚠️ Vérifier les comptes manquants'
    END as status_final
FROM stats;

SELECT '🎉 === FIN DE LA VÉRIFICATION ===' as fin;