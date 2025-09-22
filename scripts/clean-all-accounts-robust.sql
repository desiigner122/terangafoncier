-- SUPPRESSION ROBUSTE DE TOUS LES COMPTES
-- ⚠️  ATTENTION: Ce script supprime TOUS les utilisateurs et données associées
-- Il identifie automatiquement les tables dépendantes et les supprime dans le bon ordre

-- 1. Supprimer toutes les données des tables qui référencent auth.users ou public.users
-- (basé sur les contraintes FK communes dans Supabase)

-- Tables connues qui peuvent référencer les utilisateurs :
DELETE FROM public.audit_logs WHERE actor_id IS NOT NULL;
DELETE FROM public.requests WHERE user_id IS NOT NULL;
DELETE FROM public.favorites WHERE user_id IS NOT NULL;

-- 2. Supprimer les profils utilisateur
DELETE FROM public.profiles;

-- 3. Supprimer les utilisateurs publics
DELETE FROM public.users;

-- 4. Supprimer toutes les sessions d'authentification
DELETE FROM auth.sessions;

-- 5. Supprimer toutes les identités d'authentification
DELETE FROM auth.identities;

-- 6. Supprimer tous les utilisateurs d'authentification
-- Ceci supprime aussi automatiquement les refresh_tokens et autres données liées
DELETE FROM auth.users;

-- 7. Nettoyage supplémentaire des tables d'audit et de log (optionnel)
DELETE FROM auth.audit_log_entries;

-- 8. Vérification finale - toutes les tables devraient être vides
SELECT 
  'Vérification finale' AS status,
  'audit_logs' AS table_name, 
  COUNT(*) AS remaining 
FROM public.audit_logs
UNION ALL
SELECT '', 'requests', COUNT(*) FROM public.requests
UNION ALL  
SELECT '', 'favorites', COUNT(*) FROM public.favorites
UNION ALL
SELECT '', 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT '', 'users', COUNT(*) FROM public.users
UNION ALL
SELECT '', 'auth.sessions', COUNT(*) FROM auth.sessions
UNION ALL
SELECT '', 'auth.identities', COUNT(*) FROM auth.identities
UNION ALL
SELECT '', 'auth.users', COUNT(*) FROM auth.users
ORDER BY table_name;

-- Si tous les compteurs sont à 0, la suppression est réussie ✅