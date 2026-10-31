-- Vérifier la structure de admin_notifications
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admin_notifications'
AND table_schema = 'public'
ORDER BY ordinal_position;
