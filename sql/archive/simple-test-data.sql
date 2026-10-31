-- Script de données de test minimaliste
-- Insert seulement avec les colonnes de base

-- 1. Insérer des utilisateurs de test (colonnes minimales)
INSERT INTO profiles (id, email, role, created_at) VALUES
  (gen_random_uuid(), 'user1@test.com', 'particulier', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'user2@test.com', 'vendeur', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'notaire@test.com', 'notaire', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), 'admin@test.com', 'admin', NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Quelques leads marketing simples
INSERT INTO marketing_leads (id, source, form_name, payload, status, created_at) VALUES
  (gen_random_uuid(), 'contact_form', 'Contact Page', '{"name": "Jean Dupont", "email": "user1@test.com", "message": "Intéressé par une villa"}', 'new', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), 'contact_form', 'Contact Page', '{"name": "Marie Martin", "email": "user2@test.com", "message": "Question sur les prix"}', 'contacted', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 3. Vérification des insertions
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'marketing_leads', COUNT(*) FROM marketing_leads;