-- =============================================================
-- Diagnostic: Check ACTUAL profiles table structure
-- =============================================================

-- Show all columns in profiles table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Show sample profiles data
SELECT *
FROM public.profiles
LIMIT 10;

-- Check auth.users table
SELECT 
    id,
    email,
    created_at
FROM auth.users
LIMIT 10;

-- Show purchase_cases structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_cases'
ORDER BY ordinal_position;

-- Show sample purchase_cases
SELECT *
FROM public.purchase_cases
LIMIT 5;

-- Check if buyer_id/seller_id columns exist and their values
SELECT 
    id,
    case_number,
    buyer_id,
    seller_id,
    created_at
FROM public.purchase_cases
LIMIT 10;
