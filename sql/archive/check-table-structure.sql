-- Script pour vérifier la structure des tables avant création des comptes
-- À exécuter en premier pour voir les colonnes disponibles

-- Vérifier la structure de la table profiles
SELECT 
  'Structure de la table profiles:' as info;

SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de auth.users pour raw_user_meta_data
SELECT 
  'Structure de auth.users (colonnes JSON):' as info;

SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'auth'
  AND column_name LIKE '%meta_data%'
ORDER BY ordinal_position;

-- Vérifier quelques comptes existants pour voir le format
SELECT 
  'Exemple de comptes existants:' as info;

SELECT 
  email,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users 
WHERE email LIKE '%@terangafoncier.com'
LIMIT 3;
