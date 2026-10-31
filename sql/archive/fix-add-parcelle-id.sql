-- ============================================
-- AJOUTER LA COLONNE 'parcelle_id' À 'requests'
-- ============================================

DO $$
BEGIN
  -- Ajouter la colonne parcelle_id si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'parcelle_id'
  ) THEN
    -- Ajouter la colonne (UUID pour référence à la table parcels/parcelles)
    ALTER TABLE public.requests ADD COLUMN parcelle_id UUID;
    
    -- Créer un index pour améliorer les performances des requêtes
    CREATE INDEX IF NOT EXISTS idx_requests_parcelle_id ON public.requests(parcelle_id);
    
    RAISE NOTICE '✅ Colonne parcelle_id ajoutée avec index';
  ELSE
    RAISE NOTICE '✓ Colonne parcelle_id existe déjà';
  END IF;
  
  -- Optionnel : Ajouter la contrainte de clé étrangère si la table parcels existe
  -- Note: On vérifie d'abord si la table existe pour éviter les erreurs
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name IN ('parcels', 'parcelles')
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'requests_parcelle_id_fkey'
  ) THEN
    -- Essayer d'abord avec 'parcels'
    BEGIN
      ALTER TABLE public.requests 
      ADD CONSTRAINT requests_parcelle_id_fkey 
      FOREIGN KEY (parcelle_id) REFERENCES public.parcels(id) ON DELETE SET NULL;
      
      RAISE NOTICE '✅ Contrainte de clé étrangère ajoutée vers parcels';
    EXCEPTION WHEN OTHERS THEN
      -- Si ça échoue, essayer avec 'parcelles'
      BEGIN
        ALTER TABLE public.requests 
        ADD CONSTRAINT requests_parcelle_id_fkey 
        FOREIGN KEY (parcelle_id) REFERENCES public.parcelles(id) ON DELETE SET NULL;
        
        RAISE NOTICE '✅ Contrainte de clé étrangère ajoutée vers parcelles';
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Impossible d''ajouter la contrainte FK (table parcels/parcelles introuvable)';
      END;
    END;
  END IF;
  
END $$;


-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher la colonne parcelle_id
SELECT 
  '✅ COLONNE PARCELLE_ID:' as info,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'parcelle_id';

-- Afficher les contraintes de clé étrangère
SELECT 
  '🔗 CONTRAINTES FK:' as info,
  constraint_name,
  table_name
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'requests'
  AND constraint_type = 'FOREIGN KEY'
  AND constraint_name LIKE '%parcelle%';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Colonne parcelle_id ajoutée avec index
-- ✅ Contrainte de clé étrangère ajoutée vers parcels (ou parcelles)
-- 
-- Puis deux tables affichant:
-- 1. La colonne parcelle_id (type: uuid, nullable: YES)
-- 2. Les contraintes FK liées aux parcelles
