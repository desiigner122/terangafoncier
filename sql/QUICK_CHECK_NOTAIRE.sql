-- Quick check: Verify notaire profile exists and matches auth.users
-- Run this in Supabase SQL Editor

-- 1. Check notaire in profiles
SELECT 
  id,
  full_name,
  email,
  role,
  created_at
FROM profiles 
WHERE role = 'notaire';

-- 2. Check auth.users for this ID
SELECT 
  u.id as auth_id,
  u.email as auth_email,
  u.created_at as auth_created,
  p.id as profile_id,
  p.full_name,
  p.email as profile_email,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email ILIKE '%notaire%' OR p.role = 'notaire';

-- 3. Check purchase_case_participants for notary role
SELECT 
  pcp.id,
  pcp.user_id,
  pcp.role,
  pcp.status,
  pc.case_number,
  p.full_name,
  p.email
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pcp.case_id = pc.id
LEFT JOIN profiles p ON pcp.user_id = p.id
WHERE pcp.role = 'notary';

-- 4. If notaire profile exists but no assignments, run this:
-- (Replace <notaire_id> with actual ID from query 1)
/*
INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
SELECT 
  id,
  '<notaire_id>',
  'notary',
  'active',
  NOW()
FROM purchase_cases
WHERE status NOT IN ('completed', 'cancelled', 'archived')
ON CONFLICT DO NOTHING;
*/
