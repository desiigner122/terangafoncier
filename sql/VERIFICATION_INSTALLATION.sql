-- =============================================================================
-- VÉRIFICATION POST-INSTALLATION
-- =============================================================================
-- Date: 2025-10-07
-- Description: Vérifier que toutes les tables et données sont bien créées
-- =============================================================================

-- 1. VÉRIFIER LES TABLES CRÉÉES
SELECT 
  '✅ Tables créées' AS verification,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) AS nb_colonnes
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN (
    'support_categories', 'support_tickets', 'support_responses',
    'conversations', 'messages', 'message_reactions', 'conversation_participants',
    'digital_services', 'service_subscriptions', 'service_usage', 'service_invoices'
  )
ORDER BY table_name;

-- 2. VÉRIFIER LES DONNÉES INITIALES
SELECT 
  '✅ Données initiales' AS verification,
  (SELECT COUNT(*) FROM support_categories) AS categories_support,
  (SELECT COUNT(*) FROM digital_services) AS services_digitaux;

-- 3. VÉRIFIER LES INDEX
SELECT 
  '✅ Index créés' AS verification,
  COUNT(*) AS total_index
FROM pg_indexes
WHERE schemaname = 'public'
  AND (indexname LIKE '%support%' 
    OR indexname LIKE '%conversation%' 
    OR indexname LIKE '%message%'
    OR indexname LIKE '%service%'
    OR indexname LIKE '%digital%');

-- 4. VÉRIFIER RLS (Row Level Security)
SELECT 
  '✅ RLS activé' AS verification,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND (tablename LIKE '%support%' 
    OR tablename LIKE '%conversation%' 
    OR tablename LIKE '%message%'
    OR tablename LIKE '%service%'
    OR tablename LIKE '%digital%')
ORDER BY tablename;

-- 5. VÉRIFIER LES POLICIES RLS
SELECT 
  '✅ Policies RLS' AS verification,
  schemaname,
  tablename,
  policyname,
  cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename LIKE '%support%' 
    OR tablename LIKE '%conversation%' 
    OR tablename LIKE '%message%'
    OR tablename LIKE '%service%'
    OR tablename LIKE '%digital%')
ORDER BY tablename, policyname;

-- 6. VÉRIFIER LES FONCTIONS
SELECT 
  '✅ Fonctions créées' AS verification,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%ticket%' 
    OR routine_name LIKE '%conversation%' 
    OR routine_name LIKE '%message%'
    OR routine_name LIKE '%invoice%'
    OR routine_name LIKE '%subscription%'
    OR routine_name = 'update_updated_at_column')
ORDER BY routine_name;

-- 7. VÉRIFIER LES TRIGGERS
SELECT 
  '✅ Triggers créés' AS verification,
  trigger_name,
  event_manipulation AS event,
  event_object_table AS table_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (event_object_table LIKE '%support%' 
    OR event_object_table LIKE '%conversation%' 
    OR event_object_table LIKE '%message%'
    OR event_object_table LIKE '%service%'
    OR event_object_table LIKE '%digital%')
ORDER BY event_object_table, trigger_name;

-- 8. DÉTAILS DES CATÉGORIES SUPPORT
SELECT 
  '✅ Catégories Support détaillées' AS verification,
  name,
  slug,
  icon,
  color,
  is_active
FROM support_categories
ORDER BY display_order;

-- 9. DÉTAILS DES SERVICES DIGITAUX
SELECT 
  '✅ Services Digitaux détaillés' AS verification,
  name,
  slug,
  category,
  icon,
  is_active,
  is_featured
FROM digital_services
ORDER BY display_order;

-- 10. RÉSUMÉ FINAL
SELECT 
  '🎉 INSTALLATION RÉUSSIE!' AS status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name IN ('support_tickets','support_responses','support_categories',
                       'conversations','messages','message_reactions','conversation_participants',
                       'digital_services','service_subscriptions','service_usage','service_invoices')) AS tables_total,
  (SELECT COUNT(*) FROM support_categories) AS categories,
  (SELECT COUNT(*) FROM digital_services) AS services,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' 
    AND (tablename LIKE '%support%' OR tablename LIKE '%conversation%' 
         OR tablename LIKE '%message%' OR tablename LIKE '%service%')) AS policies_rls,
  (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'
    AND (routine_name LIKE '%ticket%' OR routine_name LIKE '%conversation%' 
         OR routine_name LIKE '%invoice%' OR routine_name LIKE '%subscription%')) AS fonctions;

-- =============================================================================
-- ATTENDU:
-- - tables_total: 11
-- - categories: 6
-- - services: 6
-- - policies_rls: ~15-20
-- - fonctions: ~5-7
-- =============================================================================
