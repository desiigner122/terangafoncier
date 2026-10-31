-- ========================================
-- CORRIGER LA CONTRAINTE type DANS requests
-- ========================================

-- 1. Voir la contrainte actuelle
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
    AND conname LIKE '%type%';

-- 2. Supprimer l'ancienne contrainte requests_type_check
ALTER TABLE public.requests 
DROP CONSTRAINT IF EXISTS requests_type_check;

-- 3. Ajouter une nouvelle contrainte avec toutes les valeurs
ALTER TABLE public.requests 
ADD CONSTRAINT requests_type_check 
CHECK (type IN (
    'one_time', 
    'installment_payment', 
    'installments',
    'bank_financing',
    'purchase_request',
    'sale_request'
));

-- 4. Vérifier la nouvelle contrainte
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
    AND conname = 'requests_type_check';

-- 5. Afficher les types actuellement utilisés
SELECT DISTINCT type, COUNT(*) as count
FROM public.requests
GROUP BY type
ORDER BY count DESC;
