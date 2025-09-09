-- 🔍 VÉRIFICATION STRUCTURE SUPABASE - TERANGA FONCIER
-- ====================================================

-- Vérifier les tables principales
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects') 
    THEN '✅' 
    ELSE '❌' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects')
ORDER BY table_name;

-- Vérifier la structure de la table profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Vérifier les contraintes de clé étrangère
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
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
  AND tc.table_name = 'profiles';

-- Compter les utilisateurs existants
SELECT 
  'Utilisateurs auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profils publics' as table_name,
  COUNT(*) as count  
FROM public.profiles;

-- Vérifier les rôles disponibles
SELECT DISTINCT role 
FROM public.profiles 
WHERE role IS NOT NULL;
