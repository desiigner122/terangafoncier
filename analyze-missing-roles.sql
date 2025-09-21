-- ======================================================================
-- ANALYSE DES RÔLES EXISTANTS VS RÔLES ATTENDUS
-- Identification des comptes manquants à créer
-- ======================================================================

-- Vérifier tous les rôles actuellement présents
SELECT 
    '📋 RÔLES ACTUELS DANS LE SYSTÈME' as section,
    COALESCE(raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    COUNT(*) as nombre_comptes,
    STRING_AGG(raw_user_meta_data->>'full_name', ', ' ORDER BY raw_user_meta_data->>'full_name') as utilisateurs
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
GROUP BY raw_user_meta_data->>'role'
ORDER BY 
    CASE COALESCE(raw_user_meta_data->>'role', 'NON DÉFINI')
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

-- Analyser les rôles manquants
SELECT 
    '❌ RÔLES MANQUANTS À CRÉER' as section,
    roles_attendus.role,
    roles_attendus.description,
    '0 comptes' as nombre_actuel,
    '2 comptes recommandés' as a_creer
FROM (
    VALUES 
    ('particulier', 'Citoyens cherchant à acheter des terrains'),
    ('vendeur', 'Propriétaires vendant des terrains'),
    ('promoteur', 'Développeurs immobiliers'),
    ('banque', 'Institutions de financement'),
    ('notaire', 'Professionnels juridiques'),
    ('agent_foncier', 'Agents immobiliers spécialisés')
) AS roles_attendus(role, description)
WHERE NOT EXISTS (
    SELECT 1 
    FROM auth.users u 
    WHERE u.raw_user_meta_data->>'role' = roles_attendus.role
    AND u.email NOT LIKE '%@test.com'
);

-- Résumé de la situation
SELECT 
    '📊 RÉSUMÉ DE LA SITUATION' as section,
    (SELECT COUNT(DISTINCT raw_user_meta_data->>'role') FROM auth.users WHERE email NOT LIKE '%@test.com' AND raw_user_meta_data->>'role' IS NOT NULL) as roles_actuels,
    '10' as roles_cibles,
    (10 - (SELECT COUNT(DISTINCT raw_user_meta_data->>'role') FROM auth.users WHERE email NOT LIKE '%@test.com' AND raw_user_meta_data->>'role' IS NOT NULL)) as roles_manquants;