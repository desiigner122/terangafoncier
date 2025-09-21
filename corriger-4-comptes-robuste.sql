-- ======================================================================
-- CORRECTION SIMPLE DES 4 COMPTES PROBLÉMATIQUES
-- Script qui utilise SEULEMENT des UPDATE (pas d'INSERT/DELETE)
-- ======================================================================

-- COMPTES À CORRIGER:
-- ahmadou.ba@teranga-foncier.sn (particulier)
-- domaine.seck@teranga-foncier.sn (vendeur)
-- financement.boa@teranga-foncier.sn (banque)
-- etude.diouf@teranga-foncier.sn (notaire)

-- 1. VÉRIFICATION AVANT CORRECTION
SELECT 
    '🔍 ÉTAT AVANT CORRECTION' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ PAS DE MOT DE PASSE'
        WHEN LENGTH(encrypted_password) < 10 THEN '⚠️ MOT DE PASSE SUSPECT'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email,
    aud,
    role as auth_role
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- 2. CORRECTION DU MOT DE PASSE
UPDATE auth.users
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND (encrypted_password IS NULL OR LENGTH(encrypted_password) < 10);

-- 3. CONFIRMATION DES EMAILS
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND email_confirmed_at IS NULL;

-- 4. CORRECTION DES CHAMPS MANQUANTS (AUD, ROLE)
UPDATE auth.users
SET 
    aud = 'authenticated',
    role = 'authenticated',
    instance_id = COALESCE(instance_id, '00000000-0000-0000-0000-000000000000'),
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{"provider":"email","providers":["email"]}'),
    updated_at = NOW()
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 5. CORRECTION DES MÉTADONNÉES UTILISATEUR
-- Ahmadou Ba
UPDATE auth.users
SET raw_user_meta_data = '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb
WHERE email = 'ahmadou.ba@teranga-foncier.sn';

-- Domaine Seck
UPDATE auth.users
SET raw_user_meta_data = '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb
WHERE email = 'domaine.seck@teranga-foncier.sn';

-- BOA Sénégal
UPDATE auth.users
SET raw_user_meta_data = '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb
WHERE email = 'financement.boa@teranga-foncier.sn';

-- Étude Diouf
UPDATE auth.users
SET raw_user_meta_data = '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb
WHERE email = 'etude.diouf@teranga-foncier.sn';

-- 6. VÉRIFICATION APRÈS CORRECTION
SELECT 
    '✅ ÉTAT APRÈS CORRECTION' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ PAS DE MOT DE PASSE'
        WHEN LENGTH(encrypted_password) < 10 THEN '⚠️ MOT DE PASSE SUSPECT'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email,
    CASE 
        WHEN aud = 'authenticated' THEN '✅ AUD OK'
        ELSE '❌ AUD MANQUANT'
    END as status_aud,
    CASE 
        WHEN role = 'authenticated' THEN '✅ ROLE AUTH OK'
        ELSE '❌ ROLE AUTH MANQUANT'
    END as status_auth_role
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY raw_user_meta_data->>'role', email;

-- 7. RÉSUMÉ DE CORRECTION
SELECT 
    '📊 RÉSUMÉ FINAL' as section,
    COUNT(*) || '/4 comptes trouvés' as comptes_existants,
    COUNT(CASE WHEN encrypted_password IS NOT NULL AND LENGTH(encrypted_password) >= 10 THEN 1 END) || '/4 mots de passe OK' as passwords_ok,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) || '/4 emails confirmés' as emails_confirmes,
    COUNT(CASE WHEN aud = 'authenticated' THEN 1 END) || '/4 aud OK' as aud_ok,
    COUNT(CASE WHEN role = 'authenticated' THEN 1 END) || '/4 roles auth OK' as roles_ok,
    CASE 
        WHEN COUNT(CASE WHEN encrypted_password IS NOT NULL AND email_confirmed_at IS NOT NULL AND aud = 'authenticated' AND role = 'authenticated' THEN 1 END) = 4
        THEN '🎉 TOUS LES COMPTES SONT CORRIGÉS!'
        ELSE '⚠️ VÉRIFIEZ LES RÉSULTATS CI-DESSUS'
    END as statut_global
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 8. PROCHAINES ÉTAPES
SELECT 
    '🚀 PROCHAINES ÉTAPES' as section,
    'Lancez maintenant le test de connexion:' as instruction,
    'node test-connexions-supabase.js' as commande,
    'Les 4 comptes devraient maintenant fonctionner!' as resultat_attendu
FROM auth.users LIMIT 1;