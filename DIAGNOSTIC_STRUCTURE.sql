-- SCRIPT DE DIAGNOSTIC ET CORRECTION SÉCURISÉ
-- Exécuter d'abord dans Supabase pour identifier la structure exacte

-- ==========================================
-- DIAGNOSTIC COMPLET DE LA STRUCTURE
-- ==========================================

-- 1. Structure exacte de audit_logs
SELECT 'AUDIT_LOGS - COLONNES EXISTANTES' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'audit_logs' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Structure exacte de requests  
SELECT 'REQUESTS - COLONNES EXISTANTES' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Structure exacte de parcels
SELECT 'PARCELS - COLONNES EXISTANTES' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'parcels' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Structure exacte de blog
SELECT 'BLOG - COLONNES EXISTANTES' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'blog' AND table_schema = 'public'
ORDER BY ordinal_position;
