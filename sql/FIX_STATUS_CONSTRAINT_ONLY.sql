-- Script MINIMAL pour fixer UNIQUEMENT la contrainte de statut
-- Exécuter ce script seul si le script complet pose problème

-- 1. Voir la contrainte actuelle
SELECT 
  'BEFORE' as moment,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'purchase_cases_status_check';

-- 2. Supprimer l'ancienne contrainte
ALTER TABLE purchase_cases 
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

-- 3. Créer la nouvelle contrainte avec 19 statuts
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
  'AFTER' as moment,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'purchase_cases_status_check';

-- 5. Compter les statuts distincts dans purchase_cases (pour info)
SELECT 
  'Current Statuses in DB' as info,
  status,
  COUNT(*) as count
FROM purchase_cases
GROUP BY status
ORDER BY count DESC;
