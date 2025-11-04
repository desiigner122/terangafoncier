-- Vérifier la structure de purchase_cases
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
ORDER BY ordinal_position;

-- Vérifier si auth.users existe
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'auth'
LIMIT 5;

-- Compter les dossiers d'achat existants
SELECT COUNT(*) as purchase_cases_count FROM purchase_cases;
