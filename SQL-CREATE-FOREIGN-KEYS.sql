-- CRÉATION DES FOREIGN KEYS MANQUANTES
-- Exécutez ce script pour corriger les erreurs de relations dans la console

-- ========================================
-- 1. purchase_requests.buyer_id → profiles.id
-- ========================================
-- Erreur actuelle: "Could not find a relationship between 'purchase_requests' and 'profiles'"
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'purchase_requests_buyer_id_fkey'
  ) THEN
    ALTER TABLE purchase_requests
    ADD CONSTRAINT purchase_requests_buyer_id_fkey
    FOREIGN KEY (buyer_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ FK purchase_requests.buyer_id → profiles.id créée';
  ELSE
    RAISE NOTICE '⏭️  FK purchase_requests.buyer_id existe déjà';
  END IF;
END $$;

-- ========================================
-- 2. fraud_checks.property_id → properties.id
-- ========================================
-- Erreur actuelle: "Could not find a relationship between 'fraud_checks' and 'properties'"
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fraud_checks_property_id_fkey'
  ) THEN
    ALTER TABLE fraud_checks
    ADD CONSTRAINT fraud_checks_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ FK fraud_checks.property_id → properties.id créée';
  ELSE
    RAISE NOTICE '⏭️  FK fraud_checks.property_id existe déjà';
  END IF;
END $$;

-- ========================================
-- 3. gps_coordinates.property_id → properties.id
-- ========================================
-- Erreur actuelle: "Could not find a relationship between 'gps_coordinates' and 'properties'"
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gps_coordinates_property_id_fkey'
  ) THEN
    ALTER TABLE gps_coordinates
    ADD CONSTRAINT gps_coordinates_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ FK gps_coordinates.property_id → properties.id créée';
  ELSE
    RAISE NOTICE '⏭️  FK gps_coordinates.property_id existe déjà';
  END IF;
END $$;

-- ========================================
-- 4. blockchain_certificates.property_id → properties.id
-- ========================================
-- Erreur actuelle: "Could not find a relationship between 'blockchain_certificates' and 'properties'"
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'blockchain_certificates_property_id_fkey'
  ) THEN
    ALTER TABLE blockchain_certificates
    ADD CONSTRAINT blockchain_certificates_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ FK blockchain_certificates.property_id → properties.id créée';
  ELSE
    RAISE NOTICE '⏭️  FK blockchain_certificates.property_id existe déjà';
  END IF;
END $$;

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================
SELECT 
  constraint_name,
  table_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name IN ('purchase_requests', 'fraud_checks', 'gps_coordinates', 'blockchain_certificates')
  AND constraint_type = 'FOREIGN KEY'
ORDER BY table_name, constraint_name;
