-- ======================================================================
-- VÉRIFICATION ET CORRECTION DES CONTRAINTES DE RÔLES
-- Investigation et mise à jour des contraintes profiles_role_check
-- ======================================================================

-- Vérifier les contraintes existantes sur la table profiles
SELECT 
    '=== CONTRAINTES ACTUELLES SUR PROFILES ===' as section;

SELECT 
    con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'public'
  AND rel.relname = 'profiles'
  AND con.contype = 'c'; -- Check constraints

-- Vérifier les rôles actuellement dans la table profiles
SELECT 
    '=== RÔLES EXISTANTS DANS PROFILES ===' as section;

SELECT DISTINCT 
    role,
    COUNT(*) as count
FROM public.profiles 
WHERE role IS NOT NULL
GROUP BY role
ORDER BY role;

-- Vérifier les rôles dans auth.users (metadata)
SELECT 
    '=== RÔLES DANS AUTH.USERS (METADATA) ===' as section;

SELECT DISTINCT 
    raw_user_meta_data->>'role' as role_metadata,
    COUNT(*) as count
FROM auth.users 
WHERE raw_user_meta_data->>'role' IS NOT NULL
GROUP BY raw_user_meta_data->>'role'
ORDER BY raw_user_meta_data->>'role';

-- Proposer une solution : Mise à jour de la contrainte pour inclure les nouveaux rôles
SELECT 
    '=== SOLUTION PROPOSÉE ===' as section;

SELECT 
    'La contrainte profiles_role_check doit être mise à jour pour inclure:' as probleme;

SELECT 
    'mairie, investisseur, geometre' as nouveaux_roles_necessaires;

-- Script pour supprimer l'ancienne contrainte et créer la nouvelle
SELECT 
    '=== SCRIPT DE CORRECTION ===' as section;

-- Commenter ces lignes pour affichage, décommenter pour exécution
/*
-- Supprimer l'ancienne contrainte
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Créer la nouvelle contrainte avec tous les rôles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY(ARRAY[
    'admin'::text, 
    'particulier'::text, 
    'vendeur'::text, 
    'promoteur'::text, 
    'banque'::text, 
    'notaire'::text, 
    'agent_foncier'::text,
    'mairie'::text,
    'investisseur'::text,
    'geometre'::text
]));
*/

SELECT 'Décommentez le script ci-dessus pour appliquer la correction' as instruction;