-- DÉSACTIVER TEMPORAIREMENT LES POLITIQUES RLS POUR CRÉATION DE COMPTES
-- Ce script désactive les politiques restrictives pour permettre la création et vérification des comptes

-- ⚠️ ATTENTION: Ce script désactive temporairement la sécurité RLS
-- À utiliser uniquement pour la création initiale des comptes, puis réactiver

-- 1. SAUVEGARDER L'ÉTAT ACTUEL DES POLITIQUES
-- (Pour information - les politiques actuelles)
/*
POLITIQUES ACTUELLES DÉTECTÉES:
- Enable insert for authenticated users only: INSERT avec auth.role() = 'authenticated'
- Users can update own profile: UPDATE avec auth.uid() = id  
- Users can view own profile: SELECT avec auth.uid() = id

PROBLÈME: Ces politiques empêchent la création en masse et la lecture administrative
*/

-- 2. DÉSACTIVER TEMPORAIREMENT RLS SUR LA TABLE PROFILES
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. VÉRIFIER QUE RLS EST DÉSACTIVÉ
SELECT 
    schemaname,
    tablename, 
    rowsecurity,
    CASE WHEN rowsecurity THEN '🔒 RLS ACTIVÉ' ELSE '🔓 RLS DÉSACTIVÉ' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 4. MAINTENANT VOUS POUVEZ EXÉCUTER LES SCRIPTS DE CRÉATION
-- Exécutez dans l'ordre:
-- A) reset-supabase-users.sql (si besoin de nettoyer)
-- B) create-standard-accounts.sql (création des comptes)
-- C) verify-accounts.sql (vérification)

-- 5. APRÈS CRÉATION DES COMPTES, RÉACTIVEZ RLS (IMPORTANT!)
-- DÉCOMMENTEZ ET EXÉCUTEZ CES LIGNES APRÈS AVOIR CRÉÉ LES COMPTES:

/*
-- RÉACTIVER RLS (À FAIRE APRÈS CRÉATION DES COMPTES)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- VÉRIFIER QUE RLS EST RÉACTIVÉ
SELECT 
    schemaname,
    tablename, 
    rowsecurity,
    CASE WHEN rowsecurity THEN '🔒 RLS RÉACTIVÉ ✅' ELSE '⚠️ RLS TOUJOURS DÉSACTIVÉ' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
*/

-- 6. OPTIONNEL: CRÉER UNE POLITIQUE TEMPORAIRE POUR L'ADMIN
-- Cette politique permet à un admin de voir tous les profils pendant les tests
/*
CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'Admin'
        )
    );
*/

-- INSTRUCTIONS D'UTILISATION:
-- 1. Exécutez ce script pour désactiver RLS
-- 2. Exécutez create-standard-accounts.sql pour créer les comptes
-- 3. Vérifiez avec verify-accounts.sql ou diagnostic-comptes.sql  
-- 4. IMPORTANT: Réactivez RLS en décommentant la section 5
-- 5. Optionnel: Ajoutez la politique admin pour les tests