-- =================================================
-- 🔥 CRITICAL FIX: Add request_id to transactions table
-- =================================================
-- This column is REQUIRED for the purchase workflow
-- purchase_cases.request_id → requests(id)
-- transactions.request_id → requests(id) (NEW)
-- 
-- Without this, the vendor dashboard cannot link transactions to purchase cases!
-- =================================================

-- Step 1: Add request_id column to transactions if it doesn't exist
ALTER TABLE IF EXISTS public.transactions
  ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL;

-- Step 2: Add buyer_id if missing (needed for RLS filtering)
ALTER TABLE IF EXISTS public.transactions
  ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Step 3: Add seller_id if missing (needed for RLS filtering)
ALTER TABLE IF EXISTS public.transactions
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_request_id ON public.transactions(request_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON public.transactions(seller_id);

-- Step 5: Update existing transactions to populate request_id from requests table
-- This matches transactions created during checkout flow
UPDATE public.transactions t
SET request_id = r.id
FROM public.requests r
WHERE t.request_id IS NULL
  AND t.user_id = r.user_id
  AND r.type IN ('one_time', 'installments', 'bank_financing')
  AND t.status IN ('pending', 'completed', 'failed', 'cancelled')
  AND t.created_at >= r.created_at - INTERVAL '1 hour'
  AND t.created_at <= r.created_at + INTERVAL '1 hour';

-- Verify the fix
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN request_id IS NOT NULL THEN 1 END) as with_request_id,
  COUNT(CASE WHEN request_id IS NULL THEN 1 END) as without_request_id
FROM public.transactions;
