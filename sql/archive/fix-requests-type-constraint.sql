-- ============================================
-- CORRIGER LA CONTRAINTE TYPE DE REQUESTS
-- ============================================

DO $$
BEGIN
  -- Supprimer l'ancienne contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.requests'::regclass
      AND conname = 'requests_type_check'
  ) THEN
    ALTER TABLE public.requests DROP CONSTRAINT requests_type_check;
    RAISE NOTICE '✅ Ancienne contrainte requests_type_check supprimée';
  END IF;

  -- Ajouter la nouvelle contrainte avec les bonnes valeurs
  ALTER TABLE public.requests 
  ADD CONSTRAINT requests_type_check 
  CHECK (type = ANY (ARRAY[
    'one_time'::text,           -- Paiement comptant direct
    'installments'::text,       -- Paiement échelonné
    'bank_financing'::text,     -- Financement bancaire
    'purchase'::text,           -- Achat général
    'construction'::text,       -- Demande de construction
    'municipal'::text,          -- Demande municipale
    'document'::text,           -- Demande de document
    'other'::text               -- Autre type
  ]));

  RAISE NOTICE '✅ Nouvelle contrainte requests_type_check créée avec 8 types valides';
END $$;


-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher la nouvelle contrainte
SELECT 
  '✅ NOUVELLE CONTRAINTE:' as info,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
  AND conname = 'requests_type_check';

-- Tester les valeurs (simulation)
SELECT 
  '🧪 TEST DES TYPES:' as info,
  type_value,
  CASE 
    WHEN type_value IN ('one_time', 'installments', 'bank_financing', 'purchase', 'construction', 'municipal', 'document', 'other')
    THEN '✅ Valide'
    ELSE '❌ Invalide'
  END as status
FROM (
  VALUES 
    ('one_time'),
    ('installments'),
    ('bank_financing'),
    ('purchase'),
    ('invalid_type')
) AS t(type_value);


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Ancienne contrainte requests_type_check supprimée
-- ✅ Nouvelle contrainte requests_type_check créée avec 8 types valides
-- 
-- Puis deux tables:
-- 1. La définition de la nouvelle contrainte CHECK
-- 2. Tests montrant que 'one_time', 'installments', 'bank_financing' sont valides
