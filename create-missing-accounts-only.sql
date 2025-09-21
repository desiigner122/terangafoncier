-- ======================================================================
-- CRÉATION INTELLIGENTE DES COMPTES MANQUANTS UNIQUEMENT
-- Ne crée que les comptes qui n'existent pas déjà
-- ======================================================================

-- Créer seulement les comptes qui n'existent pas
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
)
SELECT 
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    new_accounts.email,
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    new_accounts.metadata::jsonb
FROM (
    VALUES 
    ('family.diallo@teranga-foncier.sn', '{"full_name":"Famille Diallo","role":"particulier","phone":"+221 77 123 45 01","organization":"Famille Diallo"}'),
    ('ahmadou.ba@teranga-foncier.sn', '{"full_name":"Ahmadou Ba","role":"particulier","phone":"+221 77 123 45 02","organization":"Particulier"}'),
    ('heritage.fall@teranga-foncier.sn', '{"full_name":"Héritage Fall","role":"vendeur","phone":"+221 77 123 45 03","organization":"Succession Fall"}'),
    ('domaine.seck@teranga-foncier.sn', '{"full_name":"Domaine Seck","role":"vendeur","phone":"+221 77 123 45 04","organization":"Propriété Familiale Seck"}'),
    ('urban.developers@teranga-foncier.sn', '{"full_name":"Urban Developers Sénégal","role":"promoteur","phone":"+221 33 123 45 05","organization":"Urban Developers"}'),
    ('sahel.construction@teranga-foncier.sn', '{"full_name":"Sahel Construction","role":"promoteur","phone":"+221 33 123 45 06","organization":"Sahel Construction SARL"}'),
    ('financement.boa@teranga-foncier.sn', '{"full_name":"BOA Sénégal - Financement","role":"banque","phone":"+221 33 123 45 07","organization":"Bank of Africa Sénégal"}'),
    ('credit.agricole@teranga-foncier.sn', '{"full_name":"Crédit Agricole Sénégal","role":"banque","phone":"+221 33 123 45 08","organization":"Crédit Agricole du Sénégal"}'),
    ('etude.diouf@teranga-foncier.sn', '{"full_name":"Étude Notariale Diouf","role":"notaire","phone":"+221 33 123 45 09","organization":"Étude Me Diouf"}'),
    ('chambre.notaires@teranga-foncier.sn', '{"full_name":"Chambre des Notaires","role":"notaire","phone":"+221 33 123 45 10","organization":"Chambre Régionale des Notaires"}'),
    ('foncier.expert@teranga-foncier.sn', '{"full_name":"Foncier Expert Conseil","role":"agent_foncier","phone":"+221 77 123 45 11","organization":"Cabinet Foncier Expert"}'),
    ('teranga.immobilier@teranga-foncier.sn', '{"full_name":"Teranga Immobilier","role":"agent_foncier","phone":"+221 77 123 45 12","organization":"Agence Teranga Immobilier"}')
) AS new_accounts(email, metadata)
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.email = new_accounts.email
);

-- Vérification des comptes créés
SELECT 
    '✅ NOUVEAUX COMPTES CRÉÉS' as titre,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    '🆕 NOUVEAU' as statut
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
AND created_at > NOW() - INTERVAL '5 minutes'
ORDER BY raw_user_meta_data->>'role', email;

-- Résumé final
SELECT 
    '📊 RÉSUMÉ CRÉATION INTELLIGENTE' as section,
    COUNT(*) || ' comptes présents au total' as total_comptes,
    (SELECT COUNT(*) FROM auth.users WHERE email IN (
        'family.diallo@teranga-foncier.sn', 'ahmadou.ba@teranga-foncier.sn',
        'heritage.fall@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn',
        'urban.developers@teranga-foncier.sn', 'sahel.construction@teranga-foncier.sn',
        'financement.boa@teranga-foncier.sn', 'credit.agricole@teranga-foncier.sn',
        'etude.diouf@teranga-foncier.sn', 'chambre.notaires@teranga-foncier.sn',
        'foncier.expert@teranga-foncier.sn', 'teranga.immobilier@teranga-foncier.sn'
    ) AND created_at > NOW() - INTERVAL '5 minutes') || ' comptes créés maintenant' as nouveaux_comptes,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email IN (
            'family.diallo@teranga-foncier.sn', 'ahmadou.ba@teranga-foncier.sn',
            'heritage.fall@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn',
            'urban.developers@teranga-foncier.sn', 'sahel.construction@teranga-foncier.sn',
            'financement.boa@teranga-foncier.sn', 'credit.agricole@teranga-foncier.sn',
            'etude.diouf@teranga-foncier.sn', 'chambre.notaires@teranga-foncier.sn',
            'foncier.expert@teranga-foncier.sn', 'teranga.immobilier@teranga-foncier.sn'
        )) = 12 THEN '✅ TOUS LES 12 COMPTES PRÉSENTS'
        ELSE '⚠️  CERTAINS COMPTES MANQUENT ENCORE'
    END as status
FROM auth.users 
WHERE email NOT LIKE '%@test.com';