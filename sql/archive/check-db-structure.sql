-- Script SQL simplifié compatible avec toutes les configurations Supabase
-- Vérification de la structure des tables d'abord

-- 1. Vérifier la structure de la table profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Compter les données existantes
SELECT 
  'profiles' as table_name, 
  COUNT(*) as count 
FROM profiles
UNION ALL
SELECT 'properties', COUNT(*) FROM properties  
UNION ALL
SELECT 'support_tickets', COUNT(*) FROM support_tickets
UNION ALL
SELECT 'marketing_leads', COUNT(*) FROM marketing_leads
UNION ALL
SELECT 'blockchain_transactions', COUNT(*) FROM blockchain_transactions;