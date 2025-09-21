-- ======================================================================
-- TOUT-EN-UN: RLS + TRIGGER + VÉRIFICATIONS
-- Objectif: éliminer "Database error querying schema" et l'erreur NEW.updated_at
-- Sans supprimer de données et en restant minimal
-- ======================================================================

-- =====================
-- 0) SÉCURISER LES PRÉ-REQUIS + CONFIRMATION EMAIL
-- =====================
-- S'assurer que la colonne updated_at existe sur public.requests pour satisfaire
-- le trigger/fonction générique update_updated_at_column()
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Marquer tous les utilisateurs comme email confirmés (clé pour éviter les blocages RLS)
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email_confirmed_at IS NULL;

-- =====================
-- 1) ACTIVER RLS ET CRÉER DES POLICIES MINIMALES
-- =====================
-- But: permettre à tout utilisateur authentifié de LIRE sa propre ligne (id = auth.uid())
-- et permettre à un administrateur (profiles.role='admin') de lire toutes les lignes.

-- Activer RLS (idempotent)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;

-- Optionnel: nettoyer d'anciennes policies au nom connu (ignore si absentes)
DROP POLICY IF EXISTS profiles_self_select   ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_read_all ON public.profiles;
DROP POLICY IF EXISTS users_self_select      ON public.users;
DROP POLICY IF EXISTS users_admin_read_all   ON public.users;

-- Self SELECT: chaque user lit uniquement sa propre ligne
CREATE POLICY profiles_self_select
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY users_self_select
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admin READ ALL: si l'utilisateur courant a role='admin' dans profiles, il peut tout lire
CREATE POLICY profiles_admin_read_all
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY users_admin_read_all
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Donner les privilèges de base (RLS reste la barrière effective)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.users    TO authenticated;

-- =====================
-- 2) VÉRIFICATIONS RAPIDES
-- =====================
-- a) Statut RLS
SELECT 
  'RLS STATUS' AS section,
  tablename,
  rowsecurity AS rls_active
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('users','profiles','requests')
ORDER BY tablename;

-- b) Policies installées (résumé)
SELECT 
  'RLS POLICIES' AS section,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname='public' AND tablename IN ('users','profiles')
ORDER BY tablename, policyname;

-- c) Lecture brute (doit renvoyer un nombre, côté service role/SQL editor)
SELECT 'COUNT profiles' AS section, COUNT(*) AS total FROM public.profiles;
SELECT 'COUNT users'    AS section, COUNT(*) AS total FROM public.users;

-- d) Cohérence IDs (échantillon sur les 4 comptes souvent testés)
SELECT 
  'ID MATCH' AS section,
  au.email,
  au.id AS auth_id,
  pu.id AS users_id,
  pp.id AS profiles_id,
  CASE WHEN au.id = pu.id AND pu.id = pp.id THEN 'OK' ELSE 'MISMATCH' END AS status
FROM auth.users au
JOIN public.users    pu ON pu.email = au.email
JOIN public.profiles pp ON pp.email = au.email
WHERE au.email IN (
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn',
  'etude.diouf@teranga-foncier.sn'
)
ORDER BY au.email;

-- d2) Vérification globale: comptes avec incohérences d'ID entre auth/users/profiles
WITH base AS (
  SELECT 
    au.email,
    au.id AS auth_id,
    pu.id AS users_id,
    pp.id AS profiles_id
  FROM auth.users au
  LEFT JOIN public.users    pu ON pu.email = au.email
  LEFT JOIN public.profiles pp ON pp.email = au.email
)
SELECT 
  'ID MISMATCH' AS section,
  email,
  auth_id,
  users_id,
  profiles_id,
  CASE 
    WHEN users_id IS NULL AND profiles_id IS NULL THEN 'MISSING users & profiles'
    WHEN users_id IS NULL THEN 'MISSING users'
    WHEN profiles_id IS NULL THEN 'MISSING profiles'
    WHEN auth_id IS DISTINCT FROM users_id OR auth_id IS DISTINCT FROM profiles_id OR users_id IS DISTINCT FROM profiles_id THEN 'MISMATCH'
    ELSE 'OK'
  END AS status
FROM base
WHERE 
  (users_id IS NULL OR profiles_id IS NULL OR 
   auth_id IS DISTINCT FROM users_id OR auth_id IS DISTINCT FROM profiles_id OR users_id IS DISTINCT FROM profiles_id)
ORDER BY email;

-- d3) Compteur d'incohérences
WITH base AS (
  SELECT 
    au.email,
    au.id AS auth_id,
    pu.id AS users_id,
    pp.id AS profiles_id
  FROM auth.users au
  LEFT JOIN public.users    pu ON pu.email = au.email
  LEFT JOIN public.profiles pp ON pp.email = au.email
)
SELECT 'MISMATCH COUNT' AS section, COUNT(*) AS total
FROM base
WHERE 
  (users_id IS NULL OR profiles_id IS NULL OR 
   auth_id IS DISTINCT FROM users_id OR auth_id IS DISTINCT FROM profiles_id OR users_id IS DISTINCT FROM profiles_id);

-- d4) Viabilité des policies "self-select":
-- Un utilisateur pourra lire sa ligne si une ligne existe dans users/profiles avec id = auth.id
-- On vérifie ici la présence des lignes par ID (pas email) pour refléter la condition RLS
SELECT 'SELF-SELECT USERS OK' AS section, COUNT(*) AS total
FROM auth.users au
WHERE EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

SELECT 'SELF-SELECT PROFILES OK' AS section, COUNT(*) AS total
FROM auth.users au
WHERE EXISTS (
  SELECT 1 FROM public.profiles pp WHERE pp.id = au.id
);

-- e) Vérification email confirmation - crucial pour éviter les blocages RLS
SELECT 
  'EMAIL STATUS' AS section,
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END AS status,
  COUNT(*) AS total
FROM auth.users
GROUP BY CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END
ORDER BY status;

-- e) Rappel: côté client (role authenticated), l'utilisateur connecté pourra SELECT
--    sa propre ligne dans users ou profiles; un admin pourra tout lire.
-- f) IMPORTANT: Tous les utilisateurs doivent avoir email_confirmed_at défini 
--    sinon Supabase peut bloquer l'accès même avec les bonnes policies RLS.
-- ======================================================================
-- INSTRUCTIONS SUPPLÉMENTAIRES:
-- 1. Exécutez ce script complet dans Supabase SQL Editor
-- 2. Dans Dashboard > Authentication > Settings, désactivez "Enable email confirmations" 
-- 3. Relancez le test de connexion: node test-connexions-supabase.js
-- ======================================================================
-- ======================================================================
-- FIN DU SCRIPT TOUT-EN-UN
-- ======================================================================
