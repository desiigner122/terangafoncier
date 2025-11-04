-- Diagnostic: Vérifier les assignments notaire
-- Run this to check what's happening

-- 1. Check if notaire profile exists
SELECT id, full_name, email, role 
FROM profiles 
WHERE role = 'notaire';

-- 2. Check purchase_case_participants entries
SELECT 
  pcp.id,
  pcp.case_id,
  pcp.user_id,
  pcp.role,
  pcp.status,
  pc.case_number,
  pc.status as case_status
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pcp.case_id = pc.id
WHERE pcp.role = 'notary'
ORDER BY pcp.created_at DESC;

-- 3. Check if the notaire user_id matches profile id
-- Replace 'NOTAIRE_EMAIL_HERE' with actual notaire email
SELECT 
  u.id as auth_user_id,
  p.id as profile_id,
  p.full_name,
  p.email,
  p.role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE p.role = 'notaire';

-- 4. Full join to see what's linked
SELECT 
  pc.id as case_id,
  pc.case_number,
  pc.status as case_status,
  pcp.id as participant_id,
  pcp.user_id as participant_user_id,
  pcp.role as participant_role,
  pcp.status as participant_status,
  p.full_name as notaire_name,
  p.email as notaire_email
FROM purchase_cases pc
LEFT JOIN purchase_case_participants pcp ON pc.id = pcp.case_id AND pcp.role = 'notary'
LEFT JOIN profiles p ON pcp.user_id = p.id
WHERE pc.status NOT IN ('completed', 'cancelled', 'archived')
ORDER BY pc.created_at DESC
LIMIT 20;
