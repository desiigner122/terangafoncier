-- Script pour synchroniser les notaires de purchase_cases.notaire_id vers purchase_case_participants
-- Ce script crée des entrées de participants pour tous les notaires assignés qui n'en ont pas

-- 1. Insérer les notaires manquants dans purchase_case_participants
INSERT INTO purchase_case_participants (
  case_id,
  user_id,
  role,
  status,
  created_at,
  updated_at
)
SELECT 
  pc.id as case_id,
  pc.notaire_id as user_id,
  'notary' as role,
  'active' as status,  -- Les marquer directement comme actifs
  pc.created_at,
  NOW() as updated_at
FROM purchase_cases pc
WHERE pc.notaire_id IS NOT NULL  -- Il y a un notaire assigné
  AND NOT EXISTS (  -- Mais pas de participant notaire dans la table
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = pc.id 
      AND pcp.user_id = pc.notaire_id
      AND pcp.role IN ('notary', 'notaire')
  );

-- 2. Mettre à jour les notaires existants qui sont "pending" vers "active"
UPDATE purchase_case_participants pcp
SET 
  status = 'active',
  updated_at = NOW()
FROM purchase_cases pc
WHERE pcp.case_id = pc.id
  AND pcp.user_id = pc.notaire_id
  AND pcp.role IN ('notary', 'notaire')
  AND pcp.status = 'pending';

-- 3. Vérification: Afficher les résultats
SELECT 
  pc.case_number,
  pc.notaire_id,
  pcp.status,
  p.full_name as notaire_name,
  p.email as notaire_email
FROM purchase_cases pc
JOIN purchase_case_participants pcp 
  ON pc.id = pcp.case_id 
  AND pcp.role IN ('notary', 'notaire')
JOIN profiles p ON p.id = pcp.user_id
WHERE pc.notaire_id IS NOT NULL
ORDER BY pc.created_at DESC
LIMIT 10;
