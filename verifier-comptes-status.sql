-- ======================================================================
-- VÉRIFICATION : LES COMPTES ONT-ILS ÉTÉ RECRÉÉS ?
-- ======================================================================

-- Vérifier si les 4 comptes existent encore (avant recréation)
SELECT 
    '🔍 VÉRIFICATION EXISTENCE' as section,
    COUNT(*) || ' comptes trouvés dans auth.users' as resultat
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- Si les comptes existent, voir leur structure actuelle
SELECT 
    '❌ STRUCTURE ACTUELLE DES COMPTES PROBLÉMATIQUES' as section,
    email,
    id,
    instance_id,
    aud,
    role,
    encrypted_password IS NOT NULL as has_password,
    email_confirmed_at IS NOT NULL as email_confirmed,
    raw_app_meta_data IS NOT NULL as has_app_metadata,
    raw_user_meta_data IS NOT NULL as has_user_metadata,
    created_at::date as created_date
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- Comparaison avec un compte qui marche
SELECT 
    '✅ STRUCTURE DU COMPTE FONCTIONNEL (RÉFÉRENCE)' as section,
    email,
    id,
    instance_id,
    aud,
    role,
    encrypted_password IS NOT NULL as has_password,
    email_confirmed_at IS NOT NULL as email_confirmed,
    raw_app_meta_data IS NOT NULL as has_app_metadata,
    raw_user_meta_data IS NOT NULL as has_user_metadata,
    created_at::date as created_date
FROM auth.users 
WHERE email = 'geowest.africa@teranga-foncier.sn';

-- Diagnostic des différences critiques
SELECT 
    '⚡ DIAGNOSTIC DES DIFFÉRENCES CRITIQUES' as section,
    email,
    CASE 
        WHEN instance_id IS NULL THEN '❌ INSTANCE_ID MANQUANT'
        WHEN instance_id != '00000000-0000-0000-0000-000000000000' THEN '⚠️ INSTANCE_ID: ' || instance_id
        ELSE '✅ INSTANCE_ID OK'
    END as instance_status,
    CASE 
        WHEN aud IS NULL THEN '❌ AUD MANQUANT'
        WHEN aud != 'authenticated' THEN '⚠️ AUD: ' || aud
        ELSE '✅ AUD OK'
    END as aud_status,
    CASE 
        WHEN role IS NULL THEN '❌ ROLE MANQUANT'  
        WHEN role != 'authenticated' THEN '⚠️ ROLE: ' || role
        ELSE '✅ ROLE OK'
    END as role_status
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;