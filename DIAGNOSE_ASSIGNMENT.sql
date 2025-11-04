-- =============================================================
-- Diagnostic: Check seller_id and buyer_id assignment issues
-- =============================================================

-- Show current state of purchase_cases
SELECT 
    id,
    case_number,
    buyer_id,
    seller_id,
    status,
    seller_status,
    created_at
FROM public.purchase_cases
LIMIT 20;

-- Check for NULL buyer_id or seller_id
SELECT 
    COUNT(*) as total_cases,
    COUNT(CASE WHEN buyer_id IS NULL THEN 1 END) as null_buyer,
    COUNT(CASE WHEN seller_id IS NULL THEN 1 END) as null_seller,
    COUNT(CASE WHEN buyer_id IS NULL OR seller_id IS NULL THEN 1 END) as incomplete_assignments
FROM public.purchase_cases;

-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if we can link cases to buyer/seller profiles
SELECT 
    pc.id,
    pc.case_number,
    pc.buyer_id,
    pb.first_name as buyer_name,
    pc.seller_id,
    ps.first_name as seller_name
FROM public.purchase_cases pc
LEFT JOIN public.profiles pb ON pc.buyer_id = pb.id
LEFT JOIN public.profiles ps ON pc.seller_id = ps.id
LIMIT 10;

-- Show purchase_case_participants if it exists
SELECT 
    COUNT(*) as total_participants,
    COUNT(DISTINCT case_id) as cases_with_participants
FROM public.purchase_case_participants;

SELECT 
    pcp.case_id,
    pcp.role,
    pcp.user_id,
    p.first_name,
    p.last_name
FROM public.purchase_case_participants pcp
LEFT JOIN public.profiles p ON pcp.user_id = p.id
LIMIT 20;
