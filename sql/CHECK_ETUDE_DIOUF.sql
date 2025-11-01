-- Check for etude.diouf@teranga-foncier.sn notaire account

-- 1. Find this user in auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'etude.diouf@teranga-foncier.sn';

-- 2. Check if profile exists
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.created_at
FROM profiles p
WHERE p.email = 'etude.diouf@teranga-foncier.sn'
   OR p.id IN (SELECT id FROM auth.users WHERE email = 'etude.diouf@teranga-foncier.sn');

-- 3. Join to see both
SELECT 
  u.id as auth_id,
  u.email as auth_email,
  p.id as profile_id,
  p.full_name,
  p.email as profile_email,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'etude.diouf@teranga-foncier.sn';
