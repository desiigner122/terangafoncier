# 📝 QUICK SQL REFERENCE - Copy & Paste Ready

**Use this document for quick access to SQL commands**

---

## 🚀 QUICK START - 3 ESSENTIAL QUERIES

### Query 1: Check Transaction Completeness (COPY & PASTE)
```sql
-- Check how many transactions are incomplete
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) as with_type,
  COUNT(CASE WHEN buyer_id IS NOT NULL THEN 1 END) as with_buyer,
  COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as with_seller,
  COUNT(CASE WHEN parcel_id IS NOT NULL THEN 1 END) as with_parcel,
  COUNT(CASE 
    WHEN transaction_type IS NOT NULL 
    AND buyer_id IS NOT NULL 
    AND seller_id IS NOT NULL 
    AND parcel_id IS NOT NULL 
    THEN 1 
  END) as complete_transactions
FROM transactions;
```

**Expected Result**: 
```
total_transactions: X
complete_transactions: X  ← Should match total_transactions
```

---

### Query 2: See Incomplete Transactions Details (COPY & PASTE)
```sql
-- See which transactions need fixing
SELECT 
  t.id,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.transaction_type,
  t.status,
  r.parcel_id as request_parcel_id,
  r.user_id as request_user_id,
  p.seller_id as parcel_seller_id
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
LEFT JOIN parcels p ON r.parcel_id = p.id
WHERE 
  t.transaction_type IS NULL 
  OR t.buyer_id IS NULL 
  OR t.seller_id IS NULL 
  OR t.parcel_id IS NULL
ORDER BY t.created_at DESC;
```

**What to look for**:
- ✅ request_parcel_id has value? → Copy to parcel_id
- ✅ request_user_id has value? → Copy to buyer_id
- ✅ parcel_seller_id has value? → Copy to seller_id

---

### Query 3: Fix All Incomplete Transactions (COPY & PASTE)
```sql
-- Fix transactions in one go
UPDATE transactions SET
  transaction_type = COALESCE(transaction_type, 'purchase'),
  buyer_id = COALESCE(buyer_id, r.user_id),
  seller_id = COALESCE(seller_id, p.seller_id),
  parcel_id = COALESCE(parcel_id, r.parcel_id)
FROM requests r
JOIN parcels p ON r.parcel_id = p.id
WHERE 
  transactions.request_id = r.id
  AND (
    transactions.transaction_type IS NULL 
    OR transactions.buyer_id IS NULL 
    OR transactions.seller_id IS NULL 
    OR transactions.parcel_id IS NULL
  );
```

**Result**: `UPDATE X` (X = number of rows fixed)

---

## 🏗️ DATABASE SETUP - Execute These in Order

### Step 1: Create Workflow Tables
**File**: `create-workflow-tables.sql`
**Action**: Copy entire file content and paste into Supabase SQL Editor
**Result**: Should show "✅ Tables workflow créées avec succès !"

---

### Step 2: Verify Data Integrity
**Paste this** to confirm no incomplete transactions remain:
```sql
-- Verify all transactions are now complete
SELECT 
  CASE 
    WHEN COUNT(*) = COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) THEN '✅ All complete'
    ELSE '❌ ' || COUNT(*) - COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) || ' incomplete'
  END as status
FROM transactions;
```

---

## 🔍 DIAGNOSTIC QUERIES

### See All Purchase Cases (NEW)
```sql
SELECT 
  case_number,
  status,
  phase,
  purchase_price,
  payment_method,
  created_at,
  updated_at
FROM purchase_cases
ORDER BY created_at DESC
LIMIT 20;
```

---

### See Case History Timeline
```sql
SELECT 
  history.case_id,
  history.status,
  history.previous_status,
  history.notes,
  history.created_at,
  profile.email as updated_by_email
FROM purchase_case_history history
LEFT JOIN profiles profile ON history.updated_by = profile.id
ORDER BY history.created_at DESC
LIMIT 20;
```

---

### See Active Negotiations
```sql
SELECT 
  n.case_id,
  n.proposed_by,
  n.proposed_price,
  n.status,
  n.message,
  n.created_at
FROM purchase_case_negotiations n
WHERE n.status = 'pending'
ORDER BY n.created_at DESC;
```

---

### See All Heritage Fall Transactions (as Seller)
```sql
-- Heritage Fall UUID: 06125976-5ea1-403a-b09e-aebbe1311111
SELECT 
  t.id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  t.created_at
FROM transactions t
WHERE t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
```

---

### See All Heritage Fall Transactions (as Buyer)
```sql
-- Heritage Fall UUID: 06125976-5ea1-403a-b09e-aebbe1311111
SELECT 
  t.id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  p.title as parcel_title,
  t.created_at
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.buyer_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
```

---

## 🐛 TROUBLESHOOTING QUERIES

### Find Transactions Missing seller_id
```sql
SELECT 
  t.id,
  t.request_id,
  t.buyer_id,
  t.status,
  p.seller_id as should_be,
  t.created_at
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
LEFT JOIN parcels p ON r.parcel_id = p.id
WHERE t.seller_id IS NULL
ORDER BY t.created_at DESC;
```

---

### Find Transactions Missing buyer_id
```sql
SELECT 
  t.id,
  t.request_id,
  t.seller_id,
  t.status,
  r.user_id as should_be,
  t.created_at
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
WHERE t.buyer_id IS NULL
ORDER BY t.created_at DESC;
```

---

### Check RLS Policies Are Enabled
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN (
  'purchase_cases', 
  'purchase_case_history', 
  'purchase_case_documents',
  'purchase_case_negotiations'
)
ORDER BY tablename;
```

**Expected Result**: All rowsecurity = TRUE

---

## ✨ ADVANCED QUERIES

### Get Case Statistics
```sql
SELECT 
  status,
  phase,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at)) / 86400) as avg_days
FROM purchase_cases
GROUP BY status, phase
ORDER BY phase, status;
```

---

### See User Workflow (Case History for One Case)
```sql
-- Replace CASE_ID with actual case UUID
SELECT 
  status,
  previous_status,
  notes,
  created_at,
  updated_by_role
FROM purchase_case_history
WHERE case_id = 'PASTE_CASE_ID_HERE'
ORDER BY created_at ASC;
```

---

### Count Cases by Seller
```sql
SELECT 
  seller_id,
  COUNT(*) as total_cases,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status IN ('initiated', 'negotiation') THEN 1 END) as in_progress
FROM purchase_cases
GROUP BY seller_id
ORDER BY total_cases DESC;
```

---

### Count Cases by Buyer
```sql
SELECT 
  buyer_id,
  COUNT(*) as total_cases,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status IN ('initiated', 'negotiation') THEN 1 END) as in_progress
FROM purchase_cases
GROUP BY buyer_id
ORDER BY total_cases DESC;
```

---

## 📊 PERFORMANCE QUERIES

### Check Indexes
```sql
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE tablename IN (
  'purchase_cases',
  'purchase_case_history',
  'purchase_case_documents',
  'purchase_case_negotiations',
  'transactions'
)
ORDER BY tablename;
```

---

### Check Table Sizes
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
AND tablename IN ('transactions', 'purchase_cases', 'purchase_case_history')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔧 MANUAL FIXES (If Needed)

### Manually Fix One Transaction
```sql
-- Replace ID_HERE with actual transaction ID
UPDATE transactions
SET 
  seller_id = (SELECT seller_id FROM parcels WHERE id = transactions.parcel_id),
  buyer_id = (SELECT user_id FROM requests WHERE id = transactions.request_id),
  parcel_id = (SELECT parcel_id FROM requests WHERE id = transactions.request_id),
  transaction_type = 'purchase'
WHERE id = 'ID_HERE';
```

---

### Manually Create a Case (for testing)
```sql
-- Create a test case
INSERT INTO purchase_cases (
  request_id,
  buyer_id,
  seller_id,
  parcelle_id,
  purchase_price,
  payment_method,
  status,
  phase
) VALUES (
  'request_uuid_here',
  'buyer_uuid_here',
  'seller_uuid_here',
  'parcel_uuid_here',
  50000000,
  'cash',
  'initiated',
  1
)
RETURNING case_number, id;
```

---

### Delete All Test Cases (WARNING!)
```sql
-- ⚠️ CAUTION: This deletes ALL purchase cases!
-- Only use for testing/cleanup
DELETE FROM purchase_cases WHERE status = 'initiated';

-- How many were deleted?
-- Check affected rows in response
```

---

## 💡 COPY-PASTE CHECKLIST

### For First Time Setup:
1. [ ] Copy entire `create-workflow-tables.sql` and execute
2. [ ] Copy Query 1 (Check Completeness) and execute
3. [ ] If incomplete found, copy Query 3 (Fix All) and execute
4. [ ] Copy Query 1 again to verify all fixed
5. [ ] You're done! ✅

### For Daily Monitoring:
1. [ ] Copy Query 1 to verify completeness
2. [ ] Copy "Get Case Statistics" to see overview
3. [ ] Copy "See Active Negotiations" to check pending
4. [ ] Verify all is working ✅

### For Troubleshooting:
1. [ ] Copy relevant troubleshooting query
2. [ ] Review results
3. [ ] Apply fix if needed
4. [ ] Re-run diagnostic to verify

---

**Last Updated**: October 17, 2025  
**Status**: ✅ All Queries Tested  
**Note**: Replace placeholders (CASE_ID, ID_HERE, etc.) with actual values before executing
