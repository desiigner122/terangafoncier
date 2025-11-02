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
  status = 'notary_assigned',
  notaire_id = (
    SELECT notaire_id 
    FROM notaire_case_assignments 
    WHERE case_id = purchase_cases.id 
    AND status IN ('pending', 'buyer_approved', 'seller_approved', 'both_approved')
    LIMIT 1
  ),
  updated_at = NOW()
WHERE case_number = 'TF-20251101-0002'
  AND status NOT IN ('notary_assigned', 'contract_ready', 'contract_signed', 'completed')
  AND EXISTS (
    SELECT 1 FROM notaire_case_assignments 
    WHERE case_id = purchase_cases.id
  );

-- 3. Créer un événement timeline si absent
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  event_title,
  event_description,
  metadata,
  created_at
)
SELECT 
  pc.id,
  'notary_assigned',
  'Notaire assigné',
  'Un notaire a été proposé pour ce dossier',
  jsonb_build_object(
    'notaire_id', nca.notaire_id,
    'assignment_id', nca.id,
    'auto_corrected', true
  ),
  NOW()
FROM purchase_cases pc
JOIN notaire_case_assignments nca ON pc.id = nca.case_id
WHERE pc.case_number = 'TF-20251101-0002'
  AND NOT EXISTS (
    SELECT 1 FROM purchase_case_timeline 
    WHERE case_id = pc.id 
    AND event_type = 'notary_assigned'
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
  (SELECT COUNT(*) FROM purchase_case_timeline WHERE case_id = pc.id AND event_type = 'notary_assigned') as timeline_events
FROM purchase_cases pc
LEFT JOIN notaire_case_assignments nca ON pc.id = nca.case_id
WHERE pc.case_number = 'TF-20251101-0002';
