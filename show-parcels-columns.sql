-- ========================================
-- AFFICHER LA STRUCTURE DE LA TABLE PARCELS
-- ========================================

-- Liste simple de toutes les colonnes
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'parcels'
ORDER BY ordinal_position;
