-- 🔍 Vérification des données Notaire dans Supabase
-- Ce script vérifie si les tables contiennent des données

-- 1. Vérifier la table notarial_acts
SELECT 
  'notarial_acts' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT notaire_id) as unique_notaires
FROM notarial_acts;

-- 2. Vérifier la table notarial_cases
SELECT 
  'notarial_cases' as table_name,
  COUNT(*) as total_records
FROM notarial_cases;

-- 3. Vérifier la table archived_acts
SELECT 
  'archived_acts' as table_name,
  COUNT(*) as total_records
FROM archived_acts;

-- 4. Vérifier la table compliance_checks
SELECT 
  'compliance_checks' as table_name,
  COUNT(*) as total_records
FROM compliance_checks;

-- 5. Vérifier la table clients_notaire
SELECT 
  'clients_notaire' as table_name,
  COUNT(*) as total_records
FROM clients_notaire;

-- 6. Vérifier la table tripartite_communications
SELECT 
  'tripartite_communications' as table_name,
  COUNT(*) as total_records
FROM tripartite_communications;

-- 7. Vérifier la table document_authentication
SELECT 
  'document_authentication' as table_name,
  COUNT(*) as total_records
FROM document_authentication;

-- 8. Vérifier les profils notaire
SELECT 
  COUNT(*) as total_notaires
FROM profiles
WHERE role = 'Notaire';

-- 9. Afficher un exemple d'acte notarié
SELECT 
  id,
  notaire_id,
  act_number,
  act_type,
  status,
  created_at
FROM notarial_acts
ORDER BY created_at DESC
LIMIT 5;
