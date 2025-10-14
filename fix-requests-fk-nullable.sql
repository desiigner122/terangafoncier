-- ============================================
-- CORRIGER LA CONTRAINTE FK parcelle_id (PERMETTRE NULL)
-- ============================================

DO $$
BEGIN
  -- Supprimer l'ancienne contrainte FK si elle existe
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.requests'::regclass
      AND conname = 'requests_parcelle_id_fkey'
  ) THEN
    ALTER TABLE public.requests DROP CONSTRAINT requests_parcelle_id_fkey;
    RAISE NOTICE '✅ Ancienne contrainte requests_parcelle_id_fkey supprimée';
  END IF;

  -- Recréer la contrainte FK SANS restriction (permet NULL)
  -- Note: La colonne parcelle_id est déjà nullable, on ajoute juste la FK optionnelle
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'parcels'
  ) THEN
    ALTER TABLE public.requests 
    ADD CONSTRAINT requests_parcelle_id_fkey 
    FOREIGN KEY (parcelle_id) 
    REFERENCES public.parcels(id) 
    ON DELETE SET NULL;
    
    RAISE NOTICE '✅ Nouvelle contrainte requests_parcelle_id_fkey créée (permet NULL)';
  ELSE
    RAISE NOTICE '⚠️  Table parcels introuvable - contrainte FK non créée';
  END IF;

  -- Pareil pour project_id
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.requests'::regclass
      AND conname = 'requests_project_id_fkey'
  ) THEN
    ALTER TABLE public.requests DROP CONSTRAINT requests_project_id_fkey;
    RAISE NOTICE '✅ Ancienne contrainte requests_project_id_fkey supprimée';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name IN ('projects', 'project')
  ) THEN
    BEGIN
      ALTER TABLE public.requests 
      ADD CONSTRAINT requests_project_id_fkey 
      FOREIGN KEY (project_id) 
      REFERENCES public.projects(id) 
      ON DELETE SET NULL;
      
      RAISE NOTICE '✅ Nouvelle contrainte requests_project_id_fkey créée (permet NULL)';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '⚠️  Impossible de créer FK pour project_id (table projects introuvable)';
    END;
  END IF;

END $$;


-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher les contraintes FK
SELECT 
  '🔗 CONTRAINTES FK:' as info,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
  AND contype = 'f'
  AND conname LIKE '%parcelle%' OR conname LIKE '%project%'
ORDER BY conname;

-- Vérifier que les colonnes sont bien nullables
SELECT 
  '✅ COLONNES NULLABLES:' as info,
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests'
  AND column_name IN ('parcelle_id', 'project_id');


-- ============================================
-- TEST - INSÉRER UNE REQUEST SANS PARCELLE
-- ============================================
-- Simuler une insertion sans parcelle_id ni project_id
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Récupérer un user_id existant pour le test
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Tenter une insertion test
    INSERT INTO public.requests (
      user_id,
      type,
      status,
      parcelle_id,  -- NULL
      project_id,   -- NULL
      offered_price,
      note
    ) VALUES (
      test_user_id,
      'one_time',
      'pending',
      NULL,  -- ← Pas de parcelle
      NULL,  -- ← Pas de projet
      100000,
      'Test insertion sans parcelle ni projet'
    );
    
    RAISE NOTICE '✅ TEST RÉUSSI: Insertion possible sans parcelle_id ni project_id';
    
    -- Supprimer la ligne de test
    DELETE FROM public.requests WHERE note = 'Test insertion sans parcelle ni projet';
    RAISE NOTICE '✅ Ligne de test supprimée';
  ELSE
    RAISE NOTICE '⚠️  Aucun user trouvé pour le test';
  END IF;
END $$;


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Ancienne contrainte requests_parcelle_id_fkey supprimée
-- ✅ Nouvelle contrainte requests_parcelle_id_fkey créée (permet NULL)
-- ✅ TEST RÉUSSI: Insertion possible sans parcelle_id ni project_id
-- 
-- Puis trois tables affichant:
-- 1. Les contraintes FK (avec ON DELETE SET NULL)
-- 2. Les colonnes parcelle_id et project_id (is_nullable = YES)
-- 3. Message confirmant que l'insertion test a réussi
