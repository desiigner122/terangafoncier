-- ======================================================================
-- VISUALISATION DE TOUS LES COMPTES CRÉÉS
-- Script pour voir l'état actuel de tous les utilisateurs
-- ======================================================================

-- 1. Vue d'ensemble par rôle
SELECT 
    '🎯 COMPTES PAR RÔLE' as section,
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

-- 2. Liste détaillée de tous les comptes
SELECT 
    '📋 TOUS LES COMPTES DÉTAILLÉS' as section,
    u.raw_user_meta_data->>'role' as role,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom_complet,
    u.raw_user_meta_data->>'phone' as telephone,
    u.raw_user_meta_data->>'organization' as organisation,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ CONFIRMÉ'
        ELSE '❌ NON CONFIRMÉ'
    END as email_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = u.id) THEN '✅ PROFIL OK'
        ELSE '❌ PROFIL MANQUANT'
    END as profil_status,
    u.created_at::date as date_creation
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com'
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

-- 3. Vérification des 12 comptes spécifiques (nouveaux)
SELECT 
    '✅ NOUVEAUX COMPTES (12)' as section,
    CASE 
        WHEN email = 'family.diallo@teranga-foncier.sn' THEN '1. Famille Diallo (Particulier)'
        WHEN email = 'ahmadou.ba@teranga-foncier.sn' THEN '2. Ahmadou Ba (Particulier)'
        WHEN email = 'heritage.fall@teranga-foncier.sn' THEN '3. Héritage Fall (Vendeur)'
        WHEN email = 'domaine.seck@teranga-foncier.sn' THEN '4. Domaine Seck (Vendeur)'
        WHEN email = 'urban.developers@teranga-foncier.sn' THEN '5. Urban Developers (Promoteur)'
        WHEN email = 'sahel.construction@teranga-foncier.sn' THEN '6. Sahel Construction (Promoteur)'
        WHEN email = 'financement.boa@teranga-foncier.sn' THEN '7. BOA Sénégal (Banque)'
        WHEN email = 'credit.agricole@teranga-foncier.sn' THEN '8. Crédit Agricole (Banque)'
        WHEN email = 'etude.diouf@teranga-foncier.sn' THEN '9. Étude Diouf (Notaire)'
        WHEN email = 'chambre.notaires@teranga-foncier.sn' THEN '10. Chambre Notaires (Notaire)'
        WHEN email = 'foncier.expert@teranga-foncier.sn' THEN '11. Foncier Expert (Agent Foncier)'
        WHEN email = 'teranga.immobilier@teranga-foncier.sn' THEN '12. Teranga Immobilier (Agent Foncier)'
        ELSE 'AUTRE COMPTE'
    END as compte,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅'
        ELSE '❌'
    END as confirme
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
)
ORDER BY email;

-- 4. Statistiques générales
SELECT 
    '📊 STATISTIQUES SYSTÈME' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com') as total_comptes,
    (SELECT COUNT(DISTINCT raw_user_meta_data->>'role') FROM auth.users WHERE email NOT LIKE '%@test.com') as total_roles,
    (SELECT COUNT(*) FROM public.profiles) as total_profils,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com') >= 20 THEN '✅ SYSTÈME COMPLET'
        ELSE '🔄 EN COURS - ' || (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com') || ' comptes'
    END as statut_systeme;

-- 5. Comptes manquants (si il y en a)
SELECT 
    '❌ COMPTES MANQUANTS' as section,
    missing_account as compte_manquant,
    'NON TROUVÉ' as statut
FROM (
    SELECT 'family.diallo@teranga-foncier.sn' as missing_account
    UNION ALL SELECT 'ahmadou.ba@teranga-foncier.sn'
    UNION ALL SELECT 'heritage.fall@teranga-foncier.sn'
    UNION ALL SELECT 'domaine.seck@teranga-foncier.sn'
    UNION ALL SELECT 'urban.developers@teranga-foncier.sn'
    UNION ALL SELECT 'sahel.construction@teranga-foncier.sn'
    UNION ALL SELECT 'financement.boa@teranga-foncier.sn'
    UNION ALL SELECT 'credit.agricole@teranga-foncier.sn'
    UNION ALL SELECT 'etude.diouf@teranga-foncier.sn'
    UNION ALL SELECT 'chambre.notaires@teranga-foncier.sn'
    UNION ALL SELECT 'foncier.expert@teranga-foncier.sn'
    UNION ALL SELECT 'teranga.immobilier@teranga-foncier.sn'
) missing
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.email = missing.missing_account
);

-- 6. Résumé final avec compteurs
SELECT 
    '🎉 RÉSUMÉ FINAL' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email IN (
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
    )) || '/12 nouveaux comptes créés' as nouveaux_comptes,
    (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com') as total_comptes_systeme,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email IN (
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
        )) = 12 THEN '✅ MISSION ACCOMPLIE - 12/12 COMPTES CRÉÉS'
        ELSE '🔄 EN COURS - ' || (SELECT COUNT(*) FROM auth.users WHERE email IN (
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
        )) || '/12 COMPTES CRÉÉS'
    END as statut_mission;