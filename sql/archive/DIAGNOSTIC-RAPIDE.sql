-- ============================================
-- DIAGNOSTIC RAPIDE DE LA BASE DE DONNÉES
-- ============================================

-- 1️⃣ TOUTES LES TABLES EXISTANTES
SELECT 
    '📋 TABLE: ' || table_name as info,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as colonnes
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2️⃣ VÉRIFICATION DES TABLES ESSENTIELLES POUR TERANGA
WITH tables_to_check AS (
    SELECT unnest(ARRAY[
        'properties', 'offers', 'documents', 'notifications',
        'conversations', 'messages', 'transactions', 'favorites',
        'property_views', 'projects', 'investments', 'blockchain_certificates'
    ]) as table_name
)
SELECT 
    tc.table_name,
    CASE 
        WHEN t.table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tc.table_name AND table_schema = 'public'), 0) as columns
FROM tables_to_check tc
LEFT JOIN information_schema.tables t 
    ON t.table_name = tc.table_name 
    AND t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY tc.table_name;

-- 3️⃣ COLONNES DE LA TABLE PROPERTIES
SELECT 
    ordinal_position as "#",
    column_name,
    data_type,
    CASE WHEN is_nullable = 'YES' THEN '✓' ELSE '✗' END as nullable,
    CASE 
        WHEN column_default IS NOT NULL THEN substring(column_default, 1, 30)
        ELSE '-'
    END as default_value
FROM information_schema.columns
WHERE table_name = 'properties'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4️⃣ RÉSUMÉ GLOBAL
SELECT 
    COUNT(DISTINCT t.table_name) as total_tables,
    SUM((SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public')) as total_columns,
    COUNT(DISTINCT tc.constraint_name) as total_constraints
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc 
    ON t.table_name = tc.table_name 
    AND t.table_schema = tc.table_schema
WHERE t.table_schema = 'public'
AND t.table_type = 'BASE TABLE';
