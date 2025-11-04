-- Vérifier la structure actuelle de conversation_messages
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'conversation_messages'
ORDER BY 
    ordinal_position;
