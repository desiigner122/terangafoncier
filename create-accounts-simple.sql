-- Version simplifiée pour créer les comptes manquants
-- Évite les problèmes de structure de table

-- Supprimer d'abord tous les comptes de test problématiques
DELETE FROM profiles WHERE email LIKE 'test.%@terangafoncier.com';
DELETE FROM auth.users WHERE email LIKE 'test.%@terangafoncier.com';

-- D'abord, voir ce qui existe (après nettoyage)
SELECT 
  'Comptes existants (après nettoyage):' as status,
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email LIKE '%@terangafoncier.com'
ORDER BY email;

-- Script simple pour créer un compte à la fois
-- Utilise cette approche si le script complexe échoue

-- 1. Créer le compte particulier s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'particulier@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "particular", "name": "Particulier Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'particulier@terangafoncier.com'
);

-- 2. Créer le compte vendeur s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'vendeur@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "vendeur", "name": "Vendeur Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'vendeur@terangafoncier.com'
);

-- 3. Créer le compte investisseur s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'investisseur@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "investisseur", "name": "Investisseur Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'investisseur@terangafoncier.com'
);

-- 4. Créer le compte municipalité s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'municipalite@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "municipalite", "name": "Municipalité Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'municipalite@terangafoncier.com'
);

-- 5. Créer le compte notaire s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'notaire@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "notaire", "name": "Notaire Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'notaire@terangafoncier.com'
);

-- 6. Créer le compte géomètre s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'geometre@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "geometre", "name": "Géomètre Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'geometre@terangafoncier.com'
);

-- 7. Créer le compte banque s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'banque@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "banque", "name": "Banque Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'banque@terangafoncier.com'
);

-- 8. Créer le compte promoteur s'il n'existe pas
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'promoteur@terangafoncier.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "promoteur", "name": "Promoteur Demo"}'::jsonb,
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'promoteur@terangafoncier.com'
);

-- Créer les profils correspondants (avec validation stricte des rôles)
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  now(),
  now()
FROM auth.users u 
WHERE u.email LIKE '%@terangafoncier.com'
  AND u.raw_user_meta_data->>'role' IS NOT NULL 
  AND u.raw_user_meta_data->>'role' IN ('admin', 'particular', 'vendeur', 'investisseur', 'municipalite', 'notaire', 'geometre', 'banque', 'promoteur')
  AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = u.id
  );

-- Vérifier le résultat final
SELECT 
  'Résultat final:' as status,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'name' as name,
  CASE WHEN p.id IS NOT NULL THEN 'Profil OK' ELSE 'Profil manquant' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;
