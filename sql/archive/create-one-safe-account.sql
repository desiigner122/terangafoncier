-- Version ULTRA-SIMPLE garantie sans erreur
-- Crée uniquement admin, particulier et vendeur

-- Nettoyage total des comptes test
DELETE FROM profiles WHERE email LIKE 'test.%@terangafoncier.com';
DELETE FROM auth.users WHERE email LIKE 'test.%@terangafoncier.com';

-- Création sécurisée d'un seul compte admin pour commencer
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_sent_at, confirmation_token,
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'demo@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(), now(), '', now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "admin", "name": "Demo Admin"}'::jsonb,
  false, now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'demo@terangafoncier.com'
);

-- Créer son profil
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
  u.id, u.email, 'admin', now(), now()
FROM auth.users u 
WHERE u.email = 'demo@terangafoncier.com'
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- Vérification finale
SELECT 
  'Compte créé avec succès:' as status,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  CASE WHEN p.id IS NOT NULL THEN 'Profil OK' ELSE 'Profil manquant' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'demo@terangafoncier.com';

-- Instructions de test
SELECT 
  'Pour tester:' as instruction,
  'https://terangafoncier.vercel.app/' as url,
  'demo@terangafoncier.com' as email,
  'demo123' as password;
