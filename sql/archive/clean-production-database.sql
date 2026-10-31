-- ==========================================================
-- 🧹 NETTOYAGE PRODUCTION - SUPPRESSION COMPTES DE TEST ET SIMULATIONS
-- ==========================================================
-- Ce script supprime tous les comptes de test, simulations et données factices
-- pour préparer l'application à utiliser de vrais comptes utilisateurs

-- 🔍 1. VÉRIFICATION PRÉALABLE - Comptes existants
SELECT 'AVANT NETTOYAGE - Comptes existants:' as status;
SELECT email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%@terangafoncier.com'
   OR email LIKE '%simulation%'
   OR email LIKE '%fake%'
ORDER BY created_at;

-- 🗑️ 2. SUPPRESSION COMPTES DE TEST - Auth Users
DELETE FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%@terangafoncier.com'
   OR email LIKE '%simulation%'
   OR email LIKE '%fake%'
   OR email LIKE '%example%'
   OR email IN (
       'admin@test.com',
       'user@test.com', 
       'vendor@test.com',
       'promoteur@test.com',
       'investisseur@test.com'
   );

-- 🗑️ 3. SUPPRESSION PROFILS DE TEST
DELETE FROM profiles 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%@terangafoncier.com'
   OR email LIKE '%simulation%'
   OR email LIKE '%fake%'
   OR email LIKE '%example%';

-- 🗑️ 4. SUPPRESSION PROPRIÉTÉS/TERRAINS DE TEST
DELETE FROM properties 
WHERE title LIKE '%test%' 
   OR title LIKE '%demo%' 
   OR title LIKE '%simulation%'
   OR title LIKE '%fake%'
   OR description LIKE '%test%'
   OR description LIKE '%simulation%';

-- 🗑️ 5. SUPPRESSION ANNONCES DE TEST
DELETE FROM annonces 
WHERE title LIKE '%test%' 
   OR title LIKE '%demo%' 
   OR title LIKE '%simulation%'
   OR description LIKE '%test%'
   OR description LIKE '%simulation%'
   OR price_fcfa < 1000; -- Prix irrealistement bas

-- 🗑️ 6. SUPPRESSION TRANSACTIONS DE TEST
DELETE FROM transactions 
WHERE description LIKE '%test%' 
   OR description LIKE '%demo%'
   OR description LIKE '%simulation%'
   OR amount_fcfa < 1000; -- Montants de test

-- 🗑️ 7. SUPPRESSION DEMANDES MUNICIPALES DE TEST  
DELETE FROM municipal_requests 
WHERE description LIKE '%test%' 
   OR description LIKE '%demo%'
   OR description LIKE '%simulation%';

-- 🗑️ 8. SUPPRESSION ARTICLES BLOG DE TEST
DELETE FROM blog 
WHERE title LIKE '%test%' 
   OR title LIKE '%Test%' 
   OR title LIKE '%demo%'
   OR slug LIKE '%test%'
   OR content LIKE '%simulation%';

-- 🗑️ 9. SUPPRESSION NOTIFICATIONS DE TEST
DELETE FROM notifications 
WHERE message LIKE '%test%' 
   OR message LIKE '%demo%'
   OR message LIKE '%simulation%';

-- 🗑️ 10. SUPPRESSION DONNÉES BLOCKCHAIN DE TEST
DELETE FROM blockchain_audit 
WHERE document_hash LIKE '%test%' 
   OR document_hash LIKE '%demo%'
   OR document_hash LIKE '%simulation%';

-- 🗑️ 11. SUPPRESSION CERTIFICATS DIGITAUX DE TEST
DELETE FROM digital_certificates 
WHERE title LIKE '%test%' 
   OR title LIKE '%demo%'
   OR title LIKE '%simulation%';

-- 🗑️ 12. SUPPRESSION AUDIT TRAIL DE TEST
DELETE FROM audit_trail 
WHERE action LIKE '%test%' 
   OR details LIKE '%test%'
   OR details LIKE '%simulation%';

-- 🗑️ 13. SUPPRESSION FAVORIS DE TEST
DELETE FROM favorites 
WHERE user_id NOT IN (SELECT id FROM profiles);

-- 🗑️ 14. SUPPRESSION MESSAGES DE TEST
DELETE FROM messages 
WHERE content LIKE '%test%' 
   OR content LIKE '%simulation%';

-- 🔄 15. RÉINITIALISATION DES SÉQUENCES
SELECT setval('profiles_id_seq', COALESCE((SELECT MAX(id) FROM profiles), 1));
SELECT setval('properties_id_seq', COALESCE((SELECT MAX(id) FROM properties), 1));
SELECT setval('annonces_id_seq', COALESCE((SELECT MAX(id) FROM annonces), 1));
SELECT setval('transactions_id_seq', COALESCE((SELECT MAX(id) FROM transactions), 1));

-- ✅ 16. VÉRIFICATION FINALE - État après nettoyage
SELECT 'APRÈS NETTOYAGE - Résumé des tables:' as status;

SELECT 
    'auth.users' as table_name, 
    COUNT(*) as remaining_records 
FROM auth.users
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL  
SELECT 'annonces', COUNT(*) FROM annonces
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'blog', COUNT(*) FROM blog
UNION ALL
SELECT 'municipal_requests', COUNT(*) FROM municipal_requests
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'blockchain_audit', COUNT(*) FROM blockchain_audit
UNION ALL
SELECT 'digital_certificates', COUNT(*) FROM digital_certificates;

-- 🔍 17. VÉRIFICATION - Plus aucun compte de test
SELECT 'VÉRIFICATION - Comptes de test restants:' as status;
SELECT COUNT(*) as test_accounts_remaining
FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%@terangafoncier.com'
   OR email LIKE '%simulation%';

-- ✅ 18. CONFIRMATION NETTOYAGE
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%') = 0 
        THEN '✅ NETTOYAGE RÉUSSI - Base de données prête pour vrais utilisateurs'
        ELSE '⚠️ ATTENTION - Certains comptes de test subsistent'
    END as cleanup_status;