-- 🔍 VÉRIFICATION COMPLÈTE TABLE REQUESTS - TERANGA FONCIER
-- ===========================================================

-- Vérifier la structure actuelle de la table requests
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'type', 'status', 'title', 'description', 'user_id', 'property_id', 'municipality_id', 'data', 'created_at', 'updated_at') 
    THEN '✅ Attendu' 
    ELSE '❓ Inattendu' 
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests'
ORDER BY ordinal_position;

-- Vérifier les contraintes de la table requests
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'requests' 
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- Colonnes manquantes (si elles n'existent pas)
SELECT 
  'Colonnes manquantes:' as info,
  string_agg(missing_col, ', ') as missing_columns
FROM (
  SELECT unnest(ARRAY['id', 'type', 'status', 'title', 'description', 'user_id', 'property_id', 'municipality_id', 'data', 'created_at', 'updated_at']) as missing_col
  EXCEPT 
  SELECT column_name FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = 'requests'
) missing;

-- Résumé de la structure attendue vs actuelle
DO $$
DECLARE
    expected_columns text[] := ARRAY['id', 'type', 'status', 'title', 'description', 'user_id', 'property_id', 'municipality_id', 'data', 'created_at', 'updated_at'];
    actual_count integer;
    expected_count integer := array_length(expected_columns, 1);
BEGIN
    SELECT COUNT(*) INTO actual_count 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'requests';
    
    RAISE NOTICE '📊 RÉSUMÉ STRUCTURE REQUESTS:';
    RAISE NOTICE '══════════════════════════════';
    RAISE NOTICE '📝 Colonnes attendues: %', expected_count;
    RAISE NOTICE '📝 Colonnes actuelles: %', actual_count;
    RAISE NOTICE '✅ Correspondance: %', CASE WHEN actual_count >= expected_count THEN 'OK' ELSE 'MANQUANT' END;
    
    IF actual_count < expected_count THEN
        RAISE NOTICE '⚠️  Exécuter fix-table-structure.sql pour corriger';
    ELSE
        RAISE NOTICE '🎉 Structure requests complète !';
    END IF;
END $$;
