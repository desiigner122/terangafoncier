-- ANALYSE STRUCTURE TABLE PROPERTIES
-- Exécutez cette query pour voir TOUTES les colonnes disponibles

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'properties'
ORDER BY ordinal_position;
-- Affiche toutes les colonnes de la table properties avec leurs types
