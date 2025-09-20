-- DIAGNOSTIC SPÉCIFIQUE POUR LA TABLE PROFILES
-- Ce script identifie pourquoi les insertions dans public.profiles échouent

-- 1. STRUCTURE EXACTE DE LA TABLE PROFILES
SELECT 
    '=== COLONNES DE LA TABLE PROFILES ===' as info,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. CONTRAINTES ET INDEX SUR LA TABLE PROFILES
SELECT 
    '=== CONTRAINTES PROFILES ===' as info,
    constraint_name,
    constraint_type,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
  AND tc.table_name = 'profiles';

-- 3. TRIGGERS SUR LA TABLE PROFILES
SELECT 
    '=== TRIGGERS PROFILES ===' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'profiles';

-- 4. TEST D'INSERTION MINIMAL DANS PROFILES
-- Essayons avec seulement les colonnes essentielles
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE '🧪 Test insertion minimale dans profiles...';
    
    -- Test avec seulement ID et email
    BEGIN
        INSERT INTO public.profiles (id, email) 
        VALUES (test_id, 'minimal.test@terangafoncier.sn');
        RAISE NOTICE '✅ Insertion minimale réussie (id + email)';
        
        -- Nettoyer le test
        DELETE FROM public.profiles WHERE id = test_id;
        RAISE NOTICE '🧹 Test nettoyé';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur insertion minimale: %', SQLERRM;
    END;
    
    -- Test avec colonnes obligatoires potentielles
    BEGIN
        INSERT INTO public.profiles (id, email, created_at) 
        VALUES (test_id, 'minimal2.test@terangafoncier.sn', NOW());
        RAISE NOTICE '✅ Insertion avec created_at réussie';
        
        -- Nettoyer le test
        DELETE FROM public.profiles WHERE id = test_id;
        RAISE NOTICE '🧹 Test 2 nettoyé';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur insertion avec created_at: %', SQLERRM;
    END;
    
END $$;

-- 5. VÉRIFIER LES POLITIQUES RLS ENCORE ACTIVES
SELECT 
    '=== STATUT RLS PROFILES ===' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN '🔒 RLS ACTIVÉ' ELSE '🔓 RLS DÉSACTIVÉ' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 6. LISTER LES POLITIQUES EXISTANTES (MÊME SI RLS DÉSACTIVÉ)
SELECT 
    '=== POLITIQUES RLS ===' as info,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- INSTRUCTIONS:
-- 1. Regardez la structure de la table (section 1)
-- 2. Identifiez les contraintes qui pourraient bloquer (section 2) 
-- 3. Vérifiez s'il y a des triggers qui interfèrent (section 3)
-- 4. Observez les tests d'insertion minimale (section 4)
-- 5. Confirmez que RLS est bien désactivé (section 5)