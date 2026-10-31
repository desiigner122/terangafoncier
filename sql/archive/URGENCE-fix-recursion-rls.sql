-- ================================================================
-- SCRIPT D'URGENCE - CORRECTION RECURSION INFINIE RLS
-- Résout l'erreur: "infinite recursion detected in policy for relation users"
-- ================================================================

-- 1. SUPPRIMER TOUTES LES POLITIQUES RLS PROBLEMATIQUES
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Supprimer toutes les politiques sur la table users
    FOR policy_record IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', policy_record.policyname);
        RAISE NOTICE 'Politique supprimée: %', policy_record.policyname;
    END LOOP;
END $$;

-- 2. SUPPRIMER POLITIQUES STORAGE PROBLEMATIQUES
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Supprimer toutes les politiques sur storage.objects pour le bucket avatars
    FOR policy_record IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
        AND policyname LIKE '%avatar%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
        RAISE NOTICE 'Politique storage supprimée: %', policy_record.policyname;
    END LOOP;
END $$;

-- 3. DESACTIVER TEMPORAIREMENT RLS SUR USERS POUR TESTS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. RECREER DES POLITIQUES RLS SIMPLES ET SURES (sans récursion)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique SELECT simple - permet aux utilisateurs authentifiés de voir leur propre profil
CREATE POLICY "users_select_own" ON public.users
FOR SELECT TO authenticated
USING (id = auth.uid());

-- Politique INSERT simple - permet aux utilisateurs authentifiés d'insérer leur propre profil
CREATE POLICY "users_insert_own" ON public.users
FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

-- Politique UPDATE simple - permet aux utilisateurs authentifiés de modifier leur propre profil
CREATE POLICY "users_update_own" ON public.users
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 5. POLITIQUES STORAGE SIMPLES POUR AVATARS
-- Permettre à tous les utilisateurs authentifiés de voir les avatars (public read)
CREATE POLICY "avatars_select_authenticated" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- Permettre aux utilisateurs d'uploader leurs propres avatars
CREATE POLICY "avatars_insert_own" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permettre aux utilisateurs de modifier leurs propres avatars
CREATE POLICY "avatars_update_own" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permettre aux utilisateurs de supprimer leurs propres avatars
CREATE POLICY "avatars_delete_own" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. VERIFICATION FINALE
SELECT 'VERIFICATION POLITIQUES RLS:' as type;

-- Vérifier les politiques users
SELECT 'POLITIQUES USERS:' as type, policyname, permissive, cmd
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY policyname;

-- Vérifier les politiques storage
SELECT 'POLITIQUES STORAGE:' as type, policyname, permissive, cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE '%avatar%'
ORDER BY policyname;

-- Test de connexion simple
SELECT '🚀 CORRECTION RECURSION APPLIQUEE - TESTEZ MAINTENANT' as resultat;
