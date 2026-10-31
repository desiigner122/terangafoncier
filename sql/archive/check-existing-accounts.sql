-- ======================================================================
-- VÉRIFICATION DES COMPTES EXISTANTS
-- Identifier quels comptes existent déjà pour éviter les doublons
-- ======================================================================

-- Vérifier quels comptes des 12 nouveaux existent déjà
SELECT 
    '⚠️  COMPTES DÉJÀ EXISTANTS' as section,
    email,
    raw_user_meta_data->>'full_name' as nom,
    raw_user_meta_data->>'role' as role,
    '❌ DÉJÀ EXISTE' as status
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

-- Identifier les comptes manquants
SELECT 
    '✅ COMPTES À CRÉER' as section,
    missing_emails.email,
    missing_emails.full_name,
    missing_emails.role,
    '🆕 À CRÉER' as status
FROM (
    VALUES 
    ('family.diallo@teranga-foncier.sn', 'Famille Diallo', 'particulier'),
    ('ahmadou.ba@teranga-foncier.sn', 'Ahmadou Ba', 'particulier'),
    ('heritage.fall@teranga-foncier.sn', 'Héritage Fall', 'vendeur'),
    ('domaine.seck@teranga-foncier.sn', 'Domaine Seck', 'vendeur'),
    ('urban.developers@teranga-foncier.sn', 'Urban Developers Sénégal', 'promoteur'),
    ('sahel.construction@teranga-foncier.sn', 'Sahel Construction', 'promoteur'),
    ('financement.boa@teranga-foncier.sn', 'BOA Sénégal - Financement', 'banque'),
    ('credit.agricole@teranga-foncier.sn', 'Crédit Agricole Sénégal', 'banque'),
    ('etude.diouf@teranga-foncier.sn', 'Étude Notariale Diouf', 'notaire'),
    ('chambre.notaires@teranga-foncier.sn', 'Chambre des Notaires', 'notaire'),
    ('foncier.expert@teranga-foncier.sn', 'Foncier Expert Conseil', 'agent_foncier'),
    ('teranga.immobilier@teranga-foncier.sn', 'Teranga Immobilier', 'agent_foncier')
) AS missing_emails(email, full_name, role)
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.email = missing_emails.email
)
ORDER BY missing_emails.role, missing_emails.email;

-- Résumé de la situation
SELECT 
    '📊 RÉSUMÉ DE LA SITUATION' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email IN (
        'family.diallo@teranga-foncier.sn', 'ahmadou.ba@teranga-foncier.sn',
        'heritage.fall@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn',
        'urban.developers@teranga-foncier.sn', 'sahel.construction@teranga-foncier.sn',
        'financement.boa@teranga-foncier.sn', 'credit.agricole@teranga-foncier.sn',
        'etude.diouf@teranga-foncier.sn', 'chambre.notaires@teranga-foncier.sn',
        'foncier.expert@teranga-foncier.sn', 'teranga.immobilier@teranga-foncier.sn'
    )) || '/12 comptes existent déjà' as existants,
    (12 - (SELECT COUNT(*) FROM auth.users WHERE email IN (
        'family.diallo@teranga-foncier.sn', 'ahmadou.ba@teranga-foncier.sn',
        'heritage.fall@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn',
        'urban.developers@teranga-foncier.sn', 'sahel.construction@teranga-foncier.sn',
        'financement.boa@teranga-foncier.sn', 'credit.agricole@teranga-foncier.sn',
        'etude.diouf@teranga-foncier.sn', 'chambre.notaires@teranga-foncier.sn',
        'foncier.expert@teranga-foncier.sn', 'teranga.immobilier@teranga-foncier.sn'
    ))) || ' comptes à créer' as a_creer;
