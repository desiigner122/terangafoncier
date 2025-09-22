-- SUPPRESSION SÉCURISÉE DE TOUS LES COMPTES
-- ⚠️  ATTENTION: Ce script supprime TOUS les utilisateurs de la base de données
-- Basé uniquement sur les tables confirmées qui existent

-- 1. Supprimer les données des tables qui référencent les utilisateurs
DELETE FROM public.parcels;
DELETE FROM public.audit_logs;
DELETE FROM public.requests;
DELETE FROM public.favorites;

-- 2. Supprimer les profils utilisateur
DELETE FROM public.profiles;

-- 3. Supprimer les utilisateurs publics
DELETE FROM public.users;

-- 4. Supprimer toutes les sessions d'authentification
DELETE FROM auth.sessions;

-- 5. Supprimer toutes les identités d'authentification
DELETE FROM auth.identities;

-- 6. Supprimer tous les utilisateurs d'authentification
DELETE FROM auth.users;

-- 7. Vérification finale
SELECT 
  'parcels' AS table_name, 
  COUNT(*) AS remaining 
FROM public.parcels
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM public.audit_logs
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
SELECT 'auth.users', COUNT(*) FROM auth.users
ORDER BY table_name;

-- ✅ Tous les compteurs devraient être à 0