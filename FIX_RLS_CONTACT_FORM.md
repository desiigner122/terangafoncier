## 🔓 FIX: RLS Policy Error on Contact Form

**Error:** `new row violates row-level security policy for table "marketing_leads"`

**Root Cause:** The `marketing_leads` table has RLS (Row-Level Security) policies that block public/anonymous users from inserting leads. The contact form tries to create a new lead as an unauthenticated user, but the RLS policy rejects it.

---

## ✅ SOLUTION: Fix RLS Policies

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Click **SQL Editor**
3. Click **New Query**

### Step 2: Copy and Run the Fix Script

Copy the entire contents of `fix-marketing-leads-rls.sql` and paste into the SQL editor.

**Key Changes:**
- ✅ Enable RLS on `marketing_leads` table
- ✅ Drop any old conflicting policies
- ✅ Create new permissive policies:
  - **Anyone can INSERT leads** (essential for public contact form)
  - **Authenticated users can READ leads** (only admins see leads)
  - **Authenticated users can UPDATE leads** (admins manage leads)
  - **Authenticated users can DELETE leads** (admins delete old leads)

### Step 3: Verify the Policies

Run this verification query:

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'marketing_leads'
ORDER BY policyname;
```

**Expected Output:**
```
tablename          | policyname                    | permissive | roles
━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━┼━━━━━━
marketing_leads    | Allow anyone to create leads  | t         | {}
marketing_leads    | Allow authenticated to delete | t         | {authenticated}
marketing_leads    | Allow authenticated to read   | t         | {authenticated}
marketing_leads    | Allow authenticated to update | t         | {authenticated}
```

✅ You should see **4 policies** for `marketing_leads`

---

## 🧪 Test the Fix

### Test 1: Submit Contact Form

1. Go to your site: https://www.terangafoncier.sn/blockchain-contact
2. Fill out the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+221770000000`
   - Category: `Blockchain`
   - Urgency: `Normal`
   - Subject: `Test Lead`
   - Message: `This is a test`
3. Click **Send** button
4. Check the browser console (F12 → Console tab):
   - ❌ **Before Fix:** `❌ [MarketingService] Erreur createLead: Error: new row violates row-level security policy`
   - ✅ **After Fix:** `✅ [MarketingService] Lead créé avec succès: { id: ..., full_name: "Test User", ... }`

### Test 2: Verify in Admin Dashboard

1. Go to Admin Dashboard: https://www.terangafoncier.sn/admin/dashboard/leads
2. Login with admin account
3. You should see the new lead in the list
4. Click the **eye icon** to see all fields:
   - Name, Email, Phone, Subject, Message
   - Category, Urgency
   - Status, Priority, Date

✅ All fields should be visible in the details modal

---

## 📋 SQL Script Explanation

### What Each Policy Does

**Policy 1: "Allow anyone to create leads"**
```sql
CREATE POLICY "Allow anyone to create leads"
  ON public.marketing_leads
  FOR INSERT
  WITH CHECK (true);
```
- Allows **any user** (authenticated OR unauthenticated/anon)
- For **INSERT** operation only
- The public contact form needs this ✅

**Policy 2: "Allow authenticated to read leads"**
```sql
CREATE POLICY "Allow authenticated to read leads"
  ON public.marketing_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');
```
- Allows **only authenticated users** (logged-in admins)
- For **SELECT** (read) operations
- Prevents strangers from viewing other people's lead data ✅

**Policy 3 & 4: Update & Delete**
- Only authenticated admins can modify/delete leads
- Protects data integrity ✅

---

## 🚨 Troubleshooting

### If still getting RLS error after fix:

**Check 1: Verify RLS is Enabled**
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'marketing_leads';
```
Expected: `rowsecurity = true`

**Check 2: Verify All Policies**
```sql
SELECT policyname, permissive FROM pg_policies 
WHERE tablename = 'marketing_leads';
```
Should show 4 policies all with `permissive = true`

**Check 3: Check Table Owner**
```sql
SELECT 
  table_schema,
  table_name,
  table_owner
FROM information_schema.tables 
WHERE table_name = 'marketing_leads';
```

**Check 4: Test Policy Directly in SQL**
```sql
-- Test as anon user
INSERT INTO public.marketing_leads (
  full_name, email, phone, subject, message, source
) VALUES (
  'Test User', 'test@example.com', '+221770000000', 
  'Test', 'Testing RLS', 'website'
) RETURNING id, full_name, email;
```

---

## 📌 Prevention Tips

**To prevent RLS issues in the future:**

1. **Always test public forms** after changing RLS policies
2. **Document your policies** - add comments in SQL
3. **Use permissive policies** for public features
4. **Use restrictive policies** only when needed
5. **Test with both anon and authenticated** users
6. **Monitor error logs** for RLS violations

---

## 📞 Support

If you still have issues after applying this fix:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server (`npm run dev`)
3. Check Supabase Status: https://status.supabase.com
4. Verify internet connection

**Expected resolution time:** 2-3 minutes ✅
