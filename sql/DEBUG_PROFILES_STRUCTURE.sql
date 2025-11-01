-- Debug: Check why assignment script didn't work

-- 1. Does profiles table have 'id' column or 'user_id'?
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check actual profiles structure
SELECT * FROM profiles WHERE role = 'notaire' LIMIT 1;

-- 3. Check if user_id in profiles matches auth.users.id
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.email,
  p.role,
  u.id as auth_id,
  u.email as auth_email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id OR p.user_id = u.id
WHERE p.role = 'notaire'
LIMIT 5;

-- 4. Try manual assignment with correct column
-- First, let's find the correct notaire ID
DO $$
DECLARE
  notaire_id UUID;
  notaire_user_id UUID;
BEGIN
  -- Try both possible column names
  SELECT id, user_id INTO notaire_id, notaire_user_id
  FROM profiles 
  WHERE role = 'notaire' 
  LIMIT 1;

  RAISE NOTICE 'Profile id: %, user_id: %', notaire_id, notaire_user_id;

  -- Use whichever is not null and matches auth.users
  IF notaire_id IS NOT NULL AND EXISTS (SELECT 1 FROM auth.users WHERE id = notaire_id) THEN
    RAISE NOTICE 'Using profiles.id: %', notaire_id;
    
    -- Assign to first case
    INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
    VALUES (
      'ded322f2-ca48-4acd-9af2-35297732ca0f',
      notaire_id,
      'notary',
      'active',
      NOW()
    );
    RAISE NOTICE 'Assigned to first case';
    
  ELSIF notaire_user_id IS NOT NULL AND EXISTS (SELECT 1 FROM auth.users WHERE id = notaire_user_id) THEN
    RAISE NOTICE 'Using profiles.user_id: %', notaire_user_id;
    
    -- Assign to first case
    INSERT INTO purchase_case_participants (case_id, user_id, role, status, joined_at)
    VALUES (
      'ded322f2-ca48-4acd-9af2-35297732ca0f',
      notaire_user_id,
      'notary',
      'active',
      NOW()
    );
    RAISE NOTICE 'Assigned to first case';
    
  ELSE
    RAISE NOTICE 'No valid notaire user_id found in auth.users';
  END IF;
END $$;

-- 5. Verify assignment worked
SELECT 
  pc.case_number,
  pcp.role,
  pcp.user_id,
  p.full_name,
  p.email
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pcp.case_id = pc.id
JOIN profiles p ON pcp.user_id = p.id OR pcp.user_id = p.user_id
WHERE pcp.role = 'notary';
