-- =============================================
-- VÉRIFIER LA STRUCTURE DE LA TABLE PROPERTIES
-- =============================================

-- 1. Vérifier si la table existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'properties'
);

-- 2. Lister toutes les colonnes de la table properties
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'properties'
ORDER BY ordinal_position;

-- 3. Voir un exemple de données
SELECT * FROM properties LIMIT 1;
