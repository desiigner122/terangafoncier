-- Chercher TOUS les messages pour ce dossier
SELECT * FROM purchase_case_messages 
WHERE case_id = '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf'
ORDER BY created_at DESC;

-- Vérifier s'il y a des messages dans toute la table
SELECT 
  case_id,
  sent_by,
  message,
  message_type,
  created_at
FROM purchase_case_messages
LIMIT 10;

-- Compter les messages par case_id
SELECT 
  case_id,
  COUNT(*) as message_count
FROM purchase_case_messages
GROUP BY case_id
ORDER BY message_count DESC;
