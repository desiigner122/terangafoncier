-- Vérifier la structure de crm_contacts
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'crm_contacts'
ORDER BY ordinal_position;
