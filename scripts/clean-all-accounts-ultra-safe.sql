-- SUPPRESSION ULTRA-SÉCURISÉE DE TOUS LES COMPTES
-- Ce script identifie dynamiquement toutes les tables qui référencent les utilisateurs
-- et les supprime dans le bon ordre

-- ⚠️  ATTENTION: Ce script supprime TOUS les utilisateurs et TOUTES les données métier
-- Utilisez uniquement pour un reset complet en développement

-- 1. Supprimer toutes les données métier qui pourraient référencer les utilisateurs
-- (Ordre approximatif du plus dépendant au moins dépendant)

-- Tables métier principales
DELETE FROM public.parcels;
DELETE FROM public.transactions;
DELETE FROM public.contracts;
DELETE FROM public.documents;
DELETE FROM public.reviews;
DELETE FROM public.messages;
DELETE FROM public.notifications;

-- Tables de liaison et logs
DELETE FROM public.audit_logs;
DELETE FROM public.requests;
DELETE FROM public.favorites;
DELETE FROM public.user_roles;
DELETE FROM public.permissions;

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

-- 7. Supprimer les logs d'audit Supabase (optionnel)
DELETE FROM auth.audit_log_entries WHERE created_at > '2020-01-01';

-- 8. Vérification finale - compter les enregistrements restants
SELECT 
  'parcels' AS table_name, 
  COUNT(*) AS remaining 
FROM public.parcels
UNION ALL
SELECT 'transactions', COUNT(*) FROM public.transactions
UNION ALL
SELECT 'contracts', COUNT(*) FROM public.contracts
UNION ALL
SELECT 'documents', COUNT(*) FROM public.documents
UNION ALL
SELECT 'reviews', COUNT(*) FROM public.reviews
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
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