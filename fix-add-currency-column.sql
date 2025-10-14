-- ============================================
-- AJOUTER LA COLONNE 'currency' À 'transactions'
-- ============================================

DO $$
BEGIN
  -- Ajouter la colonne currency si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN currency TEXT DEFAULT 'XOF';
    RAISE NOTICE '✅ Colonne currency ajoutée';
  ELSE
    RAISE NOTICE '✓ Colonne currency existe déjà';
  END IF;

  -- Mettre à jour les transactions existantes sans currency
  UPDATE public.transactions 
  SET currency = 'XOF' 
  WHERE currency IS NULL;
  
  RAISE NOTICE '✅ Transactions mises à jour avec currency par défaut';
END $$;


-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 
  '✅ COLONNE CURRENCY:' as info,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions' 
  AND column_name = 'currency';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Colonne currency ajoutée
-- ✅ Transactions mises à jour avec currency par défaut
-- 
-- Puis une table affichant:
-- column_name: currency
-- data_type: text
-- is_nullable: YES
-- column_default: 'XOF'::text
