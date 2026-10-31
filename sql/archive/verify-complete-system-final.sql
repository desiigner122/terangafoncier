-- ======================================================================
-- VÉRIFICATION COMPLÈTE DE TOUS LES COMPTES
-- Script pour vérifier l'état final du système
-- ======================================================================

-- 1. Vue d'ensemble de tous les rôles
SELECT 
    '🎯 TOUS LES RÔLES DU SYSTÈME' as section,
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

-- 2. Vérification des 12 nouveaux comptes spécifiquement
SELECT 
    '✅ NOUVEAUX COMPTES CRÉÉS' as section,
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
    END as compte,
    email,
    raw_user_meta_data->>'full_name' as nom_complet,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ CONFIRMÉ'
        ELSE '❌ NON CONFIRMÉ'
    END as email_status,
    '✅ TROUVÉ' as status
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

-- 3. Vérification des profils correspondants
SELECT 
    '👤 PROFILS CRÉÉS' as section,
    p.email,
    p.full_name,
    p.role,
    COALESCE(p.phone, 'N/A') as telephone,
    '✅ PROFIL OK' as status
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

-- 4. Résumé des 12 nouveaux comptes
SELECT 
    '📊 RÉSUMÉ NOUVEAUX COMPTES' as section,
    COUNT(*) || '/12 comptes trouvés' as auth_users,
    COALESCE((SELECT COUNT(*) FROM public.profiles WHERE email IN (
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
    )), 0) || '/12 profils créés' as profiles,
    CASE 
        WHEN COUNT(*) = 12 THEN '✅ TOUS CRÉÉS'
        ELSE '❌ MANQUANTS: ' || (12 - COUNT(*))
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

-- 5. État final du système complet
SELECT 
    '🎯 SYSTÈME COMPLET FINAL' as section,
    COUNT(DISTINCT u.raw_user_meta_data->>'role') as roles_total,
    COUNT(*) as comptes_total,
    (SELECT COUNT(*) FROM public.profiles) as profils_total,
    '✅ SYSTÈME OPÉRATIONNEL' as statut
FROM auth.users u
WHERE u.email NOT LIKE '%@test.com';

-- 6. Liste finale de tous les utilisateurs par rôle
SELECT 
    '📋 LISTE FINALE COMPLÈTE' as section,
    u.raw_user_meta_data->>'role' as role,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅'
        ELSE '❌'
    END as email_confirme,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = u.id) THEN '✅'
        ELSE '❌'
    END as profil_cree
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