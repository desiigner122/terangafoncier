-- SCRIPT DE VÉRIFICATION DES COMPTES CRÉÉS
-- Ce script affiche tous les comptes utilisateur créés dans Supabase

-- SCRIPT DE VÉRIFICATION DES COMPTES CRÉÉS
-- Ce script affiche tous les comptes utilisateur créés dans Supabase

-- 1. AFFICHER TOUS LES PROFILS CRÉÉS
SELECT 
    p.email,
    p.role,
    p.full_name,
    p.phone,
    CASE WHEN p.is_active THEN 'Actif' ELSE 'Inactif' END as is_active,
    p.created_at
FROM public.profiles p
ORDER BY 
    CASE p.role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

-- 2. STATISTIQUES DES COMPTES
SELECT 
    'TOTAL COMPTES' as statistique,
    COUNT(*)::text as valeur
FROM public.profiles
UNION ALL
SELECT 
    'COMPTES ACTIFS' as statistique,
    COUNT(CASE WHEN is_active THEN 1 END)::text as valeur
FROM public.profiles
UNION ALL
SELECT 
    'ADMINISTRATEURS' as statistique,
    COUNT(CASE WHEN role = 'Admin' THEN 1 END)::text as valeur
FROM public.profiles
UNION ALL
SELECT 
    'VENDEURS (TOUS)' as statistique,
    COUNT(CASE WHEN role LIKE '%Vendeur%' THEN 1 END)::text as valeur
FROM public.profiles
UNION ALL
SELECT 
    'PROFESSIONNELS FONCIER' as statistique,
    COUNT(CASE WHEN role IN ('Notaire','Agent Foncier','Géomètre') THEN 1 END)::text as valeur
FROM public.profiles;

-- 3. VÉRIFIER LA COHÉRENCE AUTH.USERS <-> PROFILES
SELECT 
    u.email as email_auth,
    p.email as email_profile,
    u.raw_user_meta_data->>'role' as role_metadata,
    p.role as role_profile,
    CASE 
        WHEN u.email = p.email AND u.raw_user_meta_data->>'role' = p.role THEN '✅ OK'
        WHEN u.email != p.email THEN '❌ EMAIL DIFFÉRENT'
        WHEN u.raw_user_meta_data->>'role' != p.role THEN '❌ RÔLE DIFFÉRENT'
        ELSE '⚠️ AUTRE PROBLÈME'
    END as status
FROM auth.users u
FULL OUTER JOIN public.profiles p ON u.id = p.id
ORDER BY u.email;

-- 4. COMPTES PAR RÔLE (DÉTAILLÉ)
SELECT 
    role as "Rôle",
    COUNT(*) as "Nombre",
    string_agg(email, ', ' ORDER BY email) as "Emails"
FROM public.profiles 
GROUP BY role
ORDER BY 
    CASE role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

-- 5. DERNIÈRE ACTIVITÉ ET DATES DE CRÉATION
SELECT 
    p.email,
    p.role,
    p.created_at as "Date création profil",
    u.created_at as "Date création auth",
    u.last_sign_in_at as "Dernière connexion",
    CASE 
        WHEN u.last_sign_in_at IS NULL THEN 'Jamais connecté'
        WHEN u.last_sign_in_at > NOW() - INTERVAL '24 hours' THEN 'Récent (24h)'
        WHEN u.last_sign_in_at > NOW() - INTERVAL '7 days' THEN 'Cette semaine'
        ELSE 'Plus ancien'
    END as "Statut connexion"
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC;

-- INSTRUCTIONS D'UTILISATION:
-- 1. Copiez et collez ce script dans l'éditeur SQL de Supabase
-- 2. Assurez-vous d'être connecté avec des privilèges service_role
-- 3. Exécutez le script pour voir toutes les informations sur vos comptes
-- 4. Les résultats sont organisés en 5 sections pour une analyse complète