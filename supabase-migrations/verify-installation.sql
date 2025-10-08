-- 🔍 VÉRIFICATION - Test des tables et fonctions
-- Exécutez ce script pour vérifier que tout est bien en place

-- Vérifier les tables
SELECT table_name, column_count.count as nombre_colonnes
FROM information_schema.tables
CROSS JOIN LATERAL (
    SELECT count(*) 
    FROM information_schema.columns 
    WHERE table_name = information_schema.tables.table_name
) column_count
WHERE table_schema = 'public' 
AND table_name IN (
    'crm_contacts',
    'crm_interactions',
    'activity_logs',
    'property_views',
    'messages',
    'conversations'
)
ORDER BY table_name;

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN (
    'crm_contacts',
    'crm_interactions',
    'activity_logs',
    'property_views',
    'messages',
    'conversations'
)
ORDER BY tablename, policyname;

-- Vérifier les fonctions
SELECT proname as function_name, 
       pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname IN (
    'update_crm_contacts_updated_at',
    'get_vendor_monthly_stats',
    'get_vendor_top_properties'
)
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Vérification terminée!';
  RAISE NOTICE '📊 Si vous voyez les tables, politiques et fonctions listées ci-dessus,';
  RAISE NOTICE '   tout est correctement installé!';
END $$;