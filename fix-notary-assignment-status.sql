-- Script pour corriger le statut d'un dossier avec notaire déjà assigné
-- mais statut pas encore mis à jour

-- 1. Vérifier l'état actuel
SELECT 
  pc.id,
  pc.case_number,
  pc.status as current_status,
  pc.notaire_id,
  nca.id as assignment_id,
  nca.notaire_id,
  nca.status as assignment_status,
  nca.created_at as assignment_created_at
FROM purchase_cases pc
LEFT JOIN notaire_case_assignments nca ON pc.id = nca.case_id
WHERE pc.case_number = 'TF-20251101-0002';

-- 2. Mettre à jour le statut si un notaire est assigné mais statut pas changé
UPDATE purchase_cases
SET 
  status = 'contract_preparation',
  notaire_id = (
    SELECT notaire_id 
    FROM notaire_case_assignments 
    WHERE case_id = purchase_cases.id 
    AND status IN ('pending', 'buyer_approved', 'seller_approved', 'both_approved')
    LIMIT 1
  ),
  updated_at = NOW()
WHERE case_number = 'TF-20251101-0002'
  AND status NOT IN ('contract_preparation', 'contract_validation', 'signing_process', 'completed')
  AND EXISTS (
    SELECT 1 FROM notaire_case_assignments 
    WHERE case_id = purchase_cases.id
  );

-- 3. Créer un événement timeline si absent
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  title,
  description,
  metadata
)
SELECT 
  pc.id,
  'status_change',
  'Préparation du contrat',
  'Un notaire a été assigné et la préparation du contrat a débuté',
  jsonb_build_object(
    'notaire_id', nca.notaire_id,
    'assignment_id', nca.id,
    'auto_corrected', true,
    'old_status', pc.status,
    'new_status', 'contract_preparation'
  )
FROM purchase_cases pc
JOIN notaire_case_assignments nca ON pc.id = nca.case_id
WHERE pc.case_number = 'TF-20251101-0002'
  AND NOT EXISTS (
    SELECT 1 FROM purchase_case_timeline 
    WHERE case_id = pc.id 
    AND title = 'Préparation du contrat'
  )
LIMIT 1;

-- 4. Vérifier le résultat
SELECT 
  pc.id,
  pc.case_number,
  pc.status as current_status,
  pc.notaire_id,
  nca.notaire_id as assignment_notaire_id,
  nca.status as assignment_status,
  (SELECT COUNT(*) FROM purchase_case_timeline WHERE case_id = pc.id AND title = 'Préparation du contrat') as timeline_events
FROM purchase_cases pc
LEFT JOIN notaire_case_assignments nca ON pc.id = nca.case_id
WHERE pc.case_number = 'TF-20251101-0002';
