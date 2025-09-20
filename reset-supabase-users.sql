-- ⚠️  SCRIPT DE SUPPRESSION COMPLÈTE DES UTILISATEURS SUPABASE ⚠️
-- Ce script supprime TOUS les comptes utilisateur et leurs données associées
-- ATTENTION: Cette action est IRRÉVERSIBLE - Créer une sauvegarde avant exécution

-- ÉTAPE 1: SAUVEGARDE DES DONNÉES EXISTANTES (optionnel)
-- Créer tables de sauvegarde avec timestamp
DO $$
DECLARE
    backup_suffix TEXT := '_backup_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS');
BEGIN
    -- Sauvegarder les profils
    EXECUTE format('CREATE TABLE profiles%s AS SELECT * FROM public.profiles', backup_suffix);
    RAISE NOTICE 'Sauvegarde profiles créée: profiles%', backup_suffix;
    
    -- Sauvegarder autres tables critiques si nécessaire
    -- EXECUTE format('CREATE TABLE parcels%s AS SELECT * FROM public.parcels', backup_suffix);
    -- EXECUTE format('CREATE TABLE requests%s AS SELECT * FROM public.requests', backup_suffix);
    
END $$;

-- ÉTAPE 2: SUPPRESSION DES DONNÉES DÉPENDANTES
-- Supprimer les données dans l'ordre inverse des dépendances pour éviter les erreurs FK

-- Supprimer les sessions actives
DELETE FROM auth.sessions;

-- Supprimer les jetons de rafraîchissement  
DELETE FROM auth.refresh_tokens;

-- Supprimer les facteurs MFA
DELETE FROM auth.mfa_factors;

-- Supprimer les challenges MFA
DELETE FROM auth.mfa_challenges;

-- Supprimer les audit logs
DELETE FROM auth.audit_log_entries;

-- Supprimer identités (OAuth, etc.)
DELETE FROM auth.identities;

-- Supprimer les données applicatives liées aux utilisateurs
-- (Adapter selon votre schéma de base de données)
DELETE FROM public.favorites WHERE user_id IN (SELECT id FROM auth.users);
DELETE FROM public.requests WHERE user_id IN (SELECT id FROM auth.users);
DELETE FROM public.parcels WHERE owner_id IN (SELECT id FROM auth.users);
DELETE FROM public.transactions WHERE user_id IN (SELECT id FROM auth.users);
DELETE FROM public.messages WHERE sender_id IN (SELECT id FROM auth.users) OR recipient_id IN (SELECT id FROM auth.users);
DELETE FROM public.notifications WHERE user_id IN (SELECT id FROM auth.users);

-- Supprimer les profils utilisateur
DELETE FROM public.profiles;

-- ÉTAPE 3: SUPPRESSION DES UTILISATEURS AUTH
-- Supprimer tous les utilisateurs dans auth.users
DELETE FROM auth.users;

-- ÉTAPE 4: RÉINITIALISER LES SÉQUENCES (si nécessaire)
-- Réinitialiser les compteurs d'ID auto-incrémentés
-- ALTER SEQUENCE profiles_id_seq RESTART WITH 1;

-- ÉTAPE 5: VÉRIFICATION DE LA SUPPRESSION
-- Vérifier que toutes les tables sont vides
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    SELECT COUNT(*) INTO session_count FROM auth.sessions;
    
    RAISE NOTICE '=== VÉRIFICATION POST-SUPPRESSION ===';
    RAISE NOTICE 'Utilisateurs auth.users: %', user_count;
    RAISE NOTICE 'Profils public.profiles: %', profile_count;
    RAISE NOTICE 'Sessions actives: %', session_count;
    
    IF user_count = 0 AND profile_count = 0 THEN
        RAISE NOTICE '✅ SUPPRESSION RÉUSSIE - Base de données nettoyée';
    ELSE
        RAISE NOTICE '⚠️ ATTENTION - Il reste des données non supprimées';
    END IF;
END $$;

-- NOTES IMPORTANTES:
-- 1. Exécuter ce script uniquement avec des privilèges service_role
-- 2. Vérifier que la sauvegarde s'est bien créée avant de continuer
-- 3. Ce script supprime TOUS les utilisateurs, y compris les administrateurs
-- 4. Après exécution, utiliser le script 'create-standard-accounts.sql' pour recréer les comptes types
-- 5. Les politiques RLS (Row Level Security) resteront en place
-- 6. Les tables structurelles ne sont pas supprimées, seulement les données