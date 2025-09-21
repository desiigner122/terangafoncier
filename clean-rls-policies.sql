-- ======================================================================
-- NETTOYAGE DES POLICIES RLS EN DOUBLE + TEST MANUEL
-- Résoudre les conflits potentiels de policies
-- ======================================================================

-- 1) Supprimer les anciennes policies en double sur users
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_insert_own ON public.users;  
DROP POLICY IF EXISTS users_update_own ON public.users;

-- 2) Supprimer les anciennes policies sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- 3) Garder seulement les policies simples et claires
-- (les nouvelles policies _self_select et _admin_read_all restent)

-- 4) Tester manuellement l'accès pour un compte qui échoue
-- Simuler ce que fait l'application après login
SELECT 'MANUAL TEST - ahmadou.ba' AS section;

-- Test 1: Lire depuis users (ce que fait probablement l'app)
SELECT 'Test users access' AS test, id, email, name, role 
FROM public.users 
WHERE email = 'ahmadou.ba@teranga-foncier.sn'
LIMIT 1;

-- Test 2: Lire depuis profiles  
SELECT 'Test profiles access' AS test, id, email, name, role 
FROM public.profiles 
WHERE email = 'ahmadou.ba@teranga-foncier.sn'
LIMIT 1;

-- 5) Vérifier les policies restantes
SELECT 
  'CLEANED POLICIES' AS section,
  schemaname, 
  tablename, 
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('users', 'profiles')
ORDER BY tablename, policyname;