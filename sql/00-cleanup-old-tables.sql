-- =============================================================================
-- NETTOYAGE: Supprimer anciennes tables avant réinstallation
-- =============================================================================
-- Date: 2025-10-07
-- Description: Supprime les tables existantes pour éviter les conflits
-- ATTENTION: Ceci supprime TOUTES les données existantes dans ces tables
-- =============================================================================

-- Désactiver temporairement les contraintes de clés étrangères
SET session_replication_role = 'replica';

-- SUPPORT TABLES
DROP TABLE IF EXISTS support_responses CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_categories CASCADE;

-- MESSAGING TABLES  
DROP TABLE IF EXISTS message_reactions CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- DIGITAL SERVICES TABLES
DROP TABLE IF EXISTS service_invoices CASCADE;
DROP TABLE IF EXISTS service_usage CASCADE;
DROP TABLE IF EXISTS service_subscriptions CASCADE;
DROP TABLE IF EXISTS digital_services CASCADE;

-- PROSPECTS TABLE (si elle existe)
DROP TABLE IF EXISTS prospects CASCADE;

-- Supprimer les vues
DROP VIEW IF EXISTS support_tickets_with_stats CASCADE;
DROP VIEW IF EXISTS support_stats CASCADE;
DROP VIEW IF EXISTS conversations_with_details CASCADE;
DROP VIEW IF EXISTS messages_with_sender CASCADE;
DROP VIEW IF EXISTS messaging_stats CASCADE;
DROP VIEW IF EXISTS subscriptions_with_services CASCADE;
DROP VIEW IF EXISTS usage_stats_by_service CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_ticket_number() CASCADE;
DROP FUNCTION IF EXISTS set_first_response_at() CASCADE;
DROP FUNCTION IF EXISTS update_conversation_on_new_message() CASCADE;
DROP FUNCTION IF EXISTS update_unread_count_on_read() CASCADE;
DROP FUNCTION IF EXISTS mark_conversation_as_read(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS archive_conversation(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_subscription_usage() CASCADE;
DROP FUNCTION IF EXISTS check_usage_limit() CASCADE;
DROP FUNCTION IF EXISTS generate_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS create_subscription_invoice(UUID) CASCADE;
DROP FUNCTION IF EXISTS renew_subscription(UUID) CASCADE;

-- Réactiver les contraintes
SET session_replication_role = 'origin';

-- Vérification
SELECT 
  'Tables supprimées avec succès' AS status,
  COUNT(*) AS remaining_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'support_tickets', 'support_responses', 'support_categories',
    'conversations', 'messages', 'message_reactions', 'conversation_participants',
    'digital_services', 'service_subscriptions', 'service_usage', 'service_invoices',
    'prospects'
  );

-- =============================================================================
-- INSTRUCTIONS D'UTILISATION
-- =============================================================================
-- 1. Exécuter CE script en PREMIER
-- 2. Puis exécuter dans l'ordre:
--    - fix-missing-prospects-table.sql (optionnel)
--    - create-support-tables.sql
--    - create-messaging-tables.sql
--    - create-digital-services-tables.sql
-- =============================================================================
