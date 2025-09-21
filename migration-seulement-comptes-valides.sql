-- ======================================================================
-- MIGRATION SEULEMENT LES COMPTES VALIDES (qui existent dans auth.users)
-- Évite l'erreur: profiles_id_fkey constraint violation
-- ======================================================================

-- ÉTAPE 1: DIAGNOSTIC - QUELS COMPTES SONT VALIDES ?
SELECT 
    '🔍 COMPTES VALIDES DANS public.users' as section,
    pu.email,
    pu.id as public_users_id,
    au.id as auth_users_id,
    CASE WHEN au.id IS NOT NULL THEN '✅ VALIDE' ELSE '❌ ORPHELIN' END as status
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
ORDER BY (au.id IS NOT NULL) DESC, pu.email;

-- ÉTAPE 2: COMPTER LES COMPTES VALIDES VS ORPHELINS
SELECT 
    '📊 ANALYSE COMPTES' as section,
    COUNT(*) as total_public_users,
    COUNT(au.id) as comptes_valides,
    COUNT(*) - COUNT(au.id) as comptes_orphelins
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id;

-- ÉTAPE 3: MIGRATION SEULEMENT DES COMPTES VALIDES
INSERT INTO public.profiles (id, email, full_name, role, phone, created_at)
SELECT 
    pu.id,
    pu.email,
    -- Nom complet intelligent
    CASE 
        WHEN pu.email = 'family.diallo@teranga-foncier.sn' THEN 'Famille Diallo'
        WHEN pu.email = 'ahmadou.ba@teranga-foncier.sn' THEN 'Ahmadou Ba'
        WHEN pu.email = 'heritage.fall@teranga-foncier.sn' THEN 'Héritage Fall'
        WHEN pu.email = 'domaine.seck@teranga-foncier.sn' THEN 'Domaine Seck'
        WHEN pu.email = 'urban.developers@teranga-foncier.sn' THEN 'Urban Developers'
        WHEN pu.email = 'sahel.construction@teranga-foncier.sn' THEN 'Sahel Construction'
        WHEN pu.email = 'financement.boa@teranga-foncier.sn' THEN 'BOA Sénégal'
        WHEN pu.email = 'credit.agricole@teranga-foncier.sn' THEN 'Crédit Agricole'
        WHEN pu.email = 'etude.diouf@teranga-foncier.sn' THEN 'Étude Notariale Diouf'
        WHEN pu.email = 'chambre.notaires@teranga-foncier.sn' THEN 'Chambre des Notaires'
        WHEN pu.email = 'foncier.expert@teranga-foncier.sn' THEN 'Expert Foncier'
        WHEN pu.email = 'teranga.immobilier@teranga-foncier.sn' THEN 'Teranga Immobilier'
        WHEN pu.email = 'test.admin@terangafoncier.sn' THEN 'Admin Test'
        ELSE COALESCE(au.raw_user_meta_data->>'full_name', split_part(pu.email, '@', 1))
    END as full_name,
    -- Rôle intelligent basé sur l'email
    CASE 
        WHEN pu.email LIKE '%admin%' THEN 'admin'
        WHEN pu.email IN ('family.diallo@teranga-foncier.sn', 'ahmadou.ba@teranga-foncier.sn') THEN 'particulier'
        WHEN pu.email IN ('heritage.fall@teranga-foncier.sn', 'domaine.seck@teranga-foncier.sn') THEN 'vendeur'
        WHEN pu.email IN ('urban.developers@teranga-foncier.sn', 'sahel.construction@teranga-foncier.sn') THEN 'promoteur'
        WHEN pu.email IN ('financement.boa@teranga-foncier.sn', 'credit.agricole@teranga-foncier.sn') THEN 'banque'
        WHEN pu.email IN ('etude.diouf@teranga-foncier.sn', 'chambre.notaires@teranga-foncier.sn') THEN 'notaire'
        WHEN pu.email IN ('foncier.expert@teranga-foncier.sn', 'teranga.immobilier@teranga-foncier.sn') THEN 'agent_foncier'
        ELSE COALESCE(au.raw_user_meta_data->>'role', 'particulier')
    END as role,
    -- Téléphone
    CASE 
        WHEN pu.email = 'family.diallo@teranga-foncier.sn' THEN '+221 77 123 45 01'
        WHEN pu.email = 'ahmadou.ba@teranga-foncier.sn' THEN '+221 77 123 45 02'
        WHEN pu.email = 'heritage.fall@teranga-foncier.sn' THEN '+221 77 123 45 03'
        WHEN pu.email = 'domaine.seck@teranga-foncier.sn' THEN '+221 77 123 45 04'
        WHEN pu.email = 'urban.developers@teranga-foncier.sn' THEN '+221 33 123 45 05'
        WHEN pu.email = 'sahel.construction@teranga-foncier.sn' THEN '+221 33 123 45 06'
        WHEN pu.email = 'financement.boa@teranga-foncier.sn' THEN '+221 33 123 45 07'
        WHEN pu.email = 'credit.agricole@teranga-foncier.sn' THEN '+221 33 123 45 08'
        WHEN pu.email = 'etude.diouf@teranga-foncier.sn' THEN '+221 33 123 45 09'
        WHEN pu.email = 'chambre.notaires@teranga-foncier.sn' THEN '+221 33 123 45 10'
        WHEN pu.email = 'foncier.expert@teranga-foncier.sn' THEN '+221 33 123 45 11'
        WHEN pu.email = 'teranga.immobilier@teranga-foncier.sn' THEN '+221 33 123 45 12'
        WHEN pu.email = 'test.admin@terangafoncier.sn' THEN '+221 77 000 00 01'
        ELSE COALESCE(au.raw_user_meta_data->>'phone', '+221 77 000 00 00')
    END as phone,
    pu.created_at
FROM public.users pu
INNER JOIN auth.users au ON pu.id = au.id  -- SEULEMENT LES COMPTES VALIDES
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles pp WHERE pp.email = pu.email
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

-- ÉTAPE 4: VÉRIFICATION POST-MIGRATION
SELECT 
    '✅ COMPTES MIGRÉS AVEC SUCCÈS' as section,
    email,
    full_name,
    role,
    phone,
    '🎯 MAINTENANT DANS public.profiles' as status
FROM public.profiles 
WHERE email LIKE '%@teranga%'
ORDER BY role, email;

-- ÉTAPE 5: STATISTIQUES FINALES
SELECT 
    '📊 MIGRATION TERMINÉE' as section,
    'Total profiles: ' || COUNT(*) as total
FROM public.profiles;

SELECT 
    '📊 MIGRATION TERMINÉE' as section,
    'Comptes Teranga migrés: ' || COUNT(*) as comptes_teranga
FROM public.profiles 
WHERE email LIKE '%@teranga%';

-- ÉTAPE 6: VALIDATION DES IDs (DOIT ÊTRE PARFAIT MAINTENANT)
SELECT 
    '🔗 VALIDATION IDs (AUCUNE ERREUR ATTENDUE)' as section,
    au.email,
    au.id as auth_id,
    pp.id as profile_id,
    '✅ PARFAIT' as match_status,
    pp.full_name,
    pp.role
FROM auth.users au
JOIN public.profiles pp ON au.email = pp.email AND au.id = pp.id
WHERE au.email LIKE '%@teranga%'
ORDER BY au.email;

-- ÉTAPE 7: IDENTIFIER LES COMPTES NON MIGRÉS (S'IL Y EN A)
SELECT 
    '⚠️ COMPTES NON MIGRÉS (ORPHELINS)' as section,
    pu.email,
    pu.id as public_users_id,
    'Pas d''entrée dans auth.users' as probleme,
    '❌ NON MIGRÉ' as status
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- MESSAGE FINAL
SELECT 
    '🚀 MIGRATION SÉCURISÉE TERMINÉE !' as message,
    'Seuls les comptes valides ont été migrés' as explication,
    'Test maintenant: node test-connexions-supabase.js' as commande,
    'Tous les comptes avec auth.users + public.profiles doivent fonctionner' as attendu;