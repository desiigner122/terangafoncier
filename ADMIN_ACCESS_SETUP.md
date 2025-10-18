## 🔐 **ADMIN ACCESS ISSUE: Non-Admin User**

**Error:** `❌ ACCÈS REFUSÉ: Utilisateur non-admin tenté d'accéder à /admin/marketing/leads`

**Root Cause:** The user trying to access the admin dashboard is not logged in with an admin account. The system checks:
- `profile.role === 'admin'` OR
- `profile.user_type === 'administrateur'`

Neither of these are set for the current user.

---

## ✅ SOLUTION: Create/Login with Admin Account

### **Option 1: Login with Existing Admin Account** (If You Have One)

1. Go to: https://www.terangafoncier.sn/login
2. Login with your **admin email and password**
3. System will check your profile and verify you're an admin
4. Then you can access: https://www.terangafoncier.sn/admin/dashboard/leads

### **Option 2: Create a New Admin User** (In Supabase)

If you don't have an admin account yet, follow these steps:

#### **Step 1: Create Auth User in Supabase**

1. Go to: Supabase Dashboard → Authentication → Users
2. Click **Add User**
3. Fill in:
   - Email: `admin@terangafoncier.sn` (or your choice)
   - Password: Create a strong password
4. Click **Create User**

#### **Step 2: Create Admin Profile in Database**

Go to: Supabase → SQL Editor → New Query

```sql
-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  user_type,
  role,
  full_name,
  display_name,
  is_active,
  email_verified,
  verification_status
) VALUES (
  'PASTE_USER_ID_HERE',  -- From Step 1, copy the user ID
  'admin@terangafoncier.sn',
  'Admin',
  'TerangaFoncier',
  'administrateur',
  'admin',
  'Admin TerangaFoncier',
  'Admin',
  true,
  true,
  'verified'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  user_type = 'administrateur',
  is_active = true;
```

#### **Step 3: How to Get the User ID**

1. In Supabase, go to Authentication → Users
2. Click on the user you just created
3. Copy the ID (it's a UUID like `06125976-5ea1-403a-b09e-aebbe1311111`)
4. Paste it in the SQL query above where it says `PASTE_USER_ID_HERE`

#### **Step 4: Verify It Worked**

Run this verification query:

```sql
SELECT id, email, role, user_type, is_active FROM public.profiles 
WHERE email = 'admin@terangafoncier.sn';
```

**Expected Output:**
```
id                                    | email                      | role  | user_type       | is_active
──────────────────────────────────────┼────────────────────────────┼───────┼─────────────────┼───────────
06125976-5ea1-403a-b09e-aebbe1311111  | admin@terangafoncier.sn    | admin | administrateur  | true
```

✅ If you see this, the admin profile is created!

#### **Step 5: Login with New Admin Account**

1. Go to: https://www.terangafoncier.sn/login
2. Use the email and password from Step 1
3. You should now be logged in as admin ✅

#### **Step 6: Access Admin Dashboard**

1. Go to: https://www.terangafoncier.sn/admin/dashboard/leads
2. Should load successfully with your admin credentials ✅

---

## 🔍 TROUBLESHOOTING

### **Still getting "ACCÈS REFUSÉ" after login?**

1. **Clear browser cache:**
   ```
   Ctrl+Shift+Delete
   ```

2. **Check your profile in Supabase:**
   ```sql
   SELECT id, email, role, user_type, is_active FROM public.profiles 
   WHERE email = 'YOUR_EMAIL_HERE';
   ```
   
   ✅ Must have:
   - `role = 'admin'`
   - `user_type = 'administrateur'` OR `user_type = 'admin'`
   - `is_active = true`

3. **Open browser console (F12 → Console tab)** and look for:
   ```
   🔐 AdminRoute CHECK: { role: 'admin', user_type: 'administrateur', isAdmin: true, pathname: '/admin/...' }
   ```
   
   If `isAdmin: false`, the profile isn't set correctly

### **Forgot Admin Password?**

1. Go to: https://www.terangafoncier.sn/forgot-password
2. Enter your admin email
3. Follow the reset link

---

## 📝 QUICK REFERENCE

**Admin User Requirements:**
- ✅ Must be authenticated (have a valid Supabase user)
- ✅ Profile must exist in `profiles` table
- ✅ Profile must have `role = 'admin'`
- ✅ Profile must have `user_type = 'administrateur'`
- ✅ Profile must have `is_active = true`

**Check These Fields:**
```sql
SELECT role, user_type, is_active FROM public.profiles 
WHERE id = 'YOUR_USER_ID';
```

---

## 🚀 NEXT STEPS

1. **Create admin user** (if needed) using steps above
2. **Login with admin account**
3. **Access admin dashboard** at `/admin/dashboard/leads`
4. **Test the contact form** (from the previous issue)
5. **Verify leads appear** in the admin dashboard

**Expected time:** 5-10 minutes ✅

---

## 📌 ADDITIONAL NOTES

### Other Errors You Saw (FYI)

You also had some schema errors:

1. **crm_contacts table not found** - This table doesn't exist or isn't being queried
2. **conversations foreign key error** - The relationship between `conversations` and `profiles` doesn't exist

These are separate from the admin auth issue. We can fix those after you have admin access confirmed.

---

**Ready to proceed? Follow the steps above and let me know when you're logged in as admin! 🎯**
