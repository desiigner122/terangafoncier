-- INSERTION DONNÉES DE TEST - STRUCTURE SUPABASE RÉELLE
-- Basé sur l'analyse des foreign keys découvertes

-- 1. Insérer des profils de test
INSERT INTO profiles (id, email, name, role, status, created_at) VALUES
  (gen_random_uuid(), 'admin@terangafoncier.sn', 'Admin Teranga', 'admin', 'active', NOW()),
  (gen_random_uuid(), 'vendeur1@test.com', 'Mamadou Diallo', 'vendeur', 'active', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'vendeur2@test.com', 'Fatou Sarr', 'vendeur', 'active', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'client1@test.com', 'Abdoulaye Ba', 'particulier', 'active', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'client2@test.com', 'Awa Ndiaye', 'particulier', 'active', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'notaire@test.com', 'Me Ousmane Fall', 'notaire', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Insérer des terrains (entité centrale) avec relation vendeur_id → profiles
WITH vendeurs AS (
  SELECT id, email FROM profiles WHERE role = 'vendeur'
)
INSERT INTO terrains (id, title, description, price, location, vendeur_id, status, created_at)
SELECT 
  gen_random_uuid(),
  terrain_data.title,
  terrain_data.description,
  terrain_data.price,
  terrain_data.location,
  (SELECT id FROM vendeurs WHERE email = terrain_data.vendeur_email),
  'available',
  terrain_data.created_at
FROM (VALUES
  ('Terrain résidentiel Almadies', 'Terrain 300m² dans quartier résidentiel', 45000000, 'Almadies, Dakar', 'vendeur1@test.com', NOW() - INTERVAL '4 days'),
  ('Parcelle commerciale Plateau', 'Emplacement commercial 500m²', 85000000, 'Plateau, Dakar', 'vendeur1@test.com', NOW() - INTERVAL '6 days'),
  ('Terrain agricole Thiès', 'Grande parcelle agricole 2000m²', 15000000, 'Thiès, Sénégal', 'vendeur2@test.com', NOW() - INTERVAL '2 days'),
  ('Lot constructible Parcelles Assainies', 'Terrain viabilisé 200m²', 25000000, 'Parcelles Assainies, Dakar', 'vendeur2@test.com', NOW() - INTERVAL '1 day')
) AS terrain_data(title, description, price, location, vendeur_email, created_at);

-- 3. Insérer des properties (sans relation directe vers profiles)
INSERT INTO properties (id, title, description, price, location, status, created_at) VALUES
  (gen_random_uuid(), 'Villa moderne Fann', 'Villa 4 chambres avec jardin', 120000000, 'Fann, Dakar', 'active', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'Appartement standing Point E', 'Appartement 3 pièces meublé', 75000000, 'Point E, Dakar', 'active', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'Bureau moderne Plateau', 'Espace bureau 150m²', 95000000, 'Plateau, Dakar', 'active', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- 4. Insérer des support_tickets avec assigned_to → profiles (relation correcte)
WITH admins AS (
  SELECT id FROM profiles WHERE role = 'admin' LIMIT 1
),
clients AS (
  SELECT id, email FROM profiles WHERE role = 'particulier'
)
INSERT INTO support_tickets (id, title, description, category, priority, status, assigned_to, created_at)
SELECT 
  gen_random_uuid(),
  ticket_data.title,
  ticket_data.description,
  ticket_data.category,
  ticket_data.priority,
  ticket_data.status,
  (SELECT id FROM admins),
  ticket_data.created_at
FROM (VALUES
  ('Problème de connexion', 'Impossible de me connecter à mon compte', 'technical', 'high', 'open', NOW() - INTERVAL '2 hours'),
  ('Question validation terrain', 'Combien de temps pour valider mon terrain?', 'validation', 'medium', 'open', NOW() - INTERVAL '6 hours'),
  ('Erreur de paiement', 'Le paiement par carte ne fonctionne pas', 'billing', 'urgent', 'in_progress', NOW() - INTERVAL '1 hour'),
  ('Demande de suppression', 'Je veux supprimer mon annonce', 'general', 'low', 'open', NOW() - INTERVAL '1 day')
) AS ticket_data(title, description, category, priority, status, created_at);

-- 5. Insérer des blockchain_transactions avec user_id → profiles et terrain_id → terrains
WITH users AS (
  SELECT id, email FROM profiles WHERE role IN ('particulier', 'vendeur')
),
terrains_data AS (
  SELECT id, title FROM terrains
)
INSERT INTO blockchain_transactions (id, user_id, terrain_id, transaction_type, status, created_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'client1@test.com'),
  (SELECT id FROM terrains_data WHERE title = 'Terrain résidentiel Almadies'),
  'purchase',
  'completed',
  NOW() - INTERVAL '1 day'
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'client2@test.com'),
  (SELECT id FROM terrains_data WHERE title = 'Parcelle commerciale Plateau'),
  'reservation',
  'pending',
  NOW() - INTERVAL '3 hours';

-- 6. Insérer des notifications avec user_id → profiles
WITH users AS (
  SELECT id, email FROM profiles WHERE role != 'admin'
)
INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
SELECT 
  gen_random_uuid(),
  users.id,
  notif_data.title,
  notif_data.message,
  notif_data.type,
  false,
  notif_data.created_at
FROM users,
(VALUES
  ('Terrain validé', 'Votre terrain a été validé par notre équipe', 'validation', NOW() - INTERVAL '2 days'),
  ('Nouvelle offre', 'Vous avez reçu une nouvelle offre', 'offer', NOW() - INTERVAL '5 hours'),
  ('Paiement confirmé', 'Votre paiement a été traité avec succès', 'payment', NOW() - INTERVAL '1 day')
) AS notif_data(title, message, type, created_at)
LIMIT 10;

-- 7. Vérification des insertions
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'terrains', COUNT(*) FROM terrains
UNION ALL  
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'support_tickets', COUNT(*) FROM support_tickets
UNION ALL
SELECT 'blockchain_transactions', COUNT(*) FROM blockchain_transactions
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;