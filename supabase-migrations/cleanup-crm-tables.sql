-- 🧹 SCRIPT DE NETTOYAGE - Supprime toutes les tables CRM et Analytics
-- Exécutez ce script AVANT de réexécuter create-crm-analytics-tables.sql

-- Supprimer les tables avec CASCADE pour supprimer automatiquement toutes les dépendances
-- (politiques RLS, triggers, contraintes, etc.)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS property_views CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS crm_interactions CASCADE;
DROP TABLE IF EXISTS crm_contacts CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_crm_contacts_updated_at() CASCADE;
DROP FUNCTION IF EXISTS get_vendor_monthly_stats(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_vendor_top_properties(UUID, INTEGER) CASCADE;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '🧹 Nettoyage terminé!';
  RAISE NOTICE '✅ Toutes les tables CRM et Analytics ont été supprimées';
  RAISE NOTICE '📝 Vous pouvez maintenant exécuter create-crm-analytics-tables.sql';
END $$;
