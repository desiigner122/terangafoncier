-- ========================================
-- AJOUTER COLONNE monthly_income À requests
-- ========================================

-- PROBLÈME: "Could not find the 'monthly_income' column of 'requests'"
-- La colonne monthly_income est utilisée dans BankFinancingPage mais n'existe pas

-- 1. Vérifier si la colonne existe
SELECT 
    '📋 VÉRIFICATION monthly_income' as info,
    EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'requests'
        AND column_name = 'monthly_income'
    ) as colonne_existe;

-- 2. Voir les colonnes actuelles de requests
SELECT 
    '📋 COLONNES ACTUELLES' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'requests'
ORDER BY ordinal_position;

-- 3. Ajouter la colonne monthly_income si elle n'existe pas
-- EXÉCUTEZ CETTE LIGNE:
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS monthly_income NUMERIC;

-- 4. Ajouter un commentaire pour documenter
COMMENT ON COLUMN public.requests.monthly_income IS 'Revenus mensuels de l''acheteur pour le financement bancaire (en FCFA)';

-- 5. Vérifier après ajout
SELECT 
    '✅ APRÈS AJOUT' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'requests'
AND column_name = 'monthly_income';

-- 6. OPTIONNEL: Ajouter un index si nécessaire pour les requêtes de financement
CREATE INDEX IF NOT EXISTS idx_requests_monthly_income 
ON public.requests(monthly_income) 
WHERE monthly_income IS NOT NULL;

-- 7. Voir un exemple de request avec monthly_income
SELECT 
    '📊 EXEMPLE REQUEST' as info,
    id,
    type,
    payment_type,
    offered_price,
    monthly_income,
    status,
    created_at
FROM public.requests
WHERE type = 'bank_financing'
ORDER BY created_at DESC
LIMIT 5;
