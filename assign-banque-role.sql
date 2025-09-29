-- Script pour assigner le rôle Banque à votre utilisateur
-- Remplacez 'votre-email@example.com' par votre vraie adresse email

-- 1. Vérifier votre utilisateur actuel
SELECT id, email, role FROM profiles WHERE email LIKE '%@%';

-- 2. Assigner le rôle Banque (remplacez l'email)
UPDATE profiles 
SET role = 'Banque' 
WHERE email = 'votre-email@example.com';

-- 3. Vérifier que c'est bien appliqué
SELECT id, email, role FROM profiles WHERE role = 'Banque';

-- 4. Alternative : Créer un utilisateur test Banque
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(),
  'banque@test.com',
  'Directeur Banque Test',
  'Banque',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role;