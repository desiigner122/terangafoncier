-- CRITICAL FIX: requests.status CHECK constraint
-- Current state: Only accepts ('pending', 'rejected', 'completed')
-- Required state: Must also accept ('initiated', 'accepted', 'negotiation', 'cancelled', 'on_hold')

-- Step 1: Drop the old constraint
ALTER TABLE public.requests
DROP CONSTRAINT IF EXISTS requests_status_check;

-- Step 2: Add the new, correct constraint
ALTER TABLE public.requests
ADD CONSTRAINT requests_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'negotiation', 'completed', 'on_hold'));

-- Similarly fix purchase_cases table
ALTER TABLE public.purchase_cases
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

ALTER TABLE public.purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'completed', 'on_hold', 'preliminary_agreement', 'contract_preparation', 'buyer_verification', 'seller_accepted'));

-- Verify the change
SELECT 
  constraint_name, 
  constraint_type,
  check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE table_name = 'requests' AND constraint_name LIKE '%status%';
