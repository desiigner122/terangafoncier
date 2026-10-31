-- ============================================
-- SCRIPT FINAL - AJOUTER TOUTES LES COLONNES MANQUANTES À 'requests'
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Début de la vérification et ajout des colonnes...';

  -- Colonne 'parcelle_id' (UUID - référence aux parcelles)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'parcelle_id'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN parcelle_id UUID;
    CREATE INDEX IF NOT EXISTS idx_requests_parcelle_id ON public.requests(parcelle_id);
    RAISE NOTICE '✅ Colonne parcelle_id ajoutée';
  ELSE
    RAISE NOTICE '✓ parcelle_id existe déjà';
  END IF;

  -- Colonne 'project_id' (UUID - référence aux projets)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN project_id UUID;
    CREATE INDEX IF NOT EXISTS idx_requests_project_id ON public.requests(project_id);
    RAISE NOTICE '✅ Colonne project_id ajoutée';
  ELSE
    RAISE NOTICE '✓ project_id existe déjà';
  END IF;

  -- Colonne 'note' (TEXT)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'note'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN note TEXT;
    RAISE NOTICE '✅ Colonne note ajoutée';
  ELSE
    RAISE NOTICE '✓ note existe déjà';
  END IF;

  -- Colonne 'offered_price' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'offered_price'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN offered_price NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne offered_price ajoutée';
  ELSE
    RAISE NOTICE '✓ offered_price existe déjà';
  END IF;

  -- Colonne 'payment_method' (TEXT)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN payment_method TEXT;
    RAISE NOTICE '✅ Colonne payment_method ajoutée';
  ELSE
    RAISE NOTICE '✓ payment_method existe déjà';
  END IF;

  -- Colonne 'installment_plan' (JSONB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'installment_plan'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN installment_plan JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne installment_plan ajoutée';
  ELSE
    RAISE NOTICE '✓ installment_plan existe déjà';
  END IF;

  -- Colonne 'bank_details' (JSONB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'bank_details'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN bank_details JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne bank_details ajoutée';
  ELSE
    RAISE NOTICE '✓ bank_details existe déjà';
  END IF;

  -- Colonne 'down_payment' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'down_payment'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN down_payment NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne down_payment ajoutée';
  ELSE
    RAISE NOTICE '✓ down_payment existe déjà';
  END IF;

  -- Colonne 'loan_amount' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'loan_amount'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN loan_amount NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne loan_amount ajoutée';
  ELSE
    RAISE NOTICE '✓ loan_amount existe déjà';
  END IF;

  -- Colonne 'interest_rate' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'interest_rate'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN interest_rate NUMERIC(5, 2);
    RAISE NOTICE '✅ Colonne interest_rate ajoutée';
  ELSE
    RAISE NOTICE '✓ interest_rate existe déjà';
  END IF;

  -- Colonne 'loan_duration_months' (INTEGER)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'loan_duration_months'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN loan_duration_months INTEGER;
    RAISE NOTICE '✅ Colonne loan_duration_months ajoutée';
  ELSE
    RAISE NOTICE '✓ loan_duration_months existe déjà';
  END IF;

  -- Colonne 'monthly_payment' (NUMERIC)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'monthly_payment'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN monthly_payment NUMERIC(15, 2);
    RAISE NOTICE '✅ Colonne monthly_payment ajoutée';
  ELSE
    RAISE NOTICE '✓ monthly_payment existe déjà';
  END IF;

  -- Colonne 'metadata' (JSONB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    CREATE INDEX IF NOT EXISTS idx_requests_metadata ON public.requests USING GIN (metadata);
    RAISE NOTICE '✅ Colonne metadata ajoutée';
  ELSE
    RAISE NOTICE '✓ metadata existe déjà';
  END IF;

  -- Colonne 'nft_token_id' (TEXT - pour le NFT proof)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'nft_token_id'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN nft_token_id TEXT;
    RAISE NOTICE '✅ Colonne nft_token_id ajoutée';
  ELSE
    RAISE NOTICE '✓ nft_token_id existe déjà';
  END IF;

  -- Colonne 'nft_tx_hash' (TEXT - pour le hash de transaction NFT)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'nft_tx_hash'
  ) THEN
    ALTER TABLE public.requests ADD COLUMN nft_tx_hash TEXT;
    RAISE NOTICE '✅ Colonne nft_tx_hash ajoutée';
  ELSE
    RAISE NOTICE '✓ nft_tx_hash existe déjà';
  END IF;

  RAISE NOTICE '🎉 Vérification terminée - Toutes les colonnes sont maintenant présentes!';
END $$;


-- ============================================
-- VÉRIFICATION FINALE - STRUCTURE COMPLÈTE
-- ============================================
SELECT 
  '📋 STRUCTURE COMPLÈTE DE LA TABLE REQUESTS:' as info,
  column_name, 
  data_type,
  is_nullable,
  CASE 
    WHEN column_default IS NOT NULL THEN LEFT(column_default::text, 50)
    ELSE NULL 
  END as column_default_preview
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests'
ORDER BY ordinal_position;

-- Afficher le nombre total de colonnes
SELECT 
  '📊 STATISTIQUES:' as info,
  COUNT(*) as nombre_total_colonnes,
  COUNT(CASE WHEN is_nullable = 'YES' THEN 1 END) as colonnes_nullables,
  COUNT(CASE WHEN column_default IS NOT NULL THEN 1 END) as colonnes_avec_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- 🔧 Messages de progression
-- ✅ Messages de confirmation pour chaque colonne ajoutée
-- 🎉 Vérification terminée - Toutes les colonnes sont maintenant présentes!
-- 
-- Puis deux tables:
-- 1. Liste complète de TOUTES les colonnes avec types et valeurs par défaut
-- 2. Statistiques: nombre total de colonnes, nullables, avec default
