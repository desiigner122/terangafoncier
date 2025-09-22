-- SUPPRIMER TOUS LES COMPTES EXISTANTS
-- ⚠️  ATTENTION: Ce script supprime TOUS les utilisateurs de la base de données
-- Utilisez uniquement pour un reset complet en développement

-- 1. Supprimer les données des tables qui référencent les utilisateurs (ordre important)
DELETE FROM public.audit_logs;
DELETE FROM public.requests WHERE user_id IS NOT NULL;
DELETE FROM public.favorites WHERE user_id IS NOT NULL; 
DELETE FROM public.profiles;
DELETE FROM public.users;

-- 2. Supprimer les sessions d'authentification  
DELETE FROM auth.sessions;

-- 3. Supprimer les identités d'authentification
DELETE FROM auth.identities;

-- 4. Supprimer les utilisateurs d'authentification
-- Ceci supprime aussi automatiquement les autres données liées
DELETE FROM auth.users;

-- 5. Vérification que tout est supprimé
SELECT 'audit_logs' AS table_name, COUNT(*) AS remaining FROM public.audit_logs
UNION ALL
SELECT 'requests', COUNT(*) FROM public.requests
UNION ALL
SELECT 'favorites', COUNT(*) FROM public.favorites
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'users', COUNT(*) FROM public.users
UNION ALL
SELECT 'auth.sessions', COUNT(*) FROM auth.sessions
UNION ALL
SELECT 'auth.identities', COUNT(*) FROM auth.identities
UNION ALL
SELECT 'auth.users', COUNT(*) FROM auth.users;

-- Les compteurs devraient tous être à 0