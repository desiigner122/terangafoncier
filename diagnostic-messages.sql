-- 🔧 DIAGNOSTIC RAPIDE MESSAGES TABLE
-- ===================================
-- Vérifiez l'état de votre table messages

SELECT 
    'Diagnostic Table Messages' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables 
                     WHERE table_name = 'messages' AND table_schema = 'public') 
        THEN '✅ Table messages existe'
        ELSE '❌ Table messages manquante'
    END as table_status;

-- Vérifier les colonnes existantes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Si la table existe mais est vide de colonnes importantes :
SELECT 'Action recommandée: Exécuter le script de migration' as recommendation;
