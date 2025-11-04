-- Ajouter automatiquement le notaire comme participant aux dossiers où il est assigné
-- Cela permet aux policies RLS basées sur purchase_case_participants de fonctionner

-- Trouver tous les dossiers avec un notaire assigné mais pas dans purchase_case_participants
INSERT INTO purchase_case_participants (case_id, user_id, role, status, created_at, updated_at)
SELECT 
  pc.id as case_id,
  pc.notary_id as user_id,
  'notary' as role,
  'active' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM purchase_cases pc
WHERE pc.notary_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM purchase_case_participants pcp
    WHERE pcp.case_id = pc.id 
      AND pcp.user_id = pc.notary_id
      AND pcp.role = 'notary'
  )
ON CONFLICT (case_id, user_id, role) DO NOTHING;

-- Vérifier les participants ajoutés
SELECT 
  'Notary Participants' as check_type,
  pc.case_number,
  pc.notary_id,
  p.full_name as notary_name,
  pcp.status,
  pcp.created_at
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pcp.case_id = pc.id AND pcp.role = 'notary'
JOIN profiles p ON p.id = pcp.user_id
WHERE pc.notary_id IS NOT NULL
ORDER BY pc.created_at DESC
LIMIT 10;

-- Compter les participants par rôle
SELECT 
  'Participant Count by Role' as check_type,
  role,
  COUNT(*) as participant_count
FROM purchase_case_participants
GROUP BY role
ORDER BY role;
