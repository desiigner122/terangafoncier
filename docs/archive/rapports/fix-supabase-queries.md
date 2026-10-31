# 🔧 FIX: Supabase REST API Relationship Errors

## Problem
❌ Supabase REST API does NOT support nested relationships to `auth.users` table

```sql
-- WRONG - REST API Can't Resolve This
SELECT *, user:user_id(id, email, raw_user_meta_data)
FROM purchase_case_participants
```

Error:
```
"Could not find a relationship between 'purchase_case_participants' and 'user_id' in the schema cache"
```

## Root Cause
1. `user_id` references `auth.users` (not in public schema)
2. `raw_user_meta_data` doesn't exist (should be `user_metadata`)
3. REST API relationships only work within public schema tables

## Solution
Query tables separately, then join in application code:

### ✅ CORRECT APPROACH

**Step 1: Query participants (no auth relationships)**
```javascript
const { data: participants } = await supabase
  .from('purchase_case_participants')
  .select('*')
  .eq('case_id', caseId)
```

**Step 2: Query user profiles separately**
```javascript
const { data: profiles } = await supabase
  .from('profiles')
  .select('id, email, full_name, user_type')
  .in('id', participantUserIds)
```

**Step 3: Join in app code**
```javascript
const enriched = participants.map(p => ({
  ...p,
  user: profiles.find(pr => pr.id === p.user_id)
}))
```

## Files Using Wrong Syntax

### 1. Files That Already Use Correct Syntax ✅
- `src/services/AdvancedCaseTrackingService.js` - GOOD
- `src/services/SellerAcceptanceService.js` - GOOD
- `src/pages/dashboards/particulier/RefactoredParticulierCaseTracking.jsx` - GOOD
- `src/pages/dashboards/vendeur/RefactoredVendeurCaseTracking.jsx` - GOOD

### 2. Root Cause of Errors

The `purchase_case_participants` table references `auth.users` which:
- Exists in Supabase `auth` schema (not public)
- Can't be automatically joined via REST API
- Needs manual query + join

## How to Fix

### Option A: Use Profiles Table
Create a denormalized `user_info` in `purchase_case_participants`:

```sql
ALTER TABLE purchase_case_participants ADD COLUMN (
  user_email TEXT,
  user_full_name TEXT
);
```

Store this info when adding participants.

### Option B: Query Separately (Recommended)

All our services already do this! The issue is elsewhere.

## Actual Problem

Looking at the error more carefully:
```
Error fetching participants from:
https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/purchase_case_participants
?select=*,user:user_id(id,email,raw_user_meta_data)
```

**This query is coming from somewhere else** - not our new services!

### Search for this query pattern:
```bash
grep -r "user:user_id" src/
grep -r "raw_user_meta_data" src/
```

## Next Steps

1. ✅ Verify all new services use correct queries (DONE)
2. ⏳ Find legacy code making wrong queries
3. ⏳ Replace with correct queries
4. ⏳ Test without errors

