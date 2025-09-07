-- Fix admin profile and ensure proper role setup

-- First, let's check what users exist in auth.users
SELECT 'Auth Users:' as info;
SELECT email, id, created_at from auth.users;

-- Check what profiles exist
SELECT 'User Profiles:' as info;  
SELECT id, email, role, verification_status from user_profiles;

-- Create admin profile if missing for any auth user without a profile
INSERT INTO user_profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    verification_status, 
    created_at, 
    updated_at
)
SELECT 
    au.id,
    au.email,
    'Admin',
    'User',
    'admin',
    'verified',
    now(),
    now()
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    verification_status = 'verified',
    updated_at = now();

-- Make sure all existing users have admin role for testing
UPDATE user_profiles SET 
    role = 'admin',
    verification_status = 'verified',
    updated_at = now()
WHERE verification_status != 'banned';

-- Show final result
SELECT 'Final State:' as info;
SELECT id, email, role, verification_status from user_profiles;
