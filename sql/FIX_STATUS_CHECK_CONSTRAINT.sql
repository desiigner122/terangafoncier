-- Fix Check Constraint pour purchase_cases.status
-- Erreur: "new row for relation purchase_cases violates check constraint purchase_cases_status_check"

-- 1. Vérifier la contrainte actuelle
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'purchase_cases'::regclass
  AND contype = 'c'
  AND conname LIKE '%status%';

-- 2. Supprimer l'ancienne contrainte si elle existe
ALTER TABLE purchase_cases 
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

-- 3. Créer la nouvelle contrainte avec TOUS les statuts du WorkflowStatusService
ALTER TABLE purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status IN (
  'initiated',
  'buyer_verification',
  'seller_notification',
  'document_collection',
  'title_verification',
  'contract_preparation',
  'preliminary_agreement',
  'deposit_pending',
  'contract_validation',
  'appointment_scheduling',
  'signing_process',
  'final_payment',
  'signature',
  'payment_processing',
  'transfer_initiated',
  'registration',
  'completed',
  'cancelled',
  'suspended'
));

-- 4. Vérifier la nouvelle contrainte
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'purchase_cases'::regclass
  AND contype = 'c'
  AND conname = 'purchase_cases_status_check';

-- 5. Vérifier les statuts actuels dans la table
SELECT DISTINCT status, COUNT(*) as count
FROM purchase_cases
GROUP BY status
ORDER BY count DESC;

-- 6. Test: Mettre à jour un statut
-- UPDATE purchase_cases 
-- SET status = 'contract_preparation' 
-- WHERE case_number = 'TF-20251021-0001';
