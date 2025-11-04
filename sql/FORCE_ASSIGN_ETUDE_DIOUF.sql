-- Script d'assignation forcée pour etude.diouf@teranga-foncier.sn
-- À exécuter dans Supabase SQL Editor

-- 1. D'abord, supprimer les assignations existantes pour éviter les conflits
DELETE FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' 
  AND role = 'notary';

-- 2. Vérifier/créer le profil
INSERT INTO profiles (
  id,
  full_name,
  email,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee',
  'Étude Maître Diouf',
  'etude.diouf@teranga-foncier.sn',
  'notaire',
  '+221 33 XXX XX XX',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'notaire',
  full_name = 'Étude Maître Diouf',
  email = 'etude.diouf@teranga-foncier.sn',
  updated_at = NOW();

-- 3. Assigner à TOUS les purchase_cases (pas seulement les actifs)
INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
SELECT 
  id,
  '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee',
  'notary',
  'accepted',
  NOW()
FROM purchase_cases;

-- 4. Vérification finale
SELECT 
  'RÉSULTAT FINAL' as check_type,
  COUNT(*) as total_assignations
FROM purchase_case_participants
WHERE user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' 
  AND role = 'notary';

-- 5. Détails des dossiers assignés
SELECT 
  pc.id,
  pc.case_number,
  pc.status,
  pcp.status as participant_status,
  pc.created_at
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary'
ORDER BY pc.created_at DESC;
