-- Create missing notaire profile
-- The auth.users entry exists but profiles row is missing

INSERT INTO profiles (
  id,
  full_name,
  email,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  'f7970f92-a90d-48ff-8c3b-1b15c3e610b0',
  'Chambre des Notaires',
  'chambre.notaires@teranga-foncier.sn',
  'notaire',
  '+221 33 XXX XX XX',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'notaire',
  full_name = COALESCE(profiles.full_name, 'Chambre des Notaires'),
  updated_at = NOW();

-- Verify profile created
SELECT id, full_name, email, role FROM profiles WHERE id = 'f7970f92-a90d-48ff-8c3b-1b15c3e610b0';

-- Now assign to all active cases
INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
SELECT 
  id,
  'f7970f92-a90d-48ff-8c3b-1b15c3e610b0',
  'notary',
  'active',
  NOW()
FROM purchase_cases
WHERE status NOT IN ('completed', 'cancelled', 'archived')
ON CONFLICT DO NOTHING;

-- Verify assignments
SELECT 
  pc.case_number,
  pc.status,
  pcp.role,
  p.full_name
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pcp.case_id = pc.id
JOIN profiles p ON pcp.user_id = p.id
WHERE pcp.role = 'notary';
