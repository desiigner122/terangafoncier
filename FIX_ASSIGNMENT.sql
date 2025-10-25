-- =============================================================
-- Fix: Auto-assign seller_id and buyer_id from auth context
-- =============================================================

-- If you have a way to determine who the seller/buyer should be,
-- run something like this (example for setting a specific case):

-- Example 1: Manual assignment if you know the UUIDs
-- UPDATE public.purchase_cases
-- SET buyer_id = '11111111-1111-1111-1111-111111111111',  -- Replace with actual buyer UUID
--     seller_id = '22222222-2222-2222-2222-222222222222'  -- Replace with actual seller UUID
-- WHERE id = '33333333-3333-3333-3333-333333333333';     -- Replace with actual case UUID

-- Example 2: If purchase_case_participants has correct assignments, sync from there
-- UPDATE public.purchase_cases pc
-- SET buyer_id = (
--     SELECT user_id FROM public.purchase_case_participants 
--     WHERE case_id = pc.id AND role IN ('buyer', 'acheteur') 
--     LIMIT 1
-- )
-- WHERE buyer_id IS NULL AND EXISTS (
--     SELECT 1 FROM public.purchase_case_participants 
--     WHERE case_id = pc.id AND role IN ('buyer', 'acheteur')
-- );

-- UPDATE public.purchase_cases pc
-- SET seller_id = (
--     SELECT user_id FROM public.purchase_case_participants 
--     WHERE case_id = pc.id AND role IN ('seller', 'vendeur') 
--     LIMIT 1
-- )
-- WHERE seller_id IS NULL AND EXISTS (
--     SELECT 1 FROM public.purchase_case_participants 
--     WHERE case_id = pc.id AND role IN ('seller', 'vendeur')
-- );

-- Check the result
SELECT 
    id,
    case_number,
    buyer_id,
    seller_id,
    status
FROM public.purchase_cases
WHERE buyer_id IS NOT NULL OR seller_id IS NOT NULL
LIMIT 20;
