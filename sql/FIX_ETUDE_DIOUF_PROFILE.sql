-- Create profile for etude.diouf@teranga-foncier.sn and assign to cases

-- Step 1: Create profile
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
  full_name = COALESCE(profiles.full_name, 'Étude Maître Diouf'),
  email = 'etude.diouf@teranga-foncier.sn',
  updated_at = NOW();

-- Step 2: Verify profile created
SELECT id, full_name, email, role 
FROM profiles 
WHERE id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';

-- Step 3: Assign to all active purchase_cases
INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
SELECT 
  id,
  '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee',
  'notary',
  'active',
  NOW()
FROM purchase_cases
WHERE status NOT IN ('completed', 'cancelled', 'archived')
ON CONFLICT DO NOTHING;

-- Step 4: Verify assignments
SELECT 
  pc.case_number,
  pc.status as case_status,
  pcp.role,
  pcp.status as participant_status,
  p.full_name as notaire_name,
  p.email as notaire_email
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
JOIN profiles p ON pcp.user_id = p.id
WHERE pcp.role = 'notary'
ORDER BY pc.created_at DESC;
