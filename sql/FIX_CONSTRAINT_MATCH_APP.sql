-- Script pour fixer la contrainte avec les VRAIS statuts de l'application
-- Basé sur WorkflowStatusService.js (ligne 137-151)

-- 1. Supprimer l'ancienne contrainte
ALTER TABLE purchase_cases 
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

-- 2. Créer la contrainte avec les 20 statuts réels de l'app
ALTER TABLE purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status IN (
  -- Statuts chronologiques (workflow normal)
  'initiated',
  'buyer_verification',
  'seller_notification',
  'negotiation',
  'preliminary_agreement',
  'contract_preparation',
  'legal_verification',
  'document_audit',
  'property_evaluation',
  'notary_appointment',
  'signing_process',
  'payment_processing',
  'property_transfer',
  'completed',
  -- Statuts terminaux (fin de processus)
  'cancelled',
  'rejected',
  'seller_declined',
  'negotiation_failed',
  'legal_issues_found',
  'archived'
));

-- 3. Vérifier la contrainte
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'purchase_cases_status_check';

-- 4. Afficher les statuts actuels en base
SELECT status, COUNT(*) as count
FROM purchase_cases
GROUP BY status
ORDER BY count DESC;

-- 5. Test: Essayer de mettre à jour vers un statut du workflow
-- UPDATE purchase_cases 
-- SET status = 'signing_process' 
-- WHERE id = '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf';
