-- ==========================================================
-- ðŸ§¹ NETTOYAGE BASE DE DONNÃ‰ES - DONNÃ‰ES TEST
-- ==========================================================

-- Supprimer tous les comptes de test
DELETE FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%@terangafoncier.com';

-- Supprimer les utilisateurs auth de test
DELETE FROM auth.users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%@terangafoncier.com';

-- Supprimer les propriÃ©tÃ©s de test
DELETE FROM properties WHERE title LIKE '%test%' OR title LIKE '%demo%' OR description LIKE '%test%';

-- Supprimer les transactions de test
DELETE FROM transactions WHERE description LIKE '%test%' OR description LIKE '%demo%';

-- Supprimer les annonces de test
DELETE FROM annonces WHERE title LIKE '%test%' OR title LIKE '%demo%' OR description LIKE '%test%';

-- Supprimer les articles de blog de test
DELETE FROM blog WHERE title LIKE '%test%' OR title LIKE '%Test%' OR slug LIKE '%test%';

-- Supprimer les notifications de test
DELETE FROM notifications WHERE message LIKE '%test%' OR message LIKE '%demo%';

-- Supprimer les audit_trail de test
DELETE FROM audit_trail WHERE action LIKE '%test%' OR details LIKE '%test%';

-- Supprimer les donnÃ©es blockchain de test
DELETE FROM blockchain_audit WHERE document_hash LIKE '%test%' OR user_id IN (
    SELECT id FROM profiles WHERE email LIKE '%test%' OR email LIKE '%demo%'
);

-- Supprimer les certificats de test
DELETE FROM digital_certificates WHERE title LIKE '%test%' OR title LIKE '%demo%';

-- RÃ©initialiser les sÃ©quences
SELECT setval('profiles_id_seq', COALESCE(MAX(id), 1)) FROM profiles;
SELECT setval('properties_id_seq', COALESCE(MAX(id), 1)) FROM properties;
SELECT setval('annonces_id_seq', COALESCE(MAX(id), 1)) FROM annonces;

-- VÃ©rification finale
SELECT 
    'profiles' as table_name, 
    COUNT(*) as remaining_records 
FROM profiles
UNION ALL
SELECT 'annonces', COUNT(*) FROM annonces
UNION ALL  
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'blog', COUNT(*) FROM blog;
