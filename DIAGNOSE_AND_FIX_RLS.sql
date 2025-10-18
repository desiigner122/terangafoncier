-- ========================================
-- DIAGNOSE & FIX: RLS Issues with marketing_leads
-- ========================================
-- Date: October 18, 2025
-- This script diagnoses the exact RLS policy issue and provides fixes

-- ========================================
-- STEP 1: CHECK CURRENT RLS POLICIES
-- ========================================
-- Run this first to see what policies currently exist
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

-- ========================================
-- STEP 2: CHECK RLS IS ENABLED
-- ========================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'marketing_leads';

-- Expected: rowsecurity = true

-- ========================================
-- STEP 3: CHECK TABLE PERMISSIONS
-- ========================================
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'marketing_leads'
ORDER BY grantee;

-- Expected: anon and authenticated should have privileges

-- ========================================
-- STEP 4: DISABLE RLS TEMPORARILY (DEBUG MODE)
-- ========================================
-- ⚠️ This will disable RLS entirely - for testing only!
-- Run this if you want to test if RLS is the only blocker

ALTER TABLE public.marketing_leads DISABLE ROW LEVEL SECURITY;

-- Test: Try to insert a lead
-- INSERT INTO public.marketing_leads (
--   full_name, email, phone, subject, message, source, status
-- ) VALUES (
--   'Test User', 'test@example.com', '+221770000000', 
--   'Test Subject', 'Test Message', 'website', 'new'
-- );

-- If it works with RLS disabled, the problem is the policies.
-- If it still fails, the problem is something else (permissions, table structure, etc.)

-- ========================================
-- STEP 5: RE-ENABLE RLS WITH CORRECT POLICIES
-- ========================================
-- Run this after confirming RLS is the issue

-- Enable RLS
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts for leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated inserts for leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated read leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated update leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated delete leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_insert" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_select" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_update" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_delete" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_read_for_all" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_insert_for_all" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_update_for_all" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow anyone to create leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated to read leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated to update leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated to delete leads" ON public.marketing_leads;

-- Create new policies - PERMISSIVE (allow, not restrict)

-- Policy 1: ANYONE can INSERT leads (for public contact form)
CREATE POLICY "policy_insert_leads_public"
  ON public.marketing_leads
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: ANYONE can SELECT/READ their own lead or all (no restriction)
CREATE POLICY "policy_select_leads_all"
  ON public.marketing_leads
  FOR SELECT
  USING (true);

-- Policy 3: AUTHENTICATED users can UPDATE leads
CREATE POLICY "policy_update_leads_auth"
  ON public.marketing_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: AUTHENTICATED users can DELETE leads
CREATE POLICY "policy_delete_leads_auth"
  ON public.marketing_leads
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- STEP 6: VERIFY POLICIES
-- ========================================
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

-- Expected result: 4 policies, all permissive=true

-- ========================================
-- STEP 7: GRANT PERMISSIONS (IMPORTANT!)
-- ========================================
-- Make sure anon and authenticated roles have permissions

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_leads TO anon, authenticated;

-- ========================================
-- STEP 8: TEST INSERT (RUN AS ANON USER)
-- ========================================
-- Note: This might not work in SQL editor, but should work from frontend
-- If this succeeds, your frontend should also succeed

BEGIN;

INSERT INTO public.marketing_leads (
  full_name,
  email,
  phone,
  subject,
  message,
  source,
  status,
  priority,
  category,
  urgency
) VALUES (
  'RLS Test User',
  'rls-test@example.com',
  '+221 77 593 42 41',
  'RLS Policy Test',
  'Testing if RLS policies allow inserts',
  'website',
  'new',
  'medium',
  'technical',
  'normal'
) RETURNING id, full_name, email, created_at;

COMMIT;

-- If you see a new row created with id, full_name, etc., then RLS is working!
