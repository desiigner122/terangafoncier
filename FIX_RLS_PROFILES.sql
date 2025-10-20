-- ===============================================
-- SOLUTION RLS - Teranga Foncier
-- Exécutez ce SQL dans Supabase SQL Editor
-- ===============================================

-- ÉTAPE 1: Vérifier l'état actuel RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- ÉTAPE 2: OPTION A - Désactiver RLS complètement (SIMPLE)
-- ⚠️  ATTENTION: Cela retire la sécurité au niveau base de données
-- À utiliser si tous vos profilessont publics
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- OU ÉTAPE 2: OPTION B - Activer RLS avec politiques publiques (RECOMMANDÉ)
-- Décomenez cette section au lieu de DISABLE si vous voulez garder RLS
/*
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Nettoyer les anciennes politiques
DROP POLICY IF EXISTS "profiles_read_public" ON public.profiles;

-- Créer une politique SELECT pour tout le monde (authenticated + anon)
CREATE POLICY "Allow public profile read"
  ON public.profiles
  FOR SELECT
  TO public, authenticated, anon
  USING (true);

-- Créer une politique UPDATE pour les utilisateurs eux-mêmes
CREATE POLICY "Allow self profile update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Créer une politique INSERT pour les utilisateurs
CREATE POLICY "Allow self profile insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Créer une politique DELETE pour les utilisateurs eux-mêmes
CREATE POLICY "Allow self profile delete"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
*/

-- ÉTAPE 3: Vérifier le résultat
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- ÉTAPE 4: Tester la requête (devrait retourner des résultats)
SELECT id, full_name, email, role FROM public.profiles LIMIT 1;
