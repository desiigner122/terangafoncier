-- Script pour assigner le notaire Étude Maître Diouf aux dossiers existants
-- ID du notaire: 6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee

-- 1. Assigner le notaire aux dossiers qui n'en ont pas
UPDATE purchase_cases
SET 
  notaire_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee',
  updated_at = NOW()
WHERE notaire_id IS NULL;

-- 2. Insérer le notaire dans purchase_case_participants comme actif
INSERT INTO purchase_case_participants (
  case_id,
  user_id,
  role,
  status,
  created_at,
  updated_at
)
SELECT 
  id as case_id,
  '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' as user_id,
  'notary' as role,
  'active' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM purchase_cases
WHERE notaire_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND NOT EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id 
      AND pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
      AND pcp.role IN ('notary', 'notaire')
  );

-- 3. Vérification: Voir les dossiers avec leur notaire assigné
SELECT 
  pc.case_number,
  pc.status,
  pc.notaire_id,
  p.full_name as notaire_name,
  pcp.status as participant_status
FROM purchase_cases pc
LEFT JOIN profiles p ON p.id = pc.notaire_id
LEFT JOIN purchase_case_participants pcp 
  ON pc.id = pcp.case_id 
  AND pcp.role IN ('notary', 'notaire')
ORDER BY pc.created_at DESC;
