-- EXÉCUTION RAPIDE: Ajouter monthly_income à requests
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS monthly_income NUMERIC;

-- Vérifier
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'requests' AND column_name = 'monthly_income';
