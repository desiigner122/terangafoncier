-- SCRIPT DE VÉRIFICATION ET CORRECTION PROGRESSIVE
-- À exécuter dans l'éditeur SQL de Supabase ÉTAPE PAR ÉTAPE

-- ==========================================
-- ÉTAPE 1: VÉRIFICATION DE LA STRUCTURE EXISTANTE
-- ==========================================

-- Vérifier la structure des tables principales
SELECT 'audit_logs' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'audit_logs' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'requests' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'parcels' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'parcels' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'blog' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog' AND table_schema = 'public'
ORDER BY ordinal_position;
