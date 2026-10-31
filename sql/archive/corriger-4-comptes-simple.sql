-- ======================================================================
-- CORRECTION SIMPLE DES 4 COMPTES PROBLÉMATIQUES
-- Script qui utilise seulement des UPDATE (pas d'INSERT)
-- ======================================================================

-- COMPTES À CORRIGER:
-- ahmadou.ba@teranga-foncier.sn (particulier)
-- domaine.seck@teranga-foncier.sn (vendeur)
-- financement.boa@teranga-foncier.sn (banque)
-- etude.diouf@teranga-foncier.sn (notaire)

-- 1. VÉRIFICATION DE L'EXISTENCE DES COMPTES
SELECT 
    '🔍 COMPTES AVANT CORRECTION' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    CASE 
        WHEN encrypted_password IS NULL THEN '❌ PAS DE MOT DE PASSE'
        WHEN LENGTH(encrypted_password) < 10 THEN '⚠️ MOT DE PASSE SUSPECT'
        ELSE '✅ MOT DE PASSE OK'
    END as status_password_avant,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMÉ'
        ELSE '❌ EMAIL NON CONFIRMÉ'
    END as status_email_avant
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 2. CORRECTION DES MOTS DE PASSE POUR LES 4 COMPTES
UPDATE auth.users
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND (encrypted_password IS NULL OR LENGTH(encrypted_password) < 10);

-- Vérification de la correction des mots de passe
SELECT 
    '🔐 MOTS DE PASSE CORRIGÉS' as section,
    COUNT(*) || ' mots de passe mis à jour' as resultat
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND encrypted_password IS NOT NULL
AND LENGTH(encrypted_password) >= 10;

-- 3. CORRECTION DES EMAILS NON CONFIRMÉS
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND email_confirmed_at IS NULL;

-- Vérification de la correction des emails
SELECT 
    '📧 EMAILS CONFIRMÉS' as section,
    COUNT(*) || ' emails confirmés' as resultat
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
AND email_confirmed_at IS NOT NULL;

-- 4. CORRECTION DES MÉTADONNÉES (AU CAS OÙ)
UPDATE auth.users
SET 
    raw_user_meta_data = CASE email
        WHEN 'ahmadou.ba@teranga-foncier.sn' THEN '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'::jsonb
        WHEN 'domaine.seck@teranga-foncier.sn' THEN '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'::jsonb
        WHEN 'financement.boa@teranga-foncier.sn' THEN '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'::jsonb
        WHEN 'etude.diouf@teranga-foncier.sn' THEN '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'::jsonb
    END,
    raw_app_meta_data = '{"provider":"email","providers":["email"]}',
    aud = 'authenticated',
    role = 'authenticated',
    instance_id = '00000000-0000-0000-0000-000000000000',
    updated_at = NOW()
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 5. VÉRIFICATION FINALE
SELECT 
    '✅ COMPTES APRÈS CORRECTION' as section,
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
    CASE WHEN aud = 'authenticated' THEN '✅ AUD OK' ELSE '❌ AUD PROBLÈME' END as aud_status,
    CASE WHEN role = 'authenticated' THEN '✅ ROLE OK' ELSE '❌ ROLE PROBLÈME' END as role_status
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
)
ORDER BY email;

-- 6. RÉSUMÉ FINAL
SELECT 
    '🎯 RÉSUMÉ CORRECTION' as section,
    COUNT(*) || '/4 comptes trouvés' as comptes_existants,
    COUNT(CASE WHEN encrypted_password IS NOT NULL AND LENGTH(encrypted_password) >= 10 THEN 1 END) || '/4 avec mot de passe valide' as avec_password,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) || '/4 emails confirmés' as emails_confirmes,
    COUNT(CASE WHEN aud = 'authenticated' AND role = 'authenticated' THEN 1 END) || '/4 avec auth correcte' as auth_correcte,
    CASE 
        WHEN COUNT(*) = 4 AND 
             COUNT(CASE WHEN encrypted_password IS NOT NULL AND LENGTH(encrypted_password) >= 10 THEN 1 END) = 4 AND
             COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) = 4 AND
             COUNT(CASE WHEN aud = 'authenticated' AND role = 'authenticated' THEN 1 END) = 4
        THEN '🎉 TOUS LES 4 COMPTES SONT CORRIGÉS!'
        ELSE '⚠️ VÉRIFIEZ LES RÉSULTATS CI-DESSUS'
    END as statut_final
FROM auth.users 
WHERE email IN (
    'ahmadou.ba@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn'
);

-- 7. INSTRUCTIONS FINALES
SELECT 
    '🧪 PROCHAINES ÉTAPES' as section,
    'Testez maintenant la connexion:' as instruction,
    'node test-connexions-supabase.js' as commande,
    'Les 4 comptes devraient passer de "Database error" à "SUCCÈS"' as resultat_attendu,
    'password123' as mot_de_passe
FROM auth.users LIMIT 1;