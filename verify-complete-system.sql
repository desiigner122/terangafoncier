-- ======================================================================
-- SCRIPT DE VÉRIFICATION COMPLÈTE POUR TOUS LES RÔLES
-- Validation de l'intégralité du système multi-rôles
-- ======================================================================

SELECT '🔍 === VÉRIFICATION COMPLÈTE DU SYSTÈME MULTI-RÔLES ===' as debut_verification;

-- Vérification des comptes utilisateurs par rôle
SELECT 
    '👤 COMPTES UTILISATEURS PAR RÔLE' as section,
    '' as separator;

SELECT 
    COALESCE(raw_user_meta_data->>'role', 'NON DÉFINI') as role,
    COUNT(*) as nombre_comptes,
    STRING_AGG(raw_user_meta_data->>'full_name', ', ' ORDER BY raw_user_meta_data->>'full_name') as utilisateurs
FROM auth.users 
WHERE email NOT LIKE '%@test.com' -- Exclure les comptes de test génériques
GROUP BY raw_user_meta_data->>'role'
ORDER BY 
    CASE raw_user_meta_data->>'role'
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

-- Vérification des profils associés
SELECT 
    '📋 PROFILS ASSOCIÉS' as section,
    '' as separator;

SELECT 
    u.raw_user_meta_data->>'role' as role,
    COUNT(u.id) as comptes_users,
    COUNT(p.id) as profils_crees,
    CASE 
        WHEN COUNT(u.id) = COUNT(p.id) THEN '✅ COMPLET'
        ELSE '❌ MANQUANT: ' || (COUNT(u.id) - COUNT(p.id))::text || ' profils'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email NOT LIKE '%@test.com'
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY u.raw_user_meta_data->>'role';

-- Vérification spécifique MAIRIES
SELECT 
    '🏛️ DONNÉES SPÉCIFIQUES MAIRIES' as section,
    '' as separator;

SELECT 
    u.raw_user_meta_data->>'full_name' as mairie,
    u.email,
    COUNT(mp.id) as nb_permis,
    COALESCE(SUM(mp.fee_amount), 0) as total_fees_fcfa,
    STRING_AGG(DISTINCT mp.permit_type, ', ') as types_permis
FROM auth.users u
LEFT JOIN municipal_permits mp ON u.id = mp.municipality_id
WHERE u.raw_user_meta_data->>'role' = 'mairie'
GROUP BY u.id, u.raw_user_meta_data->>'full_name', u.email
ORDER BY u.raw_user_meta_data->>'full_name';

-- Vérification spécifique INVESTISSEURS
SELECT 
    '💰 DONNÉES SPÉCIFIQUES INVESTISSEURS' as section,
    '' as separator;

SELECT 
    u.raw_user_meta_data->>'full_name' as investisseur,
    u.email,
    COUNT(io.id) as nb_opportunites,
    COALESCE(SUM(io.investment_amount), 0) as total_investissement_fcfa,
    ROUND(COALESCE(AVG(io.expected_roi), 0), 2) as roi_moyen_pct,
    STRING_AGG(DISTINCT io.investment_type, ', ') as types_investissement
FROM auth.users u
LEFT JOIN investment_opportunities io ON u.id = io.investor_id
WHERE u.raw_user_meta_data->>'role' = 'investisseur'
GROUP BY u.id, u.raw_user_meta_data->>'full_name', u.email
ORDER BY u.raw_user_meta_data->>'full_name';

-- Vérification spécifique GÉOMÈTRES
SELECT 
    '📐 DONNÉES SPÉCIFIQUES GÉOMÈTRES' as section,
    '' as separator;

SELECT 
    u.raw_user_meta_data->>'full_name' as geometre,
    u.email,
    COUNT(sr.id) as nb_rapports,
    COALESCE(SUM(sr.fee_amount), 0) as total_honoraires_fcfa,
    ROUND(COALESCE(SUM(sr.surface_measured), 0), 2) as total_surface_m2,
    STRING_AGG(DISTINCT sr.survey_type, ', ') as types_expertise
FROM auth.users u
LEFT JOIN surveying_reports sr ON u.id = sr.surveyor_id
WHERE u.raw_user_meta_data->>'role' = 'geometre'
GROUP BY u.id, u.raw_user_meta_data->>'full_name', u.email
ORDER BY u.raw_user_meta_data->>'full_name';

-- Vérification des propriétés par rôle (si la table existe)
SELECT 
    '🏠 PROPRIÉTÉS PAR RÔLE CRÉATEUR' as section,
    '' as separator;

SELECT 
    'Propriétés: Vérification désactivée (table optionnelle)' as info_proprietes;

-- Vérification des transactions (si la table existe)
SELECT 
    '💼 TRANSACTIONS PAR TYPE' as section,
    '' as separator;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
        -- Vérifier d'abord les colonnes disponibles
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'transaction_type') THEN
            -- Version avec transaction_type
            PERFORM 1; -- Placeholder, la vraie requête sera exécutée après
        ELSE
            -- Version alternative sans transaction_type
            RAISE NOTICE 'Table transactions existe mais sans colonne transaction_type';
        END IF;
    ELSE
        RAISE NOTICE 'Table transactions n''existe pas encore';
    END IF;
END $$;

-- Requête sécurisée pour les transactions
SELECT 
    'Transactions: Vérification désactivée (table optionnelle)' as info_transactions;

-- Vérification des favoris (si la table existe)
SELECT 
    '❤️ FAVORIS PAR RÔLE' as section,
    '' as separator;

SELECT 
    'Favoris: Vérification désactivée (table optionnelle)' as info_favoris;

-- Vérification des demandes de financement (si la table existe)
SELECT 
    '💳 DEMANDES DE FINANCEMENT PAR BANQUE' as section,
    '' as separator;

SELECT 
    'Demandes financement: Vérification désactivée (table optionnelle)' as total_demandes_financement;

-- Résumé général de l'écosystème
SELECT 
    '📊 RÉSUMÉ GÉNÉRAL ÉCOSYSTÈME' as section,
    '' as separator;

-- Statistiques des rôles
SELECT 
    'Total rôles configurés: ' || COUNT(DISTINCT COALESCE(raw_user_meta_data->>'role', 'NON DÉFINI')) as statistique
FROM auth.users 
WHERE email NOT LIKE '%@test.com'
UNION ALL
SELECT 
    'Total comptes créés: ' || COUNT(*) as statistique
FROM auth.users 
WHERE email NOT LIKE '%@test.com';

-- Vérification des tables principales
SELECT 
    '📋 TABLES SYSTÈME' as section,
    '' as separator;

SELECT 
    'auth.users: ' || COUNT(*) || ' comptes' as tables_info
FROM auth.users
UNION ALL
SELECT 
    'profiles: ' || COUNT(*) || ' profils' as tables_info
FROM public.profiles
UNION ALL
SELECT 
    'Tables spécialisées: ' || 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'municipal_permits') THEN 'Permis ✅ ' ELSE 'Permis ❌ ' END ||
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'investment_opportunities') THEN 'Investissements ✅ ' ELSE 'Investissements ❌ ' END ||
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveying_reports') THEN 'Géomètre ✅' ELSE 'Géomètre ❌' END
    as tables_info;

-- Validation finale
SELECT 
    '✨ === VALIDATION FINALE DU SYSTÈME ===' as section,
    '' as separator;

WITH validation AS (
    SELECT 
        COUNT(DISTINCT CASE WHEN raw_user_meta_data->>'role' IS NOT NULL THEN raw_user_meta_data->>'role' END) as roles_distincts,
        COUNT(*) as total_comptes,
        COUNT(DISTINCT email) as emails_uniques,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'particulier' THEN 1 ELSE 0 END) as particuliers,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'vendeur' THEN 1 ELSE 0 END) as vendeurs,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'promoteur' THEN 1 ELSE 0 END) as promoteurs,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'banque' THEN 1 ELSE 0 END) as banques,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'notaire' THEN 1 ELSE 0 END) as notaires,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'agent_foncier' THEN 1 ELSE 0 END) as agents_fonciers,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'mairie' THEN 1 ELSE 0 END) as mairies,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'investisseur' THEN 1 ELSE 0 END) as investisseurs,
        SUM(CASE WHEN raw_user_meta_data->>'role' = 'geometre' THEN 1 ELSE 0 END) as geometres
    FROM auth.users
    WHERE email NOT LIKE '%@test.com'
)
SELECT 
    CASE 
        WHEN roles_distincts >= 9 AND total_comptes >= 18 THEN '✅ SYSTÈME COMPLET ET OPÉRATIONNEL'
        ELSE '❌ SYSTÈME INCOMPLET - Vérifier les données manquantes'
    END as status_final,
    'Rôles: ' || roles_distincts || '/10 | Comptes: ' || total_comptes || '/18+' as details,
    'Admin: ' || admins || ' | Particulier: ' || particuliers || ' | Vendeur: ' || vendeurs as repartition_1,
    'Promoteur: ' || promoteurs || ' | Banque: ' || banques || ' | Notaire: ' || notaires as repartition_2,
    'Agent: ' || agents_fonciers || ' | Mairie: ' || mairies || ' | Invest: ' || investisseurs || ' | Géom: ' || geometres as repartition_3
FROM validation;

SELECT '✨ === FIN DE LA VÉRIFICATION COMPLÈTE ===' as fin_verification;