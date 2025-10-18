## 🆘 URGENT: HTTP 401 + RLS Error - Complete Fix

**Current Error:**
```
HTTP/3 401 Unauthorized
new row violates row-level security policy for table "marketing_leads"
```

This means the Supabase client is sending the request, but it's being rejected due to RLS policies.

---

## 🚀 QUICK FIX (Follow These Steps)

### OPTION A: Nuclear Fix (Safest - Start with This)

**Step 1: Open Supabase SQL Editor**
- Go to: Supabase Dashboard → SQL Editor → New Query

**Step 2: Disable RLS Temporarily**
Run this single command:
```sql
ALTER TABLE public.marketing_leads DISABLE ROW LEVEL SECURITY;
```

**Step 3: Test the Contact Form**
- Submit a test lead via https://www.terangafoncier.sn/blockchain-contact
- Check console (F12) for success/error

**Step 4: Check Results**
- If it works: RLS was the problem ✅
- If it still fails: Problem is something else (we'll debug further)

---

### OPTION B: Proper Fix (After Confirming RLS is Issue)

**Step 1: Open Supabase SQL Editor**

**Step 2: Copy ALL contents of `DIAGNOSE_AND_FIX_RLS.sql`**
- This script:
  1. Checks current policies
  2. Checks if RLS is enabled
  3. Checks table permissions
  4. Re-enables RLS with correct policies
  5. Grants proper permissions to anon + authenticated
  6. Tests the insert

**Step 3: Paste and Run**

**Step 4: Look for this in the output:**
```
policy_insert_leads_public     | t
policy_select_leads_all        | t  
policy_update_leads_auth       | t
policy_delete_leads_auth       | t
```
✅ If you see 4 policies with `t` (true), it's fixed!

---

## 🔍 WHAT'S THE REAL PROBLEM?

The error shows:
1. **HTTP 401 Unauthorized** = Supabase says "I don't trust this request"
2. **RLS Policy Violation** = Even though we gave it credentials, the row-level security policies reject it

**Why?**
The `marketing_leads` table probably has RLS policies that look like:
```sql
-- BAD POLICY (too restrictive)
CREATE POLICY "restrictive"
  ON public.marketing_leads
  FOR INSERT
  USING (auth.uid() = auth.uid() AND auth.role() = 'authenticated');
```

This policy says: *"Only insert if user is authenticated"* - but the contact form is an anonymous user!

---

## 📋 THE THREE SCENARIOS

### Scenario 1: You Ran the Old Fix Script
If you already ran `fix-marketing-leads-rls.sql`:
- ✅ You have policies
- ❓ But they might not be working
- **Action:** Run `DIAGNOSE_AND_FIX_RLS.sql` (it has better policies)

### Scenario 2: You Haven't Run Anything
- ❌ RLS policies might be old/wrong
- **Action:** Run `DIAGNOSE_AND_FIX_RLS.sql` (start with this)

### Scenario 3: RLS is Disabled
- ❌ Other problems exist (permissions, schema, etc.)
- **Action:** We'll need to debug further

---

## 🧪 THE DEBUG PROCESS (IF YOU'RE STUCK)

### Step 1: Check Current Policies
```sql
SELECT policyname, permissive FROM pg_policies 
WHERE tablename = 'marketing_leads';
```

**If you see NOTHING:**
→ RLS is disabled or no policies exist
→ Run the full `DIAGNOSE_AND_FIX_RLS.sql`

**If you see policies:**
→ Write down their names and what they do
→ Check if "INSERT" policy has `WITH CHECK (true)`

### Step 2: Check RLS Status
```sql
SELECT rowsecurity FROM pg_tables 
WHERE tablename = 'marketing_leads';
```

**If `false`:**
→ RLS is disabled (might be why form works in SQL but not frontend)
→ Enable it and add policies

**If `true`:**
→ RLS is enabled, we need to fix the policies

### Step 3: Check Permissions
```sql
SELECT grantee, privilege_type FROM information_schema.table_privileges
WHERE table_name = 'marketing_leads';
```

**Expected to see:**
- `anon` - SELECT, INSERT, UPDATE, DELETE
- `authenticated` - SELECT, INSERT, UPDATE, DELETE

**If missing:**
→ Run the GRANT commands from `DIAGNOSE_AND_FIX_RLS.sql`

---

## ⚡ THE MAGIC POLICY (Copy This)

This is what should work:

```sql
-- Allow ANYONE (anon + authenticated) to INSERT
CREATE POLICY "anyone_can_insert"
  ON public.marketing_leads
  FOR INSERT
  WITH CHECK (true);  -- ← This "true" is KEY! No restrictions!

-- Allow ANYONE to SELECT
CREATE POLICY "anyone_can_select"
  ON public.marketing_leads
  FOR SELECT
  USING (true);  -- ← No restrictions!

-- Only authenticated can UPDATE
CREATE POLICY "auth_can_update"
  ON public.marketing_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated can DELETE
CREATE POLICY "auth_can_delete"
  ON public.marketing_leads
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

The KEY difference: `WITH CHECK (true)` = no restrictions!

---

## ✅ HOW TO KNOW IT'S FIXED

### Test 1: Console Success
Go to https://www.terangafoncier.sn/blockchain-contact
Fill form and submit
Press F12 → Console tab
Look for:
```
✅ [MarketingService] Lead créé avec succès: { id: "...", full_name: "Test User", ... }
```

### Test 2: Admin Dashboard
Go to Admin Dashboard → Leads
See the new lead in the list
Click eye icon → See all fields

### Test 3: Supabase Verification
In Supabase → Table Editor → marketing_leads
See the new row with all data

---

## 🚨 IF YOU'RE STILL STUCK

After running the SQL fixes, if the form STILL doesn't work:

1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Restart dev server:** 
   ```powershell
   npm run dev
   ```
3. **Check for multiple Supabase clients:**
   ```
   grep -r "createClient" src/
   ```
   Should only find it in `src/lib/supabaseClient.js`

4. **Check environment variables:**
   ```
   Get-Content .env | Select-String SUPABASE
   ```
   Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be present

---

## 📞 NEXT STEPS

1. **Try OPTION A first** (disable RLS to test)
2. **If it works:** Run `DIAGNOSE_AND_FIX_RLS.sql` for permanent fix
3. **If it fails:** Run diagnostics from "The Debug Process" section above
4. **Tell me the results** and I'll provide next fix

**Expected time to resolution:** 5-10 minutes ✅
