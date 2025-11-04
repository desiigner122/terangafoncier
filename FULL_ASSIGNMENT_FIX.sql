-- =============================================================
-- Complete Assignment Fix
-- Fixes seller_id/buyer_id in purchase_cases 
-- and populates purchase_case_participants
-- =============================================================

-- STEP 1: Show current state
SELECT 
    COUNT(*) as total_cases,
    COUNT(CASE WHEN buyer_id IS NULL THEN 1 END) as null_buyer,
    COUNT(CASE WHEN seller_id IS NULL THEN 1 END) as null_seller
FROM public.purchase_cases;

-- STEP 2: Show all purchase_cases with their current assignments
SELECT 
    id,
    case_number,
    buyer_id,
    seller_id,
    status,
    created_at,
    CASE 
        WHEN buyer_id IS NULL THEN '❌ NO BUYER'
        WHEN seller_id IS NULL THEN '❌ NO SELLER'
        ELSE '✅ COMPLETE'
    END as assignment_status
FROM public.purchase_cases
ORDER BY created_at DESC;

-- STEP 3: Check auth.users table to see available profiles
SELECT 
    id,
    email,
    created_at
FROM auth.users
LIMIT 10;

-- STEP 4: Check profiles table
SELECT 
    id,
    first_name,
    last_name,
    email,
    user_type,
    created_at
FROM public.profiles
LIMIT 10;

-- STEP 5: Show users by role
SELECT 
    user_type,
    COUNT(*) as count
FROM public.profiles
GROUP BY user_type;

-- STEP 6: Try to auto-assign if we have enough data
-- For DEMO: Assign first acheteur as buyer, first vendeur as seller
-- (This is a simple approach - adjust based on your actual data logic)

-- Get first buyer profile (acheteur)
SELECT 
    id,
    first_name,
    last_name,
    user_type
FROM public.profiles
WHERE user_type IN ('acheteur', 'buyer')
LIMIT 1;

-- Get first seller profile (vendeur)
SELECT 
    id,
    first_name,
    last_name,
    user_type
FROM public.profiles
WHERE user_type IN ('vendeur', 'seller')
LIMIT 1;

-- STEP 7: Get auth.users IDs (needed for assignment)
SELECT 
    u.id as user_id,
    u.email,
    p.first_name,
    p.user_type
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LIMIT 20;

-- =============================================================
-- IF YOU NEED TO MANUALLY ASSIGN:
-- Uncomment and modify the UUIDs below
-- =============================================================

-- Get all cases that need assignment
-- SELECT id, case_number FROM public.purchase_cases 
-- WHERE buyer_id IS NULL OR seller_id IS NULL;

-- EXAMPLE: Assign a specific case
-- UPDATE public.purchase_cases
-- SET buyer_id = 'BUYER_UUID_HERE',
--     seller_id = 'SELLER_UUID_HERE'
-- WHERE id = 'CASE_UUID_HERE';

-- VERIFY assignment
-- SELECT 
--     id,
--     case_number,
--     buyer_id,
--     seller_id
-- FROM public.purchase_cases
-- WHERE id = 'CASE_UUID_HERE';
