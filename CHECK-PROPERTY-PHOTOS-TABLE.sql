-- Vérifier la structure de la table property_photos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'property_photos'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier si la table existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'property_photos'
);
