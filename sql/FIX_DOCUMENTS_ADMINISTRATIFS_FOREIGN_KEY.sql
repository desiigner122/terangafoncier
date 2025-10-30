-- Fix Foreign Key Constraint pour documents_administratifs
-- Erreur: "insert or update on table documents_administratifs violates foreign key constraint fk_documents_administratifs_request"
-- La table "requests" n'existe pas, il faut pointer vers "purchase_cases"

-- 1. Vérifier la contrainte actuelle
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'documents_administratifs'
  AND tc.constraint_name = 'fk_documents_administratifs_request';

-- 2. Supprimer l'ancienne contrainte incorrecte
ALTER TABLE documents_administratifs 
DROP CONSTRAINT IF EXISTS fk_documents_administratifs_request;

-- 3. Créer la nouvelle contrainte correcte vers purchase_cases
ALTER TABLE documents_administratifs 
ADD CONSTRAINT fk_documents_administratifs_purchase_case
FOREIGN KEY (purchase_request_id) 
REFERENCES purchase_cases(id) 
ON DELETE CASCADE;

-- 4. Vérifier si purchase_request_id existe dans documents_administratifs
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'documents_administratifs'
  AND column_name = 'purchase_request_id';

-- 5. Vérifier toutes les contraintes de la table documents_administratifs
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'documents_administratifs'
ORDER BY tc.constraint_type, tc.constraint_name;
