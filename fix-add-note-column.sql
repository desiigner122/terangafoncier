-- ============================================
-- AJOUTER LA COLONNE 'note' À LA TABLE 'requests'
-- ============================================

DO $$
BEGIN
  -- Vérifier et ajouter la colonne 'note' si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'requests' 
      AND column_name = 'note'
  ) THEN
    ALTER TABLE public.requests 
    ADD COLUMN note TEXT;
    
    RAISE NOTICE '✅ Colonne note ajoutée à requests';
  ELSE
    RAISE NOTICE '✓ Colonne note existe déjà';
  END IF;
END $$;


-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 
  '✅ COLONNE NOTE:' as info,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'note';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Colonne note ajoutée à requests
-- 
-- Puis une table affichant:
-- column_name: note
-- data_type: text
-- is_nullable: YES
-- column_default: NULL
