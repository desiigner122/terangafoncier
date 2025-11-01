-- DIAGNOSTIC COMPLET - Trouver tous les problèmes

-- 1. Vérifier si la table messages existe et sa structure
\echo '--- Structure actuelle de messages ---'
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name='messages' ORDER BY ordinal_position;

-- 2. Vérifier s'il y a une contrainte NOT NULL sur "message"
\echo '--- Contraintes NOT NULL ---'
SELECT column_name, is_nullable FROM information_schema.columns 
WHERE table_name='messages' AND column_name IN ('message', 'body', 'content');

-- 3. Vérifier les CHECK constraints
\echo '--- CHECK constraints ---'
SELECT constraint_name, check_clause FROM information_schema.check_constraints 
WHERE table_name='messages';

-- 4. Vérifier les données existantes dans messages
\echo '--- Exemples de données ---'
SELECT id, sender_id, recipient_id, subject, 
       CASE 
         WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='body') THEN 'body'
         WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='message') THEN 'message'
         WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='content') THEN 'content'
         ELSE 'UNKNOWN'
       END as message_column_name
FROM messages LIMIT 5;
