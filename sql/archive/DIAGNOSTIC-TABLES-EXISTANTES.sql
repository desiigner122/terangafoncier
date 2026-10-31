-- ============================================
-- DIAGNOSTIC: Vérifier toutes les tables existantes
-- ============================================
-- Date: 11 octobre 2025
-- Objectif: Identifier ce qui existe déjà dans Supabase
-- ============================================

-- 1. Lister toutes les tables dans le schéma public
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE columns.table_name = tables.table_name 
     AND columns.table_schema = 'public') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Détails de chaque table (colonnes)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. Vérifier les foreign keys
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. Vérifier les index
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. Vérifier les RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Vérifier les triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. Compter les enregistrements dans chaque table
DO $$
DECLARE
    r RECORD;
    count_result INTEGER;
BEGIN
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM public.%I', r.table_name) INTO count_result;
        RAISE NOTICE 'Table: % - Rows: %', r.table_name, count_result;
    END LOOP;
END $$;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Exécuter ce script dans Supabase SQL Editor
-- 2. Analyser les résultats
-- 3. Identifier les tables manquantes
-- 4. Exécuter ensuite CREATE-ESSENTIAL-TABLES.sql
-- ============================================

-- ✅ FIN DU SCRIPT
