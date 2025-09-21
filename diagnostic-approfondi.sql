-- ======================================================================
-- DIAGNOSTIC APPROFONDI DES COMPTES PROBLÉMATIQUES
-- Analyse détaillée de la structure des comptes qui ne marchent pas
-- ======================================================================

-- COMPTES QUI MARCHENT (pour comparaison)
SELECT 
    '✅ COMPTES FONCTIONNELS - STRUCTURE DE RÉFÉRENCE' as section,
    email,
    id,
    instance_id,
    aud,
    role,
    encrypted_password IS NOT NULL as has_password,
    LENGTH(encrypted_password) as password_length,
    email_confirmed_at IS NOT NULL as email_confirmed,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at::date as created_date
FROM auth.users 
WHERE email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
)
ORDER BY email
LIMIT 2; -- Juste 2 pour comparaison

-- COMPTES QUI NE MARCHENT PAS (analyse détaillée)
SELECT 
    '❌ COMPTES PROBLÉMATIQUES - ANALYSE COMPLÈTE' as section,
    email,
    id,
    instance_id,
    aud,
    role,
    encrypted_password IS NOT NULL as has_password,
    CASE WHEN encrypted_password IS NOT NULL THEN LENGTH(encrypted_password) ELSE NULL END as password_length,
    email_confirmed_at IS NOT NULL as email_confirmed,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at::date as created_date,
    updated_at::date as updated_date,
    is_super_admin,
    phone
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- COMPARAISON CHAMP PAR CHAMP
SELECT 
    '🔍 COMPARAISON DÉTAILLÉE' as section,
    'Fonctionnel' as type_compte,
    COUNT(*) as total,
    COUNT(CASE WHEN instance_id IS NOT NULL THEN 1 END) as avec_instance_id,
    COUNT(CASE WHEN aud IS NOT NULL THEN 1 END) as avec_aud,
    COUNT(CASE WHEN role IS NOT NULL THEN 1 END) as avec_role,
    COUNT(CASE WHEN encrypted_password IS NOT NULL THEN 1 END) as avec_password,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as avec_email_confirmed,
    COUNT(CASE WHEN raw_app_meta_data IS NOT NULL THEN 1 END) as avec_app_metadata,
    COUNT(CASE WHEN raw_user_meta_data IS NOT NULL THEN 1 END) as avec_user_metadata
FROM auth.users 
WHERE email IN ('geowest.africa@teranga-foncier.sn', 'cabinet.ndiaye@teranga-foncier.sn')

UNION ALL

SELECT 
    '🔍 COMPARAISON DÉTAILLÉE' as section,
    'Problématique' as type_compte,
    COUNT(*) as total,
    COUNT(CASE WHEN instance_id IS NOT NULL THEN 1 END) as avec_instance_id,
    COUNT(CASE WHEN aud IS NOT NULL THEN 1 END) as avec_aud,
    COUNT(CASE WHEN role IS NOT NULL THEN 1 END) as avec_role,
    COUNT(CASE WHEN encrypted_password IS NOT NULL THEN 1 END) as avec_password,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as avec_email_confirmed,
    COUNT(CASE WHEN raw_app_meta_data IS NOT NULL THEN 1 END) as avec_app_metadata,
    COUNT(CASE WHEN raw_user_meta_data IS NOT NULL THEN 1 END) as avec_user_metadata
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- VÉRIFICATION DES TABLES LIÉES
SELECT 
    '🔗 VÉRIFICATION TABLES LIÉES' as section,
    'auth.users' as table_name,
    COUNT(*) || ' comptes problématiques trouvés' as resultat
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- Vérifier si il y a des profils publics
SELECT 
    '🔗 PROFILS PUBLICS' as section,
    'public.profiles' as table_name,
    COUNT(*) || ' profils trouvés' as resultat
FROM public.profiles 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- ANALYSE DES DIFFÉRENCES CRITIQUES
SELECT 
    '⚡ DIFFÉRENCES CRITIQUES' as section,
    email,
    CASE 
        WHEN instance_id IS NULL THEN '❌ INSTANCE_ID MANQUANT'
        WHEN instance_id != '00000000-0000-0000-0000-000000000000' THEN '⚠️ INSTANCE_ID DIFFÉRENT'
        ELSE '✅ INSTANCE_ID OK'
    END as instance_status,
    CASE 
        WHEN aud IS NULL THEN '❌ AUD MANQUANT'
        WHEN aud != 'authenticated' THEN '⚠️ AUD INCORRECT: ' || aud
        ELSE '✅ AUD OK'
    END as aud_status,
    CASE 
        WHEN role IS NULL THEN '❌ ROLE MANQUANT'
        WHEN role != 'authenticated' THEN '⚠️ ROLE INCORRECT: ' || role
        ELSE '✅ ROLE OK'
    END as role_status,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ PASSWORD MANQUANT'
        WHEN LENGTH(encrypted_password) < 50 THEN '⚠️ PASSWORD TROP COURT'
        ELSE '✅ PASSWORD OK'
    END as password_status
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- RECOMMANDATIONS
SELECT 
    '💡 RECOMMANDATIONS' as section,
    'Les comptes problématiques ont probablement été créés différemment' as probleme,
    'Il faut les supprimer et les recréer avec la même méthode que les comptes fonctionnels' as solution,
    'Ou identifier la différence structurelle exacte et la corriger' as alternative
FROM auth.users LIMIT 1;