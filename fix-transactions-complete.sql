-- ============================================
-- AJOUTER TOUTES LES COLONNES MANQUANTES À 'transactions'
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔧 Ajout des colonnes manquantes à transactions...';

  -- Colonne 'currency' (devise)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN currency TEXT DEFAULT 'XOF';
    RAISE NOTICE '✅ Colonne currency ajoutée';
  ELSE
    RAISE NOTICE '✓ currency existe déjà';
  END IF;

  -- Colonne 'description' (description de la transaction)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Colonne description ajoutée';
  ELSE
    RAISE NOTICE '✓ description existe déjà';
  END IF;

  -- Colonne 'metadata' (métadonnées JSONB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    CREATE INDEX IF NOT EXISTS idx_transactions_metadata ON public.transactions USING GIN (metadata);
    RAISE NOTICE '✅ Colonne metadata ajoutée avec index GIN';
  ELSE
    RAISE NOTICE '✓ metadata existe déjà';
  END IF;

  -- Colonne 'request_id' (référence à la demande)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'request_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN request_id UUID;
    CREATE INDEX IF NOT EXISTS idx_transactions_request_id ON public.transactions(request_id);
    RAISE NOTICE '✅ Colonne request_id ajoutée avec index';
  ELSE
    RAISE NOTICE '✓ request_id existe déjà';
  END IF;

  -- Mettre à jour les valeurs par défaut pour les lignes existantes
  UPDATE public.transactions 
  SET currency = 'XOF' 
  WHERE currency IS NULL;

  UPDATE public.transactions 
  SET metadata = '{}'::jsonb 
  WHERE metadata IS NULL;

  RAISE NOTICE '✅✅✅ Toutes les colonnes de transactions vérifiées et ajoutées!';
END $$;


-- ============================================
-- VÉRIFICATION FINALE
-- ============================================
SELECT 
  '📋 STRUCTURE COMPLÈTE DE TRANSACTIONS:' as info,
  column_name, 
  data_type,
  is_nullable,
  CASE 
    WHEN column_default IS NOT NULL THEN LEFT(column_default::text, 50)
    ELSE NULL 
  END as column_default_preview
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

-- Statistiques
SELECT 
  '📊 STATISTIQUES:' as info,
  COUNT(*) as nombre_total_colonnes,
  COUNT(CASE WHEN is_nullable = 'YES' THEN 1 END) as colonnes_nullables,
  COUNT(CASE WHEN column_default IS NOT NULL THEN 1 END) as colonnes_avec_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Colonne currency ajoutée
-- ✅ Colonne description ajoutée
-- ✅ Colonne metadata ajoutée avec index GIN
-- ✅ Colonne request_id ajoutée avec index
-- ✅✅✅ Toutes les colonnes de transactions vérifiées et ajoutées!
-- 
-- Puis deux tables:
-- 1. Structure complète de la table transactions
-- 2. Statistiques (nombre de colonnes, nullables, avec défaut)
