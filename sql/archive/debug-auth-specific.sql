-- Script de diagnostic spécifique pour les comptes qui échouent
-- Comparer les comptes qui marchent vs ceux qui échouent

-- 1. Vérifier le compte admin@terangafoncier.sn qui a "Invalid login credentials"
SELECT 
  'auth.users admin check' as source,
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn';

-- 2. Comparer un compte qui marche vs un qui échoue
SELECT 
  'WORKING ACCOUNT: geowest.africa' as label,
  auth.id as auth_id,
  auth.email,
  auth.email_confirmed_at IS NOT NULL as auth_confirmed,
  auth.raw_user_meta_data,
  users.id as users_id,
  users.email as users_email,
  users.role as users_role,
  profiles.id as profile_id,
  profiles.email as profile_email,
  profiles.role as profile_role,
  profiles.user_type
FROM auth.users auth
LEFT JOIN public.users users ON auth.id = users.id
LEFT JOIN public.profiles profiles ON auth.id = profiles.id
WHERE auth.email = 'geowest.africa@teranga-foncier.sn'

UNION ALL

SELECT 
  'FAILING ACCOUNT: family.diallo' as label,
  auth.id as auth_id,
  auth.email,
  auth.email_confirmed_at IS NOT NULL as auth_confirmed,
  auth.raw_user_meta_data,
  users.id as users_id,
  users.email as users_email,
  users.role as users_role,
  profiles.id as profile_id,
  profiles.email as profile_email,
  profiles.role as profile_role,
  profiles.user_type
FROM auth.users auth
LEFT JOIN public.users users ON auth.id = users.id
LEFT JOIN public.profiles profiles ON auth.id = profiles.id
WHERE auth.email = 'family.diallo@teranga-foncier.sn';

-- 3. Vérifier les triggers et contraintes qui pourraient causer "Database error querying schema"
SELECT 
  'RLS Policies on profiles' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Vérifier les triggers sur les tables
SELECT 
  'Triggers on public tables' as check_type,
  event_object_schema,
  event_object_table,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
AND event_object_table IN ('users', 'profiles');

-- 5. Vérifier les fonctions déclencheurs
SELECT 
  'Trigger functions' as check_type,
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%user%' 
OR routine_name LIKE '%profile%';