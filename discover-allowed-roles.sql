-- DÉCOUVRIR LES RÔLES AUTORISÉS DANS LA CONTRAINTE PROFILES
-- Ce script révèle quelles valeurs sont acceptées pour la colonne 'role'

-- 1. Afficher la contrainte profiles_role_check
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'profiles_role_check';

-- 2. Afficher toutes les contraintes sur la table profiles
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' 
  AND tc.table_name = 'profiles';

-- 3. Voir tous les rôles existants dans la table (si il y en a)
SELECT DISTINCT 
    role,
    COUNT(*) as occurrences
FROM public.profiles 
GROUP BY role
ORDER BY role;

-- 4. Essayer quelques rôles courants pour voir lesquels passent
DO $$
DECLARE
    test_roles TEXT[] := ARRAY['admin', 'user', 'client', 'particulier', 'vendeur', 'acheteur', 'authenticated'];
    test_role TEXT;
    test_id UUID;
BEGIN
    FOREACH test_role IN ARRAY test_roles
    LOOP
        BEGIN
            test_id := gen_random_uuid();
            
            INSERT INTO public.profiles (id, email, role) 
            VALUES (test_id, 'test-' || test_role || '@test.com', test_role);
            
            RAISE NOTICE '✅ Rôle accepté: %', test_role;
            
            -- Nettoyer le test
            DELETE FROM public.profiles WHERE id = test_id;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Rôle refusé: % (Erreur: %)', test_role, SQLERRM;
        END;
    END LOOP;
END $$;

-- INSTRUCTIONS:
-- 1. Exécutez ce script pour découvrir les rôles autorisés
-- 2. Regardez la section 1 pour voir la contrainte exacte
-- 3. Observez la section 4 pour voir quels rôles sont acceptés
-- 4. Nous utiliserons ensuite le bon nom de rôle pour créer l'admin