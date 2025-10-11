-- Diagnostic des données admin dashboard
-- Vérifier le nombre d'utilisateurs réels
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'properties', COUNT(*) FROM properties  
UNION ALL
SELECT 'blockchain_transactions', COUNT(*) FROM blockchain_transactions
UNION ALL
SELECT 'marketing_leads', COUNT(*) FROM marketing_leads
UNION ALL
SELECT 'support_tickets', COUNT(*) FROM support_tickets;

-- Détail des propriétés par statut
SELECT 
  verification_status,
  COUNT(*) as count
FROM properties 
GROUP BY verification_status;

-- Détail des utilisateurs par statut
SELECT 
  COALESCE(status, 'no_status') as status,
  COUNT(*) as count
FROM profiles 
GROUP BY status;

-- Support tickets récents
SELECT 
  id,
  title,
  status,
  priority,
  created_at
FROM support_tickets 
ORDER BY created_at DESC
LIMIT 5;