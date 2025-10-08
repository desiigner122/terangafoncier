-- 🔧 PRÉPARATION - Installation des extensions nécessaires
-- Exécutez ce script EN PREMIER, avant cleanup et create

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour gérer les adresses IP
CREATE EXTENSION IF NOT EXISTS "citext";

-- Extension pour les opérations géographiques (optionnel mais recommandé)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Extensions installées avec succès!';
  RAISE NOTICE '📦 Extensions activées:';
  RAISE NOTICE '  - uuid-ossp (pour UUIDs)';
  RAISE NOTICE '  - citext (pour adresses IP)';
  RAISE NOTICE '  - postgis (pour géolocalisation)';
  RAISE NOTICE '';
  RAISE NOTICE '➡️ Vous pouvez maintenant exécuter:';
  RAISE NOTICE '  1. cleanup-crm-tables.sql';
  RAISE NOTICE '  2. create-crm-analytics-tables.sql';
END $$;