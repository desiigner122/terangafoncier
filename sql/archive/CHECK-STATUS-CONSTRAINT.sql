-- Voir la contrainte CHECK sur le status
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'properties'::regclass
AND conname LIKE '%status%';

-- Voir toutes les contraintes sur properties
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'properties'::regclass
ORDER BY conname;
