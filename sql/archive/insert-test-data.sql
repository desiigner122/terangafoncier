-- Insertion de données de test pour dashboard admin
-- Insérer des utilisateurs de test (UUID v4 format) 
-- Note: utilise raw_user_meta_data au lieu de full_name
INSERT INTO profiles (id, email, raw_user_meta_data, role, status, created_at) VALUES
  (gen_random_uuid(), 'user1@test.com', '{"full_name": "Jean Dupont"}', 'particulier', 'active', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'user2@test.com', '{"full_name": "Marie Martin"}', 'vendeur', 'active', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'notaire@test.com', '{"full_name": "Me Bernard"}', 'notaire', 'active', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'admin@test.com', '{"full_name": "Admin Test"}', 'admin', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insérer des propriétés de test avec différents statuts
WITH inserted_users AS (
  SELECT id, email FROM profiles WHERE email IN ('user1@test.com', 'user2@test.com')  
)
INSERT INTO properties (id, title, description, price, location, owner_id, verification_status, status, created_at) 
SELECT 
  gen_random_uuid(),
  property_data.title,
  property_data.description,
  property_data.price,
  property_data.location,
  (SELECT id FROM inserted_users WHERE email = property_data.owner_email),
  property_data.verification_status,
  'active',
  property_data.created_at
FROM (VALUES
  ('Villa moderne à Dakar', 'Belle villa avec piscine', 150000000, 'Dakar, Sénégal', 'user2@test.com', 'pending', NOW() - INTERVAL '2 days'),
  ('Appartement centre-ville', 'Appartement 3 pièces', 75000000, 'Dakar, Sénégal', 'user2@test.com', 'verified', NOW() - INTERVAL '4 days'),
  ('Terrain constructible', 'Terrain de 500m²', 25000000, 'Thiès, Sénégal', 'user1@test.com', 'pending', NOW() - INTERVAL '1 day')
) AS property_data(title, description, price, location, owner_email, verification_status, created_at);

-- Insérer des tickets de support de test
WITH ticket_users AS (
  SELECT id, email FROM profiles WHERE email IN ('user1@test.com', 'user2@test.com')
)
INSERT INTO support_tickets (id, title, description, category, priority, status, user_id, created_at) 
SELECT 
  gen_random_uuid(),
  ticket_data.title,
  ticket_data.description,
  ticket_data.category,
  ticket_data.priority,
  ticket_data.status,
  (SELECT id FROM ticket_users WHERE email = ticket_data.user_email),
  ticket_data.created_at
FROM (VALUES
  ('Problème de connexion', 'Je n''arrive pas à me connecter', 'technical', 'high', 'open', 'user1@test.com', NOW() - INTERVAL '1 hour'),
  ('Question sur la validation', 'Combien de temps pour valider?', 'property_validation', 'medium', 'open', 'user2@test.com', NOW() - INTERVAL '6 hours'),
  ('Erreur de paiement', 'Le paiement n''a pas fonctionné', 'billing', 'urgent', 'in_progress', 'user1@test.com', NOW() - INTERVAL '30 minutes')
) AS ticket_data(title, description, category, priority, status, user_email, created_at);

-- Insérer des transactions blockchain de test
WITH tx_data AS (
  SELECT 
    p.id as property_id,
    p.owner_id,
    (SELECT id FROM profiles WHERE email = 'user1@test.com') as buyer_id
  FROM properties p 
  WHERE p.title = 'Appartement centre-ville'
  LIMIT 1
)
INSERT INTO blockchain_transactions (id, property_id, from_user_id, to_user_id, amount, transaction_type, status, created_at) 
SELECT 
  gen_random_uuid(),
  tx_data.property_id,
  tx_data.buyer_id,
  tx_data.owner_id,
  75000000,
  'purchase',
  'completed',
  NOW() - INTERVAL '2 days'
FROM tx_data;

-- Vérification des insertions
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'properties', COUNT(*) FROM properties  
UNION ALL
SELECT 'support_tickets', COUNT(*) FROM support_tickets
UNION ALL
SELECT 'blockchain_transactions', COUNT(*) FROM blockchain_transactions;