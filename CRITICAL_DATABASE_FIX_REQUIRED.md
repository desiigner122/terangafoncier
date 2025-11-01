# 🚨 CRITICAL: Manual Database Fix Required

## Status
**The database constraint fixing migrations have NOT been properly applied to production.**

Testing reveals the `requests.status` constraint currently only accepts: `('pending', 'rejected', 'completed')`

But the application code needs: `('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'negotiation', 'completed', 'on_hold')`

This is why the "Accept Offer" workflow fails with error code 23514 (CHECK constraint violation).

## Root Cause
Migrations were created and marked as "applied" in Supabase history, but the actual SQL was never executed on the remote database.

Migration files created:
- ✅ `20251021120000_fix_constraints_and_service_layer.sql`
- ✅ `20251021_critical_fixes.sql`
- ✅ `20251021160000_fix_requests_status_constraint_urgent.sql`

Status: Marked as applied in history, but SQL NOT executed on production database.

## Solution: Execute SQL Manually in Supabase Dashboard

### Step 1: Open Supabase Dashboard
1. Go to: https://app.supabase.com/projects
2. Select the "Teranga Foncier" project (ndenqikcogzrkrjnlvns)
3. Go to "SQL Editor" (sidebar menu)

### Step 2: Create a new query
Click the "+ New query" button

### Step 3: Copy and paste this SQL:

```sql
-- Fix requests table status constraint
ALTER TABLE public.requests
DROP CONSTRAINT IF EXISTS requests_status_check;

ALTER TABLE public.requests
ADD CONSTRAINT requests_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'negotiation', 'completed', 'on_hold'));

-- Fix purchase_cases table status constraint
ALTER TABLE public.purchase_cases
DROP CONSTRAINT IF EXISTS purchase_cases_status_check;

ALTER TABLE public.purchase_cases
ADD CONSTRAINT purchase_cases_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'completed', 'on_hold', 'preliminary_agreement', 'contract_preparation', 'buyer_verification', 'seller_accepted', 'negotiation'));

-- Fix transactions table
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'accepted'));
```

### Step 4: Execute the query
Click the "Run" button (or press Ctrl+Enter)

### Step 5: Verify success
You should see: "Success. No rows returned."

### Step 6: Test the fix
Run this query to confirm 'accepted' is now allowed:

```sql
-- Test that 'accepted' status is now allowed
INSERT INTO public.requests (id, status, created_at) 
VALUES ('00000000-0000-0000-0000-999999999999', 'accepted', now())
RETURNING status;

-- Clean up test data
DELETE FROM public.requests WHERE id = '00000000-0000-0000-0000-999999999999';
```

If you see the INSERT succeed (with status 'accepted'), the fix is complete!

## After Fix
Once the SQL has been executed:
1. ✅ The purchase workflow "Accept Offer" button will work
2. ✅ Case statuses can transition properly
3. ✅ Messages will be sent correctly
4. ✅ All 6 critical issues will be resolved

## Questions?
The issue occurs because Supabase requires direct SQL execution for constraint changes, which cannot be automated via the REST API. This is a security feature.

Reference: Constraint violations discovered via testing with error code: 23514
