-- Vérifier TOUTES les colonnes de support_tickets
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'support_tickets'
AND table_schema = 'public'
ORDER BY ordinal_position;
