-- Script simple pour vérifier les comptes existants
-- À exécuter en premier pour voir ce qui existe déjà

SELECT 
  'Comptes existants dans auth.users' as status;

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'name' as name,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.created_at
FROM auth.users u
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;

SELECT 
  'Profils existants dans profiles' as status;

SELECT 
  p.email,
  p.role,
  p.company_name,
  p.created_at
FROM profiles p
WHERE p.email LIKE '%@terangafoncier.com'
ORDER BY p.email;

-- Résumé
WITH expected_accounts AS (
  SELECT unnest(ARRAY[
    'admin@terangafoncier.com',
    'particulier@terangafoncier.com',
    'vendeur@terangafoncier.com',
    'investisseur@terangafoncier.com',
    'municipalite@terangafoncier.com',
    'notaire@terangafoncier.com',
    'geometre@terangafoncier.com',
    'banque@terangafoncier.com',
    'promoteur@terangafoncier.com'
  ]) as expected_email
)
SELECT 
  'Résumé des comptes' as status,
  COUNT(CASE WHEN u.email IS NOT NULL THEN 1 END) as comptes_existants,
  COUNT(*) as comptes_requis,
  COUNT(CASE WHEN u.email IS NULL THEN 1 END) as comptes_manquants
FROM expected_accounts ea
LEFT JOIN auth.users u ON ea.expected_email = u.email;

-- Liste des comptes manquants
WITH expected_accounts AS (
  SELECT unnest(ARRAY[
    'admin@terangafoncier.com',
    'particulier@terangafoncier.com',
    'vendeur@terangafoncier.com',
    'investisseur@terangafoncier.com',
    'municipalite@terangafoncier.com',
    'notaire@terangafoncier.com',
    'geometre@terangafoncier.com',
    'banque@terangafoncier.com',
    'promoteur@terangafoncier.com'
  ]) as expected_email
)
SELECT 
  'Comptes manquants:' as status,
  ea.expected_email
FROM expected_accounts ea
LEFT JOIN auth.users u ON ea.expected_email = u.email
WHERE u.email IS NULL
ORDER BY ea.expected_email;
