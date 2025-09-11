-- Solution ultra-simple : créer juste 3 comptes essentiels
-- Si les autres scripts échouent, utilise celui-ci

-- Supprimer d'abord les comptes problématiques
DELETE FROM profiles WHERE email = 'test.urgent@terangafoncier.com';
DELETE FROM auth.users WHERE email = 'test.urgent@terangafoncier.com';

-- Créer 3 comptes essentiels seulement
-- 1. Admin (s'il n'existe pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@terangafoncier.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at, confirmation_token,
      last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'admin@terangafoncier.com',
      crypt('demo123', gen_salt('bf')), now(), now(), '', now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "admin", "name": "Admin Demo"}'::jsonb,
      false, now(), now()
    );
  END IF;
END $$;

-- 2. Particulier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'particulier@terangafoncier.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at, confirmation_token,
      last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'particulier@terangafoncier.com',
      crypt('demo123', gen_salt('bf')), now(), now(), '', now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "particular", "name": "Particulier Demo"}'::jsonb,
      false, now(), now()
    );
  END IF;
END $$;

-- 3. Vendeur
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendeur@terangafoncier.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at, confirmation_token,
      last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'vendeur@terangafoncier.com',
      crypt('demo123', gen_salt('bf')), now(), now(), '', now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "vendeur", "name": "Vendeur Demo"}'::jsonb,
      false, now(), now()
    );
  END IF;
END $$;

-- Créer les profils pour ces 3 comptes
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
  u.id, u.email, u.raw_user_meta_data->>'role', now(), now()
FROM auth.users u 
WHERE u.email IN (
  'admin@terangafoncier.com',
  'particulier@terangafoncier.com', 
  'vendeur@terangafoncier.com'
)
AND u.raw_user_meta_data->>'role' IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- Vérifier le résultat
SELECT 
  'Comptes créés avec succès:' as status,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  CASE WHEN p.id IS NOT NULL THEN 'Profil OK' ELSE 'Profil manquant' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN (
  'admin@terangafoncier.com',
  'particulier@terangafoncier.com',
  'vendeur@terangafoncier.com'
)
ORDER BY u.email;
