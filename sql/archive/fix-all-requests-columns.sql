-- ============================================
-- AJOUTER TOUTES LES COLONNES MANQUANTES À 'requests'
-- ============================================

DO $$
BEGIN
  -- Colonne 'note' (TEXT)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'note'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN note TEXT;
    RAISE NOTICE '✅ Colonne note ajoutée';
  END IF;

  -- Colonne 'offered_price' (NUMERIC pour les montants)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'offered_price'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN offered_price NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne offered_price ajoutée';
  END IF;

  -- Colonne 'payment_method' (TEXT)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN payment_method TEXT;
    RAISE NOTICE '✅ Colonne payment_method ajoutée';
  END IF;

  -- Colonne 'installment_plan' (JSONB pour stocker les détails des paiements échelonnés)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'installment_plan'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN installment_plan JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne installment_plan ajoutée';
  END IF;

  -- Colonne 'bank_details' (JSONB pour les détails bancaires)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'bank_details'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN bank_details JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne bank_details ajoutée';
  END IF;

  -- Colonne 'down_payment' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'down_payment'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN down_payment NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne down_payment ajoutée';
  END IF;

  -- Colonne 'loan_amount' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'loan_amount'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN loan_amount NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne loan_amount ajoutée';
  END IF;

  -- Colonne 'interest_rate' (NUMERIC pour le taux d'intérêt)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'interest_rate'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN interest_rate NUMERIC(5, 2);
    RAISE NOTICE '✅ Colonne interest_rate ajoutée';
  END IF;

  -- Colonne 'loan_duration_months' (INTEGER)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'loan_duration_months'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN loan_duration_months INTEGER;
    RAISE NOTICE '✅ Colonne loan_duration_months ajoutée';
  END IF;

  -- Colonne 'monthly_payment' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'monthly_payment'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN monthly_payment NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne monthly_payment ajoutée';
  END IF;

  -- S'assurer que 'metadata' existe (déjà ajouté normalement)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    CREATE INDEX IF NOT EXISTS idx_requests_metadata ON public.requests USING GIN (metadata);
    RAISE NOTICE '✅ Colonne metadata ajoutée';
  END IF;

  RAISE NOTICE '✅✅✅ TOUTES LES COLONNES VÉRIFIÉES ET AJOUTÉES ✅✅✅';
END $$;


-- ============================================
-- VÉRIFICATION - AFFICHER TOUTES LES COLONNES
-- ============================================
SELECT 
  '📋 STRUCTURE COMPLÈTE DE REQUESTS:' as info,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests'
ORDER BY ordinal_position;


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Messages de confirmation pour chaque colonne ajoutée
-- ✅✅✅ TOUTES LES COLONNES VÉRIFIÉES ET AJOUTÉES
-- 
-- Puis une table affichant TOUTES les colonnes de la table requests avec:
-- - column_name
-- - data_type
-- - is_nullable
-- - column_default
