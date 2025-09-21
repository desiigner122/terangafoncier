-- ======================================================================
-- EXPLORATION COMPLÈTE DE LA STRUCTURE SUPABASE
-- Comprendre la vraie structure des tables et colonnes
-- ======================================================================

-- 1) Lister toutes les tables dans le schéma public
SELECT 
  'TABLES IN PUBLIC SCHEMA' AS section,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2) Structure de la table users
SELECT 
  'USERS TABLE STRUCTURE' AS section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- 3) Structure de la table profiles
SELECT 
  'PROFILES TABLE STRUCTURE' AS section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4) Compter les données dans chaque table
SELECT 'COUNT auth.users' AS section, COUNT(*) AS total FROM auth.users;
SELECT 'COUNT public.users' AS section, COUNT(*) AS total FROM public.users;
SELECT 'COUNT public.profiles' AS section, COUNT(*) AS total FROM public.profiles;

-- 5) Échantillon des données dans public.users (5 premiers)
SELECT 'SAMPLE public.users' AS section, * FROM public.users LIMIT 5;

-- 6) Échantillon des données dans public.profiles (5 premiers)
SELECT 'SAMPLE public.profiles' AS section, * FROM public.profiles LIMIT 5;

-- 7) Vérifier les contraintes et clés étrangères
SELECT 
  'FOREIGN KEYS' AS section,
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('users', 'profiles');

-- 8) Vérifier les indexes
SELECT 
  'INDEXES' AS section,
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'profiles');

-- 9) Vérifier si la table auth.users a des métadonnées
SELECT 'AUTH USERS METADATA' AS section, 
  email, 
  raw_user_meta_data,
  email_confirmed_at IS NOT NULL AS email_confirmed
FROM auth.users 
WHERE email LIKE '%teranga%' OR email LIKE '%terangafoncier%'
LIMIT 5;