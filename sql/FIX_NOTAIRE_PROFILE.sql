-- Quick check: Does the logged-in notaire have a profile?
-- Replace with your actual notaire auth ID from the error log

-- From your error: id=6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee
SELECT 
  id,
  full_name,
  email,
  role,
  created_at
FROM profiles 
WHERE id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';

-- Also check if this user exists in auth.users
SELECT 
  u.id as auth_id,
  u.email as auth_email,
  u.created_at,
  p.id as profile_id,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';

-- If profile is missing, create it
INSERT INTO profiles (id, email, role, full_name, created_at)
SELECT 
  u.id,
  u.email,
  'notaire',
  COALESCE(u.raw_user_meta_data->>'full_name', 'Notaire'),
  NOW()
FROM auth.users u
WHERE u.id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = u.id);

-- Verify
SELECT * FROM profiles WHERE id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';
