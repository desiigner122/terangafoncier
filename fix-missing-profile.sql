-- Check if the problematic user exists in auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
WHERE id = 'fc695f01-0a6a-4c1a-9788-028316bd8f5d';

-- Check if there's a corresponding user_profiles record
SELECT * FROM user_profiles 
WHERE id = 'fc695f01-0a6a-4c1a-9788-028316bd8f5d';

-- Create the missing user_profiles record if the user exists in auth.users
-- Only run this if the user exists in auth.users but not in user_profiles
INSERT INTO user_profiles (
    id,
    email,
    created_at,
    updated_at,
    role
) 
SELECT 
    u.id,
    u.email,
    u.created_at,
    NOW(),
    'particulier'
FROM auth.users u
WHERE u.id = 'fc695f01-0a6a-4c1a-9788-028316bd8f5d'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles p WHERE p.id = u.id
  );
