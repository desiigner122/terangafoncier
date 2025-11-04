-- =============================================================
-- Populate purchase_case_participants from purchase_cases
-- Run this AFTER you've assigned buyer_id and seller_id
-- =============================================================

-- STEP 1: Show current state
SELECT 
    COUNT(*) as total_participants
FROM public.purchase_case_participants;

-- STEP 2: Populate participants from purchase_cases (buyer_id)
INSERT INTO public.purchase_case_participants (
    case_id,
    user_id,
    role,
    status
)
SELECT 
    id,
    buyer_id,
    'buyer',
    'accepted'
FROM public.purchase_cases
WHERE buyer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id 
    AND pcp.user_id = purchase_cases.buyer_id
    AND pcp.role = 'buyer'
  )
ON CONFLICT DO NOTHING;

-- STEP 3: Populate participants from purchase_cases (seller_id)
INSERT INTO public.purchase_case_participants (
    case_id,
    user_id,
    role,
    status
)
SELECT 
    id,
    seller_id,
    'seller',
    'accepted'
FROM public.purchase_cases
WHERE seller_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id 
    AND pcp.user_id = purchase_cases.seller_id
    AND pcp.role = 'seller'
  )
ON CONFLICT DO NOTHING;

-- STEP 4: Verify
SELECT 
    COUNT(*) as total_after_sync
FROM public.purchase_case_participants;

-- STEP 5: Show participants per case
SELECT 
    pcp.case_id,
    pc.case_number,
    pcp.role,
    pcp.user_id,
    p.first_name,
    p.last_name
FROM public.purchase_case_participants pcp
LEFT JOIN public.purchase_cases pc ON pcp.case_id = pc.id
LEFT JOIN public.profiles p ON pcp.user_id = p.id
ORDER BY pc.case_number, pcp.role;
