-- Script FORCE pour fixer la contrainte de statut
-- Si le premier script n'a pas fonctionné, utilisez celui-ci

-- 1. Supprimer TOUTES les contraintes de type CHECK sur la colonne status
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'purchase_cases'::regclass 
        AND contype = 'c'
        AND pg_get_constraintdef(oid) LIKE '%status%'
    LOOP
        EXECUTE 'ALTER TABLE purchase_cases DROP CONSTRAINT ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- 2. Créer la nouvelle contrainte avec les 19 statuts
ALTER TABLE purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status::text IN (
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

-- 3. Vérifier la nouvelle contrainte
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'purchase_cases_status_check';

-- 4. Test: mettre à jour un cas existant (devrait réussir)
-- Décommentez la ligne suivante pour tester:
-- UPDATE purchase_cases SET status = 'signing_process' WHERE id = '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf';
