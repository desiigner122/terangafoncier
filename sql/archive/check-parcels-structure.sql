-- ========================================
-- VÉRIFIER LA STRUCTURE DE LA TABLE PARCELS
-- ========================================

-- Voir toutes les colonnes de la table parcels
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'parcels'
ORDER BY ordinal_position;

-- Voir les contraintes
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.parcels'::regclass;
