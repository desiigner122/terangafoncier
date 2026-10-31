-- ============================================
-- VÉRIFICATION DES TABLES EXISTANTES
-- ============================================

-- 1. Lister toutes les tables publiques
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Vérifier les tables essentielles
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as properties,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'offers' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as offers,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as documents,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as notifications,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as conversations,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as messages,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as transactions,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as projects,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'investments' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as investments,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blockchain_certificates' AND table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as blockchain_certificates;

-- 3. Colonnes de la table properties (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'properties'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Compter les enregistrements dans chaque table (seulement celles qui existent)
DO $$
DECLARE
    table_record RECORD;
    row_count INTEGER;
BEGIN
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '📊 COMPTAGE DES ENREGISTREMENTS';
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM public.%I', table_record.table_name) INTO row_count;
        RAISE NOTICE '  %-30s: % rows', table_record.table_name, row_count;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════';
END $$;
